# ACTUAL_STATE

## Objetivo

Entregar o `standard-ms` como template AI-first, executável e verificável para novos microserviços do ecossistema LuciLuci.

## Escopo desta release

- Feature de referência `profile`
- 5 RFs canônicas
- Infra local com PostgreSQL e RabbitMQ
- OpenAPI, AsyncAPI, outbox, idempotência, correlação, observabilidade, testes e CI/CD
- CI endurecido com gate automático de compatibilidade backward para o AsyncAPI versionado em `docs/asyncapi/v1/standard-ms-events.json`, comparando o contrato atual com o baseline da branch base/commit anterior

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
- foco atual: release inicial validada e política documental do `DRIFT-005` consolidada no template

## Decisões tomadas

- Feature de referência: `profile`
- Sem Redis no mínimo viável
- Idempotência HTTP e de consumo persistidas no PostgreSQL
- Runtime local e produção em PostgreSQL
- Testes de integração em SQLite em memória
- Suíte de integração `tests/integration/events/outbox-rabbitmq.spec.ts` adicionada para provar `HTTP -> DB/outbox -> OutboxEventPublisherWorker -> RabbitMQ` com app real, PostgreSQL real e broker real
- `X-Correlation-ID` passou a ser exigido explicitamente nas rotas HTTP públicas de negócio de `profiles`, com parâmetro OpenAPI `required: true`, middleware antes do parse do body e evidência automatizada para rejeição de ausência
- `/health`, `/metrics`, `/api-docs`, `/api-docs-json`, `/events-docs` e `/docs/asyncapi/*` passaram a ficar codificados no template como superfície operacional local herdada do `standard-ms`, não como RF de domínio
- a exceção de `X-Correlation-ID` ficou formalizada como controlada e restrita à superfície operacional local + `OPTIONS`; nessas rotas o middleware pode gerar/retornar o valor apenas para observabilidade local
- observabilidade materializada nesta release = logs estruturados + métricas Prometheus + `X-Correlation-ID`; tracing distribuído com OpenTelemetry continua ausente
- resiliência materializada em mensageria = outbox, filas duráveis, idempotência e worker real; DLQ/TTL/redrive/retry exponencial continuam ausentes no serviço
- baseline herdável padrão de RabbitMQ no template = exchange/fila duráveis, outbox publisher real, consumer de exemplo e idempotência de consumo; `DLQ`, `TTL`, `redrive`, `retry exponencial` e `poison message handling` não entram por padrão e permanecem como item `compartilhado`, dependente de decisão explícita do serviço derivado
- `event-schema-registry.ts` é apenas um registry local em memória derivado do AsyncAPI versionado; não há Schema Registry externo integrado ao `standard-ms`
- rastreabilidade mínima `RF -> unit / integration / functional` passou a ser tratada como regra de template/processo para serviços derivados; o `standard-ms` não deve ser usado como prova automática dessa tríade para domínios futuros
- o CI central já aplica validação formal/backward de OpenAPI e AsyncAPI e gate global de cobertura; não há gates dedicados de carga/performance ou segurança nesta release

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
npm run asyncapi:compat -- docs/asyncapi/v1/standard-ms-events.json docs/asyncapi/v1/standard-ms-events.json
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

- o gate local `npm run asyncapi:compat -- docs/asyncapi/v1/standard-ms-events.json docs/asyncapi/v1/standard-ms-events.json` comprovou o caminho feliz do checker de backward compatibility.
- a suíte `tests/unit/scripts/check-asyncapi-backward-compatibility.spec.ts` comprovou que o checker bloqueia remoção de canal e remoção de campo obrigatório no AsyncAPI `v1`.
- após o endurecimento do schema, da matriz de erros, da segurança OpenAPI e do gate de compatibilidade AsyncAPI, `npm run test` passou com `10` suites / `32` testes.
- as suítes `tests/unit/shared/correlation-id.middleware.spec.ts`, `tests/contract/openapi/openapi.contract.test.ts` e `tests/integration/http/error-matrix.spec.ts` passaram a comprovar que `X-Correlation-ID` é obrigatório nas rotas HTTP públicas, que o OpenAPI o modela como `required: true` e que a ausência é rejeitada com `400 bad_request`.
- o artefato `docs/openapi/v1/profiles-api.json` passou a ser gerado a partir da spec local e validado formalmente no CI por `npm run openapi:check`.
- o checker `scripts/check-openapi-backward-compatibility.js` passou a bloquear remoção de paths/operações, endurecimento de request params/body e quebra de response schema na OpenAPI `v1`.
- o gate `npm run coverage:check` passou a bloquear o pipeline quando a cobertura global ficar abaixo de `85%` em `lines/statements/functions` ou abaixo de `65%` em `branches`.
- o workflow `.github/workflows/cd.yml` deixou de ser apenas um template de build e passou a publicar imagens reais no GHCR em tags `v*`; continua sem deploy de ambiente.
- reports derivados do template passaram a exigir evidência remota real do GitHub Actions para considerar CI/CD comprovado; a mera presença de `.github/workflows/*.yml` não basta
- a fronteira NFR herdada passou a ser explícita no template: `rate limit` e `Schema Registry externo` = `upstream/plataforma`; `event-schema-registry.ts` = helper local; `OpenTelemetry` e políticas avançadas de mensageria = `compartilhado`; evidência automatizada de `segurança`, `performance/carga` e `CDC/streaming` = `fora do escopo desta release` por padrão
- auditoria documental de observabilidade/resiliência concluída:
  - OpenTelemetry reclassificado como não implementado no serviço
  - rate limit mantido como responsabilidade upstream do gateway/BFF
  - DLQ/TTL/redrive/retry exponencial reclassificados como ausentes no `standard-ms`
  - `event-schema-registry.ts` reclassificado como helper local derivado do AsyncAPI versionado; `Schema Registry externo` mantido como responsabilidade upstream/plataforma
  - CI contratual e gate de cobertura confirmados como implementados
  - testes/gates dedicados de carga/performance e segurança confirmados como ausentes nesta release
- auditoria documental do `DRIFT-005` concluída:
  - `AI_FIRST.md`, `docs/architecture/overview.md` e `docs/runbooks/local-development.md` passaram a formalizar a superfície operacional local herdada do template
  - `docs/reports/REPORT-TEMPLATE.md` e `docs/prompts/report-completeness-prompt.md` deixaram de induzir a classificação ambígua antiga para endpoints operacionais herdados
  - a política herdada passou a distinguir rotas de negócio vs superfície operacional local para `X-Correlation-ID`
- auditoria remota do `DRIFT-006` iniciada:
  - o run remoto `ci` `23461102938` em `main` / SHA `bd70b70165c74f88064ef826bfc83d907598dc05` falhou no job `quality`, step `Check OpenAPI artifact sync`
  - a causa objetiva identificada foi incompatibilidade entre o formatter do repositório e o output de `npm run openapi:export`, deixando `docs/openapi/v1/profiles-api.json` permanentemente fora de sync
  - a execução local de `test:coverage` no sandbox falhou por `EPERM`; com permissão ampliada a suíte passou integralmente, confirmando limitação do ambiente local e não falha funcional do template
- auditoria documental do `DRIFT-007` concluída:
  - `AI_FIRST.md`, `README.md`, `docs/architecture/overview.md` e `docs/runbooks/local-development.md` passaram a codificar a fronteira NFR serviço vs plataforma no template
  - `docs/reports/REPORT-TEMPLATE.md`, `docs/reports/README.md` e `docs/prompts/report-completeness-prompt.md` passaram a exigir classificação de NFR antes de registrar gap real local
  - o `bootstrap-prompt` herdado passou a instruir o microservice-startup a classificar NFRs em `implementado localmente`, `upstream/plataforma`, `compartilhado` ou `fora do escopo desta release` antes de concluir lacunas
- auditoria documental do `DRIFT-010` concluída:
  - `DLQ`, `TTL`, `redrive`, `retry exponencial` e `poison message handling` foram mantidos fora da baseline herdável padrão do `standard-ms`
  - a baseline herdável de RabbitMQ ficou explicitada como `exchange/fila duráveis + outbox + consumer de exemplo + idempotência de consumo`
  - o `REPORT-TEMPLATE.md` passou a instruir que resiliência avançada de RabbitMQ só vira `gap real local` após decisão explícita do serviço derivado
- auditoria documental do `DRIFT-011` concluída:
  - `event-schema-registry.ts` ficou explicitado como registry local derivado do AsyncAPI versionado do repositório
  - `Schema Registry externo` ficou explicitado como responsabilidade `upstream/plataforma`, não evidência local automática do microserviço
  - o `REPORT-TEMPLATE.md` passou a proibir a mistura entre helper local de eventos e integração externa de registry
- auditoria documental do `DRIFT-012` concluída:
  - o `REPORT-TEMPLATE.md` passou a exigir uma matriz explícita `RF -> unit / integration / functional`
  - o processo herdado passou a permitir agrupamentos/exceções somente com justificativa objetiva
  - o template deixou explícito que a tríade mínima por RF pertence ao serviço derivado e não deve ser inferida artificialmente a partir do `standard-ms`

## Riscos residuais

- a documentação canônica ainda prevê OpenTelemetry, DLQ/TTL/redrive/backoff, Schema Registry externo e evidências operacionais de carga/segurança; nesta release esses itens foram explicitamente reclassificados como ausentes ou externos, não implementados localmente
- se o escopo futuro exigir aderência total a esses itens, a próxima evolução deve tratar separadamente tracing distribuído, política operacional de mensageria e testes/gates específicos de carga e segurança

## Bloqueios

- Nenhum no momento

## Handoff

Se a execução for retomada para bootstrapar outro serviço, começar por `AI_FIRST.md`, revisar este arquivo, montar `./luciluci-docs/` e renomear a feature `profile` antes de abrir novas RFs.
