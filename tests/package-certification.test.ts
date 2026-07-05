import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import {
  checkKitLayout,
  packageCertification,
  prePackageChecks,
} from "../src/package-certification.js";
import { REQUIRED_FILES, OPTIONAL_FILES } from "../src/types.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tempDirs: string[] = [];

function writeFixture(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "factory-pkg-"));
  tempDirs.push(dir);
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

const manifest = {
  protocol: "factory.tenant.v1",
  protocolVersion: "1.0.0",
  generatedAt: "2026-07-05T12:00:00Z",
  tenant: { id: "test", name: "Test", slug: "test" },
  repository: {
    name: "test",
    remoteUrl: "https://github.com/example/test",
    commitSha: "abcdef1234567890abcdef1234567890abcdef12",
  },
  mission: { statement: "Test mission for packaging." },
  owns: ["app.core"],
  doesNotOwn: ["archive.storage"],
  capabilities: ["app.core"],
  integrations: {
    declared: ["factory"],
    implemented: [],
    modes: { factory: "manual" },
  },
  standardsVersion: "1.0.0",
  lifecycle: {
    state: "certified",
    qualificationPercent: 96,
    certified: true,
    updatedAt: "2026-07-05T12:00:00Z",
  },
};

function fullPackage(): Record<string, string> {
  return {
    "factory-manifest.json": JSON.stringify(manifest),
    "factory-audit.json": JSON.stringify({
      protocol: "factory.certification.v1",
      protocolVersion: "1.0.0",
      generatedAt: "2026-07-05T12:00:00Z",
      tenantId: "test",
      auditId: "a1",
      status: "pass",
      summary: { total: 1, passed: 1, failed: 0, skipped: 0, warnings: 0 },
      checks: [
        {
          id: "c1",
          category: "structure",
          title: "ok",
          status: "pass",
        },
      ],
    }),
    "factory-health.json": JSON.stringify({
      protocol: "factory.certification.v1",
      protocolVersion: "1.0.0",
      generatedAt: "2026-07-05T12:00:00Z",
      tenantId: "test",
      status: "healthy",
      signals: [{ id: "s1", name: "Build", status: "ok" }],
    }),
    "factory-qualification.json": JSON.stringify({
      protocol: "factory.qualification.v1",
      protocolVersion: "1.0.0",
      generatedAt: "2026-07-05T12:00:00Z",
      tenantId: "test",
      loopId: "q1",
      status: "qualified",
      iteration: 1,
      criteria: [
        {
          id: "crit.manifest-valid",
          name: "m",
          required: true,
          result: "met",
        },
      ],
    }),
    "factory-report.md": "# Report\n\nComplete.\n",
  };
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempDirs.length = 0;
});

describe("packageCertification", () => {
  it("packages valid directory into zip", () => {
    const source = writeFixture(fullPackage());
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "factory-pkg-out-"));
    tempDirs.push(out);

    const result = packageCertification({ sourceDir: source, outputDir: out });
    expect(result.success).toBe(true);
    expect(result.tenantId).toBe("test");
    expect(fs.existsSync(result.packagePath)).toBe(true);
    expect(result.packagePath).toMatch(/test-factory-certification\.zip$/);
  });

  it("fails when manifest missing", () => {
    const files = fullPackage();
    delete files["factory-manifest.json"];
    const source = writeFixture(files);
    const issues = prePackageChecks(source);
    expect(issues.some((i) => i.code === "package.missing-required")).toBe(true);
  });

  it("fails on tenantId mismatch", () => {
    const files = fullPackage();
    const health = JSON.parse(files["factory-health.json"]) as {
      tenantId: string;
    };
    health.tenantId = "wrong";
    files["factory-health.json"] = JSON.stringify(health);
    const source = writeFixture(files);
    const issues = prePackageChecks(source);
    expect(issues.some((i) => i.code === "package.tenant-mismatch")).toBe(true);
  });
});

describe("checkKitLayout", () => {
  it("passes for complete factory-standards kit", () => {
    const issues = checkKitLayout(ROOT);
    expect(issues.filter((i) => i.severity === "error")).toHaveLength(0);
  });
});

describe("kit required files constant", () => {
  it("matches certification package layout", () => {
    expect(REQUIRED_FILES).toContain("factory-manifest.json");
    expect(REQUIRED_FILES).toHaveLength(5);
    expect(OPTIONAL_FILES).toContain("compatibility.json");
    expect(OPTIONAL_FILES).toHaveLength(4);
  });
});

describe("kit packager delegation", () => {
  it("kit script delegates to canonical packager", () => {
    const kitScript = fs.readFileSync(
      path.join(ROOT, "tenant-certification-kit/scripts/package-certification.ts"),
      "utf-8"
    );
    expect(kitScript).toContain("resolveCanonicalCli");
    expect(kitScript).toContain("runPackageCli");
    expect(kitScript).not.toContain("const REQUIRED = [");
  });
});
