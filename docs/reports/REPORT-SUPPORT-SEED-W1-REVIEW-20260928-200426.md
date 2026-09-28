# REPORT — Revisão separada e remediação local da seed W1

- **status:** `SEED_W1_REVIEW_PASS / READY_FOR_PUBLICATION`
- **generated_by:** Codex
- **generated_at:** 2026-09-28T20:04:26Z
- **review_mode:** revisão adversarial em lote separado da implementação, com remediação local; não é parecer de terceiro humano
- **microservice:** support-ms
- **repository_ref:** `feat/support-seed-w1`, HEAD documental `4115ab59feae1a7f428bac76353f8fd0bd40f96c`, diff funcional sem commit
- **documentation_ref:** Support 0.15, gitlink `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`
- **report_file:** `docs/reports/REPORT-SUPPORT-SEED-W1-REVIEW-20260928-200426.md`
- **reviewer:** Codex, revisão em lote separado
- **implementation_evidence:** [report original](REPORT-SUPPORT-SEED-W1-20260928-193318.md), preservado sem edição

## 1. Estado de entrada e método

`main=origin/main=c417d8f1f7d853e6dd1770a27866132032c2de2b`; checkpoint aprovado `4115ab5`; branch `feat/support-seed-w1` com HEAD ainda em `4115ab5`. O checkout já continha alterações W1 não commitadas. Revisei código, grafo de imports, diff incluindo novos arquivos, definição T01–T16, CI, runbook e proof; tentei falsificar as garantias de segurança, sem tratar o report original como prova suficiente. Um checkout principal e cinco worktrees históricos foram inventariados; nenhum worktree histórico foi modificado.

## 2. Findings e remediação

| ID     | Severidade | Área         | Finding independente                                                                                                                  | Status                                                                                                                                                    |
| ------ | ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| W1-R01 | HIGH       | Pré-conexão  | Nome seguro em host remoto ainda podia conectar e escrever.                                                                           | Fechado: `DB_HOST` explícito `127.0.0.1` ou `::1`; teste de host remoto antes da conexão; runbook ajustado.                                               |
| W1-R02 | HIGH       | Concorrência | Advisory lock serializava seeds, mas não um writer SQL/API externo entre classificação e insert.                                      | Fechado: locks `SHARE ROW EXCLUSIVE` nas seis tabelas na transação, antes da classificação; prova com INSERT manual não confirmado e seed bloqueada.      |
| W1-R03 | MEDIUM     | Schema/SQL   | Lock em tabela não migrada emitia erro genérico; SQL sem `public` poderia seguir `search_path` alterado.                              | Fechado: readiness antes de lock, nomes qualificados e no-op provado com `PGOPTIONS=-csearch_path=pg_catalog`.                                            |
| W1-R04 | MEDIUM     | Manifest     | Contagens permitiam, em tese, duplicar `nova_mensagem` de uma Message e omitir outra; ordem de eventos precisava ser explícita.       | Fechado: IDs de Messages auditadas únicos e regras de ordem RF10→admin→RF06→RF08.                                                                         |
| W1-R05 | LOW        | Proof/testes | Concorrência original dependia de timing favorável; host/schema, tabela técnica com row e mutações de counts não tinham prova direta. | Fechado: barreira adversarial com dois processos, prova de writer externo, schema ausente, row técnica preservada e testes de mutação das seis contagens. |

Nenhum finding aberto CRITICAL/HIGH/MEDIUM/LOW ou drift funcional RF01–RF13 permaneceu após revalidação.

## 3. Pré-conexão

`scripts/seed.ts` importa estaticamente apenas fixture, validator, safety e helpers de SQL puros. O DataSource é importado dinamicamente após validação de manifest, identidade, confirmação, ambiente, DB_NAME e DB_HOST. Os helpers não inicializam banco nem carregam `env.ts`; o DataSource importa `env.ts` somente depois dos gates. Erro de identidade ausente/malformada vira `SEED_W1_REFUSED`; saída da CLI oculta valores iguais a `DB_PASSWORD`/`DATABASE_URL` se aparecerem em exception.

| Caso                                 | DataSource carregado? | Conectou? | Escreveu? | Marker                |
| ------------------------------------ | --------------------- | --------- | --------- | --------------------- |
| Confirmação ausente                  | Não                   | Não       | Não       | `SEED_W1_REFUSED`     |
| `NODE_ENV` ausente/vazio             | Não                   | Não       | Não       | `SEED_W1_REFUSED`     |
| `NODE_ENV=production`                | Não                   | Não       | Não       | `SEED_W1_REFUSED`     |
| `DB_NAME` ausente/vazio              | Não                   | Não       | Não       | `SEED_W1_REFUSED`     |
| `DB_NAME=support_ms`                 | Não                   | Não       | Não       | `SEED_W1_REFUSED`     |
| Host remoto/sentinel com nome seguro | Não                   | Não       | Não       | `SEED_W1_REFUSED`     |
| Identidade divergente                | Não, prova unitária   | Não       | Não       | `SEED_W1_REFUSED`     |
| Schema sem migrations                | Sim                   | Sim       | Não       | `W1_SCHEMA_NOT_READY` |

Nos processos de recusa foi usado host deliberadamente inacessível; não apareceu erro DNS/conexão. A política de loopback impede endereço remoto direto. Um proxy/túnel local que encaminhe `127.0.0.1` a serviço remoto não pode ser identificado apenas pela configuração PostgreSQL; o runbook exige instância isolada e banco novo sob controle do operador. Esta limitação não transforma W1 em seed de staging ou produção.

## 4. Fixture e semântica

Manifest validado: **6 Departments / 7 memberships / 8 atores / 16 Tickets / 44 Messages / 8 Media / 80 AuditLogs**. Decomposição: Messages `16+12+16`; visibilidade admin `8/8`; auditorias `16+28+36`, status `12 RF10 + 16 RF06 + 8 RF08`. IDs internos são UUIDv4 determinísticos/versionados por categoria e ordinal, sem relógio ou randomização. A matriz aprovada T01–T16 foi conferida contra cenário, Department, requester, priority, status final e timeline; as 16 mensagens admin pertencem a membros atuais do Department, inclusive nos dois inativos.

O validator agora rejeita auditoria de Message duplicada, RF10 ausente/duplicada ou fora da ordem, RF06 antes da Message admin e RF08 antes da conclusão RF06; status final e `Ticket.updated_at` continuam derivados da timeline. Testes de mutação removem uma row de cada uma das seis tabelas e alteram UUID, membership, visibilidade requester, admin sem membership, posição de mídia, breakdown de audit e `updated_at`; todos falham antes de I/O.

## 5. Classificador, no-op e sequência

`EMPTY` exige seis tabelas vazias e sequence `(1,false)`. `EXACT_W1` compara todas as rows e campos normalizados em ordem independente e sequence `(16,true)`. Row extra, subset W1, campo alterado ou sequence divergente produzem `SEED_W1_DIVERGENT`, sem limpeza ou repair. No rerun exato, todas as rows, todos os `xmin` (inclusive chaves compostas) e a sequence permaneceram idênticos. Uma row em `idempotency_keys` foi preservada, inclusive `xmin`, e não interfere no classificador. O processo com `search_path=pg_catalog` retornou `ALREADY_SEEDED` sem alterações.

Tickets T01–T16 usam `RETURNING number` individual na ordem da fixture, sem fornecer `number`; a sequence real terminou em `(16,true)`. A API compilada criou Ticket #17 em banco separado já sem exigência de `EXACT_W1` após a mutação.

## 6. Concorrência e rollback

Um lock advisory transacional coordena seeds W1; locks de tabela bloqueiam escritores comuns durante classificação e escrita. `READ COMMITTED` faz a segunda seed enxergar o commit da primeira. Na prova adversarial, uma conexão segurou o advisory lock enquanto **dois processos** chegaram à espera por lock; ao liberar, um retornou `SEED_W1_CREATED`, o outro `ALREADY_SEEDED`, ambos exit 0, com estado final exato. Em outra base, uma row manual não confirmada bloqueou a seed no lock de tabela; após commit manual, a seed classificou `DIVERGENT` sem escrever.

Uma trigger temporária falhou em `ticket_audit_logs` depois dos 16 Tickets: rollback deixou seis tabelas com zero rows, sequence `(16,true)` e rerun `DIVERGENT`. Banco novo migrado recebeu W1 normalmente. A sequence PostgreSQL não aceita `LOCK TABLE`; uma chamada externa direta a `nextval` fora do fluxo Ticket ainda pode avançá-la. A seed verifica a sequence e recusa ou falha sem reset; o runbook manda recriar o banco descartável. Os locks não prometem impedir mutação **após** o commit da seed.

## 7. Fusos e HTTP

| TZ do processo de proof | Proof completa       | Timestamps persistidos       | Classificador    |
| ----------------------- | -------------------- | ---------------------------- | ---------------- |
| `UTC`                   | `SEED_W1_PROOF_PASS` | Referência UTC               | `EXACT_W1`/no-op |
| `America/Sao_Paulo`     | `SEED_W1_PROOF_PASS` | Iguais aos da referência UTC | `EXACT_W1`/no-op |

O smoke HTTP usa IDs exportados da própria fixture. Departments ativos=4, Tickets requester-a=4, Tickets admin-a=6; detalhe histórico T13=200. T02: requester vê 2 Messages/5 audits, admin vê 3 Messages/6 audits; `nova_mensagem` admin oculta ao requester, sua própria auditoria visível. T01 prova mensagem admin pública visível ao requester. O Ticket #17 é criado em DB de prova separado.

## 8. Gates e limites

| Gate                                            | Exit | Evidência final                                                                               |
| ----------------------------------------------- | ---: | --------------------------------------------------------------------------------------------- |
| `npm run lint`, `build`, `build:check`          |    0 | Sem erro                                                                                      |
| `openapi:export`, `openapi:check`, diff OpenAPI |    0 | Artefato inalterado                                                                           |
| `messaging:check`                               |    0 | Mensageria desabilitada                                                                       |
| `test:unit`                                     |    0 | 21 suites, **117 testes**                                                                     |
| `test:integration`                              |    0 | 14 suites, 221 testes                                                                         |
| `test:contract`                                 |    0 | 1 suite, 2 testes                                                                             |
| `test:coverage`, `coverage:check`               |    0 | 36 suites, **340 testes**; 97,91% statements, 88,04% branches, 98,93% functions, 98,37% lines |
| `format:check`, `git diff --check`              |    0 | Sem diff de formato/whitespace                                                                |
| `proof:seed:w1:postgres` UTC e São Paulo        |  0/0 | `SEED_W1_PROOF_PASS`; banco próprio removido antes do marker                                  |
| `proof:s1:image`                                |    0 | Imagem e CMD com RF05–RF13 passaram; artefatos próprios removidos                             |

Falhas durante a remediação foram informativas: primeiro, schema ausente retornou erro genérico porque a nova tentativa de lock vinha antes do readiness; segundo, PostgreSQL recusou `LOCK TABLE` na sequence; terceiro, o observador da corrida usava a conexão em transação e não via a sessão concorrente. Os três pontos foram corrigidos e a prova completa passou em ambos os fusos. CI remota não rodou porque a branch segue local.

Na checagem final, uma execução de coverage sob sandbox falhou por `listen EPERM: operation not permitted 0.0.0.0` em testes HTTP; a reexecução com permissão de bind local passou com 36 suites/340 testes. O `format:check` também apontou o arquivo SQL recém-editado; após Prettier, passou. Nenhuma dessas falhas exigiu mudança no runtime RF.

## 9. Diff, fronteiras e veredito

Alterações do lote de revisão: `scripts/seed.ts`, `scripts/seed/support-w1.safety.ts`, `scripts/seed/support-w1.database.ts`, `scripts/seed/support-w1.validate.ts`, `scripts/prove-seed-w1-postgres.js`, `tests/unit/scripts/support-w1-seed.spec.ts`, runbook e este report/índices de estado. O diff funcional W1 total continua sem commit. Nenhuma migration nova, runtime RF, Dockerfile, CD, Support 0.16 ou documentação canônica no submódulo foi alterada. Gitlink segue `14efcdf` e `main=origin/main=c417d8f`.

**Veredito: `SEED_W1_REVIEW_PASS / READY_FOR_PUBLICATION`.** O próximo lote pode preparar commit, push, PR e CI remota; nada foi publicado, integrado ou implantado nesta revisão. `SUPPORT_MS_FINAL_CLOSURE_COMPLETE` continua inaplicável até integração e evidência de publicação.
