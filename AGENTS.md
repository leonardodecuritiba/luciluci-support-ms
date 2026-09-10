# AGENTS.md

## Missão

Este checkout é `support-ms` (Suporte), derivado do `standard-ms`.
Identidade e superfície operacional foram materializadas, Profile foi retirado
e RF01 está implementada/provada. RF02–RF13 continuam não implementadas. Leia
`ACTUAL_STATE.md` para o estado real.

O `DRIFT-SUP-S1-001` foi corrigido e provado: estado
`BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. O próximo lote é o checkpoint documental
de RF02; não refaz a derivação, não repete S1/RF01 sem nova reprodução e não
inicia RFs automaticamente.

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
A próxima execução só inicia RF02 após seu checkpoint próprio. DEC-SUP-01, 03,
08, 09 e 10 estão resolvidas apenas no recorte RF01.

Trabalhar RF por RF ou um drift por vez; não fazer refactor amplo, antecipar
ondas ou implementar comportamento com decisão crítica aberta. Um gap esperado
de inicialização não é bug comprovado do Support. Propostas de arquitetura
não são decisões de negócio aprovadas.

O lote de revisão pós-S1 está concluído. RF01–RF13 e aprovações funcionais
permanecem fora dele. Qualquer prova futura de banco exige destino descartável
explícito; não usar banco padrão/preexistente.

## Política de branches e `main`

Bootstrap + RF01 formam `MAIN_BASELINE_RF01`. A publicação inicial dessa baseline
em `main` é um fechamento explícito. Depois dela, `main` é branch estável de
integração e não é workspace para RF nova.

Para RF02–RF13: atualizar referências remotas, partir de `main` sincronizada e criar
uma branch própria por slice. Convenção recomendada: `feat/support-rfNN-<slug>`;
correções delimitadas: `fix/support-<drift-ou-slug>`. Não misturar RFs independentes
na mesma branch e não iniciar a RF seguinte antes do fechamento da atual.

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
- RF05 cria ticket + mensagem inicial de forma atômica e somente uma auditoria.
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
