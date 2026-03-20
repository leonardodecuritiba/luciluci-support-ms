# docs/asyncapi

Contratos e assets da documentação AsyncAPI.

Leia primeiro:

1. `v1/standard-ms-events.json`
2. `html/index.html`

## Compatibilidade backward

- O contrato versionado atual é `docs/asyncapi/v1/standard-events.json`.
- O baseline de compatibilidade em CI é o mesmo arquivo presente na branch base do PR ou no commit anterior da branch.
- Mudança breaking em `v1` deve falhar no gate e exigir novo major de evento/contrato.
- Validações locais:
  - `npm run asyncapi:check`
  - `npm run asyncapi:compat -- <baseline.json> docs/asyncapi/v1/standard-events.json`
