# Factory Roadmap

Master execution plan for the Factory ecosystem. **One roadmap. No guessing.**

```text
FOUNDATION

✓ factory-standards      The Law — schemas, validator, certification kit
✓ factory-core           The SDK — @factory/core approved for tenant use
✓ Factory Certification  Run 001 — Factory HQ provisional
✓ Lifecycle standard     docs/FACTORY_LIFECYCLE.md
✓ Compatibility matrix   compatibility/matrix.json
✓ Repository bootstrap   scripts/factory-bootstrap.ts

----------------------------

TENANTS

□ Citadel                Next — certification run 001
□ Forgina
□ BossLady
□ Horizon
□ Flippy                 (if exists)
□ FIP                    (if exists)
□ Observatory            (if exists)
□ Sentinel               (if exists)
□ Forge                  (if exists)

----------------------------

ENTERPRISE

□ Cross-Repo Certification
□ Enterprise Qualification
□ Beta
□ Production
```

## Current focus

**Citadel certification run 001** using factory-core + factory-standards.

From here: audit → repair → certify → integrate. One repository at a time.

## Rules

1. **Stop inventing foundation pieces** after Citadel starts unless a tenant proves a gap.
2. **Foundation repos change slowly** — see [FOUNDATION_STABILITY.md](FOUNDATION_STABILITY.md).
3. **factory-standards is the Supreme Court** — see [SUPREME_COURT.md](SUPREME_COURT.md).
4. Most future work happens in **tenant repositories**.

## Layer model

```text
factory-standards   →  The Law
factory-core        →  The SDK
Applications        →  Factory, Citadel, Forgina, BossLady, Horizon, ...
```

## Status key

| Symbol | Meaning |
|--------|---------|
| ✓ | Complete / approved |
| □ | Not started or in progress |
| ⏳ | In progress |

Update this file when a tenant certifies or foundation milestones complete.
