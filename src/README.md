# src

Código ativo de Support após S1 e RF01–RF06.

- `features/department/` materializa RF01–RF04.
- `features/ticket/` materializa criação atômica RF05 e edição RF06 com ACL, locks, no-op e auditoria de status.
- `app.ts` expõe endpoints funcionais e operacionais; `main.ts` inicializa PostgreSQL e HTTP.
- `shared/` contém o kernel técnico preservado.
- RF07a/RF07b e RF08–RF13 não possuem rota ou implementação.
