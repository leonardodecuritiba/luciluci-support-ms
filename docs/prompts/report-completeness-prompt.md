# report-completeness-prompt

Use este prompt em conjunto com `.codex/skills/report-review.md` para gerar ou atualizar `docs/reports/REPORT-<timestamp>.md`.

```text
Use `.codex/skills/report-review.md` e `docs/reports/REPORT-TEMPLATE.md`.

Objetivo:
- gerar ou atualizar um report de completude em ondas
- comparar template, implementação viva, contratos locais, testes, runbooks e CI
- quando aplicável, comparar também com `luciluci-docs/` de domínio real ou documentação global do ecossistema
- registrar aderência, gaps, ambiguidades, riscos e próximos passos
- produzir um artefato humano de revisão rápida, sem substituir a fonte de verdade do projeto

Regras:
- manter todas as seções do template
- não inventar RF, endpoint, evento ou requisito
- citar paths reais de código, testes, contratos, docs e workflows
- distinguir claramente o que foi:
  - comprovado por execução/evidência objetiva
  - inferido estruturalmente
  - bloqueado por ambiente/reprodutibilidade
- quando houver domínio real, montar obrigatoriamente:
  - a matriz principal RF x implementação
  - a matriz `RF -> unit / integration / functional`
- quando a tarefa for sobre o template, deixar explícita a natureza de template/processo e não simular um domínio inexistente
- classificar NFRs antes de chamar algo de gap local:
  - `implementado localmente`
  - `upstream/plataforma`
  - `compartilhado`
  - `fora do escopo desta release`
  - `gap real local`
- não tratar a superfície operacional local herdada do template como RF do domínio
- gerar em modo `wave-1`, `wave-2`, `wave-3` ou `final`
- salvar o arquivo em `docs/reports/REPORT-<timestamp>.md`
- preencher o cabeçalho interno com:
  - `generated_by`
  - `generated_at`
  - `review_mode`
  - `microservice`
  - `repository_ref`
  - `documentation_ref`
  - `reviewer`, quando houver
```
