# src

Código ativo de Support com RF01–RF08 em `main` (`MAIN_BASELINE_RF08`) e
RF09 na branch funcional.

- `features/department/` materializa RF01–RF04.
- `features/ticket/` materializa criação atômica RF05, edição RF06, listagens RF07a/RF07b e resolução RF08 com ownership, lock do Ticket, no-op e auditoria de requester;
  RF09 acrescenta leitura por ID com ACL atual e sem escrita.
- `app.ts` expõe endpoints funcionais e operacionais; `main.ts` inicializa PostgreSQL e HTTP.
- `shared/` contém o kernel técnico preservado.
- RF10–RF13 não possuem rota ou implementação.
