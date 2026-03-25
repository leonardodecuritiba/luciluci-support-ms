# standard-ms workflow recommendations for builder/report/drift cycle

> Documento de auditoria histórica que originou os ajustes já aplicados no template.
> A fonte de verdade operacional atual fica em `AGENTS.md`, `AI_FIRST.md`, `service-identity.json` e `.github/workflows/ci.yml`.

## Objetivo

Adaptar o `standard-ms` para suportar explicitamente o workflow:

1. **builder/startup skill** para derivar e implementar o microserviço
2. **report-review skill** para gerar report em ondas
3. **drift-fix skill** para corrigir os drifts encontrados
4. repetir até `final`

## Avaliação do template atual

O template já está forte em:

- processo AI-first
- skill de `report-review`
- skill de `drift-fix`
- disciplina de alinhamento entre código, testes, contratos e docs
- rastreabilidade e gates locais

O que falta para o workflow ficar explícito e reutilizável:

- uma skill formal de **bootstrap + implementação do microserviço derivado**
- um prompt operacional correspondente
- uma documentação clara do ciclo `startup -> report -> drift-fix -> nova wave`
- uma matriz obrigatória de renomeação do template para o domínio real

## Alterações recomendadas no repositório

### 1. Adicionar a nova skill

Adicionar:

- `.codex/skills/microservice-builder.md`

Motivo:

- hoje existe skill para **avaliar** (`report-review`) e **corrigir** (`drift-fix`), mas não para **construir** o serviço derivado RF por RF

### 2. Adicionar prompts operacionais do builder

Adicionar:

- `docs/prompts/microservice-builder-prompt.md`
- `docs/prompts/microservice-builder-short-prompt.md`

Motivo:

- padronizar a invocação da skill em IDE/Chat
- reduzir erro de contexto no bootstrap de cada novo microserviço

### 3. Atualizar `AGENTS.md`

Sugestão de ajuste:

- incluir a nova skill na seção de leitura obrigatória
- separar claramente os três modos operacionais:
  - implementação (`microservice-builder`)
  - report (`report-review`)
  - correção (`drift-fix`)

### 4. Atualizar `AI_FIRST.md`

Sugestão de ajuste:

- incluir a nova skill na ordem de leitura
- formalizar o ciclo por ondas:
  - `startup`
  - `wave-1`
  - `report`
  - `drift-fix`
  - `wave-2`
  - `report`
  - `drift-fix`
  - `wave-3`
  - `final`

### 5. Atualizar `docs/README.md` e `docs/prompts/README.md`

Sugestão de ajuste:

- incluir os prompts do builder na lista oficial
- deixar explícito quando usar cada prompt/skill

### 6. Adicionar uma documentação do workflow por ondas

Sugestão:

- `docs/workflows/microservice-wave-lifecycle.md`

Conteúdo esperado:

- objetivo de cada wave
- critério de saída da wave
- skill a usar em cada fase
- regra de handoff entre builder/report/drift-fix

### 7. Adicionar uma checklist de derivação do domínio

Sugestão:

- `docs/architecture/derivation-checklist.md`

Checklist mínima:

- renomear `profile` / `profiles`
- renomear nome do serviço
- renomear OpenAPI/AsyncAPI artifact names
- renomear env vars, exchanges e database names
- revisar `api.http`
- revisar seeds
- revisar workflows e compose files
- revisar eventos publicados/consumidos

Motivo:

- hoje há muitos pontos hardcoded no template; sem checklist, o risco de resíduo é alto

## Problemas concretos encontrados no template atual

### Problema 1 — Path inconsistente de AsyncAPI no CI

Arquivo:

- `.github/workflows/ci.yml`

Achado:

- o workflow mistura `docs/asyncapi/v1/standard-ms-events.json` com `docs/asyncapi/v1/standard-events.json`

Impacto:

- o gate de backward compatibility pode falhar ou comparar o arquivo errado

Correção sugerida:

- padronizar todo o workflow para `docs/asyncapi/v1/standard-ms-events.json`

### Problema 2 — Nome de exchange inconsistente

Arquivos observados:

- `.env.example`
- `docker-compose.yaml`
- `src/shared/utils/env.ts`
- `docs/runbooks/infra-access.md`
- `src/shared/infrastructure/events/event-schema-registry.ts`
- `.github/workflows/ci.yml`

Achado:

- parte do template usa `profile.events`
- outra parte usa `profiles.events`

Impacto:

- aumenta o risco de drift entre ambiente local, CI, docs e eventos reais

Correção sugerida:

- escolher um nome canônico e normalizar em todo o template
- preferencialmente registrar essa decisão em `ACTUAL_STATE.md`

### Problema 3 — Falta de um artefato central de identidade do serviço derivado

Achado:

- o template depende de renomeações dispersas em múltiplos arquivos
- não existe um artefato único declarando o nome oficial do serviço, slug do domínio, artifact names, env vars canônicas e prefixes de evento

Impacto:

- aumenta retrabalho e chance de resíduos do template

Correção sugerida:

Adicionar um artefato leve, por exemplo:

- `docs/architecture/service-identity.md`

com:

- service name
- domain slug
- aggregate roots
- API artifact names
- AsyncAPI artifact names
- DB names
- exchange/queue names
- routing key prefix

## Ordem de implementação recomendada

1. adicionar a nova skill `microservice-builder`
2. adicionar os prompts do builder
3. atualizar `AGENTS.md`
4. atualizar `AI_FIRST.md`
5. atualizar `docs/README.md`
6. atualizar `docs/prompts/README.md`
7. adicionar `docs/workflows/microservice-wave-lifecycle.md`
8. adicionar `docs/architecture/derivation-checklist.md`
9. corrigir `.github/workflows/ci.yml`
10. normalizar naming de exchange e registrar a decisão

## Resultado esperado

Com essas mudanças, o `standard-ms` passa a ter um ciclo AI-first explícito para:

- **construir** um novo microserviço
- **medir** aderência em waves
- **corrigir** drifts de forma incremental
- repetir o processo até a wave final sem perder consistência documental
