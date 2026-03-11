# ACTUAL_STATE

## Objetivo

Entregar o `standard-ms` como template AI-first, executável e verificável para novos microserviços do ecossistema LuciLuci.

## Escopo desta release

- Feature de referência `profile`
- 5 RFs canônicas
- Infra local com PostgreSQL e RabbitMQ
- OpenAPI, AsyncAPI, outbox, idempotência, correlação, observabilidade, testes e CI/CD

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

## Comandos de validação

```bash
npm run lint
npm run build
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

## Bloqueios

- Nenhum no momento

## Handoff

Se a execução for retomada para bootstrapar outro serviço, começar por `AI_FIRST.md`, revisar este arquivo, montar `./luciluci-docs/` e renomear a feature `profile` antes de abrir novas RFs.
