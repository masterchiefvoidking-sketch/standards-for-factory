# Factory Import Protocol

Protocol ID: `factory.import.v1`  
Version: 1.0.0

## Purpose

Defines how Factory (or factory-standards operators) import and process tenant certification packages.

Factory does **not** crawl tenant repositories. Import is package-driven.

## Import sources

| Source | Path | Use case |
|--------|------|----------|
| Standards drop zone | `factory-standards/imports/{tenant}/` | Manual zip delivery |
| Factory import store | TBD in Factory app | Automated ingestion |
| Direct zip upload | Cursor / CLI | One-off certification |

## Package requirements

### Naming

```text
{tenant-slug}-factory-certification.zip
```

### Required contents (zip root)

1. `factory-manifest.json`
2. `factory-audit.json`
3. `factory-health.json`
4. `factory-qualification.json`
5. `factory-report.md`

### Optional contents

6. `factory-events.json`
7. `factory-objects.json`
8. `factory-citadel-archive.json`

## Import steps

### 1. Receive

Accept zip from tenant operator. Place in `imports/{tenant}/` or Factory import queue.

### 2. Extract

Extract to a staging directory. Preserve file names exactly.

### 3. Verify presence

Confirm all required files exist. Record missing files as import failure.

### 4. Validate schemas

Validate each JSON file against corresponding schema in `schemas/`:

| File | Schema |
|------|--------|
| factory-manifest.json | factory-manifest.schema.json |
| factory-audit.json | factory-audit.schema.json |
| factory-health.json | factory-health.schema.json |
| factory-qualification.json | factory-qualification.schema.json |
| factory-events.json | factory-event.schema.json |
| factory-objects.json | factory-object.schema.json |
| factory-citadel-archive.json | factory-citadel-archive.schema.json |

`factory-report.md` is validated for presence and structure; metadata may be embedded in qualification or audit cross-references.

### 5. Cross-check

| Check | Rule |
|-------|------|
| Tenant ID consistency | Same `tenantId` / `tenant.id` across all artifacts |
| Commit alignment | Manifest `commitSha` matches tenant claim |
| Integration honesty | Audit flags declared-but-not-implemented |
| Qualification sync | Qualification status matches audit + health |

### 6. Record import

Log:

- Import timestamp
- Package name and checksum
- Validation results per file
- Overall import status: `accepted`, `rejected`, `accepted-with-warnings`

### 7. Surface results

- Display `factory-report.md` summary in Factory UI (when available)
- List blockers from `factory-qualification.json`
- Link failed audit checks to repair guidance

### 8. Qualification decision

| Qualification status | Import action |
|---------------------|---------------|
| `qualified` | Register tenant as certified |
| `provisional` | Register with warnings; set re-cert deadline |
| `unqualified` | Reject or hold; return repair list |
| `in-progress` | Accept package as draft only |

## Re-import

When a tenant submits a new package:

1. Supersede previous import for same tenant slug
2. Increment iteration tracking
3. Compare delta in audit checks and qualification criteria

## What Factory must NOT do

- Crawl private tenant folders
- Assume repo URLs are reachable
- Auto-discover integrations not in the package
- Merge tenant code into Factory

## Manual import (current bridge)

Until Factory automation exists:

```text
1. Receive citadel-factory-certification.zip
2. mkdir -p factory-standards/imports/citadel/
3. unzip citadel-factory-certification.zip -d factory-standards/imports/citadel/
4. Validate JSON against schemas/
5. Read factory-report.md
6. File repair issues in Citadel repo
7. Repeat
```

---

*See also: [FACTORY_CERTIFICATION_PROTOCOL.md](FACTORY_CERTIFICATION_PROTOCOL.md), [REPAIR_ORDER.md](REPAIR_ORDER.md)*
