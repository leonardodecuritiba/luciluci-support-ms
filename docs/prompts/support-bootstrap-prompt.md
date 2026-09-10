# Prompt Executável — Bootstrap Técnico do Microsserviço de Suporte

> **HISTÓRICO — S0 + S1 foram concluídos.** O drift posterior também foi
> encerrado. Não executar novamente a derivação nem repetir a prova S1.
> RF01 possui agora um prompt próprio após o checkpoint documental 0.3.

Executar na cópia do template destinada ao novo serviço, **após aplicar a
baseline documental 0.2 nas duas raízes**. Este prompt autoriza implementação
técnica local; o patch documental que o distribui não executa essas mudanças.

## Contexto e objetivo

Você está no microsserviço de Suporte da LuciLuci, derivado de
`luciluci-standard-ms`. Domínio canônico: `support`. Serviço-alvo: `support-ms`.
Modo: `startup`. Lote: **S0 + S1 — inventário e bootstrap técnico**.
Branch técnica sugerida: `feat/support-bootstrap`.

Conclua o inventário e implemente a base técnica nesta mesma execução. Não
entregue apenas outro plano de startup. Trabalhe em passos coerentes, mantendo
a árvore compilável e os gates alinhados. Ao concluir S1, pare: **não implementar
RF01–RF13, não aprovar decisões funcionais e não iniciar automaticamente W1**.

## 1. Leitura obrigatória

Leia AGENTS.md, AI_FIRST.md, ACTUAL_STATE.md, README.md e DRIFT_REPORT.md;
`docs/workflows/support-bootstrap-plan.md` e
`docs/architecture/service-identity.md`; `luciluci-docs/support/README.md`,
`prd.md`, `notes.md`, `tdd.md`, `tp.md`, `dependencies.md`;
`.codex/skills/microservice-builder.md`; `service-identity.json`, `.gitmodules`,
`package.json`, lockfile, `jest.config.ts` e as superfícies de código apontadas
na matriz do plano. Recorra à fonte original se houver dúvida de requisito.

A restrição documental da entrega anterior não limita esta execução técnica
solicitada. Instruções genéricas para iniciar RFs, renomear Profile globalmente
ou atualizar submódulo com `--remote` não prevalecem sobre este recorte.

## 2. Pré-checagem e S0

Execute inspeção segura de `git status --short`, `git rev-parse --show-toplevel`,
branch/revisão reais e `git submodule status`. Confira o estado e a revisão de
`luciluci-docs` separadamente. Não inferir SHA Git a partir do tar ou confundir
SHA-256 de arquivo com commit. Verifique que o checkout é a cópia destinada a
Support, e não o repositório compartilhado do template. O nome da pasta não
basta; inspecione identidade, documentação e topologia sem alterar remotes.

Preserve mudanças locais. Não executar reset/clean, checkout destrutivo,
force-push, submodule update --remote ou commit automático. Se a documentação
não estiver disponível, registrar a dependência e não substituí-la por outro
domínio. Não exibir segredos, `.env`, tokens ou URLs autenticadas.

Audite `profile`, `profiles`, `standard-ms`, `standard_ms`, `classification`,
`classifications`, nomes de exchanges e paths de contratos no código, testes,
identidade, package/lockfile, scripts, HTTP, Docker, CI e documentação. Registre
path, papel, ação manter/adaptar/remover, dependências e validação. Diferencie
referências históricas explícitas de resíduos ativos. Atualize a matriz do
plano com os paths e revisões reais. Prossiga para S1 após esse inventário.

## 3. S1 — identidade e retirada do exemplo

Materialize a identidade de forma consistente: `serviceSlug` e package name
`support-ms`, domínio `support`, display name `Support (Suporte)`, banco local
novo `support_ms`, teste `support_ms_test`, documentação
`./luciluci-docs/support/`, coleção `api.http` e OpenAPI
`docs/openapi/v1/support-api.json`. Revise consumidores dos campos do JSON antes
de alterá-los. Preserve `templateSlug=standard-ms` apenas como proveniência.
Alinhe package-lock sem atualizar dependências em massa.

Retire o domínio Profile: router/controller/DTOs/use cases, entidades,
repositórios, consumer de classificação, exemplos e testes exclusivos.
Não converter Profile em Department ou Ticket por substituição global e não
criar pastas/classes de negócio vazias para simular implementação.

Revise conjuntamente `src/app.ts`, `src/main.ts`, catálogo de entidades,
helpers de teste, env, migrations e imports de `shared/`. A pasta shared não
prova independência: o registry de eventos, tipos e testes herdados referenciam
Profile/classificação. Preserve o kernel útil e as capacidades genéricas
realmente justificadas, removendo seu acoplamento ao exemplo.

## 4. S1 — sem mensageria de domínio

Siga DEC-SUP-11 e o alvo técnico da identidade: sem conexão obrigatória com
RabbitMQ no startup, sem publisher/outbox worker ativo, sem consumer e sem
exchange de negócio. Não criar `support.events`, mensagens artificiais,
consumer fictício ou AsyncAPI renomeada de Profile.

Retire os contratos/assets de exemplo do caminho ativo. Registre mensageria
inativa de modo machine-readable, adaptando juntos todos os scripts/testes/CI
que consomem a identidade. Ausência esperada é N/A explícito **com verificação**
de que nenhum contrato/consumer de negócio está ativo, não simples `exit 0`.
Preserve validação estrita para futuras capacidades ativas e testes genéricos
úteis dos validadores. Não apagar gates de qualidade indiscriminadamente.

Health deve refletir honestamente as dependências habilitadas. Banco ativo
não pode ser simulado como saudável. Broker desativado não deve aparecer como
falha de dependência obrigatória nem como conexão saudável. Remova superfícies
assíncronas sem contrato ou faça-as declarar inequivocamente N/A; alinhe
runtime, coleção, docs, testes e CI à opção técnica registrada.

## 5. S1 — base HTTP e contratos operacionais

Preserve Express, padrão de erro, logs, métricas, validação e correlação do
kernel naquilo que se aplica. Mantenha `/health`, `/metrics`, `/api-docs` e
`/api-docs-json` funcionais. Não criar endpoints RF ou stubs de sucesso.

Preserve `X-Correlation-ID` obrigatório nas rotas não isentas e sua propagação;
operacionais e OPTIONS seguem isenções explícitas. Teste a regra por rota
sintética instalada **somente na suíte**, sem expô-la no runtime público.
Não implantar autorização de negócio enquanto DEC-SUP-01/03 estiverem abertas.
O performed-by.middleware herdado não comprova autenticação ou ACL de tickets.

Gere OpenAPI de Support apenas com os paths operacionais reais e revise
swagger.ts, exportador, verificador, contrato versionado, coleção HTTP, testes,
README e CI. O check herdado rejeita paths vazios: documente a superfície real,
não invente RF nem reduza a validação para fazer o gate passar.

Remover Profile de um serviço novo não é uma versão breaking de uma API
Support já publicada. Registre a primeira baseline de Support; não compare
semanticamente seu contrato com Profile nem desabilite o comparador futuro.
Se o checkout já tiver contrato Support anterior, compare com essa revisão.

## 6. S1 — banco, migrations e seed

O template tem uma migration que mistura Profile e tabelas genéricas. Revise
registro de entidades, data-source, runners, helpers, testes e `start:docker`
na mesma alteração. **Não criar modelo físico de Department, Ticket,
TicketMessage ou AuditLog de negócio neste lote.**

Para uma derivação nova, produza apenas migrations de infraestrutura que for
realmente retida e necessária, sem tabela Profile. Isso só permite execução
em banco novo e isolado cuja identidade tenha sido verificada. Não modificar
histórico de migration já aplicada em banco compartilhado, renomear bancos
existentes ou executar rollback sobre dados do usuário. Havendo evidência de
ambiente com histórico prévio, preservar esse caminho e registrar a estratégia
pendente, continuando as partes independentes do bootstrap.

Antes de migration/start:docker, verificar alvo, configuração efetiva e
isolamento sem imprimir credenciais. Não usar `synchronize=true` em PostgreSQL
para contornar migrations. SQLite ou mocks não são prova de execução PostgreSQL.

Retire a seed de Profile. Mantenha um comando claro de seed de domínio
indisponível em S1: erro explicativo antes de conectar/escrever, sem gerar
registros fictícios e sem declarar massa de Support pronta. A seed significativa,
sintética e determinística será implementada com o primeiro modelo de domínio.
Atualize scripts/README e o runbook para que ninguém execute a seed herdada.

## 7. S1 — testes, scripts e CI

Preserve testes genéricos pertinentes e substitua os testes exclusivos do
exemplo por testes do bootstrap. Implemente os cenários TC-SUP-BOOT-01..10 do
TP: identidade, correlação/erros, operacionais, ausência de Profile, ausência
de wiring assíncrono, OpenAPI real, seed bloqueada e validações coerentes.
Prova de processo real/PostgreSQL depende de ambiente disponível e isolado;
registre-a separadamente da integração HTTP in-process.

Testes negativos para `/profiles` e rotas RF ainda ausentes devem enviar
correlação válida quando necessário. Assim, não confundem um 400 do middleware
com ausência comprovada de router. Testes de listas de contratos devem impedir
que os paths pendentes sejam publicados antes de implementação.

Alinhe env/Docker/CI ao nome e às dependências efetivas do serviço. Preserve
versões e lockfile; somente ajuste mínimo indispensável, com justificativa.
Não publicar imagem, deploy, tag, release ou alterar segredos. Analise o gate
assíncrono antes de remover broker da CI, pois pode haver teste genérico que
ainda requeira infraestrutura própria; isole e justifique esse escopo.

Não reduzir thresholds, excluir código vivo da cobertura, usar
`--passWithNoTests`, deixar testes vazios, transformar falha em N/A ou adicionar
`|| true` para fabricar CI verde. Reporte queda de cobertura ou falha não
resolvida. Report de S1 nunca marca RFs concluídas.

## 8. Validação e segurança operacional

Confira scripts reais antes de executar. Após adaptação, execute os aplicáveis:
`npm run lint`, `npm run build`, `npm run test:unit`,
`npm run test:integration`, `npm run test:contract`, `npm run openapi:export`,
`npm run openapi:check`, `npm run test:coverage`, `npm run coverage:check` e
`git diff --check`. Verifique também formatação dos arquivos alterados sem
reescrever toda a árvore. Testes de contrato devem usar o artefato exportado
atual; refaça-os se a exportação tiver alterado o arquivo.

Para dependências locais ausentes, prefira instalação reprodutível pelo lockfile,
após inspecionar scripts de lifecycle. Não tratar indisponibilidade de rede,
Node, binário nativo, Docker ou PostgreSQL como aprovação. Não modificar o
lockfile em massa para contornar ambiente. Registre o comando e a causa real.

Com PostgreSQL isolado disponível, execute migrations e smoke de processo
real sem broker. Sem ambiente, execute as provas possíveis e classifique as
restantes como BLOCKED_BY_ENVIRONMENT ou NOT_RUN, sem apagar seu escopo.
Não executar `npm run infra:down`: no template ele inclui `down -v`. Não
apagar volumes, matar processos alheios ou usar credenciais remotas. Faça
teardown apenas de recursos criados e identificados por esta execução.

Faça busca residual e classifique cada ocorrência histórica permitida. Revise
`git diff`, arquivos removidos, configuração, contratos e status das duas
raízes. Não fazer commit, push, PR remota ou avançar submódulo automaticamente.

## 9. Entregas e condição de parada

Atualize ACTUAL_STATE.md com o resultado real, mantendo todas as RFs
NOT_IMPLEMENTED. Atualize o plano com matriz, decisões técnicas, comandos e
evidências; runbooks, READMEs e prompts tocados devem refletir o novo runtime.
Remova avisos de herança somente onde o conteúdo foi realmente adaptado.
Não apagar o PRD original nem reescrever DEC-SUP de produto como aprovadas.

Gere `docs/reports/REPORT-SUPPORT-BOOTSTRAP-<timestamp-real>.md` usando o
esqueleto herdado, delimitando S1. Backlog inicial não é drift implementado;
registre no DRIFT_REPORT somente inconsistências comprovadas. Diferencie:
BOOTSTRAP_IMPLEMENTED_AND_PROVEN, BOOTSTRAP_IMPLEMENTED_PENDING_PROOF e
BOOTSTRAP_INCOMPLETE. Nenhum desses estados encerra as RFs.

Responda com: resumo do bootstrap; arquivos alterados/removidos; matriz de
identidade; capacidades mantidas/retiradas; validações com resultados e limites;
documentação atualizada; estado final; decisões necessárias à primeira RF.
**Finalize S1 nesta rodada dentro das condições seguras e pare antes de RF01.**
