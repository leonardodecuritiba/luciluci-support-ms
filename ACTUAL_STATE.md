# ACTUAL_STATE

## Baseline estável — bootstrap + RF01

- serviço: `support-ms`
- domínio: `support`
- S0: inventário realizado conforme report anterior
- S1: derivação e provas técnicas concluídas
- estado: `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`
- drift encerrado: `DRIFT-SUP-S1-001 / RESOLVED / PROVEN`
- RF01: `RF01_IMPLEMENTED_AND_PROVEN`
- RF02–RF13, incluindo RF07a/RF07b: `NOT_IMPLEMENTED`
- baseline de integração: `MAIN_BASELINE_RF01`
- política pós-baseline: cada nova RF deve nascer de uma branch própria criada a partir de `main` sincronizada

## O que permanece materializado

Identidade Support, superfície HTTP operacional, remoção do exemplo Profile,
mensageria explicitamente inativa, kernel genérico de idempotência e RF01:
Department, memberships relacionais, migration e `POST /api/support/departments`.
Seed de W1 continua deliberadamente bloqueada; não existem Ticket, Message ou
AuditLog de negócio.

## Evidências de fechamento

O [report original](docs/reports/REPORT-SUPPORT-BOOTSTRAP-20260910-154444.md) registra lint, build, OpenAPI, mensageria,
suítes, cobertura e validação dos compose files aprovados. Essas execuções
anteriores são preservadas, não reatribuídas à revisão atual.

A [revisão independente](docs/reports/REPORT-SUPPORT-S1-REVIEW-20260910-161432.md) reproduziu falha de `npm run start`,
`migration:run:dist`, `migration:revert:dist` e `start:docker`: package aponta
para `dist/main.js`/`dist/shared/...`, mas o build recebido está em `dist/src/...`.
Todos falham antes de acessar o banco. Isso é defeito de código/configuração,
não somente falta de prova ambiental.

O fechamento corrigiu o build de produção para emitir `dist/main.js` e runners
em `dist/shared/...`, sem alterar o tsconfig de testes/scripts. O gate
`build:check` e casos positivo/negativo protegem os arquivos efetivamente
chamados pelos scripts oficiais. A execução local de 2026-09-10 incluiu build
limpo, todas as suítes/gates, PostgreSQL descartável com migration compilada
repetida, revert/reapply, round-trip do kernel, `start`, `start:docker` e
smoke da imagem com CMD real. Ver o report de fechamento para recursos
sintéticos, comandos e resultados.

O workflow agora executa essas provas com banco criado explicitamente e imagem
isolada; não há run remoto consultado para este HEAD. A revisão fixa do
submódulo foi conferida localmente.

## RF01 comprovada e próxima execução

RF01 foi implementada conforme o checkpoint 0.3: validação estrutural, UUID v4,
sem ACL local/idempotência/auditoria/evento, memberships com ordem e duplicatas
preservadas e criação atômica. Provas unitárias, HTTP/contract, PostgreSQL real,
processo compilado e imagem foram executadas em recursos descartáveis.
O recorte, comandos e limites estão no
[report RF01](docs/reports/REPORT-SUPPORT-RF01-20260910-174742.md).

## Fechamento da baseline

Bootstrap S1 e RF01 formam o primeiro baseline funcional estável do serviço. Este
conteúdo é o candidato autorizado para publicação em `main`; a publicação remota
é uma operação Git separada e deve ser comprovada pelo SHA realmente enviado,
sem inferir sucesso a partir deste documento.

Depois dessa publicação, `main` deixa de ser branch de desenvolvimento funcional.
RF02–RF13 devem ser trabalhadas em branches próprias criadas a partir de `main`
sincronizada, com um slice/RF explícito por branch e merge apenas após contrato,
implementação e provas do recorte. Correções emergenciais também devem usar branch
própria, salvo decisão operacional explícita.

Não iniciar RF02 automaticamente. O próximo gate é o checkpoint contratual de
RF02; DEC-SUP específicas de edição/membership continuam abertas.
