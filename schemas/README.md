# Schemas

JSON Schema definitions for Factory certification artifacts.

All schemas use [JSON Schema draft 2020-12](https://json-schema.org/draft/2020-12/schema).

## Artifact mapping

| Schema | Certification file |
|--------|-------------------|
| factory-manifest.schema.json | factory-manifest.json |
| factory-audit.schema.json | factory-audit.json |
| factory-health.schema.json | factory-health.json |
| factory-qualification.schema.json | factory-qualification.json |
| factory-event.schema.json | factory-events.json (optional) |
| factory-object.schema.json | factory-objects.json (optional) |
| factory-citadel-archive.schema.json | factory-citadel-archive.json (optional) |
| compatibility.schema.json | compatibility.json (optional, recommended) |
| factory-report.schema.json | factory-report-meta.json (optional sidecar — **not enforced**; see [FACTORY_REPORT_METADATA.md](../docs/FACTORY_REPORT_METADATA.md)) |

## Validation

Validate artifacts with any JSON Schema validator supporting draft 2020-12.

Example using Node.js `ajv`:

```bash
npx ajv validate -s schemas/factory-manifest.schema.json -d examples/citadel/factory-manifest.json
```

## Versioning

Schema breaking changes require a new major `standardsVersion` in tenant manifests.
