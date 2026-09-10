# DRIFT-SUP-S1-001 — Build e entrypoints compilados incompatíveis

- Serviço: `support-ms`.
- Estado: `RESOLVED / PROVEN`.
- Severidade: alta — bloqueia execução compilada.
- Registrado em: 2026-09-10T16:14:32+00:00.
- Origem: anexo SHA-256 `b78bf1a02c07104cedd45735539524ee736cc8be4d1163e38ff1e8d0d5bae930`.
- Escopo: um drift de código, seu teste/check de regressão e provas S1.

## Comportamento esperado

Após build limpo, os comandos oficiais de start, start:docker e migration
run/revert devem encontrar seus entrypoints reais. Banco inacessível pode
impedir a inicialização por motivo próprio; ausência do arquivo de entrada
não é limitação ambiental PostgreSQL.

## Comportamento observado e causa

`tsconfig.json` usa `rootDir: "."`, herdado por `tsconfig.build.json`.
O anexo contém `dist/src/main.js` e `dist/src/shared/...`, mas package e
Dockerfile encadeiam scripts que exigem `dist/main.js` e `dist/shared/...`.

Os quatro comandos compilados foram executados em extração isolada e
falharam com exit code 1 / `MODULE_NOT_FOUND` no próprio entrypoint. Não houve
conexão, migration ou escrita. O report anterior não exercitou esses comandos.

Fontes: `package.json:9-26`, `tsconfig.json:2-19`,
`tsconfig.build.json:1-9`, `Dockerfile:10-18`, no snapshot original.
[Report da revisão](../../docs/reports/REPORT-SUPPORT-S1-REVIEW-20260910-161432.md) e
[evidências](../../docs/reports/evidence/SUPPORT-S1-REVIEW-20260910-161432.md).

## Correção técnica aplicada

`tsconfig.build.json` agora estabelece `rootDir: "src"` e inclui somente
`src/**/*.ts`; o `tsconfig.json` amplo permanece para testes e scripts TS.
Assim, o build emite `dist/main.js` e os runners em
`dist/shared/infrastructure/database/`, no layout consumido por package e
Docker. Não há cópia de artefatos nem layout concorrente.

`build:check` valida os arquivos efetivamente executados, inclusive em fixture
negativa. CI executa o check, a prova PostgreSQL/processo e o smoke da imagem.
O Dockerfile usa `npm ci` e `.dockerignore` exclui `.env` do contexto. Não
houve alteração de domínio, contrato de RF, seed, mensageria ou kernel.

## Aceitação

- [x] Build limpo com RED pré-correção e GREEN pós-correção.
- [x] Check automatizado, fixture positiva e negativa, integrado à CI.
- [x] PostgreSQL novo: runner compilado repetido, round-trip, revert/reapply e runner TS.
- [x] Processos `start` e `start:docker`, HTTP operacional e imagem/CMD reais.
- [x] Estado e report atualizados; RF01–RF13 continuam NOT_IMPLEMENTED.

Execução: [prompt focal](../../docs/prompts/support-s1-dist-and-proof-prompt.md).
