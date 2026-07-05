import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { fixMisnamedReportFile, loadPackage } from "../src/load-package.js";

describe("fixMisnamedReportFile", () => {
  it("renames factory-report.md5.md to factory-report.md", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "factory-md5-fix-"));
    const wrong = path.join(dir, "factory-report.md5.md");
    fs.writeFileSync(wrong, "# Report\n");
    expect(fs.existsSync(path.join(dir, "factory-report.md"))).toBe(false);

    const fixed = fixMisnamedReportFile(dir);
    expect(fixed).toBe(true);
    expect(fs.existsSync(path.join(dir, "factory-report.md"))).toBe(true);
    expect(fs.existsSync(wrong)).toBe(false);

    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("loadPackage picks up renamed report", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "factory-md5-load-"));
    fs.writeFileSync(path.join(dir, "factory-report.md5.md"), "# Report\n\nContent.\n");
    const manifest = {
      protocol: "factory.tenant.v1",
      protocolVersion: "1.0.0",
      generatedAt: "2026-07-05T12:00:00Z",
      tenant: { id: "t", name: "T", slug: "t" },
      repository: {
        name: "r",
        remoteUrl: "https://github.com/example/r",
        commitSha: "abcdef1234567890abcdef1234567890abcdef12",
      },
      mission: { statement: "Test mission statement here." },
      owns: ["a"],
      doesNotOwn: ["b"],
      capabilities: ["c"],
      integrations: { declared: [], implemented: [], modes: {} },
    };
    fs.writeFileSync(
      path.join(dir, "factory-manifest.json"),
      JSON.stringify(manifest)
    );
    for (const f of [
      "factory-audit.json",
      "factory-health.json",
      "factory-qualification.json",
    ]) {
      fs.writeFileSync(
        path.join(dir, f),
        JSON.stringify({ tenantId: "t", protocol: "factory.certification.v1", protocolVersion: "1.0.0", generatedAt: "2026-07-05T12:00:00Z" })
      );
    }

    const contents = loadPackage(dir);
    expect(contents.files.has("factory-report.md")).toBe(true);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
