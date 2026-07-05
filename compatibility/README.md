# Compatibility Matrix

Version requirements across the Factory ecosystem. Prevents accidental tenant breakage.

**Machine-readable:** [matrix.json](matrix.json)

## Current minimum versions

| Component | Version |
|-----------|---------|
| factory-standards | >=1.0.0 |
| factory-core | >=1.0.0 |
| Certification schema | 1.0 |

## Repository requirements

### factory-core

```text
requires factory-standards >=1.0.0
```

### Applications (all tenants)

```text
requires factory-core >=1.0.0
requires factory-standards >=1.0.0
```

| Tenant | core | standards |
|--------|------|-----------|
| Factory | >=1.0.0 | >=1.0.0 |
| Citadel | >=1.0.0 | >=1.0.0 |
| Forgina | >=1.0.0 | >=1.0.0 |
| BossLady | >=1.0.0 | >=1.0.0 |
| Horizon | >=1.0.0 | >=1.0.0 |

## Certification package

Every package should include `compatibility.json`:

```json
{
  "protocol": "factory.compatibility.v1",
  "protocolVersion": "1.0.0",
  "tenantId": "citadel",
  "requires": {
    "factory-core": ">=1.0.0",
    "factory-standards": ">=1.0.0"
  },
  "schema": "1.0"
}
```

Schema: `schemas/compatibility.schema.json`  
Template: `templates/compatibility.template.json`

## Validation

When `compatibility.json` is present, the validator checks:

1. Schema validity
2. `tenantId` matches manifest
3. Declared versions satisfy `compatibility/matrix.json` for that tenant

## Updating versions

1. Bump `matrixVersion` in matrix.json
2. Update this document
3. Notify tenants to refresh compatibility.json
4. Supreme Court rule: standards owns the matrix — see [SUPREME_COURT.md](../docs/SUPREME_COURT.md)

## Related

- [CERTIFICATION_PACKAGE_LAYOUT.md](../docs/CERTIFICATION_PACKAGE_LAYOUT.md)
- [FOUNDATION_STABILITY.md](../docs/FOUNDATION_STABILITY.md)
