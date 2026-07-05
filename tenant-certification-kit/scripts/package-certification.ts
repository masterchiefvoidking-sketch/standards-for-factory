#!/usr/bin/env node
/**
 * Tenant certification packager — delegates to factory-standards canonical CLI.
 *
 * When this kit is copied into a tenant repo, set FACTORY_STANDARDS_PATH to your
 * cloned factory-standards directory, or clone standards alongside the tenant.
 *
 *   FACTORY_STANDARDS_PATH=../standards-for-factory npx tsx tenant-certification-kit/scripts/package-certification.ts factory-certification
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveCanonicalCli(): string {
  const candidates = [
    path.resolve(__dirname, "../../scripts/package-certification.ts"),
    process.env.FACTORY_STANDARDS_PATH
      ? path.join(process.env.FACTORY_STANDARDS_PATH, "scripts/package-certification.ts")
      : null,
  ].filter((p): p is string => Boolean(p));

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  throw new Error(
    "Canonical packager not found. Run from factory-standards, or set FACTORY_STANDARDS_PATH to a cloned standards-for-factory repo."
  );
}

const canonical = resolveCanonicalCli();
const mod = (await import(pathToFileURL(canonical).href)) as {
  runPackageCli: (argv: string[]) => number;
};

process.exit(mod.runPackageCli(process.argv.slice(2)));
