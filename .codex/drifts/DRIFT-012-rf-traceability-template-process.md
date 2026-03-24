# DRIFT-012 — Rastreabilidade mínima por RF no standard-ms: template e processo

## Título

Codificar no `standard-ms` como microserviços derivados devem provar a rastreabilidade mínima `1 unit + 1 integration + 1 functional` por RF, sem transformar isso em evidência falsa do próprio template.

## Contexto

O `standard-ms` já possui:

- testes unitários
- testes de integração
- testes de contrato
- fluxo de report/completude
- instruções AI-first e template de report

Mas o `REPORT-TEMPLATE.md` ainda deixa em aberto a cobrança:

- `Existe rastreabilidade mínima "1 unit + 1 integration + 1 functional" por RF`

Como o `standard-ms` é um template, a correção aqui não é “forçar prova universal no template”.  
A correção é ensinar corretamente que:

- cada serviço derivado deve montar sua matriz RF -> testes
- o report deve registrar isso explicitamente
- o template não deve induzir marcação arbitrária sem evidência

## Objetivo

Ajustar o template/processo para que serviços derivados herdem:

1. a exigência explícita de matriz RF -> unit/integration/functional
2. a forma correta de registrar exceções/agrupamentos
3. a regra de não marcar `[x]` sem evidência objetiva

## Fonte de verdade

Usar como fonte de verdade, nesta ordem:

1. `standard-ms/docs/reports/REPORT-TEMPLATE.md`
2. `standard-ms/docs/reports/README.md`
3. `standard-ms/README.md`
4. `standard-ms/ACTUAL_STATE.md`
5. `luciluci-docs/products/tp.md` como exemplo de exigência funcional por RF

## Escopo IN

Este drift pode tocar:

- `docs/reports/REPORT-TEMPLATE.md`
- `docs/reports/README.md`
- `README.md`
- `ACTUAL_STATE.md`
- `AI_FIRST.md`, se necessário reforçar a regra no processo

## Escopo OUT

Não resolver neste drift:

- refactor das suites do template
- criação artificial de RFs
- OpenTelemetry
- RabbitMQ resilience
- Schema Registry
- CI remoto

## Regras obrigatórias

- Não tratar o template como se ele já provasse a tríade para qualquer domínio futuro.
- Ensinar explicitamente no template como construir a matriz por RF.
- Permitir agrupamento/justificativa quando múltiplos RFs compartilham fluxo/teste.
- Não permitir `[x]` no report sem evidência explícita.

## Tabela obrigatória na resposta

| Item do template | Estado atual | Problema | Ação proposta |
| ---------------- | ------------ | -------- | ------------- |

Preencher no mínimo para:

- `REPORT-TEMPLATE.md`
- `docs/reports/README.md`
- `README.md`
- `ACTUAL_STATE.md`

## Critério de conclusão

A rodada só pode ser considerada concluída quando:

1. o template explicar como provar a tríade mínima por RF
2. o report herdável deixar de induzir marcação sem evidência
3. serviços derivados passem a ter instrução clara para montar a matriz RF -> testes

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
