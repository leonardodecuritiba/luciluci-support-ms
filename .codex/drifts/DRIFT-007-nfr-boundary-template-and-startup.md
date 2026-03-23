# DRIFT-007 — Fronteira NFR no standard-ms: template, report e microservice-startup

## Título

Codificar no `standard-ms` a política de fronteira NFR entre microserviço e plataforma, para que novos serviços não herdem falsos gaps locais.

## Contexto

O `standard-ms` é a base do microservice-startup.  
Hoje, o template já materializa algumas capacidades locais e deixa outras ausentes, mas o processo/report ainda pode induzir a leitura errada de que todo NFR documentado globalmente precisa existir localmente em cada serviço.

Isso gera deriva recorrente em serviços derivados, como no `products-ms`, onde itens de plataforma podem aparecer como se fossem gaps do serviço.

## Objetivo

Fazer o `standard-ms` ensinar explicitamente:

- quais NFRs costumam ser **do serviço**
- quais NFRs costumam ser **de plataforma/gateway**
- quais NFRs são **compartilhados**
- quais exigem **decisão explícita por serviço derivado**
- como essa classificação deve aparecer no report de completude

## Fonte de verdade

Usar como fonte de verdade, nesta ordem:

1. `standard-ms` como template-base
2. `docs/reports/REPORT-TEMPLATE.md`
3. `AI_FIRST.md`
4. `ACTUAL_STATE.md`
5. `README.md`
6. `docs/architecture/overview.md`
7. `docs/runbooks/local-development.md`
8. `docs/runbooks/infra-access.md`
9. documentação global LuciLuci quando ela tratar responsabilidades de gateway/plataforma

## NFRs obrigatórios de classificação no template

No mínimo:

- rate limit
- tracing distribuído / OpenTelemetry
- Schema Registry externo
- registry local de eventos
- DLQ
- TTL
- redrive
- retry exponencial
- evidência automatizada de segurança
- evidência automatizada de performance/carga
- CDC / integração de streaming, se o template mencionar genericamente

## Escopo IN

Este drift pode tocar:

- `AI_FIRST.md`
- `ACTUAL_STATE.md`
- `README.md`
- `docs/architecture/overview.md`
- `docs/runbooks/local-development.md`
- `docs/runbooks/infra-access.md`
- `docs/reports/REPORT-TEMPLATE.md`
- `docs/reports/README.md`, se existir

## Escopo OUT

Não implementar nesta rodada:

- OpenTelemetry real
- DLQ real
- TTL real
- retry exponencial real
- rate limiting local
- suites de carga
- suites de segurança
- registry externo real

Esta rodada é de **template/processo/classificação**.

## Regras obrigatórias

- O template deve deixar explícito que presença em documentação global não implica obrigação local automática.
- O template deve orientar o agente a classificar o NFR antes de marcar gap.
- O `REPORT-TEMPLATE.md` deve separar:
  - implementado localmente
  - upstream/plataforma
  - compartilhado
  - fora do escopo desta release
  - gap real local
- A política deve ser herdável por microserviços novos sem precisar reabrir a mesma discussão.

## Tabela obrigatória na resposta

| NFR do template | Categoria padrão sugerida | Precisa decisão por serviço? | Como reportar no microserviço derivado? | Ação proposta |
| --------------- | ------------------------- | ---------------------------- | --------------------------------------- | ------------- |

Preencher no mínimo para:

- rate limit
- OpenTelemetry
- Schema Registry externo
- registry local de eventos
- DLQ/TTL/redrive/retry
- segurança automatizada
- performance/carga automatizada

## Critério de conclusão

A rodada só pode ser considerada concluída quando:

1. o template explicar explicitamente a fronteira NFR serviço vs plataforma
2. o `REPORT-TEMPLATE.md` deixar de induzir gaps locais indevidos
3. o processo de microservice-startup passar a herdar essa classificação

## Output obrigatório

1. **RESUMO DO DRIFT**
2. **TABELA: NFR do template -> categoria padrão -> ação proposta**
3. **DECISÃO FINAL**
4. **ARQUIVOS ALTERADOS**
5. **IMPLEMENTAÇÃO REALIZADA**
6. **VALIDAÇÃO**
7. **DOCUMENTAÇÃO ATUALIZADA**
8. **PR PRONTA**
9. **PENDÊNCIAS OU RISCOS**

## PRONTA PARA HANDOFF

Ao final, recomendar apenas quais NFRs devem virar drifts de implementação real em serviços derivados quando continuarem no escopo local.

## Estilo de execução

- Seja direto e técnico.
- Não pare na análise.
- Faça mudanças concretas.
- Traga caminhos exatos.
- Traga conteúdo final pronto para copiar e colar.
