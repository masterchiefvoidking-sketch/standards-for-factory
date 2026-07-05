# How to Certify a Tenant

Step-by-step guide for certifying any Factory ecosystem repository.

## Prerequisites

- `factory-standards` cloned locally
- Tenant repository checked out
- Node.js 18+
- Cursor (or equivalent)

## Overview

```text
Tenant repo  →  generate package  →  factory-standards  →  validate  →  repair loop  →  Factory import
```

Each repository proves itself. No live cross-repo access required.

## Steps

### 1. Prepare tenant repo

Copy the certification kit:

```bash
cp -r /path/to/factory-standards/tenant-certification-kit ./tenant-certification-kit
mkdir factory-certification
cp tenant-certification-kit/templates/* factory-certification/
```

### 2. Run certification prompt

Open the tenant repo in Cursor. Paste entire contents of:

```text
tenant-certification-kit/prompts/TENANT_CERTIFICATION_PROMPT.md
```

Cursor will:

- Audit the repo truthfully
- Run npm install, test, build, lint
- Fill all certification artifacts
- Not redesign or add features
- Mark integration modes honestly

### 3. Package

```bash
npx tsx tenant-certification-kit/scripts/package-certification.ts factory-certification
```

Output: `<tenantId>-factory-certification.zip`

### 4. Deliver to factory-standards

```bash
cp <tenantId>-factory-certification.zip /path/to/factory-standards/imports/<tenantId>/
cd /path/to/factory-standards
unzip -o imports/<tenantId>/<tenantId>-factory-certification.zip -d imports/<tenantId>/
```

Or copy the zip only — validator accepts both zip and directory.

### 5. Validate

```bash
npm run validate:package -- imports/<tenantId>
```

Read `validation-report.md` in the package directory.

### 6. Repair (if FAIL)

Return to tenant repo. Paste:

```text
tenant-certification-kit/prompts/TENANT_REPAIR_PROMPT.md
```

Fix errors per report. Re-package. Re-validate.

### 7. Requalify (if PASS)

Paste:

```text
tenant-certification-kit/prompts/TENANT_REQUALIFICATION_PROMPT.md
```

Finalize qualification status. Re-package. Final validation.

### 8. Factory import

Import final package into Factory per `FACTORY_IMPORT_PROTOCOL.md`.

## Integration honesty checklist

- [ ] Every `declared` integration has a `modes` entry
- [ ] `connected` only for verified live integrations
- [ ] `implemented` list matches reality
- [ ] Health dependencies not marked `available` for unimplemented integrations
- [ ] Audit does not claim integration pass without evidence

## Certification order (recommended)

1. **Factory** — core orchestrator
2. **Citadel** — archive handoff
3. **Forgina** — standard tenant
4. Horizon, BossLady, others

## Do not

- Fake Factory connection
- Skip validation in factory-standards
- Patch single artifacts without re-auditing
- Commit secrets in certification packages

## Related

- [REPO_BY_REPO_WORKFLOW.md](REPO_BY_REPO_WORKFLOW.md)
- [TENANT_CERTIFICATION_KIT.md](TENANT_CERTIFICATION_KIT.md)
- [VALIDATION_ENGINE.md](VALIDATION_ENGINE.md)
- [REPAIR_ORDER.md](REPAIR_ORDER.md)
