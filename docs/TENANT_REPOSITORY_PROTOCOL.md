# Tenant Repository Protocol

Protocol ID: `factory.tenant.v1`  
Version: 1.0.0

## Purpose

Defines what each Factory ecosystem tenant repository must do to participate in certification.

## Tenant responsibilities

### 1. Self-containment

Each tenant repo must be able to:

- Build (or document why build is N/A)
- Run its own audit/certification workflow
- Generate a complete certification package without Factory repo access

### 2. Certification workspace

Recommended layout inside tenant repo:

```text
factory-certification/          # generated output (gitignored optional)
  factory-manifest.json
  factory-audit.json
  factory-health.json
  factory-qualification.json
  factory-report.md
  factory-events.json             # optional
  factory-objects.json            # optional
  factory-citadel-archive.json    # optional
```

Alternatively, output directly to a zip without committing artifacts.

### 3. Manifest accuracy

`factory-manifest.json` must reflect:

- Current repository name and URL
- Current commit SHA at package generation time
- Real capabilities (not aspirational)
- Honest `integrations.declared` vs `integrations.implemented`

### 4. No fake integrations

Do not list integrations as `implemented` unless verified at certification time.

Acceptable states:

- Declared but not implemented → list only under `declared`
- Not applicable → omit from both arrays
- Implemented → list under both `declared` and `implemented`

### 5. Schema compliance

All JSON artifacts must validate against factory-standards schemas before packaging.

### 6. Package naming

```text
{tenant-slug}-factory-certification.zip
```

Examples:

- `citadel-factory-certification.zip`
- `horizon-factory-certification.zip`
- `bosslady-factory-certification.zip`

### 7. Secrets prohibition

Certification packages must not contain:

- API keys, tokens, or passwords
- Private keys or certificates
- `.env` files with live credentials

Redact or exclude sensitive paths during packaging.

## Per-tenant notes

| Tenant | Slug | Notes |
|--------|------|-------|
| Factory | `factory` | Core orchestrator; certifies its import capabilities |
| Citadel | `citadel` | May include `factory-citadel-archive.json` |
| Forgina | `forgina` | Standard package |
| Horizon / Toolbelt | `horizon` | Standard package |
| BossLady | `bosslady` | Standard package |
| Flippy | `flippy` | Certify when repo exists |
| FIP | `fip` | Certify when repo exists |
| Observatory | `observatory` | Certify when repo exists |
| Sentinel | `sentinel` | Certify when repo exists |
| Forge | `forge` | Certify when repo exists |

## Workflow

```text
1. Open tenant repo in Cursor
2. Run certification protocol (see FACTORY_CERTIFICATION_PROTOCOL.md)
3. Generate {tenant}-factory-certification.zip
4. Copy to factory-standards/imports/{tenant}/
5. Validate in factory-standards
6. Repair failures per REPAIR_ORDER.md
7. Repeat until qualified
```

## First-time setup checklist

- [ ] Clone or reference factory-standards
- [ ] Create certification output directory
- [ ] Copy templates
- [ ] Fill manifest with accurate metadata
- [ ] Run audit checks
- [ ] Capture health signals
- [ ] Evaluate qualification criteria
- [ ] Write report
- [ ] Validate against schemas
- [ ] Create zip
- [ ] Deliver to imports/

---

*See also: [FACTORY_CERTIFICATION_PROTOCOL.md](FACTORY_CERTIFICATION_PROTOCOL.md), [QUALIFICATION_LOOP_STANDARD.md](QUALIFICATION_LOOP_STANDARD.md)*
