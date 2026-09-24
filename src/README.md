# src

Código ativo de Support após S1 e RF01–RF05.

- `features/department/` materializa RF01–RF04.
- `features/ticket/` materializa somente RF05, com aggregate transacional,
  lock de Department e persistência explícita de mensagem/mídias/auditoria.
- `app.ts` expõe endpoints operacionais e o CRUD congelado de Department, com
  soft delete em `DELETE /api/support/departments/{departmentId}`.
- `main.ts` inicializa PostgreSQL e HTTP; não inicia broker ou worker.
- `shared/` contém o kernel técnico preservado.
- RF06–RF13 não possuem rota ou implementação.
