# Contracts

Cross-tenant interface contracts for the Factory ecosystem.

Contracts define stable boundaries between Factory applications. They are versioned, tenant-agnostic, and validated through certification packages — not through live repo access.

## Contract categories

| Contract | Description | Status |
|----------|-------------|--------|
| `certification-package` | Required files and naming for tenant certification zips | Active — see `schemas/` |
| `tenant-manifest` | Identity, capabilities, and integration declarations | Active — `factory-manifest.schema.json` |
| `event-envelope` | Standard event shape for optional `factory-events.json` | Active — `factory-event.schema.json` |
| `object-registry` | Standard object shape for optional `factory-objects.json` | Active — `factory-object.schema.json` |
| `citadel-archive` | Archive handoff for Citadel tenants | Active — `factory-citadel-archive.schema.json` |

## Rules

1. Contracts are additive. Breaking changes require a new major schema version.
2. Tenants declare which contracts they implement in `factory-manifest.json`.
3. Factory validates imported packages against schemas; it does not crawl tenant repos.
4. New contracts are proposed here first, then reflected in `schemas/` and `docs/`.

## Adding a contract

1. Document the contract in this directory.
2. Add or extend a JSON Schema in `schemas/`.
3. Add a template in `templates/` if the contract produces artifacts.
4. Update `docs/FACTORY_STANDARDS_CONSTITUTION.md` if principles change.
