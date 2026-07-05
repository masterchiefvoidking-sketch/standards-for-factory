import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ValidationIssue } from "./types.js";

export interface CompatibilityData {
  tenantId: string;
  requires: {
    "factory-core": string;
    "factory-standards": string;
  };
  schema: string;
}

interface MatrixRepository {
  role: string;
  requires: Record<string, string>;
}

interface CompatibilityMatrix {
  matrixVersion: string;
  repositories: Record<string, MatrixRepository>;
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MATRIX_PATH = path.join(ROOT, "compatibility", "matrix.json");

function parseGteVersion(requirement: string): number[] | null {
  const match = /^>=(\d+)\.(\d+)\.(\d+)$/.exec(requirement.trim());
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function compareSemver(a: number[], b: number[]): number {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

/** True when declared requirement is at least as strict as matrix minimum. */
export function requirementMeetsMinimum(
  declared: string,
  minimum: string
): boolean {
  const declaredVersion = parseGteVersion(declared);
  const minimumVersion = parseGteVersion(minimum);
  if (!declaredVersion || !minimumVersion) return false;
  return compareSemver(declaredVersion, minimumVersion) >= 0;
}

export function loadCompatibilityMatrix(): CompatibilityMatrix | null {
  try {
    return JSON.parse(fs.readFileSync(MATRIX_PATH, "utf-8")) as CompatibilityMatrix;
  } catch {
    return null;
  }
}

export function checkCompatibility(
  compatibility: CompatibilityData | undefined,
  manifestTenantId: string | undefined,
  matrixKey: string | undefined
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!compatibility) {
    issues.push({
      code: "compatibility.missing",
      severity: "warning",
      message:
        "compatibility.json is recommended for every certification package",
      file: "compatibility.json",
    });
    return issues;
  }

  if (manifestTenantId && compatibility.tenantId !== manifestTenantId) {
    issues.push({
      code: "compatibility.tenant-mismatch",
      severity: "error",
      message: `compatibility tenantId "${compatibility.tenantId}" does not match manifest "${manifestTenantId}"`,
      file: "compatibility.json",
    });
  }

  const matrix = loadCompatibilityMatrix();
  if (!matrix || !matrixKey) return issues;

  const repoEntry = matrix.repositories[matrixKey];
  if (!repoEntry) {
    issues.push({
      code: "compatibility.matrix-unknown-repo",
      severity: "warning",
      message: `No compatibility matrix entry for repository "${matrixKey}"`,
      file: "compatibility.json",
    });
    return issues;
  }

  for (const [dep, minimum] of Object.entries(repoEntry.requires)) {
    const declared =
      dep === "factory-core"
        ? compatibility.requires["factory-core"]
        : dep === "factory-standards"
          ? compatibility.requires["factory-standards"]
          : undefined;

    if (!declared) {
      issues.push({
        code: "compatibility.missing-requirement",
        severity: "error",
        message: `compatibility.json missing required dependency: ${dep}`,
        file: "compatibility.json",
      });
      continue;
    }

    if (!requirementMeetsMinimum(declared, minimum)) {
      issues.push({
        code: "compatibility.below-matrix",
        severity: "error",
        message: `Declared ${dep} ${declared} is below matrix minimum ${minimum} for ${matrixKey}`,
        file: "compatibility.json",
      });
    }
  }

  return issues;
}
