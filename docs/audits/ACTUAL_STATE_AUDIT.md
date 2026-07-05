# Actual State Audit — factory-standards

**Audit date:** 2026-07-05  
**Auditor role:** Universal Factory Ecosystem forensic investigation  
**Repository:** `masterchiefvoidking-sketch/standards-for-factory` (branded **factory-standards**)  
**Branch audited:** `cursor/factory-standards-init-eb83`  
**Commit:** `6f03ef9e8358b8b8cfaea3850271d36e23d2f982`  
**Audit type:** Investigation only — not redesign, not certification, not cleanup

---

## Executive Summary

**factory-standards** is a **Node.js / TypeScript standards and validation repository** for the Factory ecosystem. It is **not an application with a UI**. It does not run tenant product code. It defines:

- JSON schemas for certification artifacts
- Written protocols and constitutional rules
- A certification package validator (CLI)
- Templates, examples, and a tenant certification kit
- An `imports/` drop zone for tenant certification packages

The repo functions as **“The Law”** in a three-layer platform model:

```text
factory-standards  →  The Law (this repo)
factory-core       →  The SDK (separate repo: code-factory)
Applications       →  Factory, Citadel, Forgina, BossLady, Horizon, …
```

**What actually runs here:** `npm` scripts that load certification packages (directories or zips), validate them against schemas and business rules, score them 0–100, and write `validation-report.{json,md}`.

**Maturity:** Young but coherent. Eight git commits. Twenty automated tests, all passing. Build and lint pass. Documentation is unusually extensive for repo age (~2,700 lines across `docs/`). Several **reference artifacts are stale** relative to the current schema (notably `examples/` and some committed `.zip` files).

**Primary gap:** This repo stores certification packages *about* other repositories (Factory HQ, factory-core). Do not confuse those packages with the behavior of factory-standards itself.

---

## Phase 1 — Repository Inventory

| Field | Value |
|-------|-------|
| **Repository name (GitHub)** | `standards-for-factory` |
| **Package name (npm)** | `factory-standards` |
| **Version** | `1.0.0` |
| **Git branch** | `cursor/factory-standards-init-eb83` |
| **Framework(s)** | None (no web framework). Tooling: Vitest, ESLint, TypeScript compiler |
| **Language(s)** | TypeScript (primary), JSON (schemas), Markdown (docs) |
| **Package manager** | npm (`package-lock.json` present) |
| **Build system** | `tsc` → `dist/` |
| **Runtime** | Node.js `>=18` (tested on v22.14.0) |
| **Module system** | ESM (`"type": "module"`) |

### Major dependencies

| Package | Role | Type |
|---------|------|------|
| `ajv` + `ajv-formats` | JSON Schema validation (draft 2020-12) | production |
| `adm-zip` | Read/write certification zips | production |
| `tsx` | Run TypeScript scripts without pre-build | dev |
| `typescript` | Compile `src/` and `scripts/` | dev |
| `vitest` | Test runner | dev |
| `eslint` + `typescript-eslint` | Lint | dev |

### Project size (excluding `node_modules/`, `.git/`, `dist/`)

| Metric | Count |
|--------|-------|
| Files | ~154 |
| Total lines | ~13,462 |
| TypeScript source (`src/`) | 7 files, ~1,581 lines |
| Scripts (`scripts/`) | 5 files, ~383 lines |
| Tests (`tests/`) | 4 files, ~519 lines |
| JSON schemas | 9 files |
| Documentation (`docs/` + README) | ~21 markdown files, ~2,695 lines |
| Git commits | 8 |

### Folder structure

```text
factory-standards/
├── src/                    # Validator engine (core library)
├── scripts/                # CLI entry points
├── tests/                  # Vitest tests
├── schemas/                # JSON Schema definitions
├── contracts/              # Contract index (README only)
├── protocols/              # Protocol index (README only)
├── templates/              # Blank certification templates
├── examples/               # Legacy reference packages (STALE)
├── imports/                # Real tenant packages + examples + zip placeholders
├── tenant-certification-kit/  # Copyable kit for tenant repos
├── compatibility/          # Ecosystem version matrix
├── docs/                   # Constitution, protocols, guides, roadmap
├── dist/                   # tsc output (gitignored)
└── package.json
```

### README quality

**Good.** Clear core rule, structure diagram, certification file table, workflow steps, command examples, and a documentation index with 20+ links. Factory lifecycle badge at top (self-declared Operational / 100% / YES — not produced by running the validator on this repo).

### Documentation quality

**Strong for a standards repo.** Layered docs: constitution, protocols, validation engine, scoring, certification how-tos, roadmap, lifecycle, supreme court, foundation rules, bootstrap guide. **Some docs lag code** (e.g. `VALIDATION_ENGINE.md` and `VALIDATION_SCORING.md` do not mention `compatibility.json` or `lifecycle`; scoring doc still says 3 optional files but code has 4).

---

## Phase 2 — Purpose Discovery

### What this repository ACTUALLY does

1. **Defines** Factory ecosystem certification standards (schemas, contracts, protocols as documentation).
2. **Validates** tenant-submitted certification packages offline (directory or zip).
3. **Scores** packages on five dimensions + overall 0–100.
4. **Stores** imported certification packages for Factory HQ, factory-core, and placeholder zips for other tenants.
5. **Ships** a copyable tenant certification kit (prompts + templates + standalone packager script).
6. **Bootstraps** new tenant repos via `npm run bootstrap`.

### What the README claims

- Standards repo, not tenant application code ✓ (accurate)
- Each repo proves itself; Factory imports the proof ✓ (accurate)
- Defines contracts, schemas, protocols, audit standards, certification formats ✓ (accurate)
- Includes validator and tenant kit ✓ (accurate)

### What the UI suggests

**There is no UI.** No screens, routes, or components in this repository.

### What the code suggests

- Single-purpose validation pipeline: `loadPackage` → `validateCertificationPackage` → `writeReports`
- Heavy investment in **cross-file consistency rules** (tenant IDs, integration honesty, qualification gates, lifecycle/compatibility)
- Certification packages in `imports/` are **data artifacts about external repos**, not executable code from those repos

### Workflows that currently exist

| Workflow | How |
|----------|-----|
| Validate a package | `npm run validate:package -- <path>` |
| Validate curated pass/fail examples | `npm run validate:examples` |
| Check tenant kit file completeness | `npm run kit:check` |
| Package citadel-valid example to zip | `npm run kit:package-example` |
| Bootstrap a tenant repo | `npm run bootstrap -- --tenant X --target ../X` |
| Develop / verify | `npm test`, `npm run build`, `npm run lint` |
| Tenant-side certification (external) | Copy kit → fill templates → zip → drop in `imports/` |

### Purpose classification

| | |
|--|--|
| **Primary purpose** | Ecosystem compliance rulebook + certification package inspector |
| **Secondary purposes** | Roadmap/governance docs, compatibility matrix, tenant bootstrap scaffolding |
| **Target users** | Factory ecosystem engineers, tenant repo maintainers, Cursor agents running certification prompts |
| **Current maturity** | Early production of standards layer; foundation artifacts recently added; reference data partially stale |

### Purpose conflicts (documented, not resolved)

| Conflict | Evidence |
|----------|----------|
| README claims `examples/` has valid samples; current schema rejects them | `examples/citadel` fails: missing `lifecycle` |
| `examples/README.md` lists qualification statuses; not validated by `validate:examples` | Only `imports/examples/citadel-valid` and `horizon-invalid` are CI-checked |
| README badge says 100% qualification | Self-asserted; no `factory-manifest.json` for factory-standards itself in `imports/` |
| `imports/` zips vs extracted folders can diverge | `imports/factory/factory-factory-certification.zip` lacks `lifecycle`; extracted folder has it |
| `tenant-certification-kit/scripts/package-certification.ts` duplicates `src/package-certification.ts` | Kit version omits `compatibility.json` from optional files |

---

## Phase 3 — User Experience Audit

**This repository has no web application.** There are no screens, routes, pages, modals, or React/Vue components.

Below is every **user-facing surface** that exists.

### CLI commands (primary UX)

| Command | Purpose | Inputs | Outputs | Status |
|---------|---------|--------|---------|--------|
| `npm run validate:package -- <path>` | Validate certification package | Dir or `.zip` path | Console pass/fail, score, `validation-report.*` in package dir | **Working** |
| `npm run validate:examples` | Smoke test two curated examples | None | Console OK/FAIL per example | **Working** |
| `npm run kit:check` | Verify kit files exist | None | Console PASSED/FAILED | **Working** |
| `npm run kit:package-example` | Zip `citadel-valid` example | None | Zip in `imports/examples/` | **Working** |
| `npm run bootstrap -- --tenant T --target P` | Scaffold tenant repo | Tenant slug, target path | Kit copy, `factory-certification/`, badge snippet | **Working** (requires writable target) |
| `npm test` | Run unit tests | None | Vitest report | **Working** |
| `npm run build` | Compile TS to `dist/` | None | `dist/` tree | **Working** |
| `npm run lint` | ESLint | None | Silent on success | **Working** |
| `npm run typecheck` | — | — | **Missing script** | **Not implemented** |

### Documentation surfaces (secondary UX)

| Surface | Purpose | Maturity |
|---------|---------|----------|
| `README.md` | Onboarding, workflow, doc index | Strong |
| `docs/FACTORY_STANDARDS_CONSTITUTION.md` | Governing law | Strong |
| `docs/VALIDATION_ENGINE.md` | Validator reference | Good (slightly behind code) |
| `docs/HOW_TO_CERTIFY_A_TENANT.md` | Step-by-step | Good |
| `tenant-certification-kit/prompts/*.md` | Cursor agent prompts | Good |
| `imports/*/factory-report.md` | Human reports *about external repos* | Varies by import |

### Missing / N/A UX

- No GUI, API server, or HTTP endpoints
- No interactive import UI (deferred to Factory HQ app in separate repo)
- No watch mode or file watcher for `imports/`
- No published npm CLI package (`npx factory-bootstrap` is documented aspiration; actual command uses `npm run bootstrap` from cloned repo)

---

## Phase 4 — Architecture

### High-level map

```text
                    ┌─────────────────────────────────────┐
                    │  scripts/*.ts (CLI entry points)      │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────▼───────────────────┐
                    │  src/validator.ts (orchestrator)    │
                    │    ├── load-package.ts              │
                    │    ├── schema-validator.ts (AJV)    │
                    │    ├── compatibility.ts             │
                    │    └── report.ts                    │
                    └─────────────────┬───────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
   schemas/*.json            certification package            compatibility/
   (draft 2020-12)           (imports/, examples/)          matrix.json
```

### Routes / pages / components

**None.** Not applicable.

### Modules (`src/`)

| Module | Responsibility |
|--------|----------------|
| `types.ts` | Shared types, file lists, schema map, qualification gate IDs |
| `load-package.ts` | Load dir or zip; fix `factory-report.md5.md` misname |
| `schema-validator.ts` | AJV singleton, per-file schema validation |
| `validator.ts` | Business rules, scoring, lifecycle/compatibility checks |
| `compatibility.ts` | Semver requirement checks against matrix |
| `report.ts` | JSON + Markdown validation report writers |
| `package-certification.ts` | Pre-package checks, zip creation, kit layout check |

### Scripts (`scripts/`)

| Script | Calls |
|--------|-------|
| `validate-certification-package.ts` | `loadPackage`, `validateCertificationPackage`, `writeReports` |
| `validate-examples.ts` | Validator on two fixed paths |
| `kit-check.ts` | `checkKitLayout` |
| `kit-package-example.ts` | `packageCertification` |
| `factory-bootstrap.ts` | File copy + template substitution (standalone) |

### Contexts / stores / hooks

**None.** No React, no global state beyond AJV singleton cache.

### Services / API layers

**None.** No HTTP, no database, no message queue.

### Persistence

| Mechanism | Usage |
|-----------|-------|
| Filesystem read | Load packages, schemas, matrix |
| Filesystem write | `validation-report.*` into package dir; bootstrap copies |
| Temp directory | Zip extraction via `os.tmpdir()` |
| Git | Version control for standards + imported packages |

### Import / export

- **Import:** Tenant packages arrive as files in `imports/{tenant}/` (manual)
- **Export:** Validation reports written beside package; zips created by `packageCertification`

### Build pipeline

```text
tsc (tsconfig.json)
  include: src/**/*, scripts/**/*
  outDir: dist/
  module: NodeNext
```

Tests run via `tsx` + Vitest against TypeScript source directly (no build required for tests).

### Testing framework

- **Vitest** v2.1.9
- 4 test files, 20 tests
- No coverage configuration or `npm run coverage`

### External APIs

**None in runtime code.** No `fetch`, no `process.env` usage in `src/` or `scripts/`.

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Scripts, dependencies, engines |
| `tsconfig.json` | Strict TS, ES2022, NodeNext |
| `eslint.config.js` | Flat ESLint + typescript-eslint |
| `vitest.config.ts` | Test glob `tests/**/*.test.ts` |
| `.gitignore` | `node_modules/`, `dist/`, `validation-report.*` |

### Environment variables

**Not used** in application code.

---

## Phase 5 — Code Health

### Build / lint / test (see Phase 10 for exact output)

| Check | Result |
|-------|--------|
| `npm install` | Success (164 packages) |
| `npm test` | **PASS** — 20/20 tests |
| `npm run build` | **PASS** — `tsc` clean |
| `npm run lint` | **PASS** — no issues |
| `npm run typecheck` | **Missing script** |

### Coverage

**Not configured.** No Istanbul/c8/v8 coverage reports.

### Large files

| File | Lines | Note |
|------|-------|------|
| `src/validator.ts` | 587 | Largest module; all rule logic |
| `tests/validate.test.ts` | 328 | Comprehensive validator tests |
| `src/package-certification.ts` | 231 | Packaging + kit check |

No file is unreasonably large for its role.

### Dead code / unused artifacts

| Item | Status |
|------|--------|
| `schemas/factory-report.schema.json` | **Defined but not wired** into `SCHEMA_MAP` / validator |
| `examples/` tree | **Stale** — fails current validation |
| `imports/*/bosslady|citadel|forgina|horizon/*.zip` | Placeholder zips; likely pre-lifecycle schema |
| `dist/` | Build artifact; gitignored |

### Unused dependencies

All three production deps (`ajv`, `ajv-formats`, `adm-zip`) are used. Dev deps all referenced.

### Circular imports

**None detected.** Dependency graph is acyclic: `validator` → `load-package`, `schema-validator`, `compatibility`; no back-edges.

### Duplicate logic

| Duplication | Risk |
|-------------|------|
| `src/package-certification.ts` vs `tenant-certification-kit/scripts/package-certification.ts` | Kit copy is standalone, older REQUIRED/OPTIONAL lists; can drift |
| `templates/` vs `tenant-certification-kit/templates/` | Intentional duplication for copy-into-tenant workflow |

### TODOs / FIXMEs

**Zero** matches in `*.ts`, `*.js`, `*.md`, `*.json` across the repo.

### Comment quality

Sparse but adequate. Non-obvious logic documented (e.g. `fixMisnamedReportFile`, AJV typing workaround). No over-commenting.

### Naming consistency

Consistent `factory-*` prefix for certification artifacts. TypeScript uses camelCase functions, PascalCase interfaces. Issue codes use dotted namespaces (`schema.invalid`, `integration.fake-connected-mode`).

### Folder organization

Clear separation: `src/` (engine), `scripts/` (CLI), `schemas/` (data contracts), `docs/` (human law), `imports/` (tenant proof). `examples/` vs `imports/examples/` overlap is confusing.

### Technical debt

1. Stale `examples/` and some `.zip` files vs current schema  
2. Documentation drift on optional file count and new checks  
3. Duplicate packager in tenant kit  
4. `factory-report.schema.json` unused  
5. npm audit: 5 vulnerabilities in vitest/vite/esbuild chain (dev only)  
6. No `typecheck` script (build partially covers)  
7. Zip/folder sync not enforced after validation updates  

---

## Phase 6 — Data Model

This repo does not own application domain objects (tasks, users, etc.). Its **data model is certification artifacts**.

### Core entities

| Object | Owner | Schema | Persistence |
|--------|-------|--------|-------------|
| **Certification package** | Tenant (submitted here) | Layout rules in `types.ts` | `imports/{tenant}/` files or zip |
| **Manifest** | Tenant | `factory-manifest.schema.json` | `factory-manifest.json` |
| **Audit** | Tenant | `factory-audit.schema.json` | `factory-audit.json` |
| **Health** | Tenant | `factory-health.schema.json` | `factory-health.json` |
| **Qualification** | Tenant | `factory-qualification.schema.json` | `factory-qualification.json` |
| **Report** | Tenant | _(markdown only; optional metadata schema unused)_ | `factory-report.md` |
| **Compatibility** | Tenant | `compatibility.schema.json` | `compatibility.json` (optional) |
| **Events catalog** | Tenant | `factory-event.schema.json` | `factory-events.json` (optional) |
| **Objects registry** | Tenant | `factory-object.schema.json` | `factory-objects.json` (optional) |
| **Citadel archive** | Citadel tenant | `factory-citadel-archive.schema.json` | `factory-citadel-archive.json` (optional) |
| **Validation report** | factory-standards engine | `ValidationReport` in `types.ts` | `validation-report.{json,md}` (gitignored) |
| **Compatibility matrix** | factory-standards | `compatibility/matrix.json` | Committed in repo |
| **Lifecycle** | Tenant (embedded in manifest) | `manifest.lifecycle` | Part of manifest |

### Relationships

```text
Manifest.tenant.id
    ═══ tenantId in audit, health, qualification, compatibility, citadel-archive

Manifest.integrations.declared ⊇ integrations.implemented

Manifest.owns ∩ Manifest.doesNotOwn = ∅ (warned if overlap)

Qualification.criteria ⊇ 6 required gate IDs

Compatibility.requires ≥ matrix.repositories[tenant] minimums
```

### Lifecycle (manifest field)

States: `discovery` → `architecture` → `construction` → `qualification` → `certified` → `operational` → `maintenance` → `deprecated` → `archived`

Fields: `state`, `qualificationPercent`, `certified`, `updatedAt`, optional `notes`

### Stored imports (actual state)

| Path | Contents | Validator result (2026-07-05) |
|------|----------|-------------------------------|
| `imports/factory/` | Factory HQ Run 001 package | PASS 95/100 |
| `imports/factory-core/` | SDK approval package | PASS 97/100 |
| `imports/examples/citadel-valid/` | Positive test fixture | PASS 98/100 |
| `imports/examples/horizon-invalid/` | Negative test fixture | FAIL 75/100 (intentional) |
| `imports/{citadel,bosslady,forgina,horizon}/` | `.zip` + `.gitkeep` only | Not validated in CI |
| `examples/{citadel,factory,...}/` | Partial reference packages | **FAIL** (missing `lifecycle`) |

---

## Phase 7 — Capabilities

### Fully working

| Category | Capability |
|----------|------------|
| **Validation** | Load package from directory or zip |
| **Validation** | JSON Schema validation for 8 artifact types via AJV |
| **Validation** | Tenant ID cross-file consistency |
| **Validation** | Mission / owns / doesNotOwn checks |
| **Validation** | Health status rules (`unhealthy` fails) |
| **Validation** | Six qualification gate presence |
| **Validation** | Integration honesty (declared vs implemented, modes) |
| **Validation** | Lifecycle certified/score drift warnings |
| **Validation** | Compatibility matrix minimum checks |
| **Validation** | Five-dimension scoring + overall |
| **Validation** | Report generation JSON + Markdown |
| **Packaging** | Pre-package checks, zip creation (adm-zip or CLI fallback) |
| **Packaging** | Kit layout verification |
| **Tooling** | Tenant bootstrap file copy + template seeding |
| **Documentation** | Constitution, protocols, how-tos, roadmap |
| **Testing** | 20 unit/integration-style tests |

### Partially working

| Capability | Gap |
|------------|-----|
| Reference examples in `examples/` | Not updated for `lifecycle` requirement |
| Committed certification zips | Out of sync with extracted folders (factory zip lacks lifecycle) |
| `factory-report.schema.json` | Schema exists; not enforced |
| Tenant kit packager | Works standalone but missing `compatibility.json` in optional list |
| README self-certification badge | Declarative only; no package for factory-standards itself |

### Broken

**None in core validator path** (tests and primary imports pass).

### Placeholder

| Item | Evidence |
|------|----------|
| `imports/citadel/`, `bosslady/`, etc. | Only `.gitkeep` + old zip |
| `contracts/` beyond README | No per-contract files |
| `protocols/` beyond README | No machine-readable protocol JSON files |

### Hidden

| Item | Note |
|------|------|
| `fixMisnamedReportFile` | Auto-renames `factory-report.md5.md` on load |
| `validation-report.*` | Gitignored; created on each validate run |
| `resetSchemaCache()` | Exported for tests; not used in production CLI |

### Experimental

| Item | Note |
|------|------|
| `npm run bootstrap` | Recently added; copies kit to external path |
| Lifecycle + compatibility checks | Recently added; not in all docs |

---

## Phase 8 — Dependencies

### Internal (within repo)

| Dependency | Used by |
|------------|---------|
| `src/types.ts` | All modules |
| `schemas/*.json` | `schema-validator.ts` |
| `compatibility/matrix.json` | `compatibility.ts` |
| `tenant-certification-kit/` | Bootstrap, manual tenant copy |
| `templates/` | Bootstrap, documentation |
| `imports/examples/*` | `validate:examples`, tests |

### External libraries

| Library | Version (lock) | Used for |
|---------|----------------|----------|
| ajv | ^8.17.1 | Schema validation |
| ajv-formats | ^3.0.1 | date-time, uri formats |
| adm-zip | ^0.5.16 | Zip read/write |
| tsx | ^4.19.2 | TS execution |
| vitest | ^2.1.8 | Tests |
| typescript | ^5.7.2 | Build |
| eslint | ^9.17.0 | Lint |

### External services / APIs

**None.**

### External repositories (ecosystem, not code deps)

Referenced in docs and `imports/` packages:

| Repo | Role | Package in imports |
|------|------|-------------------|
| `masterchiefvoidking-sketch/factory` | Factory HQ app | `imports/factory/` |
| `masterchiefvoidking-sketch/code-factory` | factory-core SDK | `imports/factory-core/` |
| Citadel, Forgina, BossLady, Horizon, … | Future tenants | Zip placeholders only |

### Assets

- No icons, fonts, or media in repo
- Markdown and JSON only

---

## Phase 9 — Factory Ecosystem Analysis

### Responsibilities that belong HERE (high confidence)

| Responsibility | Evidence |
|----------------|----------|
| Certification schemas and protocols | `schemas/`, `docs/`, constitution |
| Package validation and scoring | `src/validator.ts`, tests |
| Compatibility matrix ownership | `compatibility/`, Supreme Court doc |
| Tenant certification kit distribution | `tenant-certification-kit/` |
| Imported certification package archive | `imports/` |
| Governance / roadmap / lifecycle standard | `docs/FACTORY_ROADMAP.md`, etc. |

### Responsibilities that belong ELSEWHERE (high confidence)

| Responsibility | Correct owner |
|----------------|---------------|
| TypeScript SDK implementation | `factory-core` / `code-factory` |
| HQ UI, spatial campus, import UI | `factory` app repo |
| Tenant product behavior | Each tenant repo |
| Live integration runtime | Tenant apps + Factory HQ |
| Running tenant test suites | Each tenant repo |

### Potential overlap

| Area | Overlap with |
|------|--------------|
| Validation logic | `factory-core` also implements validators per its certification package — standards must remain authoritative |
| Packaging | `src/package-certification.ts` vs kit script vs future `@factory/core` |
| Examples vs imports/examples | Two example trees with different freshness |

### Potential missing responsibilities (not recommendations — observations)

- No automated CI workflow file visible in repo (`.github/workflows` not present)
- No package for factory-standards' own certification in `imports/factory-standards/`
- No programmatic API — CLI only

### Integration points

| Integration | Direction | Status |
|-------------|-----------|--------|
| Tenant → standards | Zip drop in `imports/` | Manual |
| Standards → Factory HQ | Import protocol documented | Not implemented in this repo |
| factory-core → standards | Implements schemas | External repo; package validated here |
| Bootstrap → tenant repos | File copy | CLI working |

### Unknowns

| Unknown | Confidence impact |
|---------|-------------------|
| Whether committed tenant zips (citadel, etc.) are still distributed | Medium — may mislead consumers |
| Whether Factory HQ has wired import UI yet | External — Factory report says no |
| Long-term publishing of validator as npm package | Low — not implemented |
| CI on GitHub for this repo | Unknown — no workflow files found |

### Confidence level

**High (85%)** on architectural role and validator behavior — verified by code review and test runs.  
**Medium (60%)** on completeness of `imports/` placeholder zips and `examples/` tree.  
**Low (40%)** on downstream Factory HQ integration state (lives in another repo).

---

## Phase 10 — Testing (Exact Output)

### `npm install`

```text
up to date, audited 164 packages in 481ms

52 packages are looking for funding
  run `npm fund` for details

5 vulnerabilities (3 moderate, 1 high, 1 critical)

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

### `npm test`

```text
> factory-standards@1.0.0 test
> vitest run

 RUN  v2.1.9 /workspace

 ✓ tests/load-package.test.ts (2 tests) 10ms
 ✓ tests/package-certification.test.ts (5 tests) 36ms
 ✓ tests/compatibility.test.ts (3 tests) 2ms
 ✓ tests/validate.test.ts (10 tests) 163ms

 Test Files  4 passed (4)
      Tests  20 passed (20)
   Start at  18:03:50
   Duration  760ms
```

Exit code: **0**

### `npm run build`

```text
> factory-standards@1.0.0 build
> tsc
```

Exit code: **0**

### `npm run lint`

```text
> factory-standards@1.0.0 lint
> eslint src scripts tests
```

Exit code: **0**

### `npm run typecheck`

```text
npm error Missing script: "typecheck"
```

Exit code: **1** — script does not exist.

### `npm run validate:examples`

```text
[OK] imports/examples/citadel-valid: pass=true (expected true), score=98
[OK] imports/examples/horizon-invalid: pass=false (expected false), score=75
All example validations behaved as expected.
```

Exit code: **0**

### Additional validation (audit run)

```text
npm run validate:package -- examples/citadel
→ FAIL — missing required property 'lifecycle'

npm run validate:package -- examples/factory
→ FAIL — missing required property 'lifecycle'

imports/factory/factory-factory-certification.zip
→ manifest inside zip: lifecycle NO
imports/factory/factory-manifest.json (folder): lifecycle operational
```

---

## Phase 11 — Strengths

1. **Clear constitutional model** — Core rule (“each repo proves itself”) is consistent across README, constitution, and validator design.
2. **Validator depth** — Goes beyond JSON Schema: integration honesty, qualification gates, lifecycle/compatibility are rare in typical schema-only repos.
3. **Documentation volume and structure** — Protocol index, repair order, repo-by-repo workflow, roadmap; unusually complete for v1.
4. **`imports/examples/horizon-invalid`** — Deliberate negative fixture; tests expected failure modes.
5. **Modular `src/` layout** — Small files, single responsibility, easy to navigate.
6. **Honest imported reports** — Factory HQ package documents mock integrations and provisional status.
7. **Tenant kit with Cursor prompts** — Practical agent-driven certification workflow.
8. **TypeScript strict mode** — `strict: true` in tsconfig.
9. **Zip and directory parity** — `load-package.ts` handles both transparently.
10. **Auto-fix for common misname** — `factory-report.md5.md` → `factory-report.md`.

---

## Phase 12 — Weaknesses

1. **Stale `examples/` tree** — Fails validation; README still points to it as reference.
2. **Zip/folder desync** — `factory-factory-certification.zip` behind extracted manifest.
3. **Duplicate packager scripts** — Kit version can drift from `src/package-certification.ts`.
4. **Documentation lag** — VALIDATION_ENGINE/SCORING omit lifecycle and compatibility; optional file count wrong.
5. **Unused `factory-report.schema.json`** — Suggests incomplete metadata-sidecar design.
6. **No CI configuration in repo** — Relies on manual `npm test` (unknown if GitHub Actions exist elsewhere).
7. **No coverage metrics** — Regression risk as validator grows.
8. **Dev dependency vulnerabilities** — npm audit reports 5 issues (vitest/vite/esbuild chain).
9. **Confusing dual example locations** — `examples/` vs `imports/examples/`.
10. **Self-certification gap** — Standards repo badges itself certified without its own import package.

---

## Phase 13 — Safe Recommendations

### Absolutely preserve

- Three-layer law / SDK / apps separation
- `src/validator.ts` rule set and scoring model
- `imports/examples/citadel-valid` and `horizon-invalid` fixtures
- Constitution + Supreme Court governance model
- `tenant-certification-kit/prompts/` agent workflow
- `fixMisnamedReportFile` guard
- Compatibility matrix as standards-owned artifact

### Do not touch yet

- Schema required fields (`lifecycle`, mission, owns/doesNotOwn) — tenants are mid-rollout
- Core scoring weights — changing breaks comparability across runs
- `imports/factory/` and `imports/factory-core/` approved packages — foundation record
- AJV draft 2020-12 choice — wired through all schemas

### Deserves investigation

1. Whether `examples/` should be updated or deprecated in favor of `imports/examples/`
2. Whether committed `.zip` files should be regenerated from current folders
3. Drift between `tenant-certification-kit/scripts/package-certification.ts` and `src/package-certification.ts`
4. Purpose and future of `factory-report.schema.json`
5. Whether factory-standards should have its own entry in `imports/factory-standards/`

### Deserves repair first (safest, smallest)

1. **Sync or document `examples/` staleness** — lowest risk, highest confusion reduction
2. **Regenerate `imports/factory/factory-factory-certification.zip`** from current folder — aligns zip with validated manifest
3. **Update VALIDATION_ENGINE.md and VALIDATION_SCORING.md** to match code — documentation-only

### One safest next step

**Run `npm run validate:package` on every path in `imports/` that contains a zip, record results in a table, and regenerate any zip that fails** — investigation-only, no architecture change, restores trust in committed artifacts.

---

## Scoring (0–100)

| Dimension | Score | Explanation |
|-----------|-------|-------------|
| **Mission clarity** | 92 | Purpose is explicit and enforced in code; minor conflicts in examples/README badge |
| **Architecture** | 88 | Clean validator pipeline; duplicate kit script and stale artifacts deduct |
| **Code quality** | 85 | Strict TS, no TODOs, good tests; `validator.ts` growing, no coverage |
| **Documentation** | 90 | Exceptional for standards repo; some pages behind code |
| **Testing** | 78 | 20 solid tests but no coverage, no e2e CLI tests, no CI file |
| **Maintainability** | 80 | Small codebase; drift risks in examples, zips, kit duplicate |
| **Scalability** | 75 | CLI scales manually; no API, no batch import, no watch |
| **UX** | 70 | Good CLI + docs for engineers; no GUI (by design); bootstrap requires local paths |
| **Performance** | 85 | Validation is fast (<200ms in tests); no performance concerns observed |
| **Factory readiness** | 90 | Fulfills “Law” role; stores two approved foundation packages |
| **Overall maturity** | 83 | Coherent foundation platform v1; young git history, artifact sync gaps |

**Overall: 83/100** — A focused, well-documented standards and validation platform that is **operationally real** but has **reference-data debt** (stale examples and zips) typical of a fast-moving foundation sprint.

---

## Unknowns

1. GitHub Actions or other CI for this repo — no `.github/` directory found in workspace
2. Whether external consumers rely on `examples/` vs `imports/examples/`
3. Current state of Citadel, Forgina, BossLady repos (only placeholder zips here)
4. Plan to publish `factory-standards` validator as installable npm CLI
5. Whether `factory-report.schema.json` will become required
6. npm audit vulnerability acceptance policy for dev dependencies

---

## Appendix — npm scripts reference

| Script | Entry file |
|--------|------------|
| `build` | `tsc` |
| `lint` | `eslint src scripts tests` |
| `test` | `vitest run` |
| `validate:package` | `scripts/validate-certification-package.ts` |
| `validate:examples` | `scripts/validate-examples.ts` |
| `kit:check` | `scripts/kit-check.ts` |
| `kit:package-example` | `scripts/kit-package-example.ts` |
| `bootstrap` | `scripts/factory-bootstrap.ts` |

---

*End of audit. No code was modified during this investigation except creation of this document.*
