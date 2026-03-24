# drift-execution-short-prompt

Use `AGENTS.md`, `.codex/skills/drift-fix.md` e o drift descrito em `.codex/drifts/<NOME_DO_DRIFT>.md`.

Regras:

- leia primeiro:
  - `AGENTS.md`
  - `ACTUAL_STATE.md`
  - `README.md`
  - `docs/`
  - `src/README.md`, se existir
  - `tests/README.md`, se existir
  - `.codex/skills/drift-fix.md`
  - `.codex/drifts/<NOME_DO_DRIFT>.md`
- quando houver documentação canônica de domínio ou documentação global do ecossistema em `luciluci-docs/`, use-a como fonte de verdade complementar, conforme o escopo do drift
- resolva apenas o drift informado
- não resolva múltiplos drifts na mesma rodada
- aplique a menor mudança segura possível
- não invente requisito fora da fonte de verdade
- atualize código, testes, contratos/specs e documentação somente quando necessário
- valide com evidência objetiva
- responda no formato obrigatório definido pela skill e pelo próprio drift
- se o drift for apenas documental/processual/template, não implemente runtime sem evidência explícita de necessidade
