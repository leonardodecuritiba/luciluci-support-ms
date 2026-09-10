# src

Código ativo de Support após S1 e RF01.

- `features/department/` materializa exclusivamente RF01.
- `app.ts` expõe endpoints operacionais e `POST /api/support/departments`.
- `main.ts` inicializa PostgreSQL e HTTP; não inicia broker ou worker.
- `shared/` contém o kernel técnico preservado.
- RF02–RF13 não possuem feature nem rota.
