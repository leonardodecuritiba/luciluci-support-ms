# REPORT — Revisão independente e remediação local RF13

- **status:** `RF13_REVIEW_PASS / READY_FOR_PUBLICATION` local; sem publicação Git
- **generated_by:** Codex, revisão independente do lote funcional
- **generated_at:** 2026-09-28T15:05:46Z
- **review_mode:** final local
- **microservice:** support-ms
- **repository_ref:** `feat/support-rf13-history`, HEAD `7f041fdcda4add42e21025583c91c316f579489e` com diff não commitado
- **documentation_ref:** Support 0.15, gitlink `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF13-REVIEW-20260928.md`
- **reviewer:** Codex

# 1. Resumo executivo

O lote anterior entregou a implementação local da RF13 e registrou 35 suítes, 310 testes, provas PostgreSQL RF01–RF13 e smoke da imagem no [report funcional](REPORT-SUPPORT-RF13-20260928.md). Esta revisão reconfirmou a branch, o contrato Support 0.15, a ACL e a ausência de publicação. Não encontrou falha P0/P1 nem desvio funcional no runtime. Encontrou duas lacunas de evidência no harness/teste, corrigidas localmente e revalidadas.

| ID          | Severidade | Área                  | Finding                                                                                                                                                                              | Status                                                                                                 |
| ----------- | ---------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| RF13-REV-01 | MEDIUM     | Prova temporal        | O harness original usava `Date` enviada pelo cliente `pg` para o empate; não fixava o mesmo valor de `timestamp without time zone` em fusos distintos nem comparava o ISO retornado. | Corrigido: literal SQL UTC, IDs determinísticos, assert do ISO e execuções UTC/São Paulo.              |
| RF13-REV-02 | LOW        | Profundidade da prova | A prova PostgreSQL verificava total/página inicial, mas não percorria todas as páginas compactadas; após RF11, não reconfirmava ausência de SELECT em TicketMessage.                 | Corrigido: quatro páginas + beyond end, comparação do log SQL antes/depois de RF11 e no-ops RF06/RF08. |

Resultado: `RF13_REVIEW_PASS / READY_FOR_PUBLICATION` nesta branch. RF01–RF12 permanecem integradas em `main`; RF13 segue fora de `main`. Nenhum commit, push, PR, merge ou deploy foi feito.

# 2. Escopo e fontes analisadas

- Admissão Git: `feat/support-rf13-history`, HEAD e base documental `7f041fd`; `main=origin/main=1e243d386dbca3e2d4dbf14fec7d29c8e5d1b366`; nenhuma branch remota `origin/feat/support-rf13-history` após `git fetch origin --prune`.
- Contrato: `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md`, Support 0.15. Submódulo limpo no commit `14efcdf`; fonte original preservada.
- Diff: route/controller/parser/body middleware; use case e interface; SQL TypeORM; testes; OpenAPI/`api.http`; `scripts/prove-rf13-postgres.js` e preload; smoke; workflow CI; documentação local. Nenhuma migration nem alteração no gitlink.
- Comparação OpenAPI contra `origin/main`; provas funcionais em bancos PostgreSQL descartáveis com processo compilado e imagem Docker com rede/banco próprios.
- CI remota RF13: **ausente**. O workflow local foi revisado, mas não executado no GitHub nesta revisão.

# 3. Matriz principal RF x implementação

| RF        | Estado                           | Evidência original                                          | Revalidação independente                                                                                 |
| --------- | -------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| RF01–RF12 | Implementadas/provadas em `main` | Baseline `1e243d3` e reports históricos                     | Doze proofs PostgreSQL reexecutadas com `TZ=UTC`, todas passaram.                                        |
| RF13      | Implementada/provada localmente  | Report funcional, 35 suítes/310 testes, PostgreSQL e imagem | Runtime/SQL/contrato inspecionados; proof temporal e de segurança ampliada; dois fusos e smoke passaram. |

# 4. Checklist consolidado por PRD

- [x] Admin sem `ticketId`: `EXISTS` com membership atual do Department; `active` e `type` não filtram. Com `ticketId`, existência precede ACL.
- [x] Requester sem `ticketId`: ownership de Ticket no SQL, independente de `ticket.origin` e do papel backoffice/cd. Com `ticketId`, 403 para Ticket existente alheio e 404 para ausente.
- [x] Requester recebe `nova_mensagem` somente de `origin IN ('backoffice','cd')` e `authorId=ticket.requesterId`; `origin=admin` é sempre oculto. `criacao_ticket` e `alteracao_status` não sofrem esse filtro.
- [x] O predicado de visibilidade está na query antes de `getCount`, ordem e offset; `COUNT` e página reutilizam o mesmo QueryBuilder.
- [x] Nenhuma consulta a TicketMessage decide visibilidade de AuditLog; não há join/correlação heurística.

# 5. Checklist consolidado por TDD

- [x] Query aceita somente `ticketId/page/size`, UUID v4, defaults 1/20, inteiros decimais positivos seguros, size 1..100; desconhecidos, repetidos, vazios, whitespace e sinais retornam 422.
- [x] Middleware antes do parser JSON rejeita body presente, inclusive JSON `{}`, `null`, array e string, com 422; ausência de body segue normalmente.
- [x] `/history` está antes de `/:ticketId`. A resposta tem exatamente oito campos, `number` do Ticket, status nulo explícito fora de alteração, e `pagination` com total preservado fora da faixa.
- [x] `datetime DESC,id DESC` explícitos. O app configura `pg` OID 1114 para interpretar `timestamp without time zone` como UTC em `src/shared/infrastructure/database/data-source.ts`.
- [x] Controller abre uma transação PostgreSQL `REPEATABLE READ` e injeta o mesmo `EntityManager` no repository para Ticket/ACL, count, page e number. SQLite usa transação sem nível explícito.
- [x] Caminho RF13 não faz insert/update/delete/save, touch, auditoria de leitura, idempotência, lock pessimista, evento ou mensageria.

# 6. Checklist consolidado por TP

## 6.1 Matriz RF → unit / integration / functional

| RF        | Unit                                                     | Integration/contract                                                     | Functional                                                  |
| --------- | -------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------- |
| RF01–RF12 | Suítes históricas                                        | Suítes históricas                                                        | `proof:rf01:postgres`–`proof:rf12:postgres`, reexecutadas.  |
| RF13      | `tests/unit/ticket/list-ticket-history.use-case.spec.ts` | `tests/integration/ticket/list-ticket-history.spec.ts`; contrato OpenAPI | `proof:rf13:postgres` em UTC e São Paulo; `proof:s1:image`. |

Os testes detectam conceitualmente a remoção do vínculo `authorId`, a inclusão de `origin=admin`, filtragem depois da página, perda do desempate `id DESC`, perda de `REPEATABLE READ`, projeção de `number` incorreta, aceitação de body e troca indevida de 403 por 404. A integração foi ampliada nesta revisão para JSON body, whitespace e UUID não-v4. O harness PostgreSQL foi ampliado para todas as páginas compactadas, `datetime` fixo, ausência de lookup Message após RF11 e no-ops RF06/RF08.

# 7. Inventário de endpoints reais, dados e transação

| Método | Path                           | Handler                         | Resultado                          |
| ------ | ------------------------------ | ------------------------------- | ---------------------------------- |
| GET    | `/api/support/tickets/history` | `ticket.controller#listHistory` | 200/400/403/404/422/500; read-only |

`/health`, `/metrics` e `/api-docs*` são operacionais, não RFs. OpenAPI materializa as 14 operações Support (RF07a/RF07b separadas) e a RF13 é aditiva ante `origin/main`; o teste de compatibilidade passou. `api.http` contém cenários admin/requester, ACL, paginação e erros.

Na query, há join AuditLog→Ticket por chave, `EXISTS` para membership admin e projeção de Ticket.number na própria página. Não há produto cartesiano nem consulta por AuditLog/Ticket retornado. O esquema atual não adiciona índice específico para ordenar histórico; em dataset pequeno a revisão não demonstrou gargalo de produção. Isso não é blocker de correctness nem autorização para migration neste lote.

O harness comparou `row_to_json(t)` e `xmin` de `departments`, `department_allowed_users`, `tickets`, `ticket_messages`, `ticket_message_media` e `ticket_audit_logs` antes/depois das leituras. Os seis conjuntos ficaram idênticos. A consulta RF13 não fez SELECT a `ticket_messages` para visibility, inclusive depois de RF11.

| Concorrência          | Fotografia em andamento | Próxima leitura | Veredito                                           |
| --------------------- | ----------------------: | --------------: | -------------------------------------------------- |
| RF13 requester × RF10 |                 total 5 |         total 7 | Dois AuditLogs da mesma transação aparecem juntos. |
| RF13 admin × RF06     |                 total 9 |        total 10 | Audit de status inteiro após commit.               |
| RF13 requester × RF08 |                 total 8 |         total 9 | Audit requester inteiro após commit.               |
| RF13 requester × RF11 |                 total 9 |         total 9 | Visibility não altera histórico.                   |

O gate pausou RF13 depois do count dentro do `REPEATABLE READ`, permitiu o writer commitar e retomou a página. `data` e `total` conservaram a fotografia anterior, sem lock, timeout ou deadlock. RF06/RF08 no-op posteriores não acrescentaram AuditLog.

## 7.1 Revisão temporal

| TZ do processo      | Proof RF13 | Ordenação com IDs fixos              | `datetime` serializado     |
| ------------------- | ---------- | ------------------------------------ | -------------------------- |
| `UTC`               | PASS       | `alteracao_status`, `criacao_ticket` | `2099-01-01T00:00:00.000Z` |
| `America/Sao_Paulo` | PASS       | `alteracao_status`, `criacao_ticket` | `2099-01-01T00:00:00.000Z` |

As provas usaram bancos distintos `support_s1_proof_rf13_review_utc2` e `support_s1_proof_rf13_review_sp2`; ambos foram removidos pelo script. A paginação compactada produziu quatro páginas contíguas e beyond end vazio, com mesmo total.

# 8. Fronteira NFR e capacidades transversais

| Tema                                                                      | Classificação                | Evidência/limite                           |
| ------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------ |
| ACL, privacidade de AuditLog, correlação, leitura consistente e read-only | Implementado localmente      | Código e provas PostgreSQL/HTTP.           |
| AuthN ampla, RBAC geral e rate limit                                      | Upstream/plataforma          | Fora do handler Support.                   |
| Tracing distribuído                                                       | Compartilhado                | Nenhum requisito local novo RF13.          |
| RabbitMQ, DLQ, redrive, Schema Registry                                   | Fora do escopo desta release | Nenhum evento Support especificado.        |
| Gap real local                                                            | Nenhum após remediação       | CI remota depende de publicação posterior. |

# 9. Cobertura de testes e gates finais

| Gate                                                                             | Exit | Resultado                                                                         |
| -------------------------------------------------------------------------------- | ---: | --------------------------------------------------------------------------------- |
| `npm run lint`, `build`, `build:check`                                           |    0 | Passaram após revisão.                                                            |
| `npm run openapi:export`, `openapi:check`, `openapi:compat` contra `origin/main` |    0 | Artefato sincronizado e compatível.                                               |
| `npm run messaging:check`                                                        |    0 | Mensageria desabilitada conforme contrato.                                        |
| `npm run test:unit`                                                              |    0 | 20 suítes, 87 testes.                                                             |
| `npm run test:integration`                                                       |    0 | 14 suítes, 221 testes, incluindo body JSON novo.                                  |
| `npm run test:contract`                                                          |    0 | 1 suíte, 2 testes.                                                                |
| `npm run test:coverage`, `coverage:check`                                        |    0 | 35 suítes, 310 testes; cobertura acima dos limiares.                              |
| `proof:rf01:postgres`–`proof:rf12:postgres`                                      |    0 | Doze bancos exclusivos; `TZ=UTC` pelo harness histórico.                          |
| `proof:rf13:postgres` em `UTC` e `America/Sao_Paulo`                             |    0 | ISO, ordem, ACL, read-only, paginação, ausência de Message lookup e concorrência. |
| `proof:s1:image`                                                                 |    0 | Imagem, PostgreSQL e rede descartáveis; limpeza confirmada.                       |
| `npm run format:check`, `git diff --check`                                       |    0 | Passaram após formatação final do report.                                         |

CI remota: **não executada**, pois a branch permanece sem commit/push/PR. Os resultados acima são execuções locais desta revisão; não foram inferidos do workflow.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

Nenhuma divergência funcional RF13 encontrada. CI remota e integração em `main` continuam pendentes por escopo deste lote.

## 10.2 Código existe, documentação não comprova

O report funcional permanece como evidência do lote de implementação; este report acrescenta a revisão temporal e as correções da prova sem reescrever a evidência histórica.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

O estado da branch distingue implementação local de merge e deploy. A revisão não alterou runtime nem contrato canônico.

## 10.4 PRD / TDD / TP divergem entre si

Nenhuma contradição material nova em Support 0.15.

## 10.5 Ambiguidades que impedem conclusão segura

Nenhum blocker técnico/contratual P0/P1 residual. A performance do histórico sob carga real ainda não foi medida; nenhuma evidência desta revisão justifica migration antecipada.

# 11. Conclusão

`RF13_REVIEW_PASS / READY_FOR_PUBLICATION` local. O diff não commitado permanece para revisão e publicação em lote separado. Próxima ação prioritária: abrir lote próprio para commit, push, PR e CI remota; nenhum desses atos pertence a esta revisão.
