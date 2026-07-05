#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPackage } from "../src/load-package.js";
import { validateCertificationPackage } from "../src/validator.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const examples = [
  { path: "imports/examples/citadel-valid", expectPass: true },
  { path: "imports/examples/horizon-invalid", expectPass: false },
];

let failed = 0;

for (const example of examples) {
  const fullPath = path.join(ROOT, example.path);
  const contents = loadPackage(fullPath);
  const report = validateCertificationPackage(contents);

  const ok = report.pass === example.expectPass;
  const label = ok ? "OK" : "FAIL";
  console.log(
    `[${label}] ${example.path}: pass=${report.pass} (expected ${example.expectPass}), score=${report.scores.overall}`
  );

  if (!ok) failed++;
}

if (failed > 0) {
  process.exit(1);
}

console.log("All example validations behaved as expected.");
