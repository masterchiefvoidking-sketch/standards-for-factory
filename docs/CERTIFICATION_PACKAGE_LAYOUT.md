# Certification Package Layout

Standard layout for Factory tenant certification packages.

## Package delivery

Packages are delivered as:

```text
{tenant-slug}-factory-certification.zip
```

Example: `citadel-factory-certification.zip`

Place extracted contents or zips in `factory-standards/imports/{tenant}/`.

## Required files (package root)

| File | Format | Schema |
|------|--------|--------|
| `factory-manifest.json` | JSON | `schemas/factory-manifest.schema.json` |
| `factory-audit.json` | JSON | `schemas/factory-audit.schema.json` |
| `factory-health.json` | JSON | `schemas/factory-health.schema.json` |
| `factory-qualification.json` | JSON | `schemas/factory-qualification.schema.json` |
| `factory-report.md` | Markdown | _(presence + non-empty)_ |

All required files must exist at the zip root (or single top-level directory inside the zip).

## Optional files

| File | Format | Schema |
|------|--------|--------|
| `factory-events.json` | JSON | `schemas/factory-event.schema.json` |
| `factory-objects.json` | JSON | `schemas/factory-object.schema.json` |
| `factory-citadel-archive.json` | JSON | `schemas/factory-citadel-archive.schema.json` |

## Manifest responsibilities

`factory-manifest.json` must include:

| Field | Purpose |
|-------|---------|
| `mission.statement` | What this tenant does in Factory (min 10 chars) |
| `owns` | Responsibilities this tenant owns |
| `doesNotOwn` | Responsibilities explicitly outside scope |
| `integrations.declared` | Integrations the tenant intends to support |
| `integrations.implemented` | Integrations verified at certification time |

`owns` and `doesNotOwn` must not overlap.

## Cross-file consistency

| Rule | Files |
|------|-------|
| `tenantId` matches | manifest `tenant.id` = audit, health, qualification `tenantId` |
| Qualification gates | All 6 required criteria present in qualification |
| Integration honesty | `implemented` ⊆ `declared`; no fake live dependencies |
| Health acceptable | Status must not be `unhealthy` |

## Required qualification gates

Every `factory-qualification.json` must include:

- `crit.manifest-valid`
- `crit.audit-pass`
- `crit.health-acceptable`
- `crit.report-complete`
- `crit.package-complete`
- `crit.integration-honesty`

## Directory layout example

```text
citadel-factory-certification.zip
├── factory-manifest.json
├── factory-audit.json
├── factory-health.json
├── factory-qualification.json
├── factory-report.md
├── factory-events.json              # optional
├── factory-objects.json             # optional
└── factory-citadel-archive.json     # optional
```

## Validation

```bash
npm run validate:package -- imports/citadel
npm run validate:package -- imports/citadel-factory-certification.zip
```

See [VALIDATION_ENGINE.md](VALIDATION_ENGINE.md) for full inspector documentation.
