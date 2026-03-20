# ACTUAL_STATE

## Objetivo

Entregar o `standard-ms` como template AI-first, executável e verificável para novos microserviços do ecossistema LuciLuci.

## Escopo desta release

- Feature de referência `profile`
- 5 RFs canônicas
- Infra local com PostgreSQL e RabbitMQ
- OpenAPI, AsyncAPI, outbox, idempotência, correlação, observabilidade, testes e CI/CD
- CI endurecido com gate automático de compatibilidade backward para o AsyncAPI versionado em `docs/asyncapi/v1/standard-events.json`, comparando o contrato atual com o baseline da branch base/commit anterior

## RFs

- RF01 `POST /profiles`
- RF02 `PATCH /profiles/{profileId}`
- RF03 `GET /profiles`
- RF04 `GET /profiles/by-external-id/{externalId}`
- RF05 consumo de `classifications.classification.assigned.v1`

## Checklist macro

- [x] Estrutura do repositório
- [x] Documentação AI-first
- [x] Infra local
- [x] Feature `profile`
- [x] Idempotência e correlação
- [x] Outbox e consumer
- [x] Testes
- [x] CI/CD
- [x] Validação final

## Checklist por RF

### RF01

- [x] Endpoint
- [x] Persistência
- [x] Idempotência
- [x] Evento publicado
- [x] Testes unitários
- [x] Testes de integração
- [x] Testes de contrato

### RF02

- [x] Endpoint
- [x] Regras de campos editáveis
- [x] Idempotência
- [x] Evento publicado
- [x] Testes unitários
- [x] Testes de integração
- [x] Testes de contrato

### RF03

- [x] Endpoint
- [x] Paginação, filtros e ordenação
- [x] Testes de integração
- [x] Contrato OpenAPI

### RF04

- [x] Endpoint
- [x] 404 mapeado
- [x] Testes unitários
- [x] Testes de integração

### RF05

- [x] Consumer
- [x] Idempotência de consumo
- [x] Snapshot atualizado
- [x] Contrato AsyncAPI
- [x] Testes unitários
- [x] Testes de integração
- [x] Testes de contrato

## Status atual

- status: `done`
- foco atual: release inicial concluída e validada

## Decisões tomadas

- Feature de referência: `profile`
- Sem Redis no mínimo viável
- Idempotência HTTP e de consumo persistidas no PostgreSQL
- Runtime local e produção em PostgreSQL
- Testes de integração em SQLite em memória
- Suíte de integração `tests/integration/events/outbox-rabbitmq.spec.ts` adicionada para provar `HTTP -> DB/outbox -> OutboxEventPublisherWorker -> RabbitMQ` com app real, PostgreSQL real e broker real
- `X-Correlation-ID` passou a ser exigido explicitamente nas rotas HTTP públicas de `profiles`, com parâmetro OpenAPI `required: true`, middleware antes do parse do body e evidência automatizada para rejeição de ausência

## Artefatos importantes

- `README.md`
- `AI_FIRST.md`
- `DRIFT_REPORT.md`
- `docs/architecture/overview.md`
- `docs/runbooks/local-development.md`

## Próximos passos

1. Montar `./luciluci-docs/` como submodule canônico
2. Renomear a feature `profile` para o domínio real
3. Seguir com novas RFs somente a partir da documentação canônica do novo serviço

## Regra mandatória para serviços derivados

- `profile` é apenas a feature de referência do template.
- Ao bootstrapar um novo microserviço, todas as referências a `profile` / `profiles` devem ser removidas ou substituídas pelo domínio real.
- Isso inclui, no mínimo:
  - `src/`
  - `tests/`
  - `README.md`
  - `AI_FIRST.md`
  - `ACTUAL_STATE.md`
  - `docs/`
  - contratos OpenAPI / AsyncAPI
  - exemplos de payload, eventos, filas, exchanges, rotas e nomes de RF
- A existência de diretórios vazios, exemplos residuais, endpoints, eventos ou menções textuais a `profile` caracteriza drift de template e deve ser tratada antes da validação do serviço derivado.

## Comandos de validação

```bash
npm run lint
npm run build
npm run openapi:export
npm run openapi:check
npm run asyncapi:check
npm run openapi:compat -- docs/openapi/v1/profiles-api.json docs/openapi/v1/profiles-api.json
npm run asyncapi:compat -- docs/asyncapi/v1/profiles-events.json docs/asyncapi/v1/profiles-events.json
npm run test:coverage
npm run coverage:check
npm run test -- --runTestsByPath tests/unit/scripts/check-asyncapi-backward-compatibility.spec.ts tests/contract/asyncapi/published-events.contract.test.ts tests/contract/asyncapi/consumed-events.contract.test.ts
npm run test -- --runTestsByPath tests/unit/scripts/check-openapi-backward-compatibility.spec.ts tests/unit/scripts/check-coverage.spec.ts
npm run test -- --runTestsByPath tests/unit/shared/correlation-id.middleware.spec.ts tests/contract/openapi/openapi.contract.test.ts tests/integration/http/error-matrix.spec.ts
npm run test
npm run asyncapi:check
npm run infra:up
npm run migration:run
npm run seed
npm run dev
docker compose -f docker-compose-dev.yaml config
docker compose -f docker-compose.yaml config
```

## Validação executada nesta entrega

```bash
npm install
npm run lint
npm run build
npm run test
npm run asyncapi:check
docker compose -f docker-compose-dev.yaml config
docker compose -f docker-compose.yaml config
```

Notas da validação:

- o gate local `npm run asyncapi:compat -- docs/asyncapi/v1/standard-events.json docs/asyncapi/v1/standard-events.json` comprovou o caminho feliz do checker de backward compatibility.
- a suíte `tests/unit/scripts/check-asyncapi-backward-compatibility.spec.ts` comprovou que o checker bloqueia remoção de canal e remoção de campo obrigatório no AsyncAPI `v1`.
- após o endurecimento do schema, da matriz de erros, da segurança OpenAPI e do gate de compatibilidade AsyncAPI, `npm run test` passou com `10` suites / `32` testes.
- as suítes `tests/unit/shared/correlation-id.middleware.spec.ts`, `tests/contract/openapi/openapi.contract.test.ts` e `tests/integration/http/error-matrix.spec.ts` passaram a comprovar que `X-Correlation-ID` é obrigatório nas rotas HTTP públicas, que o OpenAPI o modela como `required: true` e que a ausência é rejeitada com `400 bad_request`.
- o artefato `docs/openapi/v1/profiles-api.json` passou a ser gerado a partir da spec local e validado formalmente no CI por `npm run openapi:check`.
- o checker `scripts/check-openapi-backward-compatibility.js` passou a bloquear remoção de paths/operações, endurecimento de request params/body e quebra de response schema na OpenAPI `v1`.
- o gate `npm run coverage:check` passou a bloquear o pipeline quando a cobertura global ficar abaixo de `85%` em `lines/statements/functions` ou abaixo de `65%` em `branches`.
- o workflow `.github/workflows/cd.yml` deixou de ser apenas um template de build e passou a publicar imagens reais no GHCR em tags `v*`; continua sem deploy de ambiente.

## Bloqueios

- Nenhum no momento

## Handoff

Se a execução for retomada para bootstrapar outro serviço, começar por `AI_FIRST.md`, revisar este arquivo, montar `./luciluci-docs/` e renomear a feature `profile` antes de abrir novas RFs.
