# REPORT - Avaliação de completude do microserviço

**status:** `MAIN_BASELINE_RF02 / RF03_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`
**generated_by:** Codex
**generated_at:** `2026-09-17T15:21:34Z`
**review_mode:** wave-2 / RF03 contract checkpoint
**microservice:** `support-ms`
**repository_ref:** `main` / `e2dba18a7d0c54577805d6bf2f44adc40ecf0295`, worktree documental modificada
**documentation_ref:** `luciluci-docs` base `7cc153fab92b634c898727b983078c4c696d3ea9`, branch local `docs/support-rf03-contract`, worktree não publicada
**report_file:** `docs/reports/REPORT-SUPPORT-RF03-CHECKPOINT-20260917-152134.md`
**reviewer:** não informado

# 1. Resumo executivo

RF02 foi revalidada como integrada: PR #1 `MERGED`, check remoto `quality` em
`SUCCESS` e merge `e2dba18a7d0c54577805d6bf2f44adc40ecf0295` presente em
`origin/main`. Essa revisão estabelece `MAIN_BASELINE_RF02`.

O checkpoint RF03 não encontrou fonte suficiente para fechar paginação,
ordenação e shape. A fonte permite delimitar query, ativos, correlação,
autorização, ausência de auditoria/eventos e persistência read-only. Como
DEC-SUP-02/08 permanecem `OPEN_FOR_RF03`, nenhuma branch funcional, rota,
controller, use case, repository, migration ou teste executável foi criado.

# 2. Escopo e fontes analisadas

Foram lidos `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`,
`README.md`, política de branches, reports RF02, `.gitmodules`, código/contrato
HTTP atual e `luciluci-docs/{AI_FIRST,README}.md` mais
`support/{README,prd,tdd,tp,notes,dependencies,sources/prd-original}.md`.

Também foram pesquisados os guias globais e contratos de paginação dos demais
serviços. Eles divergem em `limit`/`pageSize`, defaults, limites e envelopes;
nenhum documento transversal define um formato único aplicável a Support.

# 3. Matriz principal RF x implementação

| RF        | Endpoint                                        | Status                              | Código/contrato/testes | Evidência                                       |
| --------- | ----------------------------------------------- | ----------------------------------- | ---------------------- | ----------------------------------------------- |
| RF01      | `POST /api/support/departments`                 | Implementado                        | presentes              | report RF01 e regressão RF02                    |
| RF02      | `PATCH /api/support/departments/{departmentId}` | Implementado                        | presentes              | report RF02, PR #1 e `origin/main`              |
| RF03      | `GET /api/support/departments`                  | Não encontrado / contrato bloqueado | ausentes               | OpenAPI, `api.http`, `src/` e `tests/` sem RF03 |
| RF04–RF13 | conforme PRD                                    | Não encontrado                      | ausentes               | fora deste checkpoint                           |

# 4. Checklist consolidado por PRD

- [x] RF01 e RF02 integradas em `MAIN_BASELINE_RF02`.
- [!] RF03 preserva `type`, `page`, `size` e somente ativos, mas não possui
  paginação/ordenação/shape completos.
- [ ] RF03 runtime não implementado.
- [ ] RF04–RF13 não implementadas.

# 5. Checklist consolidado por TDD

- [x] `X-Correlation-ID` obrigatório e pipeline global de erros preservados.
- [x] RF03 sem ator/ACL fina local, auditoria, evento, outbox ou migration.
- [!] DEC-SUP-02 aberta para defaults, limites, envelope, fora de faixa e ordem.
- [!] DEC-SUP-08 aberta para projeção do item e validações dependentes da paginação.
- [x] Nenhum arquivo executável/configuração foi alterado.

# 6. Checklist consolidado por TP

- [x] Casos futuros foram delimitados para filtro, ativos, páginas, correlação,
      enum, ordem, PostgreSQL, processo/OpenAPI e ausência de side effects.
- [ ] Unit RF03: não criado/não executado.
- [ ] Integration RF03: não criado/não executado.
- [ ] Functional RF03: não criado/não executado.
- [ ] Contract RF03: não criado/não executado.

## 6.1 Matriz obrigatória RF -> testes

| RF        | Unit      | Integration | Functional                | Agrupamento / exceção        | Evidência / observação | Status                       |
| --------- | --------- | ----------- | ------------------------- | ---------------------------- | ---------------------- | ---------------------------- |
| RF01      | existente | existente   | prova PostgreSQL/processo | FU-SUP-01 ainda agregado     | report RF01            | completa no recorte aprovado |
| RF02      | existente | existente   | prova PostgreSQL/processo | lock/rollback no script RF02 | report RF02            | completa no recorte aprovado |
| RF03      | ausente   | ausente     | ausente                   | contrato bloqueado           | slots TP, não testes   | ausente                      |
| RF04–RF13 | ausente   | ausente     | ausente                   | fora do checkpoint           | TP planejado           | ausente                      |

# 7. Inventário de endpoints reais

## Endpoints funcionais

| Método | Path                                      | RF   | Status       |
| ------ | ----------------------------------------- | ---- | ------------ |
| POST   | `/api/support/departments`                | RF01 | Implementado |
| PATCH  | `/api/support/departments/{departmentId}` | RF02 | Implementado |

`GET /api/support/departments` não está registrado.

## Endpoints operacionais / contratos

`GET /health`, `/metrics`, `/api-docs` e `/api-docs-json` permanecem superfícies
operacionais herdadas e não são RFs do domínio. A OpenAPI atual descreve somente
RF01/RF02 e essas superfícies.

# 8. Fronteira NFR e capacidades transversais

## 8.1 Matriz obrigatória de fronteira NFR

| Item                      | Classificação                     | Estado/evidência               | Gap real local?     |
| ------------------------- | --------------------------------- | ------------------------------ | ------------------- |
| Correlação/error mapping  | implementado localmente           | kernel e RF01/RF02 comprovados | não                 |
| RBAC amplo                | upstream/plataforma               | BFF/borda                      | não                 |
| Paginação/ordenação RF03  | compartilhado/decisão de contrato | DEC-SUP-02 aberta              | bloqueio contratual |
| Eventos/broker            | fora do escopo desta release      | nenhum evento Support          | não                 |
| OpenTelemetry/DLQ/redrive | compartilhado/fora do escopo      | sem responsabilidade RF03      | não                 |

## 8.2 Capacidades transversais

PostgreSQL, migration de Department, OpenAPI, `api.http`, correlação e error
mapping continuam materializados para RF01/RF02. RF03 é read-only e não mostrou
necessidade objetiva de migration/índice. Seed robusto continua bloqueado pela
definição de W1. O workflow remoto `quality` da PR #1 foi observado em
`SUCCESS`; isso não é execução de teste RF03.

# 9. Cobertura de testes

Nenhuma suíte foi executada porque o lote alterou somente Markdown e não criou
runtime RF03. Percentuais históricos permanecem nos reports RF01/RF02 e não são
reatribuídos a este checkpoint. A ausência de testes RF03 é coerente com o
contrato bloqueado, não evidência de implementação parcial.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF03–RF13 continuam previstas no PRD e ausentes do runtime. Para RF03 isso é o
estado exigido até resolver DEC-SUP-02/08.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência nova. A migration/tabelas de Department pertencem a
RF01/RF02 e são suficientes para a leitura planejada; não provam seu contrato.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Nenhuma. O documento registra RF03 como `NOT_IMPLEMENTED` e bloqueada.

## 10.4 PRD / TDD / TP divergem entre si

Não há divergência funcional nova; os três documentos registram explicitamente
o checkpoint bloqueado. A fonte original permanece inalterada.

## 10.5 Ambiguidades que impedem conclusão segura

- DEC-SUP-02: obrigatoriedade/defaults/base/limites, envelope/metadata,
  comportamento fora de faixa, erros e ordenação estável.
- DEC-SUP-08: shape exato do item/lista e validações dependentes dos limites.

# 11. Conclusão

Estado final: `RF03_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`.
`MAIN_BASELINE_RF02` está comprovada; RF03 segue `NOT_IMPLEMENTED`. A branch
funcional e a publicação/gitlink da documentação RF03 não devem existir até
resolver DEC-SUP-02/08.
