# Repository Bootstrap

One command to start every future tenant the same way.

```bash
npx tsx /path/to/factory-standards/scripts/factory-bootstrap.ts --tenant citadel
```

Or from a cloned factory-standards repo:

```bash
npm run bootstrap -- --tenant citadel --target ../citadel
```

## What it installs

| Item | Location |
|------|----------|
| tenant-certification-kit | `{target}/tenant-certification-kit/` |
| factory-certification workspace | `{target}/factory-certification/` |
| Templates | Copied from kit |
| compatibility.json stub | `factory-certification/compatibility.json` |
| README badge snippet | Appended or written to `{target}/README.factory-badge.md` |

## Prerequisites

- Node.js 18+
- factory-standards cloned (this repo)
- Target tenant repo path

## After bootstrap

```text
1. Open tenant repo in Cursor
2. Paste tenant-certification-kit/prompts/TENANT_CERTIFICATION_PROMPT.md
3. Audit, fill artifacts, package
4. Copy zip to factory-standards/imports/{tenant}/
5. npm run validate:package -- imports/{tenant}
```

## Why before every tenant

Citadel, Forgina, BossLady, Horizon — all start identical:

- Same kit
- Same templates
- Same compatibility stub
- Same validation path

No reinventing certification per repo.

## Related

- [TENANT_CERTIFICATION_KIT.md](TENANT_CERTIFICATION_KIT.md)
- [HOW_TO_CERTIFY_A_TENANT.md](HOW_TO_CERTIFY_A_TENANT.md)
- [FACTORY_ROADMAP.md](FACTORY_ROADMAP.md)
