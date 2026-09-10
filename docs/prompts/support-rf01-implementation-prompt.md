# Prompt — Implementação RF01: Criar Departamento

## Objetivo

Implementar **somente a RF01 — Criar Departamento** no `support-ms`, partindo
do bootstrap S1 já comprovado. Não implementar RF02–RF13 e não reabrir o
bootstrap salvo se uma regressão objetiva for encontrada.

O contrato canônico de RF01 deve estar congelado em
`luciluci-docs/support/` revisão documental 0.3. DEC-SUP-01, 03, 08, 09 e 10
estão resolvidas **apenas para RF01**; não transportar essas conclusões para
outras RFs.

## 1. Pré-flight obrigatório

1. Confirme que a raiz é `support-ms` por `service-identity.json`.
2. Rode `git status --short` na raiz e, se materializado, em `luciluci-docs`.
   Preserve integralmente alterações existentes.
3. Não execute `git submodule update --remote`. Use somente a revisão já fixada.
4. Leia, nesta ordem:
   - `AGENTS.md`
   - `AI_FIRST.md`
   - `ACTUAL_STATE.md`
   - `DRIFT_REPORT.md`
   - `docs/workflows/support-bootstrap-plan.md`
   - `luciluci-docs/support/README.md`
   - `luciluci-docs/support/prd.md`
   - `luciluci-docs/support/notes.md`
   - `luciluci-docs/support/tdd.md`
   - `luciluci-docs/support/tp.md`
5. Confirme no submódulo que RF01 está `CONTRACT_FROZEN /
READY_FOR_IMPLEMENTATION`. Se o checkout canônico não contém o checkpoint
   0.3, não invente o contrato: registre o mismatch e encerre sem implementar.
6. Não faça commit, push, deploy, `npm audit fix`, update de dependências ou
   operação destrutiva em banco/volume existente.

## 2. Contrato RF01 congelado

### Endpoint

`POST /api/support/departments`

### Header obrigatório

- `X-Correlation-ID`

RF01 **não exige**:

- `X-Performed-By`
- `X-Performed-By-Type`
- `X-Idempotency-Key`

O BFF/borda continua responsável por autenticação e permissões amplas. RF01 é
exceção à autorização fina de ticket; não crie ACL local com `allowedUserIds`
para autorizar a própria criação.

### Request

```json
{
  "name": "Financeiro",
  "allowedUserIds": ["uid-user-1", "uid-user-2"],
  "type": "todos"
}
```

Regras:

- `name`: obrigatório, string, contendo ao menos um caractere não branco;
- `type`: obrigatório, enum `todos | backoffice | cd`;
- `allowedUserIds`: opcional, default `[]`; quando enviado, array de strings
  externas não vazias;
- rejeitar propriedades desconhecidas;
- rejeitar tentativa de enviar `id`, `active`, `createdAt` ou `updatedAt`;
- não inventar unicidade de `name`, limite máximo de campo ou lookup remoto de
  admins.

### IDs

- `Department.id`: UUID v4 gerado pelo Support.
- `allowedUserIds`: strings opacas. Não exigir UUID/prefixo e não consultar
  outro microsserviço para validá-las.

### Success

`201 Created` com:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Financeiro",
  "allowedUserIds": ["uid-user-1", "uid-user-2"],
  "type": "todos",
  "active": true,
  "createdAt": "2026-09-10T18:00:00.000Z",
  "updatedAt": "2026-09-10T18:00:00.000Z"
}
```

### Erros

- `400 bad_request`: JSON malformado ou ausência do `X-Correlation-ID`;
- `422 validation_error`: DTO/body inválido;
- `500 internal_error`: erro inesperado.

Use o envelope transversal já materializado:
`{status_code,message,errors?}`.

RF01 não introduz `403`, `404` ou `409` de domínio.

### Efeitos

- `active=true`;
- `createdAt` e `updatedAt` gerados pelo micro;
- nenhuma entrada de `AuditLog`;
- nenhum outbox/evento;
- nenhuma mensageria;
- nenhuma idempotência HTTP;
- cada POST válido é criação independente, inclusive com nome/payload repetido.

## 3. Implementação esperada

Mantenha a arquitetura modular do template e evite acoplamento prematuro com
Ticket/Message/AuditLog.

Materialize, no mínimo:

1. enum/domain model `Department`;
2. DTO de criação;
3. porta de repositório;
4. caso de uso `CreateDepartment`;
5. adapter TypeORM;
6. controller/router de RF01;
7. migration real de Department e representação de `allowedUserIds`;
8. registro das novas entidades no datasource;
9. OpenAPI RF01;
10. exemplo em `api.http`;
11. testes unitários, HTTP/integration e contract;
12. prova PostgreSQL/processo real compatível com o padrão de evidência do S1;
13. atualização de documentação/estado/report.

### Persistência de `allowedUserIds`

Não use serialização delimitada por vírgula nem solução que exija carregar todos
os departamentos em memória para testar membership no futuro.

Prefira representação relacional consultável. Um desenho aceitável é:

- `departments`
  - `id` UUID PK
  - `name`
  - `type`
  - `active`
  - `created_at`
  - `updated_at`
- `department_allowed_users`
  - `department_id` FK
  - `position` integer
  - `user_id` text
  - PK (`department_id`, `position`)
  - índice (`user_id`, `department_id`)

Esse desenho preserva ordem e duplicatas do array sem impor uma regra HTTP não
documentada e deixa membership futura indexável. Se houver no repositório um
desenho comprovadamente melhor que preserve as mesmas propriedades, use-o e
registre a justificativa no TDD/report.

Criação do Department e persistência de toda a lista devem ser **atômicas**.
Falha ao persistir qualquer membership não pode deixar Department parcial.

Não criar tabelas de Ticket, Message ou AuditLog neste lote.

## 4. Testes obrigatórios

### Unitários

Cobrir pelo menos:

- criação completa;
- default `allowedUserIds=[]`;
- UUID v4 gerado;
- `active=true`;
- ausência de auditoria/evento;
- caso de uso não chama dependências remotas;
- mapping de membership preserva a lista.

### Validação/HTTP

Cobrir:

- sucesso `201`;
- sem `X-Correlation-ID` -> `400`;
- sem `X-Performed-By*` -> continua válido;
- sem `X-Idempotency-Key` -> continua válido;
- `name` ausente;
- `name` não string;
- `name` somente whitespace;
- `type` ausente e enum inválido;
- `allowedUserIds` omitido;
- `allowedUserIds=[]`;
- `allowedUserIds` não array;
- item vazio/não string;
- unknown field;
- tentativa de enviar campo gerado;
- JSON malformado;
- dois creates iguais geram IDs diferentes;
- dois departamentos com o mesmo `name` são aceitos.

### Persistência/PostgreSQL

Em banco novo, exclusivo e descartável:

- migration sobe sobre S1;
- reexecução de migration não duplica schema;
- inspect de PK/FK/índices/colunas;
- create faz round-trip de `allowedUserIds`;
- lista vazia persiste corretamente;
- IDs externos não UUID persistem;
- falha injetada na membership produz rollback integral;
- revert da migration de RF01 remove somente estruturas de RF01;
- reapply volta a funcionar.

### Processo real

Após build limpo:

- iniciar processo compilado contra PostgreSQL descartável;
- POST RF01 real -> `201`;
- repetir mesmo body -> outro `id`;
- verificar banco;
- validar `/health` e Swagger;
- provar que RF02–RF13 continuam `404`;
- encerrar processo e remover apenas recursos criados pela prova.

Não use SQLite/Supertest como substituto da prova PostgreSQL/processo real.

## 5. OpenAPI e contrato

`docs/openapi/v1/support-api.json` deve continuar contendo os quatro paths
operacionais e adicionar **somente**:

`POST /api/support/departments`

Documentar:

- `X-Correlation-ID` obrigatório;
- schema de request;
- `Department`;
- enum `DepartmentType`;
- responses `201`, `400`, `422`, `500`.

Não marcar `X-Performed-By*` nem `X-Idempotency-Key` como required em RF01.
Não adicionar RF02, listagem, ticket, mensagem, histórico ou AsyncAPI.

Execute export/check/contract depois da alteração e prove que o arquivo
exportado coincide com o runtime.

## 6. Seed e mensageria

Não reintroduza RabbitMQ, outbox ou AsyncAPI.

O seed pode continuar bloqueado neste lote. Se mantido bloqueado, atualize sua
mensagem/documentação para deixar claro que o motivo agora é **seed de W1 ainda
não definido**, e não mais ausência de qualquer modelo de domínio. Não crie
massa de negócio arbitrária apenas para destravar o comando.

## 7. Qualidade e gates

Execute os gates aplicáveis, incluindo:

```bash
npm run lint
npm run build
npm run build:check
npm run openapi:export
npm run openapi:check
npm run messaging:check
npm run test:unit
npm run test:integration
npm run test:contract
npm run test:coverage
npm run coverage:check
git diff --check
```

Mantenha os thresholds atuais; não exclua novos arquivos de coverage para
fabricar PASS.

Execute também a prova PostgreSQL/processo real criada/adaptada para RF01.
Use recursos exclusivos e descarte somente os recursos desta execução.

Não tratar `npm ci` vulnerabilities como correção automática. Preserve o alerta
de dependências como triagem separada.

## 8. Estado e documentação ao finalizar

Atualize, conforme resultado real:

- `ACTUAL_STATE.md`;
- `DRIFT_REPORT.md`;
- `README.md`;
- docs de arquitetura/runbook se o modelo exigir;
- `docs/workflows/support-bootstrap-plan.md`;
- `api.http`;
- OpenAPI;
- report de completude com timestamp real.

No submódulo canônico, atualize TP/TDD apenas com **evidências reais** da RF01;
não marque RF02–RF13 como implementadas.

Estados permitidos:

- `RF01_IMPLEMENTED_AND_PROVEN`: código, contrato e provas locais aplicáveis
  concluídos;
- `RF01_IMPLEMENTED_PENDING_PROOF`: implementação completa, mas alguma prova
  externa/local necessária não pôde ser executada por limitação ambiental;
- `RF01_INCOMPLETE`: falha técnica ou implementação parcial.

RF02–RF13 permanecem `NOT_IMPLEMENTED`.

## 9. Encerramento obrigatório

Pare ao terminar RF01. Não iniciar RF02.

Entregue:

1. resumo do drift/estado;
2. arquivos alterados;
3. contrato implementado;
4. migration/modelo físico;
5. testes e provas executadas, com comandos e resultados;
6. cobertura;
7. OpenAPI final;
8. documentação atualizada;
9. riscos/pendências;
10. estado da PR;
11. próximo gate documental para RF02.

Não faça commit, push ou deploy.
