# Factory Standards Constitution

## Preamble

Factory Standards is the rulebook for the entire Factory ecosystem. It does not contain tenant application code. It defines how applications prove they belong in Factory — through certification packages, not through live repository access.

## Article I — Purpose

1. **Define proof.** Standards specify what a compliant tenant must demonstrate.
2. **Enable import.** Factory imports certification packages; it does not crawl private folders.
3. **Preserve separation.** Each app remains its own repository.
4. **Support qualification.** Tenants iterate until they meet defined criteria.

## Article II — Scope

Factory Standards governs:

- Contracts between ecosystem applications
- JSON schemas for certification artifacts
- Certification and import protocols
- Audit check definitions and reporting
- Qualification loop criteria
- Repair priority ordering
- Optional Citadel archive handoff rules

Factory Standards does **not** govern:

- Tenant feature development
- Monorepo structure
- Runtime deployment topology
- Undeclared integrations

## Article III — Core Rule

> **Each repository proves itself. Factory Standards defines the proof. Factory imports the proof.**

No standard may assume Factory can automatically discover or access tenant repositories.

## Article IV — Certification Packages

Every tenant must produce a Factory Certification Package containing at minimum:

| Artifact | Purpose |
|----------|---------|
| `factory-manifest.json` | Identity, capabilities, integrations |
| `factory-audit.json` | Structured audit results |
| `factory-health.json` | Health signals at certification time |
| `factory-qualification.json` | Qualification loop outcome |
| `factory-report.md` | Human-readable summary |

Optional artifacts:

- `compatibility.json` — version requirements for factory-core and factory-standards
- `factory-events.json` — event catalog
- `factory-objects.json` — object registry
- `factory-citadel-archive.json` — Citadel archive handoff

Packages are delivered as `{tenant}-factory-certification.zip` unless otherwise agreed.

## Article V — Honesty

1. Tenants declare integrations in `factory-manifest.json`.
2. `integrations.declared` lists intended integrations.
3. `integrations.implemented` lists integrations actually working at certification time.
4. Inventing fake integrations violates this constitution.
5. Missing optional integrations are acceptable if not declared as implemented.

## Article VI — Versioning

1. Schemas use semantic versioning.
2. Breaking schema changes require a new major version.
3. Certification packages declare `standardsVersion` in the manifest.
4. Factory may reject packages built against unsupported standards versions.

## Article VII — Known Ecosystem

Standards apply to all Factory ecosystem repositories, including but not limited to:

- Factory
- Citadel
- Forgina
- Horizon / Toolbelt
- BossLady
- Flippy (if exists)
- FIP (if exists)
- Observatory (if exists)
- Sentinel (if exists)
- Forge (if exists)

Presence of any repo in this list does not imply live integration. Each must certify independently.

## Article VIII — Amendment

1. Propose changes via pull request to factory-standards.
2. Update schemas, templates, and examples together.
3. Document migration paths for breaking changes.
4. Do not amend standards to accommodate a single tenant without ecosystem justification.

## Article IX — Success Criteria

Factory Standards succeeds when:

1. Any tenant can generate a valid certification package without Factory repo access.
2. Factory can import and validate any package using only schemas and protocols.
3. Qualification loops converge: audit → repair → re-certify → qualify.
4. The standards repo is the single source of truth for ecosystem compliance.

## Article X — Supreme Court

When two repositories disagree on contracts, schemas, integration behavior, or certification interpretation:

1. **factory-standards wins.** Not Factory. Not factory-core. Not any tenant.
2. The compatibility matrix (`compatibility/matrix.json`) is owned by standards.
3. Tenants adapt to standards; standards do not bend for a single tenant without ecosystem justification.
4. See [SUPREME_COURT.md](SUPREME_COURT.md).

## Article XI — Lifecycle

1. Every repository permanently lives in one Factory lifecycle state.
2. Lifecycle is declared in `factory-manifest.json` → `lifecycle`.
3. Every repo README displays lifecycle status at the top.
4. See [FACTORY_LIFECYCLE.md](FACTORY_LIFECYCLE.md).

## Article XII — Compatibility

1. Every certification package should include `compatibility.json`.
2. Compatibility declares minimum `factory-core` and `factory-standards` versions.
3. The validator checks compatibility against `compatibility/matrix.json`.
4. See [compatibility/README.md](../compatibility/README.md).

## Article XIII — Foundation Stability

1. `factory-standards` and `factory-core` change slowly.
2. Most future work happens in tenant repositories.
3. If foundations change constantly to accommodate one app, the app should adapt instead.
4. See [FOUNDATION_STABILITY.md](FOUNDATION_STABILITY.md).

## Article XIV — factory-core Scope

factory-core contains **zero business logic**. Allowed: types, validators, utilities, SDK, interfaces, event helpers, object helpers. Forbidden: product decisions, UI opinions, tenant workflows, business logic, AI prompts. See [FOUNDATION_CORE_RULES.md](FOUNDATION_CORE_RULES.md).

---

*Version 1.0.0 — factory-standards*
