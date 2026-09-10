# Infra Access

## HTTP

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs-json`
- Health: `http://localhost:3000/health`
- Metrics: `http://localhost:3000/metrics`

## PostgreSQL local

- Host: `localhost`
- Porta: `5436`
- Database: `support_ms`
- Usuário e senha padrão: definidos em `.env.example`

S1 não usa RabbitMQ, Redis, filas ou contratos AsyncAPI. Não considerar a
ausência desses componentes como indisponibilidade operacional.
