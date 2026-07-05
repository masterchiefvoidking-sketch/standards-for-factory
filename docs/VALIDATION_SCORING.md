# Validation Scoring

How the factory-standards validation engine computes readiness scores.

## Score dimensions

Each dimension is scored **0–100**.

| Dimension | What it measures |
|-----------|------------------|
| **Completeness** | Required and optional files present |
| **Schema Validity** | JSON artifacts passing JSON Schema validation |
| **Mission Clarity** | Mission statement, owns/doesNotOwn, no responsibility overlap |
| **Factory Readiness** | Audit, health, and qualification gate readiness |
| **Citadel Handoff Readiness** | Citadel archive validity when applicable |
| **Overall** | Mean of all five dimensions |

## Completeness (0–100)

```text
80% weight → required files present (5 files)
20% weight → optional files present (4 files)
```

Optional files counted:

1. `compatibility.json` (recommended)
2. `factory-events.json`
3. `factory-objects.json`
4. `factory-citadel-archive.json`

| Required present | Optional present | Score |
|------------------|------------------|-------|
| 5/5 | 4/4 | 100 |
| 5/5 | 0/4 | 80 |
| 3/5 | 0/4 | 48 |

## Schema Validity (0–100)

```text
(valid JSON files / total JSON files) × 100
```

Files that fail JSON parse count as schema failures. Each file is validated against its mapped schema in `schemas/`.

`factory-report.md` is not JSON — checked for presence only.

## Mission Clarity (0–100)

Starts at **100**, then deductions:

| Issue | Deduction |
|-------|-----------|
| Missing `mission.statement` | −25 per error |
| Missing `owns` | −25 |
| Missing `doesNotOwn` | −25 |
| Item in both `owns` and `doesNotOwn` | −15 per overlap (warning) |

Floor: 0. Ceiling: 100.

## Factory Readiness (0–100)

Starts at **100**, then deductions:

| Condition | Deduction |
|-----------|-----------|
| Audit status not `pass` or `partial` | −25 |
| Health status not `healthy` or `degraded` | −30 |
| Each missing qualification gate | −10 |
| Each required criterion with `result: unmet` | −10 |

Floor: 0. Ceiling: 100.

## Citadel Handoff Readiness (0–100)

| Scenario | Score |
|----------|-------|
| No archive, tenant is not `citadel` | 100 (N/A) |
| No archive, tenant is `citadel` | 50 |
| Archive present and schema-valid | 100 |
| Archive present with errors | 100 − (25 × error count), min 0 |

## Lifecycle warnings (do not change pass/fail alone)

| Warning | Trigger |
|---------|---------|
| `lifecycle.certified-mismatch` | `certified: true` but errors exist, or `certified: false` but pass |
| `lifecycle.qualification-drift` | `qualificationPercent` differs from overall score by >10 |

## Compatibility warnings and errors

| Code | Severity | Trigger |
|------|----------|---------|
| `compatibility.missing` | warning | No `compatibility.json` |
| `compatibility.below-matrix` | error | Declared version below matrix minimum |
| `compatibility.tenant-mismatch` | error | `tenantId` ≠ manifest |

## Overall (0–100)

```text
Overall = round(mean(Completeness, Schema Validity, Mission Clarity, Factory Readiness, Citadel Handoff Readiness))
```

## Pass vs fail

**Pass** requires zero **errors**. Warnings do not fail validation but reduce scores and appear in the report.

| Severity | Effect |
|----------|--------|
| `error` | Validation fails |
| `warning` | Validation may pass; issue surfaced in report |
| `info` | Informational only |

## Interpreting scores

| Overall | Interpretation |
|---------|----------------|
| 90–100 | Ready for Factory import |
| 70–89 | Provisionally acceptable; address warnings |
| 50–69 | Significant gaps; repair required |
| 0–49 | Not ready; major blockers |

Scores are guidance. **Pass/fail** is determined solely by error count.

## Example scores

### citadel-valid (PASS)

Typical scores: Completeness 100, Schema 100, Mission 100, Factory ~85 (partial audit), Citadel 100.

### horizon-invalid (FAIL)

Typical scores: Completeness 85+, Schema 100, Mission 85 (overlap warning), Factory ~45, Citadel 100.

### examples/horizon (FAIL — intentional)

Fails on `health.unhealthy` — reference unqualified package.

---

*See [VALIDATION_ENGINE.md](VALIDATION_ENGINE.md) for running the validator.*
