# Factory Certification Protocol

Protocol ID: `factory.certification.v1`  
Version: 1.0.0

## Overview

The Factory Certification Protocol defines how a tenant repository produces a valid certification package for import into Factory or factory-standards.

This protocol runs **inside the tenant repo**. Factory Standards does not execute it remotely.

## Prerequisites

- Tenant repository checked out locally
- Access to factory-standards schemas and templates (clone or copy)
- Cursor or equivalent audit tooling

## Steps

### 1. Initialize

Copy templates from factory-standards into a working directory (e.g. `factory-certification/` in the tenant repo):

```text
factory-certification/
  factory-manifest.json
  factory-audit.json
  factory-health.json
  factory-qualification.json
  factory-report.md
```

### 2. Populate manifest

Fill `factory-manifest.json` with:

- Accurate tenant identity
- Repository metadata including current `commitSha`
- Honest capability and integration declarations
- `standardsVersion` matching factory-standards release

### 3. Run audit

Execute audit checks against the tenant codebase. Record results in `factory-audit.json`.

Minimum audit categories:

| Category | Examples |
|----------|----------|
| structure | Required dirs, config files, build setup |
| security | Secrets scan, dependency audit |
| integration | Declared vs implemented integrations |
| documentation | README, API docs |
| schema | Artifacts validate against schemas |
| health | Build/test signals |
| qualification | Criteria readiness |

Set each check `status` to `pass`, `fail`, `skip`, or `warn`.  
Assign `repairPriority` (1–5) for failures per [REPAIR_ORDER.md](REPAIR_ORDER.md).

### 4. Capture health

Record build, test, and dependency status in `factory-health.json` at certification time.

Do not fabricate runtime metrics. Use `unknown` when signals cannot be measured.

### 5. Run qualification loop

Evaluate criteria in `factory-qualification.json` per [QUALIFICATION_LOOP_STANDARD.md](QUALIFICATION_LOOP_STANDARD.md).

### 6. Write report

Produce `factory-report.md` summarizing audit, health, and qualification state. Include blockers and next steps.

### 7. Optional artifacts

If applicable, generate:

- `factory-events.json` — event catalog
- `factory-objects.json` — domain object registry
- `factory-citadel-archive.json` — per [CITADEL_ARCHIVE_HANDOFF.md](CITADEL_ARCHIVE_HANDOFF.md)

### 8. Validate

Validate all JSON artifacts against schemas in factory-standards `schemas/`.

### 9. Package

Create zip:

```text
{tenant-slug}-factory-certification.zip
```

Contents: all required files at zip root (no nested folder required, but consistent naming is mandatory).

### 10. Deliver

Copy package to:

- `factory-standards/imports/{tenant}/`, or
- Factory import endpoint when available

## Audit status rules

| Status | Meaning |
|--------|---------|
| `pass` | All required checks passed |
| `fail` | One or more required checks failed |
| `partial` | Non-blocking failures only |
| `pending` | Audit incomplete |

## Certification prompt (Cursor)

Use this prompt inside a tenant repo:

```text
Run the Factory Tenant Certification Protocol.

Reference: factory-standards docs/TENANT_REPOSITORY_PROTOCOL.md
Templates: factory-standards/templates/
Schemas: factory-standards/schemas/

Generate a complete certification package for this repository.
Validate all JSON against schemas.
Output: {tenant}-factory-certification.zip
```

## Re-certification

Re-run the full protocol after any repair. Increment `iteration` in qualification. Do not patch individual artifacts without re-auditing.

---

*See also: [TENANT_REPOSITORY_PROTOCOL.md](TENANT_REPOSITORY_PROTOCOL.md), [FACTORY_IMPORT_PROTOCOL.md](FACTORY_IMPORT_PROTOCOL.md)*
