# Factory-Standards Repair Plan — Completion Pass 1

**Created:** 2026-07-05  
**Source of truth:** [docs/audits/ACTUAL_STATE_AUDIT.md](../audits/ACTUAL_STATE_AUDIT.md)  
**Goal:** Clean foundation baseline without redesign

---

## Confirmed audit defects

| ID | Defect | Severity | Evidence |
|----|--------|----------|----------|
| R-01 | `npm run typecheck` missing | Medium | Audit Phase 10 exit 1 |
| R-02 | `examples/` stale — missing `lifecycle` | High | `validate:package` FAIL on examples |
| R-03 | Import zips lack `lifecycle` while some folders pass | High | factory zip FAIL 89; folder PASS 95 |
| R-04 | Kit packager drifts from `src/package-certification.ts` | Medium | Missing `compatibility.json` in kit OPTIONAL |
| R-05 | `factory-report.schema.json` unwired | Low | Not in `SCHEMA_MAP`; ambiguous purpose |
| R-06 | `VALIDATION_ENGINE.md` / `VALIDATION_SCORING.md` lag code | Medium | No lifecycle/compatibility; wrong optional count |
| R-07 | npm audit dev dependency vulnerabilities | Low | 5 issues in vitest/vite chain |
| R-08 | No CI workflow | Low | No `.github/workflows` in audit |
| R-09 | `examples/` vs `imports/examples/` confusion | Medium | Two example trees |
| R-10 | Self-certification badge without import package | Low | README claims 100% without validator run on repo itself |

---

## Severity definitions

| Level | Meaning |
|-------|---------|
| **High** | Breaks trust in law layer — stale artifacts or false PASS |
| **Medium** | Drift, confusion, or missing baseline tooling |
| **Low** | Documented gap; does not block foundation use |

---

## Dependency order

```text
R-01 typecheck          (no deps)
R-05 report metadata    (docs only)
R-04 packager unify     (before zip regen)
R-02 examples fix       (before placeholder zip regen)
R-03 zip regeneration   (depends on R-02, R-04)
R-06 docs sync          (after code truth stable)
R-08 tests              (with each change)
R-07 npm audit          (record only — no force fix in pass 1)
```

---

## Safe repair sequence

### Pass 1A — Tooling baseline
1. Add `npm run typecheck` → `tsc --noEmit`
2. Add canonical `scripts/package-certification.ts` CLI
3. Delegate kit script to canonical CLI

### Pass 1B — Artifact truth
4. Update `examples/` manifests: `lifecycle`, `compatibility.json`, integration `modes`
5. Regenerate zips from **canonical folders**:
   - `imports/factory/` → `factory-factory-certification.zip`
   - `imports/factory-core/` → `factory-core-factory-certification.zip`
   - `imports/examples/citadel-valid/` → `citadel-factory-certification.zip`
   - `examples/{citadel,bosslady,forgina,horizon}/` → `imports/{tenant}/` zips
6. Write `docs/repair/ZIP_VALIDATION_REPORT.md` via `npm run validate:zips`

### Pass 1C — Clarity
7. Document `factory-report.schema.json` as optional sidecar (not enforced)
8. Sync VALIDATION_ENGINE, VALIDATION_SCORING, README, examples README
9. Add tests for packager delegation and optional file count

### Pass 1D — Verify
10. Run full command battery; write `REPAIR_RESULT.md`

---

## Done criteria

| Criterion | Target |
|-----------|--------|
| `npm test` | 20+ tests PASS |
| `npm run build` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `examples/` (except horizon) | Validator PASS |
| `examples/horizon` | Validator FAIL (intentional reference) |
| Import zips (except horizon) | Validator PASS |
| Kit packager | Delegates to canonical CLI |
| `factory-report.schema.json` | Documented — not ambiguous |
| Docs | lifecycle, compatibility, 4 optional files, scoring |

---

## Out of scope (Pass 1)

- Redesigning validator architecture
- Wiring `factory-report-meta.json` into validator
- Fixing npm audit via `npm audit fix --force` (breaking vitest upgrade)
- Creating factory-standards self-certification import package
- Adding GitHub Actions CI
- Repairing factory-core or factory repos

---

## Rollback

All changes are documentation, example artifacts, zip regeneration, and script additions. Roll back via git revert on branch `cursor/factory-standards-completion-pass1-eb83`.
