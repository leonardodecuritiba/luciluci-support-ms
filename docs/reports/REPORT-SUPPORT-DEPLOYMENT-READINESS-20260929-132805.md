# REPORT — Checkpoint de prontidão para ambiente, UAT e deploy

- **status:** `DEPLOYMENT_READINESS_BLOCKED_BY_ENVIRONMENT_DECISION / NO_DEPLOY`
- **generated_by:** Codex
- **generated_at:** 2026-09-29T13:28:05Z
- **review_mode:** final (checkpoint pré-release)
- **microservice:** support-ms
- **repository_ref:** `docs/support-deployment-readiness-checkpoint`, base `main=origin/main=5caa7713ab40b64e9b499cf5bcbaf84645415200`
- **documentation_ref:** Support 0.15, gitlink `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`
- **report_file:** `docs/reports/REPORT-SUPPORT-DEPLOYMENT-READINESS-20260929-132805.md`
- **reviewer:** checkpoint documental; owner de ambiente/UAT e autoridade de deploy ainda não identificados

---

# 1. Resumo executivo e estado atual

`main` está no merge documental da [PR #18](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/18), `5caa7713ab40b64e9b499cf5bcbaf84645415200` (parents `1c1348d` e `ddff19d`). A [PR #17](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/17) integrou a seed W1 em `1c1348d`; seu head `cb92228` passou na [CI 36478828865](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36478828865). O head documental `ddff19d` passou na [CI 36494457557](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36494457557). RF01–RF13 permanecem 14/14 operações implementadas, provadas e integradas; W1 está integrada para uso **somente em banco descartável local/CI**. Support 0.15 e seu gitlink estão fixos.

O serviço tem imagem construída/provada em CI, OpenAPI, migrations e métricas. O workflow `cd-support` **publica imagem no GHCR quando uma tag `v*` é enviada; não implanta o serviço**. Nenhum ambiente real, banco alvo, fronteira BFF, secrets, estratégia de migration/rollback, operação de observabilidade ou responsável por UAT foi identificado nos artefatos lidos. Não há evidência de deploy nem aceitação de produção. Veredito: **`DEPLOYMENT_READINESS_BLOCKED_BY_ENVIRONMENT_DECISION`**; nenhuma tag, release, imagem deliberadamente publicada ou deploy foi criado neste checkpoint.

| Área                | Estado                                                     | Evidência                                              | Blocker para deploy?                   |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------- |
| Código RF01–RF13/W1 | Integrado e provado em CI                                  | PRs #17/#18, runs acima, report final RF13/W1          | Não para preparação                    |
| Build de imagem     | Provado por smoke em CI                                    | `Dockerfile`, `proof:s1:image`, CI #18                 | Não para preparação                    |
| CD                  | Publicador GHCR por tag; sem deploy                        | `.github/workflows/cd.yml`                             | Exige método/owner de deploy           |
| Ambiente/plataforma | Não definidos                                              | `infra-access.md` só descreve localhost                | Sim                                    |
| PostgreSQL real     | Não definido                                               | `.env.example` e compose são locais; CI usa DB próprio | Sim                                    |
| Migrations          | Entrypoint executa em cada startup                         | `Dockerfile`, `package.json`                           | Sim antes de escalar                   |
| Secrets/TLS         | Fonte e valores de ambiente não definidos                  | `env.ts`, `data-source.ts`                             | Sim                                    |
| Rede/BFF trust      | Headers aceitos como identidade; fronteira não provada     | `app.ts`, `performed-by.middleware.ts`, dependencies   | **Sim, segurança**                     |
| Health/readiness    | `/health` 200 com `isInitialized`, sem query DB            | `src/app.ts`                                           | Exige probe e interpretação explícitas |
| Métricas/logs       | Endpoints e logger locais existem; coleta/alertas ausentes | `/metrics`, Pino; sem infra alvo                       | Sim para GO                            |
| Rollback            | Image anterior/owner/DB recovery não definidos             | Migrations `down` removem tabelas                      | Sim                                    |
| UAT                 | TP tem cenários planejados; execução/aceite ausentes       | `luciluci-docs/support/tp.md`                          | Sim para GO                            |

# 2. Escopo, fontes e evidência

Lidos: `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`, `AGENTS.md`, `AI_FIRST.md`, reports finais RF13/W1, `docs/runbooks/{infra-access,local-development}.md`, `.github/workflows/{ci,cd}.yml`, `Dockerfile`, `docker-compose{,-dev}.yaml`, `.env.example`, `package.json`, `service-identity.json`, OpenAPI versionada, `src/{app,main}.ts`, `src/shared/utils/env.ts`, DataSource, migrations e middlewares de headers. O PRD/TDD/TP/dependencies Support foram consultados no gitlink 0.15 para UAT e fronteira BFF. A informação de CI da PR #18 foi confirmada remotamente no run `36494457557`, job `quality`, `completed/success`; não se confunde presença de workflow com execução real.

Este checkpoint lê código e GitHub, sem iniciar serviço, banco, seed, CD ou deploy. Um smoke de imagem em CI prova CMD em PostgreSQL descartável, **não** a segurança do startup em múltiplas réplicas nem a prontidão do banco real. O arquivo `docs/runbooks/infra-access.md` descreve apenas localhost; não é inventário de infraestrutura remota.

Na consulta deste checkpoint, o usuário confirmou em 2026-09-29 que ambiente alvo, plataforma e owner de deploy estão **indefinidos por enquanto**. As decisões DEPLOY-01/02 não são inferidas de exemplos de infraestrutura.

# 3. Matriz RF x implementação e fronteira da release

O [fechamento RF13](REPORT-SUPPORT-FINAL-CLOSURE-20260928-174429.md) contém a matriz individual RF→código/contrato/testes. Este checkpoint preserva essa baseline: RF01–RF04 em `src/features/department/**`, RF05–RF13 em `src/features/ticket/**`, OpenAPI em `docs/openapi/v1/support-api.json`, provas PostgreSQL `scripts/prove-rf01-postgres.js` a `prove-rf13-postgres.js`. RF07a e RF07b contam separadamente, totalizando 14 operações. W1 é tooling, não RF/rota. Nenhum runtime, contrato ou teste RF foi reaberto/modificado.

| Recorte   | Evidência já executada                                | Falta para aceite de ambiente                         |
| --------- | ----------------------------------------------------- | ----------------------------------------------------- |
| RF01–RF13 | Unit/integration/contract, proofs PostgreSQL e CI #18 | UAT com BFF, dados e rede do alvo                     |
| W1        | Proof local/CI, CI #17/#18                            | Não executar em ambiente real                         |
| Operação  | Imagem/CMD em CI, métricas e health locais            | Deploy controlado, monitoramento, rollback e go/no-go |

# 4. Checklist PRD e segurança de acesso

- [x] 14 operações do PRD integradas sob `/api/support/*`; nenhuma RF adicional neste lote.
- [x] ACL fina por ownership/membership é responsabilidade do Support; autenticação ampla e identidade confiável são upstream/BFF, conforme `luciluci-docs/support/dependencies.md`.
- [ ] Fronteira de rede/identidade serviço a serviço comprovada no ambiente alvo. `performed-by.middleware.ts` apenas lê `X-Performed-By`/`X-Performed-By-Type`; `app.ts` usa `cors()` sem política de origem explícita. Exposição pública direta permitiria forjar identidade de ator.
- [ ] Contrato BFF real comprovado com os headers canônicos e caminhos Support. Desenho histórico de BFF Admin em dependencies é especulativo; aliases `X-Caller-*` não são contrato ativo.

# 5. Checklist TDD, CD, runtime e migrations

- [x] `cd-support` dispara em `push` de tag `v*`, faz checkout, buildx, login GHCR e build/push das tags `ghcr.io/${repository}:${ref_name}` e `:sha-${sha}`. **Não há job de deploy, migrations, smoke ou rollback no CD deste repositório.** A existência de pipeline externo ainda não foi comprovada.
- [x] `Dockerfile` usa `CMD ["npm","run","start:docker"]`; esse script roda `migration:run:dist` e só depois `node dist/main.js`. Logo, **cada container** iniciado tenta migrations.
- [ ] Política para exatamente uma execução controlada de migrations por release, antes de novas réplicas servirem tráfego. Preferência técnica para avaliação: job/pre-deploy único e comando de app puro por override do orchestrator. Manter migration no startup só após prova de segurança para concorrência de réplicas, falha e rollback. Nenhuma opção foi implementada ou aprovada aqui.
- [x] As migrations atuais criam `idempotency_keys`, Departments/memberships, Ticket/Message/Media/AuditLog e sequence. Seus métodos `down` derrubam tabelas/sequence; `migration:revert` **não** é rollback automático seguro em banco com dados. Preferir análise por release e forward-fix/restauração controlada quando apropriado, após aprovação do DB owner.
- [ ] Banco alvo, versão, role, TLS, limites, backups/PITR e janela de mudança definidos. `data-source.ts` não configura SSL/TLS explicitamente; compatibilidade com PostgreSQL gerenciado que exija TLS depende do alvo e pode requerer mudança futura.
- [ ] `NODE_ENV=production`, `SERVER_PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e fonte de secrets injetados/validados no ambiente. `env.ts` possui fallbacks locais e `.env.example` valores de desenvolvimento; não tratá-los como configuração segura de release.

# 6. Checklist TP, UAT e provas no ambiente

Os casos abaixo **são plano, não testes executados**. Escolher target, owner, atores e massa autorizados antes da execução. Operações com escrita devem rodar em ambiente UAT controlado; em produção, usar smoke não destrutivo e procedimento aprovado. Enviar `X-Correlation-ID` UUID em todas as rotas de negócio; para RFs que exigem ator, BFF envia `X-Performed-By` e `X-Performed-By-Type` canônicos. Conferir body exato com OpenAPI 0.15 e registrar request/response com dados sensíveis ocultados, ator, horário, build SHA e evidência DB/audit.

| RF    | Ator/pré-condição                                     | Request UAT                                                                     | HTTP/campos críticos esperados                           | Efeito persistente/auditoria                                               |
| ----- | ----------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| RF01  | Admin amplo via BFF; namespace UAT                    | `POST /api/support/departments` com `name,type,allowedUserIds`                  | `201`, Department `id,active=true,allowedUserIds`        | Department+membership; sem AuditLog                                        |
| RF02  | Admin amplo; Department de RF01                       | `PATCH /api/support/departments/{departmentId}` com name/membership             | `200`, campos atualizados; omissões preservadas          | Membership substituída apenas se enviada; sem AuditLog                     |
| RF03  | Ator autorizado no BFF; Department ativo/inativo      | `GET /api/support/departments?page=1&size=20`                                   | `200`, `data,pagination`, só ativos                      | Nenhum write                                                               |
| RF04  | Admin amplo; Department sem perda de Ticket           | `DELETE /api/support/departments/{departmentId}`                                | `204`, sem body; repetir `204`                           | `active=false`, membership preservada; sem AuditLog                        |
| RF05  | Requester backoffice/cd; Department ativo             | `POST /api/support/tickets` com `message` inicial                               | `201`, Ticket `id,number,adminStatus,requesterStatus`    | Ticket+Message inicial+1 `criacao_ticket` atômicos                         |
| RF06  | Admin membro ou requester dono; Ticket existente      | `PATCH /api/support/tickets/{ticketId}` com `priority/departmentId/adminStatus` | `200`, Ticket completo; ACL atual                        | Só mudança efetiva de adminStatus cria `alteracao_status`; no-op sem write |
| RF07a | Requester dono; Ticket próprio e alheio               | `GET /api/support/tickets/requester/{requesterId}`                              | `200`, `data,pagination`, nenhum Ticket alheio           | Nenhum write                                                               |
| RF07b | Admin membro e não membro                             | `GET /api/support/tickets/admin/{adminId}`                                      | `200`, só Tickets de Departments permitidos              | Nenhum write                                                               |
| RF08  | Requester dono; Ticket não resolvido                  | `POST /api/support/tickets/{ticketId}/resolve`                                  | `200`, `requesterStatus=resolvido`                       | 1 `alteracao_status/requester`; repetição no-op                            |
| RF09  | Owner/admin membro; Ticket em Department inativo      | `GET /api/support/tickets/{ticketId}`                                           | `200`, 11 campos exatos do Ticket                        | Nenhum write/audit                                                         |
| RF10  | Requester dono e admin membro, mídia opaca autorizada | `POST /api/support/tickets/{ticketId}/messages`                                 | `201`, 8 campos da Message e `mediaIds` ordenados        | Message+Media; admin 1 audit, requester 2 audits                           |
| RF11  | Admin membro; Message admin existente                 | `PATCH /api/support/tickets/{ticketId}/messages/{messageId}/visibility`         | `200`, flag `isVisibleToRequester`                       | Só flag muda; sem AuditLog/Ticket touch                                    |
| RF12  | Owner/admin membro; Message interna existente         | `GET /api/support/tickets/{ticketId}/messages`                                  | `200`, `data,pagination`; requester não vê/conta interna | Nenhum write                                                               |
| RF13  | Owner/admin membro; audits intercaladas               | `GET /api/support/tickets/history?ticketId=...`                                 | `200`, `data,pagination`, `datetime DESC,id DESC`        | Nenhum write; requester não vê `nova_mensagem` admin                       |

UAT-SUP-01..05 do TP são agrupamentos funcionais planejados, não aceite presumido. **Casos de segurança obrigatórios:** requester A não lê Ticket de B (`403`); admin não membro não lê/edita Ticket (`403`); Department inativo preserva leitura histórica autorizada; Message admin interna fica ausente de RF12 requester e não entra em `total`; audit `nova_mensagem` admin fica ausente da RF13 requester e não entra em `total`; request externo direto com headers forjados não alcança Support fora da fronteira BFF. Registrar resultados por caso, não só por fluxo feliz.

Após o candidato de deploy: conferir migrations aplicadas e schema esperado, estado da `tickets_number_seq`, ausência de W1 no alvo e compatibilidade da imagem com o banco; usar consultas não destrutivas. Dataset UAT é decisão própria (massa funcional pequena, referência volumétrica aproximada de 8 Departments/200 Tickets/≥600 Messages ou ambas); **não** reutilizar W1 nem gerar massa volumétrica neste checkpoint.

# 7. Inventário de endpoints e release smoke

As 14 rotas funcionais estão na matriz da seção 6 e na OpenAPI versionada. Superfícies operacionais locais: `GET /health`, `/metrics`, `/api-docs`, `/api-docs-json`; não são RFs. `/health` responde `200` e informa `database: dataSource.isInitialized`: isso não faz query nem comprova disponibilidade atual de PostgreSQL. Definir probes separando startup/liveness/readiness, intervalos, timeout, threshold e grace period no orchestrator. `/metrics` e Swagger não devem ficar públicos sem decisão de rede.

Smoke pós-deploy candidato: verificar digest/SHA da imagem, `/health`, `/metrics` **internamente**, OpenAPI JSON ou artefato equivalente, listagem de Department, criação/leitura de Ticket, mensagem e histórico com atores UAT autorizados. A parte de escrita requer alvo UAT e limpeza definida; smoke de produção deve ser não destrutivo salvo autorização operacional específica. Não executar W1.

# 8. Fronteira NFR e decisões DEPLOY-01..18

Categorias: ACL, seed safety, OpenAPI, métricas e correlação são capacidades locais; AuthN ampla, rede/ingress e rate limit são upstream/plataforma; BFF header propagation e observabilidade são compartilhadas; RabbitMQ/outbox/Schema Registry não são requisitos desta release sem evento Support. A falta de prova de fronteira BFF é blocker real de deploy; não se infere gap de serviço para toda capacidade de plataforma.

| ID        | Tema              | Decisão/evidência deste checkpoint                                                                                                               | Status                                |
| --------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| DEPLOY-01 | Ambiente alvo     | Usuário confirmou alvo e owner indefinidos; nome/classe, provider, region, namespace, lifecycle e aprovador pendentes                            | `DEPLOY_TARGET_BLOCKED_BY_DECISION`   |
| DEPLOY-02 | Plataforma        | Usuário confirmou plataforma indefinida; scheduler, réplicas, recursos, autoscaling e rollout pendentes                                          | Bloqueado                             |
| DEPLOY-03 | Registry/artefato | GHCR por `v*` e `sha-${sha}` comprovado em YAML; pin de SHA imutável para deploy é proposta, sem destino definido                                | Parcial                               |
| DEPLOY-04 | Release/version   | `package.json=1.0.0` não autoriza `v1.0.0`; tag inicial/prerelease e owner pendentes                                                             | Bloqueado; sem tag                    |
| DEPLOY-05 | PostgreSQL alvo   | Provider/version/endpoint/DB/role/TLS/conexões/backups/PITR/owner pendentes                                                                      | Bloqueado                             |
| DEPLOY-06 | Migrations        | Critério obrigatório: execução única controlada por release antes do tráfego. Preferência B (job pré-deploy) depende de plataforma/role/rollback | Decisão técnica pendente              |
| DEPLOY-07 | Secrets/config    | Variáveis reais inventariadas; secret manager/orchestrator source, rotação e validação pendentes                                                 | Bloqueado                             |
| DEPLOY-08 | Rede/trust        | Support deve ser privado e receber identidade somente de BFF confiável; mecanismo e prova no alvo pendentes                                      | `DEPLOY_SECURITY_BLOCKER`             |
| DEPLOY-09 | BFF integration   | URL interna, timeout/retry/circuit, headers e actors não comprovados                                                                             | Bloqueado                             |
| DEPLOY-10 | Health/readiness  | `/health` não consulta DB; probes e parâmetros dependem de plataforma                                                                            | Pendente                              |
| DEPLOY-11 | Observabilidade   | `/metrics` e Pino existem; coleta, painéis, alertas 5xx/latência/DB/restarts/correlation pendentes                                               | Bloqueado para GO                     |
| DEPLOY-12 | Swagger/OpenAPI   | `/api-docs*` existe; decisão de acesso interno/desabilitação no ingress pendente                                                                 | Pendente                              |
| DEPLOY-13 | Seed real         | **W1 proibida em shared dev, staging e produção**; UAT usa APIs/fixture separada                                                                 | Congelado                             |
| DEPLOY-14 | Dataset UAT       | Massa funcional/volumétrica e owner não escolhidos; TDD 8/200/≥600 não é W1                                                                      | Bloqueado                             |
| DEPLOY-15 | Rollback app      | Imagem SHA anterior, operador, gatilhos e tempo máximo não definidos                                                                             | Bloqueado                             |
| DEPLOY-16 | Rollback DB       | `migration:revert` não automático; compatibilidade por release e recovery/forward-fix com DB owner pendentes                                     | Bloqueado                             |
| DEPLOY-17 | Smoke             | Lista mínima definida na seção 7; atores/ambiente/evidência dependem do alvo                                                                     | Plano pronto, execução pendente       |
| DEPLOY-18 | Aceite GO/NO-GO   | Checklist da seção 11; sem evidência dos gates, **NO_GO**                                                                                        | Critério congelado; execução pendente |

# 9. Cobertura de testes e limites da prova

A CI #18 executou `quality` com provas RF01–RF13, W1, imagem, OpenAPI e coverage. O report W1 anterior registra 36 suítes/340 testes nos hooks e percentuais locais; este lote não mediu coverage de novo nem rodou testes de código. A matriz RF→unit/integration/functional está no report final RF13/W1. Nenhuma dessas provas demonstra rede BFF, secrets reais, migrations multi-réplica, backups, alertas, UAT ou produção.

# 10. Divergências e blockers reais

## 10.1 Documentação prevê, código/infra não comprova

- Não foi encontrada definição de ambiente real, plataforma, DB, secrets, owner de deploy ou UAT. `infra-access.md` lista apenas localhost.
- O CD publica imagem, mas nenhum deploy job existe neste repositório. Pipeline em outro repositório é desconhecido; registrar `DEPLOY_AUTOMATION_NOT_IMPLEMENTED_IN_THIS_REPO`, sem afirmar inexistência global. Um deploy manual controlado pode ser decidido, mas ainda requer plano/owner/evidência.
- Startup roda migrations por container; requisito de single-run não comprovado.
- BFF/ingress privado e origem confiável dos headers não comprovados. **Bloqueia exposição/deploy** até prova da fronteira.
- PostgreSQL real, TLS, backups/PITR e rollback não estão comprovados. `data-source.ts` não contém opção SSL explícita; avaliar compatibilidade após selecionar alvo.

## 10.2 Código existe, documentação não comprova

`/health`, `/metrics` e `/api-docs*` existem e são documentados como superfícies operacionais; falta política de exposição no ambiente real, não uma RF nova.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Não identificado na baseline funcional. `ACTUAL_STATE.md` já nega deploy/UAT; este checkpoint não amplia a afirmação.

## 10.4 PRD/TDD/TP divergem entre si

Os headers de identidade foram fechados em Support 0.15. A referência volumétrica do TDD não altera W1. UAT-SUP-01..05 no TP continua **planejada**, sem responsável/aceite.

## 10.5 Ambiguidades que impedem conclusão segura

Ambiente/plataforma/DB/owner, versão inicial, método de deploy, BFF boundary, dataset UAT e rollback ainda exigem decisão e prova. Não transformar preferências técnicas deste report em decisão de negócio ou infraestrutura aprovada.

# 11. Conclusão, GO/NO-GO e plano do próximo lote

**`DEPLOYMENT_READINESS_BLOCKED_BY_ENVIRONMENT_DECISION / NO_GO`.** O código e a CI estão maduros para planejar release; ambiente e operação real não foram definidos/provados. Blockers prioritários: `DEPLOY_TARGET_UNDEFINED`, `DEPLOY_PLATFORM_UNDEFINED`, `PRODUCTION_DB_UNDEFINED`, `BFF_NETWORK_BOUNDARY_UNPROVEN`, `MIGRATION_SINGLE_RUN_UNPROVEN`, `SECRETS_SOURCE_UNDEFINED`, `UAT_OWNER_DATASET_UNDEFINED` e `ROLLBACK_PATH_UNDEFINED`. Observabilidade é gate de GO. Nenhuma tag/release/deploy/seed real foi executada.

**GO somente com evidência registrada:** imagem referenciada por SHA/digest verificado; migrations executadas exatamente uma vez com sucesso e schema/sequence conferidos; serviço saudável; acesso direto externo negado e BFF confiável provado; secrets e DB TLS/backup/PITR válidos; métricas/logs/alertas ativos; UAT 14/14 e casos de segurança aprovados por owner; caminho de rollback de app e recovery DB testado/documentado; nenhum P0/P1 aberto. Falta de qualquer gate = **NO_GO**.

Plano executável para lote posterior, após decisões de ambiente: (1) identificar owner/autoridade, target, plataforma, repositório de deploy e DB; (2) fechar tag/artefato SHA, rede BFF, secrets/TLS, probes, observabilidade, dataset UAT, migration job único e rollback; (3) produzir runbook e evidência de dry run em ambiente controlado; (4) somente em lote explicitamente autorizado criar tag, publicar imagem, executar migration controlada, implantar candidato, rodar smoke/UAT e coletar aceite. W1 permanece fora de qualquer ambiente real. Este checkpoint termina na documentação.
