#!/usr/bin/env node
/**
 * Standalone certification packager for tenant repos.
 * Copy tenant-certification-kit/ into your repo and run:
 *   npx tsx tenant-certification-kit/scripts/package-certification.ts factory-certification
 *
 * Requires: Node 18+, zip CLI or adm-zip (npm install adm-zip)
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const REQUIRED = [
  "factory-manifest.json",
  "factory-audit.json",
  "factory-health.json",
  "factory-qualification.json",
  "factory-report.md",
] as const;

const OPTIONAL = [
  "factory-events.json",
  "factory-objects.json",
  "factory-citadel-archive.json",
] as const;

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

function prePackageChecks(sourceDir: string): string[] {
  const errors: string[] = [];

  for (const file of REQUIRED) {
    const p = path.join(sourceDir, file);
    if (!fs.existsSync(p)) {
      errors.push(`Missing required file: ${file}`);
    } else if (file.endsWith(".md") && !fs.readFileSync(p, "utf-8").trim()) {
      errors.push(`Empty file: ${file}`);
    }
  }

  const manifest = readJson<{ tenant?: { id?: string } }>(
    path.join(sourceDir, "factory-manifest.json")
  );
  const tenantId = manifest?.tenant?.id;
  if (!tenantId) {
    errors.push("factory-manifest.json missing tenant.id");
    return errors;
  }

  for (const file of [
    "factory-audit.json",
    "factory-health.json",
    "factory-qualification.json",
    "factory-citadel-archive.json",
  ]) {
    const p = path.join(sourceDir, file);
    if (!fs.existsSync(p)) continue;
    const data = readJson<{ tenantId?: string }>(p);
    if (data?.tenantId && data.tenantId !== tenantId) {
      errors.push(`${file}: tenantId "${data.tenantId}" != manifest "${tenantId}"`);
    }
  }

  return errors;
}

async function createZip(sourceDir: string, zipPath: string): Promise<void> {
  const names = [
    ...REQUIRED,
    ...OPTIONAL.filter((f) => fs.existsSync(path.join(sourceDir, f))),
  ];

  try {
    const mod = await import("adm-zip");
    const AdmZip = mod.default;
    const zip = new AdmZip();
    for (const name of names) {
      zip.addLocalFile(path.join(sourceDir, name), "");
    }
    zip.writeZip(zipPath);
    return;
  } catch {
    // adm-zip not installed — use system zip
  }

  execSync(
    `zip -q -r ${JSON.stringify(zipPath)} ${names.map((n) => JSON.stringify(n)).join(" ")}`,
    { cwd: sourceDir }
  );
}

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const sourceArg = args[0] ?? "factory-certification";
  const sourceDir = path.resolve(process.cwd(), sourceArg);
  const outputDir = args[1]
    ? path.resolve(process.cwd(), args[1])
    : sourceDir;

  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  const errors = prePackageChecks(sourceDir);
  if (errors.length > 0) {
    console.error("Pre-package checks failed:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  const manifest = readJson<{ tenant?: { id?: string; slug?: string } }>(
    path.join(sourceDir, "factory-manifest.json")
  );
  const slug = manifest?.tenant?.slug ?? manifest?.tenant?.id ?? "unknown";
  const zipName = `${slug}-factory-certification.zip`;
  const zipPath = path.join(outputDir, zipName);

  await createZip(sourceDir, zipPath);

  console.log(`Package created: ${zipPath}`);
  console.log(`Tenant: ${manifest?.tenant?.id ?? slug}`);
  console.log("");
  console.log("Next steps:");
  console.log(`  1. Copy to factory-standards/imports/${slug}/`);
  console.log(`  2. cd factory-standards && npm run validate:package -- imports/${slug}`);
  console.log("  3. If FAIL, use tenant-certification-kit/prompts/TENANT_REPAIR_PROMPT.md");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
