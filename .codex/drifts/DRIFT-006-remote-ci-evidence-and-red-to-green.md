# DRIFT-006 — CI remoto no GitHub: evidência obrigatória no template + correção do workflow vermelho

## Título

Levar o workflow remoto `.github/workflows/ci.yml` do `standard-ms` de vermelho para verde no GitHub Actions e transformar essa exigência em regra explícita do template/report.

## Contexto

O `standard-ms` já possui um workflow de CI materializado com serviços de PostgreSQL e RabbitMQ, além de gates reais de:

- lint
- build
- export/validação OpenAPI
- compatibilidade backward OpenAPI
- validação AsyncAPI
- compatibilidade backward AsyncAPI
- test:coverage
- coverage:check

Isso prova **presença e intenção do gate** no repositório.

Porém, isso não prova que o CI remoto esteja verde no GitHub neste instante.

Neste caso específico, já foi confirmado operacionalmente que **o GitHub Actions está falhando**.

Além disso, como `standard-ms` é o template-base dos próximos microserviços, o processo de report/completude também precisa deixar explícito que:

- presença de `.github/workflows/ci.yml` não é prova suficiente
- a evidência correta exige **run remoto real**
- o report deve registrar **run URL, run ID, SHA, status e conclusion**

## Problema a ser corrigido

Hoje existem dois problemas relacionados:

### Problema 1 — runtime/execução remota

O workflow `ci` do `standard-ms` está vermelho no GitHub Actions e precisa ser levado para verde.

### Problema 2 — template/processo

O `REPORT-TEMPLATE.md` ainda não exige explicitamente prova remota de sucesso/falha do workflow, permitindo relatórios que registrem apenas intenção do gate sem execução remota comprovada.

## Objetivo

Executar uma rodada completa para:

1. identificar o último run remoto relevante do workflow `ci`
2. capturar evidência objetiva da falha remota:
   - run URL
   - run ID
   - attempt
   - branch/PR
   - head SHA
   - status
   - conclusion
   - job com falha
   - step com falha
   - trecho de log ou resumo do erro
3. identificar a causa real da falha
4. aplicar a menor correção segura necessária
5. rerodar o workflow
6. comprovar o run remoto verde
7. atualizar a documentação/template do `standard-ms` para que futuros microserviços herdem essa exigência de evidência remota

## Fonte de verdade

Usar como fonte de verdade, nesta ordem:

1. GitHub Actions remoto do repositório `standard-ms`
2. `.github/workflows/ci.yml`
3. `package.json`
4. scripts invocados pelo CI
5. `README.md`
6. `ACTUAL_STATE.md`
7. `docs/reports/REPORT-TEMPLATE.md`

## Escopo IN

Esta rodada pode tocar:

### Runtime / CI

- `.github/workflows/ci.yml`
- `package.json`
- scripts chamados pelo CI
- arquivos diretamente relacionados ao step que estiver falhando

### Documentação / template

- `README.md`
- `ACTUAL_STATE.md`
- `docs/reports/REPORT-TEMPLATE.md`
- `docs/reports/README.md`, se necessário para consolidar a regra
- documentação operacional local, se a falha estiver ligada a ambiente/infra do template

## Escopo OUT

Não resolver neste drift:

- refactor amplo do template
- redesign de arquitetura do serviço
- mudanças de domínio `profile`
- mudanças de RF do domínio derivado
- hardening extra não relacionado ao step falho
- ajustes em `luciluci-docs` de domínio real
- deploy/CD de ambiente

## Regras obrigatórias desta rodada

- Não assumir a causa do erro; identificar no run remoto.
- Não usar apenas inferência local para declarar o CI como verde.
- Não fechar o drift sem evidência remota do GitHub Actions.
- Se a falha for de configuração do workflow, corrigir a menor causa real.
- Se a falha for do projeto/template, corrigir a menor causa real.
- O `REPORT-TEMPLATE.md` deve passar a exigir explicitamente:
  - presença do workflow
  - e evidência remota real do run
- O template deve deixar explícito que:
  - “workflow versionado” != “CI comprovadamente verde”

## Evidência remota mínima obrigatória

Capturar e registrar:

- workflow: `ci`
- run URL
- run ID
- attempt
- branch/PR
- head SHA
- status
- conclusion
- job com falha
- step com falha
- trecho de log ou resumo do erro

## Escopo obrigatório de auditoria

Auditar no mínimo:

### GitHub / CI

- `.github/workflows/ci.yml`

### Execução local dos mesmos gates

- `package.json`
- scripts chamados pelo workflow

### Template/documentação

- `README.md`
- `ACTUAL_STATE.md`
- `docs/reports/REPORT-TEMPLATE.md`
- `docs/reports/README.md`

## Tabela obrigatória na resposta

Responder com uma tabela no formato:

| Item auditado | Estado atual | Evidência remota | Problema real? | Ação proposta |
| ------------- | ------------ | ---------------- | -------------- | ------------- |

Preencher no mínimo para:

- workflow `ci`
- job `quality`
- step com falha
- causa real da falha
- correção aplicada
- rerun final
- `REPORT-TEMPLATE.md`

## Critério de conclusão

Este drift só pode ser considerado concluído quando houver:

1. diagnóstico objetivo do run remoto com falha
2. correção mínima aplicada
3. nova execução remota concluída com sucesso
4. template/report atualizados para exigir evidência remota explícita

## Implementação esperada no template

O `REPORT-TEMPLATE.md` deve passar a orientar algo nesta linha:

- existe workflow versionado em `.github/workflows/ci.yml`
- registrar se há ou não run remoto comprovado
- quando houver:
  - run URL
  - run ID
  - SHA
  - conclusion
- quando não houver:
  - declarar explicitamente ausência de evidência remota
- quando houver falha:
  - declarar explicitamente que o CI remoto está vermelho

## Comandos de validação esperados

Usar GitHub CLI quando disponível:

- `gh run list --workflow ci.yml --limit 5`
- `gh run view RUN_ID --json databaseId,workflowName,headSha,status,conclusion,url,createdAt,updatedAt`
- `gh run view RUN_ID --verbose`
- `gh run view RUN_ID --log-failed`
- `gh run view RUN_ID --exit-status`

Localmente, conforme o step falho:

- `npm ci`
- `npm run lint`
- `npm run build`
- `npm run openapi:export`
- `npm run openapi:check`
- `npm run asyncapi:check`
- `npm run test:coverage`
- `npm run coverage:check`

## Resultado esperado

Após este drift:

- o `standard-ms` terá CI remoto comprovadamente verde para o run final analisado
- a causa real da falha atual terá sido corrigida
- o template deixará explícita a exigência de evidência remota
- futuros microserviços herdarão a regra correta:
  - presença do gate
  - prova remota do gate
  - distinção clara entre intenção e execução

## Output obrigatório

Responder obrigatoriamente com:

1. **RESUMO DO DRIFT**
2. **TABELA: item auditado -> estado atual -> evidência remota -> ação proposta**
3. **DECISÃO FINAL**
4. **ARQUIVOS ALTERADOS**
5. **IMPLEMENTAÇÃO REALIZADA**
6. **VALIDAÇÃO**
7. **DOCUMENTAÇÃO ATUALIZADA**
8. **PR PRONTA**
9. **PENDÊNCIAS OU RISCOS**

## PRONTA PARA HANDOFF

Se esta rodada for concluída, o próximo passo recomendado deve ser apenas:

- verificar se o `products-ms` precisa herdar a mesma regra de evidência remota no report atual
- ou abrir drift separado para outro gap real ainda vermelho no GitHub Actions

Não executar esse próximo drift nesta rodada.

## Estilo de execução

- Seja direto e técnico.
- Não pare na análise.
- Faça mudanças concretas.
- Traga caminhos de arquivos exatos.
- Traga conteúdo final pronto para copiar e colar.
- Não expanda para outros drifts.
