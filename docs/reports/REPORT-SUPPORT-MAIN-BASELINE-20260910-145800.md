# REPORT — baseline bootstrap + RF01 para `main`

**status:** `READY_FOR_MAIN_PUBLICATION`
**generated_by:** ChatGPT + evidência do checkout anexado
**generated_at:** 2026-09-10T14:58:00-03:00
**review_mode:** fechamento de baseline
**microservice:** support-ms
**repository_ref:** `main` / `3c387abe2d8f8c99bfa67273210de38b93ea6b10` no report RF01, com alterações locais ainda não publicadas
**documentation_ref:** `luciluci-docs` 0.3; referência registrada `76f77340897dc0916476410aed01a622ed796412`
**reviewer:** não informado

---

## 1. Fechamento

O primeiro baseline funcional do `support-ms` está delimitado por:

- S1 `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`;
- `DRIFT-SUP-S1-001` `RESOLVED / PROVEN`;
- RF01 `RF01_IMPLEMENTED_AND_PROVEN`;
- RF02–RF13 `NOT_IMPLEMENTED`;
- mensageria de Support não contratada/inativa;
- nenhuma rota funcional além de `POST /api/support/departments`;
- nenhuma evidência remota de publicação atribuída por este report.

Este fechamento não adiciona comportamento. Ele transforma o estado comprovado em
candidato explícito a `MAIN_BASELINE_RF01`.

## 2. Evidência herdada

A prova técnica detalhada permanece em:

- `REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md`;
- `REPORT-SUPPORT-RF01-20260910-174742.md`;
- evidências e scripts de prova referenciados por esses reports.

O report RF01 registra lint/build, entrypoints, OpenAPI, mensageria, 11 suítes /
48 testes, cobertura, PostgreSQL descartável, processo compilado, migrations,
rollback, Swagger, smoke da imagem e 404 das RF02–RF13. Este fechamento não
reexecuta nem reatribui essas evidências.

## 3. Pendências que não bloqueiam a publicação da baseline

- CI remoto ainda não foi comprovado para o HEAD local descrito no report RF01;
- 25 vulnerabilidades reportadas por `npm ci` permanecem para triagem separada;
- DEC-SUP de RF02 e slices posteriores continuam abertas;
- RF02–RF13 continuam deliberadamente ausentes.

Esses itens não alteram o status comprovado de S1/RF01, mas não devem ser
reinterpretados como concluídos.

## 4. Regra Git após publicação

A publicação desta baseline encerra desenvolvimento funcional direto em `main`.
RF02–RF13 devem ser trabalhadas em branches próprias, uma RF/slice por branch,
criadas de `main` sincronizada. A integração deve ocorrer apenas depois do
checkpoint contratual, implementação, provas e documentação do recorte.

Próxima branch recomendada, depois do checkpoint RF02:

```text
feat/support-rf02-update-department
```

## 5. Condição para declarar `main` publicada

Este report está `READY_FOR_MAIN_PUBLICATION`, não `PUBLISHED`, porque o arquivo
anexado não contém `.git` nem prova do remote do serviço. A publicação só pode ser
declarada após:

1. verificar que `origin/main` não avançou/divergiu;
2. garantir que qualquer alteração canônica em `luciluci-docs` esteja commitada e
   publicada em seu repositório independente;
3. executar os gates de publicação aplicáveis;
4. revisar o staging;
5. criar o commit do serviço;
6. `git push origin main` sem force;
7. comprovar que o SHA local é idêntico ao SHA remoto de `refs/heads/main`.

O procedimento está em
`docs/prompts/support-main-baseline-publication-prompt.md`.

## 6. Estado de saída pretendido

```text
main = MAIN_BASELINE_RF01
S1 = BOOTSTRAP_IMPLEMENTED_AND_PROVEN
RF01 = RF01_IMPLEMENTED_AND_PROVEN
RF02–RF13 = NOT_IMPLEMENTED
next = checkpoint RF02 -> branch própria
```
