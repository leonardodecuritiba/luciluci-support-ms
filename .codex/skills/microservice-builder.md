# Skill: microservice-builder

## Precedência específica de Support — revisão 0.2

No lote startup deste serviço, executar `docs/prompts/support-bootstrap-prompt.md`
e `docs/workflows/support-bootstrap-plan.md`. O escopo é S0 + S1 sem RFs,
sem eventos de domínio e sem seed de domínio. A sugestão genérica de renomear
Profile não autoriza transformá-lo em Ticket. Não usar `--remote`, não avançar
para RF01 e não interromper a derivação só porque ultrapassa 2–4 arquivos: a
retirada do exemplo deve preservar consistência de imports, contratos e CI.
As demais regras continuam aplicáveis naquilo que não conflitar com esse recorte.

## Objetivo

Transformar o `standard-ms` em um microserviço real do ecossistema LuciLuci, com execução AI-first, guiada por documentação, aderente à arquitetura backend e pronta para avançar RF por RF em ondas.

Esta skill existe para a fase de **bootstrap + implementação**.

Ela **não substitui**:

- `.codex/skills/report-review.md` para geração/review de report
- `.codex/skills/drift-fix.md` para correção de drift após report

## Quando usar

Use esta skill quando a tarefa for:

- derivar um novo microserviço a partir do template
- renomear a feature de exemplo `profile` para o domínio real
- implementar RFs do microserviço com base em documentação canônica
- construir código, testes, contratos e docs no mesmo ciclo
- avançar em `wave-1`, `wave-2`, `wave-3` ou `final-implementation`

Não use esta skill quando a tarefa principal for apenas:

- gerar report de completude
- corrigir drift já materializado em `.codex/drifts/`
- revisar PR isolada

## Entradas mínimas esperadas

Antes de começar, identifique explicitamente:

- `microservice_name`: nome do serviço derivado, ex.: `payments-ms`
- `domain_slug`: slug do domínio, ex.: `payments`
- `documentation_path`: ex.: `./luciluci-docs/payments/`
- `execution_mode`: `startup`, `wave-1`, `wave-2`, `wave-3` ou `final-implementation`
- `scope`: RFs alvo da rodada atual

Se alguma dessas entradas não vier pronta, inferir com conservadorismo a partir do repositório e da documentação canônica.

## Leitura obrigatória inicial

Antes de alterar qualquer coisa, leia nesta ordem:

1. `AGENTS.md`
2. `AI_FIRST.md`
3. `ACTUAL_STATE.md`
4. `README.md`
5. `docs/`
6. `src/README.md`
7. `tests/README.md`
8. `docs/prompts/bootstrap-prompt.md`
9. `service-identity.json`
10. `./luciluci-docs/<servico>/` quando houver domínio real
11. documentação adicional do domínio (`prd.md`, `tdd.md`, `tp.md`, ADRs, contratos e runbooks), quando existir

## Fonte de verdade

Precedência:

1. regras transversais do template registradas neste repositório
2. `service-identity.json` para a identidade local do template/serviço
3. documentação canônica do domínio em `./luciluci-docs/<servico>/`
4. implementação viva do serviço atual
5. referências históricas

Se houver conflito entre template e domínio real:

- explicite o conflito
- preserve regras transversais do template quando forem realmente transversais
- adapte tudo o que for exemplo de domínio (`profile`) para o domínio real
- registre o impacto em `ACTUAL_STATE.md`

## Modo de trabalho

### Fase 0 — Bootstrap arquitetural do serviço

Antes de implementar RFs, materialize a identidade do novo serviço:

- `service-identity.json` atualizado e coerente com a derivação
- nome do microserviço
- bounded context
- aggregate roots / entidades centrais
- RFs encontradas e sua ordem de execução
- endpoints esperados
- eventos publicados e consumidos
- nomes de artefatos versionados (`openapi`, `asyncapi`)
- nomes de banco, filas, exchanges, variáveis de ambiente e seeds

Produza uma **matriz de renomeação obrigatória** cobrindo no mínimo:

- `standard-ms` -> `<novo-servico>`
- `standard_ms` -> `<novo-servico_ou_db_canônico>`
- `profile` / `profiles` -> `<domínio real>`
- `profiles-api.json` -> `<artifact-name>.json`
- `standard-ms-events.json` -> `<artifact-name>.json`
- `standard_ms` / `standard_ms_test` -> nomes reais do banco
- `RABBITMQ_PROFILE_EXCHANGE` -> nome real do exchange/env var
- exemplos de payload, nomes de eventos, filas, rotas, seeds e testes

### Fase 1 — Auditoria de resíduos do template

Audite antes de alterar:

- `src/**`
- `tests/**`
- `docs/**`
- `README.md`
- `AI_FIRST.md`
- `ACTUAL_STATE.md`
- `service-identity.json`
- `.github/workflows/**`
- `docker-compose*.yaml`
- `.env.example`
- `api.http`
- `scripts/**`

Mapeie todo resíduo de `profile`, `profiles`, `standard-ms`, `standard_ms` e nomes/examples antigos que precisem ser removidos ou substituídos.

## Fase 2 — Inventário e priorização das RFs

Monte a lista real de RFs somente a partir da documentação canônica.

Regras:

- não inventar RF
- não assumir endpoint por analogia sem documento
- não inflar o escopo com NFR compartilhado/upstream sem decisão explícita
- quando houver dependências entre RFs, explicitar a ordem

Priorize assim:

1. bootstrap estrutural do domínio
2. RFs fundacionais de escrita/persistência
3. RFs de leitura/listagem
4. publicação/consumo de eventos
5. endurecimento de contrato, seed, runbooks e evidências

## Fase 3 — Implementação em ondas

Trabalhe em ondas pequenas e auditáveis.

### Regras de execução

- Trabalhe **um RF por vez** ou um slice funcional pequeno e claramente acoplado.
- Mantenha código, testes, contratos, documentação, prompts e CI alinhados no mesmo ciclo.
- Atualize `ACTUAL_STATE.md` sempre que abrir ou concluir uma etapa relevante.
- Não misture geração de report com implementação.
- Não misture correção de drift com implementação de novas RFs.
- Pare ao encontrar ambiguidade crítica de domínio e registre objetivamente o bloqueio.

### Regra de saída por lote

Entregue mudanças em **lotes de 2 a 4 arquivos por vez**, salvo quando houver uma renomeação mecânica inevitavelmente maior no bootstrap inicial.

Para cada lote:

- informar os paths exatos
- entregar conteúdo final pronto para copiar e colar, ou replace-block exato
- explicar por que cada arquivo mudou
- incluir comandos de validação
- informar o resultado esperado
- encerrar aguardando confirmação do usuário (`OK_APPLIED`) antes do próximo lote, quando a execução for manual guiada

## Superfícies que devem andar juntas

### Se tocar API HTTP

Revisar também:

- controller/route
- DTO/validação
- OpenAPI
- `api.http`
- testes unit/integration/contract
- erro padronizado e `X-Correlation-ID`

### Se tocar eventos/mensageria

Revisar também:

- AsyncAPI
- event types / routing keys
- outbox / publisher / consumer
- idempotência de consumo
- testes de publicação/consumo/contrato

### Se tocar modelo físico ou persistência

Revisar também:

- migration incremental
- entities/schemas
- repositories
- seed
- testes de persistência/integration

### Se tocar documentação operacional

Revisar também:

- `README.md`
- `ACTUAL_STATE.md`
- `docs/runbooks/**`
- `docs/architecture/**`
- `docs/prompts/**` quando o processo herdado mudar

## Regras obrigatórias

- Não assumir; verificar.
- Não inventar requisito fora da documentação canônica.
- Não deixar resíduos de `profile` em serviços derivados.
- Não considerar a tarefa concluída se `api.http`, OpenAPI, AsyncAPI, testes e docs estiverem desatualizados.
- Não esconder ambiguidades de domínio.
- Preferir a menor mudança segura possível.
- Manter a estrutura reutilizável para serviços futuros.
- Em caso de handoff, deixar explícito o próximo lote recomendado.

## Critério de conclusão da wave

Uma wave só pode ser considerada concluída quando:

- o recorte da wave estiver explícito
- o lote atual estiver aplicado e consistente
- os artefatos tocados estiverem alinhados
- houver comando de validação claro
- `ACTUAL_STATE.md` refletir a etapa
- o próximo passo estiver explicitado

## Handoff para outras skills

### Quando concluir uma wave de implementação

O próximo passo natural é usar:

- `.codex/skills/report-review.md` para gerar o report da wave

### Quando o report apontar drift

O próximo passo natural é usar:

- `.codex/skills/drift-fix.md`
- `.codex/drifts/<NOME_DO_DRIFT>.md`

## Formato obrigatório da resposta

### CONTEXTO LIDO

- serviço alvo
- documentação usada
- modo de execução (`startup`, `wave-1`, etc.)
- RFs/scope da rodada

### AUDITORIA INICIAL

- resíduos do template encontrados
- conflitos ou ambiguidades encontrados
- decisão conservadora adotada, se houver

### LOTE ATUAL

- arquivos do lote
- conteúdo final ou patch pronto para copiar/colar
- motivo de cada alteração

### VALIDAÇÃO

- comandos para executar
- resultado esperado
- evidência mínima esperada

### ESTADO DA WAVE

- o que ficou concluído
- o que ainda falta nesta wave

### PRÓXIMO PASSO

- próximo lote prioritário
- skill seguinte recomendada, quando aplicável
