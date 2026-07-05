# Tenant Certification Kit

The official reusable kit every Factory tenant repository uses to **generate** certification packages.

factory-standards defines the proof. Tenants generate the proof. The validator inspects the proof.

## Location

```text
tenant-certification-kit/
  README.md
  prompts/
    TENANT_CERTIFICATION_PROMPT.md
    TENANT_REPAIR_PROMPT.md
    TENANT_REQUALIFICATION_PROMPT.md
  templates/
    factory-manifest.json
    factory-audit.json
    factory-health.json
    factory-qualification.json
    factory-report.md
    factory-citadel-archive.json
  scripts/
    package-certification.ts
```

## How tenants use it

### Option A — Copy kit into tenant repo

```bash
cp -r factory-standards/tenant-certification-kit ./tenant-certification-kit
```

### Option B — Clone factory-standards alongside

```text
workspace/
  factory-standards/
  citadel/          # tenant repo
```

Reference templates and prompts from `../factory-standards/tenant-certification-kit/`.

## Certification output

Tenants generate `factory-certification/` in repo root:

| File | Required |
|------|----------|
| factory-manifest.json | Yes |
| factory-audit.json | Yes |
| factory-health.json | Yes |
| factory-qualification.json | Yes |
| factory-report.md | Yes |
| factory-events.json | Optional |
| factory-objects.json | Optional |
| factory-citadel-archive.json | Optional (Citadel) |

## Integration modes

Every declared integration must have an entry in `integrations.modes`:

| Mode | Meaning |
|------|---------|
| `mock` | Stubbed; no live connection |
| `manual` | Human handoff (zip, copy) |
| `imported` | Via certification package import |
| `connected` | Live integration verified now |

Validator rules:

- `connected` requires integration in `implemented`
- `mock`/`manual` with integration in `implemented` → warning

## Packaging

```bash
npx tsx tenant-certification-kit/scripts/package-certification.ts factory-certification
```

Produces `<tenantId>-factory-certification.zip`.

## factory-standards commands

```bash
npm run kit:check              # Verify kit layout
npm run kit:package-example    # Package citadel-valid example
```

## Prompts

| Prompt | When |
|--------|------|
| TENANT_CERTIFICATION_PROMPT.md | First certification in tenant repo |
| TENANT_REPAIR_PROMPT.md | After validation FAIL |
| TENANT_REQUALIFICATION_PROMPT.md | After validation PASS, before Factory import |

## Related

- [HOW_TO_CERTIFY_A_TENANT.md](HOW_TO_CERTIFY_A_TENANT.md)
- [REPO_BY_REPO_WORKFLOW.md](REPO_BY_REPO_WORKFLOW.md)
- [VALIDATION_ENGINE.md](VALIDATION_ENGINE.md)
- [CERTIFICATION_PACKAGE_LAYOUT.md](CERTIFICATION_PACKAGE_LAYOUT.md)
