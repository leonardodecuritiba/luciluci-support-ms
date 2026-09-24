# ACTUAL_STATE

## Estado atual — baseline RF05 e branch RF06

- serviço `support-ms`; domínio `support`;
- S1 `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`; drift `DRIFT-SUP-S1-001 / RESOLVED / PROVEN`;
- RF01–RF05 `IMPLEMENTED_AND_PROVEN` e integradas em `main`;
- baseline estável `MAIN_BASELINE_RF05`, merge da PR #4 `2cfb637854c5c90abfaf197e6e0822ceb53571f8`;
- RF06 `IMPLEMENTED_AND_PROVEN_LOCAL` em `feat/support-rf06-update-ticket`, ainda sem integração em `main`;
- RF07a/RF07b e RF08–RF13 `NOT_IMPLEMENTED`;
- contrato RF06 congelado em Support 0.8, commit canônico `4650ec671c948a4fa8fb04fa33b300d8fd255ae4` de `luciluci-docs`;
- decisões RF06 DEC-SUP-01/03/05/06/08/09/10/12 resolvidas somente nesse recorte; decisões de RFs futuras continuam abertas conforme `luciluci-docs/support/notes.md`.

## Superfície implementada

RF01–RF04 operam Department e RF05 cria Ticket, mensagem inicial, mídias e uma auditoria em transação. RF06 expõe `PATCH /api/support/tickets/{ticketId}` para `priority`, `departmentId` e `adminStatus`, com headers de ator e correlação obrigatórios, ACL por membership do Department atual para admin ou ownership para backoffice/cd, validação do target ativo, no-op sem write e auditoria `alteracao_status` somente em mudança efetiva de `adminStatus`.

O update RF06 bloqueia Ticket antes dos Departments, estes em ordem lexical de UUID, revalida autorização e estado sob lock e executa update e eventual AuditLog em uma única transação. A migration RF05 já suporta os valores de status e origem de auditoria necessários; RF06 não adiciona migration. Não há evento, outbox ou idempotência HTTP para RF06. Seed W1 permanece bloqueada até massa determinística aprovada.

## Evidência local

- `npm run build`, `npm run lint`, testes unitários RF06 (2), integração RF06 (29), contrato OpenAPI (2) passaram.
- `npm run proof:rf06:postgres` passou em PostgreSQL 16, banco exclusivo `support_s1_proof_rf06_20260924` criado e descartado pelo script. A prova exercitou processo compilado, ACL, no-op, auditoria, rollback induzido na auditoria, espera pelo lock do Ticket e revalidação do target após lock de Department.
- A suíte completa passou com 21 suítes/177 testes. Cobertura: 98,17% statements, 85,18% branches, 98,31% functions e 98,38% lines. OpenAPI export/check e compatibilidade contra RF05, build/check e `messaging:check` passaram. O teste RF04 historicamente fixado em RF06=404 foi atualizado para verificar apenas RF07–RF13.
- Não há evidência de CI remoto ou integração RF06 em `main` nesta branch.

Reports anteriores registram as provas S1 e RF01–RF05. A prova RF05 anterior cobriu schema, rollback, sequence, concorrência e imagem. Nenhuma prova de RF06 é atribuída retroativamente às outras RFs.

## Continuidade

Finalizar revisão da branch RF06 e publicar PR para CI remoto; integrar somente quando os critérios de `docs/workflows/support-development-branch-policy.md` forem satisfeitos. RF07 permanece fora deste slice.
