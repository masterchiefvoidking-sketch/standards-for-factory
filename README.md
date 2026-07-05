# factory-standards

| | |
|---|---|
| **Factory Lifecycle** | Operational |
| **Qualification** | 100% |
| **Certified** | YES |

Standards repository for the Factory ecosystem.

This repo does **not** contain tenant application code. It defines contracts, schemas, protocols, audit standards, certification package formats, tenant manifests, integration rules, and qualification loops.

## Core rule

**Each repository proves itself. Factory Standards defines the proof. Factory imports the proof.**

Factory Standards does not assume direct access to tenant repositories. Each tenant generates a **Factory Certification Package** and delivers it (typically as a zip) for import and validation.

## Structure

```text
factory-standards/
  contracts/     # Cross-tenant interface contracts
  schemas/       # JSON Schema definitions for certification artifacts
  protocols/     # Machine-readable protocol definitions
  templates/     # Blank templates for certification packages
  examples/      # Valid sample certification packages per tenant
  imports/       # Drop zone for tenant certification zips
  docs/          # Constitution, protocols, and operational guides
```

## Certification package

Every tenant repo must eventually produce:

| File | Required |
|------|----------|
| `factory-manifest.json` | Yes |
| `factory-audit.json` | Yes |
| `factory-health.json` | Yes |
| `factory-qualification.json` | Yes |
| `factory-report.md` | Yes |
| `compatibility.json` | Recommended |
| `factory-events.json` | Optional |
| `factory-objects.json` | Optional |
| `factory-citadel-archive.json` | Optional |

Package naming convention: `{tenant}-factory-certification.zip` (e.g. `citadel-factory-certification.zip`).

## Workflow

```text
1. Open a tenant repo in Cursor
2. Run the Tenant Certification Protocol (see docs/TENANT_REPOSITORY_PROTOCOL.md)
3. Generate {tenant}-factory-certification.zip
4. Place the zip in factory-standards/imports/{tenant}/
5. Validate: npm run validate:package -- imports/{tenant}
6. Review validation-report.md and factory-report.md
7. Repair tenant per docs/REPAIR_ORDER.md
8. Repeat until qualified
```

## Validation

factory-standards includes a certification package validator:

```bash
npm install
npm run validate:package -- imports/examples/citadel-valid
npm run validate:examples
npm test
npm run typecheck
```

See [docs/VALIDATION_ENGINE.md](docs/VALIDATION_ENGINE.md).

## Documentation

| Document | Purpose |
|----------|---------|
| [FACTORY_STANDARDS_CONSTITUTION.md](docs/FACTORY_STANDARDS_CONSTITUTION.md) | Governing principles |
| [FACTORY_CERTIFICATION_PROTOCOL.md](docs/FACTORY_CERTIFICATION_PROTOCOL.md) | End-to-end certification process |
| [TENANT_REPOSITORY_PROTOCOL.md](docs/TENANT_REPOSITORY_PROTOCOL.md) | What each tenant repo must do |
| [FACTORY_IMPORT_PROTOCOL.md](docs/FACTORY_IMPORT_PROTOCOL.md) | How Factory imports packages |
| [CITADEL_ARCHIVE_HANDOFF.md](docs/CITADEL_ARCHIVE_HANDOFF.md) | Citadel archive optional handoff |
| [QUALIFICATION_LOOP_STANDARD.md](docs/QUALIFICATION_LOOP_STANDARD.md) | Qualification loop definition |
| [REPAIR_ORDER.md](docs/REPAIR_ORDER.md) | Priority order for repairs |
| [VALIDATION_ENGINE.md](docs/VALIDATION_ENGINE.md) | Package validation inspector |
| [CERTIFICATION_PACKAGE_LAYOUT.md](docs/CERTIFICATION_PACKAGE_LAYOUT.md) | Required package file layout |
| [VALIDATION_SCORING.md](docs/VALIDATION_SCORING.md) | Readiness scoring model |
| [TENANT_CERTIFICATION_KIT.md](docs/TENANT_CERTIFICATION_KIT.md) | Official tenant generator kit |
| [HOW_TO_CERTIFY_A_TENANT.md](docs/HOW_TO_CERTIFY_A_TENANT.md) | Step-by-step certification |
| [REPO_BY_REPO_WORKFLOW.md](docs/REPO_BY_REPO_WORKFLOW.md) | Repo-by-repo workflow |
| [FACTORY_CORE_VALIDATION.md](docs/foundation/FACTORY_CORE_VALIDATION.md) | factory-core foundation approval |
| [FACTORY_ROADMAP.md](docs/FACTORY_ROADMAP.md) | Master execution plan |
| [FACTORY_LIFECYCLE.md](docs/FACTORY_LIFECYCLE.md) | Repository lifecycle states |
| [SUPREME_COURT.md](docs/SUPREME_COURT.md) | Standards as constitutional authority |
| [FOUNDATION_STABILITY.md](docs/FOUNDATION_STABILITY.md) | Foundation repos change slowly |
| [FOUNDATION_CORE_RULES.md](docs/FOUNDATION_CORE_RULES.md) | factory-core allowed/forbidden |
| [REPOSITORY_BOOTSTRAP.md](docs/REPOSITORY_BOOTSTRAP.md) | One-command tenant bootstrap |
| [compatibility/README.md](compatibility/README.md) | Ecosystem compatibility matrix |
| [FACTORY_REPORT_METADATA.md](docs/FACTORY_REPORT_METADATA.md) | Optional report sidecar schema |
| [repair/REPAIR_PLAN.md](docs/repair/REPAIR_PLAN.md) | Foundation completion repair plan |

## Tenant bootstrap

```bash
npm run bootstrap -- --tenant citadel --target ../citadel
```

## Tenant certification kit

Copy `tenant-certification-kit/` into any tenant repo. Paste `prompts/TENANT_CERTIFICATION_PROMPT.md` in Cursor to generate a certification package.

```bash
npm run kit:check
npm run kit:package-example
npm run package:certification -- imports/examples/citadel-valid imports/examples
npm run validate:zips
```

## Known ecosystem repos

Factory apps are separate repositories:

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

Standards apply to all; presence of optional integrations is declared in each tenant's manifest, not assumed by this repo.
