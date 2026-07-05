#!/usr/bin/env node
import path from "node:path";
import { loadPackage } from "../src/load-package.js";
import { writeReports } from "../src/report.js";
import { validateCertificationPackage } from "../src/validator.js";

function main(): void {
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const inputArg = args[0];

  if (!inputArg) {
    console.error("Usage: npm run validate:package -- <path-to-dir-or-zip>");
    console.error("Example: npm run validate:package -- imports/citadel");
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), inputArg);
  const contents = loadPackage(inputPath);

  try {
    const report = validateCertificationPackage(contents);
    const outputDir = contents.rootDir;
    const { jsonPath, markdownPath } = writeReports(report, outputDir);

    console.log(`Validation: ${report.pass ? "PASS" : "FAIL"}`);
    console.log(`Tenant: ${report.tenantId ?? "unknown"}`);
    console.log(`Overall score: ${report.scores.overall}/100`);
    console.log(`Reports written:`);
    console.log(`  ${jsonPath}`);
    console.log(`  ${markdownPath}`);

    if (report.nextRequiredFix) {
      console.log(`Next fix: ${report.nextRequiredFix}`);
    }

    if (!report.pass) {
      process.exit(1);
    }
  } finally {
    contents.cleanup?.();
  }
}

main();
