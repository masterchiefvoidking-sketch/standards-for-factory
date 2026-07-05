# Repo-by-Repo Workflow

Official workflow for certifying Factory ecosystem repositories one at a time.

## Principle

```text
Each repository proves itself.
Factory Standards defines the proof.
Factory imports the proof.
```

No monorepo required. Zips are the bridge.

## Workflow

```text
┌─────────────────────────────────────────────────────────────────┐
│ 1. Open tenant repo in Cursor                                   │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Paste TENANT_CERTIFICATION_PROMPT.md                         │
│    Audit repo · run npm scripts · fill artifacts                │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Package: npx tsx tenant-certification-kit/scripts/...        │
│    Output: <tenantId>-factory-certification.zip                 │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Copy to factory-standards/imports/<tenantId>/                │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Validate: npm run validate:package -- imports/<tenantId>     │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
                      PASS? ──no──▶ 6. TENANT_REPAIR_PROMPT.md
                             │              │
                            yes             │
                             │              └──▶ 3. Repackage
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. TENANT_REQUALIFICATION_PROMPT.md (finalize qualification)    │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. Revalidate until PASS                                        │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. Repeat repair loop until qualified                            │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 10. Import final package into Factory                            │
└─────────────────────────────────────────────────────────────────┘
```

## Per-repo checklist

| Step | Action | Location |
|------|--------|----------|
| 1 | Open repo | Tenant workspace |
| 2 | Certify | `TENANT_CERTIFICATION_PROMPT.md` |
| 3 | Package | `factory-certification/` → zip |
| 4 | Copy | `factory-standards/imports/<tenantId>/` |
| 5 | Validate | `npm run validate:package` |
| 6 | Repair | `TENANT_REPAIR_PROMPT.md` |
| 7 | Requalify | `TENANT_REQUALIFICATION_PROMPT.md` |
| 8–9 | Loop | Until PASS + qualified |
| 10 | Import | Factory |

## Recommended certification order

| Order | Tenant | Slug | Notes |
|-------|--------|------|-------|
| 1 | Factory | `factory` | Core import orchestrator |
| 2 | Citadel | `citadel` | Archive + optional handoff |
| 3 | Forgina | `forgina` | Standard tenant |
| 4 | Horizon | `horizon` | Toolbelt |
| 5 | BossLady | `bosslady` | Standard tenant |
| — | Flippy, FIP, Observatory, Sentinel, Forge | — | When repos exist |

## Artifacts per repo

Each repo produces independently:

```text
<tenantId>-factory-certification.zip
  ├── factory-manifest.json
  ├── factory-audit.json
  ├── factory-health.json
  ├── factory-qualification.json
  └── factory-report.md
```

## Validation in factory-standards

```bash
cd factory-standards
npm run validate:package -- imports/factory
npm run validate:package -- imports/citadel
npm run validate:package -- imports/forgina
```

## What each repo needs

| Item | Source |
|------|--------|
| Certification kit | Copy from `factory-standards/tenant-certification-kit/` |
| Schemas | Reference `factory-standards/schemas/` |
| Validator | Run from `factory-standards` only |

Tenants do **not** need factory-standards as a dependency — only the copied kit and final validation step.

## Next: first real certifications

1. **Factory repo** — run TENANT_CERTIFICATION_PROMPT
2. **Citadel repo** — include optional archive artifact
3. **Forgina repo** — standard tenant flow

Each follows this same repo-by-repo workflow.

## Related

- [HOW_TO_CERTIFY_A_TENANT.md](HOW_TO_CERTIFY_A_TENANT.md)
- [TENANT_CERTIFICATION_KIT.md](TENANT_CERTIFICATION_KIT.md)
- [FACTORY_IMPORT_PROTOCOL.md](FACTORY_IMPORT_PROTOCOL.md)
