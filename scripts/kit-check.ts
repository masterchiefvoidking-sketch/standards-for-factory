#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkKitLayout } from "../src/package-certification.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const issues = checkKitLayout(ROOT);
const errors = issues.filter((i) => i.severity === "error");

if (errors.length > 0) {
  console.error("Tenant certification kit check FAILED:");
  for (const e of errors) console.error(`  - ${e.message}`);
  process.exit(1);
}

console.log("Tenant certification kit check PASSED");
console.log(`Verified ${issues.length === 0 ? "all" : ""} kit files under tenant-certification-kit/`);
