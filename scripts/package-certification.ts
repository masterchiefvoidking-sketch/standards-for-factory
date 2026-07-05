#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { packageCertification } from "../src/package-certification.js";

export function runPackageCli(argv: string[]): number {
  const args = argv.filter((a) => a !== "--");
  const sourceArg = args[0];
  const outputArg = args[1];

  if (!sourceArg || sourceArg === "--help" || sourceArg === "-h") {
    console.error(
      "Usage: npm run package:certification -- <source-dir> [output-dir]"
    );
    console.error("");
    console.error("Example:");
    console.error(
      "  npm run package:certification -- imports/factory imports/factory"
    );
    return 1;
  }

  const sourceDir = path.resolve(process.cwd(), sourceArg);
  const outputDir = outputArg
    ? path.resolve(process.cwd(), outputArg)
    : sourceDir;

  const result = packageCertification({ sourceDir, outputDir });

  if (!result.success) {
    console.error("Package certification failed:");
    for (const issue of result.issues.filter((i) => i.severity === "error")) {
      console.error(`  - ${issue.file ?? ""}: ${issue.message}`);
    }
    return 1;
  }

  console.log(`Package created: ${result.packagePath}`);
  console.log(`Tenant: ${result.tenantId ?? "unknown"}`);
  return 0;
}

if (import.meta.url.startsWith("file:")) {
  const modulePath = fileURLToPath(import.meta.url);
  const invoked = process.argv[1] ? path.resolve(process.argv[1]) : "";
  if (invoked && modulePath === invoked) {
    process.exit(runPackageCli(process.argv.slice(2)));
  }
}
