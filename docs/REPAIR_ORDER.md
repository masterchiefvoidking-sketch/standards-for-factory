# Repair Order

Protocol ID: `factory.repair.v1`  
Version: 1.0.0

## Purpose

Defines priority order for repairing certification failures. Lower `repairPriority` numbers are fixed first.

## Priority levels

| Priority | Name | Fix before |
|----------|------|------------|
| 1 | Critical | Anything else |
| 2 | High | Medium and below |
| 3 | Medium | Low and cosmetic |
| 4 | Low | Cosmetic only |
| 5 | Cosmetic | Re-certification optional |

## Priority 1 — Critical (fix immediately)

| Category | Examples |
|----------|----------|
| Security | Exposed secrets, credentials in repo or package |
| Schema | Required artifacts fail validation |
| Package | Missing required certification files |
| Integrity | Fraudulent integration claims |

**Rule:** Do not re-submit package until all priority-1 items resolved.

## Priority 2 — High

| Category | Examples |
|----------|----------|
| Audit | Required audit checks failing |
| Health | Status `unhealthy` |
| Build | Cannot build tenant application |
| Qualification | Required criteria `unmet` |

## Priority 3 — Medium

| Category | Examples |
|----------|----------|
| Documentation | Missing README or certification docs |
| Integration | Declared integrations not yet implemented (document honestly) |
| Warnings | Audit checks with `warn` status |
| Dependencies | Required dependencies unavailable |

## Priority 4 — Low

| Category | Examples |
|----------|----------|
| Optional artifacts | Missing factory-events.json when events exist |
| Report quality | Incomplete factory-report.md sections |
| Metadata | Stale but non-critical commit references |

## Priority 5 — Cosmetic

| Category | Examples |
|----------|----------|
| Formatting | Markdown style, JSON key ordering |
| Naming | Non-standard but valid file names |
| Comments | Documentation polish |

## Repair workflow

```text
1. Sort failed checks by repairPriority ascending
2. Fix all priority-1 items
3. Fix priority-2 items
4. Re-run certification protocol (full audit, not partial)
5. Validate schemas
6. Re-submit package
7. Address priority-3+ in subsequent iterations if needed
```

## Mapping audit checks to repair

Each failed check in `factory-audit.json` should include:

```json
{
  "status": "fail",
  "remediation": "Remove .env from repo; rotate exposed keys",
  "repairPriority": 1
}
```

## Blocker resolution

Qualification `blockers` must reference audit check IDs via `repairRef` when applicable.

## Re-certification requirement

After repairs:

1. Increment `iteration` in qualification
2. Regenerate all artifacts (not just fixed files)
3. Update `generatedAt` timestamps
4. Create new zip with new audit/loop IDs

## Do not

- Mark checks as `pass` without fixing underlying issues
- Waive priority-1 or priority-2 failures without standards amendment
- Patch qualification status without re-auditing

---

*See also: [QUALIFICATION_LOOP_STANDARD.md](QUALIFICATION_LOOP_STANDARD.md), [FACTORY_CERTIFICATION_PROTOCOL.md](FACTORY_CERTIFICATION_PROTOCOL.md)*
