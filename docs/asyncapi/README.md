# docs/asyncapi

Contratos e assets da documentação AsyncAPI.

Leia primeiro:

1. `v1/standard-ms-events.json`
2. `html/index.html`

## Compatibilidade backward

- O contrato versionado atual é `docs/asyncapi/v1/standard-ms-events.json`.
- O caminho canônico do artefato também deve permanecer sincronizado com `service-identity.json`.
- O baseline de compatibilidade em CI é o mesmo arquivo presente na branch base do PR ou no commit anterior da branch.
- Mudança breaking em `v1` deve falhar no gate e exigir novo major de evento/contrato.
- O contrato AsyncAPI versionado e o helper `event-schema-registry.ts` formam apenas um registry local derivado do repositório; isso não equivale a integração com `Schema Registry externo`.
- Ao derivar um novo serviço, renomeie o arquivo versionado e a entrada `defaultAsyncApiArtifact` de `service-identity.json` no mesmo ciclo de bootstrap.
- Validações locais:
  - `npm run asyncapi:check`
  - `npm run asyncapi:compat -- <baseline.json> docs/asyncapi/v1/standard-ms-events.json`
