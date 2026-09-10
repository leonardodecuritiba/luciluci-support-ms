# Support — política de branches após RF01

## 1. Baselines

- `MAIN_BASELINE_RF01`: bootstrap S1 + RF01, primeiro baseline funcional estável.
- `MAIN_BASELINE_RF02`: revisão de `main` que contenha RF02
  `IMPLEMENTED_AND_PROVEN`, após integração da branch
  `feat/support-rf02-update-department`.

Enquanto RF02 ainda estiver apenas na feature branch, `main` permanece em
`MAIN_BASELINE_RF01`. O nome do baseline descreve conteúdo integrado, não substitui
SHA/tag e não autoriza inferir publicação remota.

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

## 6. Continuidade após RF02

RF02 está implementada e provada em branch própria. O fechamento correto é:

1. publicar o commit canônico Support 0.4 de `luciluci-docs`;
2. registrar no serviço o gitlink para esse commit publicado;
3. commitar e pushar `feat/support-rf02-update-department`;
4. abrir PR contra `main` e exigir checks verdes;
5. integrar sem force-push;
6. verificar a revisão resultante de `main` e classificá-la como
   `MAIN_BASELINE_RF02`.

Depois disso, o próximo trabalho é **checkpoint contratual da RF03**, ainda sem
implementação. Somente após esse checkpoint a branch funcional deve nascer de
`main` sincronizada:

```text
feat/support-rf03-list-departments
```

RF04–RF13 permanecem fora do escopo.
