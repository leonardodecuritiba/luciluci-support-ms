# REPORT — Definição aprovada da seed determinística W1

- **status:** `SEED_W1_DEFINITION_READY / SEED_W1_NOT_IMPLEMENTED`
- **generated_by:** Codex
- **generated_at:** 2026-09-28T18:41:22Z
- **review_mode:** decisão operacional documental
- **microservice:** support-ms
- **repository_ref:** `docs/support-seed-w1-checkpoint`, sobre o checkpoint `fdf713fe506acad959ae33b5872ae841d894dbd8`
- **documentation_ref:** Support 0.15, gitlink `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`
- **report_file:** `docs/reports/REPORT-SUPPORT-SEED-W1-DEFINITION-20260928-184122.md`
- **reviewer:** decisão expressa recebida no prompt deste lote

---

# 1. Estado e decisão

`MAIN_BASELINE_RF13=2aacc5554c9c2c4f25415dd8b170f5ff73b6d189`; `SUPPORT_FINAL_DOCUMENTED_MAIN=c417d8f1f7d853e6dd1770a27866132032c2de2b`; RF01–RF13 e 14/14 operações permanecem integradas; nenhum deploy foi feito. O checkpoint bloqueado `fdf713f` continua intacto como fotografia anterior.

**W1-01 foi resolvida expressamente: opção B, fixture canônica determinística do domínio Support completo.** Inclui Department, DepartmentAllowedUser, Ticket, TicketMessage, TicketMessageMedia e TicketAuditLog. O nome original W1 designava a wave de Departments/RF01–RF04. Após o fechamento funcional do serviço, a obrigação operacional remanescente é a seed canônica de desenvolvimento do domínio inteiro. A decisão é posterior ao plano de bootstrap e não altera seu registro histórico.

`SEED_W1_DEFINITION_READY`; `SEED_W1_SCOPE=FULL_DOMAIN`; `SEED_W1_VOLUME=6/16/44/80`; `SEED_W1_NOT_IMPLEMENTED`; `scripts/seed.ts=STILL_BLOCKED`. Nenhuma prova de seed ou prontidão de produção é atribuída a este documento.

# 2. Separação das massas

| Massa                        | Uso                                           |       Departments |             Tickets |     Messages | Autoridade                     |
| ---------------------------- | --------------------------------------------- | ----------------: | ------------------: | -----------: | ------------------------------ |
| W1 canônica                  | `npm run seed` futuro em local/CI descartável |                 6 |                  16 |           44 | Aprovada neste lote            |
| Dataset de waves do TDD 0.15 | Referência funcional/volumétrica independente | aproximadamente 8 | aproximadamente 200 | ao menos 600 | Proposta do TDD, não volume W1 |

A dimensão reduzida da W1 é intencional. A fixture cobre estados relevantes e permanece legível e versionável; não substitui provas volumétricas futuras.

# 3. Manifest aprovado e atores

| Grupo                      | Quantidade exata | Regra                                                                                                                 |
| -------------------------- | ---------------: | --------------------------------------------------------------------------------------------------------------------- |
| Department                 |                6 | Dois por type; quatro ativos e dois inativos.                                                                         |
| DepartmentAllowedUser      |                7 | Membership atual, com sobreposição e sem userId duplicado no mesmo Department.                                        |
| Atores externos sintéticos |                8 | Três admins membros; dois requesters backoffice; dois requesters cd; um outsider sem membership. Não são rows locais. |
| Ticket                     |               16 | Quatro por requester, número 1–16 via sequence.                                                                       |
| TicketMessage              |               44 | 16 iniciais + 12 follow-ups requester + 16 admin.                                                                     |
| TicketMessageMedia         |                8 | Referências opacas sintéticas; posições preservadas.                                                                  |
| TicketAuditLog             |               80 | 16 criação + 28 mensagem + 36 mudança de status.                                                                      |

IDs externos canônicos do futuro manifest: `seed-admin-a`, `seed-admin-b`, `seed-admin-c`, `seed-backoffice-a`, `seed-backoffice-b`, `seed-cd-a`, `seed-cd-b`, `seed-outsider`. São literais fictícios, estáveis, não PII. Para Department, Ticket, TicketMessage e TicketAuditLog, usar UUID **v4 fixos**, explícitos e versionados no manifest; não gerar UUID no momento da execução. Media IDs também são strings sintéticas fixas. O formato completo dos UUIDs, textos e media IDs será materializado no manifest do lote de implementação, sob as cardinalidades e relações congeladas aqui.

# 4. Departments, membership e cenário de acesso

| Department | Type       | Final active | Memberships      | Tickets |
| ---------- | ---------- | ------------ | ---------------- | ------: |
| D01        | todos      | true         | admin-a, admin-b |       3 |
| D02        | todos      | true         | admin-b          |       3 |
| D03        | backoffice | true         | admin-a          |       3 |
| D04        | cd         | true         | admin-c          |       3 |
| D05        | backoffice | false        | admin-b          |       2 |
| D06        | cd         | false        | admin-c          |       2 |

As sete linhas de membership acima preservam admins com acesso a múltiplos Departments. `seed-outsider` não aparece em nenhuma. Nenhum tipo de Department concede autorização por si só. D05/D06 contêm Tickets criados quando ainda estavam ativos; seu estado final inativo decorre de soft delete posterior a todos os eventos dos Tickets. Memberships persistem e permitem leitura administrativa por ACL atual mesmo em Department inativo. Duplicatas em `allowedUserIds` ficam apenas nas provas específicas RF01–RF04.

# 5. Matriz por Ticket e linha do tempo

Em todas as linhas há uma mensagem inicial requester e uma mensagem admin. `F` indica follow-up requester; `RF06` é o número de mudanças efetivas de adminStatus; `R` indica requesterStatus final `resolvido`. Admin message é pública em Tickets ímpares e interna em pares: **8/8**. Admin autor deve ser um dos membros do Department indicado.

| Ticket/number | Dept | Requester/origin | Priority | adminStatus final | F   | RF06 | R   | Justificativa                           |
| ------------- | ---- | ---------------- | -------- | ----------------- | --- | ---: | --- | --------------------------------------- |
| T01/1         | D01  | backoffice-a     | baixa    | cancelado         | sim |    1 | sim | ACL sobreposta, owner resolvido         |
| T02/2         | D01  | backoffice-a     | media    | em_andamento      | sim |    1 | sim | nota interna oculta ao owner            |
| T03/3         | D01  | backoffice-a     | alta     | finalizado        | sim |    1 | não | owner não resolvido                     |
| T04/4         | D02  | backoffice-a     | urgente  | resolvido         | sim |    1 | sim | adminStatus resolvido e owner resolvido |
| T05/5         | D02  | backoffice-b     | baixa    | cancelado         | sim |    1 | sim | segundo owner backoffice                |
| T06/6         | D02  | backoffice-b     | media    | em_andamento      | sim |    1 | não | contraste de visibilidade               |
| T07/7         | D03  | backoffice-b     | alta     | finalizado        | sim |    1 | sim | Department backoffice                   |
| T08/8         | D03  | backoffice-b     | urgente  | resolvido         | sim |    1 | sim | nota interna em Department backoffice   |
| T09/9         | D03  | cd-a             | baixa    | cancelado         | sim |    1 | não | origin cd em Department backoffice      |
| T10/10        | D04  | cd-a             | media    | em_andamento      | sim |    1 | sim | Department cd                           |
| T11/11        | D04  | cd-a             | alta     | finalizado        | sim |    1 | sim | admin/public history                    |
| T12/12        | D04  | cd-a             | urgente  | resolvido         | sim |    1 | não | owner cd não resolvido                  |
| T13/13        | D05  | cd-b             | baixa    | pendente          | não |    2 | não | pendente após duas mudanças efetivas    |
| T14/14        | D05  | cd-b             | media    | pendente          | não |    2 | não | Department inativo com admin membro     |
| T15/15        | D06  | cd-b             | alta     | pendente          | não |    0 | não | pendente desde RF05                     |
| T16/16        | D06  | cd-b             | urgente  | pendente          | não |    0 | não | owner em Department inativo             |

Cada requester possui quatro Tickets. Os 16 Tickets cobrem 8 origins backoffice/8 cd, quatro de cada prioridade, todos os cinco adminStatus finais e ambos requesterStatus. T01–T12 cobrem três ocorrências de cada status admin não pendente; T13–T16 cobrem `pendente`. T01/T02/T04/T05/T07/T08/T10/T11 são os oito requester-resolved.

Timeline lógica por Ticket: criação RF05 (`pendente/nao_resolvido` e mensagem inicial), follow-up RF10 quando indicado, mensagem admin RF10, alterações efetivas RF06 e resolução RF08 quando indicada. Para T13/T14: `pendente → em_andamento → pendente`, duas mudanças RF06 efetivas. Nos demais T01–T12: o follow-up deixa adminStatus `pendente`, mesmo quando já era pendente, e uma mudança RF06 efetiva define o estado final. T15/T16 não recebem mudança RF06. D05/D06 tornam-se inativos somente depois de seus eventos de Ticket. O estado final pode ser persistido diretamente; o runtime não precisa ser reproduzido para gerar a fixture.

# 6. Mensagens, mídia e auditoria

| Messages            | Quantidade | Invariante                                                                         |
| ------------------- | ---------: | ---------------------------------------------------------------------------------- |
| Initial requester   |         16 | Uma por Ticket; `type=ticket.origin`, `authorId=ticket.requesterId`, visible=true. |
| Requester follow-up |         12 | T01–T12; `type=ticket.origin`, owner, visible=true.                                |
| Admin               |         16 | Uma por Ticket, autor membro do Department; 8 visible=true e 8 false.              |
| **Total**           |     **44** | 16 + 12 + 16.                                                                      |

Oito media rows ficam distribuídas em quatro Messages: duas com uma referência e duas com três. Em uma mensagem tripla, posições 0 e 2 repetem o mesmo `mediaId`; a posição 1 difere. As outras 40 Messages têm mídia `[]`. Não há lookup, FK ou asset real em Files.

| Audit action       | Quantidade | Decomposição                                                                           |
| ------------------ | ---------: | -------------------------------------------------------------------------------------- |
| `criacao_ticket`   |         16 | Exatamente uma por Ticket; nenhuma `nova_mensagem` para a mensagem inicial.            |
| `nova_mensagem`    |         28 | 12 follow-ups requester + 16 mensagens admin.                                          |
| `alteracao_status` |         36 | 12 RF10 requester/admin/pendente + 16 RF06 admin efetivo + 8 RF08 requester/resolvido. |
| **Total**          |     **80** | 16 + 28 + 36.                                                                          |

Cada follow-up requester produz `nova_mensagem` e `alteracao_status` com `statusType=admin`, `newStatus=pendente`, mesmo se já estava pendente. As 16 auditorias RF06 representam mudanças efetivas (12 vezes T01–T12 e duas vezes cada T13/T14). As oito RF08 existem somente nos oito Tickets requester-resolved. RF11 apenas define visibilidade persistida e **não** cria audit. Status fields são nulos/ausentes nas ações que não são `alteracao_status`. Na RF13, requester não vê `nova_mensagem` de admin; não se correlaciona heuristicamente com TicketMessage.

# 7. IDs, tempo e sequence

O manifest futuro será artesanal, legível e testável, separado da orquestração de I/O (por exemplo, `scripts/seed/support-w1.fixture.ts`). UUIDs v4 internos, atores, media IDs, textos e timestamps serão literais fixos/versionados. Timestamps explicitamente UTC, com ordem suficiente para listagens e para a timeline acima; não usar `new Date()` como origem dos dados, relógio, timezone local, `randomUUID()` ou faker para fixture W1. `@faker-js/faker` pode atender massa volumétrica independente.

Em target W1 vazio e recém-migrado, inserir Tickets na ordem T01–T16 usando a **sequence real**, produzindo `Ticket.number=1..16`; o próximo Ticket criado pela API recebe 17. Não inserir números arbitrários nem reparar sequence após falha. Uma reexecução exata preserva o estado físico da sequence.

# 8. Safety gates e política destrutiva

Ambientes permitidos: `LOCAL_DISPOSABLE` e `CI_DISPOSABLE`, sempre com `NODE_ENV=development|test`. Production, homologação/staging compartilhada, DB de desenvolvimento compartilhado e DB preexistente com dados do desenvolvedor são proibidos. `NODE_ENV` sozinho nunca autoriza.

Antes de qualquer write, exigir conjuntamente:

1. `SUPPORT_SEED_CONFIRM=W1_DISPOSABLE` exato;
2. `NODE_ENV=development|test`;
3. nome explícito `support_seed_local_<suffix>` para local, `support_s1_proof_seed_<suffix>` para prova local ou `support_s1_ci_seed_<suffix>` para CI, ou prefixo equivalente documentado e inequívoco de seed descartável; recusar `support_ms`, `support_ms_test`, `postgres`, `template0`, `template1` e nome sem prefixo aprovado;
4. `serviceSlug=support-ms` e `domainSlug=support` do `service-identity.json`;
5. inspeção das seis tabelas de domínio e do estado da Ticket sequence, classificando `EMPTY`, `EXACT_W1` ou `DIVERGENT`.

O CLI atual usa `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`, não `DATABASE_URL`. A implementação futura deve conferir o nome **real** de `current_database()`, migrations e contexto descartável/ownership antes de escrever; prefixo e localhost isolados não provam ausência de risco. Classificação e inserts devem ser protegidos contra execução concorrente no mesmo target. `EMPTY` exige seis tabelas vazias e sequence em estado inicial; `EXACT_W1` retorna no-op; `DIVERGENT` falha sem write. `EXACT_W1` exige counts, conjunto exato de IDs, todos os campos/relations, ausência de rows extras e sequence no estado pós-16 (`last_value=16`, `is_called=true`), sem marker/migration novos. Não executar `TRUNCATE`, `DELETE` de dados existentes, limpeza de rows desconhecidas ou upsert/reparo silencioso.

# 9. Reexecução, transação e falha

| Estado      | Resultado                                                                          |
| ----------- | ---------------------------------------------------------------------------------- |
| `EMPTY`     | Executar fixture em uma transação; sucesso.                                        |
| `EXACT_W1`  | Exit 0, `ALREADY_SEEDED`, sem write nem avanço de sequence.                        |
| `DIVERGENT` | Falhar antes de write, inclusive para massa parcial, IDs extras ou campo alterado. |

Todas as rows de Department, membership, Ticket, Message, Media e AuditLog entram em **uma transação PostgreSQL**. Falha de row write reverte rows. A sequence PostgreSQL pode avançar apesar do rollback; se a falha consumir seus valores, o único caminho é descartar/recriar o DB descartável, aplicar migrations e executar de novo. Não reutilizar target parcialmente falho.

# 10. Plano de prova do lote posterior

| Camada            | Critérios de prova                                                                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit              | Manifest e matriz por Ticket, cardinalidades, UUID/timestamps fixos, parser de gates, `EMPTY/EXACT_W1/DIVERGENT`, sequence esperada.                                                                             |
| PostgreSQL        | Harness cria DB próprio ausente `support_s1_proof_seed_<suffix>` (CI: `support_s1_ci_seed_<suffix>`), migra, executa, confere 6 tabelas, FKs, ACL, mensagens, 80 audits e próximo número 17; descarta só seu DB. |
| Rerun/divergência | Segunda execução sem alteração física de rows/sequence; inserir row extra ou alterar campo esperado e comprovar recusa sem write.                                                                                |
| Rollback          | Falha induzida antes do commit; rows revertidas, sequence observada e DB descartado/recriado.                                                                                                                    |
| Safety            | Recusar confirmação ausente/errada, production, nome inseguro, DB manual não vazio, W1 parcial e IDs iguais com campo divergente.                                                                                |
| HTTP smoke        | Listagens Department/Ticket, Ticket por ID, Messages e History sob admin, owner e outsider, incluindo visibilidade; sem necessidade de mutar a fixture no smoke principal.                                       |

O proof futuro deve ser dedicado (por exemplo, `scripts/prove-seed-w1-postgres.js`). Não usar DB preexistente nem volume persistente. As fixtures já usadas nas RFs permanecem independentes da seed manual.

# 11. Documentação e limites deste lote

Este fechamento cria um novo commit documental sobre `fdf713f`; o checkpoint anterior continua histórico. `luciluci-docs` não foi editado, Support 0.15 não foi avançado e Support 0.16 não foi criado. A definição da seed é operacional e não reabre RF01–RF13. `scripts/seed.ts` ainda lança erro antes de conectar; `npm run seed` não foi executado. A pendência local passa a ser **implementar e provar a W1 aprovada**, em lote explícito posterior. Não declarar `SUPPORT_MS_FINAL_CLOSURE_COMPLETE` enquanto isso não ocorrer.

# 12. Evidência documental deste lote

`git diff --check` e `npm run format:check` passaram. `git submodule status` confirmou o gitlink `14efcdfdc70d774c4343e2ec47662b7b5c8b691b` sem modificação. A matriz T01–T16 foi conferida por leitura programática: 16 Tickets, quatro por requester, quatro por prioridade, três de cada status admin não pendente, quatro pendentes, 12 follow-ups, 16 mudanças RF06 e oito resoluções. Essa checagem valida a aritmética da especificação; não é prova da seed nem teste PostgreSQL.
