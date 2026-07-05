# Factory Report Metadata (Optional Sidecar)

**Status:** Reserved — **not enforced** by the certification package validator.

## Summary

`schemas/factory-report.schema.json` defines an **optional metadata sidecar** for human-readable certification reports. It is **not** part of the required certification package layout.

| Artifact | Required? | Validated by package inspector? |
|----------|-----------|--------------------------------|
| `factory-report.md` | **Yes** | Presence + non-empty only |
| `factory-report-meta.json` | **No** | **Not wired** — schema exists for future use |

## Why it exists

The schema documents a machine-readable companion that could summarize:

- `reportId`, `format`, `status`
- `summary.qualificationStatus`, `auditStatus`, `healthStatus`
- Optional `artifacts[]` checklist

No certification package in this repository currently ships `factory-report-meta.json`.

## Validator behavior

The package validator (`src/validator.ts`) checks `factory-report.md` only. It does **not** load or validate `factory-report-meta.json` against `factory-report.schema.json`.

To add sidecar validation in a future standards version:

1. Add `factory-report-meta.json` to `OPTIONAL_FILES` in `src/types.ts`
2. Map it in `SCHEMA_MAP`
3. Amend `CERTIFICATION_PACKAGE_LAYOUT.md` and bump `standardsVersion` if required

## Related

- [schemas/factory-report.schema.json](../schemas/factory-report.schema.json)
- [schemas/README.md](../schemas/README.md)
- [CERTIFICATION_PACKAGE_LAYOUT.md](CERTIFICATION_PACKAGE_LAYOUT.md)
