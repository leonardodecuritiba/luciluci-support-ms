# Infra Access

## Ambiente real — pendente

Este arquivo documenta somente acesso **local**. O
[checkpoint de readiness/UAT](../reports/REPORT-SUPPORT-DEPLOYMENT-READINESS-20260929-132805.md)
não encontrou endpoint, owner, plataforma, banco, secrets ou política de
ingress/BFF para um ambiente real. Não usar os endereços ou credenciais de
exemplo abaixo como configuração de staging/produção. O CD atual publica
imagem GHCR por tag `v*`, sem deploy; W1 não é seed de ambiente real.

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
