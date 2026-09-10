# REPORT - Avaliação de completude do microserviço

**status:** `BOOTSTRAP_IMPLEMENTED_AND_PROVEN / RF_NOT_IMPLEMENTED`
**generated_by:** Codex
**generated_at:** 2026-09-10T16:36:34Z
**review_mode:** final
**microservice:** support-ms
**repository_ref:** `main` / `3c387abe2d8f8c99bfa67273210de38b93ea6b10`, árvore de trabalho preservada e modificada
**documentation_ref:** `luciluci-docs` `76f77340897dc0916476410aed01a622ed796412` (`support` baseline 0.2)
**report_file:** `docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md`
**reviewer:** não informado

# 1. Resumo executivo

- RFs documentadas encontradas: 14; Implementado: 0; Parcial: 0; Não encontrado: 14; Ambíguo: 0.
- RFs com tríade unit + integration + functional completa: 0; o S1 não implementa RF de domínio.
- Superfícies operacionais locais: 4; NFR local comprovado: build/processo/migration/idempotência técnica.
- NFR upstream/plataforma: autenticação e papel amplo; compartilhado: headers/contrato BFF; fora da release: broker/eventos; gap real local: nenhum no recorte S1.

`DRIFT-SUP-S1-001` foi resolvido. O build de produção passou de `dist/src/...`
para o layout já exigido pelos scripts, com `dist/main.js` e runners em
`dist/shared/...`. A correção foi provada por RED prévio, build limpo, check
positivo/negativo, PostgreSQL novo, processo compilado e imagem/CMD reais.

RF01–RF13 continuam `NOT_IMPLEMENTED`. Este report não aprova decisões de
negócio nem libera RF01.

# 2. Escopo e fontes analisadas

Foram analisados `tsconfig.build.json`, `package.json`, `Dockerfile`,
`.dockerignore`, `scripts/check-dist-entrypoints.js`, scripts de prova,
`src/main.ts`, `src/app.ts`, migrations, `docs/openapi/**`, `api.http`,
`tests/**`, `.github/workflows/ci.yml`, `ACTUAL_STATE.md`, o drift, plano e
runbooks. Fontes canônicas: `luciluci-docs/support/{README,prd,notes,tdd,tp}.md`.

Execuções locais comprovadas: `npm ci`, lint, build, `build:check`, export/check
OpenAPI, check de mensageria, unit/integration/contract, coverage/check,
`git diff --check`, `proof:s1:postgres` e `proof:s1:image`.

CI/CD: workflow `ci` presente e alterado; `remote_run_evidence: ausente`.
Não foi feito push nem consultado run, URL, ID ou SHA remoto.

`npm ci` informou 25 vulnerabilidades transitivas/da árvore instalada (4 low,
4 moderate, 15 high e 2 critical). Não houve `npm audit fix` ou atualização de
dependências neste lote; o alerta requer triagem separada e não foi classificado
como novo drift funcional de S1.

# 3. Matriz principal RF x implementação

| RF          | Status         | Evidência                                       |
| ----------- | -------------- | ----------------------------------------------- |
| RF01–RF04   | Não encontrado | departments não registrados; fora de S1         |
| RF05–RF06   | Não encontrado | tickets não registrados; fora de S1             |
| RF07a–RF07b | Não encontrado | listagens não registradas; fora de S1           |
| RF08–RF09   | Não encontrado | resolve/detalhe não registrados; fora de S1     |
| RF10–RF13   | Não encontrado | mensagens/histórico não registrados; fora de S1 |

# 4. Checklist consolidado por PRD

- [ ] RF01–RF13: não implementadas.
- [x] Nenhum endpoint/tabela/evento de domínio foi introduzido neste drift.
- [x] Profile continua ausente; mensageria de domínio continua inativa.

# 5. Checklist consolidado por TDD

- [x] Build, migration e processo compilados estão alinhados.
- [x] `idempotency_keys` permanece capacidade genérica técnica, sem contrato HTTP de RF.
- [x] Correlação, envelope de erro, métricas e OpenAPI operacional foram preservados.
- [!] DEC-SUP-01, 03, 08, 09 e 10 permanecem abertas em `notes.md`.

# 6. Checklist consolidado por TP

- [x] Unit: 7 suítes / 20 testes; inclui fixture positiva/negativa do gate.
- [x] Integration: 1 suíte / 5 testes HTTP operacionais.
- [x] Contract: 1 suíte / 2 testes OpenAPI.
- [x] Coverage: 9 suítes / 27 testes; statements 95.83%, branches 77.08%, functions 96.96%, lines 95.83%.
- [ ] Testes funcionais das RFs: inexistentes porque RFs não foram implementadas.

## 6.1 Matriz obrigatória RF -> testes

| RF        | Unit                | Integration         | Functional          | Status                                        |
| --------- | ------------------- | ------------------- | ------------------- | --------------------------------------------- |
| RF01–RF13 | ausente; fora de S1 | ausente; fora de S1 | ausente; fora de S1 | rastreabilidade ausente por escopo autorizado |

# 7. Inventário de endpoints reais

## Endpoints funcionais

Nenhum endpoint funcional Support está registrado.

## Endpoints operacionais / contratos

| Método | Path                       | Status                                              |
| ------ | -------------------------- | --------------------------------------------------- |
| GET    | `/health`                  | superfície operacional; comprovado em processo real |
| GET    | `/metrics`                 | superfície operacional; comprovado em processo real |
| GET    | `/api-docs` e `/api-docs/` | superfície operacional; comprovado em processo real |
| GET    | `/api-docs-json`           | superfície operacional; quatro paths somente        |

`/profiles` e `/api/support/tickets`, com `X-Correlation-ID` válido, retornaram
404 no processo real; não são contratos ativos. O Swagger redirecionou
`/api-docs` com 301 para `/api-docs/`, que respondeu 200, nos dois comandos
compilados.

# 8. Fronteira NFR e capacidades transversais

## 8.1 Matriz obrigatória de fronteira NFR

| Capacidade                   | Classificação                | Evidência                                                                   |
| ---------------------------- | ---------------------------- | --------------------------------------------------------------------------- |
| Build/entrypoints/migrations | implementado localmente      | `build:check`, migration compilada e revert/reapply                         |
| Persistência PostgreSQL      | implementado localmente      | banco `support_s1_proof_1789058358_28201`, criado/vazio/removido pela prova |
| Processo e imagem            | implementado localmente      | `start`, `start:docker`, CMD de imagem em recursos exclusivos               |
| AuthN/papel amplo            | upstream/plataforma          | depende do BFF e DEC-SUP-01/03                                              |
| Headers e respostas de RF    | compartilhado                | DEC-SUP-01/08 abertas                                                       |
| Broker/AsyncAPI Support      | fora do escopo desta release | DEC-SUP-11 delimita S1 sem mensageria de domínio                            |

## 8.2 Capacidades transversais

O gate valida todos os entrypoints reais. A prova PostgreSQL checa catálogo,
colunas, migração repetida, round-trip do `IdempotencyService`, runner TS e
revert/reapply. A prova de imagem cria rede, containers, credenciais, banco e
tag exclusivos, e remove exclusivamente esses recursos. `.dockerignore` não
envia `.env`; Dockerfile usa `npm ci` com lockfile.

# 9. Cobertura de testes

O novo `tests/unit/scripts/check-dist-entrypoints.spec.ts` cria fixtures
temporárias próprias: aceita todos os entrypoints e falha quando falta o
revert runner. Não apagou `dist` do usuário. As suítes SQLite continuam testes
locais; não foram usadas como substitutas da prova PostgreSQL.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

As 14 RFs do PRD continuam sem código, contrato ou testes funcionais; isso é
intencional no S1.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência nova. O kernel de idempotência é infraestrutura, não RF.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Nenhuma após as provas deste lote.

## 10.4 PRD / TDD / TP divergem entre si

Não reavaliado fora do checkpoint das DEC; não houve alteração funcional.

## 10.5 Ambiguidades que impedem conclusão segura

DEC-SUP-01, 03, 08, 09 e 10 seguem abertas. Impedem o lote RF01, não o
fechamento técnico S1.

# 11. Conclusão

Estado final: `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. Não há defeito técnico novo
reproduzido; Docker e PostgreSQL estavam disponíveis e foram comprovados
localmente. A evidência remota de CI continua ausente. Próxima ação única:
fazer o checkpoint documental das DEC-SUP-01, 03, 08, 09 e 10 antes de abrir
um lote separado para RF01.
