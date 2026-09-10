# REPORT — RF02 Integration Checkpoint

**status:** `DOCS_COMMIT_PUBLISHED / SERVICE_PUSHED / PR_OPEN_QUALITY_IN_PROGRESS`
**microservice:** `support-ms`
**branch:** `feat/support-rf02-update-department`
**functional_state:** RF01 `IMPLEMENTED_AND_PROVEN`; RF02 `IMPLEMENTED_AND_PROVEN`; RF03–RF13 `NOT_IMPLEMENTED`
**target_baseline_after_merge:** `MAIN_BASELINE_RF02`

## 1. Escopo fechado

RF02 implementa exclusivamente `PATCH /api/support/departments/{departmentId}`.
O report de implementação registra PATCH parcial não vazio, preservação de campos
omitidos, replace atômico de memberships, ordem/duplicatas/`[]`, no-op sem write,
lock pessimista PostgreSQL, edição de inativos sem restore e respostas
`200/400/404/422/500`.

RF03–RF13 permanecem sem rota e foram verificadas como `404` na prova RF02.

## 2. Evidência herdada do report RF02

O report `REPORT-SUPPORT-RF02-20260910-185500.md` registra aprovação de lint,
build/build:check, 29 testes unitários, 42 de integração, 2 de contrato, cobertura,
OpenAPI, mensageria, provas PostgreSQL de RF01/RF02, smoke da imagem/CMD de produção
e `git diff --check`.

Este checkpoint não reatribui essas execuções: ele apenas governa a publicação da
revisão já comprovada.

## 3. Gate documental/submódulo

`luciluci-docs` foi publicado na branch `docs/support-rf02-contract` com o commit
`7cc153fab92b634c898727b983078c4c696d3ea9`, já resolvível em
`origin/docs/support-rf02-contract`. O SHA foi registrado no gitlink pelo commit
`d347786442dd16d00fc4a71fe3a911f2788feda6` do serviço, publicado na branch
`feat/support-rf02-update-department`.

Não publicar no `support-ms` um gitlink que aponte somente para um commit local.
Não incluir alterações documentais alheias ao Support/RF02 no mesmo commit sem
classificação explícita.

## 4. Gate da feature branch

Antes do push/PR:

- permanecer em `feat/support-rf02-update-department`;
- confirmar que a base corresponde à `main` usada para abrir o slice;
- revisar todos os arquivos staged e o gitlink;
- não incluir `.env`, coverage, `dist`, logs, bancos, dumps ou segredos;
- rodar `git diff --check` e os gates mínimos definidos no prompt de publicação;
- não reescrever `main` nem usar `push --force`.

## 5. PR e integração

Título recomendado:

`feat(support): implement RF02 department update`

A PR [#1](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/1) foi
aberta com base `main`, head `feat/support-rf02-update-department` e registra
que RF03–RF13 continuam fora do escopo. No momento, o check remoto `quality`
está `IN_PROGRESS`; o merge só é elegível quando:

1. o commit canônico de documentação referenciado pelo gitlink existir remotamente;
2. a branch estiver publicada sem force;
3. os checks obrigatórios estiverem verdes;
4. não houver mudança inesperada de contrato ou drift novo.

Depois do merge, verificar o SHA realmente presente em `origin/main`. A revisão de
`main` que contiver RF02 comprovada define `MAIN_BASELINE_RF02`.

## 6. Próximo slice

Não implementar RF03 nesta branch. Depois da integração de RF02, executar primeiro
o checkpoint contratual de RF03. Só então criar, a partir de `main` sincronizada:

`feat/support-rf03-list-departments`.
