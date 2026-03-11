# Infra Access

Este runbook centraliza como acessar a documentação e a infraestrutura local do microserviço.

## Regra obrigatória do template

Todo microserviço derivado de `standard-ms` deve manter este tipo de documentação atualizada no próprio repositório.

No mínimo, o serviço deve documentar:

- como acessar a documentação HTTP
- como acessar a documentação de eventos
- como acessar cada componente de infraestrutura local usado pelo serviço
- host, porta e URL quando aplicável
- credenciais padrão ou a fonte das credenciais
- quais componentes são obrigatórios e quais são opcionais
- quando um componente como Redis, Kafka, MinIO, LocalStack ou outro não fizer parte da release atual

Essa informação deve ficar, no mínimo:

- no `README.md` da raiz, com um link claro
- em `docs/runbooks/infra-access.md` ou equivalente

## Documentação HTTP

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs-json`
- Health: `http://localhost:3000/health`
- Metrics: `http://localhost:3000/metrics`

## Documentação de eventos

- AsyncAPI UI estática: `http://localhost:3000/events-docs`
- AsyncAPI JSON bruto: `http://localhost:3000/docs/asyncapi/v1/standard-ms-events.json`

## PostgreSQL

- Host local: `localhost`
- Porta local: `5432`
- Database padrão: `standard_ms`
- Usuário padrão: `postgres`
- Senha padrão: `postgres`
- Fonte de verdade das variáveis: `.env`

## RabbitMQ

- Management UI: `http://localhost:15672`
- Host AMQP local: `localhost`
- Porta AMQP local: `5672`
- Usuário padrão: `guest`
- Senha padrão: `guest`
- Exchanges esperados nesta release:
- `profile.events`
- `classification.events`

## Redis e outros componentes opcionais

- Redis não faz parte do stack mínimo desta release.
- Se um microserviço futuro usar Redis, Kafka, MinIO, LocalStack, Elasticsearch ou qualquer outro componente, esse mesmo runbook deve ser expandido com:
- URL ou host/porta
- credenciais ou origem das credenciais
- objetivo do componente no serviço
- comando de subida local quando aplicável
- forma de inspeção visual ou operacional

## Comandos úteis

```bash
cp .env.example .env
npm run infra:up
npm run migration:run
npm run seed
npm run dev
```
