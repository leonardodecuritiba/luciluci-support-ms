# REPORT — Checkpoint de definição da seed determinística W1

- **status:** `SEED_W1_DEFINITION_BLOCKED_BY_DECISION / SEED_W1_NOT_IMPLEMENTED`
- **generated_by:** Codex
- **generated_at:** 2026-09-28T18:24:59Z
- **review_mode:** checkpoint operacional, sem implementação
- **microservice:** support-ms
- **repository_ref:** `docs/support-seed-w1-checkpoint`, base `SUPPORT_FINAL_DOCUMENTED_MAIN=c417d8f1f7d853e6dd1770a27866132032c2de2b`
- **documentation_ref:** Support 0.15, gitlink `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`
- **report_file:** `docs/reports/REPORT-SUPPORT-SEED-W1-CHECKPOINT-20260928-182459.md`
- **reviewer:** decisões operacionais ainda não aprovadas

---

# 1. Resumo executivo

`MAIN_BASELINE_RF13=2aacc5554c9c2c4f25415dd8b170f5ff73b6d189` e `SUPPORT_FINAL_DOCUMENTED_MAIN=c417d8f1f7d853e6dd1770a27866132032c2de2b`: RF01–RF13 estão integradas, com 14 operações. Support 0.15 e seu gitlink permanecem fixos. Não houve deploy. A seed atual aborta antes de conectar ao banco; este checkpoint não executou nem alterou `scripts/seed.ts`.

**W1-01 segue aberta.** O plano histórico chama W1 de “Departamentos” e inclui seed em sua saída. O TDD canônico 0.15 **propõe** uma massa do domínio completo para as waves funcionais, mas não a aprova como escopo da seed W1. PRD e TP também não escolhem entre A (Department-only) e B (domínio completo). Estado: `W1_SEED_SCOPE_BLOCKED_BY_DECISION`. Recomendo B porque o TDD/TP já oferecem volumes e cenários e o serviço final tem 14 operações; A preserva estritamente o nome histórico da wave. Nenhuma é congelada aqui.

O restante é **uma proposta operacional única para avaliação**, menor que a massa de 200 Tickets sugerida pelo TDD para as waves funcionais. Números e gates verificáveis não se tornam decisões aprovadas por serem precisos. A seed permanece indisponível até decisão expressa.

# 2. Fontes e tensão W1

| Fonte                                                      | Define                                                                                                       | Não define                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `docs/workflows/support-bootstrap-plan.md` §§5.3, 6        | S1 bloqueia seed; W1 = Department/RF01–RF04 e inclui seed na saída.                                          | Entidades, volume ou política do comando W1.                          |
| `luciluci-docs/support/tdd.md` §9                          | **Propõe** 8 Departments, 40 requesters, 12 admins, 200 Tickets e ≥600 Messages; ACL, status e visibilidade. | Aprovação, vínculo inequívoco à seed W1, AuditLogs, rerun e sequence. |
| `luciluci-docs/support/tp.md` §4                           | DEV/CI PostgreSQL isolado e massa sintética; fixtures pequenas próprias para testes.                         | Quantidades aprovadas, ambientes do comando manual ou rerun.          |
| `luciluci-docs/support/{prd,notes,README,dependencies}.md` | Regras de Department, Ticket, Message, mídia, AuditLog e fronteiras BFF/Files.                               | Escopo ou aprovação da seed W1.                                       |
| `scripts/seed.ts`, teste bootstrap, runbook                | Recusa antes de conectar/escrever; `npm run seed` não está disponível.                                       | Seed futura implementada ou provada.                                  |
| Entidades, schemas e migrations                            | Colunas, enums, FKs, checks e sequence; não há marcador seed-owned.                                          | Dados sintéticos, segurança de DB existente.                          |
| `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, report final RF13    | RFs encerradas; seed pendente operacional local.                                                             | Opção A/B.                                                            |

O gitlink Support 0.15 foi lido e não alterado. Fixtures de proofs são referência de consistência, não fonte da seed. `package.json` usa `ts-node` no comando; a configuração real é `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, não `DATABASE_URL`.

# 3. Inventário do modelo

| Entidade              | Campos/enums reais                                                                                                                                                                                                                                                            | Invariantes principais                                                                                                                    | Na proposta B? | Fonte                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------- |
| Department            | UUID, name, `type=todos\|backoffice\|cd`, active, timestamps                                                                                                                                                                                                                  | Inativo não recebe Ticket novo; soft delete preserva Tickets; type não concede ACL.                                                       | 6              | entidade, migration RF01, RF04/RF05                |
| DepartmentAllowedUser | departmentId, position, userId                                                                                                                                                                                                                                                | Membership atual concede acesso admin; PK `(department_id,position)`; lista vazia possível.                                               | 7 linhas       | entidade, migration RF01, ACL                      |
| Ticket                | UUID, number único positivo via sequence, subject, requesterId, departmentId, priority `baixa\|media\|alta\|urgente`, origin `backoffice\|cd`, adminStatus `pendente\|cancelado\|em_andamento\|finalizado\|resolvido`, requesterStatus `nao_resolvido\|resolvido`, timestamps | FK Department; RF05 inicia pendente/não resolvido; RF06/RF08 auditam mudanças efetivas.                                                   | 16             | entidade, migration RF05, use cases                |
| TicketMessage         | UUID, ticketId, message, type `admin\|backoffice\|cd`, authorId, visibility, createdAt                                                                                                                                                                                        | Requester sempre visível; admin pública/interna. Inicial RF05 não gera audit `nova_mensagem`.                                             | 44             | entidade, migration RF05, RF05/RF10/RF11           |
| TicketMessageMedia    | `(ticketMessageId,position)`, mediaId opaco                                                                                                                                                                                                                                   | Position ≥0, IDs duplicados em posições distintas permitidos; nenhuma FK/consulta Files.                                                  | 8 linhas       | entidade, migration RF05                           |
| TicketAuditLog        | UUID, ticketId, datetime, authorId, origin, action `criacao_ticket\|nova_mensagem\|alteracao_status`, statusType/newStatus                                                                                                                                                    | Status só em `alteracao_status`; requester RF10 gera duas auditorias até se pendente; RF11 não audita; RF13 não correlaciona com Message. | 80 linhas      | entidade, migration RF05, RF05/RF06/RF08/RF10/RF13 |

Na alternativa A apenas Department e memberships entrariam. Quantidades da proposta B não descrevem dados hoje existentes.

# 4. Matriz W1-01–W1-18

Cada linha abaixo é **proposta para decisão**, exceto a constatação de bloqueio em W1-01. Nenhuma linha autoriza implementação.

| ID    | Tema                | Decisão ou proposta verificável                                                                                                            | Fonte/natureza                                       | Status                  |
| ----- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ----------------------- |
| W1-01 | Escopo              | A: somente Department/membership; B recomendada: domínio completo em escala pequena. A fonte não escolhe.                                  | plano W1 versus TDD/TP canônicos; recomendação local | **BLOCKED_BY_DECISION** |
| W1-02 | Ambiente            | Somente desenvolvimento local ou CI isolada em PostgreSQL descartável; homologação/produção vedadas sem novo contrato.                     | TP §4 + safety proposta                              | PROPOSAL                |
| W1-03 | Política destrutiva | Exigir tabelas de domínio vazias em primeira execução; nunca limpar, truncar, atualizar ou substituir dados preexistentes.                 | ausência de marcador seed-owned no schema            | PROPOSAL                |
| W1-04 | Determinismo        | IDs UUID e textos canônicos versionados, datas UTC fixas, ordem explícita; mesmo commit/configuração produz mesmo conteúdo observável.     | TDD §9 + proposta                                    | PROPOSAL                |
| W1-05 | Volume              | B pequena: 6 Departments, 7 memberships, 16 Tickets, 44 Messages, 8 media refs, 80 audits; 8 atores sintéticos.                            | TDD sugere escala maior para waves, não decide W1    | PROPOSAL                |
| W1-06 | Atores              | 3 admins membros, 1 admin externo e 4 requesters fictícios (2 de cada origin); IDs legíveis e estáveis.                                    | contratos ACL + proposta                             | PROPOSAL                |
| W1-07 | Departments         | Dois de cada type; cinco ativos/um inativo; membership sobreposta; zero duplicatas de userId por Department.                               | modelo/RF01–RF04 + proposta                          | PROPOSAL                |
| W1-08 | Tickets             | Cobrir ambos origins, quatro priorities, cinco adminStatus, dois requesterStatus e Department inativo em 16 linhas.                        | PRD/entidade + proposta                              | PROPOSAL                |
| W1-09 | Mensagens           | Estado final direto, sem chamar HTTP/use cases; 16 iniciais + 16 follow-ups visíveis + 12 admin, metade interna.                           | RF05/RF10/RF11 + proposta                            | PROPOSAL                |
| W1-10 | Media IDs           | 8 referências opacas sintéticas, duas mensagens com uma e duas com três; uma tripla repete mediaId em posições distintas.                  | schema/RF05 + proposta                               | PROPOSAL                |
| W1-11 | AuditLog            | 16 creation + 32 follow-up RF10 + 12 admin message + 12 adminStatus + 8 requesterStatus = 80; nenhum audit RF11.                           | RF05/RF06/RF08/RF10/RF13 + proposta                  | PROPOSAL                |
| W1-12 | Sequence            | Usar `nextval` real em ordem 1–16 em banco novo; próximo número API = 17; reexecução não avança sequence.                                  | migration/schema + proposta                          | PROPOSAL                |
| W1-13 | Atomicidade         | Uma transação PostgreSQL para todas as seis tabelas de domínio; erro reverte linhas. Sequence não é transacional: após erro, descartar DB. | PostgreSQL + proposta                                | PROPOSAL                |
| W1-14 | Gates               | Validar confirmação, DB explícito, identidade, ambiente, host/instância autorizados e nome real antes de escrever; recusa exit 2.          | TP §4 + proposta                                     | PROPOSAL                |
| W1-15 | Rerun               | Dataset exatamente igual retorna sucesso sem writes nem `nextval`; qualquer divergência ou dado manual falha, sem upsert.                  | schema sem ownership marker + proposta               | PROPOSAL                |
| W1-16 | Faker               | Dataset canônico manual/versionado; não usar faker para valores persistidos.                                                               | dependência existente + estabilidade proposta        | PROPOSAL                |
| W1-17 | Testes              | Unit de manifest/gates; PostgreSQL descartável para counts, FK, ACL, rerun, rollback, sequence; smoke de leitura API.                      | TP + proposta                                        | PROPOSAL                |
| W1-18 | Prova segura        | Harness cria DB ausente `support_s1_proof_seed_<suffix>`, migra, prova e descarta apenas esse DB; sem volume persistente.                  | TP §4 + proposta                                     | PROPOSAL                |

# 5. Massa proposta para a opção B

Esta é uma **candidata pequena para aprovação**, não a massa canônica TDD de 200 Tickets/≥600 Messages. Ela permite paginação com page size 1/2 e navegação manual das 14 operações, sem buscar produto cartesiano. Se a opção A for aprovada, esta seção deixa de ser candidata W1.

| Grupo                 | Quantidade exata | Distribuição e motivo                                                                                                                                                                                     |
| --------------------- | ---------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Department            |                6 | D01–D06: 2 `todos`, 2 `backoffice`, 2 `cd`; D01–D05 ativos, D06 inativo.                                                                                                                                  |
| DepartmentAllowedUser |                7 | D01 A1/A2; D02 A2; D03 A1/A3; D04 A2; D05 A3; D06 vazio. A1/A2 têm acesso sobreposto; A4 não é membro.                                                                                                    |
| Atores externos       |                8 | A1–A3 admins membros; A4 admin sem membership; B1/B2 requesters backoffice; C1/C2 requesters cd. Nenhuma tabela local de usuário.                                                                         |
| Ticket                |               16 | D01–D04 com 3 cada, D05/D06 com 2 cada; 8 por origin, 4 por priority, 4 por requester; números 1–16.                                                                                                      |
| TicketMessage         |               44 | 16 iniciais RF05 + 16 follow-ups requester RF10 + 12 admin RF10 (uma por Ticket de D01–D04); 32 requester visíveis, 6 admin públicas, 6 internas.                                                         |
| TicketMessageMedia    |                8 | Duas mensagens com 1 ref e duas com 3 refs; ao menos uma com IDs iguais nas posições 0 e 2; outras 40 sem mídia.                                                                                          |
| TicketAuditLog        |               80 | 16 criação + 16 `nova_mensagem` requester + 16 `alteracao_status/admin/pendente` requester + 12 `nova_mensagem` admin + 12 `alteracao_status/admin` RF06 + 8 `alteracao_status/requester/resolvido` RF08. |

Distribuição de estado final: D01–D04 recebem os 12 Tickets com adminStatus não pendente, três em cada `cancelado`, `em_andamento`, `finalizado`, `resolvido`; D05/D06 somam quatro `pendente`. Dois Tickets por D01–D04 terminam requesterStatus `resolvido` (8), os demais `nao_resolvido` (8). D06 representa Tickets criados enquanto o Department estava ativo e preservados após soft delete; seed grava o estado final diretamente. Cada requester possui quatro Tickets; B1/B2 têm origin backoffice e C1/C2 têm origin cd (oito Tickets por origin). Ordem dos ordinais deve tornar essas distribuições auditáveis.

Cada Ticket inicia com criação + mensagem inicial; a mensagem posterior do requester gera **duas** auditorias, inclusive se adminStatus já é `pendente`. Nos 12 Tickets de D01–D04, uma mensagem admin gera um audit adicional e uma alteração administrativa efetiva gera outro, cujo `newStatus` coincide com o estado final. Os oito resolvidos pelo requester têm `alteracao_status/requester/resolvido`. Auditorias admin `nova_mensagem` ficam visíveis ao admin autorizado e ocultas ao requester na RF13; o histórico do requester usa somente origin/authorId, sem correlação heurística com Message. Persistir a visibilidade final RF11 não cria auditoria. `statusType/newStatus` ficam ausentes nas ações que não são `alteracao_status`.

IDs de entidades: UUIDs fixos com namespace/categoria/ordinal no manifest versionado, válidos no formato e únicos. IDs de usuário: literais `seed-admin-01`…`03`, `seed-admin-outside-01`, `seed-requester-backoffice-01`…`02`, `seed-requester-cd-01`…`02`. Textos e `mediaId` são sintéticos, sem dados pessoais ou consulta a Files. Timestamps partem de `2026-01-01T00:00:00.000Z` com deslocamentos inteiros e ordem causal criação → follow-up → mensagem/status; o inativo recebe `updatedAt` posterior a seus Tickets. A ordenação é por ordinal explícito, independente de locale, relógio ou timezone. Registrar hash do manifest na implementação futura para comparar reruns; mudanças de versão exigem DB novo.

# 6. Safety model e semântica de execução propostos

**Antes de conectar:** exigir `NODE_ENV=development|test`, `SUPPORT_SEED_CONFIRM=I_UNDERSTAND_DISPOSABLE_DB`, `SUPPORT_SEED_DB_NAME=DB_NAME`, todos os `DB_*` explícitos e service identity `support-ms`; `DATABASE_URL` não é a configuração real. Recusar `support_ms`, `support_ms_test`, nomes vazios e nomes com indício de stage/prod. Exigir nome novo com prefixo `support_seed_dev_` ou `support_s1_proof_seed_`, host loopback ou instância isolada aprovada pelo harness, e evidência de provisionamento da instância/DB descartável. Nome, `NODE_ENV` e localhost isoladamente não demonstram segurança. A confirmação manual não dispensa prova de destino descartável.

**Após conectar, antes de qualquer write:** conferir `current_database()`, versão de migrations e identidade esperada; validar que todas as seis tabelas de domínio estão vazias e a sequence em estado inicial. Se qualquer tabela tiver dado não-seed ou estado parcial, recusar. Se todas as linhas e o estado da sequence corresponderem exatamente ao manifest esperado, retornar sucesso no-op, sem writes. Sem coluna de ownership, similaridade de IDs não basta para concluir que linhas são da seed. Um DB com dados mistos ou alterados sempre falha; nunca `TRUNCATE`, `DELETE` genérico nem upsert. Recusa de gate = exit 2; falha imprevista = exit 1; primeira execução e no-op válido = exit 0.

**Escrita:** uma transação; inserts ordenados Department → membership → Ticket → Message → Media → Audit. Usar `nextval` 16 vezes na transação inicial e conferir 1–16. PostgreSQL não reverte avanço de sequence no rollback: falha de write exige descartar/recriar esse banco antes de tentar novamente. A seed nunca executa contra banco preexistente do usuário nem reinicializa sequence. O próximo Ticket criado pela API deve receber 17. No-op preserva contagem, conteúdo, timestamps e estado físico da sequence.

# 7. Plano de testes e prova para o lote futuro

| Camada     | Prova exigida                                                                                                                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit       | Manifest igual sob relógios/timezones diferentes; IDs, volumes e matriz exata; gates recusam configuração faltante, nome default/prod/stage e instância sem evidência; exit codes; rerun exato versus mismatch.                                       |
| PostgreSQL | Criar DB próprio ausente, aplicar migrations, executar seed, conferir 6 contagens, UUID/FK/sequence, timestamps e cardinalidades por Ticket; verificar ACL atual, visibilidade de mensagens, paginação e history RF13 sem audit admin para requester. |
| Rerun      | Segunda execução retorna no-op; comparar hash de todas as linhas e `last_value/is_called` da sequence antes/depois; dados manuais ou alteração de uma linha devem ser recusados sem mutação.                                                          |
| Rollback   | Injetar falha após inserts parciais; todas as tabelas permanecem vazias; observar avanço possível da sequence e descartar DB, sem reaproveitamento.                                                                                                   |
| Safety     | Recusas de `support_ms`, `support_ms_test`, target preexistente não reconhecido pelo manifest, confirmação ausente, host/instância sem comprovação, ambiente fora da lista e schema inesperado antes de write.                                        |
| Smoke      | `npm run seed` apenas no DB descartável aprovado; leituras HTTP de Department, Ticket, Messages e History com admin, dono e não membro; próximo Ticket via API recebe number 17.                                                                      |

O harness futuro cria somente `support_s1_proof_seed_<suffix>` quando ausente, rastreia ownership e apaga somente esse recurso. Fixtures unitárias e de RF existentes continuam independentes da seed manual. Nenhuma dessas provas foi executada neste checkpoint.

# 8. Documentação, runtime e decisão pendente

Branch documental `docs/support-seed-w1-checkpoint`, base `c417d8f`; este report e os apontadores locais registram somente a definição. `luciluci-docs` permanece em Support 0.15 (`14efcdfdc70d774c4343e2ec47662b7b5c8b691b`). Se a definição final tiver de constar no TDD/TP canônico, abrir edição específica depois da decisão, sem criar Support 0.16 automaticamente.

`SEED_W1=NOT_IMPLEMENTED`; `scripts/seed.ts=STILL_BLOCKED`; `npm run seed` não foi executado. RF01–RF13 permanecem encerradas, sem novo deploy. **Veredito: `SEED_W1_DEFINITION_BLOCKED_BY_DECISION`.**

Para destravar, o responsável pelo contrato deve escolher expressamente W1-01 (A ou B) e aprovar ou ajustar, em conjunto, volume/matriz W1-05–W1-12 e política operacional W1-02–W1-04/W1-13–W1-18. Até lá, não abrir lote de implementação. A aprovação de B pode aproveitar esta proposta ou determinar outra massa; a sugestão TDD de 200 Tickets/≥600 Messages continua distinta e não foi adotada aqui.

# 9. Evidência deste checkpoint

`git fetch origin --prune` e `git pull --ff-only origin main` confirmaram a base `c417d8f` antes da branch. Foram lidos o script bloqueado, teste bootstrap, modelo/migrations, contratos RF, plano W1, report final e Support 0.15 no gitlink fixo. Após a edição documental, `git diff --check` passou, `npm run format:check` passou e `git submodule status` retornou `14efcdfdc70d774c4343e2ec47662b7b5c8b691b` sem marcador de modificação. Nenhum teste da seed nem conexão PostgreSQL foi executado neste lote; os testes da seção 7 são planejamento.
