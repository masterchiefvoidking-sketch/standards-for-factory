# Imports

Drop zone for tenant Factory Certification Packages.

Factory Standards does **not** fetch tenant repos automatically. Packages arrive here as zips (or extracted directories) after running the certification protocol inside each tenant repo.

## Directory layout

```text
imports/
  citadel/     # citadel-factory-certification.zip
  factory/     # factory-factory-certification.zip
  forgina/     # forgina-factory-certification.zip
  horizon/     # horizon-factory-certification.zip
  bosslady/    # bosslady-factory-certification.zip
  ...
```

## Import workflow

1. Tenant repo generates `{tenant}-factory-certification.zip`.
2. Copy or extract into `imports/{tenant}/`.
3. Validate all required files against `schemas/`.
4. Record validation results (manual or via Factory import tooling).
5. If validation fails, follow `docs/REPAIR_ORDER.md` in the tenant repo and re-submit.

## Required package contents

- `factory-manifest.json`
- `factory-audit.json`
- `factory-health.json`
- `factory-qualification.json`
- `factory-report.md`

## Optional package contents

- `factory-events.json`
- `factory-objects.json`
- `factory-citadel-archive.json`

## Notes

- Do not commit secrets, credentials, or private keys in certification packages.
- Example packages live in `examples/`; imported packages in `imports/` reflect real tenant state.
- Zips are the recommended bridge until automated import is wired in Factory.
