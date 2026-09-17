# src

Código ativo de Support após S1 e RF01–RF03.

- `features/department/` materializa RF01–RF03.
- `app.ts` expõe endpoints operacionais, `POST`/`GET /api/support/departments` e `PATCH /api/support/departments/{departmentId}`.
- `main.ts` inicializa PostgreSQL e HTTP; não inicia broker ou worker.
- `shared/` contém o kernel técnico preservado.
- RF04–RF13 não possuem feature nem rota.
