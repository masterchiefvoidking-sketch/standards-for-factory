import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import type { ErrorObject, ValidateFunction } from "ajv";
import type { ValidationIssue } from "./types.js";
import { SCHEMA_MAP } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = path.resolve(__dirname, "..", "schemas");

type AjvInstance = {
  addSchema: (schema: object) => void;
  getSchema: (key: string) => ValidateFunction | undefined;
};

let ajvInstance: AjvInstance | null = null;

function getAjv(): AjvInstance {
  if (!ajvInstance) {
    const ajv = new (Ajv2020 as unknown as new (opts: object) => AjvInstance)({
      allErrors: true,
      strict: false,
    });
    (addFormats as unknown as (ajv: AjvInstance) => void)(ajv);

    for (const schemaFile of new Set(Object.values(SCHEMA_MAP))) {
      const schemaPath = path.join(SCHEMAS_DIR, schemaFile);
      const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as object;
      ajv.addSchema(schema);
    }
    ajvInstance = ajv;
  }
  return ajvInstance;
}

function formatAjvErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors?.length) return [];
  return errors.map((e) => {
    const loc = e.instancePath || "/";
    return `${loc}: ${e.message ?? "invalid"}`;
  });
}

export function validateAgainstSchema(
  filename: string,
  data: unknown
): ValidationIssue[] {
  const schemaFile = SCHEMA_MAP[filename];
  if (!schemaFile) return [];

  const ajv = getAjv();
  const validate = ajv.getSchema(`https://factory.standards/schemas/${schemaFile}`);

  if (!validate) {
    return [
      {
        code: "schema.missing",
        severity: "error",
        message: `Schema not loaded: ${schemaFile}`,
        file: filename,
      },
    ];
  }

  const valid = validate(data);
  if (valid) return [];

  return formatAjvErrors(validate.errors).map((message) => ({
    code: "schema.invalid",
    severity: "error" as const,
    message,
    file: filename,
  }));
}

export function resetSchemaCache(): void {
  ajvInstance = null;
}
