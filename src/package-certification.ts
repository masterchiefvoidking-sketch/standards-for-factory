import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import AdmZip from "adm-zip";
import {
  OPTIONAL_FILES,
  REQUIRED_FILES,
  type ValidationIssue,
} from "./types.js";

export interface PackageCertificationOptions {
  /** Directory containing certification artifacts */
  sourceDir: string;
  /** Output directory for zip (defaults to sourceDir parent) */
  outputDir?: string;
  /** Create folder copy instead of zip */
  folderOnly?: boolean;
}

export interface PackageCertificationResult {
  success: boolean;
  tenantId: string | null;
  packagePath: string;
  issues: ValidationIssue[];
}

interface ManifestShape {
  tenant?: { id?: string; slug?: string };
}

interface TenantIdFile {
  tenantId?: string;
}

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

export function prePackageChecks(sourceDir: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const file of REQUIRED_FILES) {
    const filePath = path.join(sourceDir, file);
    if (!fs.existsSync(filePath)) {
      issues.push({
        code: "package.missing-required",
        severity: "error",
        message: `Required file missing: ${file}`,
        file,
      });
    } else if (file.endsWith(".md") && !fs.readFileSync(filePath, "utf-8").trim()) {
      issues.push({
        code: "package.empty-report",
        severity: "error",
        message: "factory-report.md is empty",
        file,
      });
    }
  }

  const manifestPath = path.join(sourceDir, "factory-manifest.json");
  const manifest = fs.existsSync(manifestPath)
    ? readJson<ManifestShape>(manifestPath)
    : null;
  const tenantId = manifest?.tenant?.id ?? null;

  if (!tenantId) {
    issues.push({
      code: "package.missing-tenant-id",
      severity: "error",
      message: "factory-manifest.json missing tenant.id",
      file: "factory-manifest.json",
    });
    return issues;
  }

  const tenantIdFiles = [
    "factory-audit.json",
    "factory-health.json",
    "factory-qualification.json",
    "factory-citadel-archive.json",
  ];

  for (const file of tenantIdFiles) {
    const filePath = path.join(sourceDir, file);
    if (!fs.existsSync(filePath)) continue;
    const data = readJson<TenantIdFile>(filePath);
    if (data?.tenantId && data.tenantId !== tenantId) {
      issues.push({
        code: "package.tenant-mismatch",
        severity: "error",
        message: `tenantId "${data.tenantId}" does not match manifest "${tenantId}"`,
        file,
      });
    }
  }

  return issues;
}

function zipWithAdmZip(sourceDir: string, zipPath: string): void {
  const zip = new AdmZip();
  const entries = [
    ...REQUIRED_FILES,
    ...OPTIONAL_FILES.filter((f) => fs.existsSync(path.join(sourceDir, f))),
  ];

  for (const name of entries) {
    const filePath = path.join(sourceDir, name);
    if (fs.existsSync(filePath)) {
      zip.addLocalFile(filePath, "");
    }
  }

  zip.writeZip(zipPath);
}

function zipWithCli(sourceDir: string, zipPath: string): void {
  const names = [
    ...REQUIRED_FILES,
    ...OPTIONAL_FILES.filter((f) =>
      fs.existsSync(path.join(sourceDir, f))
    ),
  ];
  const cwd = sourceDir;
  execSync(`zip -q -r ${JSON.stringify(zipPath)} ${names.map((n) => JSON.stringify(n)).join(" ")}`, {
    cwd,
  });
}

export function packageCertification(
  options: PackageCertificationOptions
): PackageCertificationResult {
  const sourceDir = path.resolve(options.sourceDir);
  const issues = prePackageChecks(sourceDir);
  const errors = issues.filter((i) => i.severity === "error");

  const manifest = readJson<ManifestShape>(
    path.join(sourceDir, "factory-manifest.json")
  );
  const tenantId = manifest?.tenant?.id ?? manifest?.tenant?.slug ?? null;
  const slug = manifest?.tenant?.slug ?? tenantId ?? "unknown";
  const zipName = `${slug}-factory-certification.zip`;
  const outputDir = path.resolve(options.outputDir ?? sourceDir);
  fs.mkdirSync(outputDir, { recursive: true });

  if (errors.length > 0) {
    return {
      success: false,
      tenantId,
      packagePath: path.join(outputDir, zipName),
      issues,
    };
  }

  if (options.folderOnly) {
    const folderPath = path.join(outputDir, `${slug}-factory-certification`);
    fs.mkdirSync(folderPath, { recursive: true });
    const allFiles = [
      ...REQUIRED_FILES,
      ...OPTIONAL_FILES.filter((f) =>
        fs.existsSync(path.join(sourceDir, f))
      ),
    ];
    for (const name of allFiles) {
      fs.copyFileSync(
        path.join(sourceDir, name),
        path.join(folderPath, name)
      );
    }
    return {
      success: true,
      tenantId,
      packagePath: folderPath,
      issues,
    };
  }

  const zipPath = path.join(outputDir, zipName);
  try {
    zipWithAdmZip(sourceDir, zipPath);
  } catch {
    zipWithCli(sourceDir, zipPath);
  }

  return {
    success: true,
    tenantId,
    packagePath: zipPath,
    issues,
  };
}

export const KIT_REQUIRED_PATHS = [
  "tenant-certification-kit/README.md",
  "tenant-certification-kit/prompts/TENANT_CERTIFICATION_PROMPT.md",
  "tenant-certification-kit/prompts/TENANT_REPAIR_PROMPT.md",
  "tenant-certification-kit/prompts/TENANT_REQUALIFICATION_PROMPT.md",
  "tenant-certification-kit/templates/factory-manifest.json",
  "tenant-certification-kit/templates/factory-audit.json",
  "tenant-certification-kit/templates/factory-health.json",
  "tenant-certification-kit/templates/factory-qualification.json",
  "tenant-certification-kit/templates/factory-report.md",
  "tenant-certification-kit/templates/factory-citadel-archive.json",
  "tenant-certification-kit/scripts/package-certification.ts",
] as const;

export function checkKitLayout(repoRoot: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const rel of KIT_REQUIRED_PATHS) {
    const full = path.join(repoRoot, rel);
    if (!fs.existsSync(full)) {
      issues.push({
        code: "kit.missing",
        severity: "error",
        message: `Missing kit file: ${rel}`,
      });
    }
  }
  return issues;
}
