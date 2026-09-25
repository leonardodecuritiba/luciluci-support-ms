# src

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
