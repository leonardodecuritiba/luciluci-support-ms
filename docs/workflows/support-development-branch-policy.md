# Support — política de branches após RF01

## 1. Baselines

- `MAIN_BASELINE_RF01`: bootstrap S1 + RF01, primeiro baseline funcional estável.
- `MAIN_BASELINE_RF02`: revisão de `main` que contenha RF02
  `IMPLEMENTED_AND_PROVEN`, após integração da branch
  `feat/support-rf02-update-department`.
- `MAIN_BASELINE_RF03`: revisão de `main` que contenha RF03
  `IMPLEMENTED_AND_PROVEN`, após integração da branch
  `feat/support-rf03-list-departments`.
- `MAIN_BASELINE_RF04`: revisão de `main` que contenha RF04
  `IMPLEMENTED_AND_PROVEN`, após integração da branch
  `feat/support-rf04-delete-department`.
- `MAIN_BASELINE_RF05`: revisão de `main` que contenha RF05
  `IMPLEMENTED_AND_PROVEN`, após integração da branch
  `feat/support-rf05-create-ticket`.
- `MAIN_BASELINE_RF06`: revisão de `main` que contenha RF06
  `IMPLEMENTED_AND_PROVEN`, após integração da branch
  `feat/support-rf06-update-ticket`.

RF02 foi integrada em `main` pelo merge
`e2dba18a7d0c54577805d6bf2f44adc40ecf0295`; essa revisão estabelece
`MAIN_BASELINE_RF02`. O nome do baseline descreve conteúdo integrado, não
substitui SHA/tag.

RF03 foi integrada em `main` pela PR #2 no merge
`0ca1eab9fcc74a4254b710fd12342d761234e9ff`; essa revisão estabelece
`MAIN_BASELINE_RF03`.

RF04 foi integrada em `main` pela PR #3 no merge
`04f4f8eb0f9c741fae7947a370fb50c121d8a624`; essa revisão estabelece
`MAIN_BASELINE_RF04`.

RF05 foi integrada em `main` pela PR #4 no merge
`2cfb637854c5c90abfaf197e6e0822ceb53571f8`; essa revisão estabelece
`MAIN_BASELINE_RF05`.

RF06 foi integrada em `main` pela PR #5 no merge
`0387167cfe02416c5d05cf3b8288350dd5ba682b`; essa revisão estabelece
`MAIN_BASELINE_RF06`.

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

## 6. Continuidade após a integração RF06

RF05 está implementada, provada e integrada em `MAIN_BASELINE_RF05`. O contrato
RF06 foi congelado na revisão 0.8, publicada em
`4650ec671c948a4fa8fb04fa33b300d8fd255ae4`.

A branch `feat/support-rf06-update-ticket` foi criada a partir de `main`
sincronizada, fixou o contrato 0.8 e implementou/provou RF06. A PR #5 foi
integrada; `main` é `MAIN_BASELINE_RF06`. Support 0.9 foi publicado no commit
canônico `1583a586793437a7b7c0569581637ee8ddac5ae5` e congela
RF07a/RF07b. `RF07_IMPLEMENTATION_BASELINE = MAIN_BASELINE_RF06`; a futura
branch `feat/support-rf07-list-tickets` depende de lote explícito. RF07a/RF07b
e RF08–RF13 permanecem fora do runtime.
