# DRIFT-005 — Endpoints operacionais locais + política de X-Correlation-ID no microservice-startup

## Título

Codificar no `standard-ms` a política de endpoints operacionais locais e a exceção controlada de `X-Correlation-ID`, e reescrever o report do `products-ms` para refletir essa regra herdada do template.

## Contexto

O workspace atual mostra que tanto `standard-ms` quanto `products-ms` expõem endpoints operacionais locais fora do domínio de negócio:

- `/health`
- `/metrics`
- `/api-docs`
- `/api-docs-json`
- `/events-docs`
- `/docs/asyncapi/...`

Também mostra que o middleware de `X-Correlation-ID` isenta explicitamente essa superfície operacional local, além de `OPTIONS`.

Isso não é um bug de código.

O drift atual é de classificação/documentação/processo:

1. o report do `products-ms` ainda chama esses endpoints de
   **“Implementado sem vínculo documental claro”**
2. o `standard-ms` ainda não codifica de forma explícita, no processo de microservice-startup, que:
   - esses endpoints são superfície operacional local herdada do template
   - não são RFs do domínio
   - a exceção de `X-Correlation-ID` vale apenas para essa superfície operacional local e para `OPTIONS`
3. o template de report do `standard-ms` ainda induz a mesma redação ambígua para microserviços futuros

## Evidência auditada

### products-ms

- `src/app.ts`
  - expõe `/health`, `/metrics`, `/api-docs`, `/api-docs-json`, `/events-docs`, `/docs/asyncapi/v1/products-events.json`
- `src/shared/kernel/middlewares/correlation-id.middleware.ts`
  - isenta `/api-docs`, `/api-docs-json`, `/events-docs`, `/docs/asyncapi`, `/metrics`, `/health` e `OPTIONS`
- `docs/reports/REPORT-20260323-080012.md`
  - ainda registra esses endpoints como `Implementado sem vínculo documental claro`
  - já registra em outra seção que `X-Correlation-ID` é obrigatório para endpoints de negócio e que endpoints operacionais são isentos

### standard-ms

- `src/app.ts`
  - expõe a mesma superfície operacional local
- `src/shared/kernel/middlewares/correlation-id.middleware.ts`
  - aplica a mesma exceção
- `docs/reports/REPORT-TEMPLATE.md`
  - ainda orienta classificar esses endpoints como `Implementado sem vínculo documental claro`
- `AI_FIRST.md`
  - exige `X-Correlation-ID` nas rotas HTTP aplicáveis, mas não formaliza a exceção operacional
- `docs/runbooks/local-development.md`
  - lista endpoints operacionais, mas sem formalizar a regra de classificação herdada do template

### documentação canônica do domínio

- `luciluci-docs/products/prd.md`
- `luciluci-docs/products/tdd.md`
- `luciluci-docs/products/tp.md`

A documentação canônica do domínio exige `X-Correlation-ID` para requests/eventos do serviço, mas não modela RF explícita para essa superfície operacional local nem descreve a exceção operacional.

## Objetivo

Fechar o drift documental/processual com a menor mudança segura possível, garantindo que:

1. o `standard-ms` passe a declarar explicitamente que endpoints operacionais locais:
   - são herdados do template
   - não são RFs do domínio
   - devem ser documentados em runbooks/report como superfície operacional local
2. o `standard-ms` passe a declarar explicitamente que:
   - `X-Correlation-ID` é obrigatório nas rotas HTTP públicas de negócio
   - endpoints operacionais locais e `OPTIONS` são isentos
   - nesses casos o middleware pode aceitar ausência do header e gerar/propagar um valor para observabilidade
3. o `REPORT` do `products-ms` seja reescrito para refletir essa taxonomia, removendo a expressão
   `Implementado sem vínculo documental claro`
4. o processo de microservice-startup para serviços futuros passe a herdar essa regra a partir exclusivamente do `standard-ms`

## Fonte de verdade

Usar como fonte de verdade, nesta ordem:

1. `standard-ms` como template-base do processo de microservice-startup
2. implementação viva de `standard-ms`
3. implementação viva de `products-ms`
4. `luciluci-docs/products/*` apenas para confirmar que esses endpoints não são RF de domínio e que a exigência de `X-Correlation-ID` é do boundary de serviço, não da superfície operacional local

## Decisão esperada

A decisão final desta rodada deve ficar explícita como:

### Política de endpoints operacionais locais

Endpoints como `/health`, `/metrics`, `/api-docs`, `/api-docs-json`, `/events-docs` e `/docs/asyncapi/*` são superfície operacional local herdada do `standard-ms`, documentada em runbooks/report/arquitetura local, e não RF do domínio.

### Política de X-Correlation-ID

`X-Correlation-ID` é obrigatório nas rotas HTTP públicas de negócio.
Endpoints operacionais locais e `OPTIONS` são isentos dessa exigência de entrada.
Para esses endpoints isentos, o middleware pode aceitar a ausência do header e gerar/retornar um correlation id para observabilidade local.

## Escopo IN

Este drift pode tocar:

### standard-ms

- `AI_FIRST.md`
- `docs/runbooks/local-development.md`
- `docs/reports/REPORT-TEMPLATE.md`
- `docs/architecture/overview.md` se necessário para consolidar a política

### products-ms

- `docs/reports/REPORT-20260323-080012.md`

Se a IA concluir que é necessário um ajuste documental adicional de apoio, pode também auditar:

- `products-ms/README.md`
- `products-ms/ACTUAL_STATE.md`

mas sem abrir refactor amplo.

## Escopo OUT

Não resolver neste drift:

- mudança de código em `src/app.ts`
- mudança de código em `correlation-id.middleware.ts`
- alteração da documentação canônica do domínio em `luciluci-docs/products/*`
- criação de novas RFs de domínio para endpoints operacionais
- alteração de OpenAPI/AsyncAPI
- alteração de regras de negócio
- refactor amplo do startup do microserviço

A expectativa é fechar este item documentalmente/template-first.

## Regras obrigatórias desta rodada

- Não tratar endpoints operacionais locais como RF do domínio.
- Não tentar “forçar” atualização de `luciluci-docs/products/*` para criar RF artificial.
- Priorizar `standard-ms` como origem da política herdada por microserviços futuros.
- Reescrever o report do `products-ms` para refletir a nova classificação.
- Se precisar mudar texto no template de report, fazer isso no `standard-ms`.
- Manter a distinção clara entre:
  - superfície de negócio
  - superfície operacional local
- Explicitar no texto final que a exceção de `X-Correlation-ID` é controlada e restrita à superfície operacional local + `OPTIONS`.

## Escopo obrigatório de auditoria

Auditar no mínimo:

### standard-ms

- `src/app.ts`
- `src/shared/kernel/middlewares/correlation-id.middleware.ts`
- `AI_FIRST.md`
- `docs/runbooks/local-development.md`
- `docs/reports/REPORT-TEMPLATE.md`

### products-ms

- `src/app.ts`
- `src/shared/kernel/middlewares/correlation-id.middleware.ts`
- `docs/reports/REPORT-20260323-080012.md`

### documentação canônica

- `luciluci-docs/products/prd.md`
- `luciluci-docs/products/tdd.md`
- `luciluci-docs/products/tp.md`

## Tabela obrigatória na resposta

Responder com uma tabela no formato:

| Item auditado | Estado atual | Fonte de verdade | Problema real? | Ação proposta |
| ------------- | ------------ | ---------------- | -------------- | ------------- |

Preencher no mínimo para:

- `/health`
- `/metrics`
- `/api-docs`
- `/api-docs-json`
- `/events-docs`
- `/docs/asyncapi/*`
- exigência de `X-Correlation-ID` em rotas de negócio
- exceção de `X-Correlation-ID` para operacionais + `OPTIONS`
- `REPORT-TEMPLATE.md` do `standard-ms`
- `REPORT-20260323-080012.md` do `products-ms`

## Critério de decisão obrigatório

Ao final, declarar explicitamente:

### Cenário esperado

O drift é documental/template/processual, não funcional.
A correção deve ocorrer em:

- `standard-ms` (processo/template/startup)
- `products-ms` report atual

## Implementação esperada

A implementação deve buscar a menor mudança segura possível para:

1. formalizar no `standard-ms` a política herdada de endpoints operacionais locais
2. formalizar no `standard-ms` a política herdada de exceção operacional de `X-Correlation-ID`
3. substituir no template de report a linguagem:
   - de `sem vínculo documental claro`
   - para uma formulação explícita de `superfície operacional local herdada do template`
4. reescrever o report do `products-ms` com essa nova classificação
5. deixar o processo de microservice-startup preparado para que novos serviços herdem essa orientação sem reabrir o mesmo drift

## Validação esperada

A rodada só pode ser considerada concluída quando houver evidência objetiva de que:

1. o `standard-ms` descreve explicitamente a superfície operacional local herdada do template
2. o `standard-ms` descreve explicitamente a exceção operacional de `X-Correlation-ID`
3. o template de report não usa mais a formulação ambígua `sem vínculo documental claro` para esses endpoints
4. o `REPORT` do `products-ms` foi reescrito com essa taxonomia
5. não houve mudança indevida na documentação canônica do domínio

## Comandos de validação esperados

Executar ou sugerir, conforme o workspace permitir:

- `npm run build` no `standard-ms`, se houver mudança em arquivo que impacte tipagem/processo do repo
- `npm run build` no `products-ms`, se o fluxo local exigir sanity check do workspace
- validação textual objetiva:
  - grep por `Implementado sem vínculo documental claro`
  - grep por `X-Correlation-ID`
  - grep por `/health`, `/metrics`, `/api-docs`, `/events-docs`
- revisar se a nova redação no report/template/processo ficou coerente entre `standard-ms` e `products-ms`

## Resultado esperado

Após este drift:

- o `products-ms` deixa de reportar endpoints operacionais como algo “sem vínculo documental claro”
- o `standard-ms` passa a carregar, de forma explícita, a política correta para microservice-startup
- serviços futuros herdam:
  - a superfície operacional local
  - a taxonomia correta no report
  - a exceção controlada de `X-Correlation-ID` para operacionais

## Output obrigatório

Responder obrigatoriamente com:

1. **RESUMO DO DRIFT**
2. **TABELA: item auditado -> estado atual -> fonte de verdade -> ação proposta**
3. **DECISÃO FINAL**: corrigir docs/template/report, ou combinação
4. **ARQUIVOS ALTERADOS**
5. **IMPLEMENTAÇÃO REALIZADA**
6. **VALIDAÇÃO**
7. **DOCUMENTAÇÃO ATUALIZADA**
8. **PR PRONTA**
9. **PENDÊNCIAS OU RISCOS**

## PRONTA PARA HANDOFF

Se esta rodada for concluída, o próximo passo recomendado deve ser apenas:

- verificar se o `products-ms` ainda precisa herdar algum ajuste complementar do `standard-ms` para `api.http` e documentação operacional

Não executar essa próxima rodada agora.

## Estilo de execução

- Seja direto e técnico.
- Não pare na análise.
- Faça mudanças concretas.
- Traga caminhos de arquivos exatos.
- Traga conteúdo final pronto para copiar e colar.
- Não expanda para outros drifts.
