# docs/openapi

Contratos e assets da documentação OpenAPI.

Leia primeiro:

1. `v1/profiles-api.json`

## Compatibilidade backward

- O contrato versionado atual é `docs/openapi/v1/profiles-api.json`.
- O baseline de compatibilidade em CI é o mesmo arquivo presente na branch base do PR ou no commit anterior da branch.
- Mudança breaking em `v1` deve falhar no gate e exigir novo major de API/contrato.
- Validações locais:
  - `npm run openapi:export`
  - `npm run openapi:check`
  - `npm run openapi:compat -- <baseline.json> docs/openapi/v1/profiles-api.json`
