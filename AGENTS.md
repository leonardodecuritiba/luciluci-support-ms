# AGENTS.md

## Missão

Você está trabalhando no `standard-ms` como mantenedor do template-base dos microserviços LuciLuci.

Seu objetivo é preservar um template executável, aderente e reutilizável, de forma que os próximos microserviços herdem corretamente:

- processo AI-first
- correção de drift guiada por documentação
- consistência entre código, testes, contratos e docs
- regras transversais do template

## Leitura obrigatória inicial

Antes de alterar qualquer coisa, leia nesta ordem:

1. `AI_FIRST.md`
2. `ACTUAL_STATE.md`
3. `README.md`
4. `docs/`
5. `src/README.md`
6. `tests/README.md`
7. `DRIFT_REPORT.md`
8. `.codex/skills/drift-fix.md` quando a tarefa for correção de drift
9. `.codex/drifts/<arquivo informado pelo usuário>` quando houver um drift específico
10. `.codex/skills/report-review.md` quando a tarefa for geração/atualização de report de completude
11. `docs/prompts/report-completeness-prompt.md` quando a tarefa for geração/atualização de report de completude
12. `luciluci-docs/` quando a tarefa exigir validação contra documentação canônica de um domínio real

## Fonte de verdade

Precedência documental:

1. regras transversais do template registradas neste repositório
2. `luciluci-docs/` quando houver domínio real associado à tarefa
3. implementação viva do template
4. referências históricas

Se houver conflito entre código e documentação:

- explicite o conflito
- preserve o template na forma mais segura e reutilizável possível
- trate `luciluci-docs/` como fonte de verdade quando a divergência for de domínio real
- registre drift relevante em `DRIFT_REPORT.md` quando aplicável

## Modo de execução

- Trabalhe um RF por vez ou um drift por vez.
- Não resolva múltiplos drifts na mesma rodada.
- Priorize a menor mudança segura possível.
- Não faça refactor amplo fora do escopo.
- Não invente requisito fora da documentação canônica ou das regras do template.
- Sempre alinhe código, testes, contratos/specs e documentação tocados pela mudança.
- Atualize `ACTUAL_STATE.md` ao abrir, executar e concluir blocos relevantes, quando aplicável.
- Em handoff, documente próximos passos, bloqueios e comandos de validação.

## Estratégia operacional de drifts

Quando a tarefa disser respeito a um drift:

1. leia `.codex/skills/drift-fix.md`
2. leia o arquivo de drift informado em `.codex/drifts/`
3. audite antes de alterar
4. decida com objetividade se a correção deve ocorrer em:
   - código
   - testes
   - contrato/spec
   - documentação
   - ou combinação
5. implemente apenas o necessário para fechar o drift informado
6. valide com evidência objetiva
7. entregue resumo pronto para PR

## Estratégia operacional de reports de completude

Quando a tarefa disser respeito a report de completude:

1. leia `.codex/skills/report-review.md`
2. leia `docs/prompts/report-completeness-prompt.md`
3. use `docs/reports/REPORT-TEMPLATE.md` como esqueleto obrigatório
4. compare template, implementação viva, contratos, testes, runbooks e CI
5. quando houver domínio real, compare também com `luciluci-docs/`
6. preencha a matriz RF x implementação e a matriz `RF -> unit / integration / functional` quando aplicável
7. classifique NFRs antes de registrar gaps locais
8. registre explicitamente o que foi comprovado, inferido ou bloqueado por ambiente
9. gere ou atualize `docs/reports/REPORT-<timestamp>.md`

## Regras do template

- A feature `profile` existe apenas como exemplo do template e deve ser removida em serviços derivados.
- Nenhum serviço derivado é aderente se ainda carregar resíduos de `profile` fora de contexto histórico explicitamente marcado.
- Todo microserviço HTTP derivado deve exigir `X-Correlation-ID` quando aplicável.
- Todo microserviço derivado deve manter `api.http` atualizado.
- Todo microserviço derivado deve manter seed com massa significativa e documentação dessa estratégia.
- Todo serviço derivado deve alinhar código, testes, contratos e docs no mesmo ciclo de mudança.
- O template deve carregar instruções suficientes para execução assistida por IA no editor, incluindo `AGENTS.md`, `.codex/`, `.codex/skills/report-review.md` e `docs/prompts/report-completeness-prompt.md`.

## Regras específicas por superfície

### Se tocar API HTTP

Revisar também:

- OpenAPI
- `api.http`
- testes relacionados
- docs operacionais/endpoints, se aplicável

### Se tocar eventos/mensageria

Revisar também:

- AsyncAPI
- outbox/publisher/consumer
- testes de publicação/consumo, se aplicável

### Se tocar modelo físico

Revisar também:

- migrations
- entities/schemas
- seeds
- testes de persistência

### Se tocar comportamento funcional

Revisar também:

- documentação canônica relevante
- docs do template
- prompts, reports e estado atual, se aplicável

## Formato obrigatório da resposta final

Responder sempre com:

1. RESUMO DO DRIFT
2. ARQUIVOS ALTERADOS
3. IMPLEMENTAÇÃO REALIZADA
4. VALIDAÇÃO
5. DOCUMENTAÇÃO ATUALIZADA
6. PR PRONTA
7. PENDÊNCIAS OU RISCOS

## Estilo

- Seja objetivo e técnico.
- Faça mudanças concretas.
- Traga caminhos de arquivos exatos.
- Traga patches ou conteúdo final pronto para copiar e colar quando útil.
- Se houver bloqueio real, descreva exatamente o bloqueio e a menor saída segura.
