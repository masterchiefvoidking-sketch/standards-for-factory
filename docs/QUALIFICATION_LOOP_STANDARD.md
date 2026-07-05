# Qualification Loop Standard

Protocol ID: `factory.qualification.v1`  
Version: 1.0.0

## Purpose

Defines the qualification loop: the iterative process by which a tenant moves from uncertified to qualified status.

## Loop diagram

```text
┌─────────────┐
│   AUDIT     │  Run certification protocol in tenant repo
└──────┬──────┘
       ▼
┌─────────────┐
│  VALIDATE   │  Schema + cross-check in factory-standards
└──────┬──────┘
       ▼
┌─────────────┐
│   REVIEW    │  Human or Factory review of factory-report.md
└──────┬──────┘
       ▼
    Qualified? ──no──▶ REPAIR ──▶ iteration++ ──▶ AUDIT
       │
      yes
       ▼
┌─────────────┐
│  REGISTER   │  Factory accepts tenant as qualified
└─────────────┘
```

## Qualification statuses

| Status | Definition |
|--------|------------|
| `qualified` | All required criteria met; audit pass; health acceptable |
| `provisional` | Core criteria met; minor warnings; time-bound acceptance |
| `unqualified` | Required criteria unmet |
| `in-progress` | Loop active; package incomplete or under review |

## Required criteria

Every tenant must evaluate these criteria in `factory-qualification.json`:

| ID | Name | Required |
|----|------|----------|
| `crit.manifest-valid` | Manifest validates against schema | Yes |
| `crit.audit-pass` | Audit status is `pass` | Yes |
| `crit.health-acceptable` | Health is `healthy` or `degraded` (not `unhealthy`) | Yes |
| `crit.report-complete` | factory-report.md present and complete | Yes |
| `crit.package-complete` | All required package files present | Yes |
| `crit.integration-honesty` | No declared integrations falsely marked implemented | Yes |

Tenants may add tenant-specific criteria. They must not remove required criteria.

## Criterion results

| Result | Meaning |
|--------|---------|
| `met` | Criterion satisfied with evidence |
| `unmet` | Criterion failed |
| `waived` | Explicitly waived with documented justification |
| `pending` | Not yet evaluated |

Required criteria cannot be waived without standards amendment.

## Iteration tracking

- `iteration` starts at 1 on first certification attempt
- Increment on each re-certification after repair
- `loopId` should be unique per qualification campaign
- Record `qualifiedAt` when status becomes `qualified`

## Blockers

Document blockers preventing qualification:

```json
{
  "blockers": [
    {
      "id": "blocker.audit-fail-security",
      "description": "Secrets found in config/",
      "repairRef": "check.secrets-scan"
    }
  ]
}
```

## Provisional qualification

Grant `provisional` only when:

1. All required criteria are `met` or explicitly minor
2. Audit status is `pass` or `partial` with no security failures
3. `expiresAt` is set for re-certification
4. Documented in `factory-report.md`

## Exit conditions

### Qualified

- All required criteria `met`
- Audit `pass`
- Health `healthy` or `degraded`
- No unresolved priority-1 or priority-2 blockers

### Unqualified

- Any required criterion `unmet`
- Audit `fail`
- Health `unhealthy`

---

*See also: [REPAIR_ORDER.md](REPAIR_ORDER.md), [FACTORY_CERTIFICATION_PROTOCOL.md](FACTORY_CERTIFICATION_PROTOCOL.md)*
