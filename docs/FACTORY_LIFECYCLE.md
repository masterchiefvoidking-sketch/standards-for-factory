# Factory Lifecycle

Every repository, feature, module, and subsystem permanently lives in **one lifecycle state**.

Software evolves. Lifecycle makes that visible.

## States

```text
Discovery
    ↓
Architecture
    ↓
Construction
    ↓
Qualification
    ↓
Certified
    ↓
Operational
    ↓
Maintenance
    ↓
Deprecated
    ↓
Archived
```

## State definitions

| State | Meaning |
|-------|---------|
| **Discovery** | Purpose unclear; exploring scope |
| **Architecture** | Design and boundaries defined; not building yet |
| **Construction** | Active implementation |
| **Qualification** | Certification package in progress; validation loop |
| **Certified** | Passed factory-standards validation; not yet operational |
| **Operational** | In use; meeting mission in production or daily workflow |
| **Maintenance** | Stable; bugfixes and minor updates only |
| **Deprecated** | Scheduled for replacement; no new features |
| **Archived** | Retired; read-only reference |

## Manifest field

Every certification package should declare lifecycle in `factory-manifest.json`:

```json
"lifecycle": {
  "state": "operational",
  "qualificationPercent": 96,
  "certified": true,
  "updatedAt": "2026-07-05T17:00:00Z"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `state` | Yes | Current lifecycle state (enum) |
| `qualificationPercent` | Yes | 0–100 readiness from last validation |
| `certified` | Yes | `true` if factory-standards validation PASS |
| `updatedAt` | Yes | ISO 8601 timestamp |

## README badge

Every repo displays status at the top of README:

```markdown
| Factory Lifecycle | Operational |
| Qualification | 96% |
| Certified | YES |
```

Template: [templates/README_BADGE.template.md](../templates/README_BADGE.template.md)

## Example answers

**"Is Horizon finished?"**

Not "yes" or "no" — answer:

```text
Lifecycle: Construction
Qualification: 71%
Certified: NO
```

**"Where is Factory?"**

```text
Lifecycle: Operational
Qualification: 94%
Certified: YES (provisional)
```

## Rules

1. One state per repo at a time (primary state).
2. Update lifecycle when certification status changes.
3. `certified: true` requires validation PASS in factory-standards.
4. Subsystems may declare their own lifecycle in docs; repo README shows aggregate.

## Related

- [FACTORY_ROADMAP.md](FACTORY_ROADMAP.md)
- [QUALIFICATION_LOOP_STANDARD.md](QUALIFICATION_LOOP_STANDARD.md)
- [CERTIFICATION_PACKAGE_LAYOUT.md](CERTIFICATION_PACKAGE_LAYOUT.md)
