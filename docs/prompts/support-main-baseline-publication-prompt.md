# Prompt — fechar e publicar baseline bootstrap + RF01 em `main`

## Objetivo

Publicar o estado já comprovado de `support-ms` como primeiro baseline estável em
`main`, incluindo bootstrap S1, RF01 e o fechamento documental. Esta execução é
Git/release housekeeping: não implementar RF02–RF13, não alterar comportamento de
domínio e não refatorar código.

Commit recomendado do serviço:

```text
feat(support): bootstrap service and implement RF01
```

Se houver mudanças canônicas ainda não commitadas no submódulo, commit sugerido
para `luciluci-docs`:

```text
docs(support): close RF01 contract and evidence
```

## 1. Leitura e estado esperado

Leia `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, o report
`REPORT-SUPPORT-RF01-20260910-174742.md` e
`docs/workflows/support-development-branch-policy.md`.

Estado esperado antes da publicação:

- S1 = `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`;
- RF01 = `RF01_IMPLEMENTED_AND_PROVEN`;
- RF02–RF13 = `NOT_IMPLEMENTED`;
- nenhum drift técnico aberto conhecido;
- nenhuma implementação adicional deve ser criada nesta execução.

## 2. Proibição de ações destrutivas

Não use `git reset --hard`, `git clean -fd`, `git stash`, `git checkout -- .`,
`git restore .`, `git push --force`, `git push -f` ou atualização de submódulo com
`--remote`. Não descarte nem reescreva mudanças do usuário.

Se a árvore contiver arquivos sem relação com bootstrap/RF01/fechamento, não os
inclua silenciosamente. Se não for possível separar com segurança, interrompa antes
do commit e reporte os paths conflitantes.

## 3. Inventário Git do serviço

Na raiz de `support-ms`, registre:

```bash
git status --short --branch
git branch --show-current
git rev-parse HEAD
git remote -v
git diff --stat
git diff --submodule=short
git submodule status
```

A publicação direta desta baseline pressupõe que o trabalho esteja em `main`. Se a
branch atual não for `main`, não troque de branch automaticamente com árvore suja;
pare e reporte.

Faça:

```bash
git fetch origin main
```

Compare `HEAD`, `origin/main` e o merge-base. Continue somente se o push final puder
ser fast-forward: `origin/main` deve ser ancestral de `HEAD` ou igual ao `HEAD` antes
do novo commit. Se `origin/main` estiver à frente ou houver divergência, não faça
merge/rebase/reset automaticamente; pare e reporte os SHAs.

## 4. Tratar `luciluci-docs` como repositório independente

Não esconda mudanças canônicas dentro do estado do submódulo. Se
`luciluci-docs` estiver inicializado, registre:

```bash
git -C luciluci-docs status --short --branch
git -C luciluci-docs rev-parse HEAD
git -C luciluci-docs remote -v
```

O report RF01 referencia a documentação canônica 0.3 e o commit
`76f77340897dc0916476410aed01a622ed796412`. Use isso como referência histórica,
não como autorização para reset.

### 4.1 Submódulo limpo

Se o submódulo estiver limpo, preserve sua revisão. Não execute `--remote`.

### 4.2 Submódulo com mudanças Support ainda não commitadas

Se houver mudanças canônicas já produzidas pelo lote RF01:

1. confirme que estão restritas a `support/**` e/ou índice documental diretamente
   relacionado;
2. confirme que a branch do submódulo é `main`;
3. `git fetch origin main` dentro do submódulo;
4. só continue se o push for fast-forward;
5. valide whitespace/diff;
6. faça o commit documental;
7. `git push origin main` sem force;
8. confirme que `git ls-remote origin refs/heads/main` retorna o SHA publicado;
9. volte ao serviço e deixe o gitlink apontando exatamente para esse commit.

Se houver mudanças não relacionadas, branch divergente, remote à frente ou proteção
que impeça push direto, não force. Pare e reporte; a publicação do serviço deve
aguardar uma revisão canônica remota reproduzível.

## 5. Gate de publicação do serviço

Como o código já foi provado em PostgreSQL/processo/imagem e este fechamento deve
ser apenas documental/Git, não altere código para “melhorar” resultados. Execute:

```bash
npm run lint
npm run build
npm run build:check
npm run openapi:check
npm run messaging:check
npm run test:coverage
npm run coverage:check
git diff --check
```

Se `openapi:check` exigir export atualizado por diferença real, execute
`npm run openapi:export`, revise o diff e repita o check. Não aceite mudança
gerada inesperada sem classificá-la.

Não é necessário repetir as provas Docker/PostgreSQL pesadas se nenhum arquivo de
runtime, migration, Docker ou script de prova mudou desde
`REPORT-SUPPORT-RF01-20260910-174742.md`; preserve a evidência já registrada. Se um
desses arquivos tiver mudado depois do report, repita a prova afetada antes de
publicar.

## 6. Revisão do staging

Antes de `git add`, liste os arquivos alterados e classifique-os como:

- bootstrap S1;
- correção S1;
- RF01;
- documentação/fechamento;
- gitlink de `luciluci-docs`, quando aplicável.

Não stage `.env`, secrets, `node_modules`, `dist`, `coverage`, `logs`, arquivos
temporários ou artefatos alheios ao lote.

Depois faça staging intencional e valide:

```bash
git add -A
git status --short
git diff --cached --stat
git diff --cached --check
git diff --cached --name-status
```

Inspecione o diff staged. Se houver arquivo não relacionado, remova-o do staging sem
descartar seu conteúdo e reavalie.

## 7. Commit e push em `main`

Se todos os gates anteriores estiverem verdes:

```bash
git commit -m "feat(support): bootstrap service and implement RF01"
git push origin main
```

Não use force. Depois do push, prove o resultado:

```bash
LOCAL_SHA="$(git rev-parse HEAD)"
REMOTE_SHA="$(git ls-remote origin refs/heads/main | awk '{print $1}')"
printf 'local=%s\nremote=%s\n' "$LOCAL_SHA" "$REMOTE_SHA"
test "$LOCAL_SHA" = "$REMOTE_SHA"
git status --short --branch
```

Se o push for recusado porque o remoto avançou, não force nem faça rebase automático
sobre o trabalho. Registre o erro e pare.

## 8. Estado após publicação

Uma publicação comprovada encerra este lote com:

```text
main = MAIN_BASELINE_RF01
S1 = BOOTSTRAP_IMPLEMENTED_AND_PROVEN
RF01 = RF01_IMPLEMENTED_AND_PROVEN
RF02–RF13 = NOT_IMPLEMENTED
```

Não crie RF02 nesta execução. O próximo trabalho é primeiro seu checkpoint
contratual e, depois, branch própria criada a partir de `main` sincronizada:

```text
feat/support-rf02-update-department
```

## 9. Saída obrigatória

Apresente:

1. branch inicial e final;
2. SHA de `origin/main` antes da publicação;
3. status e SHA do `luciluci-docs`;
4. se houve commit/push no submódulo e seus SHAs;
5. comandos de validação executados e resultados;
6. paths incluídos no commit do serviço;
7. SHA do commit criado no `support-ms`;
8. resultado do `git push origin main`;
9. comparação `LOCAL_SHA == REMOTE_SHA`;
10. estado final da árvore;
11. confirmação de que RF02–RF13 não foram implementadas;
12. próximo branch recomendado para RF02.

Não declare publicação concluída sem igualdade objetiva entre o SHA local e o SHA
remoto de `main`.
