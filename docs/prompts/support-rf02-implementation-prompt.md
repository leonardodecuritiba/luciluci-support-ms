# Prompt operacional — RF02 Editar Departamento

## Missão

Implementar e provar **somente RF02 — Editar Departamento** no `support-ms`,
a partir de `MAIN_BASELINE_RF01`, preservando RF01 e mantendo RF03–RF13 sem rota.

Contrato canônico requerido: `luciluci-docs/support/` revisão 0.4 ou posterior
que contenha explicitamente `RF02_CONTRACT_FROZEN`. Se esse conteúdo não estiver
materializado no submódulo real, não inferir o contrato deste prompt como
substituto silencioso: registrar o mismatch e encerrar antes de alterar runtime.

Branch alvo:

```text
feat/support-rf02-update-department
```

## 1. Guardas Git e baseline

Antes de editar código:

1. execute `git status --short --branch` na raiz e no submódulo;
2. preserve toda alteração preexistente; não use `reset --hard`, `clean`, stash
   automático, checkout destrutivo ou `git submodule update --remote`;
3. confirme `git remote -v` e `git fetch origin` quando o remote estiver
   disponível;
4. confirme que a branch base corresponde a `MAIN_BASELINE_RF01` e que RF01 está
   `IMPLEMENTED_AND_PROVEN`;
5. se estiver em `main`, ela deve estar limpa e alinhada a `origin/main` antes de
   criar `feat/support-rf02-update-department`;
6. se a branch RF02 já existir, confirme que descende da `main` publicada e não
   recrie/descarte trabalho;
7. se a publicação da baseline ou a revisão canônica não puderem ser provadas,
   classifique como `BLOCKED_BY_GIT_BASELINE` ou `BLOCKED_BY_DOCUMENTATION` e
   não implemente a RF.

Não faça commit, push, merge, PR ou deploy nesta execução, salvo instrução
explícita posterior. A finalidade é deixar a branch pronta para revisão.

## 2. Leitura obrigatória

Leia antes de modificar:

- `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`;
- `README.md` e `docs/workflows/support-development-branch-policy.md`;
- `docs/reports/REPORT-SUPPORT-RF01-20260910-174742.md`;
- `src/features/department/**`;
- migration `1768000000000-CreateSupportDepartments.ts`;
- testes RF01, `api.http`, OpenAPI e scripts de prova;
- `luciluci-docs/support/{prd,notes,tdd,tp}.md` na revisão fixada.

RF01 é regressão obrigatória; não reescreva sua semântica para facilitar RF02.

## 3. Contrato RF02 congelado

Endpoint único deste lote:

```http
PATCH /api/support/departments/{departmentId}
```

### 3.1 Boundary

- `X-Correlation-ID`: obrigatório.
- Não exigir `X-Performed-By` nem `X-Performed-By-Type`.
- Não exigir/ativar `X-Idempotency-Key`.
- RBAC amplo permanece no BFF.
- RF02 é rota de Departamento e não aplica ACL fina de tickets.
- Não consultar `allowedUserIds` para autorizar o próprio PATCH.

### 3.2 Path

`departmentId` identifica `Department.id`, gerado como UUID v4 em RF01.

- UUID v4 inválido -> `422 validation_error`.
- UUID v4 válido sem Department -> `404 not_found`.

Não converter identificadores externos de `allowedUserIds` para UUID.

### 3.3 Body parcial

Campos permitidos, todos opcionais individualmente:

```json
{
  "name": "Financeiro Corporativo",
  "type": "backoffice",
  "allowedUserIds": ["uid-user-1", "uid-user-3"]
}
```

Mas o body deve conter **ao menos um** campo editável.

Validação dos campos quando presentes:

- `name`: string com ao menos um caractere não branco;
- `type`: `todos | backoffice | cd`;
- `allowedUserIds`: array de strings não vazias/não brancas;
- unknown fields são rejeitados;
- `id`, `active`, `createdAt`, `updatedAt` e qualquer outro campo não editável
  são rejeitados;
- `{}` -> `422 validation_error`.

Não introduzir limite máximo ou unicidade de `name` sem requisito adicional.

### 3.4 Semântica PATCH

- campo omitido preserva o valor atual;
- `allowedUserIds` omitido preserva integralmente memberships/positions;
- `allowedUserIds` presente **substitui a lista inteira**;
- `[]` limpa todas as memberships;
- preservar ordem e duplicatas exatamente como no request;
- comparação de mudança de membership considera ordem e duplicatas;
- Department ativo ou inativo pode ser editado;
- RF02 nunca altera `active`; `active=false` continua false e não há restore;
- mudança efetiva de qualquer campo deve renovar `updatedAt`, inclusive
  alteração apenas de membership;
- se todos os valores enviados forem semanticamente iguais ao estado atual,
  retornar `200` sem write e manter `updatedAt` inalterado;
- body vazio não é no-op: é request inválido (`422`).

### 3.5 Saída e erros

Sucesso `200 OK`, com representação completa:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Financeiro Corporativo",
  "allowedUserIds": ["uid-user-1", "uid-user-3"],
  "type": "backoffice",
  "active": true,
  "createdAt": "2026-09-10T18:00:00.000Z",
  "updatedAt": "2026-09-10T18:30:00.000Z"
}
```

Erros do lote:

- `400 bad_request`: JSON malformado ou correlação ausente;
- `404 not_found`: UUID v4 válido sem Department;
- `422 validation_error`: path/body inválido, body vazio, campo desconhecido ou
  campo não editável;
- `500 internal_error`: falha inesperada.

Não adicionar `403` ou `409` em RF02.

### 3.6 Efeitos explicitamente ausentes

RF02 não cria:

- AuditLog;
- outbox;
- evento/AsyncAPI/RabbitMQ;
- idempotency record;
- lookup remoto de usuário;
- alteração/criação de Ticket;
- migration nova, salvo descoberta objetiva de drift no schema atual.

Se uma migration parecer necessária, pare e explique o drift antes de criá-la.

## 4. Desenho técnico mínimo

Estenda a feature `src/features/department`, mantendo Clean Architecture e o
padrão materializado em RF01.

Componentes esperados (nomes podem variar com justificativa):

- DTO de path UUID v4;
- `UpdateDepartmentRequestDTO` com propriedades opcionais e regra explícita de
  "ao menos um campo";
- `UpdateDepartmentUseCase`;
- expansão de `IDepartmentRepository` para leitura bloqueante/atualização;
- implementação TypeORM da busca/replace de memberships;
- controller `update`;
- `router.patch('/:departmentId', ...)`.

Evite fazer o update importing o mapper público de dentro do use case de create.
Se necessário, extraia `DepartmentResponse`/mapper para um módulo neutro da
feature e mantenha RF01 sem mudança de comportamento.

### 4.1 Transação e membership

A operação inteira deve usar o mesmo `EntityManager`.

Fluxo recomendado:

1. validar correlation/path/body;
2. abrir transação;
3. obter lock de escrita da linha `departments` do alvo;
4. carregar memberships atuais ordenadas por `position`;
5. 404 se o Department não existir;
6. calcular o estado efetivo resultante sobre o estado bloqueado mais recente;
7. se no-op semântico, retornar o estado atual sem save;
8. se `allowedUserIds` mudou, remover a lista antiga e inserir a nova sequência
   `position=0..n-1` no mesmo transaction manager;
9. persistir os campos alterados e garantir que `updatedAt` seja renovado também
   quando a única mudança for membership;
10. retornar a representação completa após persistência.

Não dependa apenas do cascade `insert` atual para substituir memberships. Uma
lista menor/nova precisa remover linhas antigas explicitamente.

O lock deve ser adquirido no parent Department antes de ler o estado usado para
calcular o PATCH. Evite join nullable com `FOR UPDATE` se o driver/PostgreSQL
não suportar essa combinação; bloquear o parent e ler children separadamente é
aceitável.

## 5. Testes obrigatórios

### 5.1 Unitários

Materialize cobertura para:

- update somente `name`;
- update somente `type`;
- update somente `allowedUserIds`;
- update combinando campos;
- campos omitidos preservados;
- replace membership com reorder, duplicatas, remoção e `[]`;
- no-op semântico -> sem save e mesmo `updatedAt`;
- Department inativo -> editável e permanece inativo;
- not found;
- mapper/response completo quando aplicável.

### 5.2 Integração HTTP

Cobrir no mínimo:

- `200` para cada campo isolado e combinação;
- `updatedAt` muda em alteração efetiva;
- membership-only também muda `updatedAt`;
- no-op mantém `updatedAt`;
- `allowedUserIds` omitido não toca memberships;
- `[]` limpa;
- ordem e duplicatas persistidas;
- edição de inativo via fixture DB permanece `active=false`;
- UUID v4 inexistente -> `404`;
- path inválido -> `422`;
- `{}` -> `422`;
- name/type/list inválidos -> `422`;
- unknown/generated/non-editable fields -> `422`;
- correlação ausente -> `400` sem efeito;
- JSON malformado -> `400`;
- ausência de ator/idempotency headers continua válida;
- RF01 continua retornando `201` e preserva todos os seus testes.

### 5.3 Atomicidade PostgreSQL

Crie `scripts/prove-rf02-postgres.js` e `npm run proof:rf02:postgres`, seguindo o
mesmo padrão de ownership/guard/cleanup de `proof:rf01:postgres`.

Em PostgreSQL **novo, exclusivo e descartável**:

1. migrations `run/run`;
2. criar Department pela RF01 real;
3. PATCH RF02 pelo processo compilado;
4. verificar round-trip SQL de todos os campos/memberships;
5. verificar replace, `[]`, reorder e duplicatas;
6. verificar no-op e timestamps;
7. criar fixture inativa diretamente no DB e provar edição sem restore;
8. injetar falha na inserção da nova membership e enviar PATCH que também muda
   name/type; resposta deve ser `500` e **name/type/updatedAt/memberships antigos
   devem permanecer exatamente iguais**;
9. provar `404`/`422` relevantes;
10. verificar Swagger/OpenAPI do processo compilado;
11. provar que RF03–RF13 (incluindo RF07a/RF07b) continuam sem rota `404`.

O script deve remover apenas os recursos que ele próprio criou. Não use
`infra:down`, volumes preexistentes ou database padrão como prova descartável.

### 5.4 Concorrência

A implementação deve possuir lock explícito no Department. Prove, pelo menos em
integração PostgreSQL/repository ou no script funcional, que uma atualização não
calcula seu resultado sobre snapshot obsoleto enquanto outra transação segura o
lock do mesmo Department. Não introduza sleep/test-hook em código de produção.

Se uma prova HTTP determinística exigir instrumentação artificial, prefira uma
prova repository/PostgreSQL controlada e documente o limite em vez de inserir
hook de teste no runtime.

### 5.5 Contrato/OpenAPI

Atualizar o OpenAPI gerado e testes de contrato:

- adicionar `PATCH /api/support/departments/{departmentId}`;
- path param UUID;
- correlation obrigatório;
- `UpdateDepartmentRequest` com `additionalProperties=false`, propriedades
  opcionais e `minProperties: 1` (ou representação equivalente verificável);
- respostas `200/400/404/422/500`;
- nenhum performed-by/idempotency header;
- response com Department completo;
- o schema usado por RF02 deve permitir `active=false`. Se o schema `Department`
  compartilhado hoje restringe `active` a `true`, ajuste a modelagem OpenAPI sem
  alterar o comportamento de RF01: RF01 continua sempre criando `active=true`.

Atualize `api.http` com exemplos positivos/negativos reais de RF02.

## 6. CI e regressão

Adicionar a prova RF02 à CI usando database/porta exclusivos. Preserve as provas
RF01/S1 existentes e o check de mensageria inativa.

Ao final execute, no mínimo:

```bash
npm run lint
npm run build
npm run build:check
npm run test:unit
npm run test:integration
npm run test:contract
npm run openapi:export
npm run openapi:check
npm run messaging:check
npm run test:coverage
npm run coverage:check
git diff --check
```

Execute `npm run proof:rf02:postgres` em PostgreSQL descartável com todas as
variáveis exigidas. Execute também regressões RF01/S1 que forem necessárias
para provar que entrypoints/imagem/contratos existentes não foram degradados.
Não declare CI remoto PASS se ele não foi executado/consultado.

## 7. Fora do escopo

Não implementar ou expor:

- RF03 listagem;
- RF04 delete;
- RF05–RF13;
- Ticket, TicketMessage ou AuditLog;
- paginação;
- filtro `type` de RF03;
- eventos/mensageria;
- restore de Department;
- seed de domínio novo;
- autenticação/JWT/RBAC duplicado do BFF.

RF03–RF13 devem continuar respondendo `404` em suas rotas ainda ausentes.

## 8. Documentação de saída

Se a implementação e provas passarem:

- `ACTUAL_STATE.md`: RF02 -> `RF02_IMPLEMENTED_AND_PROVEN`;
- `DRIFT_REPORT.md`: nenhum drift novo, ou registrar qualquer finding real;
- README/runbooks/OpenAPI/api.http coerentes;
- atualizar TDD/TP canônicos com paths e evidência reais sem reescrever o PRD;
- gerar report `REPORT-SUPPORT-RF02-<timestamp>.md` usando o template;
- matriz final: RF01 e RF02 implementadas; RF03–RF13 sem rota.

Se algum requisito técnico falhar, não marque RF02 como proven. Classifique a
falha objetivamente (`FAILED`, `BLOCKED_BY_ENVIRONMENT` ou drift reproduzido) e
preserve evidência.

## 9. Formato de resposta final

Entregue:

1. `RESUMO DO DRIFT` — inclusive "nenhum drift aberto" se for comprovável;
2. `ARQUIVOS ALTERADOS`;
3. `IMPLEMENTAÇÃO REALIZADA`;
4. `VALIDAÇÃO` com comandos/resultados reais;
5. `DOCUMENTAÇÃO ATUALIZADA`;
6. `PR PRONTA` — somente como prontidão local, sem afirmar PR criada se não foi;
7. `PENDÊNCIAS OU RISCOS`;
8. estado explícito de RF01, RF02 e RF03–RF13.

Pare ao concluir RF02. Não iniciar RF03 automaticamente.
