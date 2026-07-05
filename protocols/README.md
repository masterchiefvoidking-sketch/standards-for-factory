# Protocols

Machine-readable protocol definitions for Factory certification and import.

Protocols describe **process**, not application code. Each protocol maps to documentation in `docs/`.

## Active protocols

| Protocol ID | Document | Purpose |
|-------------|----------|---------|
| `factory.certification.v1` | [FACTORY_CERTIFICATION_PROTOCOL.md](../docs/FACTORY_CERTIFICATION_PROTOCOL.md) | Generate and validate certification packages |
| `factory.tenant.v1` | [TENANT_REPOSITORY_PROTOCOL.md](../docs/TENANT_REPOSITORY_PROTOCOL.md) | Tenant repo responsibilities |
| `factory.import.v1` | [FACTORY_IMPORT_PROTOCOL.md](../docs/FACTORY_IMPORT_PROTOCOL.md) | Import packages into Factory |
| `factory.qualification.v1` | [QUALIFICATION_LOOP_STANDARD.md](../docs/QUALIFICATION_LOOP_STANDARD.md) | Qualification loop execution |
| `factory.citadel-handoff.v1` | [CITADEL_ARCHIVE_HANDOFF.md](../docs/CITADEL_ARCHIVE_HANDOFF.md) | Optional Citadel archive export |
| `factory.repair.v1` | [REPAIR_ORDER.md](../docs/REPAIR_ORDER.md) | Repair priority ordering |

## Protocol envelope

Each protocol artifact in a certification package references its protocol ID in metadata:

```json
{
  "protocol": "factory.certification.v1",
  "protocolVersion": "1.0.0",
  "generatedAt": "2026-07-05T00:00:00Z"
}
```

## Versioning

- **Major**: breaking change to required fields or process steps.
- **Minor**: additive fields or optional steps.
- **Patch**: documentation clarifications only.
