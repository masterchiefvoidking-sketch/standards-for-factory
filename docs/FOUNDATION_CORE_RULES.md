# factory-core Rules

factory-core (`@factory/core`) is **The SDK**. It must contain **zero business logic**.

## Allowed

| Category | Examples |
|----------|----------|
| Types | Manifest, audit, health, qualification, event, object types |
| Validators | Schema validation functions |
| Utilities | Pure helpers, string/format utils |
| SDK | Certification create, read, score, layout check |
| Interfaces | Contract shapes, enums |
| Event helpers | Event envelope builders |
| Object helpers | Object registry helpers |
| Health helpers | Health snapshot builders |
| Report helpers | Report metadata parsers |
| Citadel helpers | Archive package builders |
| Standards compatibility | Mirrors factory-standards constants |

## Forbidden

| Category | Why |
|----------|-----|
| Product decisions | Belongs in tenant apps |
| UI opinions | Belongs in Factory HQ / tenant UIs |
| Tenant workflows | Belongs in each tenant repo |
| Business logic | Domain rules live in applications |
| AI prompts | Belongs in tenant-certification-kit / tenant repos |

## Separation

```text
factory-standards  →  defines what proof means
factory-core       →  helps build and validate proof
tenant apps        →  implement product behavior
```

factory-core **does not replace** factory-standards.  
factory-core **does not own** tenant app behavior.

Approved: [foundation/FACTORY_CORE_VALIDATION.md](foundation/FACTORY_CORE_VALIDATION.md)

## Enforcement

- PR review against this list
- Certification audit check: `check.no-business-logic`
- If logic is tenant-specific → move to tenant repo
- If logic defines proof → belongs in factory-standards, not core

## Related

- [SUPREME_COURT.md](SUPREME_COURT.md)
- [FOUNDATION_STABILITY.md](FOUNDATION_STABILITY.md)
