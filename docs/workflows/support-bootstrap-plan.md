# Plano de Bootstrap e Implementação — Support

- **Revisão:** 0.3 — 2026-09-10.
- **Status documental:** `RF01_IMPLEMENTED_AND_PROVEN / OTHER_RFS_PENDING`.
- **Status executado:** `BOOTSTRAP_IMPLEMENTED_AND_PROVEN / RF01_IMPLEMENTED_AND_PROVEN`.
- **Próximo lote:** checkpoint de RF02; não iniciar sem congelamento explícito.
- **Serviço-alvo:** `support-ms`; domínio: `support`.
- **Entrada atual:** [support-rf01-implementation-prompt.md](../prompts/support-rf01-implementation-prompt.md).
- **Entrada histórica S0 + S1:** [support-bootstrap-prompt.md](../prompts/support-bootstrap-prompt.md).

## Fechamento S1 e RF01 — precedência do estado atual

Os trechos de inventário/derivação abaixo preservam o planejamento original,
não instruem repetir S0 + S1. A execução anterior é histórica e o estado
corrente está em ACTUAL_STATE e no report de revisão.

Foi reproduzido e corrigido que `start`, `start:docker` e runners compilados
exigem `dist/main.js`/`dist/shared/...`. O build de produção usa raiz `src`; há
gate, PostgreSQL isolado, processo e imagem/CMD comprovados. A evidência está
no report de fechamento; não se confunde com execução remota CI.

O checkpoint canônico 0.3 congelou e a execução local comprovou RF01. A
revisão materializada do submódulo foi preservada. RF02–RF13 continuam sem
autorização de implementação.

## 1. Fronteira de entrega original

O patch finaliza a organização da documentação, não o código. O prompt seguinte
implementa a base técnica, sem transformar lacunas do PRD em decisões implícitas.
S0 inventaria o checkout; S1 retira Profile, materializa a identidade e valida
uma base operacional HTTP/PostgreSQL. A execução não termina em novo plano S0
e não avança automaticamente para RF01.

A condição de entrada não exige aprovar toda a semântica de mensagens,
paginação ou UIDs: nenhum desses contratos será exposto em S1. DEC-SUP-11
possui recorte técnico sem mensageria de domínio. Demais decisões só bloqueiam
a RF dependente. A conclusão documental não significa contrato funcional
integral congelado, bootstrap executado ou prontidão de produção.

## Execução S0 + S1 — 2026-09-10 (conforme report original)

S0 confirmou a raiz `support-ms`, a revisão fixa local de
`luciluci-docs` e a baseline documental 0.2; nenhum remoto, commit ou
submódulo foi avançado. S1 materializou a identidade Support, retirou Profile
e mensageria ativa, manteve HTTP/PostgreSQL/idempotência genérica e criou
OpenAPI somente operacional.

Evidências originais são históricas. O fechamento posterior adicionou build
limpo/check, PostgreSQL real, processo e imagem; a reprodução do defeito foi
resolvida sem apagar os registros anteriores.

## 2. Proveniência verificável

| Arquivo recebido                           | SHA-256                                                            |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `luciluci-standard-ms.tar.gz` — novo anexo | `d0d9d90dd2a0aa0d23f874761354f5d61879f90754dad896afa6ae797871ef98` |
| `luciluci-docs.tar(1).gz`                  | `b6435446343ffc779b09281300b506090dac670bbf83c9674809f5509ae2fb97` |
| `Suporte-20260910114337(2).md`             | `7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03` |

O hash do novo tar substitui o hash usado no pacote anterior. Os cinco
Markdown raiz avulsos coincidem com os do anexo atual. O tar não inclui `.git`
nem conteúdo do submódulo; não permite afirmar commit, branch ou revisão remota.
Registrar revisões reais somente na execução local. A análise não instalou
pacotes, executou migrations ou acessou ambientes remotos.

Os patches completos devem ser aplicados separadamente nas duas raízes.
A documentação canônica deriva do snapshot recebido anteriormente, pois o
novo anexo do template não inclui uma atualização de `luciluci-docs`.

## 3. Identidade técnica de S1

A matriz completa está em
[service-identity.md](../architecture/service-identity.md). Alvos:
`support-ms`, `support`, `Support (Suporte)`, `support_ms`, `support_ms_test`,
`docs/openapi/v1/support-api.json`, `api.http` e `./luciluci-docs/support/`.
Mensageria inativa exige identidade e consumidores adequados juntos; nenhuma
exchange ou AsyncAPI de negócio será inventada. Repositório remoto de destino
não foi comprovado nem será criado automaticamente.

## 4. Inventário inicial por path

Esta matriz é resultado de inspeção do **snapshot**, não prova do checkout do
usuário. S0 deve confirmar paths, referências cruzadas e alterações locais.

| Superfície observada                                                                                             | Papel/acoplamento                                          | Ação de S1                                                                                     | Prova exigida                               |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `service-identity.json`, `package.json`, `package-lock.json`                                                     | Identidade do template e paths antigos                     | Materializar alvo e alinhar lock sem upgrade amplo                                             | Assert de identidade/artefatos              |
| `src/app.ts`                                                                                                     | Monta `/profiles`; expõe operacionais e assets assíncronos | Retirar router, manter operacionais reais, resolver assets sem contrato                        | HTTP + contrato operacional                 |
| `src/main.ts`                                                                                                    | Conecta broker, inicia worker e consumer de classificação  | Startup HTTP/PostgreSQL sem wiring de exemplo                                                  | Processo real sem broker quando disponível  |
| `src/features/profile/`                                                                                          | Exemplo de domínio, inclusive classificação                | Retirar, sem converter em Ticket                                                               | Busca de imports + build + router negativo  |
| `src/shared/infrastructure/database/entities.ts`                                                                 | Registra Profile e schemas genéricos                       | Remover Profile; inventariar dependências dos schemas restantes                                | Catálogo/integração                         |
| `src/shared/infrastructure/database/migrations/1767990000000-CreateStandardMsBaseTables.ts`                      | Mistura Profile e infraestrutura                           | Substituir por baseline técnica só em derivação nova; não alterar histórico de banco existente | Migration em PostgreSQL novo isolado        |
| `src/shared/infrastructure/database/data-source.ts`, `data-source-test.ts`, runners                              | PostgreSQL vs SQLite; globs de migrations                  | Alinhar catálogo e processo sem contornar migration                                            | Diferenciar prova PG/SQLite                 |
| `src/shared/infrastructure/events/event-schema-registry.ts`, `event-types.ts`                                    | Importam contrato e nomes de eventos do exemplo            | Retirar acoplamento; ausência explícita de eventos ativos                                      | Build + teste sem-mensageria                |
| `src/shared/adapters/workers/outbox-event-publisher.worker.ts`, repositories/interfaces/schemas genéricos        | Capacidades herdadas                                       | Manter só componentes justificados e desacoplados; sem worker ativo                            | Grafo de dependência e teste genérico       |
| `src/shared/kernel/middlewares/*`, `src/shared/services/idempotency.service.ts`                                  | Kernel útil; error handler chama serviço de idempotência   | Preservar comportamento aplicável; não ativar contrato de escrita Support                      | Regressão do kernel                         |
| `src/shared/utils/env.ts`, logger/métricas                                                                       | Defaults/logs do template                                  | Adaptar identidade e dependências efetivas                                                     | Assert de configuração pública              |
| `src/shared/openapi/swagger.ts`                                                                                  | Swagger de Profile, extraído de anotações                  | Documentar operacionais reais; sem RF pendente                                                 | Export + check + contract                   |
| `scripts/export-openapi.js`, `check-openapi.js`                                                                  | Paths hardcoded; check exige ao menos um path              | Atualizar caminhos e validar operacionais                                                      | Artefato reprodutível sem relaxar validador |
| `scripts/check-asyncapi*.js`, `check-openapi-backward-compatibility.js`                                          | Validação/compatibilidade de contratos                     | Distinguir capacidade inativa de contrato ativo; primeira baseline Support                     | Testes dos validadores + CI                 |
| `docs/openapi/v1/profiles-api.json`, `docs/asyncapi/v1/standard-ms-events.json`, `docs/asyncapi/html/index.html` | Contratos/assets do exemplo                                | Retirar dos caminhos ativos; publicar somente contrato operacional real                        | Runtime, assets, scripts e CI coerentes     |
| `api.http`                                                                                                       | Coleção com Profile                                        | Somente endpoints realmente ativos de S1                                                       | Requests manuais/smoke                      |
| `scripts/seed.ts`                                                                                                | Gera Profile                                               | Bloquear seed de domínio antes de conectar/escrever; mensagem explícita                        | Teste sem side effects                      |
| `tests/helpers/test-helpers.ts`                                                                                  | Imports e limpeza de Profile                               | Desacoplar e preservar limpeza segura                                                          | Testes do bootstrap                         |
| `tests/unit/profile/`, `tests/integration/profile/`                                                              | Suítes do exemplo                                          | Retirar; não creditar a Support                                                                | Inventário + suítes reais S1                |
| `tests/integration/http/error-matrix.spec.ts`, `tests/integration/events/outbox-rabbitmq.spec.ts`                | Acoplamentos de HTTP/eventos                               | Adaptar ou substituir, preservando prova útil                                                  | Sem falso verde ou skips gerais             |
| `tests/contract/openapi/`, `tests/contract/asyncapi/`, helpers, `tests/unit/scripts/`, `tests/unit/shared/`      | Contratos de exemplo e testes genéricos                    | Separar/reter o que valida o serviço efetivo                                                   | Testes positivos e negativos                |
| `.env.example`, `docker-compose*.yaml`, `Dockerfile`, `.github/workflows/*`                                      | Nomes, broker, migration automática, publicação por tags   | Alinhar apenas o necessário; não executar publicação                                           | Configuração local isolada + gates          |
| `AGENTS.md`, `AI_FIRST.md`, ACTUAL_STATE, runbooks, READMEs, prompts e skills locais                             | Processo e descrições herdadas                             | Refletir evidências de S1; manter só histórico explícito                                       | Busca residual classificada                 |

Não executar substituição global. A localização em `shared/` não torna um
componente genérico. A retirada do exemplo pode exigir um conjunto maior de
arquivos que o lote genérico de 2–4: mantenha imports, scripts, CI e testes
coerentes no mesmo ciclo, sem refatoração fora desse objetivo.

## 5. Critérios técnicos de S1

### 5.1 HTTP e contrato

Health, métricas e documentação HTTP permanecem funcionais; nenhuma RF será
exposta. A OpenAPI descreve operacionais reais, pois o validador herdado rejeita
paths vazios. Não inventar endpoint funcional para satisfazer esse gate.
A primeira baseline de Support não é compatibilidade semântica com Profile.
Manter o comparador para evoluções futuras e verificar um contrato Support
prévio caso já exista no checkout.

O kernel de correlação continua obrigatório fora das isenções existentes;
prová-lo por rota sintética somente em teste. Requests negativos com ausência
de router devem fornecer correlação válida para não confundir 400 e 404.

### 5.2 Mensageria e dependências

S1 não depende de broker nem inicia consumer/publisher. Representação inativa
precisa de validação positiva de ausência de wiring/contratos de domínio.
N/A não é PASS. Bibliotecas genéricas podem ser preservadas quando justificadas,
sem nomes de eventos ativos do exemplo. Superfícies de documentação assíncrona
não podem servir o contrato Profile como se fosse Support.

### 5.3 Modelo e seed

Migrations somente de infraestrutura necessária, em banco novo isolado. Não
criar tabelas/modelo de RF antes de fechar suas decisões. A auditoria genérica
do template não é automaticamente AuditLog de tickets. Retirar seed Profile;
seed de domínio deve informar indisponibilidade e não conectar ou escrever.
A massa significativa continua requisito das waves de domínio, não de S1.

### 5.4 Qualidade

Testes de bootstrap próprios, regressão do kernel, ausência de Profile,
OpenAPI e identidade coerentes. Não afrouxar cobertura ou silenciar falhas.
Testes SQLite/in-process não comprovam PostgreSQL/processo real. Documentar
resultados por comando e bloquear só a evidência dependente do ambiente.

## 6. Fases e dependências

| Fase                            | Escopo                                                                           | Entrada                                                             | Saída                                              |
| ------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| D0 — Documentação 0.2           | PRD/TDD/TP, apoio, estado, plano e prompt                                        | Anexos                                                              | Patches Markdown validados; nenhum código alterado |
| S0 — Inventário local           | Git/submódulo, resíduos, consumidores e segurança                                | Baseline aplicada na cópia Support                                  | Matriz atualizada; seguir S1 na mesma rodada       |
| S1 — Bootstrap técnico          | Identidade, retirada do exemplo, kernel/infra, contrato operacional, testes e CI | S0 + prompt solicitado; banco isolado para provas de persistência   | Base técnica; RFs NOT_IMPLEMENTED                  |
| W1 — Departamentos              | RF01, RF02, RF03, RF04, uma por vez                                              | S1 e decisões contratuais aplicáveis                                | CRUD/soft delete, seed, contrato e provas próprias |
| W2 — Ticket inicial e consultas | RF05, RF09, RF07a, RF07b                                                         | W1; identidade, mensagem inicial, UIDs, dates e responses definidos | Atomicidade, auditoria única, consultas com ACL    |
| W3 — Evolução e mensagens       | RF06, RF08, RF10, RF11, RF12                                                     | Decisões de papéis, transferência, visibilidade, repetição          | Status independentes e auditoria exata             |
| W4 — Histórico e fechamento     | RF13, E2E/UAT e BFF                                                              | Escritas e decisões RF13                                            | Histórico autorizado e provas do fluxo completo    |
| R — Report/drift                | Evidência por recorte e gaps reais                                               | Provas das waves                                                    | Report → um drift por execução → novo report       |

Mensagem inicial e auditoria nascem com RF05, mesmo que suas listagens venham
depois. Não criar dependência circular W2/W3/W4. RF10 backoffice/cd preserva
as duas auditorias de nova mensagem; no-op de RF06 não redefine essa regra.

## 7. Segurança operacional

Conferir checkout de destino antes de editar: o repositório compartilhado do
template não é alvo. Preservar diffs locais, remotes e revisões. Submódulo é
outro repositório: sem atualização --remote, commit ou push automáticos.

Não exibir `.env`/credenciais, acessar produção/homologação, alterar banco
existente ou apagar volumes. O script `infra:down` recebido usa `down -v`;
não é cleanup seguro. `start:docker` executa migrations antes de iniciar;
validar alvo e isolamento antes de usá-lo. Não confiar apenas no nome do banco
ou em `NODE_ENV` como prova de isolamento. Teardown só de recursos desta execução.

Scripts de instalação/lifecycle e hooks devem ser inspecionados; preferir
lockfile e evitar atualização de dependências não solicitada. `npm run format`
reescreve a árvore; não usá-lo indiscriminadamente sobre mudanças do usuário.

## 8. Validação e estados

Comandos existentes a conferir após adaptação: lint, build, test:unit,
test:integration, test:contract, openapi:export, openapi:check, test:coverage,
coverage:check e git diff --check. Formatação focada nos arquivos alterados.
Testar contratos após exportar o artefato atual. Não existe test:functional no
package recebido; adicionar apenas junto de uma suíte real, quando necessário.

| Estado de execução S1                 | Critério                                                                                        |
| ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`    | Base técnica completa, gates aplicáveis e prova operacional PostgreSQL/processo real executados |
| `BOOTSTRAP_IMPLEMENTED_PENDING_PROOF` | Alterações técnicas concluídas; parte das provas não executada, identificada individualmente    |
| `BOOTSTRAP_INCOMPLETE`                | Derivação ainda parcial ou falha técnica não corrigida                                          |

Após S1, RF01 passou a `IMPLEMENTED_AND_PROVEN`; RF02–RF13 permanecem
`NOT_IMPLEMENTED`. Não chamar falha de teste de simples pendência de prova.
Reportar limite ambiental por caso; provas positivas isoladas não tornam os
demais RFs concluídos.

Gerar report com timestamp real no serviço, usando o template de reports e
explicitando recorte S1. Este documento é plano, não relatório de execução.
O pacote de patch inclui VALIDACAO.md somente de integridade documental.

## 9. Passagem para W1

S1 está `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. O checkpoint documental 0.3
congelou os recortes DEC-SUP-01/03/08/09/10 necessários à RF01, portanto o
primeiro slice de W1 está admitido.

RF01 foi executada com migration, contrato, testes, rollback e prova
PostgreSQL/processo real. O próximo lote continua sendo RF02, que exige novo
checkpoint das decisões que lhe são próprias; o fechamento de RF01 não libera
CRUD completo por inferência.
