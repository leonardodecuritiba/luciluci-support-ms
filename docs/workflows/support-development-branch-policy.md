# Support — política de branches após RF01

## 1. Baseline

Bootstrap S1 e RF01 formam o baseline `MAIN_BASELINE_RF01`. RF01 está
`IMPLEMENTED_AND_PROVEN`; RF02–RF13 permanecem `NOT_IMPLEMENTED`. A publicação
desse conjunto em `main` encerra a fase de criação direta do primeiro baseline.

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

## 6. Primeiro próximo slice

O próximo trabalho funcional é RF02, mas somente depois do seu checkpoint
contratual. A branch recomendada é:

```text
feat/support-rf02-update-department
```

A criação da branch não autoriza inferir regras ainda abertas de RF02.
