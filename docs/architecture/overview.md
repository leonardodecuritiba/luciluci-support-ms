# Arquitetura

O `standard-ms` segue o modelo validado no ecossistema LuciLuci:

- Express para HTTP
- TypeORM para persistência
- PostgreSQL como banco principal
- RabbitMQ para integração assíncrona
- Outbox para publicação confiável
- Contrato público de autenticação documentado como `Bearer JWT` via Identity/API Gateway; a validação do token é upstream e o bootstrap local usa `X-Auth-*` apenas em `development/test`
- Clean Architecture com separação por feature
- `X-Correlation-ID` obrigatório nas operações HTTP públicas de `profiles`; o middleware local rejeita ausência com `400 bad_request` e o valor é propagado para logs, auditoria, idempotência e outbox

## Capacidade operacional materializada

| Capacidade documentada                              | Estado atual no `standard-ms` | Evidência objetiva                                                                                                                                              | Ação adotada nesta rodada                                                      |
| --------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Logs estruturados e correlação                      | implementado                  | `src/shared/infrastructure/logger/index.ts`, `src/shared/kernel/middlewares/logger.middleware.ts`, `src/shared/kernel/middlewares/correlation-id.middleware.ts` | mantido como capacidade real do serviço                                        |
| Métricas HTTP/health                                | implementado                  | `src/shared/infrastructure/metrics/registry.ts`, `src/shared/kernel/middlewares/metrics.middleware.ts`, `src/app.ts` (`/metrics`, `/health`)                    | mantido como capacidade real do serviço                                        |
| Tracing distribuído com OpenTelemetry               | não implementado              | ausência de dependências/instrumentação `@opentelemetry/*` em `package.json` e `src/`                                                                           | documentação local reclassificada; sem implementação nova                      |
| Rate limiting                                       | upstream, não no serviço      | `luciluci-docs/docs/architecture-and-service-bus.md` atribui rate limit ao gateway; `standard-ms` não tem middleware de rate limit                              | documentação local mantida/alinhada como responsabilidade upstream             |
| Outbox + publicação real no broker                  | implementado                  | `src/shared/adapters/workers/outbox-event-publisher.worker.ts`, `tests/integration/events/outbox-rabbitmq.spec.ts`                                              | mantido como capacidade real do serviço                                        |
| DLQ / TTL / redrive / retry exponencial em RabbitMQ | não implementado              | `src/shared/infrastructure/rabbitmq/rabbitmq.service.ts` usa filas duráveis sem argumentos de DLQ/TTL; `src/shared/utils/retry.ts` é só bootstrap fixo          | documentação local reclassificada; sem implementar mensageria operacional nova |
| Schema Registry                                     | parcial                       | `src/shared/infrastructure/events/event-schema-registry.ts` carrega o AsyncAPI versionado localmente; não há integração externa                                 | documentação local reclassificada como registry local em memória               |
| CI contratual/backward compatibility                | implementado                  | `.github/workflows/ci.yml`, `package.json`, `scripts/check-openapi*.js`, `scripts/check-asyncapi*.js`                                                           | mantido como capacidade real do pipeline                                       |
| Cobertura de carga/performance                      | não implementado              | ausência de suites `k6`, `artillery` ou equivalente no repositório e no CI                                                                                      | documentação local reclassificada                                              |
| Cobertura de segurança/OWASP                        | não implementado              | não há workflow/suite dedicada além de auth/error/rbac                                                                                                          | documentação local reclassificada                                              |
| CD/publicação                                       | parcial                       | `.github/workflows/cd.yml` publica imagem real no GHCR, mas não há deploy automático de ambiente                                                                | documentação local explicitada para não chamar isso de deploy                  |

Fluxo principal:

1. Requisição HTTP entra com `X-Correlation-ID`
2. Controller valida DTO e orquestra o caso de uso
3. Escritas persistem entidade, audit log e outbox na mesma transação
4. Worker publica eventos pendentes do outbox
5. Consumer externo atualiza snapshot com idempotência de consumo
