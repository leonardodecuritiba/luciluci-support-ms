# support-ms

Microsserviço de Support (Suporte) da LuciLuci. Bootstrap S1 e RF01–RF04 compõem
`MAIN_BASELINE_RF04` em `main`. RF05 tem contrato 0.7 congelado; RF06 está em
contrato Support 0.8 congelado e publicado, sem runtime. A fonte de verdade de negócio está em
`luciluci-docs/support/`.

## Estado

A base técnica S1 está `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. O drift de
entrypoints foi corrigido e provado em PostgreSQL/processo/imagem isolados;
consulte [ACTUAL_STATE](ACTUAL_STATE.md), [o drift encerrado](.codex/drifts/DRIFT-SUP-S1-001-dist-entrypoints.md) e
[o report de fechamento](docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).

RF01–RF04 estão implementadas, comprovadas e integradas em `main`. RF05 tem
contrato documental publicado, mas runtime não integrado. RF06–RF13 permanecem
`NOT_IMPLEMENTED`; o contrato RF06 0.8 está congelado, mas sua implementação
aguarda base Git estável com RF05. A OpenAPI executável documenta
RF01–RF04 e os endpoints
operacionais; ela não é contrato de tickets, mensagens ou histórico. As
evidências estão consolidadas nos reports
[RF01](docs/reports/REPORT-SUPPORT-RF01-20260910-174742.md) e
[RF02](docs/reports/REPORT-SUPPORT-RF02-20260910-185500.md) e
[RF03](docs/reports/REPORT-SUPPORT-RF03-20260917-155713.md), além do
[fechamento RF04](docs/reports/REPORT-SUPPORT-RF04-20260917-164908.md).

## Executar localmente

```bash
npm ci
test -e .env || cp .env.example .env
npm run infra:up
npm run migration:run
npm run dev
```

O ambiente local requer apenas PostgreSQL. Não execute `npm run seed` nesta
fase: o comando falha de modo explícito até a massa determinística de W1 ser definida.

## Endpoints disponíveis

- `GET /health`
- `GET /metrics`
- `GET /api-docs`
- `GET /api-docs-json`
- `GET /api/support/departments`
- `POST /api/support/departments`
- `PATCH /api/support/departments/{departmentId}`
- `DELETE /api/support/departments/{departmentId}`

Consulte `api.http`, `docs/runbooks/local-development.md` e
`docs/runbooks/infra-access.md`.

## Validação

```bash
npm run lint
npm run build
npm run build:check
npm run openapi:export
npm run openapi:check
npm run messaging:check
npm run test:coverage
npm run coverage:check
```

Antes de executar provas de processo, confirme o destino: use
`npm run proof:rf01:postgres`, `npm run proof:rf02:postgres` ou
`npm run proof:rf03:postgres` ou `npm run proof:rf04:postgres` apenas com todas
as variáveis `S1_PROOF_*` apontando a banco exclusivo e descarte-o ao final.
`npm run proof:s1:image`
cria e limpa sua própria rede, containers e imagem temporária. `npm run dev`
continua não sendo prova da cadeia compilada.

RF01–RF04 estão fechadas e integradas. O contrato RF05 0.7 está publicado no
submódulo; seu runtime não foi retomado neste checkpoint. RF06 tem contrato 0.8 publicado e não possui runtime. Ver o novo report
contratual RF06 em `docs/reports/`; o checkpoint bloqueado anterior é histórico.

## Fluxo Git por baseline funcional

Bootstrap + RF01 estabeleceram `MAIN_BASELINE_RF01`; a PR #1 estabeleceu
`MAIN_BASELINE_RF02`; a PR #2 integrou RF03. A PR #3 integrou RF04 no merge
`04f4f8eb0f9c741fae7947a370fb50c121d8a624`; a revisão atual de `main` é
`MAIN_BASELINE_RF04`.

Não desenvolver novas RFs diretamente em `main`: sincronize a branch, conclua o
checkpoint contratual e abra uma branch específica para o slice. O contrato RF05 0.7 foi publicado em `cc9a4399d210114e3c8261f3c153f8339c049ffb`.
O checkpoint RF06 usa worktree documental própria. O commit histórico `2f3dfec` foi preservado; o freeze canônico 0.8
`4650ec671c948a4fa8fb04fa33b300d8fd255ae4` foi publicado e é o gitlink
desta branch documental. A implementação depende de base Git estável com RF05,
preferencialmente `MAIN_BASELINE_RF05`.

A política completa está em
[`docs/workflows/support-development-branch-policy.md`](docs/workflows/support-development-branch-policy.md).
O fechamento/publicação da RF02 está em
[`docs/prompts/support-rf02-publication-prompt.md`](docs/prompts/support-rf02-publication-prompt.md).

Não execute `npm run infra:down` como limpeza genérica: o script remove volumes.
