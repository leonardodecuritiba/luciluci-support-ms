# DRIFT-013 — api.http e seed robusto no standard-ms: materialização do template

## Título

Materializar no `standard-ms` a estratégia herdável de `api.http` e seed robusto, para que novos microserviços não herdem apenas a regra documental, mas também artefatos práticos de bootstrap.

## Contexto

O `standard-ms` já documenta corretamente que:

- todo microserviço derivado deve manter `api.http`
- o seed deve ser robusto
- o uso de `faker` é desejável
- a massa deve ser significativa

No entanto, o template atual ainda não materializa bem essa estratégia:

- não existe `api.http`
- o seed real do template ainda é pequeno e estático
- o processo/report ainda não ajuda suficientemente o serviço derivado a executar esse fechamento de bootstrap

## Objetivo

Tornar a estratégia herdável no template, garantindo que:

1. o `standard-ms` tenha um artefato/template de `api.http` ou orientação herdável equivalente
2. o template deixe explícito como o serviço derivado deve gerar `api.http`
3. o template deixe explícito como o serviço derivado deve evoluir `scripts/seed.ts` para massa realista com `faker`
4. o report/template cobre isso de forma objetiva

## Fonte de verdade

Usar como fonte de verdade, nesta ordem:

1. `README.md`
2. `scripts/README.md`
3. `ACTUAL_STATE.md`
4. `docs/reports/REPORT-TEMPLATE.md`
5. implementação viva do template

## Escopo IN

Este drift pode tocar:

- `README.md`
- `ACTUAL_STATE.md`
- `scripts/README.md`
- `docs/reports/REPORT-TEMPLATE.md`
- `docs/reports/README.md`
- `api.http` ou `api.http.template`, se essa for a menor solução segura
- `scripts/seed.ts`, se a decisão for materializar melhor o exemplo do template

## Escopo OUT

Não resolver neste drift:

- domínio real derivado
- api.http do products-ms
- seed do products-ms
- OpenTelemetry
- mensageria
- CI remoto

## Regras obrigatórias

- O template não deve só exigir `api.http`; deve orientar/materializar seu uso.
- O template não deve só exigir seed robusto; deve orientar/materializar a estratégia.
- Não forçar números específicos de outro domínio se isso fizer o template perder generalidade.
- Se usar exemplos, deixar explícito que volumes concretos devem ser definidos pelo domínio derivado.

## Tabela obrigatória na resposta

| Item do template | Estado atual | Problema | Ação proposta |
| ---------------- | ------------ | -------- | ------------- |

Preencher no mínimo para:

- `api.http`
- `scripts/seed.ts`
- `README.md`
- `scripts/README.md`
- `REPORT-TEMPLATE.md`

## Critério de conclusão

A rodada só pode ser considerada concluída quando:

1. o template materializar ou orientar claramente `api.http`
2. o template materializar ou orientar claramente seed robusto com faker
3. o processo herdável deixar isso explícito para serviços derivados

## Output obrigatório

1. **RESUMO DO DRIFT**
2. **TABELA: item do template -> problema -> ação proposta**
3. **DECISÃO FINAL**
4. **ARQUIVOS ALTERADOS**
5. **IMPLEMENTAÇÃO REALIZADA**
6. **VALIDAÇÃO**
7. **DOCUMENTAÇÃO ATUALIZADA**
8. **PR PRONTA**
9. **PENDÊNCIAS OU RISCOS**
