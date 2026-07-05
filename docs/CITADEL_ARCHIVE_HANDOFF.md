# Citadel Archive Handoff

Protocol ID: `factory.citadel-handoff.v1`  
Version: 1.0.0

## Purpose

Defines the optional `factory-citadel-archive.json` artifact for Citadel tenants exporting archive metadata as part of certification.

This is a **handoff descriptor**, not the archive binary itself.

## When to include

Include `factory-citadel-archive.json` when:

- Tenant is Citadel or a Citadel-integrated application
- An archive export exists or is being prepared for Factory import
- Archive integrity must be verified at certification time

Do not include for tenants without Citadel archive responsibility.

## Artifact structure

See `schemas/factory-citadel-archive.schema.json` and `templates/factory-citadel-archive.template.json`.

### Required fields

| Field | Description |
|-------|-------------|
| `archive.id` | Unique archive identifier |
| `archive.format` | `citadel-v1`, `json-bundle`, or `tar-gz` |
| `archive.checksum` | SHA-256 hex digest of archive payload |
| `archive.recordCount` | Total records across collections |

### Handoff status

| Status | Meaning |
|--------|---------|
| `ready` | Archive prepared; awaiting transfer |
| `transferred` | Archive delivered to destination |
| `verified` | Checksum verified at destination |
| `failed` | Handoff failed; see notes |

## Workflow

```text
1. Citadel exports archive binary (separate from certification zip)
2. Compute SHA-256 checksum
3. Populate factory-citadel-archive.json with metadata
4. Include in citadel-factory-certification.zip
5. Factory import verifies checksum when archive arrives
6. Update handoff.status to verified
```

## Separation of concerns

| Item | Location |
|------|----------|
| Archive metadata | `factory-citadel-archive.json` in certification zip |
| Archive binary | Separate secure transfer channel |
| Verification | Factory import protocol |

Do not embed large archive binaries inside certification zips unless explicitly agreed and size limits documented.

## Collections

The `archive.collections` array documents named collections and record counts:

```json
{
  "collections": [
    { "name": "documents", "count": 1240 },
    { "name": "entities", "count": 89 }
  ]
}
```

## Security

- Certification metadata must not contain archive encryption keys
- Checksums enable integrity verification only
- Access control for archive binary remains Citadel/Factory operational concern

---

*See also: [FACTORY_IMPORT_PROTOCOL.md](FACTORY_IMPORT_PROTOCOL.md), [TENANT_REPOSITORY_PROTOCOL.md](TENANT_REPOSITORY_PROTOCOL.md)*
