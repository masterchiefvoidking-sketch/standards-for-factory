export type ValidationSeverity = "error" | "warning" | "info";

export interface ValidationIssue {
  code: string;
  severity: ValidationSeverity;
  message: string;
  file?: string;
  path?: string;
}

export interface ValidationScores {
  completeness: number;
  schemaValidity: number;
  missionClarity: number;
  factoryReadiness: number;
  citadelHandoffReadiness: number;
  overall: number;
}

export interface ValidationReport {
  packagePath: string;
  validatedAt: string;
  pass: boolean;
  tenantId: string | null;
  missingFiles: string[];
  schemaErrors: ValidationIssue[];
  issues: ValidationIssue[];
  warnings: ValidationIssue[];
  scores: ValidationScores;
  nextRequiredFix: string | null;
}

export const REQUIRED_FILES = [
  "factory-manifest.json",
  "factory-audit.json",
  "factory-health.json",
  "factory-qualification.json",
  "factory-report.md",
] as const;

export const OPTIONAL_FILES = [
  "compatibility.json",
  "factory-events.json",
  "factory-objects.json",
  "factory-citadel-archive.json",
] as const;

export const JSON_ARTIFACTS = [
  ...REQUIRED_FILES.filter((f) => f.endsWith(".json")),
  ...OPTIONAL_FILES,
] as const;

export const REQUIRED_QUALIFICATION_GATES = [
  "crit.manifest-valid",
  "crit.audit-pass",
  "crit.health-acceptable",
  "crit.report-complete",
  "crit.package-complete",
  "crit.integration-honesty",
] as const;

export const SCHEMA_MAP: Record<string, string> = {
  "factory-manifest.json": "factory-manifest.schema.json",
  "factory-audit.json": "factory-audit.schema.json",
  "factory-health.json": "factory-health.schema.json",
  "factory-qualification.json": "factory-qualification.schema.json",
  "compatibility.json": "compatibility.schema.json",
  "factory-events.json": "factory-event.schema.json",
  "factory-objects.json": "factory-object.schema.json",
  "factory-citadel-archive.json": "factory-citadel-archive.schema.json",
};

export interface PackageContents {
  rootDir: string;
  files: Map<string, string>;
  cleanup?: () => void;
}

export interface LifecycleData {
  state: string;
  qualificationPercent: number;
  certified: boolean;
  updatedAt: string;
  notes?: string;
}

export interface ManifestData {
  tenant: { id: string; slug: string; name: string };
  mission?: { statement: string; scope?: string };
  owns?: string[];
  doesNotOwn?: string[];
  integrations?: { declared: string[]; implemented: string[]; modes?: Record<string, string> };
  lifecycle?: LifecycleData;
}

export interface CompatibilityData {
  tenantId: string;
  requires: {
    "factory-core": string;
    "factory-standards": string;
  };
  schema: string;
}

export interface AuditData {
  tenantId: string;
  status: string;
  checks?: Array<{ id: string; category: string; status: string; title: string }>;
}

export interface HealthData {
  tenantId: string;
  status: string;
  dependencies?: Array<{ name: string; status: string; required: boolean }>;
}

export interface QualificationData {
  tenantId: string;
  status: string;
  criteria?: Array<{ id: string; required: boolean; result: string }>;
}

export interface CitadelArchiveData {
  tenantId: string;
}

export interface ParsedPackage {
  manifest?: ManifestData;
  audit?: AuditData;
  health?: HealthData;
  qualification?: QualificationData;
  compatibility?: CompatibilityData;
  citadelArchive?: CitadelArchiveData;
  reportMarkdown?: string;
  rawJson: Record<string, unknown>;
  parseErrors: ValidationIssue[];
}
