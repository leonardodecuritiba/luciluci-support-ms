# src

Código ativo de Support após S1 e RF01.

- `features/department/` materializa RF01 e RF02.
- `app.ts` expõe endpoints operacionais, `POST /api/support/departments` e `PATCH /api/support/departments/{departmentId}`.
- `main.ts` inicializa PostgreSQL e HTTP; não inicia broker ou worker.
- `shared/` contém o kernel técnico preservado.
- RF03–RF13 não possuem feature nem rota.
