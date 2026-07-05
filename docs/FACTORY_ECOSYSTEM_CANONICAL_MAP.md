# Factory Ecosystem Canonical Map

**Document role:** Governing blueprint for the entire Factory ecosystem. Every future repair, feature, and certification must align with this map.  
**Author role:** Factory Systems Architect synthesis (investigation only — no redesign, no repairs applied).  
**Created:** 2026-07-05  
**Evidence rule:** Primary source is `docs/audits/ACTUAL_STATE_AUDIT.md` in each repository. Nothing below assumes capability beyond what those audits verified.

---

## Evidence Register

| Repository | GitHub remote | Audit found? | Audit branch | Overall audit score |
|------------|---------------|--------------|--------------|---------------------|
| **factory-standards** | `masterchiefvoidking-sketch/standards-for-factory` | **YES** | `cursor/factory-standards-init-eb83` | **83 / 100** |
| **factory-core** | `masterchiefvoidking-sketch/code-factory` | **YES** | `cursor/factory-standards-validate-core-9173` | **74 / 100** |
| **factory** | `masterchiefvoidking-sketch/factory` | **YES** | `cursor/project-titan-building-architecture-1a9f` | **52 / 100** |
| **citadel** | UNKNOWN (not found at `masterchiefvoidking-sketch/citadel`) | **NO** | — | **UNKNOWN** |
| **forgina** | UNKNOWN | **NO** | — | **UNKNOWN** |
| **bosslady** | UNKNOWN | **NO** | — | **UNKNOWN** |
| **horizon** | UNKNOWN | **NO** | — | **UNKNOWN** |
| **flippy** | UNKNOWN | **NO** | — | **UNKNOWN** |
| **fip** | UNKNOWN | **NO** | — | **UNKNOWN** |
| **observatory** | UNKNOWN | **NO** | — | **UNKNOWN** |
| **sentinel** | UNKNOWN | **NO** | — | **UNKNOWN** |
| **forge** | UNKNOWN | **NO** | — | **UNKNOWN** |

**Architectural tension (verified):** The factory-core audit documents a **nested `factory-standards/` directory inside `code-factory`**, while a **separate `standards-for-factory` repository** also exists with its own audit. Both claim standards/validation responsibilities. The roadmap in factory-standards declares the **standalone `standards-for-factory` repo as canonical “The Law.”** Until topology is resolved, treat this as **active duplication risk** — not as permission to merge repos.

---

## Part 1 — Ecosystem Inventory

### Foundation layer

#### factory-standards (`standards-for-factory`)

| Field | Value (audit-verified) |
|-------|------------------------|
| **Purpose** | Ecosystem rulebook: JSON schemas, protocols, certification package validator (CLI), tenant kit, compatibility matrix, import archive |
| **Current maturity** | Coherent foundation v1; young (8 commits); reference-data debt |
| **Primary responsibility** | Define proof; validate certification packages; govern compatibility and lifecycle |
| **Secondary responsibilities** | Tenant bootstrap scaffolding; roadmap/governance docs; store imported packages |
| **Technologies** | Node.js ≥18, TypeScript, AJV, adm-zip, Vitest, ESLint, tsc |
| **Approximate size** | ~154 files, ~13,462 lines (excl. node_modules); 7 src modules, 20 tests |
| **Current health** | `npm test` PASS (20/20), `npm run build` PASS, `npm run lint` PASS; no `typecheck` script; no CI file found; stale `examples/` and some zips |
| **Overall audit score** | **83 / 100** |

#### factory-core (`code-factory` / `@factory/core`)

| Field | Value (audit-verified) |
|-------|------------------------|
| **Purpose** | Shared TypeScript SDK: types, hand-coded validators, certification package create/read/score, event/object/health/report/Citadel helpers |
| **Current maturity** | Early foundation v0.1; self-certification passes; monorepo/naming tension |
| **Primary responsibility** | Implement standards contracts in TypeScript for tenant consumption |
| **Secondary responsibilities** | CLI scripts for package create/validate; hosts nested standards copy on audited branch |
| **Technologies** | TypeScript, tsup, Vitest, ESLint, tsx; **zero production npm dependencies** |
| **Approximate size** | ~55 tracked files, ~2,041 TS LOC, 16 tests (single test file) |
| **Current health** | `npm test` PASS (16/16), `npm run build` PASS, `npm run lint` PASS, `npm run typecheck` PASS; no CI; no LICENSE file; not published to npm |
| **Overall audit score** | **74 / 100** |

---

### Headquarters layer

#### factory (`factory`)

| Field | Value (audit-verified) |
|-------|------------------------|
| **Purpose** | Next.js 15 spatial “Titan Campus” headquarters shell — immersive UI metaphor with in-memory Nexus and Operations singletons |
| **Current maturity** | Prototype / demo v0.1.0; builds and runs; no production data path |
| **Primary responsibility** | Spatial navigation shell; integration façade sketch; canonical registry metaphor |
| **Secondary responsibilities** | Atmosphere UX; department org chart; mock operations dashboards |
| **Technologies** | Next.js 15.5, React 19, TypeScript 5.9, Tailwind 4, Framer Motion, Geist fonts |
| **Approximate size** | 56 TS/TSX files, ~7,156 lines in `src/`; 0 test files |
| **Current health** | `npm run build` PASS; `npm test` missing; no CI; no API routes; no `.env`; static prerender |
| **Overall audit score** | **52 / 100** |

---

### Tenant applications (no independent audit available)

The following are **declared** in `compatibility/matrix.json` and `docs/FACTORY_ROADMAP.md`. The factory HQ audit references many as **frozen metadata** inside `factory` (`src/nexus/tenants.ts`) — that is **not** verification of separate repositories.

| Repository | Purpose (declared only) | Audit score | Health | Size | Technologies |
|------------|-------------------------|-------------|--------|------|--------------|
| **citadel** | Archive / knowledge vault (declared) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **forgina** | Tenant app (roadmap) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **bosslady** | Tenant app (roadmap; building in Factory UI) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **horizon** | Toolbelt / integration layer (roadmap) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **flippy** | Tenant app (roadmap; building in Factory UI) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **fip** | Tenant app (roadmap; building in Factory UI) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **observatory** | Tenant app (roadmap; building in Factory UI) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **sentinel** | Tenant app (roadmap; department worker, no building) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **forge** | Tenant app (roadmap; building in Factory UI) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

**factory-standards audit note:** `imports/{citadel,bosslady,forgina,horizon}/` contain **placeholder zips + `.gitkeep` only** — not extracted, not validated in CI.

---

## Part 2 — Responsibility Matrix

### factory-standards

| | |
|--|--|
| **OWNS** | Certification schemas; validation rules; scoring model; constitution & protocols; compatibility matrix; lifecycle standard; tenant certification kit; import archive; Supreme Court authority |
| **MUST NOT own** | Tenant application code; SDK implementation; HQ UI; runtime deployment; live tenant integrations |
| **Consumes** | Certification packages (zips/directories) submitted by tenants |
| **Provides** | Schemas, validator CLI, templates, governance docs, pass/fail reports, bootstrap tooling |

### factory-core

| | |
|--|--|
| **OWNS** | `@factory/core` TypeScript types; runtime validators; certification helpers; SDK utilities (events, objects, health, reports, Citadel) |
| **MUST NOT own** | Canonical standards rulebook (long-term); tenant product behavior; HQ shell; business logic; AI prompts; UI |
| **Consumes** | factory-standards contracts (by convention; hand-coded, not JSON Schema generated) |
| **Provides** | npm library + CLI for tenants to build/validate packages locally |

### factory

| | |
|--|--|
| **OWNS** | Spatial HQ shell; campus navigation; atmosphere; clearance gating; Nexus/Operations **mock** singletons in UI; department org metaphor |
| **MUST NOT own** | Tenant app UIs; persistent storage; authentication; real event streaming; CI for tenant releases; actual media/library execution |
| **Consumes** | **UNKNOWN** live packages — certification import UI not implemented (per factory certification report in standards imports) |
| **Provides** | Executive visibility metaphor; integration API sketches (`registerObject`, `emit`, `submitRequest`) — mostly unwired to UI |

### Tenant repos (citadel, forgina, bosslady, horizon, flippy, fip, observatory, sentinel, forge)

| | |
|--|--|
| **OWNS** | **UNKNOWN** — no audit |
| **MUST NOT own** | Standards definition; shared SDK core; HQ shell (per three-layer model in verified audits) |
| **Consumes** | **Declared:** factory-core ≥1.0.0, factory-standards ≥1.0.0 (compatibility matrix) |
| **Provides** | **UNKNOWN** |

---

## Part 3 — Ecosystem Layers

Evidence-based layer model. Layers are **logical**, not necessarily one repo per layer.

```text
┌─────────────────────────────────────────────────────────────────┐
│  Layer 1 — STANDARDS & GOVERNANCE                               │
│  factory-standards (standards-for-factory)                      │
│  Score: 83 · Maturity: Foundation                               │
└────────────────────────────┬────────────────────────────────────┘
                             │ defines proof, validates packages
┌────────────────────────────▼────────────────────────────────────┐
│  Layer 2 — SHARED SDK                                           │
│  factory-core (@factory/core in code-factory)                   │
│  Score: 74 · Maturity: Foundation (provisional topology)        │
└────────────────────────────┬────────────────────────────────────┘
                             │ types, validators, cert helpers
┌────────────────────────────▼────────────────────────────────────┐
│  Layer 3 — HEADQUARTERS / INTEGRATION SHELL                     │
│  factory (Titan Campus UI)                                      │
│  Score: 52 · Maturity: Prototype                                │
│  Internal sub-layers (within factory only, per factory audit):  │
│    Buildings → Nexus → Operations → Departments                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ future import / embed (UNKNOWN protocol)
┌────────────────────────────▼────────────────────────────────────┐
│  Layer 4 — TENANT APPLICATIONS                                  │
│  Citadel, Forgina, BossLady, Horizon, Flippy, FIP,              │
│  Observatory, Sentinel, Forge                                   │
│  Score: UNKNOWN · Maturity: Idea (no verified repos)            │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  Layer 5 — UTILITIES (declared, not verified as repos)          │
│  Toolbelt (Horizon metaphor in Factory UI) — UNKNOWN repo       │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  Layer 6 — ARCHIVED / EXPERIMENTAL                              │
│  Frozen tenant metadata in factory (`status: "frozen"`)         │
│  Dead `OperationsCenterInterior` (factory audit)                │
│  Stale `examples/` tree (factory-standards audit)               │
│  Placeholder import zips (factory-standards audit)              │
└─────────────────────────────────────────────────────────────────┘
```

**Enterprise layer (roadmap-declared, not audited):** Cross-repo certification, enterprise qualification, beta, production — **UNKNOWN** implementation state.

---

## Part 4 — Maturity

Single assigned level per repository. Scale: **0 Idea · 1 Scaffold · 2 Prototype · 3 Beta · 4 Daily Driver · 5 Foundation**

| Repository | Level | Why (audit evidence) |
|------------|-------|----------------------|
| **factory-standards** | **5 — Foundation** | Operational validator, 20 passing tests, extensive docs, compatibility matrix, constitution; ecosystem depends on it as law |
| **factory-core** | **5 — Foundation** | Self-certification passes; 16 tests; approved for tenant rollout per standards import record; still v0.1 with monorepo/naming duplication |
| **factory** | **2 — Prototype** | Polished v0.1 spatial demo; builds; zero tests; mock-only data; audit overall 52 |
| **citadel** | **0 — Idea** | No audit; no accessible repo; placeholder zip only in standards imports |
| **forgina** | **0 — Idea** | No audit; no accessible repo; roadmap-only |
| **bosslady** | **0 — Idea** | No audit; UI metaphor only in factory; placeholder zip |
| **horizon** | **0 — Idea** | No audit; Toolbelt metaphor in factory; placeholder zip |
| **flippy** | **0 — Idea** | No audit; UI metaphor only |
| **fip** | **0 — Idea** | No audit; UI metaphor only |
| **observatory** | **0 — Idea** | No audit; UI metaphor only |
| **sentinel** | **0 — Idea** | No audit; listed in departments without building |
| **forge** | **0 — Idea** | No audit; UI metaphor only |

---

## Part 5 — Integration Map

### Who talks to whom (verified or declared)

```text
                    ┌──────────────────┐
                    │ factory-standards │
                    │  (validates)      │
                    └────────▲─────────┘
                             │ certification packages (manual zip/dir)
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────┴────┐  ┌──────┴──────┐  ┌──┴───────────────┐
     │ factory-core │  │   factory    │  │ tenants (UNKNOWN) │
     │  (SDK)       │  │  (HQ shell)  │  │                   │
     └──────┬───────┘  └──────▲───────┘  └────────▲──────────┘
            │                 │                     │
            │ implements      │ import UI: NOT      │ produce packages
            │ contracts       │ IMPLEMENTED         │
            └─────────────────┴─────────────────────┘
                      standards define proof
```

| From | To | Interface | Status |
|------|-----|-----------|--------|
| Tenant repos | factory-standards | `{tenant}-factory-certification.zip` or directory | **Manual** — verified workflow in standards audit |
| Tenant repos | factory-core | `npm install` / `file:` / git vendor | **Declared** in core audit docs; not verified for any tenant |
| factory-core | factory-standards | Certification package in `imports/` | **Verified** for factory-core package |
| factory-standards | factory-core | `compatibility.json` minimums vs matrix | **Verified** in standards validator |
| factory | factory-standards | Certification package Run 001 stored | **Verified** package exists; **no live import runtime** in factory app |
| factory | tenant apps | Nexus skybridges, frozen `TENANTS` | **Mock only** — frozen metadata, no runtime bridge |
| factory-core | factory | Readiness score / validation result as gate | **Planned** per core audit — not implemented in factory |

### Required interfaces (verified)

| Interface | Owner | Artifact |
|-----------|-------|----------|
| Certification package layout | factory-standards | 5 required files + optional `compatibility.json`, events, objects, citadel-archive |
| Manifest protocol | factory-standards | `factory.tenant.v1` |
| Qualification gates | factory-standards | 6 required criteria IDs |
| Compatibility declaration | factory-standards | `factory.compatibility.v1` |
| SDK types & validators | factory-core | `@factory/core` exports |

### Required certification

| Repository | Certification required? | Current certification state (verified) |
|------------|-------------------------|----------------------------------------|
| factory-standards | Self-badge only | No import package for itself; README claims Operational |
| factory-core | Yes | PASS 97/100 in standalone standards `imports/factory-core/` |
| factory | Yes | PASS 95/100 provisional in standards `imports/factory/` |
| All tenants | Yes | **UNKNOWN** — no valid extracted packages |

### Required imports

| Consumer | Must import |
|----------|-------------|
| All tenant applications | factory-core ≥1.0.0, factory-standards ≥1.0.0 (matrix) |
| factory-core | factory-standards ≥1.0.0 (matrix) |
| factory | factory-core ≥1.0.0, factory-standards ≥1.0.0 (matrix) |

### Required outputs

| Producer | Output |
|----------|--------|
| Every tenant | Certification package + `factory-report.md` |
| factory-standards validator | `validation-report.{json,md}` |
| factory-core CLI | Packaged zip (when run in tenant) |

### Unknown integrations

| Integration | Unknown aspect |
|-------------|----------------|
| Factory HQ ← certification packages | No import UI/API in factory (verified) |
| Tenant app embedding in HQ | iframe / MFE / deep links — **UNKNOWN** |
| Persistence | No DB in factory or core — **UNKNOWN** strategy |
| Authentication | **UNKNOWN** provider |
| npm publish `@factory/core` | **UNKNOWN** timeline |
| Canonical standards repo topology | Standalone vs nested — **UNRESOLVED** |
| All tenant ↔ tenant integrations | **UNKNOWN** |
| Citadel archive handoff runtime | Types exist in core; live handoff **UNKNOWN** |

---

## Part 6 — Duplication Analysis

**Identification only. No redesign proposed.**

### Duplicate concepts

| Concept | Locations | Evidence |
|---------|-----------|----------|
| **Standards / law** | `standards-for-factory` repo AND nested `factory-standards/` inside `code-factory` | factory-core audit Phase 9 |
| **“Factory standards” naming** | npm `factory-standards`, git `standards-for-factory`, docs say `factory-standards` | factory-standards audit inventory |
| **Worker / tenant / employee** | `EMPLOYEES`, `TENANTS`, `DEPARTMENTS.workers` | factory audit ecosystem overlap |
| **Security clearance** | Factory clearance vs Nexus permission | factory audit |
| **Operations “center”** | `operations-center` building vs `OperationsFloorInterior` vs dead `OperationsCenterInterior` | factory audit |
| **Department status** | `DepartmentStatus` (operations) vs `Department` (departments) | factory audit |

### Duplicate engines

| Engine | Locations | Evidence |
|--------|-----------|----------|
| **Package validation** | AJV in standalone standards; hand validators in core; nested standards CLI in core | standards audit + core audit |
| **Certification packaging** | `src/package-certification.ts` vs `tenant-certification-kit/scripts/package-certification.ts` | standards audit |
| **Readiness scoring** | `src/validator.ts` (standards) vs `computeReadinessScore()` (core) | both audits |

### Duplicate dashboards

| Dashboard | Notes |
|-----------|-------|
| Mission Control vs Operations Floor watchboard | factory audit — both show command/watch data |
| Per-building department dashboards | 8 similar dashboard components — intentional pattern, not separate repos |

### Duplicate storage

| Storage | Notes |
|---------|-------|
| Certification packages | Same factory-core package in standards `imports/` AND core repo `factory-certification/` | core audit structure |
| Example packages | `examples/` vs `imports/examples/` — standards audit; former stale |
| Zips vs folders | `imports/factory/*.zip` vs extracted folder — out of sync | standards audit |

### Duplicate documentation

| Topic | Locations |
|-------|-----------|
| How standards relate to core | Both repos have overlapping docs |
| Certification workflow | standards docs + kit README + core TENANT_INTEGRATION |
| Three-layer model | Repeated across README, constitution, roadmap, audits |

### Duplicate responsibility

| Responsibility | Conflict |
|----------------|----------|
| Validation authority | Core implements validators; standards owns schemas — must stay aligned manually |
| Standards constants | `src/standards/constants.ts` (core) vs `schemas/` (standards) | core audit |
| Foundation changes | Both repos can change certification behavior | roadmap says foundations change slowly — process risk |

---

## Part 7 — Repair Priority

**Ordered queue for the ecosystem. This is sequence, not permission to start repairs.**

| Priority | Repository | Why this position |
|----------|------------|-------------------|
| **1** | **factory-standards** | Supreme Court role; every tenant certification flows through it; audit shows artifact sync debt (stale examples/zips) that undermines trust in the law layer |
| **2** | **factory-core** | All tenants depend on SDK; audit shows monorepo/naming duplication with standards; must be stable before Citadel; self-certification already passes |
| **3** | **factory** | HQ is integration point for imported packages; audit shows no tests, no import runtime, largest internal ambiguity (Operations Center routing); depends on layers 1–2 being trustworthy |
| **4** | **citadel** | Roadmap declares next tenant; archive handoff types exist in core; no audit — highest declared tenant priority |
| **5** | **horizon** | Declared toolbelt/integration layer; may reduce duplicate integration logic across tenants — **UNKNOWN** until audited |
| **6** | **bosslady** | Declared tenant; Factory UI metaphor exists — **UNKNOWN** repo state |
| **7** | **forgina** | Roadmap tenant; **not** in Factory building registry — scope **UNKNOWN** |
| **8** | **observatory** | UI metaphor only |
| **9** | **sentinel** | Department worker without building — integration pattern **UNKNOWN** |
| **10** | **forge** | UI metaphor only |
| **11** | **flippy** | UI metaphor only |
| **12** | **fip** | UI metaphor only |
| **13** | **Enterprise layer** | Cross-repo certification, beta, production — roadmap only, no audits |

**Cross-cutting gate:** No tenant repair should claim **Certified** until factory-standards validator PASS is recorded for that tenant's package.

---

## Part 8 — Certification Gates

Gates apply when a repository **claims** a maturity level. Derived from factory-standards qualification standard + audit evidence.

### Level 0 — Idea

| Gate | Requirement |
|------|-------------|
| Minimum tests | None |
| Documentation | None required |
| Qualification | None |
| Factory certification | None |
| Required scripts | None |
| Required CI | None |

### Level 1 — Scaffold

| Gate | Requirement |
|------|-------------|
| Minimum tests | **UNKNOWN** policy — recommend at least build script |
| Documentation | README stating purpose |
| Qualification | None |
| Factory certification | None |
| Required scripts | `npm run build` or equivalent |
| Required CI | **UNKNOWN** |

### Level 2 — Prototype (factory today)

| Gate | Requirement |
|------|-------------|
| Minimum tests | Audit: **0 tests** — below gate; prototype exempt but cannot advance |
| Documentation | README (factory has one; audit: low doc score) |
| Qualification | Not required |
| Factory certification | Optional |
| Required scripts | `build`, `lint` (factory: build ✅, test ❌) |
| Required CI | None found |

### Level 3 — Beta

| Gate | Requirement |
|------|-------------|
| Minimum tests | >0 tests; `npm test` script required |
| Documentation | README + operational docs |
| Qualification | `provisional` or better in certification package |
| Factory certification | Package submitted; validator PASS with warnings allowed |
| Required scripts | `build`, `test`, `lint`, `typecheck` |
| Required CI | **UNKNOWN** — recommended: test + build on PR |

### Level 4 — Daily Driver

| Gate | Requirement |
|------|-------------|
| Minimum tests | Meaningful suite; core audit: coverage **UNKNOWN** |
| Documentation | Complete docs; no major README/code conflicts |
| Qualification | `qualified` |
| Factory certification | Validator PASS; lifecycle `operational` or `maintenance` |
| Required scripts | Full script table documented and working |
| Required CI | Required — **none verified in any repo** |

### Level 5 — Foundation (factory-standards, factory-core)

| Gate | Requirement |
|------|-------------|
| Minimum tests | Standards: 20 tests ✅; Core: 16 tests ✅ |
| Documentation | Extensive (standards ✅; core good v0.1) |
| Qualification | `qualified` or foundation approval record |
| Factory certification | Package in `imports/` with PASS; compatibility.json |
| Required scripts | validate/build/test/lint (+ typecheck for core) |
| Required CI | **UNKNOWN** — gap for both foundation repos |
| Additional | Compatibility matrix entry; no business logic in core; standards change slowly |

### Required qualification criteria (all certified tenants)

From factory-standards (verified):

- `crit.manifest-valid`
- `crit.audit-pass`
- `crit.health-acceptable`
- `crit.report-complete`
- `crit.package-complete`
- `crit.integration-honesty`

---

## Part 9 — Success Criteria

What the **completed** Factory ecosystem looks like — aspirational end state bounded by audit findings (no invention).

### Reliability

- Every repo has an independent `ACTUAL_STATE_AUDIT.md` refreshed on major changes
- Certification packages in `imports/` match validator PASS at commit time
- No stale reference trees (`examples/` resolved or removed)
- Single canonical standards authority (topology documented)

### Integration

- Factory HQ imports certification packages via documented runtime (today: **missing**)
- Tenants embed or link through a **defined** protocol (today: **UNKNOWN**)
- `integrations.implemented` reflects verified connections only
- Compatibility matrix versions enforced on every package

### Testing

- Every Level 3+ repo: `npm test` with non-zero tests
- Foundation repos: coverage reporting
- CI runs test + build + lint on every PR (today: **none verified**)

### Maintainability

- One packager implementation (standards kit uses shared module)
- One worker/tenant registry in factory (today: triple representation)
- Validators generated from or checked against JSON Schema (today: hand-coded in core, AJV in standards)
- Foundations change slowly; tenant work stays in tenant repos

### Performance

- HQ remains static-friendly where appropriate (factory audit: ~102 kB first load — acceptable)
- Validator stays sub-second per package (standards audit: verified)

### Developer experience

- `npx factory-bootstrap` or equivalent published workflow
- New engineer reads this map + per-repo audits and needs no tribal knowledge
- Clear repair order and certification gates

### Minimal duplication

- One standards repo, one core repo, one HQ repo
- No nested duplicate standards tree
- No zip/folder drift

### Clear ownership

| Question | Answer |
|----------|--------|
| Who defines proof? | factory-standards |
| Who implements SDK? | factory-core |
| Who hosts HQ shell? | factory |
| Who owns product behavior? | Each tenant |
| Who wins disputes? | factory-standards (Supreme Court) |

---

## Appendix A — Audit Score Summary

| Repository | Mission | Architecture | Code | Docs | Testing | Maintainability | Scalability | UX | Performance | Factory readiness | **Overall** |
|------------|---------|--------------|------|------|---------|-----------------|-------------|-----|-------------|-------------------|-------------|
| factory-standards | 92 | 88 | 85 | 90 | 78 | 80 | 75 | 70 | 85 | 90 | **83** |
| factory-core | 82 | 75 | 80 | 78 | 65 | 72 | 60 | 50 | 85 | 77 | **74** |
| factory | 78 | 72 | 74 | 45 | 5 | 58 | 50 | 70 | 82 | 38 | **52** |
| All tenants | — | — | — | — | — | — | — | — | — | — | **UNKNOWN** |

---

## Appendix B — Safest Next Steps (from audits — not yet executed)

| Repo | Audit-recommended safest next step |
|------|-----------------------------------|
| factory-standards | Validate every zip in `imports/`; record results; regenerate failing zips |
| factory-core | Exclude `validation-report.*` from layout false-positive warnings |
| factory | Resolve Operations Center routing (`OperationsCenterInterior` vs `OperationsFloorInterior`) |
| tenants | **Run ACTUAL_STATE_AUDIT.md first** — no repair until audited |

---

## Appendix C — Document Governance

1. This map **supersedes informal priority discussions** but does **not** override factory-standards constitution.
2. Update this document when a new `ACTUAL_STATE_AUDIT.md` appears or a repo reaches a new maturity level.
3. Any capability not listed in an audit must be marked **UNKNOWN** until audited.
4. Repairs and features require explicit alignment to Part 2 (responsibility matrix) and Part 7 (repair priority).

---

*Factory Systems Architect — canonical map v1.0.0 — evidence through 2026-07-05 audits.*
