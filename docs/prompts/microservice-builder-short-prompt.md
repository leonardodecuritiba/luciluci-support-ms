# microservice-builder-short-prompt

Use `.codex/skills/microservice-builder.md`.

Transforme este repositório derivado do `standard-ms` em `<MICROSERVICE_NAME>`, usando `./luciluci-docs/<DOMAIN_SLUG>/` como fonte de verdade do domínio.

Modo atual: `<startup | wave-1 | wave-2 | wave-3 | final-implementation>`.

Regras:
- comece auditando resíduos de `profile`, `profiles` e `standard-ms`
- monte a matriz de renomeação obrigatória antes de implementar RF
- implemente RF por RF em ordem de prioridade documental
- trabalhe em lotes de até `4 arquivos` por vez
- entregue sempre com:
  - paths exatos
  - conteúdo pronto para copiar/colar
  - comandos de validação
  - resultado esperado
- mantenha alinhados no mesmo ciclo: código, testes, OpenAPI, AsyncAPI, `api.http`, `ACTUAL_STATE.md` e docs tocadas
- não gere report nesta etapa
- ao finalizar o lote, pare e aguarde `OK_APPLIED`
