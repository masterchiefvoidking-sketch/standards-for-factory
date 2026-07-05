# Validation Examples

Curated packages for proving the validation engine.

| Package | Expected result | Demonstrates |
|---------|-----------------|--------------|
| [citadel-valid/](citadel-valid/) | **PASS** | Complete, schema-valid package with optional Citadel archive |
| [horizon-invalid/](horizon-invalid/) | **FAIL** | tenantId mismatch, unhealthy status, missing gates, fake integration, responsibility overlap |

## Run validation

```bash
npm run validate:package -- imports/examples/citadel-valid
npm run validate:package -- imports/examples/horizon-invalid
npm run validate:examples
```

Reports are written into each package directory as `validation-report.json` and `validation-report.md`.
