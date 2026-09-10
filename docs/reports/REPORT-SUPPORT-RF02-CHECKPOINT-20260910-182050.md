# REPORT — checkpoint contratual RF02 Editar Departamento

**status:** `RF02_CONTRACT_FROZEN_READY_FOR_IMPLEMENTATION`
**generated_by:** ChatGPT + revisão do checkout anexado
**generated_at:** 2026-09-10T18:20:50Z
**review_mode:** checkpoint contratual / RF02
**microservice:** support-ms
**repository_ref:** `MAIN_BASELINE_RF01` conforme documentação local; publicação remota deve ser conferida no checkout Git real
**documentation_ref:** Support 0.4 proposto/aplicável sobre a baseline canônica 0.3; confirmar revisão real do submódulo antes do runtime
**reviewer:** não informado

---

## 1. Estado de entrada

- S1: `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`.
- RF01: `RF01_IMPLEMENTED_AND_PROVEN`.
- RF02: rota ausente no estado recebido; checkpoint agora congelado.
- RF03–RF13: `NOT_IMPLEMENTED`.
- drift técnico aberto conhecido: nenhum.
- mensageria Support: não contratada/inativa.

O tar analisado não contém `.git` nem conteúdo do submódulo `luciluci-docs`.
Portanto este report não atribui push de `main`, SHA remoto nem commit canônico
não observados. A execução RF02 deve provar esses pré-requisitos no checkout real.

## 2. Contrato congelado

RF02 materializará somente:

```http
PATCH /api/support/departments/{departmentId}
```

- somente `X-Correlation-ID` é header obrigatório local;
- `departmentId` é UUID v4; inválido -> 422; válido inexistente -> 404;
- body parcial aceita `name`, `type`, `allowedUserIds`, com pelo menos um campo;
- omitted preserva; `allowedUserIds` presente substitui a lista inteira;
- ordem e duplicatas de membership permanecem parte do estado;
- `[]` limpa memberships;
- ativo e inativo são editáveis, mas RF02 nunca altera `active`;
- mudança efetiva renova `updatedAt`;
- no-op semântico retorna 200 sem write e mantém `updatedAt`;
- sucesso 200 com Department completo;
- erros locais 400/404/422/500;
- nenhuma ACL local, auditoria, evento, outbox ou idempotência HTTP.

## 3. Decisões fechadas somente para RF02

- DEC-SUP-01: boundary/headers de ator.
- DEC-SUP-03: Departamento permanece fora da ACL fina de ticket.
- DEC-SUP-06: body vazio versus no-op semântico.
- DEC-SUP-08: request/response/errors.
- DEC-SUP-09: UUID do Department e IDs externos opacos.
- DEC-SUP-10: idempotência não ativada.
- DEC-SUP-12: edição de inativo e replacement de membership.

As mesmas DEC continuam abertas onde aplicáveis a RF03–RF13.

## 4. Impacto técnico esperado

RF02 reutiliza as tabelas `departments` e `department_allowed_users`; nenhuma
migration nova é esperada. A implementação deve ampliar a feature Department com
DTO/use case/repository/controller/route, substituir memberships atomicamente e
serializar updates concorrentes do mesmo Department.

O schema OpenAPI público precisa representar resposta RF02 com `active=false`
possível sem alterar o comportamento RF01 (`active=true` na criação).

## 5. Provas exigidas

- unitários e integração HTTP específicos de RF02;
- regressão RF01;
- OpenAPI/contract e `api.http`;
- PostgreSQL descartável com processo compilado;
- rollback injetado durante replace de membership preservando o estado anterior;
- no-op/timestamps;
- edição de fixture inativa;
- lock/concorrência do mesmo Department;
- RF03–RF13 ainda 404;
- gates lint/build/coverage/messaging/diff.

## 6. Próxima execução

Branch:

```text
feat/support-rf02-update-department
```

Prompt:

```text
docs/prompts/support-rf02-implementation-prompt.md
```

Encerrar a execução depois de RF02. Não iniciar RF03.
