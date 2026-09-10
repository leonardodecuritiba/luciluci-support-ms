# Prompt — publicar RF02 e abrir PR

Execute o fechamento Git da RF02 no checkout real de `luciluci-support-ms`.
O objetivo é publicar a documentação canônica de RF02, commitar/pushar a feature
branch e abrir a PR contra `main`. Não implementar RF03–RF13 e não fazer deploy.

## 1. Pré-leitura obrigatória

Leia:

- `AGENTS.md`
- `AI_FIRST.md`
- `ACTUAL_STATE.md`
- `DRIFT_REPORT.md`
- `docs/workflows/support-development-branch-policy.md`
- `docs/reports/REPORT-SUPPORT-RF02-20260910-185500.md`
- `docs/reports/REPORT-SUPPORT-RF02-INTEGRATION-CHECKPOINT-20260910.md`

Preserve alterações locais. Não use `reset --hard`, `clean -fd`, stash automático,
`pull` destrutivo ou force-push.

## 2. Inspecionar o Git real

No serviço, registre sem alterar estado:

```bash
git status --short --branch
git branch --show-current
git remote -v
git rev-parse HEAD
git rev-parse --verify origin/main
git submodule status
```

Exija `feat/support-rf02-update-department`. Se estiver em outra branch, houver
rebase/merge em andamento ou alterações não classificadas, pare antes de publicar.

Faça `git fetch origin --prune` e compare a base/HEAD com `origin/main`. Não faça
rebase automático se a base tiver divergido; reporte a divergência para revisão.

## 3. Fechar `luciluci-docs` primeiro

Entre no submódulo e inspecione:

```bash
cd luciluci-docs
git status --short --branch
git remote -v
git rev-parse HEAD
git diff -- support/ README.md AI_FIRST.md
```

A baseline citada pelo report é
`6b3cfece4500ab0f9632a0ac4f9c056364443dba`, com alterações Support 0.4 locais.
Não pressuponha que o checkout ainda está exatamente assim: confirme o estado real.

Classifique os arquivos modificados. Para o commit RF02, stage somente documentos
Support/RF02 e índices globais estritamente necessários. Não inclua mudanças de
outros microsserviços.

Se o submódulo estiver em detached HEAD, crie uma branch documental própria, por
exemplo:

```bash
git switch -c docs/support-rf02-contract
```

Valide whitespace/links/checks documentais disponíveis. Então:

```bash
git add <arquivos-documentais-classificados>
git diff --cached --check
git diff --cached --stat
git diff --cached
```

Commit sugerido:

```text
docs(support): close RF02 contract and evidence
```

Faça push normal da branch documental. Se o repositório exigir PR, abra PR contra a
branch padrão e não force integração. O commit apontado pelo serviço deve existir
remotamente; preferencialmente, integre a PR documental antes da PR do serviço.

Registre `DOCS_SHA=$(git rev-parse HEAD)` e confirme que o SHA é resolvível no
remote apropriado antes de continuar.

Volte à raiz do `support-ms` e confirme que o gitlink agora aponta para `DOCS_SHA`.

## 4. Gate final da RF02 no serviço

Antes do commit, rode ao menos:

```bash
npm run lint
npm run build
npm run build:check
npm run test:unit
npm run test:integration
npm run test:contract
npm run openapi:export
npm run openapi:check
npm run messaging:check
npm run format:check
npm run test:coverage
npm run coverage:check
git diff --check
```

Reexecute `npm run proof:rf02:postgres` quando Docker/PostgreSQL descartável estiver
disponível no ambiente de publicação. Se não estiver, não invente sucesso: preserve
a evidência do report anterior e registre a limitação desta rodada.

Confirme que RF03–RF13 não ganharam rotas por acidente.

## 5. Stage e commit da feature branch

Revise arquivos não rastreados e ignorados. Não stage `.env`, segredos, `dist/`,
`coverage/`, logs, dumps ou recursos temporários.

Depois:

```bash
git add <arquivos-classificados-da-RF02> luciluci-docs
git diff --cached --check
git diff --cached --stat
git diff --cached
```

O staged deve conter RF02, regressões necessárias de RF01, provas/CI/documentação e
o gitlink publicado; não deve conter RF03–RF13.

Commit sugerido:

```text
feat(support): implement RF02 department update
```

Crie o commit e registre o SHA real.

## 6. Push e PR

Faça push sem force:

```bash
git push -u origin feat/support-rf02-update-department
```

Se `gh` estiver disponível e autenticado, abra a PR:

```bash
gh pr create   --base main   --head feat/support-rf02-update-department   --title "feat(support): implement RF02 department update"   --body-file /tmp/support-rf02-pr.md
```

Conteúdo de `/tmp/support-rf02-pr.md`:

```markdown
## Resumo

Implementa a RF02 do `support-ms`: `PATCH /api/support/departments/{departmentId}`.

## Implementação

- PATCH parcial não vazio para `name`, `type` e `allowedUserIds`;
- preservação de campos omitidos;
- replace relacional e atômico de memberships, preservando ordem, duplicatas e `[]`;
- no-op sem escrita e sem alterar `updatedAt`;
- lock pessimista PostgreSQL para atualização concorrente;
- edição de departamentos inativos sem restaurar `active`;
- respostas `200/400/404/422/500`;
- sem ACL local, idempotência, auditoria, outbox ou eventos.

## Contratos e provas

- OpenAPI e `api.http` atualizados;
- testes unitários, integração e contrato;
- provas PostgreSQL RF01/RF02 e processo compilado;
- smoke da imagem/CMD de produção;
- CI atualizada para o gate RF02.

Na validação de implementação: 73 testes; 97,55% statements e 97,50% lines.

## Escopo preservado

RF01 permanece `IMPLEMENTED_AND_PROVEN`. RF03–RF13 continuam `NOT_IMPLEMENTED` e
sem rotas. Não há mensageria/auditoria/eventos adicionados por RF02.

## Documentação

PRD/TDD/TP/notes Support 0.4 foram atualizados no `luciluci-docs`; o gitlink desta
branch aponta para o commit documental publicado correspondente.
```

Se `gh` não estiver disponível, apresente título/body e o URL/branch publicados
para abertura manual; não declare PR criada.

## 7. Não fazer merge automaticamente

Pare após criar e verificar a PR. Não faça merge, push direto em `main` ou deploy
nesta execução. Consulte os checks da PR se a ferramenta estiver disponível e
registre o estado real.

O merge será um gate separado. Depois que RF02 estiver efetivamente em `main`, a
revisão resultante passa a ser `MAIN_BASELINE_RF02`; somente então iniciaremos o
checkpoint contratual de RF03.

## 8. Saída obrigatória

Informe:

1. branch e SHA do commit documental;
2. branch e SHA do commit RF02;
3. checks executados e resultados;
4. PR criada (número/URL) ou motivo objetivo por que não foi criada;
5. estado dos checks remotos se consultados;
6. confirmação de RF03–RF13 ainda fora do escopo;
7. qualquer divergência de `origin/main`, submódulo ou arquivo staged.
