# scripts

- `export-openapi.js`: exporta o contrato operacional Support.
- `check-openapi.js` e `check-openapi-backward-compatibility.js`: validam
  OpenAPI atual e futuras evoluções.
- `check-messaging-disabled.js`: prova a ausência configurada de mensageria
  em S1.
- `seed.ts`: bloqueia a seed W1 até que a massa determinística seja definida.
- `prove-rf01-postgres.js`: prova RF01 em PostgreSQL descartável, incluindo
  migrations, rollback, processo compilado, Swagger e rotas futuras ausentes.

Validadores AsyncAPI permanecem genéricos e exigem paths explícitos quando uma
capacidade de mensageria vier a ser aprovada.
