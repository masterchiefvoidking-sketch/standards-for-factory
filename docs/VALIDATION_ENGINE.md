# Validation Engine

factory-standards is the **rulebook and inspector** for Factory certification packages.

## Quick start

```bash
npm install
npm run validate:package -- imports/examples/citadel-valid
```

Validate a zip:

```bash
npm run validate:package -- imports/factory/factory-factory-certification.zip
```

Validate all curated examples:

```bash
npm run validate:examples
```

Validate all import zips and write report:

```bash
npm run validate:zips
```

## What it validates

| Check | Description |
|-------|-------------|
| Layout | Required files exist |
| JSON parse | All JSON artifacts parse |
| Schema | Each JSON file validates against `schemas/` |
| Tenant ID | `tenantId` consistent across all artifacts |
| Mission | `mission.statement`, `owns`, `doesNotOwn` present |
| Lifecycle | `manifest.lifecycle` required; certified flag vs pass; score drift warnings |
| Compatibility | `compatibility.json` recommended; matrix minimums when present |
| Responsibility overlap | No item in both `owns` and `doesNotOwn` |
| Health | Status is valid enum; `unhealthy` fails |
| Qualification gates | All 6 required criteria present |
| Report | `factory-report.md` exists and is non-empty |
| Fake integration | No undeclared implemented integrations; integration `modes` honesty |
| Citadel archive | Schema validation when `factory-citadel-archive.json` present |

`factory-report-meta.json` is **not** validated — see [FACTORY_REPORT_METADATA.md](FACTORY_REPORT_METADATA.md).

## Required and optional files

| File | Required |
|------|----------|
| `factory-manifest.json` | Yes |
| `factory-audit.json` | Yes |
| `factory-health.json` | Yes |
| `factory-qualification.json` | Yes |
| `factory-report.md` | Yes |
| `compatibility.json` | Recommended (warning if missing) |
| `factory-events.json` | Optional |
| `factory-objects.json` | Optional |
| `factory-citadel-archive.json` | Optional |

## Output

The validator writes into the package directory:

| File | Format |
|------|--------|
| `validation-report.json` | Machine-readable full report |
| `validation-report.md` | Human-readable summary |

Console output includes pass/fail, tenant ID, overall score, and next required fix.

Exit code **0** = pass, **1** = fail.

## Scoring

Five dimensions scored 0–100. See [VALIDATION_SCORING.md](VALIDATION_SCORING.md).

## Architecture

```text
scripts/validate-certification-package.ts   CLI entry
scripts/package-certification.ts            Canonical zip packager CLI
scripts/validate-import-zips.ts             Zip trust report
src/
  load-package.ts       Load directory or zip
  schema-validator.ts   AJV JSON Schema validation
  validator.ts          Business rule checks + scoring
  compatibility.ts      Matrix version checks
  report.ts             Report generation
  package-certification.ts  Package create + kit layout check
  types.ts              Shared types
schemas/                JSON Schema definitions
```

## Schemas used by validator

| Artifact | Schema |
|----------|--------|
| factory-manifest.json | factory-manifest.schema.json |
| factory-audit.json | factory-audit.schema.json |
| factory-health.json | factory-health.schema.json |
| factory-qualification.json | factory-qualification.schema.json |
| compatibility.json | compatibility.schema.json |
| factory-events.json | factory-event.schema.json |
| factory-objects.json | factory-object.schema.json |
| factory-citadel-archive.json | factory-citadel-archive.schema.json |

## Example packages

| Path | Expected |
|------|----------|
| `imports/examples/citadel-valid/` | PASS |
| `imports/examples/horizon-invalid/` | FAIL |
| `examples/horizon/` | FAIL (intentional reference) |

## NPM scripts

| Script | Purpose |
|--------|----------|
| `npm run validate:package -- <path>` | Validate one package |
| `npm run validate:examples` | Validate curated CI examples |
| `npm run validate:zips` | Validate all import zips + write report |
| `npm run package:certification -- <src> [out]` | Create zip from folder |
| `npm test` | Run test suite |
| `npm run build` | Compile TypeScript |
| `npm run typecheck` | TypeScript check without emit |
| `npm run lint` | ESLint |

## Workflow integration

```text
1. Tenant repo generates {tenant}-factory-certification.zip
2. Drop into factory-standards/imports/{tenant}/
3. npm run validate:package -- imports/{tenant}
4. Read validation-report.md
5. Repair tenant per REPAIR_ORDER.md
6. Repeat until pass
```

## Related docs

- [CERTIFICATION_PACKAGE_LAYOUT.md](CERTIFICATION_PACKAGE_LAYOUT.md)
- [VALIDATION_SCORING.md](VALIDATION_SCORING.md)
- [FACTORY_LIFECYCLE.md](FACTORY_LIFECYCLE.md)
- [FACTORY_REPORT_METADATA.md](FACTORY_REPORT_METADATA.md)
- [FACTORY_IMPORT_PROTOCOL.md](FACTORY_IMPORT_PROTOCOL.md)
- [REPAIR_ORDER.md](REPAIR_ORDER.md)
