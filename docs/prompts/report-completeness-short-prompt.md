# report-completeness-short-prompt

Use `.codex/skills/report-review.md`, `docs/prompts/report-completeness-prompt.md` e `docs/reports/REPORT-TEMPLATE.md`.

Gere ou atualize um report de completude em `docs/reports/REPORT-<timestamp>.md`.

Regras:

- leia primeiro:
  - `AGENTS.md`
  - `ACTUAL_STATE.md`
  - `README.md`
  - `docs/`
  - `src/README.md`, se existir
  - `tests/README.md`, se existir
  - `.codex/skills/report-review.md`
  - `docs/prompts/report-completeness-prompt.md`
  - `docs/reports/REPORT-TEMPLATE.md`
  - `docs/reports/README.md`
- quando houver documentação canônica de domínio ou documentação global do ecossistema em `luciluci-docs/`, use-a como fonte de verdade complementar
- compare documentação, implementação viva, contratos, testes, runbooks e CI
- mantenha todas as seções do template
- diferencie claramente:
  - comprovado por execução/evidência objetiva
  - inferido estruturalmente
  - bloqueado por ambiente/reprodutibilidade
- quando houver domínio real, monte obrigatoriamente:
  - a matriz principal RF x implementação
  - a matriz `RF -> unit / integration / functional`
- quando a tarefa for sobre template/processo, deixe explícito que a análise é de template e não simule RF de domínio inexistente
- classifique NFRs antes de chamar algo de gap local:
  - implementado localmente
  - upstream/plataforma
  - compartilhado
  - fora do escopo desta release
  - gap real local
- não trate a superfície operacional local herdada do template como RF do domínio
- não considere CI/CD comprovado apenas pela presença de workflow; registre evidência remota quando existir
- preencha o cabeçalho interno do report com:
  - `generated_by`
  - `generated_at`
  - `review_mode`
  - `microservice`
  - `repository_ref`
  - `documentation_ref`
  - `reviewer`, quando houver
