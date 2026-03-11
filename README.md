# standard-ms

Template prático de microserviço do ecossistema LuciLuci. Este repositório existe para servir como base real de novos serviços, com documentação AI-first, código executável, contratos versionados, testes e fluxo incremental por RF.

## O que é

- Um baseline executável com Express, TypeScript, TypeORM, PostgreSQL, RabbitMQ, OpenAPI, AsyncAPI, Jest e Docker.
- Um exemplo concreto de feature (`profile`) desenhada para ser renomeada em novos serviços.
- Um template preparado para desenvolvimento guiado por documentação e handoff limpo entre humanos e IA.

## O que não é

- Não é um clone do `luciluci-consultants`.
- Não tenta cobrir todo o domínio consultants.
- Não substitui a documentação canônica de domínio em `./luciluci-docs/`.

## Ordem de leitura recomendada

1. `AI_FIRST.md`
2. `ACTUAL_STATE.md`
3. `docs/architecture/overview.md`
4. `docs/runbooks/local-development.md`
5. `src/README.md`
6. `tests/README.md`

## Como usar

1. Clone ou copie este template.
2. Monte `luciluci-docs` como submodule em `./luciluci-docs/`.

```bash
git submodule add git@github.com:lucilucitecnologia/luciluci-docs.git
```

3. Renomeie a feature `profile` para o domínio real.
4. Atualize PRD/TDD/TP em `./luciluci-docs/<servico>/`.
5. Implemente RF por RF mantendo `ACTUAL_STATE.md` vivo.

## Como rodar localmente

```bash
npm install
cp .env.example .env
npm run infra:up
npm run migration:run
npm run seed
npm run dev
```

## Como validar

```bash
npm run lint
npm run build
npm run test
npm run asyncapi:check
```

## Como acessar a documentação e a infraestrutura local

Consulte `docs/runbooks/infra-access.md`.

Regra do template:

- Todo microserviço derivado deste template deve documentar explicitamente como acessar:
- OpenAPI/Swagger
- AsyncAPI/event docs
- consoles e portas da infraestrutura local usada pelo serviço
- credenciais padrão ou fonte das credenciais
- serviços opcionais, quando existirem, como Redis, MinIO, Kafka, LocalStack ou equivalentes
- serviços ausentes nesta release, quando não fizerem parte do stack mínimo

Não é aceitável deixar descoberta de portas, URLs ou credenciais implícita.

## Submodule `luciluci-docs`

O path canônico deste template é `./luciluci-docs/`. Enquanto o submodule não estiver montado, use `../luciluci-docs/` apenas como referência de leitura temporária durante a construção do serviço.

## Mapa da estrutura

```text
.
├── docs/                  # Documentação de arquitetura, runbooks e prompts
├── luciluci-docs/         # Mountpoint canônico do submodule de documentação
├── scripts/               # Scripts operacionais do template
├── src/
│   ├── features/profile/  # Feature de referência do template
│   └── shared/            # Kernel, infra, contratos e utilitários
├── tests/                 # Testes unitários, integração e contrato
└── .github/workflows/     # CI/CD do template
```

## Prompt para iniciar um novo microserviço

```text
Você está trabalhando a partir do template standard-ms.

Regras obrigatórias:
- Leia primeiro `AI_FIRST.md`.
- Leia `ACTUAL_STATE.md` antes de qualquer alteração.
- Leia a documentação do domínio em `./luciluci-docs/<servico>/`.
- Trabalhe RF por RF.
- Faça um plano inicial antes de codar.
- Atualize `ACTUAL_STATE.md` continuamente.
- Pare imediatamente em caso de DRIFT entre código, PRD, TDD, TP ou documentação global.
- Ao encontrar DRIFT, proponha apenas correções cirúrgicas na documentação de origem.
- Retome sempre do estado atual documentado, sem retrabalho.

Objetivo:
- Implementar um microserviço executável, verificável e de baixo custo de contexto.
- Preservar os pilares do ecossistema: correlação, idempotência, eventos, erros, testes, observabilidade e CI/CD.
- Documentar sempre como acessar OpenAPI, AsyncAPI e toda a infraestrutura local relevante.
```

## Artefatos principais

- `AI_FIRST.md`: instruções operacionais para humanos e IA.
- `ACTUAL_STATE.md`: estado vivo do template e handoff.
- `DRIFT_REPORT.md`: template de bloqueio por inconsistência documental.
- `docs/asyncapi/v1/standard-ms-events.json`: contrato de eventos.
- `src/app.ts` e `src/main.ts`: bootstrap HTTP e runtime da aplicação.
