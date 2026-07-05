import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { loadPackage } from "../src/load-package.js";
import { validateCertificationPackage } from "../src/validator.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CITADEL_VALID = path.join(ROOT, "imports/examples/citadel-valid");
const HORIZON_INVALID = path.join(ROOT, "imports/examples/horizon-invalid");

const tempDirs: string[] = [];

function writeFixture(name: string, files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `factory-test-${name}-`));
  tempDirs.push(dir);
  for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, filename), content);
  }
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempDirs.length = 0;
});

const baseManifest = {
  protocol: "factory.tenant.v1",
  protocolVersion: "1.0.0",
  generatedAt: "2026-07-05T12:00:00Z",
  tenant: { id: "test", name: "Test", slug: "test", tier: "tenant" },
  repository: {
    name: "test",
    remoteUrl: "https://github.com/example/test",
    commitSha: "abcdef1234567890abcdef1234567890abcdef12",
  },
  mission: { statement: "Test tenant mission statement for validation." },
  owns: ["app.core"],
  doesNotOwn: ["archive.storage"],
  capabilities: ["app.core"],
  integrations: { declared: ["factory"], implemented: ["factory"] },
  standardsVersion: "1.0.0",
};

const baseAudit = {
  protocol: "factory.certification.v1",
  protocolVersion: "1.0.0",
  generatedAt: "2026-07-05T12:00:00Z",
  tenantId: "test",
  auditId: "audit-1",
  status: "pass",
  summary: { total: 1, passed: 1, failed: 0, skipped: 0, warnings: 0 },
  checks: [
    {
      id: "check.structure",
      category: "structure",
      title: "Structure ok",
      status: "pass",
    },
  ],
};

const baseHealth = {
  protocol: "factory.certification.v1",
  protocolVersion: "1.0.0",
  generatedAt: "2026-07-05T12:00:00Z",
  tenantId: "test",
  status: "healthy",
  signals: [{ id: "s1", name: "Build", status: "ok", category: "build" }],
};

const baseQualification = {
  protocol: "factory.qualification.v1",
  protocolVersion: "1.0.0",
  generatedAt: "2026-07-05T12:00:00Z",
  tenantId: "test",
  loopId: "qual-1",
  status: "qualified",
  iteration: 1,
  criteria: [
    { id: "crit.manifest-valid", name: "Manifest", required: true, result: "met" },
    { id: "crit.audit-pass", name: "Audit", required: true, result: "met" },
    {
      id: "crit.health-acceptable",
      name: "Health",
      required: true,
      result: "met",
    },
    {
      id: "crit.report-complete",
      name: "Report",
      required: true,
      result: "met",
    },
    {
      id: "crit.package-complete",
      name: "Package",
      required: true,
      result: "met",
    },
    {
      id: "crit.integration-honesty",
      name: "Integration",
      required: true,
      result: "met",
    },
  ],
};

const baseReport = "# Factory Certification Report\n\nComplete report.\n";

function validPackageFiles(): Record<string, string> {
  return {
    "factory-manifest.json": JSON.stringify(baseManifest, null, 2),
    "factory-audit.json": JSON.stringify(baseAudit, null, 2),
    "factory-health.json": JSON.stringify(baseHealth, null, 2),
    "factory-qualification.json": JSON.stringify(baseQualification, null, 2),
    "factory-report.md": baseReport,
  };
}

describe("validateCertificationPackage", () => {
  it("valid package passes", () => {
    const dir = writeFixture("valid", validPackageFiles());
    const report = validateCertificationPackage(loadPackage(dir));
    expect(report.pass).toBe(true);
    expect(report.tenantId).toBe("test");
    expect(report.issues).toHaveLength(0);
  });

  it("citadel-valid example passes", () => {
    const report = validateCertificationPackage(loadPackage(CITADEL_VALID));
    expect(report.pass).toBe(true);
    expect(report.tenantId).toBe("citadel");
    expect(report.scores.overall).toBeGreaterThanOrEqual(80);
  });

  it("horizon-invalid example fails", () => {
    const report = validateCertificationPackage(loadPackage(HORIZON_INVALID));
    expect(report.pass).toBe(false);
    expect(report.issues.some((i) => i.code === "tenant.mismatch")).toBe(true);
    expect(report.issues.some((i) => i.code === "health.unhealthy")).toBe(true);
    expect(
      report.issues.some((i) => i.code === "qualification.missing-gate")
    ).toBe(true);
    expect(report.warnings.some((i) => i.code === "integration.fake-live")).toBe(
      true
    );
    expect(
      report.warnings.some((i) => i.code === "mission.responsibility-overlap")
    ).toBe(true);
  });

  it("missing manifest fails", () => {
    const files = validPackageFiles();
    delete files["factory-manifest.json"];
    const dir = writeFixture("no-manifest", files);
    const report = validateCertificationPackage(loadPackage(dir));
    expect(report.pass).toBe(false);
    expect(report.missingFiles).toContain("factory-manifest.json");
  });

  it("tenantId mismatch fails", () => {
    const files = validPackageFiles();
    const health = { ...baseHealth, tenantId: "wrong" };
    files["factory-health.json"] = JSON.stringify(health, null, 2);
    const dir = writeFixture("tenant-mismatch", files);
    const report = validateCertificationPackage(loadPackage(dir));
    expect(report.pass).toBe(false);
    expect(report.issues.some((i) => i.code === "tenant.mismatch")).toBe(true);
  });

  it("fake connected status warning appears", () => {
    const files = validPackageFiles();
    const manifest = {
      ...baseManifest,
      integrations: { declared: ["citadel", "factory"], implemented: ["factory"] },
    };
    const audit = {
      ...baseAudit,
      checks: [
        {
          id: "check.integration.citadel",
          category: "integration",
          title: "Citadel integration implemented",
          status: "pass",
        },
      ],
    };
    files["factory-manifest.json"] = JSON.stringify(manifest, null, 2);
    files["factory-audit.json"] = JSON.stringify(audit, null, 2);
    const dir = writeFixture("fake-connected", files);
    const report = validateCertificationPackage(loadPackage(dir));
    expect(
      report.warnings.some((i) => i.code === "integration.fake-connected")
    ).toBe(true);
  });

  it("invalid health status fails", () => {
    const files = validPackageFiles();
    const health = { ...baseHealth, status: "unhealthy" };
    files["factory-health.json"] = JSON.stringify(health, null, 2);
    const dir = writeFixture("unhealthy", files);
    const report = validateCertificationPackage(loadPackage(dir));
    expect(report.pass).toBe(false);
    expect(report.issues.some((i) => i.code === "health.unhealthy")).toBe(true);
  });

  it("missing qualification gates fails", () => {
    const files = validPackageFiles();
    const qual = {
      ...baseQualification,
      criteria: baseQualification.criteria.filter(
        (c) => c.id !== "crit.integration-honesty"
      ),
    };
    files["factory-qualification.json"] = JSON.stringify(qual, null, 2);
    const dir = writeFixture("missing-gates", files);
    const report = validateCertificationPackage(loadPackage(dir));
    expect(report.pass).toBe(false);
    expect(
      report.issues.some((i) => i.code === "qualification.missing-gate")
    ).toBe(true);
  });

  it("optional Citadel archive validates when present", () => {
    const files = validPackageFiles();
    const manifest = {
      ...baseManifest,
      tenant: { ...baseManifest.tenant, id: "citadel", slug: "citadel" },
    };
    files["factory-manifest.json"] = JSON.stringify(manifest, null, 2);
    files["factory-audit.json"] = JSON.stringify(
      { ...baseAudit, tenantId: "citadel" },
      null,
      2
    );
    files["factory-health.json"] = JSON.stringify(
      { ...baseHealth, tenantId: "citadel" },
      null,
      2
    );
    files["factory-qualification.json"] = JSON.stringify(
      { ...baseQualification, tenantId: "citadel" },
      null,
      2
    );
    files["factory-citadel-archive.json"] = JSON.stringify(
      {
        protocol: "factory.citadel-handoff.v1",
        protocolVersion: "1.0.0",
        generatedAt: "2026-07-05T12:00:00Z",
        tenantId: "citadel",
        archive: {
          id: "archive-1",
          format: "citadel-v1",
          checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          recordCount: 10,
        },
      },
      null,
      2
    );
    const dir = writeFixture("citadel-archive", files);
    const report = validateCertificationPackage(loadPackage(dir));
    expect(report.pass).toBe(true);
    expect(report.scores.citadelHandoffReadiness).toBe(100);
  });
});
