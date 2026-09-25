# AGENTS.md

## Contrato atual — RF12 Support 0.14

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

## Estado funcional atual — MAIN_BASELINE_RF11

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
