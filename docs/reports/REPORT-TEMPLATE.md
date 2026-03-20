> [!IMPORTANT]
> Este arquivo é um **template de report de avaliação de completude** para qualquer microserviço derivado do ecossistema.
> Ele deve ser usado como artefato humano de revisão rápida, normalmente gerado por IA **em ondas**, sob supervisão de outro desenvolvedor.
> **Não é fonte de verdade.** A precedência continua sendo: `luciluci-docs/` -> código executável -> contratos/versionamentos locais -> report.
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
- RFs classificadas como **Implementado sem vínculo documental claro**: `<n>`

Principais divergências:

- `<ex.: AuthN via JWT descrita em products/prd.md e tdd.md, mas o código atual ainda usa X-Auth-* mockado em development/test.>`
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

Execução de testes/coverage:

- `<ex.: npm run test -- --coverage -> passou>`
- `<ex.: npm run build -> passou>`
- `<ex.: npm run asyncapi:check -> passou>`
- `<registre falhas de reprodutibilidade, EPERM, portas, containers ausentes, etc.>`

# 3. Matriz principal RF x implementação

| RF   | Título                         | Documento-fonte                              | Endpoints relacionados | Status           | Evidência de código      | Evidência de testes                  | Eventos relacionados            | Capacidades transversais envolvidas             | Observações    |
| ---- | ------------------------------ | -------------------------------------------- | ---------------------- | ---------------- | ------------------------ | ------------------------------------ | ------------------------------- | ----------------------------------------------- | -------------- |
| RF01 | `<ex.: CRUD Produtos (Admin)>` | `<prd.md RF01; tdd.md RF01; tp.md 2.3 RF01>` | `<POST /products ...>` | **Implementado** | `<paths/classe/métodos>` | `<tests/integration/...>`            | `<products.product.created.v1>` | `<PostgreSQL, outbox, OpenAPI, correlation id>` | `<nota curta>` |
| RF02 | `<...>`                        | `<...>`                                      | `<...>`                | **Parcial**      | `<...>`                  | `<Nenhum teste dedicado encontrado>` | `<...>`                         | `<...>`                                         | `<...>`        |

> Regra: não invente RF. Use apenas RFs realmente encontradas na documentação canônica do domínio analisado.

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
- [~] Correlation ID
- [x] Error mapping padronizado
- [ ] OpenTelemetry / DLQ / TTL / redrive / compatibilidade contratual em CI, quando previstos

Integrações:

- [x] `<ex.: RabbitMQ outbound>`
- [ ] `<ex.: inbound de negócio>`
- [ ] `<ex.: consumer-driven contracts>`

# 6. Checklist consolidado por TP

- [x] Existem testes unitários
- [x] Existem testes de integração
- [x] Existem testes de contrato
- [ ] Existem testes E2E
- [ ] Existe rastreabilidade mínima "1 unit + 1 integration + 1 functional" por RF
- [ ] Existem testes dedicados para os RFs centrais do domínio
- [!] `<registre limitações de ambiente na execução dos testes, se houver>`

# 7. Inventário de endpoints reais

## Endpoints funcionais

| Método | Path         | Handler/controller     | RF associada | Status           | Observações |
| ------ | ------------ | ---------------------- | ------------ | ---------------- | ----------- |
| `POST` | `/<recurso>` | `<controller#handler>` | `RF01`       | **Implementado** | `<nota>`    |
| `GET`  | `/<recurso>` | `<controller#handler>` | `RF03`       | **Parcial**      | `<nota>`    |

## Endpoints operacionais / contratos

| Método | Path             | Handler/controller | RF associada      | Status                                        | Observações |
| ------ | ---------------- | ------------------ | ----------------- | --------------------------------------------- | ----------- |
| `GET`  | `/health`        | `<src/app.ts>`     | `sem RF canônica` | **Implementado sem vínculo documental claro** | `<nota>`    |
| `GET`  | `/metrics`       | `<src/app.ts>`     | `sem RF canônica` | **Implementado sem vínculo documental claro** | `<nota>`    |
| `GET`  | `/api-docs`      | `<src/app.ts>`     | `sem RF canônica` | **Implementado sem vínculo documental claro** | `<nota>`    |
| `GET`  | `/api-docs-json` | `<src/app.ts>`     | `sem RF canônica` | **Implementado sem vínculo documental claro** | `<nota>`    |
| `GET`  | `/events-docs`   | `<src/app.ts>`     | `sem RF canônica` | **Implementado sem vínculo documental claro** | `<nota>`    |

# 8. Capacidades transversais

| Capacidade         | Status             | Evidência                                   | Observação                                        |
| ------------------ | ------------------ | ------------------------------------------- | ------------------------------------------------- |
| migrations         | **Implementado**   | `<path da migration / helper de testes>`    | `<ex.: schema existe, mas sem FKs/CHECKs do TDD>` |
| seeds              | **Implementado**   | `<scripts/seed.ts>`                         | `<escopo do seed>`                                |
| CRUD               | **Implementado**   | `<rotas/controllers/services/repositories>` | `<lacunas de cobertura>`                          |
| eventos publicados | **Implementado**   | `<outbox + worker + asyncapi>`              | `<sem teste broker E2E>`                          |
| eventos consumidos | **Não encontrado** | `<consumedEventTypes = []>`                 | `<se aplicável>`                                  |
| idempotência       | **Implementado**   | `<middleware + service + tabela>`           | `<nota>`                                          |
| correlation id     | **Parcial**        | `<middleware + logs + eventos>`             | `<ex.: propaga, mas não exige entrada>`           |
| error mapping      | **Implementado**   | `<exceptions + error handler + testes>`     | `<nota>`                                          |
| openapi            | **Implementado**   | `<swagger.ts + /api-docs>`                  | `<sem securitySchemes/JWT, se aplicável>`         |
| asyncapi           | **Implementado**   | `<docs/asyncapi/... + asyncapi:check>`      | `<sem gate backward em CI, se aplicável>`         |
| unit tests         | **Implementado**   | `<tests/unit/...>`                          | `<escopo muito restrito, se aplicável>`           |
| integration tests  | **Implementado**   | `<tests/integration/...>`                   | `<cobertura parcial, se aplicável>`               |
| contract tests     | **Implementado**   | `<tests/contract/...>`                      | `<sem prova de wiring real, se aplicável>`        |
| ci/cd              | **Parcial**        | `<.github/workflows/...>`                   | `<lacunas de gate de cobertura/contrato/deploy>`  |

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

- `<item 1>`
  - Documentação: `<path + resumo>`
  - Código: `<path + resumo>`
- `<item 2>`
  - Documentação: `<...>`
  - Código: `<...>`

## 10.2 Código existe, documentação não comprova

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
- `<qualquer outro item onde não há prova suficiente>`

# 11. Conclusão

Aderência geral:

- `<classifique a aderência funcional>`
- `<classifique a aderência técnico-operacional/documental>`

Maturidade do microserviço:

- `<scaffolding | parcial | moderada | avançada>`
- `<justificativa curta>`

Lacunas prioritárias:

- `<top 3 a 5 lacunas reais>`

Próximos passos recomendados:

- `<alinhamento código x docs>`
- `<expansão de testes>`
- `<hardening / contratos / CI / migrations / segurança>`
