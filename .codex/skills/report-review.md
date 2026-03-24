# Skill: report-review

## Objetivo

Gerar ou atualizar um report de completude em `docs/reports/REPORT-<timestamp>.md`, usando obrigatoriamente:

- `docs/reports/REPORT-TEMPLATE.md` como esqueleto
- `docs/prompts/report-completeness-prompt.md` como prompt operacional
- regras do template em `standard-ms` como fonte de verdade principal
- `luciluci-docs/` quando a tarefa exigir validação contra documentação canônica de um domínio real ou contra documentação global do ecossistema

## Leitura obrigatória inicial

Antes de gerar o report, leia nesta ordem:

1. `AGENTS.md`
2. `ACTUAL_STATE.md`
3. `README.md`
4. `docs/`
5. `src/README.md`
6. `tests/README.md`
7. `docs/reports/README.md`
8. `docs/reports/REPORT-TEMPLATE.md`
9. `docs/prompts/report-completeness-prompt.md`
10. último `docs/reports/REPORT-*.md` relevante, se existir
11. `luciluci-docs/`, quando a tarefa exigir comparação com domínio real ou documentação global do ecossistema

## Modo de trabalho

1. Escolher o `review_mode` correto (`wave-1`, `wave-2`, `wave-3` ou `final`).
2. Inventariar template, código, contratos, testes, runbooks, CI e artefatos herdáveis.
3. Comparar o template com o estado real do repositório e, quando aplicável, com `luciluci-docs/`.
4. Preencher a matriz principal RF x implementação somente quando houver domínio real; caso contrário, registrar explicitamente a natureza de template/processo.
5. Montar a matriz obrigatória `RF -> unit / integration / functional` quando o domínio real exigir isso; no template, registrar a regra/processo herdável.
6. Classificar NFRs e capacidades transversais antes de registrar gaps locais.
7. Registrar explicitamente o que foi:
   - comprovado por execução/evidência objetiva
   - inferido estruturalmente
   - bloqueado por ambiente/reprodutibilidade
8. Gerar ou atualizar `docs/reports/REPORT-<timestamp>.md`.
9. Entregar um resumo pronto para revisão humana.

## Regras obrigatórias

- Não inventar RF, endpoint, evento ou requisito.
- Manter todas as seções do `REPORT-TEMPLATE.md`.
- Citar paths reais de código, testes, contratos, docs e workflows.
- Distinguir claramente:
  - `Implementado`
  - `Parcial`
  - `Não encontrado`
  - `Ambíguo`
- Classificar NFRs antes de chamar algo de gap local:
  - `implementado localmente`
  - `upstream/plataforma`
  - `compartilhado`
  - `fora do escopo desta release`
  - `gap real local`
- Não tratar a superfície operacional local herdada do template como RF do domínio.
- Não tratar o `standard-ms` como se ele provasse automaticamente RFs de qualquer domínio futuro.
- Não marcar CI/CD como comprovado apenas pela presença de workflow; registrar evidência remota quando existir.
- Não marcar a tríade `RF -> unit / integration / functional` como completa sem evidência explícita ou regra herdável objetiva.

## Checklist obrigatório de auditoria

### Template e processo

- `AGENTS.md`
- `AI_FIRST.md`
- `ACTUAL_STATE.md`
- `README.md`
- `docs/reports/**`
- `docs/prompts/**`

### Código e runtime do template

- `src/app.ts`
- `src/main.ts`
- `src/features/**`
- `src/shared/**`

### Contratos e operação

- `docs/openapi/**`
- `docs/asyncapi/**`
- `api.http`
- `docs/runbooks/**`

### Testes e pipeline

- `tests/unit/**`
- `tests/integration/**`
- `tests/contract/**`
- `.github/workflows/**`

### Documentação externa, quando aplicável

- `luciluci-docs/`

## Critério de conclusão

O report só pode ser considerado concluído quando:

- o cabeçalho obrigatório estiver preenchido
- a análise distinguir template/processo de domínio real
- a classificação NFR estiver explícita
- a rastreabilidade por RF estiver presente quando aplicável
- a diferença entre evidência executada e inferência estiver explícita
- os principais gaps, riscos e próximos passos estiverem claros

## Formato obrigatório da resposta final

### REPORT GERADO

- path do arquivo gerado/atualizado
- `review_mode`
- `repository_ref`
- `documentation_ref`

### FONTES CRÍTICAS USADAS

- principais docs, contratos, paths de código, testes e workflow

### PRINCIPAIS ACHADOS

- resumo direto dos gaps, ambiguidades, evidências e riscos

### BLOQUEIOS / INFERÊNCIAS

- o que não pôde ser comprovado
- o que foi inferido
- o que depende de ambiente ou evidência remota

### PRÓXIMO PASSO RECOMENDADO

- uma única próxima ação prioritária
