# Support — política de branches após RF01

## 1. Baselines

- `MAIN_BASELINE_RF01`: bootstrap S1 + RF01, primeiro baseline funcional estável.
- `MAIN_BASELINE_RF02`: revisão de `main` que contenha RF02
  `IMPLEMENTED_AND_PROVEN`, após integração da branch
  `feat/support-rf02-update-department`.
- `MAIN_BASELINE_RF03`: revisão de `main` que contenha RF03
  `IMPLEMENTED_AND_PROVEN`, após integração da branch
  `feat/support-rf03-list-departments`.

RF02 foi integrada em `main` pelo merge
`e2dba18a7d0c54577805d6bf2f44adc40ecf0295`; essa revisão estabelece
`MAIN_BASELINE_RF02`. O nome do baseline descreve conteúdo integrado, não
substitui SHA/tag.

RF03 foi integrada em `main` pela PR #2 no merge
`0ca1eab9fcc74a4254b710fd12342d761234e9ff`; essa revisão estabelece
`MAIN_BASELINE_RF03`. RF04 foi integrada pela PR #3 no merge
`04f4f8eb0f9c741fae7947a370fb50c121d8a624`, estabelecendo
`MAIN_BASELINE_RF04`.

## 2. Regra de continuidade

Depois da publicação do baseline:

1. `main` é a referência estável e não deve receber desenvolvimento funcional direto.
2. Cada RF/slice começa somente após o checkpoint contratual aplicável.
3. A branch deve nascer de `main` sincronizada com `origin/main`.
4. Uma branch não deve misturar RFs independentes.
5. A integração em `main` ocorre somente depois de código, contrato, testes, provas e documentação do recorte estarem coerentes.
6. `push --force` em `main` é proibido.
7. Atualização de `luciluci-docs` é tratada como operação de outro repositório; seu commit deve existir remotamente antes de o serviço apontar o gitlink para ele.

## 3. Convenção recomendada

| Tipo                 | Convenção                  | Exemplo                               |
| -------------------- | -------------------------- | ------------------------------------- |
| nova RF              | `feat/support-rfNN-<slug>` | `feat/support-rf02-update-department` |
| drift/correção       | `fix/support-<slug>`       | `fix/support-rf02-validation`         |
| documentação isolada | `docs/support-<slug>`      | `docs/support-rf03-contract`          |

A convenção é operacional; o número da RF e o escopo real continuam definidos
pelo PRD/TDD/TP canônicos.

## 4. Abertura de uma RF

Antes de criar a branch, confirmar:

- `git fetch origin`;
- `main` local sem mudanças e alinhada ao remoto;
- submódulo `luciluci-docs` limpo e na revisão pretendida;
- contrato da RF congelado;
- decisões `DEC-SUP-*` do recorte resolvidas;
- RF anterior encerrada ou independência explicitamente documentada.

Fluxo recomendado:

```bash
git switch main
git fetch origin
git pull --ff-only origin main
git switch -c feat/support-rf02-update-department
```

Não executar `pull`, reset, stash ou troca de branch automaticamente quando houver
mudanças locais não classificadas. Primeiro preservar e classificar a árvore.

## 5. Fechamento de uma RF

Antes da integração, exigir no mínimo:

- lint/build e gates técnicos aplicáveis;
- testes unitários, integração, contrato e prova funcional do recorte conforme TP;
- OpenAPI/`api.http` sincronizados quando houver superfície HTTP;
- migration e prova PostgreSQL quando houver persistência;
- `ACTUAL_STATE.md`, `DRIFT_REPORT.md` e report da RF atualizados;
- RFs fora do lote ainda ausentes/inalteradas;
- `git diff --check`;
- nenhum segredo, `.env`, build, coverage ou log staged.

O merge/push em `main` deve ser fast-forward ou seguir a política remota do
repositório; nunca force-push. Se proteção de branch exigir PR, a proteção
prevalece.

## 6. Continuidade após o checkpoint RF04 (histórico)

RF03 está implementada, provada e integrada em `MAIN_BASELINE_RF03`. O
checkpoint RF04 de 2026-09-17 resolveu DEC-SUP-01/03/06/08/09/10/12 somente no
recorte de soft delete e publicou o contrato canônico 0.6. O próximo lote
funcional, quando explicitamente aberto, deve nascer de `main` sincronizada:

```text
feat/support-rf04-delete-department
```

A branch `feat/support-rf04-delete-department` foi criada a partir de
`MAIN_BASELINE_RF03` e depois integrada pela PR #3. À época deste checkpoint,
RF05–RF13 estavam fora do runtime; RF05 exigia integração prévia da RF04 e
checkpoint próprio.

## 7. Checkpoint RF06 durante pausa RF05 (histórico)

O contrato RF05 está congelado em Support 0.7 (`cc9a4399d210114e3c8261f3c153f8339c049ffb`), mas não foi integrado como runtime em `MAIN_BASELINE_RF04`. O checkpoint RF06 é exclusivamente documental e roda em worktree separada. Decisões de papéis, transferência, target inativo e semântica HTTP impedem congelar Support 0.8. Não criar `feat/support-rf06-update-ticket` até existir base Git estável com RF05, preferencialmente `MAIN_BASELINE_RF05`, e contrato RF06 fechado. Não usar worktree RF05 não commitada como base implícita.

## 8. Contrato RF06 0.8 e implementação futura

Support 0.8 foi congelado/publicado na branch canônica `docs/support-rf06-contract`, commit `4650ec671c948a4fa8fb04fa33b300d8fd255ae4`. O checkpoint anterior da seção 7 permanece histórico. `RF06_IMPLEMENTATION_DEPENDS_ON_RF05_RUNTIME = YES`: a branch funcional RF06 só pode nascer de base Git estável com RF05, preferencialmente `MAIN_BASELINE_RF05`, após conferir o contrato fixado. Não empilhar runtime RF06 sobre trabalho RF05 não commitado; não criar a branch funcional durante este lote documental.
