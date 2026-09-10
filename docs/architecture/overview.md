# Arquitetura S1 + RF01/RF02 — Support

O serviço usa Express, TypeORM e PostgreSQL. O runtime ativo preserva logs
estruturados, métricas Prometheus, envelope de erro, idempotência genérica e
correlação.

## Superfície exposta

- `/health`
- `/metrics`
- `/api-docs`
- `/api-docs-json`
- `POST /api/support/departments`
- `PATCH /api/support/departments/{departmentId}`

Os quatro primeiros são superfície operacional e isentos de
`X-Correlation-ID`. Os dois últimos são RF01/RF02 e exigem esse header;
RF03–RF13 seguem sem rota registrada.

## Mensageria

Mensageria é `not_applicable` no S1: não há contrato AsyncAPI, exchange,
publisher, consumer ou outbox ativo. O health declara essa condição
explicitamente. O gate `npm run messaging:check` verifica a identidade, a
ausência dos assets e a falta de wiring no runtime.

## Persistência

Em banco Support novo e isolado, migrations criam `idempotency_keys`,
`departments` e `department_allowed_users`. A membership usa PK composta
`(department_id, position)`, FK e índice `(user_id, department_id)`, preservando
ordem/duplicatas sem serialização. A criação e a edição são transacionais;
RF01/RF02 não ativam idempotência, auditoria, outbox ou mensageria.
