# support-ms

Microsserviço de Support (Suporte) da LuciLuci. Bootstrap S1 e RF01 compõem o
primeiro baseline funcional estável do serviço. A fonte de verdade de negócio está em
`luciluci-docs/support/`.

## Estado

A base técnica S1 está `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. O drift de
entrypoints foi corrigido e provado em PostgreSQL/processo/imagem isolados;
consulte [ACTUAL_STATE](ACTUAL_STATE.md), [o drift encerrado](.codex/drifts/DRIFT-SUP-S1-001-dist-entrypoints.md) e
[o report de fechamento](docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).

RF01 está implementada e comprovada. RF02–RF13 permanecem NOT_IMPLEMENTED.
A OpenAPI documenta RF01 e os endpoints operacionais; ela não é contrato de
tickets, mensagens ou histórico.
O recorte tem evidência consolidada no
[report RF01](docs/reports/REPORT-SUPPORT-RF01-20260910-174742.md).

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
- `POST /api/support/departments`

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
`npm run proof:rf01:postgres` apenas com todas as variáveis `S1_PROOF_*`
apontando a banco exclusivo e descarte-o ao final. `npm run proof:s1:image`
cria e limpa sua própria rede, containers e imagem temporária. `npm run dev`
continua não sendo prova da cadeia compilada.

RF01 está fechado. RF02–RF13 seguem bloqueadas pelos próprios gates; não iniciar
RF02 sem seu checkpoint documental explícito.

## Fluxo Git após o baseline RF01

A publicação de bootstrap + RF01 estabelece `main` como baseline estável. Depois
desse ponto, não desenvolver novas RFs diretamente em `main`: sincronize a branch,
abra uma branch específica para o slice e só integre o trabalho comprovado. Exemplo
para o próximo lote: `feat/support-rf02-update-department`.

A política completa está em
[`docs/workflows/support-development-branch-policy.md`](docs/workflows/support-development-branch-policy.md).
O prompt de publicação desta baseline está em
[`docs/prompts/support-main-baseline-publication-prompt.md`](docs/prompts/support-main-baseline-publication-prompt.md).

Não execute `npm run infra:down` como limpeza genérica: o script remove volumes.
