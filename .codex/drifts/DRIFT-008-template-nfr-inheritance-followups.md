# DRIFT-008 — standard-ms: herança de NFRs locais no template

## Título

Materializar no `standard-ms` apenas os NFRs que o template decidiu manter como capacidades locais herdáveis por microserviços futuros.

## Contexto

Após o DRIFT-007 do `standard-ms`, o template deve ter deixado claro o que pertence à plataforma e o que pode/precisa ser herdado localmente por serviços derivados.

Este drift existe para evoluir o template apenas nos itens que continuarem como responsabilidade local padrão ou opcional fortemente recomendada.

## Pré-condição obrigatória

Antes de executar este drift, deve existir uma conclusão explícita do `DRIFT-007` do `standard-ms` classificando os NFRs do template.

## Objetivo

Materializar no template apenas os NFRs que permanecerem como responsabilidade local herdável, por exemplo:

- hooks mínimos de OpenTelemetry, se essa for a decisão
- contratos e runbooks de resiliência de mensageria, se isso continuar local
- seções obrigatórias de evidência de segurança/performance no template, se essa for a decisão

## Regra obrigatória

Não transformar em capacidade local padrão aquilo que o DRIFT-007 classificou como plataforma/upstream.

## Tabela obrigatória

| NFR do template | Decisão do DRIFT-007 | Precisa materialização no template? | Ação proposta |
| --------------- | -------------------- | ----------------------------------- | ------------- |

## Output obrigatório

1. **RESUMO DO DRIFT**
2. **TABELA**
3. **DECISÃO FINAL**
4. **ARQUIVOS ALTERADOS**
5. **IMPLEMENTAÇÃO REALIZADA**
6. **VALIDAÇÃO**
7. **DOCUMENTAÇÃO ATUALIZADA**
8. **PR PRONTA**
9. **PENDÊNCIAS OU RISCOS**
