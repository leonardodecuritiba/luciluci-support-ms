# Local Development

## Subir ambiente

```bash
npm install
cp .env.example .env
npm run infra:up
npm run migration:run
npm run seed
npm run dev
```

## Endpoints úteis

- `GET /health`
- `GET /metrics`
- `GET /api-docs`
- `GET /api-docs-json`
- `GET /events-docs`

## Acesso à documentação e à infraestrutura

Consulte `infra-access.md` para URLs, portas, credenciais padrão e regra documental obrigatória para futuros microserviços.

## Observabilidade mínima

- logs estruturados com correlation id
- métricas Prometheus
- payload padronizado de erro
