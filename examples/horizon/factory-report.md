# Factory Certification Report — Horizon

**Tenant:** Horizon (`horizon`)  
**Generated:** 2026-07-05T12:00:00Z  
**Iteration:** 1  
**Report ID:** report-20260705-120000

## Executive Summary

| Dimension | Status |
|-----------|--------|
| Qualification | unqualified |
| Audit | fail |
| Health | unhealthy |

**Headline:** Horizon package submitted but build and tests fail.

**Recommendation:** Do not register. Repair build/test setup and re-certify.

## Blockers

1. Build failure — add `.env.example` and fix configuration (priority 2)
2. Test failure — fix test fixtures (priority 2)

## Next Steps

1. Add environment documentation
2. Fix build and test pipeline
3. Re-run full certification protocol
4. Re-submit `horizon-factory-certification.zip` to `imports/horizon/`

---

*Example package — factory-standards v1.0.0*
