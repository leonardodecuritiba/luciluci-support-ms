# docs/reports

Artefatos de avaliação de completude do microserviço e da documentação canônica associada.

## Baseline para `main`

[Report de fechamento da baseline](REPORT-SUPPORT-MAIN-BASELINE-20260910-145800.md):
bootstrap S1 + RF01 formam `MAIN_BASELINE_RF01` e estão prontos para publicação
Git, sem atribuir push remoto ainda não comprovado. Após a publicação, RF02–RF13
devem seguir branches próprias.

## Fechamento atual de S1

[Report de fechamento](REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md): estado
`BOOTSTRAP_IMPLEMENTED_AND_PROVEN`, drift resolvido e provas locais de
PostgreSQL, processo e imagem executadas. A
[revisão independente](REPORT-SUPPORT-S1-REVIEW-20260910-161432.md) e o
[report original](REPORT-SUPPORT-BOOTSTRAP-20260910-154444.md) são históricos.

## RF01

[Report RF01](REPORT-SUPPORT-RF01-20260910-174742.md): endpoint, migration,
OpenAPI, testes e prova PostgreSQL/processo compilado; RF03–RF13 continuam não
implementadas.

## RF02

[Report do checkpoint RF02](REPORT-SUPPORT-RF02-CHECKPOINT-20260910-182050.md) registra
o contrato congelado. A implementação e as provas estão em
[REPORT-SUPPORT-RF02-20260910-185500.md](REPORT-SUPPORT-RF02-20260910-185500.md).

## Finalidade

Os arquivos em `docs/reports/` são relatórios humanos de revisão rápida, gerados com apoio de IA e supervisionados por um desenvolvedor.
Eles **não substituem** o código, o `ACTUAL_STATE.md`, o PRD, o TDD, o TP nem a documentação global; eles resumem aderência, gaps e riscos de forma operacional.

## Convenção de nome

Cada novo relatório deve ser criado com timestamp no nome do arquivo:

- `docs/reports/REPORT-YYYYMMDD-HHmmss.md`

Exemplo:

- `docs/reports/REPORT-20260319-221500.md`

## Cabeçalho interno obrigatório

Todo report gerado deve começar com um cabeçalho explícito contendo, no mínimo:

- `generated_by`
- `generated_at`
- `review_mode` (`wave-1`, `wave-2`, `final`, etc.)
- `microservice`
- `repository_ref`
- `documentation_ref`
- `reviewer` (quando houver)

## Modo de geração

Toda geração/atualização de report deve usar em conjunto:

- `.codex/skills/report-review.md`
- `docs/prompts/report-completeness-prompt.md`
- `docs/reports/REPORT-TEMPLATE.md`

## Modo de revisão em ondas

Os reports devem ser gerados em **ondas**:

1. **Wave 1** - leitura inicial, inventário e gaps óbvios
2. **Wave 2** - cruzamento RF x código x testes x contratos
3. **Wave 3** - divergências, riscos, NFRs e completude técnico-documental
4. **Final** - consolidação para revisão humana

Cada onda pode sobrescrever ou complementar o report em andamento, mas o artefato final deve manter a estrutura canônica do template.

## Template oficial

Use `docs/reports/REPORT-TEMPLATE.md` como esqueleto obrigatório para novos reports.

## Regra obrigatória de rastreabilidade por RF

O report final deve montar uma matriz explícita `RF -> unit / integration / functional`.

Regras:

- cada RF real encontrada em `prd.md`, `tdd.md` e `tp.md` deve aparecer na matriz
- a matriz deve apontar paths, suites, casos ou artefatos reais de evidência
- o `standard-ms` não prova automaticamente a tríade para qualquer domínio futuro; o serviço derivado precisa montar sua própria rastreabilidade
- agrupamentos são permitidos quando múltiplas RFs compartilham o mesmo fluxo/teste, mas a justificativa precisa ficar explícita na linha da matriz
- não marcar `[x]` ou `completa` sem evidência objetiva
- quando a coluna `functional` estiver ausente, registrar a ausência ou a exceção; não substituí-la por inferência

## Regra obrigatória de bootstrap herdado

O report deve registrar objetivamente se o serviço derivado herdou e atualizou:

- `api.http`
- `scripts/seed.ts`

Regras:

- `api.http` não conta como presente apenas por regra documental; o arquivo precisa existir e cobrir endpoints funcionais + superfície operacional aplicável
- o seed não conta como robusto apenas por existir; o report deve registrar volume, estratégia, uso de `faker` quando aplicável e reprodutibilidade
- quando o domínio derivado ainda não tiver definido volumes finais, o report deve marcar isso explicitamente como pendência local e não como evidência completa

## Regra obrigatória de fronteira NFR

Antes de registrar qualquer NFR como gap do microserviço, o report deve classificá-lo em uma destas categorias:

- `implementado localmente`
- `upstream/plataforma`
- `compartilhado`
- `fora do escopo desta release`
- `gap real local`

Regras:

- presença em documentação global do ecossistema não implica obrigação local automática no repositório do serviço
- itens `upstream/plataforma` não devem ser promovidos a gap local
- itens `compartilhado` só viram gap local após decisão explícita do serviço derivado
- itens `fora do escopo desta release` devem ser reportados como tal, sem inflar a lista de lacunas reais locais
- `DLQ`, `TTL`, `redrive`, `retry exponencial` e `poison message handling` em RabbitMQ não entram como gap local automático no `standard-ms`; a baseline padrão herdável fica restrita a exchange/fila duráveis, outbox, consumer de exemplo e idempotência de consumo

## Support — RF02 integration checkpoint

- `REPORT-SUPPORT-RF02-INTEGRATION-CHECKPOINT-20260910.md` — fechamento local de RF02 e gates para commit/push/PR/merge.
