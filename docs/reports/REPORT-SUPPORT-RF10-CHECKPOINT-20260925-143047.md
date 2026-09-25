# REPORT — Checkpoint contratual RF10 do support-ms

- **status:** `RF10_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION / NOT_IMPLEMENTED`
- **generated_by:** Codex
- **generated_at:** 2026-09-25T14:30:47Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf10-create-message-checkpoint`, criada de `MAIN_BASELINE_RF09` `393af3ed50c35fb541825c1822cecaa3b8005a29`
- **documentation_ref:** `luciluci-docs/support/{README,prd,notes,tdd,tp}.md`, Support 0.11 `a198b46c62d4b5cd1a4aa0ced8eb171b2e6ef3b2`; fonte original `luciluci-docs/support/sources/prd-original.md`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF10-CHECKPOINT-20260925-143047.md`
- **reviewer:** não informado

---

# 1. Resumo executivo

- A [PR #9](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/9) foi integrada por merge commit `393af3ed50c35fb541825c1822cecaa3b8005a29`. O head `93fd4832f7275691973b547443144b8246194fa7` passou no check remoto `quality`, run `36145983860`; a PR não tinha reviews nem review threads. `main` local e `origin/main` coincidiram no merge, estabelecendo `MAIN_BASELINE_RF09`.
- Há 14 operações do PRD, contando RF07a/RF07b separadamente. RF01–RF09 (dez operações) estão implementadas e provadas; RF10–RF13 (quatro) não possuem runtime. A superfície operacional não conta como RF.
- O PRD original define a rota RF10, o exemplo de body com `message`, `type`, `authorId`, `mediaIds` e `isVisibleToRequester`, ACL geral de Ticket, reset de `adminStatus` para `pendente` em mensagem `backoffice|cd` e uma ou duas auditorias conforme o papel.
- Identidade coerente com headers, visibilidade, response, `updatedAt`, idempotência e detalhes de concorrência não estão fechados para RF10. Não congelar Support 0.12 nem criar branch funcional antes de decisão expressa por recorte.

# 2. Escopo e fontes analisadas

| Tema                    | Fonte                                                             | Definição real                                                                                                                                                                                                                              |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Endpoint e body         | `support/sources/prd-original.md` RF10; `support/prd.md` RF10     | `POST /api/support/tickets/{ticketId}/messages`; exemplo inclui `message`, `type`, `authorId`, `mediaIds: []`, `isVisibleToRequester: true`. A entidade exige `message`, `type`, `authorId`, `isVisibleToRequester`; `mediaIds` é opcional. |
| Atores e ACL            | PRD original §4, P1/P6/P7/P8; PRD §5.2                            | `admin` precisa de membership no Department do Ticket; `backoffice                                                                                                                                                                          | cd`precisam de ownership. Department inativo não inutiliza Ticket histórico. A escolha`403`versus`404` e headers concretos requerem fechamento RF10.                                                                        |
| Status e auditoria      | PRD original RF10/P3/tabela transversal; PRD §§6, 8 e 9.2         | Mensagem `admin`: `nova_mensagem`; mensagem `backoffice                                                                                                                                                                                     | cd`: `adminStatus=pendente`e`nova_mensagem`+`alteracao_status`com`statusType=admin`, `newStatus=pendente`, inclusive quando o status já era pendente na baseline literal. `requesterStatus` não é reaberto automaticamente. |
| Visibilidade            | Entidade Message do PRD; `support/notes.md` DEC-SUP-04            | Boolean obrigatório na entidade; RF05 decidiu `true` somente para mensagem inicial. Política por papel em RF10 continua aberta.                                                                                                             |
| Media                   | Entidade Message; `support/notes.md` DEC-SUP-09 e fechamento RF05 | `mediaIds` é opcional e referencia IDs externos; normalização para `[]`, ordem e duplicatas foram fechadas apenas para RF05.                                                                                                                |
| Desenho e casos         | `support/tdd.md` RF10/§§2.4,4.4; `support/tp.md` TC-SUP-RF10      | TDD propõe transação única e explicita cardinalidade de audits; TP planeja casos por status, adulteração de autor/tipo e rollback. Nenhum teste RF10 foi executado.                                                                         |
| Precedentes comprovados | `src/features/ticket/`, OpenAPI, `api.http`, reports RF05–RF09    | Headers, UUID v4 interno, locks e envelopes de erro existem por RF anterior; decisões são limitadas ao respectivo recorte.                                                                                                                  |

O submódulo permanece no gitlink Support 0.11 `a198b46`; a fonte original está intacta. Este checkpoint não altera `luciluci-docs`.

**Evidência remota:** workflow `.github/workflows/ci.yml`, `ci / quality`, `pull_request #9`, run [36145983860](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36145983860), head `93fd4832f7275691973b547443144b8246194fa7`, conclusão `success`. Não há run RF10; a CI citada prova a RF09 integrada.

# 3. Matriz principal RF x implementação

| RF          | Contrato                                  | Estado em `MAIN_BASELINE_RF09` | Evidência                                                                                  |
| ----------- | ----------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------ |
| RF01–RF04   | Department                                | Implementado                   | Rotas, testes e provas PostgreSQL históricas; reports por RF                               |
| RF05        | Criar Ticket                              | Implementado                   | Ticket, mensagem inicial e auditoria; report RF05                                          |
| RF06        | Editar Ticket                             | Implementado                   | PATCH, ACL, locks e auditoria; report RF06                                                 |
| RF07a/RF07b | Cinco listagens incluem as duas de Ticket | Implementado                   | Listagens requester/admin; report RF07                                                     |
| RF08        | Resolver Ticket                           | Implementado                   | POST resolve; report RF08 e PR #8                                                          |
| RF09        | GET Ticket por ID                         | Implementado                   | `get-ticket.use-case.ts`, unit/integration, OpenAPI, prova PostgreSQL; report RF09 e PR #9 |
| RF10        | Criar mensagem                            | Não encontrado                 | PRD/TDD/TP planejam; rota, OpenAPI e teste RF10 ausentes                                   |
| RF11–RF13   | Visibilidade, mensagens e histórico       | Não encontrado                 | Planejados no PRD; fora do recorte                                                         |

# 4. Checklist consolidado por PRD

- [x] RF09 integrada sem alterar o contrato Support 0.11; `main` contém o head da PR #9.
- [x] RF10 preserva os cinco campos do exemplo original e a regra literal de duas auditorias `backoffice|cd`, inclusive com `adminStatus` já pendente.
- [x] `adminStatus` é afetado pela mensagem de solicitante; `requesterStatus` continua independente.
- [!] O exemplo de body e a identidade confiável do BFF não definem se `type`/`authorId` são aceitos com validação de igualdade ou derivados exclusivamente dos headers.
- [!] Visibilidade por ator, shape de resposta, `updatedAt`, retries e validação fina de body não têm decisão RF10.

# 5. Checklist consolidado por TDD

- [x] O desenho requer coerência autor/tipo e propõe mensagem, mídia, alterações de Ticket e auditorias em uma transação.
- [x] O TDD preserva duas auditorias para `backoffice|cd` e uma para `admin`, sem alterar `requesterStatus`.
- [!] Lock Ticket, leitura de membership e ordem de locks sob concorrência com RF02/RF04/RF06/RF08 precisam ser fechados para RF10; precedentes não são freeze automático.
- [ ] Route/controller/DTO, OpenAPI executável, `api.http`, migration ou wiring RF10: nenhum criado neste checkpoint.

# 6. Checklist consolidado por TP

| RF        | Unit                                            | Integration                                   | Functional/contract                                            | Estado                               |
| --------- | ----------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------- | ------------------------------------ |
| RF01–RF08 | Suítes históricas                               | Suítes históricas                             | Provas PostgreSQL RF01–RF08 nos reports anteriores             | Provadas antes deste checkpoint      |
| RF09      | `tests/unit/ticket/get-ticket.use-case.spec.ts` | `tests/integration/ticket/get-ticket.spec.ts` | `scripts/prove-rf09-postgres.js`, OpenAPI e smoke; CI da PR #9 | Provada e integrada                  |
| RF10      | TC-SUP-RF10 planejado                           | TP planejado                                  | Nenhuma prova executada                                        | `NOT_IMPLEMENTED / PENDING_DECISION` |
| RF11–RF13 | TP planejado                                    | TP planejado                                  | Nenhuma prova neste lote                                       | Fora do recorte                      |

Nenhum teste funcional RF10 é atribuído ao checkpoint documental. A prova de RF09 não comprova RF10.

# 7. Inventário de endpoints reais e decisões RF10

`src/features/ticket/adapters/routes/ticket.routes.ts` contém RF05–RF09; `POST /:ticketId/messages` ainda retorna 404. Operacionais `/health`, `/metrics` e `/api-docs*` não são RFs.

| Tema                | Definição/decisão para RF10                                                                                                                                                                               | Status                                                                                | Natureza                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------- |
| Atores e ACL        | Três roles do PRD; admin por membership atual, backoffice/cd por ownership; `Department.type` não autoriza.                                                                                               | Fonte, detalhe de negação aberto                                                      | PRD §4/P6/P8; DEC-SUP-01                        |
| Headers             | Família `X-Correlation-ID`, `X-Performed-By`, `X-Performed-By-Type` é precedente; obrigatoriedade e erro RF10 ainda por aprovar.                                                                          | `OPEN_FOR_RF10`                                                                       | DEC-SUP-01                                      |
| `ticketId`          | ID interno de Ticket já é UUID v4; inválido/inexistente tendem a `422`/`404`, sem decisão RF10 expressa.                                                                                                  | `OPEN_FOR_RF10` no HTTP                                                               | DEC-SUP-09/08                                   |
| Request             | Original exemplifica cinco campos; `message`, `type`, `authorId`, `isVisibleToRequester` obrigatórios na entidade, `mediaIds` opcional. Empty/whitespace, limites, campos extras e queries não definidos. | `OPEN_FOR_RF10`                                                                       | Fonte + DEC-SUP-08                              |
| `type` e `authorId` | Body original os fornece; TDD manda validar coerência com identidade. Derivar de headers ou aceitar iguais aos headers precisa de escolha explícita.                                                      | `OPEN_FOR_RF10`                                                                       | DEC-SUP-01                                      |
| `mediaIds`          | Campo opcional; IDs externos opacos. Default/ordem/duplicatas de RF05 não se estendem automaticamente.                                                                                                    | `OPEN_FOR_RF10`                                                                       | DEC-SUP-09/04                                   |
| Visibilidade        | `isVisibleToRequester` obrigatório na entidade e presente no exemplo; permissão para `false` por role e default/omissão não definidos.                                                                    | `OPEN_FOR_RF10`                                                                       | DEC-SUP-04                                      |
| `adminStatus`       | Mensagem `backoffice                                                                                                                                                                                      | cd`define`pendente`; admin não aciona reset automático. `requesterStatus` preservado. | Regra funcional fixa; write/timestamp pendentes | PRD RF10/P3; DEC-SUP-06/08 |
| Audits              | Admin: uma `nova_mensagem`. Backoffice/cd: `nova_mensagem` + `alteracao_status`, mesmo se já pendente; statusType/admin e newStatus/pendente. Autoria/origem precisam coerência com identidade fechada.   | Cardinalidade fixa; campos de autoria abertos                                         | PRD P3/tabela; DEC-SUP-01/08                    |
| `updatedAt`         | Fonte não define se nova mensagem renova Ticket.updatedAt, inclusive admin e status já pendente. Message.createdAt é gerado pelo micro.                                                                   | `OPEN_FOR_RF10`                                                                       | TDD §4.4; DEC-SUP-08                            |
| Response/Location   | Nenhum status, shape ou Location RF10 definido na fonte.                                                                                                                                                  | `OPEN_FOR_RF10`                                                                       | DEC-SUP-08                                      |
| Idempotência        | Fonte não exige chave; retry, deduplicação e eventual `409` não definidos. POST efetivo cria mensagem e audits; no-op de RF06 não se aplica.                                                              | `OPEN_FOR_RF10`                                                                       | DEC-SUP-10/06                                   |
| Atomicidade         | TDD descreve transação única para mensagem, mídia, Ticket e auditorias; rollback integral é expectativa de consistência.                                                                                  | Desenho documentado; freeze técnico pendente                                          | TDD §§2.4/RF10; DEC-SUP-12                      |
| Locks/concorrência  | Serializar RF10×RF10, RF10×RF06 e RF10×RF08 sem perder updates ou auditar além da cardinalidade; ordem Ticket→Department já existe em RF06. Ponto de revalidação de ACL e timestamps ainda pendente.      | `OPEN_FOR_RF10`                                                                       | TDD §4.4; DEC-SUP-12                            |
| Department inativo  | P1 mantém Ticket histórico funcional; admin ainda depende de membership atual.                                                                                                                            | Fonte; detalhe concorrente aberto                                                     | PRD P1/§4                                       |
| Erros               | `400/403/404/422/500` são matriz candidata de precedentes; sem `401` local se AuthN fica no BFF. Nenhum `409` sem decisão de idempotência.                                                                | `OPEN_FOR_RF10`                                                                       | DEC-SUP-01/08/09/10                             |
| Eventos             | Nenhum evento Support foi especificado; não criar outbox/AsyncAPI por analogia.                                                                                                                           | `NOT_APPLICABLE_RF10`                                                                 | PRD + DEC-SUP-11                                |

# 8. Fronteira NFR e capacidades transversais

| Capacidade                                                | Classificação                | Limite                                                                  |
| --------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------- |
| Correlação, PostgreSQL, erro e OpenAPI das RFs existentes | Implementado localmente      | RF10 exigirá contrato e prova próprios após decisão                     |
| AuthN e RBAC amplo                                        | Upstream/plataforma          | BFF fornece identidade; Support aplica ACL fina de Ticket               |
| Observabilidade distribuída                               | Compartilhado                | Sem obrigação adicional RF10 especificada                               |
| Eventos, outbox, DLQ/redrive e Schema Registry            | Fora do escopo desta release | Nenhum evento Support aprovado                                          |
| Seed W1                                                   | Gap real local prévio        | Massa sintética determinística ainda não aprovada; independente de RF10 |

# 9. Cobertura de testes e validação

RF09: `gh pr checks 9` mostrou `quality pass`; PR mergeada sem reviews/threads; `git merge-base --is-ancestor origin/feat/support-rf09-get-ticket origin/main` retornou 0; `HEAD == origin/main == 393af3e` após fast-forward. O report RF09 registra 239 testes em 27 suítes e provas locais PostgreSQL/imagem; este checkpoint não repetiu testes de runtime.

RF10: nenhum teste, build funcional, migration, prova PostgreSQL, smoke ou UAT executado. `git diff --check` e `git -C luciluci-docs diff --check` passaram. O primeiro `npm run format:check` não executou por ausência de `node_modules`; `npm ci` instalou as dependências (o hook Husky informou falta de permissão para `.git/config`, sem falhar o install). O primeiro check após instalar apontou apenas este report; depois de formatá-lo, `npm run format:check` passou. `git show --check HEAD` será registrado após o commit documental.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF10–RF13 constam no PRD, mas ainda não têm runtime. Isso é estado esperado do lote, não regressão de RF01–RF09. `src/README.md` ainda descreve RF09 como branch funcional fora de `main`; a lista fechada de arquivos documentais deste checkpoint não inclui esse README. `ACTUAL_STATE.md` e o report atual registram a baseline correta; alinhar esse README em lote documental posterior.

## 10.2 Código existe, documentação não comprova

Nenhum código RF10 foi criado. Precedentes de RF05–RF09 não aprovam opções RF10 por analogia.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

O estado desta branch declara RF10 `NOT_IMPLEMENTED`, coerente com rotas, OpenAPI e testes. Referências históricas em reports anteriores continuam fotografias da época.

## 10.4 PRD / TDD / TP divergem entre si

O PRD original mostra `type` e `authorId` no body, enquanto o TDD exige coerência com a identidade do caller sem decidir como validar ou derivar. Não substituir esses campos silenciosamente. O TDD sugere atomicidade; a fonte funcional não define detalhes de lock, response ou timestamp.

## 10.5 Ambiguidades que impedem conclusão segura

Fechar DEC-SUP-01 (headers, autoria/tipo), DEC-SUP-04 (visibilidade e mídia), DEC-SUP-08 (body, response, erros, timestamps), DEC-SUP-09 (IDs externos/mídia no recorte), DEC-SUP-10 (idempotência) e DEC-SUP-12 (locking/concorrência). DEC-SUP-06 participa da semântica de nova mensagem sem aplicar o no-op de RF06. O tamanho dessas lacunas impede Support 0.12 neste checkpoint.

# 11. Conclusão

`RF10_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`. O serviço tem `MAIN_BASELINE_RF09` em `393af3ed50c35fb541825c1822cecaa3b8005a29`; o gitlink segue em Support 0.11 `a198b46c62d4b5cd1a4aa0ced8eb171b2e6ef3b2`. Não há branch canônica RF10, commit Support 0.12, freeze RF10, rota funcional, deploy ou branch `feat/support-rf10-create-message`.

Próximo passo único: resolver expressamente as lacunas RF10 listadas na seção 10.5; somente depois registrar o contrato em `luciluci-docs` e abrir lote separado de implementação.
