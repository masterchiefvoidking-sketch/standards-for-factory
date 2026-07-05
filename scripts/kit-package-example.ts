#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { packageCertification } from "../src/package-certification.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(ROOT, "imports/examples/citadel-valid");
const outputDir = path.join(ROOT, "imports/examples");

const result = packageCertification({ sourceDir, outputDir });

if (!result.success) {
  console.error("Example packaging FAILED:");
  for (const issue of result.issues.filter((i) => i.severity === "error")) {
    console.error(`  - ${issue.message}`);
  }
  process.exit(1);
}

console.log(`Example package created: ${result.packagePath}`);
console.log(`Tenant: ${result.tenantId}`);
console.log("");
console.log("Validate with:");
console.log("  npm run validate:package -- imports/examples/citadel-valid-factory-certification.zip");
console.log("  (or the zip path above)");
