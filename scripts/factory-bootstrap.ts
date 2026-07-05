#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function usage(): never {
  console.error(`Usage: npm run bootstrap -- --tenant <slug> --target <path>

Bootstraps a tenant repository with:
  - tenant-certification-kit/
  - factory-certification/ (templates + compatibility.json stub)
  - README.factory-badge.md

Example:
  npm run bootstrap -- --tenant citadel --target ../citadel
`);
  process.exit(1);
}

function parseArgs(argv: string[]): { tenant: string; target: string } {
  let tenant: string | undefined;
  let target: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--tenant" && argv[i + 1]) {
      tenant = argv[++i];
    } else if (arg === "--target" && argv[i + 1]) {
      target = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      usage();
    }
  }

  if (!tenant || !target) usage();
  return { tenant, target };
}

function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyFileIfExists(src: string, dest: string): void {
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function writeCompatibilityStub(certDir: string, tenant: string): void {
  const compatibility = {
    protocol: "factory.compatibility.v1",
    protocolVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    tenantId: tenant,
    requires: {
      "factory-core": ">=1.0.0",
      "factory-standards": ">=1.0.0",
    },
    schema: "1.0",
  };
  fs.writeFileSync(
    path.join(certDir, "compatibility.json"),
    `${JSON.stringify(compatibility, null, 2)}\n`
  );
}

function writeBadgeSnippet(target: string): void {
  const badge = `<!-- Factory status badge — paste at top of README -->

| | |
|---|---|
| **Factory Lifecycle** | \`qualification\` |
| **Qualification** | \`0\`% |
| **Certified** | \`NO\` |

_States: discovery · architecture · construction · qualification · certified · operational · maintenance · deprecated · archived_

See [factory-standards lifecycle](https://github.com/masterchiefvoidking-sketch/standards-for-factory/blob/main/docs/FACTORY_LIFECYCLE.md).
`;
  fs.writeFileSync(path.join(target, "README.factory-badge.md"), badge);
}

function main(): void {
  const { tenant, target } = parseArgs(process.argv.slice(2));
  const targetDir = path.resolve(target);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const kitSrc = path.join(ROOT, "tenant-certification-kit");
  const kitDest = path.join(targetDir, "tenant-certification-kit");
  const certDir = path.join(targetDir, "factory-certification");

  if (!fs.existsSync(kitSrc)) {
    console.error(`factory-standards kit not found at ${kitSrc}`);
    process.exit(1);
  }

  if (fs.existsSync(kitDest)) {
    console.error(`Kit already exists: ${kitDest}`);
    console.error("Remove it first or choose a different target.");
    process.exit(1);
  }

  copyDir(kitSrc, kitDest);
  fs.mkdirSync(certDir, { recursive: true });

  const templateDir = path.join(kitDest, "templates");
  for (const name of fs.readdirSync(templateDir)) {
    copyFileIfExists(path.join(templateDir, name), path.join(certDir, name));
  }

  copyFileIfExists(
    path.join(ROOT, "templates", "compatibility.template.json"),
    path.join(certDir, "compatibility.json")
  );
  writeCompatibilityStub(certDir, tenant);
  writeBadgeSnippet(targetDir);

  const manifestPath = path.join(certDir, "factory-manifest.json");
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Record<
      string,
      unknown
    >;
    manifest.generatedAt = new Date().toISOString();
    const tenantObj = manifest.tenant as Record<string, string>;
    tenantObj.id = tenant;
    tenantObj.slug = tenant;
    tenantObj.name = tenant.charAt(0).toUpperCase() + tenant.slice(1);
    manifest.lifecycle = {
      state: "qualification",
      qualificationPercent: 0,
      certified: false,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }

  console.log(`Bootstrapped tenant "${tenant}" at ${targetDir}`);
  console.log("");
  console.log("Next steps:");
  console.log(`  1. Open ${targetDir} in Cursor`);
  console.log(
    `  2. Run tenant-certification-kit/prompts/TENANT_CERTIFICATION_PROMPT.md`
  );
  console.log(`  3. Fill factory-certification/ artifacts`);
  console.log(
    `  4. Validate: npm run validate:package -- imports/${tenant} (in factory-standards)`
  );
}

main();
