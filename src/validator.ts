import type {
  AuditData,
  HealthData,
  ManifestData,
  ParsedPackage,
  QualificationData,
  ValidationIssue,
  ValidationReport,
  ValidationScores,
} from "./types.js";
import {
  OPTIONAL_FILES,
  REQUIRED_FILES,
  REQUIRED_QUALIFICATION_GATES,
} from "./types.js";
import type { PackageContents } from "./types.js";
import { readFileText } from "./load-package.js";
import { validateAgainstSchema } from "./schema-validator.js";

const ACCEPTABLE_HEALTH = new Set(["healthy", "degraded"]);
const VALID_HEALTH_STATUSES = new Set([
  "healthy",
  "degraded",
  "unhealthy",
  "unknown",
]);

function parseJsonFile(
  filename: string,
  filePath: string,
  issues: ValidationIssue[]
): unknown | undefined {
  try {
    const text = readFileText(filePath);
    return JSON.parse(text) as unknown;
  } catch (err) {
    issues.push({
      code: "json.parse",
      severity: "error",
      message: `Failed to parse JSON: ${err instanceof Error ? err.message : String(err)}`,
      file: filename,
    });
    return undefined;
  }
}

function parsePackage(contents: PackageContents): ParsedPackage {
  const parseErrors: ValidationIssue[] = [];
  const rawJson: Record<string, unknown> = {};

  for (const [filename, filePath] of contents.files) {
    if (!filename.endsWith(".json")) continue;
    const data = parseJsonFile(filename, filePath, parseErrors);
    if (data !== undefined) rawJson[filename] = data;
  }

  const manifest = rawJson["factory-manifest.json"] as ManifestData | undefined;
  const audit = rawJson["factory-audit.json"] as AuditData | undefined;
  const health = rawJson["factory-health.json"] as HealthData | undefined;
  const qualification = rawJson[
    "factory-qualification.json"
  ] as QualificationData | undefined;
  const citadelArchive = rawJson[
    "factory-citadel-archive.json"
  ] as { tenantId: string } | undefined;

  const reportPath = contents.files.get("factory-report.md");
  const reportMarkdown = reportPath ? readFileText(reportPath) : undefined;

  return {
    manifest,
    audit,
    health,
    qualification,
    citadelArchive,
    reportMarkdown,
    rawJson,
    parseErrors,
  };
}

function checkLayout(contents: PackageContents): {
  missingFiles: string[];
  issues: ValidationIssue[];
} {
  const missingFiles: string[] = [];
  const issues: ValidationIssue[] = [];

  for (const file of REQUIRED_FILES) {
    if (!contents.files.has(file)) {
      missingFiles.push(file);
      issues.push({
        code: "layout.missing-required",
        severity: "error",
        message: `Required file missing: ${file}`,
        file,
      });
    }
  }

  return { missingFiles, issues };
}

function checkSchemas(
  rawJson: Record<string, unknown>
): ValidationIssue[] {
  const errors: ValidationIssue[] = [];
  for (const [filename, data] of Object.entries(rawJson)) {
    errors.push(...validateAgainstSchema(filename, data));
  }
  return errors;
}

function checkTenantIdConsistency(parsed: ParsedPackage): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const manifestId = parsed.manifest?.tenant?.id;

  if (!manifestId) {
    issues.push({
      code: "tenant.missing",
      severity: "error",
      message: "Manifest tenant.id is missing",
      file: "factory-manifest.json",
    });
    return issues;
  }

  const filesWithTenantId: Array<{ file: string; id?: string }> = [
    { file: "factory-audit.json", id: parsed.audit?.tenantId },
    { file: "factory-health.json", id: parsed.health?.tenantId },
    {
      file: "factory-qualification.json",
      id: parsed.qualification?.tenantId,
    },
  ];

  if (parsed.citadelArchive) {
    filesWithTenantId.push({
      file: "factory-citadel-archive.json",
      id: parsed.citadelArchive.tenantId,
    });
  }

  for (const { file, id } of filesWithTenantId) {
    if (id === undefined) continue;
    if (id !== manifestId) {
      issues.push({
        code: "tenant.mismatch",
        severity: "error",
        message: `tenantId "${id}" does not match manifest tenant.id "${manifestId}"`,
        file,
      });
    }
  }

  return issues;
}

function checkMission(parsed: ParsedPackage): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const mission = parsed.manifest?.mission;

  if (!mission?.statement?.trim()) {
    issues.push({
      code: "mission.missing",
      severity: "error",
      message: "Manifest mission.statement is required",
      file: "factory-manifest.json",
    });
  }

  const owns = parsed.manifest?.owns ?? [];
  const doesNotOwn = parsed.manifest?.doesNotOwn ?? [];

  if (!owns.length) {
    issues.push({
      code: "mission.owns-missing",
      severity: "error",
      message: "Manifest owns array is required and must not be empty",
      file: "factory-manifest.json",
    });
  }

  if (!doesNotOwn.length) {
    issues.push({
      code: "mission.does-not-own-missing",
      severity: "error",
      message: "Manifest doesNotOwn array is required and must not be empty",
      file: "factory-manifest.json",
    });
  }

  const overlap = owns.filter((item) => doesNotOwn.includes(item));
  for (const item of overlap) {
    issues.push({
      code: "mission.responsibility-overlap",
      severity: "warning",
      message: `Responsibility "${item}" appears in both owns and doesNotOwn`,
      file: "factory-manifest.json",
    });
  }

  return issues;
}

function checkHealth(parsed: ParsedPackage): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const status = parsed.health?.status;

  if (!status) return issues;

  if (!VALID_HEALTH_STATUSES.has(status)) {
    issues.push({
      code: "health.invalid-status",
      severity: "error",
      message: `Invalid health status: ${status}`,
      file: "factory-health.json",
    });
  } else if (status === "unhealthy") {
    issues.push({
      code: "health.unhealthy",
      severity: "error",
      message: "Health status unhealthy is not acceptable for certification",
      file: "factory-health.json",
    });
  }

  return issues;
}

function checkQualificationGates(parsed: ParsedPackage): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const criteria = parsed.qualification?.criteria ?? [];
  const presentIds = new Set(criteria.map((c) => c.id));

  for (const gateId of REQUIRED_QUALIFICATION_GATES) {
    if (!presentIds.has(gateId)) {
      issues.push({
        code: "qualification.missing-gate",
        severity: "error",
        message: `Required qualification gate missing: ${gateId}`,
        file: "factory-qualification.json",
      });
    }
  }

  return issues;
}

function checkReport(parsed: ParsedPackage): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!parsed.reportMarkdown?.trim()) {
    issues.push({
      code: "report.missing",
      severity: "error",
      message: "factory-report.md is missing or empty",
      file: "factory-report.md",
    });
  }

  return issues;
}

function checkFakeIntegrations(parsed: ParsedPackage): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const declared = new Set(parsed.manifest?.integrations?.declared ?? []);
  const implemented = parsed.manifest?.integrations?.implemented ?? [];

  for (const integration of implemented) {
    if (!declared.has(integration)) {
      issues.push({
        code: "integration.undeclared-implemented",
        severity: "error",
        message: `Integration "${integration}" is implemented but not declared`,
        file: "factory-manifest.json",
      });
    }
  }

  const implementedSet = new Set(implemented);

  for (const dep of parsed.health?.dependencies ?? []) {
    if (
      declared.has(dep.name) &&
      !implementedSet.has(dep.name) &&
      dep.status === "available"
    ) {
      issues.push({
        code: "integration.fake-live",
        severity: "warning",
        message: `Dependency "${dep.name}" marked available but not in integrations.implemented`,
        file: "factory-health.json",
      });
    }
  }

  for (const check of parsed.audit?.checks ?? []) {
    if (
      check.category === "integration" &&
      check.status === "pass" &&
      check.title.toLowerCase().includes("integration")
    ) {
      const match = implemented.find((name) =>
        check.title.toLowerCase().includes(name.toLowerCase())
      );
      const declaredOnly = parsed.manifest?.integrations?.declared?.find(
        (name) =>
          check.title.toLowerCase().includes(name.toLowerCase()) &&
          !implementedSet.has(name)
      );
      if (declaredOnly && !match) {
        issues.push({
          code: "integration.fake-connected",
          severity: "warning",
          message: `Audit claims integration "${declaredOnly}" passed but it is not implemented`,
          file: "factory-audit.json",
        });
      }
    }
  }

  return issues;
}

function checkIntegrationModes(parsed: ParsedPackage): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const integrations = parsed.manifest?.integrations;
  if (!integrations) return issues;

  const declared = integrations.declared ?? [];
  const implemented = new Set(integrations.implemented ?? []);
  const modes = integrations.modes ?? {};

  for (const name of declared) {
    const mode = modes[name];
    if (!mode) {
      issues.push({
        code: "integration.mode-missing",
        severity: "warning",
        message: `Integration "${name}" has no mode (mock, manual, imported, connected)`,
        file: "factory-manifest.json",
      });
      continue;
    }

    if (mode === "connected" && !implemented.has(name)) {
      issues.push({
        code: "integration.fake-connected-mode",
        severity: "error",
        message: `Integration "${name}" mode is connected but not in implemented`,
        file: "factory-manifest.json",
      });
    }

    if (
      (mode === "mock" || mode === "manual") &&
      implemented.has(name)
    ) {
      issues.push({
        code: "integration.mode-mismatch",
        severity: "warning",
        message: `Integration "${name}" is implemented but mode is ${mode}`,
        file: "factory-manifest.json",
      });
    }
  }

  for (const name of Object.keys(modes)) {
    if (!declared.includes(name)) {
      issues.push({
        code: "integration.undeclared-mode",
        severity: "error",
        message: `Integration mode declared for "${name}" but not in declared list`,
        file: "factory-manifest.json",
      });
    }
  }

  return issues;
}

function computeScores(
  contents: PackageContents,
  parsed: ParsedPackage,
  errors: ValidationIssue[],
  warnings: ValidationIssue[]
): ValidationScores {
  const requiredPresent = REQUIRED_FILES.filter((f) =>
    contents.files.has(f)
  ).length;
  const optionalPresent = OPTIONAL_FILES.filter((f) =>
    contents.files.has(f)
  ).length;

  const completeness = Math.round(
    (requiredPresent / REQUIRED_FILES.length) * 80 +
      (optionalPresent / OPTIONAL_FILES.length) * 20
  );

  const jsonFiles = Object.keys(parsed.rawJson);
  const schemaErrorFiles = new Set(errors.filter((e) => e.code === "schema.invalid").map((e) => e.file));
  const schemaValidity =
    jsonFiles.length === 0
      ? 0
      : Math.round(
          ((jsonFiles.length - schemaErrorFiles.size) / jsonFiles.length) * 100
        );

  const missionErrors = errors.filter((e) => e.code.startsWith("mission."));
  const overlapWarnings = warnings.filter(
    (e) => e.code === "mission.responsibility-overlap"
  );
  let missionClarity = 100;
  if (missionErrors.length) missionClarity -= missionErrors.length * 25;
  missionClarity -= overlapWarnings.length * 15;
  missionClarity = Math.max(0, Math.min(100, missionClarity));

  let factoryReadiness = 100;
  if (parsed.audit?.status !== "pass" && parsed.audit?.status !== "partial") {
    factoryReadiness -= 25;
  }
  if (parsed.health?.status && !ACCEPTABLE_HEALTH.has(parsed.health.status)) {
    factoryReadiness -= 30;
  }
  const missingGates = errors.filter((e) =>
    e.code === "qualification.missing-gate"
  ).length;
  factoryReadiness -= missingGates * 10;
  const unmetRequired = (parsed.qualification?.criteria ?? []).filter(
    (c) => c.required && c.result === "unmet"
  ).length;
  factoryReadiness -= unmetRequired * 10;
  factoryReadiness = Math.max(0, Math.min(100, factoryReadiness));

  const hasArchive = contents.files.has("factory-citadel-archive.json");
  const archiveErrors = errors.filter(
    (e) => e.file === "factory-citadel-archive.json"
  );
  let citadelHandoffReadiness: number;
  if (!hasArchive) {
    citadelHandoffReadiness = parsed.manifest?.tenant?.id === "citadel" ? 50 : 100;
  } else {
    citadelHandoffReadiness =
      archiveErrors.length === 0 ? 100 : Math.max(0, 100 - archiveErrors.length * 25);
  }

  const overall = Math.round(
    (completeness +
      schemaValidity +
      missionClarity +
      factoryReadiness +
      citadelHandoffReadiness) /
      5
  );

  return {
    completeness,
    schemaValidity,
    missionClarity,
    factoryReadiness,
    citadelHandoffReadiness,
    overall,
  };
}

function pickNextFix(errors: ValidationIssue[], warnings: ValidationIssue[]): string | null {
  const priority = [...errors, ...warnings];
  if (!priority.length) return null;
  const first = priority[0];
  return first.file ? `${first.file}: ${first.message}` : first.message;
}

export function validateCertificationPackage(
  contents: PackageContents
): ValidationReport {
  const validatedAt = new Date().toISOString();
  const { missingFiles, issues: layoutIssues } = checkLayout(contents);
  const parsed = parsePackage(contents);

  const schemaErrors = checkSchemas(parsed.rawJson);
  const crossIssues = [
    ...parsed.parseErrors,
    ...checkTenantIdConsistency(parsed),
    ...checkMission(parsed),
    ...checkHealth(parsed),
    ...checkQualificationGates(parsed),
    ...checkReport(parsed),
    ...checkFakeIntegrations(parsed),
    ...checkIntegrationModes(parsed),
  ];

  const allIssues = [...layoutIssues, ...schemaErrors, ...crossIssues];
  const errors = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");

  const scores = computeScores(contents, parsed, errors, warnings);
  const pass = errors.length === 0;

  return {
    packagePath: contents.rootDir,
    validatedAt,
    pass,
    tenantId: parsed.manifest?.tenant?.id ?? null,
    missingFiles,
    schemaErrors: [...schemaErrors],
    issues: errors,
    warnings,
    scores,
    nextRequiredFix: pickNextFix(errors, warnings),
  };
}
