# src

Nesta branch funcional, RF13 acrescenta parser estrito, controller, use case,
`IListTicketHistoryRepository` e consulta paginada de AuditLog ligada a Ticket
com ACL atual. O filtro de auditoria de admin para requester precede count e
offset; o repositório não consulta TicketMessage. PostgreSQL usa transação
`REPEATABLE READ`; SQLite de teste usa transação sem nível explícito. Os
parágrafos abaixo descrevem estados históricos.

Em `MAIN_BASELINE_RF12` (`1e243d3`), RF01–RF12 estão integradas. RF13 ainda
usa a reserva 404 em `ticket.routes.ts`; não há handler ou repository de
histórico. A descrição da branch funcional RF12 abaixo é histórica.

Nesta branch, RF12 acrescenta `GET /tickets/:ticketId/messages` em
`features/ticket/`: parser próprio, controller, use case e repository de
leitura. PostgreSQL usa `REPEATABLE READ`; SQLite de teste usa transação sem
nível explícito. O escopo do solicitante filtra visibilidade no SQL e sua
consulta explícita `false` retorna vazio após ACL. Mídias são buscadas em lote.
RF13 permanece sem rota. As linhas abaixo descrevem a baseline anterior.

Em `MAIN_BASELINE_RF11`, `features/ticket/` inclui a edição focal de
visibilidade de mensagens admin, com locks Ticket→Department→Message e
resposta TicketMessage completa. RF12/RF13 não possuem rota.

Código ativo de Support com RF01–RF11 em `main` (`MAIN_BASELINE_RF11`, PR #12).

- `features/department/` materializa RF01–RF04.
- `features/ticket/` materializa criação atômica RF05, edição RF06, listagens RF07a/RF07b e resolução RF08 com ownership, lock do Ticket, no-op e auditoria de requester;
  RF09 acrescenta leitura por ID com ACL atual e sem escrita; RF10 cria mensagem
  com ACL, mídias posicionais, atualização estreita do Ticket e auditoria atômica.
- `app.ts` expõe endpoints funcionais e operacionais; `main.ts` inicializa PostgreSQL e HTTP.
- `shared/` contém o kernel técnico preservado.
- RF12/RF13 não possuem rota ou implementação.
