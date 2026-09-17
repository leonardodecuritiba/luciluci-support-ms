# src

Código ativo de Support após S1 e RF01–RF04.

- `features/department/` materializa RF01–RF04.
- `app.ts` expõe endpoints operacionais e o CRUD congelado de Department, com
  soft delete em `DELETE /api/support/departments/{departmentId}`.
- `main.ts` inicializa PostgreSQL e HTTP; não inicia broker ou worker.
- `shared/` contém o kernel técnico preservado.
- RF05–RF13 não possuem feature nem rota.
