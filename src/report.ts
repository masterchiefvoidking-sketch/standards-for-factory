import fs from "node:fs";
import path from "node:path";
import type { ValidationReport } from "./types.js";

export function reportToJson(report: ValidationReport): string {
  return JSON.stringify(report, null, 2);
}

export function reportToMarkdown(report: ValidationReport): string {
  const status = report.pass ? "PASS" : "FAIL";
  const lines: string[] = [
    "# Validation Report",
    "",
    `**Package:** ${report.packagePath}  `,
    `**Validated:** ${report.validatedAt}  `,
    `**Tenant:** ${report.tenantId ?? "unknown"}  `,
    `**Result:** ${status}`,
    "",
    "## Scores",
    "",
    "| Dimension | Score |",
    "|-----------|-------|",
    `| Completeness | ${report.scores.completeness}/100 |`,
    `| Schema Validity | ${report.scores.schemaValidity}/100 |`,
    `| Mission Clarity | ${report.scores.missionClarity}/100 |`,
    `| Factory Readiness | ${report.scores.factoryReadiness}/100 |`,
    `| Citadel Handoff Readiness | ${report.scores.citadelHandoffReadiness}/100 |`,
    `| **Overall** | **${report.scores.overall}/100** |`,
    "",
  ];

  if (report.missingFiles.length) {
    lines.push("## Missing Files", "");
    for (const file of report.missingFiles) {
      lines.push(`- ${file}`);
    }
    lines.push("");
  }

  if (report.schemaErrors.length) {
    lines.push("## Schema Errors", "");
    for (const err of report.schemaErrors) {
      lines.push(`- **${err.file}**: ${err.message}`);
    }
    lines.push("");
  }

  if (report.issues.length) {
    lines.push("## Errors", "");
    for (const err of report.issues) {
      const loc = err.file ? `**${err.file}** — ` : "";
      lines.push(`- ${loc}${err.message}`);
    }
    lines.push("");
  }

  if (report.warnings.length) {
    lines.push("## Warnings", "");
    for (const warn of report.warnings) {
      const loc = warn.file ? `**${warn.file}** — ` : "";
      lines.push(`- ${loc}${warn.message}`);
    }
    lines.push("");
  }

  lines.push("## Next Required Fix", "");
  lines.push(report.nextRequiredFix ?? "_None — package passed validation._");
  lines.push("");

  return lines.join("\n");
}

export function writeReports(
  report: ValidationReport,
  outputDir: string
): { jsonPath: string; markdownPath: string } {
  fs.mkdirSync(outputDir, { recursive: true });
  const jsonPath = path.join(outputDir, "validation-report.json");
  const markdownPath = path.join(outputDir, "validation-report.md");

  fs.writeFileSync(jsonPath, reportToJson(report));
  fs.writeFileSync(markdownPath, reportToMarkdown(report));

  return { jsonPath, markdownPath };
}
