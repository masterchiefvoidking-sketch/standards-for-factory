# Tenant Repair Prompt

**Paste this into Cursor after factory-standards validation fails.**

---

## FACTORY TENANT REPAIR

Validation failed for this tenant's certification package. Repair the **tenant repository** and regenerate the package.

### Input

Read the validation report from factory-standards:

```text
factory-standards/imports/<tenantId>/validation-report.md
factory-standards/imports/<tenantId>/validation-report.json
```

Or the report written into the package directory during validation.

### Rules

1. Fix **errors** first (priority 1–2 per REPAIR_ORDER.md).
2. Do not redesign or add unrelated features.
3. Do not fake integrations to pass validation.
4. Update integration `modes` honestly after any integration change.
5. Re-run npm install, test, build, lint after fixes.
6. Regenerate **all** certification artifacts (not just the failed file).
7. Increment `iteration` in `factory-qualification.json`.

### Repair loop

```text
1. Read validation-report.md — list all errors and warnings
2. Sort by repairPriority (1 = critical first)
3. Fix root cause in tenant repo
4. Re-run command checks (npm test, build, lint)
5. Update factory-audit.json, factory-health.json, factory-qualification.json, factory-report.md
6. Update factory-manifest.json if integration/capability claims changed
7. Re-package:
   npx tsx tenant-certification-kit/scripts/package-certification.ts factory-certification
8. Re-copy to factory-standards/imports/<tenantId>/
9. Re-validate:
   npm run validate:package -- imports/<tenantId>
10. Repeat until pass
```

### Common fixes

| Validation error | Repair action |
|------------------|---------------|
| `tenant.mismatch` | Align `tenantId` across all JSON files |
| `mission.missing` | Add `mission`, `owns`, `doesNotOwn` to manifest |
| `health.unhealthy` | Fix build/tests; update health status honestly |
| `qualification.missing-gate` | Add all 6 required criteria |
| `integration.fake-connected-mode` | Change mode to mock/manual OR implement integration |
| `integration.fake-live` | Set dependency status to optional-missing or implement |
| `schema.invalid` | Fix JSON to match factory-standards schemas |

### Integration mode corrections

| Situation | Correct mode |
|-----------|--------------|
| No live connection | `mock` or `manual` |
| Data via zip import only | `imported` |
| Live API/SDK verified | `connected` + add to `implemented` |

### After repair

Use `TENANT_REQUALIFICATION_PROMPT.md` for the final qualification pass.
