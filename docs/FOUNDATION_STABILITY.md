# Foundation Stability

> **Foundation repositories should change slowly.**

`factory-standards` and `factory-core` must become **stable over time**.

Most future work happens in **tenant repositories**.

## Foundation repos

| Repo | Role | Change rate |
|------|------|-------------|
| factory-standards | The Law | Slow — amendments only |
| factory-core | The SDK | Slow — implements standards |

## Rule

If you find yourself **constantly editing foundations to accommodate one app**, ask:

> Should the app adapt to the standards instead?

Usually: **yes**.

## When foundation changes are allowed

1. Ecosystem-wide gap (not one tenant's shortcut)
2. Backward-compatible additive change (minor version)
3. Documented migration path (major version)
4. PR review with Supreme Court mindset — see [SUPREME_COURT.md](SUPREME_COURT.md)

## When to say no

- One tenant wants a custom schema field
- One app needs standards to bend for fake integrations
- Frequent patches to validator for single-repo edge cases
- Duplicating business logic into factory-core

## Signal

**122+ changed files** in early foundation work is acceptable once.

Repeated large foundation diffs per tenant is a **smell**.

## Tenant work belongs in tenants

```text
Audit → Repair → Certify → Integrate
```

Per [FACTORY_ROADMAP.md](FACTORY_ROADMAP.md), after foundation lock: **Citadel next**, then one repo at a time.

## Related

- [FACTORY_ROADMAP.md](FACTORY_ROADMAP.md)
- [SUPREME_COURT.md](SUPREME_COURT.md)
- [FOUNDATION_CORE_RULES.md](FOUNDATION_CORE_RULES.md)
