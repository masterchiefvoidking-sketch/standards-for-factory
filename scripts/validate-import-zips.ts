#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AdmZip from "adm-zip";
import { loadPackage } from "../src/load-package.js";
import { validateCertificationPackage } from "../src/validator.js";
import { REQUIRED_FILES, OPTIONAL_FILES } from "../src/types.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMPORTS = path.join(ROOT, "imports");

interface ZipRow {
  path: string;
  pass: boolean;
  score: number | null;
  tenantId: string | null;
  missingFiles: string[];
  nextFix: string | null;
  folderPath: string | null;
  folderDiffers: boolean | null;
  folderPass: boolean | null;
  recommendedAction: string;
}

function findZips(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findZips(full));
    } else if (entry.name.endsWith("-factory-certification.zip")) {
      results.push(full);
    }
  }
  return results.sort();
}

function listZipEntries(zipPath: string): string[] {
  const zip = new AdmZip(zipPath);
  return zip
    .getEntries()
    .map((e) => e.entryName.replace(/\/$/, ""))
    .filter(Boolean)
    .sort();
}

function listFolderPackageFiles(folderPath: string): string[] {
  return [...REQUIRED_FILES, ...OPTIONAL_FILES]
    .filter((f) => fs.existsSync(path.join(folderPath, f)))
    .sort();
}

function siblingFolder(zipPath: string): string | null {
  const dir = path.dirname(zipPath);
  const base = path.basename(zipPath, ".zip");
  const tenantSlug = base.replace(/-factory-certification$/, "");
  const candidate = path.join(dir, tenantSlug);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    const hasManifest = fs.existsSync(
      path.join(candidate, "factory-manifest.json")
    );
    if (hasManifest) return candidate;
  }
  if (
    fs.existsSync(dir) &&
    fs.existsSync(path.join(dir, "factory-manifest.json"))
  ) {
    return dir;
  }
  return null;
}

function foldersDiffer(zipPath: string, folderPath: string): boolean {
  const zipFiles = listZipEntries(zipPath);
  const folderFiles = listFolderPackageFiles(folderPath);
  if (zipFiles.join("|") !== folderFiles.join("|")) return true;

  for (const file of zipFiles) {
    if (!file.endsWith(".json") && file !== "factory-report.md") continue;
    const zip = new AdmZip(zipPath);
    const entry = zip.getEntry(file);
    if (!entry) return true;
    const zipText = entry.getData().toString("utf-8");
    const folderText = fs.readFileSync(path.join(folderPath, file), "utf-8");
    if (zipText !== folderText) return true;
  }
  return false;
}

function validatePath(targetPath: string): {
  pass: boolean;
  score: number;
  tenantId: string | null;
  missingFiles: string[];
  nextFix: string | null;
} {
  const contents = loadPackage(targetPath);
  try {
    const report = validateCertificationPackage(contents);
    return {
      pass: report.pass,
      score: report.scores.overall,
      tenantId: report.tenantId,
      missingFiles: report.missingFiles,
      nextFix: report.nextRequiredFix,
    };
  } finally {
    contents.cleanup?.();
  }
}

function buildRows(): ZipRow[] {
  const rows: ZipRow[] = [];

  for (const zipPath of findZips(IMPORTS)) {
    const rel = path.relative(ROOT, zipPath);
    const zipResult = validatePath(zipPath);
    const folderPath = siblingFolder(zipPath);
    let folderDiffers: boolean | null = null;
    let folderPass: boolean | null = null;

    if (folderPath) {
      folderDiffers = foldersDiffer(zipPath, folderPath);
      const folderResult = validatePath(folderPath);
      folderPass = folderResult.pass;
    }

    let recommendedAction = "No action";
    if (!zipResult.pass) {
      if (folderPath && folderPass) {
        recommendedAction =
          "Regenerate zip from extracted folder via npm run package:certification";
      } else if (rel.includes("horizon")) {
        recommendedAction =
          "Intentional failing reference — regenerate from examples/horizon after schema updates";
      } else {
        recommendedAction =
          "Update source folder artifacts, validate folder PASS, then regenerate zip";
      }
    } else if (folderDiffers) {
      recommendedAction = "Zip in sync after regeneration — verify folder matches";
    }

    rows.push({
      path: rel,
      pass: zipResult.pass,
      score: zipResult.score,
      tenantId: zipResult.tenantId,
      missingFiles: zipResult.missingFiles,
      nextFix: zipResult.nextFix,
      folderPath: folderPath ? path.relative(ROOT, folderPath) : null,
      folderDiffers,
      folderPass,
      recommendedAction,
    });
  }

  return rows;
}

function toMarkdown(rows: ZipRow[]): string {
  const generatedAt = new Date().toISOString();
  const lines: string[] = [
    "# Zip Validation Report",
    "",
    `**Generated:** ${generatedAt}  `,
    `**Command:** \`npm run validate:zips\``,
    "",
    "## Summary",
    "",
    `| Metric | Count |`,
    `|--------|-------|`,
    `| Total zips | ${rows.length} |`,
    `| PASS | ${rows.filter((r) => r.pass).length} |`,
    `| FAIL | ${rows.filter((r) => !r.pass).length} |`,
    "",
    "## Per-zip results",
    "",
    "| Zip | Pass | Score | Tenant | Extracted folder | Folder PASS | Differs from folder | Next fix | Recommended action |",
    "|-----|------|-------|--------|------------------|-------------|---------------------|----------|-------------------|",
  ];

  for (const row of rows) {
    lines.push(
      `| \`${row.path}\` | ${row.pass ? "PASS" : "FAIL"} | ${row.score ?? "—"} | ${row.tenantId ?? "—"} | ${row.folderPath ?? "—"} | ${row.folderPass === null ? "—" : row.folderPass ? "PASS" : "FAIL"} | ${row.folderDiffers === null ? "—" : row.folderDiffers ? "yes" : "no"} | ${row.nextFix ?? "—"} | ${row.recommendedAction} |`
    );
  }

  lines.push("", "## Missing files", "");
  for (const row of rows) {
    if (!row.missingFiles.length) continue;
    lines.push(`- **${row.path}:** ${row.missingFiles.join(", ")}`);
  }

  lines.push("", "---", "", "*Auto-generated by scripts/validate-import-zips.ts*");
  return lines.join("\n");
}

function main(): void {
  const rows = buildRows();
  const outPath = path.join(ROOT, "docs/repair/ZIP_VALIDATION_REPORT.md");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${toMarkdown(rows)}\n`);
  console.log(`Wrote ${path.relative(ROOT, outPath)}`);
  console.log(
    `PASS: ${rows.filter((r) => r.pass).length}/${rows.length} zips`
  );

  if (rows.some((r) => !r.pass && !r.path.includes("horizon"))) {
    process.exit(1);
  }
}

main();
