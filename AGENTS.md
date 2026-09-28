# AGENTS.md

## Definição W1 aprovada; seed ainda sem runtime

O [report W1](docs/reports/REPORT-SUPPORT-SEED-W1-DEFINITION-20260928-184122.md)
congela a opção B: fixture determinística do domínio completo, volumes
6 Departments / 16 Tickets / 44 Messages / 80 AuditLogs, além das sete
memberships, oito identidades sintéticas e oito referências de mídia.
`SEED_W1_DEFINITION_READY / SEED_W1_NOT_IMPLEMENTED`; `scripts/seed.ts`
continua bloqueado. Implementação e prova exigem lote próprio, destino
descartável e gates do report. O checkpoint `fdf713f` é histórico.

## Estado corrente — MAIN_BASELINE_RF13

RF01–RF13 estão `IMPLEMENTED_AND_PROVEN / INTEGRATED_IN_MAIN` após a
[PR #15](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/15),
merge funcional `2aacc5554c9c2c4f25415dd8b170f5ff73b6d189`.
RF07a/RF07b são operações separadas: 14/14 operações Support materializadas.
Support 0.15 permanece fixo no gitlink
`14efcdfdc70d774c4343e2ec47662b7b5c8b691b`; a CI `ci / quality` do
head RF13 passou no run `36456698983`. Nenhuma RF do PRD atual ficou pendente
e não houve deploy. Naquela fotografia, a seed de domínio ainda requeria
definição da massa determinística W1;
não inferir prontidão de produção. Consulte [ACTUAL_STATE.md](ACTUAL_STATE.md)
e o [report final](docs/reports/REPORT-SUPPORT-FINAL-CLOSURE-20260928-174429.md).
Os blocos de estado abaixo são fotografias históricas do ciclo de
implementação; suas afirmações de RF13 ausente ou branch local não descrevem
esta baseline. As regras operacionais e de fonte de verdade continuam
aplicáveis.

## Fotografia histórica — implementação RF13 na branch funcional

`feat/support-rf13-history` parte de `7f041fd` com Support 0.15 fixo em
`14efcdf`. `GET /api/support/tickets/history` implementa ACL atual, filtro
SQL de `nova_mensagem` antes de count/página e fotografia PostgreSQL
`REPEATABLE READ`, sem writes, migration ou evento. Provas e limites desta
branch estão no [report RF13](docs/reports/REPORT-SUPPORT-RF13-20260928.md).
RF01–RF12 permanecem integradas em `main` (`1e243d3`); RF13 ainda não foi
integrada nem implantada. Os blocos abaixo são fotografias históricas.

## Fotografia histórica — contrato RF13 Support 0.15

Support 0.15 congela apenas RF13 em
`14efcdfdc70d774c4343e2ec47662b7b5c8b691b`, publicado no repositório
canônico e fixado no gitlink deste checkpoint. Estado
`RF13_CONTRACT_CHECKPOINT_READY / RF13_CONTRACT_FROZEN / NOT_IMPLEMENTED`.
RF01–RF12 estão integradas em `MAIN_BASELINE_RF12` (`1e243d3`). A reserva
`/tickets/history` continua 404; nenhum runtime, teste RF13 ou deploy foi
criado. Leia o
[report de fechamento](docs/reports/REPORT-SUPPORT-RF13-CONTRACT-20260928-141233.md)
e a revisão canônica antes de abrir a branch funcional própria. Os commits
`58fcea6` e `39028ec` e os blocos abaixo são históricos.

## Decisão RF13 parcial após o checkpoint histórico

A decisão de visibilidade de `AuditLog.nova_mensagem` foi recebida e registrada
no [report RF13](docs/reports/REPORT-SUPPORT-RF13-VISIBILITY-20260925-203223.md).
Admin autorizado vê todas as auditorias do escopo; requester dono vê
`nova_mensagem` somente de `origin=backoffice|cd` com
`authorId=ticket.requesterId`. Audit de admin fica oculto do requester;
nenhuma correlação heurística com Message é permitida. Filtrar antes de total
e paginação. Outros detalhes contratuais independentes seguem abertos,
portanto RF13 continua bloqueada e sem runtime; Support 0.14 permanece fixo.
O checkpoint `58fcea6` abaixo é fotografia histórica.

## Fotografia histórica — estado após a PR #14

RF01–RF12 estão implementadas/provadas e integradas em `MAIN_BASELINE_RF12`
(merge `1e243d3` da PR #14; CI `36181786738` aprovada). RF13 está
`RF13_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION / NOT_IMPLEMENTED`; o path
`/tickets/history` ainda retorna 404. O gitlink canônico permanece em Support
0.14 (`820b2a8`). Leia o
[checkpoint RF13](docs/reports/REPORT-SUPPORT-RF13-CHECKPOINT-20260925-195255.md)
antes de avançar. Não inferir visibilidade das auditorias de mensagens
internas ou estender decisões RF12 à RF13. Os blocos seguintes preservam o
estado anterior ao merge RF12.

## Implementação RF12 nesta branch funcional

`feat/support-rf12-list-messages` parte do checkpoint documental `4a47e01`
com Support 0.14 (`820b2a8`) fixado. RF12 está implementada e provada nesta
branch: GET de mensagens com ACL atual, escopo de visibilidade, paginação,
ordem crescente, mídia em lote e fotografia PostgreSQL `REPEATABLE READ`.
`main` permanece `MAIN_BASELINE_RF11`; RF13 continua sem runtime. Evidência no
`docs/reports/REPORT-SUPPORT-RF12-20260925.md`. Nenhum merge ou deploy neste lote.

As seções seguintes descrevem checkpoints históricos.

## Fotografia histórica — contrato RF12 Support 0.14

Support 0.14 foi congelado somente para RF12 no commit canônico `820b2a8`,
publicado e fixado no gitlink. Estado
`RF12_CONTRACT_CHECKPOINT_READY / RF12_CONTRACT_FROZEN / NOT_IMPLEMENTED`.
O checkpoint bloqueado `98efe16` permanece histórico. A rota GET de mensagens
exige scope de visibilidade por papel: requester dono nunca recebe ou conta
mensagens internas; filtro `false` retorna `200` vazio/total zero. Paginação,
ordem cronológica, item de oito campos, mídia em lote e leitura coerente
`REPEATABLE READ` estão fechados somente para RF12. Ver
`docs/reports/REPORT-SUPPORT-RF12-CONTRACT-20260925-185019.md`.
RF13 continua pendente. RF12/RF13 não possuem runtime; não abrir branch
funcional RF12 neste lote documental.

## Fotografia histórica — checkpoint RF12 bloqueado

A PR documental #13 foi integrada em `main` no merge `7724382` e encerrou o
registro de `MAIN_BASELINE_RF11`. Naquela fotografia, o gitlink permanecia
Support 0.13 (`4958fd1`). O checkpoint RF12 estava
`RF12_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`:
DEC-SUP-04 exige política de visibilidade por papel, filtro omitido/`false` e
total sem vazamento; DEC-SUP-02/08 e DEC-SUP-01/09 ainda exigem escolhas
próprias de RF12. Ver
`docs/reports/REPORT-SUPPORT-RF12-CHECKPOINT-20260925-182925.md`. Support
0.14 não estava congelado. RF12/RF13 não tinham runtime; a branch funcional
RF12 não podia ser criada antes da resolução expressa das lacunas. Os blocos abaixo preservam o estado
RF11 e fotografias anteriores.

## Fotografia histórica — MAIN_BASELINE_RF11

RF01–RF11 estão implementadas/provadas e integradas em `main`. A
[PR #12](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/12)
foi integrada no merge `9387b3d`, estabelecendo `MAIN_BASELINE_RF11`.
Support 0.13 permanece fixo no gitlink `4958fd1`; RF12/RF13 não têm runtime.
Não houve deploy.
O report da implementação local é
`docs/reports/REPORT-SUPPORT-RF11-20260925.md`; os parágrafos seguintes
descrevem o estado histórico anterior à implementação.

## Missão

Este checkout é `support-ms` (Suporte), derivado do `standard-ms`.
Identidade e superfície operacional foram materializadas, Profile foi retirado
e RF01–RF11 estão `IMPLEMENTED_AND_PROVEN` em `MAIN_BASELINE_RF11` (PR #12).
O contrato RF09 está congelado em Support 0.11. O contrato RF10 está
`RF10_CONTRACT_CHECKPOINT_READY / RF10_CONTRACT_FROZEN` em Support 0.12.
RF10 está integrada em `main` no merge `8827c0b`; RF12/RF13 continuam
`NOT_IMPLEMENTED`. Os checkpoints bloqueados anteriores permanecem históricos.
Leia `ACTUAL_STATE.md` para o estado real.

Na fotografia contratual, o contrato RF11 foi congelado em Support 0.13
(`4958fd1`), publicado no repositório canônico e fixado no gitlink. Estado então:
`RF11_CONTRACT_CHECKPOINT_READY / RF11_CONTRACT_FROZEN / NOT_IMPLEMENTED`.
O checkpoint bloqueado `85b3adb` permanece histórico. Ver
`docs/reports/REPORT-SUPPORT-RF11-CONTRACT-20260925-165105.md`. O runtime
RF11 foi implementado depois em lote funcional separado.

O checkpoint documental RF11 anterior estava
`RF11_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`: Support 0.13 não foi congelado.
Naquela fotografia, o gitlink continuava em Support 0.12. Consulte
`docs/reports/REPORT-SUPPORT-RF11-CHECKPOINT-20260925-161025.md` para as
lacunas então abertas; as decisões posteriores estão no report de contrato.

O `DRIFT-SUP-S1-001` foi corrigido e provado: estado
`BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. O checkpoint documental RF02 0.4 está
fechado e seu slice foi integrado em `main`. Não refaz a derivação, não repete
S1/RF01 sem nova reprodução. O runtime RF11 foi iniciado somente após o
checkpoint contratual próprio.

## Leitura obrigatória inicial

1. `AI_FIRST.md`.
2. `ACTUAL_STATE.md`.
3. `README.md`.
4. `docs/README.md`.
5. `./luciluci-docs/support/README.md`, `prd.md`, `notes.md`, `tdd.md`, `tp.md`, `dependencies.md`.
6. `docs/workflows/support-bootstrap-plan.md`.
7. `service-identity.json`, `src/README.md` e `tests/README.md` para inventário real da herança.
8. `DRIFT_REPORT.md`.
9. O drift encerrado e o report de fechamento, para histórico técnico.
10. `.codex/skills/report-review.md` e `docs/prompts/report-completeness-prompt.md` para report.
11. `.codex/skills/drift-fix.md` e o drift informado, quando houver correção delimitada.

## Fonte de verdade

Para negócio, prevalece o PRD de Suporte transposto em
`luciluci-docs/support/prd.md`; a fonte original está preservada em
`luciluci-docs/support/sources/prd-original.md`. `notes.md` explicita propostas
e lacunas. `luciluci-docs` rege formato e convenções. O template rege estrutura
técnica inicial e workflow, não comportamento do domínio real.

`service-identity.json` é fonte de verdade do naming materializado:
`serviceSlug: support-ms`, `domainSlug: support`, banco padrão `support_ms`.
`templateSlug: standard-ms` e termos de inventário são proveniência, não
configuração ativa a renomear indiscriminadamente.

Em conflito: explicitar fontes, preservar regra funcional recebida, não
inventar solução silenciosa e registrar decisão/impacto. Documentos BFF são
composição, não autoridade de Support. Regras globais genéricas de auditoria
não ampliam as três ações de AuditLog do PRD.

## Modo de execução

Fluxo herdado: `bootstrap/build -> report -> drift-fix -> report -> drift-fix -> wave final`.
S1 está encerrado e RF01 foi comprovada a partir do checkpoint documental 0.3.
A revisão 0.4 congela RF02 e resolve, somente nesse recorte, DEC-SUP-01, 03, 06,
08, 09, 10 e 12. RF02–RF11 estão integradas em `main`. A revisão 0.6
congela RF04 e resolve, somente nesse recorte, DEC-SUP-01, 03, 06, 08, 09, 10 e 12. A revisão 0.7 congela RF05 e resolve, somente nesse recorte,
DEC-SUP-01/03/04/08/09/10/12. A revisão 0.8 congela RF06 e resolve, somente
nesse recorte, DEC-SUP-01/03/05/06/08/09/10/12. Support 0.9 congela
RF07a/RF07b e resolve DEC-SUP-01/02/07/08/09 somente nesse recorte.
Support 0.10 congela RF08 e resolve DEC-SUP-01/06/08/09/10/12 somente nessa
ação; DEC-SUP-11 não se aplica por não haver evento Support.
Support 0.11 congela RF09 e resolve DEC-SUP-01/08/09 somente nesse recorte.
Support 0.12 congela RF10 e resolve DEC-SUP-01/04/06/08/09/10/12 somente
nessa operação; DEC-SUP-05/11 não se aplicam a RF10.

Trabalhar RF por RF ou um drift por vez; não fazer refactor amplo, antecipar
ondas ou implementar comportamento com decisão crítica aberta. Um gap esperado
de inicialização não é bug comprovado do Support. Propostas de arquitetura
não são decisões de negócio aprovadas.

RF11 está integrada em `MAIN_BASELINE_RF11`. O checkpoint RF11 bloqueado é
histórico; Support 0.13 congela somente o contrato RF11. RF12/RF13 não possuem
runtime. Qualquer prova futura de banco exige destino descartável
explícito; não usar banco padrão/preexistente.

## Política de branches e `main`

Bootstrap + RF01 formam o baseline histórico `MAIN_BASELINE_RF01`. RF02–RF11
estão integradas; `MAIN_BASELINE_RF11` corresponde ao merge da PR #12
`9387b3dc6e636db4b8124785e7b3bc92ec46d054`.
`main` é branch estável de integração e não é workspace para RF nova.

Para RF12/RF13: atualizar referências remotas, partir de `main` sincronizada e criar
uma branch própria por slice. Convenção recomendada: `feat/support-rfNN-<slug>`;
correções delimitadas: `fix/support-<drift-ou-slug>`. Não misturar RFs independentes
na mesma branch. A branch RF09 partiu do checkpoint documental publicado,
descendente de `MAIN_BASELINE_RF08`, com gitlink Support 0.11
`a198b46c62d4b5cd1a4aa0ced8eb171b2e6ef3b2`, e foi integrada pela PR #9.
O gitlink integrado após RF10 apontava a Support 0.12
`85c7e958adb0cbb9fa43842de7f990260f2bc0ee`, publicado antes da atualização
do serviço. A branch RF10 partiu do checkpoint documental publicado `b72c585`
e foi integrada pela PR #10 após o check `quality` do run `36156561044`.
O gitlink integrado na baseline RF11 aponta a Support 0.13 `4958fd1`; a RF11 foi
integrada pela PR #12 após o check `ci / quality` do run `36169743450`.

Antes de integrar em `main`, exigir contrato aplicável congelado, testes/provas do
recorte, estado/documentação atualizados e ausência de drift técnico aberto que
invalide a RF. Nunca usar `push --force` em `main`. Ver
`docs/workflows/support-development-branch-policy.md`.

## Submódulo e revisão reprodutível

`luciluci-docs` é um repositório Git independente. Antes de inicializar/atualizar,
verificar `git status --short` na raiz e no submódulo; preservar mudanças do
usuário. Inicializar a revisão fixada com `git submodule update --init --recursive`
apenas quando seguro. **Não executar `--remote` automaticamente**: a atualização
da baseline é explícita e deve registrar o commit escolhido.

A entrada genérica de bootstrap foi alinhada a essa regra. Referências
históricas à atualização remota não autorizam avançar a revisão fixada. Não
misturar alterações do submódulo com arquivos comuns do repositório pai.

## Regras do serviço

- Preservar RF01–RF13 com RF07a/RF07b: 14 operações, cinco listagens.
- Preservar paths `/api/support/*`, enums e campos do PRD; não copiar `/profiles` ou `/replies` como contrato Support.
- `Department.type` não governa autorização; `allowedUserIds` é o critério administrativo.
- Solicitante acessa seu próprio ticket; RF08 é exclusivo do solicitante.
- RF09 lê Ticket por ID sob ownership para backoffice/cd ou membership atual para admin,
  inclusive em Department inativo; não escreve ou gera auditoria.
- RF05 cria ticket + mensagem inicial de forma atômica e somente uma auditoria.
- RF06 edita priority/departmentId/adminStatus sob ACL, lock Ticket→Departments,
  no-op sem write e uma auditoria apenas na mudança efetiva de adminStatus.
- RF10 de backoffice/cd gera duas auditorias para a nova mensagem, inclusive se adminStatus já era pendente, conforme baseline literal.
- Nenhum evento de negócio Support foi especificado. Não renomear eventos Profile para inventar tópicos Support.
- `DEC-SUP-*` abertas impedem congelamento integral; bloquear apenas o slice dependente, sem ocultar a lacuna.
- Headers e visibilidade exigem decisão antes de liberar rotas; filtros não substituem autorização.

## Estratégia operacional de bootstrap

Auditar resíduos de `profile`, `profiles`, `standard-ms`, `standard_ms` e
classificação antes de renomear. Usar o plano específico de Support para
montar matriz de naming/artefatos. O resultado não é uma substituição global:
Department, Ticket, TicketMessage e AuditLog têm relações diferentes do exemplo.

Materializar identidade, revisar código/testes/contratos/scripts/CI de forma
coerente e somente depois abrir a primeira RF autorizada. Não usar eventos,
migrations, banco ou filas de outro serviço como massa descartável.

## Regras transversais preservadas

Exigir `X-Correlation-ID` nas rotas HTTP de negócio, sem geração silenciosa
quando faltar. Superfícies operacionais e OPTIONS têm tratamento separado.
Propagar correlação a responses/logs e, quando aplicável, efeitos técnicos;
não ampliar o response de auditoria por esse motivo.

Manter `api.http`, contratos e testes alinhados a cada superfície implementada.
Seed deve ter massa significativa, determinística e sintética, conforme TDD.
Não afirmar uma RF concluída sem evidência unit/integration/functional exigida.

Classificar NFRs por responsabilidade: local, upstream/plataforma, compartilhado,
fora do escopo ou gap real local. Testes de autorização funcional do PRD são
obrigatórios; ausência de suíte ofensiva não os dispensa. OpenTelemetry, DLQ,
redrive e Schema Registry não são gaps locais automáticos.

## Regras específicas por superfície

HTTP: revisar route/controller/DTO, OpenAPI, `api.http`, erros e testes.
Persistência: migration, schema, repositórios, seed e integração PostgreSQL.
Mensageria: apenas com requisito explícito; revisar AsyncAPI/wiring/testes/CI.
Documentação: sincronizar PRD/TDD/TP, estado atual, decisões e runbooks.

## Reports, handoff e evidência

Atualizar `ACTUAL_STATE.md` ao abrir/concluir blocos. Reports usam
`docs/reports/REPORT-TEMPLATE.md` e matriz RF -> código/contrato/testes/evidência.
Não confundir caso planejado com teste executado, aprovação ou produção.
Registrar comandos realmente executados, resultados, falhas e limites de ambiente.

## Formato da entrega

Apresentar contexto e escopo; resumo do ajuste; arquivos alterados;
implementação realizada (ou nenhuma); validação real; documentação atualizada;
situação da PR; decisões e riscos residuais. Nunca declarar bootstrap ou RFs
prontos apenas porque a documentação foi aplicada.

## Entrada operacional pós-S1

Os prompts S0/S1/RF01 são históricos. Não executar novamente a derivação ou
provas já concluídas por seguir prompt antigo.

Preservar a revisão fixa do submódulo. Antes de uma RF futura, confirmar que o
checkout canônico contém seu contrato congelado. Se não contiver, registrar
mismatch e não inferir decisões. A ausência do submódulo impede iniciar RFs
dependentes do contrato canônico.
