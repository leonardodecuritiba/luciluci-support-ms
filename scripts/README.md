# scripts

A [definição W1](../docs/reports/REPORT-SUPPORT-SEED-W1-DEFINITION-20260928-184122.md)
está aprovada para uma futura seed canônica do domínio completo. O script
`seed.ts` ainda aborta antes de acessar banco; não executar `npm run seed`
até implementação e prova em DB descartável.

`prove-rf13-postgres.js` cria e remove banco PostgreSQL exclusivo, executa o
processo compilado e prova ACL, paginação segura, ordenação com empate,
read-only físico e concorrência RF13×RF10/RF06/RF08/RF11. O preload
`proof-rf13-query-gate.js` pausa a leitura após count dentro da transação e
registra consultas para excluir correlação com TicketMessage. O smoke de
imagem também cobre histórico admin/requester. Os itens abaixo são
históricos.

`prove-rf12-postgres.js` cria e remove banco PostgreSQL exclusivo, executa o
processo compilado e prova ACL, filtros, paginação, read-only físico e
concorrência RF12×RF10/RF11. `proof-rf12-query-gate.js` é preload usado somente
pela prova para pausar a leitura após count e medir queries de mídia. O smoke
`prove-s1-image.js` também cobre listagem admin/requester e exclusão de nota
interna. Os itens abaixo mantêm o inventário anterior.

- `export-openapi.js`: exporta o contrato operacional Support.
- `check-openapi.js` e `check-openapi-backward-compatibility.js`: validam
  OpenAPI atual e futuras evoluções.
- `check-messaging-disabled.js`: prova a ausência configurada de mensageria
  em S1.
- `seed.ts`: bloqueia a seed W1 até que a definição aprovada seja implementada
  e provada.
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
- `prove-rf09-postgres.js`: prova leitura por ID, ACL atual e snapshots físicos
  sem escrita em seis tabelas, com processo compilado e banco descartável.
- `prove-rf10-postgres.js`: prova criação de mensagem, mídias posicionais,
  auditoria, rollback de quatro escritas e concorrência RF10×RF10/RF06/RF08
  em PostgreSQL descartável e processo compilado.
- `prove-rf11-postgres.js`: prova visibilidade admin, escopo e ACL, no-op físico
  por `xmin` e contagem de UPDATE, rollback, e concorrências RF11×RF11,
  RF11×RF10/RF06/RF08 em banco exclusivo descartável e processo compilado.
- `prove-s1-image.js`: smoke do CMD real, incluindo criar Department e Ticket,
  criar mensagens RF10, alterar visibilidade RF11, resolver e ler Ticket,
  listar/excluir/listar Department.

Validadores AsyncAPI permanecem genéricos e exigem paths explícitos quando uma
capacidade de mensageria vier a ser aprovada.
