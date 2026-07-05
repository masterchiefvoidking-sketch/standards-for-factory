# Tenant Requalification Prompt

**Paste this into Cursor after repairs pass validation.**

---

## FACTORY TENANT REQUALIFICATION

The certification package passes factory-standards validation. Complete the qualification loop and prepare for Factory import.

### Prerequisites

- `npm run validate:package -- imports/<tenantId>` exits 0 (PASS)
- All validation **errors** resolved (warnings may remain)

### Step 1 — Review scores

Read `validation-report.md`:

| Score | Target |
|-------|--------|
| Completeness | ≥ 80 |
| Schema Validity | 100 |
| Mission Clarity | ≥ 90 |
| Factory Readiness | ≥ 70 |
| Overall | ≥ 80 |

If scores are low, address warnings before claiming qualified.

### Step 2 — Update qualification status

In `factory-qualification.json`:

- Set `status` to `qualified`, `provisional`, or `unqualified` based on truth:
  - `qualified` — audit pass, health healthy/degraded, all required criteria met
  - `provisional` — minor issues with documented `expiresAt`
  - `unqualified` — still blocked (should not reach this prompt)
- Set `qualifiedAt` if qualified.
- Clear `blockers` or document remaining items.

### Step 3 — Finalize audit

Ensure `factory-audit.json` `status` reflects reality:

- `pass` — all required checks pass
- `partial` — non-blocking warnings only
- `fail` — do not claim qualified

### Step 4 — Update factory-report.md

Final report with:

- Executive summary with final statuses
- Validation scores from factory-standards
- Remaining warnings and remediation plan
- Confirmation package is ready for Factory import

### Step 5 — Re-package

```bash
npx tsx tenant-certification-kit/scripts/package-certification.ts factory-certification
```

### Step 6 — Final validation

```bash
# In factory-standards
npm run validate:package -- imports/<tenantId>
```

Must PASS.

### Step 7 — Factory import

Copy final `<tenantId>-factory-certification.zip` to `factory-standards/imports/<tenantId>/`.

Factory imports the package per `FACTORY_IMPORT_PROTOCOL.md`. Factory does not crawl this repo.

### Iteration tracking

- Increment `iteration` on each requalification cycle.
- New `auditId` and `loopId` per cycle.
- Update all `generatedAt` timestamps.

### Success

Tenant is qualified and ready for Factory import. Package is the proof — not live repo access.
