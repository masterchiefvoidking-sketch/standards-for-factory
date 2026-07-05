# Examples

Reference certification packages demonstrating schema-compliant artifacts.

These are **reference examples**, not live imports. Real tenant certification packages go in `imports/{tenant}/`.

| Tenant | Validator | Qualification | Notes |
|--------|-----------|---------------|-------|
| [citadel/](citadel/) | PASS | provisional | Includes citadel archive + events + objects |
| [factory/](factory/) | PASS | qualified | Simplified orchestrator reference (not the live Factory HQ import) |
| [forgina/](forgina/) | PASS | qualified | Standard tenant |
| [horizon/](horizon/) | **FAIL** | unqualified | **Intentional** failure reference — unhealthy health status |
| [bosslady/](bosslady/) | PASS | qualified | Standard tenant |

Curated pass/fail fixtures for CI: `imports/examples/citadel-valid` and `imports/examples/horizon-invalid`.

## Validate reference examples

```bash
npm run validate:package -- examples/citadel
npm run validate:package -- examples/horizon   # expected FAIL
```

## Package examples as zips

Use the canonical packager (not manual zip):

```bash
npm run package:certification -- examples/citadel imports/citadel
```

Or from repo root for all placeholder imports:

```bash
for tenant in citadel bosslady forgina horizon; do
  npm run package:certification -- examples/$tenant imports/$tenant
done
```

**Note:** `imports/factory/` and `imports/factory-core/` contain real certification Run 001 packages — regenerate only from those folders, not from `examples/factory`.
