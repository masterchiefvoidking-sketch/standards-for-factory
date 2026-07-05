# Examples

Valid sample certification packages demonstrating schema-compliant artifacts.

These are **reference examples**, not live imports. Real tenant packages go in `imports/{tenant}/`.

| Tenant | Qualification | Notes |
|--------|---------------|-------|
| [citadel/](citadel/) | provisional | Includes citadel archive + events + objects |
| [factory/](factory/) | qualified | Core orchestrator |
| [forgina/](forgina/) | qualified | Standard tenant |
| [horizon/](horizon/) | unqualified | Example failure state for repair workflow |
| [bosslady/](bosslady/) | qualified | Minor doc warnings |

## Packaging examples as zips

```bash
cd examples/citadel && zip -r ../../imports/citadel/citadel-factory-certification.zip .
```

Or from repo root:

```bash
for tenant in citadel factory forgina horizon bosslady; do
  (cd "examples/$tenant" && zip -r "../../imports/$tenant/${tenant}-factory-certification.zip" .)
done
```
