# microservice-builder-prompt

Use `.codex/skills/microservice-builder.md`.

Objetivo:
- transformar este repositório derivado do `standard-ms` em um microserviço real do ecossistema LuciLuci
- remover os resíduos do domínio de exemplo `profile`
- implementar o microserviço a partir da documentação canônica do domínio
- avançar RF por RF, em ondas, mantendo código, testes, contratos e docs alinhados

Parâmetros da execução:
- `microservice_name`: `<MICROSERVICE_NAME>`
- `domain_slug`: `<DOMAIN_SLUG>`
- `documentation_path`: `./luciluci-docs/<DOMAIN_SLUG>/`
- `execution_mode`: `<startup | wave-1 | wave-2 | wave-3 | final-implementation>`
- `scope`: `<RFs alvo desta rodada>`

Regras:
- leia primeiro:
  - `AGENTS.md`
  - `AI_FIRST.md`
  - `ACTUAL_STATE.md`
  - `README.md`
  - `docs/`
  - `src/README.md`
  - `tests/README.md`
  - `docs/prompts/bootstrap-prompt.md`
  - `./luciluci-docs/<DOMAIN_SLUG>/`
- trate `./luciluci-docs/<DOMAIN_SLUG>/` como fonte de verdade do domínio
- produza antes de codar:
  - auditoria de resíduos `profile` / `standard-ms`
  - matriz de renomeação obrigatória
  - ordem de execução das RFs
- trabalhe um RF por vez ou um slice pequeno claramente acoplado
- entregue em lotes de `2–4 arquivos` por vez, com paths exatos e conteúdo pronto para copiar/colar
- mantenha sempre alinhados no mesmo ciclo:
  - código
  - testes
  - OpenAPI / AsyncAPI
  - `api.http`
  - `ACTUAL_STATE.md`
  - docs tocadas pela mudança
- não gere report de completude nesta etapa
- não execute correção de drift nesta etapa
- quando concluir a wave atual, pare e indique explicitamente o próximo passo

Formato esperado da resposta:
1. `CONTEXTO LIDO`
2. `AUDITORIA INICIAL`
3. `LOTE ATUAL`
4. `VALIDAÇÃO`
5. `ESTADO DA WAVE`
6. `PRÓXIMO PASSO`
