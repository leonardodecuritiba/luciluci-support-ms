# DRIFT-011 — Schema Registry no standard-ms: separar registry local do template vs registry externo de plataforma

## Título

Codificar no `standard-ms` a distinção entre registry local derivado do AsyncAPI e Schema Registry externo do ecossistema, para que serviços derivados não herdem falso gap local.

## Contexto

A documentação global continua prevendo governança de contratos com Schema Registry, mas o template atual do `standard-ms` materializa apenas:

- AsyncAPI versionado no repositório
- helper local `event-schema-registry.ts`
- validação contratual local/CI

Isso não equivale a integração com Schema Registry externo.

Hoje o template ainda mistura essas duas coisas em alguns pontos, levando serviços derivados a herdarem a leitura de que a ausência de integração externa é um gap local automático.

## Objetivo

Corrigir o template/documentação para deixar explícito que:

1. `event-schema-registry.ts` é um **registry local derivado do AsyncAPI versionado**
2. `Schema Registry externo` pertence ao **ecossistema/plataforma**, salvo decisão explícita do serviço derivado
3. a ausência de integração externa **não deve ser reportada automaticamente como gap local do microserviço**
4. o `REPORT-TEMPLATE.md` deve ensinar essa classificação corretamente

## Fonte de verdade

Usar como fonte de verdade, nesta ordem:

1. `luciluci-docs/docs/development-guide.md`
2. `luciluci-docs/docs/architecture-and-service-bus.md`
3. `standard-ms/ACTUAL_STATE.md`
4. `standard-ms/README.md`
5. `standard-ms/docs/architecture/overview.md`
6. `standard-ms/docs/reports/REPORT-TEMPLATE.md`
7. implementação viva do template

## Escopo IN

Este drift pode tocar:

- `ACTUAL_STATE.md`
- `README.md`
- `docs/architecture/overview.md`
- `docs/reports/REPORT-TEMPLATE.md`

## Escopo OUT

Não resolver neste drift:

- integração real com Schema Registry externo
- mudanças em RabbitMQ
- OpenTelemetry
- rate limiting
- alterações em serviços derivados
- alteração de contratos AsyncAPI além do necessário para documentação

## Regras obrigatórias

- Não implementar runtime externo de registry nesta rodada.
- Não tratar registry local como se fosse registry externo.
- Não deixar o template induzir gap local automático para serviços futuros.
- Corrigir eventuais resíduos/copy-paste incorretos no `ACTUAL_STATE.md`.

## Itens obrigatórios de auditoria

Auditar no mínimo:

- `src/shared/infrastructure/events/event-schema-registry.ts`
- `ACTUAL_STATE.md`
- `README.md`
- `docs/architecture/overview.md`
- `docs/reports/REPORT-TEMPLATE.md`

## Tabela obrigatória na resposta

Responder com uma tabela no formato:

| Item auditado | Estado atual | Categoria correta | Ação proposta |
| ------------- | ------------ | ----------------- | ------------- |

Preencher no mínimo para:

- registry local derivado do AsyncAPI
- Schema Registry externo
- documentação de arquitetura
- ACTUAL_STATE
- REPORT-TEMPLATE

## Critério de conclusão

A rodada só pode ser considerada concluída quando:

1. o template separar claramente registry local vs registry externo
2. a ausência de integração externa deixar de ser tratada como gap local automático
3. o `REPORT-TEMPLATE.md` herdar essa política para serviços futuros

## Output obrigatório

1. **RESUMO DO DRIFT**
2. **TABELA: item auditado -> estado atual -> categoria correta -> ação proposta**
3. **DECISÃO FINAL**
4. **ARQUIVOS ALTERADOS**
5. **IMPLEMENTAÇÃO REALIZADA**
6. **VALIDAÇÃO**
7. **DOCUMENTAÇÃO ATUALIZADA**
8. **PR PRONTA**
9. **PENDÊNCIAS OU RISCOS**

## Estilo de execução

- Seja direto e técnico.
- Não pare na análise.
- Faça mudanças concretas.
- Traga caminhos de arquivos exatos.
- Traga conteúdo final pronto para copiar e colar.
- Não expanda para outros drifts.
