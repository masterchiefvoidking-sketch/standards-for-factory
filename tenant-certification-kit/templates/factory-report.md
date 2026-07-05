# Factory Certification Report

**Tenant:** TENANT_NAME (`TENANT_ID`)  
**Generated:** REPLACE_ISO8601  
**Iteration:** 1  
**Report ID:** report-REPLACE_TIMESTAMP

## Executive Summary

| Dimension | Status |
|-----------|--------|
| Qualification | in-progress |
| Audit | pending |
| Health | unknown |

**Headline:** _One-line truthful summary of certification state._

**Recommendation:** _Package for factory-standards validation / repair required._

## Repository Truth

### Purpose

_What this repo actually does._

### Structure discovered

| Area | Findings |
|------|----------|
| Routes | _list or N/A_ |
| Modules | _list_ |
| Stores | _list or N/A_ |
| Scripts | _package.json scripts_ |
| Tests | _test framework and location_ |
| Docs | _README, docs/_ |

## Command results

| Command | Result | Notes |
|---------|--------|-------|
| npm install | _pass/fail/skip_ | |
| npm test | _pass/fail/skip_ | |
| npm run build | _pass/fail/skip_ | |
| npm run lint | _pass/fail/skip_ | |

## Integration honesty

| Integration | Declared | Implemented | Mode |
|-------------|----------|-------------|------|
| factory | yes/no | yes/no | mock/manual/imported/connected |

## Package Contents

| Artifact | Present | Valid |
|----------|---------|-------|
| factory-manifest.json | ☐ | ☐ |
| factory-audit.json | ☐ | ☐ |
| factory-health.json | ☐ | ☐ |
| factory-qualification.json | ☐ | ☐ |
| factory-report.md | ☐ | — |

## Blockers

_List blockers preventing qualification._

## Next Steps

1. Package: `npx tsx tenant-certification-kit/scripts/package-certification.ts factory-certification`
2. Copy zip to `factory-standards/imports/TENANT_ID/`
3. Validate: `npm run validate:package -- imports/TENANT_ID`
4. Repair using TENANT_REPAIR_PROMPT.md if validation fails

---

_Generated per factory-standards tenant-certification-kit v1.0.0_
