# Tenant Certification Kit

Official reusable kit for generating Factory certification packages from any tenant repository.

**Copy this folder into a tenant repo**, or reference it from factory-standards. Do not modify factory-standards schemas from the tenant side.

## Contents

```text
tenant-certification-kit/
  README.md                          # This file
  prompts/
    TENANT_CERTIFICATION_PROMPT.md   # Run in Cursor inside tenant repo
    TENANT_REPAIR_PROMPT.md          # Fix failures after validation
    TENANT_REQUALIFICATION_PROMPT.md # Re-run after repairs
  templates/                         # Blank artifacts to fill
  scripts/
    package-certification.ts         # Zip/folder packager
```

## Quick start (tenant repo)

```text
1. Copy tenant-certification-kit/ into your repo (or clone factory-standards alongside)
2. Create factory-certification/ in repo root
3. Copy templates/* into factory-certification/
4. Open prompts/TENANT_CERTIFICATION_PROMPT.md in Cursor
5. Paste the prompt and run certification
6. Package (from factory-standards clone):
     npm run package:certification -- factory-certification
   Or from tenant with standards path:
     FACTORY_STANDARDS_PATH=../standards-for-factory npx tsx tenant-certification-kit/scripts/package-certification.ts factory-certification
7. Copy zip to factory-standards/imports/<tenantId>/
8. Validate: npm run validate:package -- imports/<tenantId>
```

## Output

```text
factory-certification/
  factory-manifest.json
  factory-audit.json
  factory-health.json
  factory-qualification.json
  factory-report.md
  factory-events.json              # optional
  factory-objects.json             # optional
  factory-citadel-archive.json     # optional (Citadel only)

<tenantId>-factory-certification.zip
```

## Integration modes (honest)

Every declared integration must have a mode in `integrations.modes`:

| Mode | Meaning |
|------|---------|
| `mock` | Stubbed or faked; no live connection |
| `manual` | Human-driven handoff (zip, copy, email) |
| `imported` | Data arrives via certification package import |
| `connected` | Live integration verified at certification time |

**Rule:** Only use `connected` if the integration is in `integrations.implemented`.

## Rules

1. Audit truthfully — do not fake Factory connection.
2. Do not redesign or add features during certification.
3. Run `npm install`, `npm test`, `npm run build`, `npm run lint` when applicable.
4. Package and validate in factory-standards before claiming qualified.

## Related docs (factory-standards)

- [TENANT_CERTIFICATION_KIT.md](../docs/TENANT_CERTIFICATION_KIT.md)
- [HOW_TO_CERTIFY_A_TENANT.md](../docs/HOW_TO_CERTIFY_A_TENANT.md)
- [REPO_BY_REPO_WORKFLOW.md](../docs/REPO_BY_REPO_WORKFLOW.md)
- [VALIDATION_ENGINE.md](../docs/VALIDATION_ENGINE.md)
