# REPORT — Revisão de S1 e gate de continuidade

**status:** `BOOTSTRAP_INCOMPLETE / RF_NOT_IMPLEMENTED`
**generated_by:** ChatGPT — revisão do anexo, sem CI remoto
**generated_at:** 2026-09-10T16:14:32+00:00
**review_mode:** wave-2 / revisão focal de bootstrap
**microservice:** support-ms
**repository_ref:** snapshot `luciluci-support-ms.tar.gz`, SHA-256 `b78bf1a02c07104cedd45735539524ee736cc8be4d1163e38ff1e8d0d5bae930`; Git indisponível no anexo
**documentation_ref:** documentos locais do snapshot; PRD original anexado; baseline 0.2 anterior somente como histórico; submódulo atual não fornecido
**reviewer:** não informado

## 1. Resumo executivo

A derivação removeu o exemplo Profile do código-fonte e materializou a
identidade e a superfície operacional de Support. Nenhuma das 14 operações
de negócio foi implementada, conforme o recorte autorizado.

Entretanto, os quatro comandos compilados de startup/migration falham no
próprio entrypoint. A falta de prova PostgreSQL não é o único item aberto.
Pelo critério já existente no plano, uma falha técnica reproduzida classifica
S1 como `BOOTSTRAP_INCOMPLETE`, e não apenas `PENDING_PROOF`.

**Parecer:** manter a PR em revisão; solicitar correção de `DRIFT-SUP-S1-001`
antes do aceite de S1. Isso não invalida a retirada de Profile ou os testes
unitários/HTTP declarados. Não liberar RF01 neste lote.

A reprodução completa e os trechos-fonte numerados estão em
[evidências](evidence/SUPPORT-S1-REVIEW-20260910-161432.md).

## 2. Escopo, fontes e limites

Foram examinados package/scripts, tsconfig, build recebido, app/main,
DataSources/migration, testes, cobertura, OpenAPI, identidade, CI, Docker e
orientações/estado/relatório locais. Os números de linha nas evidências
referem-se ao snapshot antes deste patch.

O snapshot não inclui `.git`, `node_modules` ou `luciluci-docs`. O script
`compress.sh` exclui explicitamente o submódulo. Não é possível verificar
HEAD, branch ou revisão documental atual a partir do tar. Os SHAs citados
pelo report anterior continuam declarações daquele report, não leitura
independente desta revisão. A ausência no tar não comprova ausência no
checkout do usuário.

O PRD original anexado determina os métodos/paths usados para a errata de
rastreabilidade. A baseline canônica 0.2 entregue anteriormente é contexto
histórico, não substituição do submódulo atual. Nenhuma DEC-SUP é aprovada,
encerrada ou alterada por este patch.

## 3. Achados

| ID                     | Severidade / natureza             | Evidência                                                                                                                                                 | Impacto e tratamento                                                                                                      |
| ---------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| R01 / DRIFT-SUP-S1-001 | Alta; runtime/build               | package exige `dist/main.js` e `dist/shared/...`; tsconfig herda `rootDir: "."`; anexo contém `dist/src/...`; quatro comandos retornam `MODULE_NOT_FOUND` | Impede startup compilado, migration run/revert e CMD declarado da imagem. Aberto; correção e regressão no próximo prompt. |
| R02                    | Média; estado/instruções          | AGENTS ainda diz que código/identidade são template; plano e aliases encaminham a novo bootstrap/W1                                                       | Pode induzir rederivação ou avanço sem prova. Corrigido documentalmente neste patch, sem tocar runtime.                   |
| R03                    | Baixa; rastreabilidade contratual | RF08 aparece como `PATCH finish` na matriz original                                                                                                       | Fonte exige `POST /api/support/tickets/{ticketId}/resolve`. Errata documental da matriz; RF continua não implementada.    |

### R01 — reprodução independente

| Comando                         | Exit code | Resultado no anexo                                                    |
| ------------------------------- | --------- | --------------------------------------------------------------------- |
| `npm run start`                 | 1         | Ausência de `dist/main.js`                                            |
| `npm run migration:run:dist`    | 1         | Ausência de `dist/shared/infrastructure/database/run-migrations.js`   |
| `npm run migration:revert:dist` | 1         | Ausência de `dist/shared/infrastructure/database/revert-migration.js` |
| `npm run start:docker`          | 1         | Falha no runner compilado antes de chegar ao servidor                 |

Esses comandos não precisaram de `node_modules` porque falharam antes de
carregar a aplicação. Nenhuma migration, conexão ou escrita efetiva ocorreu.
A execução de `start:docker` foi no host da revisão e **não é smoke de imagem**.
O Dockerfile chama esse mesmo script; a cadeia declarada está inconsistente,
mas nenhuma imagem foi construída nesta revisão.

Causa localizada: `tsconfig.json:6` define raiz `.` e a inclusão em `:19`
abrange src/scripts/configuração; `tsconfig.build.json` só troca `outDir` e
exclusões. O artefato recebido preserva `src/` abaixo de `dist/`. A correção
sugerida é alinhar exclusivamente o build de produção aos entrypoints já
contratados, preservando o tsconfig de desenvolvimento/testes.

### Lacuna de prova — distinta do defeito

As suítes examinadas usam `data-source-test.ts` com SQLite `:memory:` e
`synchronize:true`. A CI provisiona PostgreSQL, mas os passos não executam
migration nem processo HTTP separado. PostgreSQL declarado no workflow e
`docker compose config` aprovado não comprovam essas execuções.

A prova futura deve usar migrations reais, `synchronize:false`, banco criado
exclusivamente para a execução e processo iniciado pelo comando compilado.
O checksum/summary de cobertura não substitui essa prova.

## 4. Matriz RF x implementação x testes

Métodos/paths abaixo vêm do PRD original. Nenhuma linha representa endpoint
registrado no runtime, exceto a superfície operacional descrita adiante.

| RF    | Método / path                                                           | Implementação   | Unit / integration / functional |
| ----- | ----------------------------------------------------------------------- | --------------- | ------------------------------- |
| RF01  | POST `/api/support/departments`                                         | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF02  | PATCH `/api/support/departments/{departmentId}`                         | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF03  | GET `/api/support/departments`                                          | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF04  | DELETE `/api/support/departments/{departmentId}`                        | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF05  | POST `/api/support/tickets`                                             | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF06  | PATCH `/api/support/tickets/{ticketId}`                                 | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF07a | GET `/api/support/tickets/requester/{requesterId}`                      | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF07b | GET `/api/support/tickets/admin/{adminId}`                              | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF08  | POST `/api/support/tickets/{ticketId}/resolve`                          | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF09  | GET `/api/support/tickets/{ticketId}`                                   | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF10  | POST `/api/support/tickets/{ticketId}/messages`                         | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF11  | PATCH `/api/support/tickets/{ticketId}/messages/{messageId}/visibility` | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF12  | GET `/api/support/tickets/{ticketId}/messages`                          | NOT_IMPLEMENTED | ausentes; fora de S1            |
| RF13  | GET `/api/support/tickets/history`                                      | NOT_IMPLEMENTED | ausentes; fora de S1            |

## 5. Checklist PRD / TDD / TP

- PRD: fonte preservada, 14 operações ainda não implementadas, sem mudança de
  enum, auditoria, visibilidade ou papel.
- TDD local: identidade materializada e base HTTP sem broker presentes; cadeia
  de produção quebrada por entrypoint, persistência PostgreSQL ainda sem prova.
- TP: testes S1 fornecidos não cobrem execução do entrypoint de produção. Novo
  gate de build e prova PostgreSQL/processo devem ser versionados e executados.
- Documentação canônica: o estado atual só pode ser conferido no submódulo real;
  não é atestado por esta inspeção do tar.

## 6. Superfícies e fronteira NFR

| Superfície/capacidade                                | Evidência e limite                                                                                             |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `/health`, `/metrics`, `/api-docs`, `/api-docs-json` | Registrados em app.ts e OpenAPI; runtime externo não reexecutado nesta revisão.                                |
| `api.http`                                           | Presente, com superfície operacional; não creditado como execução manual.                                      |
| Seed                                                 | Código lança erro antes de acessar banco; teste declarado no report, não reexecutado aqui.                     |
| Mensageria                                           | Identidade inativa e ausência de wiring/feature/assets verificadas; `messaging:check` reexecutado com sucesso. |
| Idempotência genérica                                | Serviço/schema/migration presentes; prova PostgreSQL/replay permanece pendente.                                |

| Item                                | Fronteira                          | Situação                                                                 |
| ----------------------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| Entry points / build / processo     | local                              | falha técnica reproduzida R01                                            |
| Migration / PostgreSQL              | local                              | prova pendente, sem execução nesta revisão                               |
| Logs / erro / correlação / métricas | local                              | presentes; suítes declaradas, não reexecutadas aqui                      |
| Autenticação do BFF / papel amplo   | upstream e interface compartilhada | decisões aplicáveis a RF01 devem ser verificadas; sem implementação nova |
| Broker / AsyncAPI / eventos         | não aplicável ao S1                | não reintroduzir sem requisito                                           |
| Carga, segurança ofensiva e CDC     | fora deste lote                    | não promovidos a novos gaps de S1                                        |

## 7. Validação independente e evidência fornecida

Reexecutados: os quatro entrypoints com falha, `messaging:check` (PASS) e
`coverage:check` (PASS sobre o JSON recebido), além de inventário/inspeção.
Node usado: v22.16.0. Sem Docker ou PostgreSQL disponíveis nesta revisão.

O summary recebido contém linhas/declarações 95,83%, funções 96,96%, branches
77,08%; o checker só valida os números fornecidos. As 8 suítes/25 testes e os
gates lint/build/OpenAPI/Compose aprovados são declarações do report entregue,
não foram reexecutados independentemente. Não há prova nova de cobertura.
`src/main.ts` está excluído em `jest.config.ts`; o summary fornecido tampouco
comprova runners/migrations de produção.

Nenhum npm ci, build limpo, Jest, Docker, banco, seed ou CI remoto foi executado
nesta revisão. O comando auxiliar `tsc --showConfig` usou versão global distinta
da fixada no lock e não é prova de compilação. O defeito está comprovado pela
combinação de paths configurados, artefatos recebidos e erro no próprio arquivo
alvo; o próximo prompt exige build limpo na versão fixada e regressão RED/GREEN.

## 8. Alterações desta entrega

Somente Markdown: estado, drift, instruções, plano, navegação, aviso nos
prompts históricos, runbook, errata contratual do report anterior, este report,
evidência e prompt de execução local. Nenhum arquivo TypeScript, JavaScript,
JSON, YAML, Dockerfile, lockfile ou contrato executável foi alterado.

O report anterior mantém autor, timestamp, versões declaradas, evidências e
conclusão original sob aviso de superação. Apenas sua matriz recebe errata de
métodos/paths, sem falsificar execuções anteriores.

## 9. Decisões e admissão de RF01

Depois de fechar S1, conferir no checkout real as decisões aplicáveis a RF01.
Na baseline 0.2 histórica, isso abrangia DEC-SUP-01 (identidade), 03 (papel/ação),
08 (responses/validações), 09 (UIDs) e 10 (idempotência). Referências precisam
ser confirmadas no submódulo atual; nenhuma aprovação foi fornecida nesta revisão.

Questões exclusivas de RF03/paginação, transferência ou mensagens não impedem
corrigir os entrypoints, e não devem ser fechadas por conveniência deste lote.

## 10. Próxima execução e critérios de saída

Executar [o prompt focal](../prompts/support-s1-dist-and-proof-prompt.md):
reproduzir, alinhar build e entrypoints, criar regressão/gate, provar migration
PostgreSQL e processo real, separar smoke da imagem e atualizar as evidências.

`BOOTSTRAP_INCOMPLETE` enquanto houver falha técnica; `PENDING_PROOF` apenas
quando a correção e os gates disponíveis passarem e faltarem provas nominadas;
`AND_PROVEN` somente com evidência aplicável real. Um aceite limitado ao host
não deve ser apresentado como imagem Docker validada. RFs seguem não implementadas.

## 11. Conclusão

A base foi derivada, mas S1 não está tecnicamente fechado. A correção é
localizada e não exige novas decisões de produto. Prioridade: R01 → provas
isoladas de S1 → checkpoint documental de RF01 → implementação de RF01 em
lote posterior explicitamente solicitado. Não avançar para RF02–RF13.
