# scripts

- `export-openapi.js`: exporta o contrato operacional Support.
- `check-openapi.js` e `check-openapi-backward-compatibility.js`: validam
  OpenAPI atual e futuras evoluções.
- `check-messaging-disabled.js`: prova a ausência configurada de mensageria
  em S1.
- `seed.ts`: bloqueia a seed W1 até que a massa determinística seja definida.
- `prove-rf01-postgres.js`: prova RF01 em PostgreSQL descartável, incluindo
  migrations, rollback, processo compilado, Swagger e rotas futuras ausentes.
- `prove-rf02-postgres.js`: prova atualização transacional, lock e rollback.
- `prove-rf03-postgres.js`: prova listagem, paginação, ordenação e read-only.
- `prove-rf04-postgres.js`: prova soft delete/no-op, memberships, regressão RF03,
  concorrência RF02/RF04 e processo compilado em PostgreSQL descartável.
- `prove-rf05-postgres.js`: prova schema/revert, aggregate, rollbacks induzidos,
  sequence gapful, creates paralelos e concorrência RF04/RF05.
- `prove-rf06-postgres.js`: prova ACL, auditoria, rollback e locks da edição de Ticket.
- `prove-rf07-postgres.js`: prova ACL, filtros, paginação UTC e leituras sem escrita.
- `prove-rf08-postgres.js`: prova resolução, no-op, rollback, Department inativo,
  ACL e concorrência RF08×RF08/RF06×RF08 com lock real; cria e descarta banco próprio.
- `prove-s1-image.js`: smoke do CMD real, incluindo criar Department e Ticket,
  resolver Ticket, listar/excluir/listar Department.

Validadores AsyncAPI permanecem genéricos e exigem paths explícitos quando uma
capacidade de mensageria vier a ser aprovada.
