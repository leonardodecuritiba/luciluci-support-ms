# REPORT — Implementação e prova local da seed determinística W1

- **status:** `SEED_W1_IMPLEMENTED_AND_PROVEN_LOCALLY / READY_FOR_INDEPENDENT_REVIEW`
- **generated_by:** Codex
- **generated_at:** 2026-09-28T19:33:18Z
- **review_mode:** implementação e prova local, antes de commit/publicação
- **microservice:** support-ms
- **repository_ref:** `feat/support-seed-w1`, descendente de `4115ab59feae1a7f428bac76353f8fd0bd40f96c`
- **documentation_ref:** Support 0.15, gitlink `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`
- **report_file:** `docs/reports/REPORT-SUPPORT-SEED-W1-20260928-193318.md`
- **reviewer:** revisão independente pendente

---

# 1. Estado Git e escopo

`main=origin/main=c417d8f1f7d853e6dd1770a27866132032c2de2b`; checkpoint documental `docs/support-seed-w1-checkpoint=4115ab59feae1a7f428bac76353f8fd0bd40f96c`; branch funcional local `feat/support-seed-w1`. O merge-base confirmou a ancestralidade da baseline final. O gitlink canônico continua Support 0.15 em `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`. O checkout principal e cinco worktrees históricos foram inventariados; nenhum worktree foi alterado. A branch funcional não recebeu commit, push, PR ou deploy neste lote.

A seed aprovada é a fixture **canônica pequena do domínio completo**, não a massa volumétrica proposta no TDD. RF01–RF13 e as 14 operações HTTP permanecem integradas em `main`; não houve migration, mudança OpenAPI ou alteração do runtime de RF.

# 2. Implementação realizada

| Arquivo                                          | Responsabilidade                                                                                                                                |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/seed/support-w1.fixture.ts`             | Matriz T01–T16, oito atores, seis Departments, IDs UUID v4 estáveis por categoria/ordinal, timestamps UTC fixos e todas as rows W1.             |
| `scripts/seed/support-w1.validate.ts`            | Validação em memória de contagens, enums, IDs, FKs lógicas, ACL, mídia, mensagens, timeline, audits e estado final.                             |
| `scripts/seed/support-w1.safety.ts`              | Gates puros de opt-in, `NODE_ENV`, DB_NAME e identidade.                                                                                        |
| `scripts/seed/support-w1.database.ts`            | Verificação de schema, snapshots normalizados, classificador `EMPTY/EXACT_W1/DIVERGENT` e inserts diretos.                                      |
| `scripts/seed.ts`                                | Entry point: gates antes de importar DataSource, lock transacional sob `READ COMMITTED`, uma transação, verificação antes/depois e markers CLI. |
| `scripts/prove-seed-w1-postgres.js`              | Harness de DBs próprios descartáveis, prova SQL, no-op físico, divergência, falha tardia, fusos e HTTP compilado.                               |
| `tests/unit/scripts/support-w1-seed.spec.ts`     | Fixture, safety, estado e orquestração; comparação UTC/São Paulo.                                                                               |
| `tests/unit/bootstrap/support-bootstrap.spec.ts` | Substitui a expectativa histórica de bloqueio por recusa pré-conexão sem opt-in.                                                                |
| `package.json`, `.github/workflows/ci.yml`       | Adicionam `proof:seed:w1:postgres` ao gate `ci / quality`; preservam `seed=ts-node -r reflect-metadata scripts/seed.ts`.                        |

A fixture é persistida diretamente no schema. Não chama endpoints/use cases para criar os registros e não usa Faker, hora atual, `randomUUID()` ou consultas Files. O ID interno é um UUID v4 determinístico por categoria/ordinal sob o esquema versionado no manifest; todas as rows resultantes têm IDs fixos. As tabelas técnicas, inclusive `idempotency_keys`, não são populadas.

# 3. Manifest real e decomposição

| Grupo                      |                     Real | Aprovado |
| -------------------------- | -----------------------: | -------: |
| Departments                | 6 (4 ativos, 2 inativos) |        6 |
| DepartmentAllowedUser      |                        7 |        7 |
| Atores externos sintéticos |                        8 |        8 |
| Tickets                    |                       16 |       16 |
| TicketMessages             |                       44 |       44 |
| TicketMessageMedia         |                        8 |        8 |
| TicketAuditLogs            |                       80 |       80 |

Messages: **16 iniciais + 12 follow-ups requester + 16 admin = 44**; admin visibility **8 públicas/8 internas**. AuditLogs: **16 `criacao_ticket` + 28 `nova_mensagem` + 36 `alteracao_status` = 80**; as 36 mudanças são **12 RF10 requester + 16 RF06 efetivas + 8 RF08 requester**. A inicial não cria `nova_mensagem`; RF11 não cria audit. A validação em memória reconstitui status e timeline de cada Ticket; a prova compara via SQL todos os campos e relações persistidos com o manifest, não apenas as contagens.

# 4. Segurança antes da conexão

`scripts/seed.ts` valida, antes do import dinâmico do DataSource: manifest, `SUPPORT_SEED_CONFIRM=W1_DISPOSABLE`, `NODE_ENV` explícito (`development|test`), `DB_NAME` explícito com prefixo permitido e identidade `support-ms/support`. `development` aceita `support_seed_local_<suffix>`; `test` aceita `support_s1_proof_seed_<suffix>` ou `support_s1_ci_seed_<suffix>`. Depois da conexão, confirma banco real, seis tabelas e sequence. Não executa migrations. Banco sem schema retorna `W1_SCHEMA_NOT_READY`; configuração insegura retorna `SEED_W1_REFUSED`.

| Caso comprovado                        | Conectou?            | Escreveu? | Exit | Marker              |
| -------------------------------------- | -------------------- | --------- | ---: | ------------------- |
| Confirmação ausente, host impossível   | Não                  | Não       |    1 | `SEED_W1_REFUSED`   |
| `NODE_ENV=production`, host impossível | Não                  | Não       |    1 | `SEED_W1_REFUSED`   |
| `DB_NAME=support_ms`, host impossível  | Não                  | Não       |    1 | `SEED_W1_REFUSED`   |
| Row manual em DB de prova              | Sim, somente leitura | Não       |    1 | `SEED_W1_DIVERGENT` |
| W1 parcial                             | Sim, somente leitura | Não       |    1 | `SEED_W1_DIVERGENT` |
| Campo canônico alterado                | Sim, somente leitura | Não       |    1 | `SEED_W1_DIVERGENT` |
| DB vazio com sequence consumida        | Sim, somente leitura | Não       |    1 | `SEED_W1_DIVERGENT` |

Os testes unitários também cobrem confirmação errada, `NODE_ENV` ausente, nome ausente/inseguro e identidade divergente. Nenhuma recusa faz limpeza, reset, upsert ou repair.

# 5. EMPTY → W1

O harness confirmou todas as seis tabelas vazias e `tickets_number_seq(last_value=1,is_called=false)` após migrations no DB próprio. A primeira CLI saiu 0 com `SEED_W1_CREATED`. SQL retornou exatamente 6/7/16/44/8/80; a comparação de todas as rows com o manifest passou. T01–T16 receberam `Ticket.number=1..16` da sequence real, que terminou em `(16,true)`. Em outro DB descartável sem mutar o smoke principal, POST ao processo compilado criou o próximo Ticket com **number 17**. `idempotency_keys` manteve a contagem anterior.

# 6. EXACT_W1 → no-op

A segunda CLI saiu 0 com `ALREADY_SEEDED`. O harness comparou, antes/depois, todas as rows normalizadas, todos os `xmin` das seis tabelas e `(last_value,is_called)` da sequence: **idênticos**. Não houve write nem avanço de número. Divergências por row extra, W1 parcial e campo modificado foram recusadas sem write adicional; não há migration ou seed marker.

Dois processos W1 concorrentes em outro DB novo terminaram com exit 0: **um criou a fixture e o outro retornou `ALREADY_SEEDED`**. O snapshot final continuou exatamente canônico. O lock transacional com `READ COMMITTED` permite ao segundo processo classificar o estado já confirmado pelo primeiro.

# 7. Rollback e sequence

Uma trigger temporária no DB de prova lançou erro durante insert tardio em `ticket_audit_logs`. A CLI falhou; as seis tabelas ficaram com **zero rows** após rollback, enquanto a sequence permaneceu `(16,true)`. Nova execução no mesmo DB foi recusada como `SEED_W1_DIVERGENT`. Um DB novo foi migrado e recebeu W1 com sucesso. O harness removeu todos os bancos que criou antes de emitir `SEED_W1_PROOF_PASS`; falha de limpeza agora faz a prova falhar. Nenhum DB preexistente ou volume persistente foi usado como target da seed.

# 8. HTTP smoke e timezone

O processo **compilado real** leu a massa sem modificá-la: Department list mostrou quatro ativos e três types; requester backoffice-a viu quatro Tickets próprios; admin-a viu seis Tickets autorizados; detalhe de T13 em Department inativo retornou 200. Em T02, requester viu duas mensagens e admin três; requester viu cinco audits, admin seis. O audit `nova_mensagem` admin ficou oculto ao requester e visível ao admin.

| Processo da seed       | Conteúdo/timestamps persistidos                        |
| ---------------------- | ------------------------------------------------------ |
| `TZ=UTC`               | Referência canônica, 6/7/16/44/8/80.                   |
| `TZ=America/Sao_Paulo` | Todas as rows normalizadas idênticas à referência UTC. |

# 9. Testes e gates reais

| Gate                                       |           Exit | Resultado                                                                                                            |
| ------------------------------------------ | -------------: | -------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                             |              0 | ESLint passou.                                                                                                       |
| `npm run build` / `build:check`            |          0 / 0 | TypeScript e entrypoints compilados passaram.                                                                        |
| `npm run openapi:export` / `openapi:check` |          0 / 0 | Artefato OpenAPI sem diff; validação passou.                                                                         |
| `npm run messaging:check`                  |              0 | Mensageria continua desabilitada.                                                                                    |
| `npm run test:unit`                        |              0 | 21 suites, 101 testes.                                                                                               |
| `npm run test:integration`                 | 0 na repetição | 14 suites, 221 testes.                                                                                               |
| `npm run test:contract`                    |              0 | 1 suite, 2 testes.                                                                                                   |
| `npm run test:coverage` / `coverage:check` |          0 / 0 | 36 suites, **324 testes**; statements 97,91%, branches 88,04%, functions 98,93%, lines 98,37%; thresholds aprovados. |
| `npm run format:check`                     |              0 | Prettier passou.                                                                                                     |
| `npm run proof:seed:w1:postgres`           |              0 | `SEED_W1_PROOF_PASS` em PostgreSQL 16 descartável.                                                                   |
| `npm run proof:s1:image`                   |              0 | Imagem de produção e CMD passaram; seed não entrou no runtime image.                                                 |
| `git diff --check`                         |              0 | Sem whitespace inválido.                                                                                             |

Na primeira execução de integração, um teste RF13 existente recebeu 401 onde esperava 400 para requisição sem headers; o mesmo caso passou isolado e a suíte inteira passou na repetição, sem mudança no runtime HTTP. Uma primeira execução do proof W1 também revelou contagem esperada errada **no harness** para T02 (a resolução RF08 adiciona um audit); a expectativa foi corrigida de 4/5 para 5/6, e as execuções seguintes passaram. Esses resultados não são atribuídos a falha da seed.

# 10. Documentação e fronteiras

`ACTUAL_STATE.md`, `AGENTS.md`, `AI_FIRST.md`, `DRIFT_REPORT.md`, `README.md`, índices de docs/reports, `scripts/README.md`, `tests/README.md` e `docs/runbooks/local-development.md` distinguem a implementação local da decisão documental anterior. O runbook exige banco novo descartável, migrations prévias, opt-in e nomes permitidos. Support 0.15 e `luciluci-docs` permaneceram inalterados; não houve Support 0.16, migration, alteração de OpenAPI/API ou deploy. A etapa CI foi configurada, mas **não houve execução remota da CI nesta branch não publicada**.

# 11. Drift, veredito e próximo passo

Nenhum drift funcional novo RF01–RF13 foi identificado. A mudança é tooling operacional local; revisão independente, commit, publicação, CI remota e integração ainda faltam. Estado: **`SEED_W1_IMPLEMENTED_AND_PROVEN_LOCALLY / READY_FOR_INDEPENDENT_REVIEW`**. Próximo passo: abrir lote separado de revisão independente da seed W1; não publicar nesta execução. `SUPPORT_MS_FINAL_CLOSURE_COMPLETE` ainda não se aplica.
