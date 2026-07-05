# Factory Certification Report — Citadel

**Tenant:** Citadel (`citadel`)  
**Generated:** 2026-07-05T12:00:00Z  
**Iteration:** 1  
**Report ID:** report-20260705-120000

## Executive Summary

| Dimension | Status |
|-----------|--------|
| Qualification | provisional |
| Audit | partial |
| Health | degraded |

**Headline:** Citadel certifies with archive handoff ready; Horizon integration pending.

**Recommendation:** Accept provisionally. Re-certify after Horizon integration or manifest update.

## Package Contents

| Artifact | Present | Valid |
|----------|---------|-------|
| factory-manifest.json | ✓ | ✓ |
| factory-audit.json | ✓ | ✓ |
| factory-health.json | ✓ | ✓ |
| factory-qualification.json | ✓ | ✓ |
| factory-report.md | ✓ | — |
| factory-events.json | ✓ | ✓ |
| factory-objects.json | ✓ | ✓ |
| factory-citadel-archive.json | ✓ | ✓ |

## Audit Highlights

- Structure, security, and schema checks passed
- Horizon integration check failed (declared but not implemented)
- Two flaky archive tests flagged as warnings

## Health Highlights

- Build: OK
- Tests: WARN (98% pass)
- Archive export: OK

## Blockers

1. Horizon integration not implemented — repair priority 3

## Next Steps

1. Implement Horizon client or update manifest integrations
2. Stabilize flaky archive tests
3. Re-run certification before 2026-08-05

---

*Example package — factory-standards v1.0.0*
