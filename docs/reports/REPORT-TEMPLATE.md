> [!IMPORTANT]
> Este arquivo é um **template de report de avaliação de completude** para qualquer microserviço derivado do ecossistema.
> Ele deve ser usado como artefato humano de revisão rápida, normalmente gerado por IA **em ondas**, sob supervisão de outro desenvolvedor.
> **Não é fonte de verdade.** A precedência continua sendo: `luciluci-docs/` -> código executável -> contratos/versionamentos locais -> report.
> `workflow` versionado no repositório **não é prova suficiente** de CI/CD saudável; o report deve registrar evidência remota real do GitHub Actions quando houver, ou declarar explicitamente sua ausência.
> NFR documentado globalmente **não é gap local automático**; classifique sempre a fronteira serviço vs plataforma antes de concluir ausência.
> Mantenha **todas as seções** deste template, mesmo quando uma seção estiver vazia ou inconclusiva.

# REPORT - Avaliação de completude do microserviço

**status:** Draft  
**generated_by:** `<modelo/IA + operador humano>`  
**generated_at:** `<YYYY-MM-DDTHH:mm:ssZ>`  
**review_mode:** `<wave-1 | wave-2 | wave-3 | final>`  
**microservice:** `<ex.: products-ms>`  
**repository_ref:** `<branch / commit / tag>`  
**documentation_ref:** `<paths e refs em luciluci-docs>`  
**report_file:** `docs/reports/REPORT-<timestamp>.md`  
**reviewer:** `<nome humano, se houver>`

---

# 1. Resumo executivo

- RFs documentadas encontradas: `<n>`
- RFs classificadas como **Implementado**: `<n>`
- RFs classificadas como **Parcial**: `<n>`
- RFs classificadas como **Não encontrado**: `<n>`
- RFs classificadas como **Ambíguo**: `<n>`
- RFs com matriz **unit + integration + functional** completa: `<n>`
- RFs com **agrupamento/exceção justificados** na matriz: `<n>`
- Itens classificados como **Superfície operacional local herdada do template**: `<n>`
- NFRs classificados como **Implementado localmente**: `<n>`
- NFRs classificados como **Upstream/plataforma**: `<n>`
- NFRs classificados como **Compartilhado**: `<n>`
- NFRs classificados como **Fora do escopo desta release**: `<n>`
- NFRs classificados como **Gap real local**: `<n>`

Principais divergências:

- `<ex.: AuthN pública via Bearer JWT está descrita na documentação canônica, mas o contrato local/OpenAPI ainda diverge do boundary público esperado.>`
- `<ex.: RFs de CSV retornam CsvJobOutcome, enquanto a documentação descreve results[] / errors[] por linha.>`

Principais evidências de maturidade:

- `<ex.: Rotas Express reais com wiring ativo em src/app.ts.>`
- `<ex.: Outbox persistido, audit_logs, idempotency_keys e OpenAPI servida em /api-docs.>`

Principal risco técnico-documental:

- `<descreva o maior risco de desalinhamento entre docs, código, testes e operação>`

# 2. Escopo e fontes analisadas

Paths de código analisados:

- `src/app.ts`
- `src/main.ts`
- `src/features/<dominio>/**`
- `src/shared/**`
- `docs/**`
- `tests/**`
- `.github/workflows/**`

Path do `ACTUAL_STATE.md`:

- `ACTUAL_STATE.md`

Paths relevantes em `luciluci-docs/`:

- `luciluci-docs/<dominio>/README.md`
- `luciluci-docs/<dominio>/prd.md`
- `luciluci-docs/<dominio>/tdd.md`
- `luciluci-docs/<dominio>/tp.md`

Artefatos auxiliares usados:

- `docs/architecture/overview.md`
- `docs/runbooks/local-development.md`
- `docs/runbooks/infra-access.md`
- `api.http`
- `scripts/seed.ts`

Execução de testes/coverage:

- `<ex.: npm run test -- --coverage -> passou>`
- `<ex.: npm run build -> passou>`
- `<ex.: npm run asyncapi:check -> passou>`
- `<ex.: npm run seed -> passou | falhou | não executado>`
- `<registre falhas de reprodutibilidade, EPERM, portas, containers ausentes, etc.>`

Evidência remota de CI/CD:

- `workflow_file`: `<ex.: .github/workflows/ci.yml>`
- `workflow_name`: `<ex.: ci>`
- `workflow_versioned_present`: `<sim | não>`
- `remote_run_evidence`: `<comprovado | ausente>`
- `remote_run_url`: `<url do run remoto | ausente>`
- `remote_run_id`: `<run id | ausente>`
- `remote_run_attempt`: `<attempt | ausente>`
- `remote_run_trigger`: `<push main | pull_request #123 | workflow_dispatch | ausente>`
- `remote_head_sha`: `<sha analisado | ausente>`
- `remote_status`: `<queued | in_progress | completed | ausente>`
- `remote_conclusion`: `<success | failure | cancelled | timed_out | action_required | neutral | ausente>`
- `failed_job`: `<job name/id | n/a>`
- `failed_step`: `<step name | n/a>`
- `error_summary`: `<trecho curto do log ou resumo objetivo | n/a>`

> Regra: não classificar CI/CD como comprovado apenas pela presença de `.github/workflows/*.yml`.
> Quando não houver run remoto comprovado, declarar isso explicitamente no report.
> Quando houver run remoto falho, registrar URL, ID, SHA, status, conclusion, job/step falhos e resumo objetivo do erro.

Classificação obrigatória de fronteira NFR:

- `implementado localmente`
- `upstream/plataforma`
- `compartilhado`
- `fora do escopo desta release`
- `gap real local`

> Regra: presença em documentação global do ecossistema não implica obrigação local automática no microserviço.
> Regra: só usar `gap real local` quando a responsabilidade local estiver explícita e a evidência continuar ausente.
> Regra: itens `upstream/plataforma`, `compartilhado` sem decisão local e `fora do escopo desta release` não entram na lista de lacunas reais locais.

# 3. Matriz principal RF x implementação

| RF   | Título                         | Documento-fonte                              | Endpoints relacionados | Status           | Evidência de código      | Evidência de testes                  | Eventos relacionados            | Capacidades transversais envolvidas             | Observações    |
| ---- | ------------------------------ | -------------------------------------------- | ---------------------- | ---------------- | ------------------------ | ------------------------------------ | ------------------------------- | ----------------------------------------------- | -------------- |
| RF01 | `<ex.: CRUD Produtos (Admin)>` | `<prd.md RF01; tdd.md RF01; tp.md 2.3 RF01>` | `<POST /products ...>` | **Implementado** | `<paths/classe/métodos>` | `<tests/integration/...>`            | `<products.product.created.v1>` | `<PostgreSQL, outbox, OpenAPI, correlation id>` | `<nota curta>` |
| RF02 | `<...>`                        | `<...>`                                      | `<...>`                | **Parcial**      | `<...>`                  | `<Nenhum teste dedicado encontrado>` | `<...>`                         | `<...>`                                         | `<...>`        |

> Regra: não invente RF. Use apenas RFs realmente encontradas na documentação canônica do domínio analisado.
> Endpoints operacionais herdados do template não entram na matriz de RF.
> Regra: a coluna `Evidência de testes` resume o panorama; a prova detalhada da tríade `unit + integration + functional` por RF deve aparecer na seção `6.1`.

# 4. Checklist consolidado por PRD

Legenda:

- `[x]` implementado
- `[~]` parcial
- `[ ]` não encontrado
- `[!]` ambíguo

- [x] `<RF01 - exemplo>`
- [~] `<RF02 - exemplo>`
- [ ] `<RF03 - exemplo>`
- [!] `<item com ambiguidade documental>`

# 5. Checklist consolidado por TDD

Endpoints:

- [x] Endpoints canônicos existem e estão registrados
- [~] Endpoints existem, mas o contrato/documentação não fecha com o código
- [ ] Endpoint/documento não encontrado

Fluxos:

- [x] `<ex.: CRUD com persistência, auditoria e outbox>`
- [~] `<ex.: lote CSV existe, mas contrato diverge>`
- [ ] `<ex.: consumer inbound não encontrado>`

Componentes:

- [x] App/Bootstrap reais
- [x] Repositórios reais
- [x] Migrations reais
- [ ] Worker/consumer/read model/object storage quando previstos

Regras técnicas:

- [x] Idempotência
- [x] Correlation ID nas rotas de negócio; endpoints operacionais locais + `OPTIONS` isentos pelo template
- [x] Error mapping padronizado
- [x] Compatibilidade contratual em CI, quando materializada localmente
- [!] NFRs de plataforma/compartilhados foram classificados antes de qualquer conclusão de gap local

Integrações:

- [x] `<ex.: RabbitMQ outbound>`
- [ ] `<ex.: inbound de negócio>`
- [ ] `<ex.: consumer-driven contracts>`

# 6. Checklist consolidado por TP

- [x] Existem testes unitários
- [x] Existem testes de integração
- [x] Existem testes de contrato
- [ ] Existem testes E2E
- [ ] Existe matriz explícita `RF -> unit / integration / functional`
- [ ] Cada RF central tem tríade mínima comprovada ou justificativa explícita de agrupamento/exceção
- [ ] Não há `[x]` na rastreabilidade sem path/evidência objetiva
- [ ] Existem testes dedicados para os RFs centrais do domínio
- [!] `<registre limitações de ambiente na execução dos testes, se houver>`

## 6.1 Matriz obrigatória RF -> testes

Preencha uma linha para cada RF realmente encontrada em `prd.md`, `tdd.md` e `tp.md`.

Regras:

- não reutilizar automaticamente a feature de exemplo do `standard-ms` como se ela provasse RFs do domínio derivado
- não marcar cobertura como completa sem apontar paths/suites/casos reais
- `functional` significa teste funcional/de sistema previsto no `TP` do domínio; pode ser suite funcional/E2E, UAT roteirizado ou fluxo manual roteirizado com evidência objetiva
- teste de contrato isolado não substitui automaticamente a coluna `functional`
- o mesmo teste pode cobrir múltiplas RFs, mas isso deve aparecer explicitamente em `Agrupamento / exceção`
- quando a tríade não existir, registrar `ausente`, `parcial` ou a exceção concreta; não inflar a marcação com `[x]`

| RF   | Unit                          | Integration                          | Functional                                                                  | Agrupamento / exceção                                                      | Evidência / observação                                     | Status da rastreabilidade        |
| ---- | ----------------------------- | ------------------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------- |
| RF01 | `<tests/unit/... ou ausente>` | `<tests/integration/... ou ausente>` | `<tests/functional/...; tests/e2e/...; UAT/manual roteirizado; ou ausente>` | `<ex.: mesmo fluxo cobre RF01 e RF02; justificar fronteira das asserções>` | `<paths, comando executado, ID do caso, ou nota objetiva>` | `<completa / parcial / ausente>` |
| RF02 | `<...>`                       | `<...>`                              | `<...>`                                                                     | `<...>`                                                                    | `<...>`                                                    | `<...>`                          |

> Regra: só considerar a tríade mínima comprovada quando a linha tiver evidência explícita para `unit`, `integration` e `functional`, ou quando houver agrupamento/exceção documentados de forma objetiva e auditável.
> Regra: se o serviço não possuir automação funcional, declarar isso; não substituir essa ausência por inferência estrutural.

# 7. Inventário de endpoints reais

## Endpoints funcionais

| Método | Path         | Handler/controller     | RF associada | Status           | Observações |
| ------ | ------------ | ---------------------- | ------------ | ---------------- | ----------- |
| `POST` | `/<recurso>` | `<controller#handler>` | `RF01`       | **Implementado** | `<nota>`    |
| `GET`  | `/<recurso>` | `<controller#handler>` | `RF03`       | **Parcial**      | `<nota>`    |

## Endpoints operacionais / contratos

Classifique `/health`, `/metrics`, `/api-docs`, `/api-docs-json`, `/events-docs` e `/docs/asyncapi/*` como superfície operacional local herdada do template, não como RF do domínio.

| Método | Path                                     | Handler/controller | RF associada          | Status                                               | Observações |
| ------ | ---------------------------------------- | ------------------ | --------------------- | ---------------------------------------------------- | ----------- |
| `GET`  | `/health`                                | `<src/app.ts>`     | `não é RF do domínio` | **Superfície operacional local herdada do template** | `<nota>`    |
| `GET`  | `/metrics`                               | `<src/app.ts>`     | `não é RF do domínio` | **Superfície operacional local herdada do template** | `<nota>`    |
| `GET`  | `/api-docs`                              | `<src/app.ts>`     | `não é RF do domínio` | **Superfície operacional local herdada do template** | `<nota>`    |
| `GET`  | `/api-docs-json`                         | `<src/app.ts>`     | `não é RF do domínio` | **Superfície operacional local herdada do template** | `<nota>`    |
| `GET`  | `/events-docs`                           | `<src/app.ts>`     | `não é RF do domínio` | **Superfície operacional local herdada do template** | `<nota>`    |
| `GET`  | `/docs/asyncapi/<versão>/<arquivo>.json` | `<src/app.ts>`     | `não é RF do domínio` | **Superfície operacional local herdada do template** | `<nota>`    |

# 8. Fronteira NFR e capacidades transversais

## 8.1 Matriz obrigatória de fronteira NFR

| NFR do template                                                   | Categoria padrão sugerida      | Precisa decisão por serviço? | Estado local observado                            | Evidência                                                    | Como reportar no microserviço derivado?                                                                           | Gap real local?                               |
| ----------------------------------------------------------------- | ------------------------------ | ---------------------------- | ------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| rate limit                                                        | `upstream/plataforma`          | `sim`                        | `<ausente localmente ou implementado localmente>` | `<gateway/BFF, middleware local, docs>`                      | `<registrar como upstream; só vira gap local sem esse boundary>`                                                  | `<não por padrão>`                            |
| OpenTelemetry / tracing distribuído                               | `compartilhado`                | `sim`                        | `<ausente localmente, parcial ou implementado>`   | `<deps, instrumentação, docs>`                               | `<separar plataforma de observabilidade vs instrumentação do serviço>`                                            | `<só após decisão explícita>`                 |
| Schema Registry externo                                           | `upstream/plataforma`          | `sim`                        | `<ausente localmente ou integrado>`               | `<cliente/SDK, endpoint/config externa, docs de plataforma>` | `<não usar event-schema-registry.ts como evidência; só vira gap local com responsabilidade explícita do serviço>` | `<não por padrão>`                            |
| registry local de eventos derivado do AsyncAPI                    | `implementado localmente`      | `não`                        | `<implementado ou ausente>`                       | `<event-schema-registry.ts, AsyncAPI versionado, testes>`    | `<reportar como helper local derivado do AsyncAPI versionado do repositório>`                                     | `<sim, se o helper esperado estiver ausente>` |
| DLQ / TTL / redrive / retry exponencial / poison message handling | `compartilhado`                | `sim`                        | `<ausente localmente, parcial ou implementado>`   | `<topologia de filas, args, workers, docs>`                  | `<só registrar gap local quando a política for assumida pelo serviço>`                                            | `<só após decisão explícita>`                 |
| evidência automatizada de segurança                               | `fora do escopo desta release` | `sim`                        | `<ausente ou implementado>`                       | `<workflow, suite, scanner>`                                 | `<reportar fora do escopo por padrão; não inflar lacunas locais>`                                                 | `<não por padrão>`                            |
| evidência automatizada de performance/carga                       | `fora do escopo desta release` | `sim`                        | `<ausente ou implementado>`                       | `<k6, artillery, workflow>`                                  | `<reportar fora do escopo por padrão; só vira gap com escopo local explícito>`                                    | `<não por padrão>`                            |
| CDC / integração de streaming                                     | `fora do escopo desta release` | `sim`                        | `<não materializado ou implementado>`             | `<docs do domínio, adapters, contratos>`                     | `<não inferir requisito local sem documentação canônica do domínio>`                                              | `<não por padrão>`                            |

## 8.2 Capacidades transversais

> Antes de marcar ausência como lacuna, use a matriz `8.1`.
> Itens classificados como `upstream/plataforma`, `compartilhado` sem decisão local ou `fora do escopo desta release` não entram como `gap real local`.
> Regra específica herdada do `standard-ms`: a baseline padrão de RabbitMQ inclui `exchange/fila duráveis`, `outbox`, `worker real de publicação`, `consumer de exemplo` e `idempotência de consumo`; `DLQ`, `TTL`, `redrive`, `retry exponencial` e `poison message handling` permanecem fora da baseline padrão e só entram como gap local após decisão explícita do serviço derivado.
> Regra específica herdada do `standard-ms`: nunca consolidar `registry local de eventos derivado do AsyncAPI` com `Schema Registry externo`. O helper local conta como capacidade implementada do template; a integração externa continua `upstream/plataforma` por padrão.

| Capacidade         | Status             | Evidência                                           | Observação                                                                                         |
| ------------------ | ------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| migrations         | **Implementado**   | `<path da migration / helper de testes>`            | `<ex.: schema existe, mas sem FKs/CHECKs do TDD>`                                                  |
| api.http           | **Implementado**   | `<api.http>`                                        | `<cobre endpoints funcionais e operacionais aplicáveis; headers e exemplos alinhados>`             |
| seeds              | **Implementado**   | `<scripts/seed.ts>`                                 | `<escopo do seed>`                                                                                 |
| seed robusto       | **Implementado**   | `<scripts/seed.ts + docs>`                          | `<volume significativo, faker determinístico quando aplicável, relações/regras coerentes>`         |
| CRUD               | **Implementado**   | `<rotas/controllers/services/repositories>`         | `<lacunas de cobertura>`                                                                           |
| eventos publicados | **Implementado**   | `<outbox + worker + asyncapi>`                      | `<sem teste broker E2E>`                                                                           |
| eventos consumidos | **Não encontrado** | `<consumedEventTypes = []>`                         | `<se aplicável>`                                                                                   |
| idempotência       | **Implementado**   | `<middleware + service + tabela>`                   | `<nota>`                                                                                           |
| correlation id     | **Implementado**   | `<middleware + logs + eventos>`                     | `<ex.: obrigatório nas rotas de negócio; operacionais locais + OPTIONS são isentos pelo template>` |
| error mapping      | **Implementado**   | `<exceptions + error handler + testes>`             | `<nota>`                                                                                           |
| openapi            | **Implementado**   | `<swagger.ts + /api-docs>`                          | `<sem securitySchemes/JWT, se aplicável>`                                                          |
| asyncapi           | **Implementado**   | `<docs/asyncapi/... + asyncapi:check>`              | `<sem gate backward em CI, se aplicável>`                                                          |
| unit tests         | **Implementado**   | `<tests/unit/...>`                                  | `<escopo muito restrito, se aplicável>`                                                            |
| integration tests  | **Implementado**   | `<tests/integration/...>`                           | `<cobertura parcial, se aplicável>`                                                                |
| contract tests     | **Implementado**   | `<tests/contract/...>`                              | `<sem prova de wiring real, se aplicável>`                                                         |
| ci/cd              | **Parcial**        | `<workflow versionado + run URL/ID/SHA/conclusion>` | `<workflow versionado sem run remoto comprovado não basta; registrar evidência ou ausência>`       |

# 9. Cobertura de testes

Método usado:

- `<descreva como a cobertura foi medida>`
- `<se houve inferência estrutural, explicite>`
- `<se houve impossibilidade de execução isolada por tipo, explicite>`

Percentuais globais medidos:

- `Statements`: `<n>%`
- `Branches`: `<n>%`
- `Functions`: `<n>%`
- `Lines`: `<n>%`

Cobertura por tipo:

- Unit:
  - Suites encontradas: `<n>`
  - Testes encontrados: `<n>`
  - Escopo comprovado: `<...>`
  - Observação: `<...>`
- Integration:
  - Suites encontradas: `<n>`
  - Testes encontrados: `<n>`
  - Escopo comprovado: `<...>`
  - Observação: `<...>`
- Contract:
  - Suites encontradas: `<n>`
  - Testes encontrados: `<n>`
  - Escopo comprovado: `<...>`
  - Observação: `<...>`
- E2E:
  - `<Não encontrado | Suites encontradas: n>`

RFs com cobertura clara:

- `<RFs realmente cobertas>`

RFs sem cobertura clara:

- `<RFs ausentes ou parciais>`

Hotspots de cobertura baixa no fluxo central:

- `src/features/<dominio>/use-cases/...`: `<n>%`
- `src/features/<dominio>/adapters/controllers/...`: `<n>%`

Riscos relevantes:

- `<ex.: núcleo do domínio subcoberto>`
- `<ex.: sem prova de broker real / CSV / visibilidade / status transitions>`

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

Não registrar aqui NFR já classificado como `upstream/plataforma`, `compartilhado` sem decisão local ou `fora do escopo desta release`, a menos que a documentação local atribua explicitamente a responsabilidade ao serviço.
Não usar `event-schema-registry.ts` como se comprovasse integração com `Schema Registry externo`.

- `<item 1>`
  - Documentação: `<path + resumo>`
  - Código: `<path + resumo>`
- `<item 2>`
  - Documentação: `<...>`
  - Código: `<...>`

## 10.2 Código existe, documentação não comprova

Não use esta seção para `/health`, `/metrics`, `/api-docs`, `/api-docs-json`, `/events-docs` ou `/docs/asyncapi/*` quando a cobertura vier do `standard-ms` como superfície operacional local herdada do template.

- `<endpoint operacional, query param, header, comportamento>`
  - Código: `<path>`
  - Documentação: `<não encontrado em PRD/TDD/TP>`

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

- `<ex.: remoção de feature template, alinhamento operacional, hardening, etc.>`

## 10.4 PRD / TDD / TP divergem entre si

- `<ambiguidade 1>`
- `<ambiguidade 2>`

## 10.5 Ambiguidades que impedem conclusão segura

- `<coverage por tipo>`
- `<entrega real no broker>`
- `<mapeamento ORM vs migration>`
- `<NFR sem classificação segura entre serviço vs plataforma>`
- `<qualquer outro item onde não há prova suficiente>`

# 11. Conclusão

Aderência geral:

- `<classifique a aderência funcional>`
- `<classifique a aderência técnico-operacional/documental>`

Maturidade do microserviço:

- `<scaffolding | parcial | moderada | avançada>`
- `<justificativa curta>`

Lacunas reais locais prioritárias:

- `<top 3 a 5 lacunas reais>`

Próximos passos recomendados:

- `<alinhamento código x docs>`
- `<expansão de testes>`
- `<hardening / contratos / CI / migrations / segurança>`
