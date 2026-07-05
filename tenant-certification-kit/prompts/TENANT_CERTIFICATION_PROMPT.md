# Tenant Certification Prompt

**Paste this entire document into Cursor inside the tenant repository.**

---

## FACTORY TENANT CERTIFICATION

You are certifying **this repository** for the Factory ecosystem.

Reference standards: `factory-standards` (clone alongside or use web docs).  
Templates: `tenant-certification-kit/templates/`  
Schemas: `factory-standards/schemas/`

### Mission

Produce a truthful Factory Certification Package. **Do not redesign. Do not add features. Do not fake Factory connection.**

### Step 1 — Discover repository truth

Audit the current repo honestly:

1. **Purpose** — What does this application actually do?
2. **Routes** — List HTTP routes, pages, or navigation paths (if applicable).
3. **Modules** — Key source directories and their roles.
4. **Stores** — State management (if any).
5. **Scripts** — All `package.json` scripts.
6. **Tests** — Test framework, location, coverage of critical paths.
7. **Docs** — README, docs/, API documentation.

Record findings in `factory-report.md`.

### Step 2 — Run commands

Run when `package.json` exists (record pass/fail/skip/N/A):

```bash
npm install
npm test
npm run build
npm run lint
```

If a script does not exist, mark as `skip` with evidence. Do not invent success.

Capture results in `factory-health.json` signals and `factory-audit.json` checks.

### Step 3 — Create certification workspace

```text
factory-certification/
```

Copy templates from `tenant-certification-kit/templates/` into `factory-certification/`.

### Step 4 — Fill factory-manifest.json

- Set `tenant.id`, `tenant.slug`, `tenant.name` from this repo's identity.
- Set `repository.remoteUrl`, `repository.commitSha` (current `git rev-parse HEAD`).
- Write honest `mission.statement`, `owns`, `doesNotOwn` (no overlap).
- List real `capabilities` observed in code.
- **Integrations — be honest:**

```json
"integrations": {
  "declared": ["factory", "citadel"],
  "implemented": [],
  "modes": {
    "factory": "manual",
    "citadel": "mock"
  }
}
```

**Integration modes (required per declared integration):**

| Mode | When to use |
|------|-------------|
| `mock` | Stubbed/faked; no live connection |
| `manual` | Human zip/copy handoff only |
| `imported` | Data via certification package import |
| `connected` | Live integration verified now |

**Rules:**
- Only list in `implemented` if verified working at certification time.
- Only use `connected` mode if integration is in `implemented`.
- Do not claim Factory is `connected` unless live integration exists.

Set `standardsVersion`: `1.0.0`.

### Step 5 — Fill factory-audit.json

- Set `auditId`, `generatedAt`, `tenantId`.
- Add checks for: structure, build, tests, lint, secrets, integration honesty.
- Set each check `status`: `pass`, `fail`, `skip`, or `warn`.
- Set `repairPriority` 1–5 for failures.
- Set overall `status`: `pass`, `fail`, `partial`, or `pending`.

### Step 6 — Fill factory-health.json

- Set `status`: `healthy`, `degraded`, `unhealthy`, or `unknown` based on command results.
- Map npm install/build/test/lint to signals.
- List dependencies with honest `status` — do not mark integrations `available` unless implemented.

### Step 7 — Fill factory-qualification.json

Include all required gates:

- `crit.manifest-valid`
- `crit.audit-pass`
- `crit.health-acceptable`
- `crit.report-complete`
- `crit.package-complete`
- `crit.integration-honesty`

Set `result` per criterion: `met`, `unmet`, `waived`, or `pending`.

### Step 8 — Write factory-report.md

Human-readable summary: purpose, structure, command results, integration table, blockers, next steps.

### Step 9 — Optional artifacts

Only if applicable:

- `factory-events.json` — events this tenant emits/consumes
- `factory-objects.json` — domain objects exposed
- `factory-citadel-archive.json` — Citadel archive handoff only

### Step 10 — Package

```bash
npx tsx tenant-certification-kit/scripts/package-certification.ts factory-certification
```

Output: `<tenantId>-factory-certification.zip`

### Step 11 — Hand off

1. Copy zip to `factory-standards/imports/<tenantId>/`
2. Run: `npm run validate:package -- imports/<tenantId>`
3. If validation fails, use `TENANT_REPAIR_PROMPT.md`

### Prohibited

- Do not redesign the application.
- Do not add features for certification.
- Do not fake live Factory or tenant integrations.
- Do not mark `connected` without proof.
- Do not commit secrets to certification artifacts.

### Success

A complete, honest certification package ready for factory-standards validation.
