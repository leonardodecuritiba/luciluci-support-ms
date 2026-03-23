# Skill: drift-fix

## Objetivo

Corrigir exatamente UM drift por vez neste projeto-template, com a menor mudança segura possível, alinhando:

- código
- testes
- contratos/specs
- documentação do microserviço/template
- documentação canônica em `luciluci-docs`, quando aplicável

## Modo de trabalho

1. Auditar o drift no código e na documentação.
2. Identificar se a correção deve ocorrer em:
   - código
   - testes
   - spec/contrato
   - documentação
   - ou combinação
3. Implementar a menor correção aderente.
4. Atualizar todos os documentos relevantes exigidos pelo projeto.
5. Validar a mudança com testes, comandos ou evidências objetivas.
6. Entregar resumo pronto para PR.

## Regras obrigatórias

- Não assumir; verificar.
- Não inventar requisito fora da documentação canônica ou das regras do template.
- Não resolver múltiplos drifts ao mesmo tempo.
- Não fazer refactor amplo fora do escopo.
- Sempre manter consistência entre implementação e documentação.
- Se houver conflito entre código e docs, explicitar o conflito e resolver conforme a fonte de verdade do projeto.
- Se houver ambiguidade pequena, tomar a decisão mais conservadora e documentar.
- Se houver bloqueio real, descrever exatamente o bloqueio e propor a menor saída segura.

## Checklist de auditoria

### Código

- Onde o comportamento atual está implementado?
- Há flags, regras antigas, resíduos de template ou workarounds?
- O drift afeta a reusabilidade do template por serviços futuros?

### Testes

- Há testes cobrindo o comportamento atual?
- Há testes desatualizados?
- Faltam testes para provar a decisão final?

### Contratos/specs

- OpenAPI está coerente?
- AsyncAPI está coerente?
- `api.http` está coerente?
- Docs operacionais estão coerentes?

### Documentação

- `README.md`
- `ACTUAL_STATE.md`
- `docs/**`
- `DRIFT_REPORT.md`
- `luciluci-docs/**`, quando aplicável
- prompts/skills/templates auxiliares, quando aplicável

## Regras por superfície

### Se tocar HTTP

Revisar:

- rotas
- validação
- status codes
- headers obrigatórios
- OpenAPI
- `api.http`
- testes unit/integration/functional/contract pertinentes

### Se tocar eventos

Revisar:

- contrato de evento
- payload
- versão
- publisher/outbox
- consumidor, se houver
- AsyncAPI
- testes de publicação/consumo

### Se tocar banco

Revisar:

- migration incremental
- entities/schemas
- repositories
- fixtures/helpers
- seeds
- testes de persistência

## Critério de conclusão

O drift só pode ser considerado fechado quando:

- a decisão final estiver explícita
- o código estiver aderente
- os testes relevantes estiverem aderentes
- os contratos/specs relevantes estiverem aderentes
- a documentação relevante estiver aderente
- a mudança estiver segura para ser herdada por serviços futuros
- houver validação objetiva ou comando claro de validação

## Formato obrigatório da resposta final

### RESUMO DO DRIFT

- o que era o problema
- qual foi a decisão adotada

### ARQUIVOS ALTERADOS

- lista exata de arquivos modificados
- breve motivo de cada alteração

### IMPLEMENTAÇÃO REALIZADA

- o que foi mudado no código
- o que foi mudado na documentação
- o que foi mudado nos testes/specs

### VALIDAÇÃO

- comandos executados ou sugeridos
- resultado esperado
- gaps restantes, se houver

### DOCUMENTAÇÃO ATUALIZADA

- quais documentos foram ajustados
- o que foi registrado neles

### PR PRONTA

- título da PR
- descrição da PR pronta para colar no GitHub

### PENDÊNCIAS OU RISCOS

- apenas se realmente existirem
