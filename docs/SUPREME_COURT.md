# The Supreme Court

**factory-standards is the Supreme Court of the Factory ecosystem.**

When two repositories disagree — on contracts, schemas, naming, certification format, or integration rules — **factory-standards wins**.

Not Factory (the HQ app).  
Not factory-core (the SDK).  
Not Citadel, Forgina, or any tenant.

**Standards.**

## Constitutional role

| Layer | Role | Dispute authority |
|-------|------|-------------------|
| factory-standards | **The Law** | **Final authority** |
| factory-core | The SDK | Implements law; cannot override |
| Applications | Tenants | Must comply; cannot redefine proof |

## What standards decides

- Certification package layout and required files
- JSON schemas and protocol IDs
- Qualification criteria and repair order
- Integration mode honesty rules
- Compatibility matrix minimum versions
- Lifecycle state definitions

## What standards does not decide

- Tenant product features
- UI design inside applications
- Business logic in tenant repos
- Implementation details inside factory-core helpers (as long as they comply)

## Resolution process

```text
1. Dispute identified (schema mismatch, naming conflict, etc.)
2. Check factory-standards docs and schemas
3. If unclear, propose amendment via PR to factory-standards
4. Tenant or core adapts to standards — not the reverse
5. Exception: standards amendment with migration path
```

## Anti-pattern

> "Citadel needs a different manifest field — let's patch standards quickly."

**Wrong** unless the field benefits the whole ecosystem. If one app drives foundation churn, the app should adapt. See [FOUNDATION_STABILITY.md](FOUNDATION_STABILITY.md).

## Related

- [FACTORY_STANDARDS_CONSTITUTION.md](FACTORY_STANDARDS_CONSTITUTION.md)
- [FOUNDATION_STABILITY.md](FOUNDATION_STABILITY.md)
- [FACTORY_ROADMAP.md](FACTORY_ROADMAP.md)
