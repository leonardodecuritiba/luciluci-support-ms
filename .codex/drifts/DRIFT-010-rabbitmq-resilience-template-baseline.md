# DRIFT-010 — RabbitMQ resilience no standard-ms: baseline herdável do template

## Título

Decidir e materializar no `standard-ms` a baseline herdável de resiliência RabbitMQ para microserviços derivados, com a menor mudança segura possível.

## Contexto

O `standard-ms` já materializa no template:

- RabbitMQ real
- exchange durável
- fila durável
- outbox publisher real
- consumer real de exemplo
- AsyncAPI versionado
- CI contratual

Por outro lado, ainda não materializa no runtime/template:

- DLQ
- TTL
- redrive
- retry exponencial de consumo
- política clara para poison messages

A documentação do template já registra isso como ausente:

- `docs/architecture/overview.md`
- `docs/runbooks/local-development.md`

O próximo passo é decidir se isso deve:

1. virar **capacidade herdável do template**, ou
2. continuar explicitamente **fora da baseline padrão**, ficando apenas documentado como opcional/futuro.

## Pré-condição obrigatória

Antes de executar este drift, leia a conclusão final do `DRIFT-007` e do `DRIFT-008` do `standard-ms`.

A resposta precisa declarar explicitamente uma destas decisões:

### Decisão A — Herdável no template

`DLQ / TTL / redrive / retry exponencial` permanecem como responsabilidade local herdável do template-base.

### Decisão B — Não herdável por padrão

Esses itens não entram na baseline padrão do `standard-ms` e devem permanecer apenas documentados como opcionais / futuros / dependentes de decisão do serviço derivado.

Sem essa decisão explícita, não avance.

## Objetivo

Se a decisão final for **A**, implementar a menor baseline herdável de resiliência RabbitMQ no `standard-ms`, garantindo:

1. mecanismo explícito de DLQ
2. política mínima de retry controlado
3. tratamento explícito de poison messages
4. estratégia de redrive documentada
5. documentação do template e report coerentes com a nova baseline

Se a decisão final for **B**, não implementar runtime; apenas ajustar docs/template/report para deixar isso inequívoco e não induzir gap padrão em serviços derivados.

## Fonte de verdade

Usar como fonte de verdade, nesta ordem:

1. conclusão final do `DRIFT-007` do `standard-ms`
2. conclusão final do `DRIFT-008` do `standard-ms`
3. `ACTUAL_STATE.md`
4. `README.md`
5. `docs/architecture/overview.md`
6. `docs/runbooks/local-development.md`
7. `docs/reports/REPORT-TEMPLATE.md`
8. implementação viva do template

## Escopo IN

Este drift pode tocar:

- `src/shared/infrastructure/rabbitmq/rabbitmq.service.ts`
- workers/consumers de exemplo
- utilitários de retry relacionados a consumo, se necessário
- testes de integração de mensageria
- `ACTUAL_STATE.md`
- `README.md`
- `docs/architecture/overview.md`
- `docs/runbooks/local-development.md`
- `docs/reports/REPORT-TEMPLATE.md`

## Escopo OUT

Não resolver neste drift:

- OpenTelemetry
- Schema Registry externo
- rate limiting
- suites de segurança/performance
- redesign completo do template
- mudança ampla do contrato AsyncAPI
- alterações em microserviços derivados

## Regras obrigatórias

- Não reclassificar a fronteira NFR nesta rodada.
- Não misturar este drift com OpenTelemetry.
- Se a decisão for “não herdável por padrão”, não implementar runtime.
- Se a decisão for “herdável”, implementar a menor baseline segura, sem complexidade excessiva.
- Não quebrar o fluxo atual do outbox publisher nem do consumer de exemplo.
- Não declarar concluído sem evidência objetiva.

## Itens obrigatórios de auditoria

Auditar no mínimo:

- `src/shared/infrastructure/rabbitmq/rabbitmq.service.ts`
- worker do outbox
- consumer de exemplo
- `src/shared/utils/retry.ts`
- `docs/architecture/overview.md`
- `docs/runbooks/local-development.md`
- `docs/reports/REPORT-TEMPLATE.md`

## Tabela obrigatória na resposta

Responder com uma tabela no formato:

| Item auditado | Estado atual | Decisão herdável? | Ação proposta |
| ------------- | ------------ | ----------------- | ------------- |

Preencher no mínimo para:

- DLQ
- TTL
- redrive
- retry exponencial
- poison message handling
- outbox publisher
- consumer de exemplo
- documentação do template
- `REPORT-TEMPLATE.md`

## Decisões obrigatórias que a resposta deve explicitar

Declarar explicitamente:

1. se RabbitMQ resilience entra ou não na baseline herdável do template
2. quais peças entram nesta rodada
3. se o redrive será:
   - implementado
   - apenas documentado
   - parcial
4. como o template deve instruir serviços derivados a reportar esse item

## Validação esperada

A rodada só pode ser considerada concluída quando houver evidência objetiva de uma destas saídas:

### Saída A — baseline herdável implementada

- existe tratamento explícito de falha/DLQ/retry no template
- testes/docs comprovam a baseline
- `REPORT-TEMPLATE.md` reflete a nova capacidade herdável

### Saída B — baseline não herdável

- documentação do template deixa isso explícito
- `REPORT-TEMPLATE.md` não induz mais esse item como gap local padrão
- serviços derivados passam a decidir esse item de forma explícita

## Comandos de validação esperados

Executar ou sugerir, conforme o workspace permitir:

- `npm run build`
- `npm run test -- --runTestsByPath tests/integration/events/...`
- `npm run asyncapi:check`
- grep objetivo em docs/template/report, se a rodada for só documental

## Resultado esperado

Após este drift:

- o `standard-ms` deixa explícito se RabbitMQ resilience faz ou não parte da baseline herdável
- o template deixa de induzir ambiguidade para serviços futuros
- o próximo serviço derivado não precisará reabrir essa mesma discussão do zero

## Output obrigatório

1. **RESUMO DO DRIFT**
2. **TABELA: item auditado -> estado atual -> decisão herdável -> ação proposta**
3. **DECISÃO FINAL**
4. **ARQUIVOS ALTERADOS**
5. **IMPLEMENTAÇÃO REALIZADA**
6. **VALIDAÇÃO**
7. **DOCUMENTAÇÃO ATUALIZADA**
8. **PR PRONTA**
9. **PENDÊNCIAS OU RISCOS**

## PRONTA PARA HANDOFF

Se a decisão final for implementar baseline herdável, o próximo passo recomendado deve ser apenas validar se o `products-ms` precisa absorver essa mesma baseline.

Se a decisão final for não implementar baseline herdável, o próximo passo recomendado deve ser apenas ajustar a forma como serviços derivados reportam esse item.

Não executar o próximo passo nesta rodada.

## Estilo de execução

- Seja direto e técnico.
- Não pare na análise.
- Faça mudanças concretas.
- Traga caminhos de arquivos exatos.
- Traga conteúdo final pronto para copiar e colar.
- Não expanda para outros drifts.
