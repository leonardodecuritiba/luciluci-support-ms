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
3. Atualize o submodule antes de usar a documentação canônica:

```bash
git submodule update --remote --recursive
```

4. Renomeie a feature `profile` para o domínio real.
5. Atualize PRD/TDD/TP em `./luciluci-docs/<servico>/`.
6. Implemente RF por RF mantendo `ACTUAL_STATE.md` vivo.

## Regra obrigatória: rastreabilidade mínima por RF

Todo microserviço derivado deve conseguir demonstrar, no report de completude, como cada RF do domínio se conecta a:

- pelo menos uma evidência `unit`
- pelo menos uma evidência `integration`
- pelo menos uma evidência `functional`, quando o `TP` do domínio exigir essa camada

Regras:

- essa prova pertence ao serviço derivado; o `standard-ms` não deve ser tratado como evidência automática para RFs do domínio futuro
- a matriz `RF -> unit / integration / functional` deve apontar paths reais de testes, suites, casos ou artefatos equivalentes
- quando um mesmo fluxo/teste cobrir múltiplas RFs, o agrupamento deve ser explicado explicitamente
- quando a evidência funcional estiver ausente, isso deve ser declarado no report; não marcar cobertura completa por inferência

## Regra obrigatória: arquivo `api.http`

Todo microserviço derivado deste template deve possuir um arquivo `api.http` na raiz do repositório.

### Finalidade

O `api.http` é o artefato padrão de validação manual dos endpoints HTTP do serviço e deve permitir inspeção rápida do comportamento real durante desenvolvimento, revisão técnica, troubleshooting e handoff.

### Requisitos mínimos

- O arquivo deve cobrir todos os endpoints HTTP ativos e relevantes do microserviço.
- O arquivo deve incluir, quando aplicável:
  - endpoints funcionais do domínio
  - `/health`
  - `/metrics`
  - `/api-docs`
  - `/api-docs-json`
  - `/events-docs`
  - endpoints adicionais de documentação/contrato expostos pelo serviço
- Cada request deve refletir o contrato atual, incluindo:
  - método HTTP correto
  - path correto
  - headers obrigatórios
  - query params relevantes
  - payloads mínimos válidos
- O `api.http` deve ser atualizado sempre que houver mudança de rota, contrato, autenticação, headers obrigatórios, exemplos ou comportamento operacional relevante.

### Regra de aderência

- Não considerar um microserviço aderente ao template se o `api.http` estiver ausente.
- Não considerar uma mudança de API concluída se o `api.http` não tiver sido revisado e atualizado no mesmo ciclo.

## Regra obrigatória: seed com massa significativa

Todo microserviço derivado deste template deve possuir um processo de seed que gere massa de dados suficiente para validação manual, desenvolvimento local e testes de integração.

### Objetivo

O seed não deve existir apenas para “subir o projeto”, mas para criar uma base minimamente útil para:

- listagens reais com paginação
- filtros e ordenações
- relacionamentos entre entidades
- cenários administrativos
- fluxos em massa
- inspeção manual via `api.http`, Swagger e queries locais

### Requisitos mínimos

- Sempre que fizer sentido, usar `faker` para gerar dados realistas.
- O uso de `faker` deve ser preferencialmente determinístico, com seed fixa/reprodutível, para evitar comportamento aleatório difícil de depurar.
- O volume do seed deve ser significativo para o domínio, e não apenas “mínimo para funcionar”.
- A estratégia e os volumes mínimos de seed devem ser documentados no microserviço.

### Exemplo de referência

Para o `products-ms`, considerar como baseline:

- aproximadamente `200 produtos`
- aproximadamente `30 categorias`

com variação suficiente de:

- status
- tipos de produto
- ambientes
- categorias
- preços
- pontuação
- regras de visibilidade/compra quando aplicável

### Regra de aderência

- Não considerar a estratégia de seed suficiente quando ela gerar apenas poucos registros estáticos sem utilidade real para validação.
- Sempre que o domínio crescer, revisar também o seed para manter massa representativa.
- Alterações relevantes no domínio devem refletir em `scripts/seed.ts` e na documentação correspondente.

## Regra transversal obrigatória: X-Correlation-ID

Todo microserviço HTTP derivado deste template, quando aplicável, deve exigir `X-Correlation-ID` como header obrigatório de entrada.

### Requisitos mínimos

- Requisições HTTP externas sem `X-Correlation-ID` devem ser rejeitadas com erro de cliente.
- O serviço não deve autogerar `X-Correlation-ID` como fallback silencioso na borda HTTP.
- A OpenAPI local deve declarar esse header como obrigatório (`required: true`).
- O valor deve ser propagado para responses, logs estruturados, auditoria, eventos e chamadas downstream quando aplicável.
- Workers, consumers e jobs sem entrada HTTP podem gerar `correlation_id` apenas quando não existir contexto anterior para propagação.

### Evidência mínima exigida

Cada serviço derivado deve possuir:

- validação explícita do header na borda HTTP
- contrato OpenAPI marcando `X-Correlation-ID` como obrigatório
- testes automatizados provando:
  - rejeição quando o header estiver ausente
  - aceitação quando o header estiver presente
  - propagação do valor nos pontos relevantes

### Regra mandatória para serviços derivados

- A feature `profile` existe neste repositório apenas como exemplo de referência do template.
- Ao derivar um novo microserviço, todas as menções a `profile` / `profiles` devem ser removidas ou substituídas pelo domínio real.
- Isso inclui código, testes, documentação, exemplos, contratos, eventos, rotas, payloads, diretórios vazios e artefatos auxiliares.
- O serviço derivado não deve ser considerado aderente enquanto restarem referências residuais a `profile` fora de contexto histórico explicitamente marcado como legado de template.

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
npm run openapi:export
npm run openapi:check
npm run asyncapi:check
npm run test:coverage
npm run coverage:check
```

## Hooks locais, CI e publicação

- Hooks locais:
  - `pre-commit`: `lint-staged`, `npm run lint`, `npm run test`
  - `pre-push`: `npm run format`, bloqueio se houver arquivos alterados, `npm run format:check`, `npm run build`, `npm run test`
- CI central (`.github/workflows/ci.yml`):
  - `lint` + `build`
  - export e validação formal do artefato OpenAPI versionado
  - compatibilidade backward para OpenAPI e AsyncAPI usando baseline da branch base/commit anterior
  - suíte completa com cobertura e gate mínimo global
- Publicação central (`.github/workflows/cd.yml`):
  - publica imagem Docker real no GHCR apenas em tags `v*`
  - não executa deploy de ambiente nesta release

## Fronteira NFR do template

O `standard-ms` não trata toda menção global a NFR como obrigação local automática do microserviço derivado.

Antes de registrar qualquer gap em startup, report ou review, classifique o item em uma destas categorias:

- `implementado localmente`
- `upstream/plataforma`
- `compartilhado`
- `fora do escopo desta release`
- `gap real local`

Classificação padrão herdada do template:

- `rate limit` e `Schema Registry externo`: `upstream/plataforma`
- `event-schema-registry.ts`: `implementado localmente` como helper derivado do AsyncAPI versionado
- `OpenTelemetry`, `DLQ`, `TTL`, `redrive`, `retry exponencial` e `poison message handling`: `compartilhado`, exigindo decisão explícita por serviço derivado
- evidência automatizada de `segurança`, `performance/carga` e `CDC/streaming`: `fora do escopo desta release` por padrão

Regra de report:

- não marcar automaticamente como gap local um item classificado como `upstream/plataforma`
- não marcar automaticamente como gap local um item `compartilhado` sem decisão explícita do serviço derivado
- só usar `gap real local` quando a responsabilidade local estiver assumida e a evidência continuar ausente
- não usar `event-schema-registry.ts` como prova de integração com `Schema Registry externo`
- ausência de cliente/SDK/configuração de `Schema Registry externo` no serviço não é gap local automático quando o boundary continuar em plataforma/ecossistema

## Observabilidade e resiliência nesta release

- Baseline herdável padrão de RabbitMQ no template:
  - exchange durável
  - fila durável
  - outbox transacional com publicação real
  - worker real de publicação
  - consumer de exemplo com idempotência de consumo
- Fora da baseline herdável padrão de RabbitMQ:
  - `DLQ`
  - `TTL`
  - `redrive`
  - `retry exponencial`
  - `poison message handling`
- Regra herdada:
  - esses itens avançados continuam `compartilhado` no `standard-ms`
  - não viram gap local automático em serviços derivados
  - só entram como implementação local quando o serviço assumir explicitamente essa política operacional

- Implementado no serviço:
  - logs estruturados com `X-Correlation-ID`
  - métricas Prometheus em `/metrics`
  - healthcheck em `/health`
  - outbox transacional com publicação real em RabbitMQ
  - CI com validação formal de OpenAPI/AsyncAPI, compatibilidade backward e gate global de cobertura
- Parcial nesta release:
  - retry apenas no bootstrap de `PostgreSQL` e `RabbitMQ`, com atraso fixo; não há backoff exponencial de processamento
  - `event-schema-registry.ts` é um registry local em memória derivado do AsyncAPI versionado do repositório; ele ajuda a consultar schemas já versionados no próprio template, mas não substitui integração com `Schema Registry externo`
- Não implementado no `standard-ms` nesta release:
  - tracing distribuído com OpenTelemetry
  - DLQ / TTL / redrive / retry exponencial / poison message handling para filas/consumidores RabbitMQ
  - Schema Registry externo
  - gates automatizados de carga/performance e segurança no CI
  - CDC / integrações de streaming genéricas no template
  - deploy automático de ambiente no workflow central
- Responsabilidade upstream/infra:
  - `429 rate_limited` permanece no API Gateway/BFF, não no processo `standard-ms`
  - governança/integração com `Schema Registry externo` permanece fora do runtime padrão do template, salvo decisão explícita do serviço derivado

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

O path canônico deste template é `./luciluci-docs/`.

Sempre que clonar o projeto ou precisar sincronizar a documentação canônica mais recente, execute:

```bash
git submodule update --remote --recursive
```

## Mapa da estrutura

```text
.
├── docs/                  # Documentação de arquitetura, runbooks e prompts
├── luciluci-docs/         # Mountpoint canônico do submodule de documentação
├── scripts/               # Scripts operacionais do template
├── src/
│   ├── features/profile/  # Feature de referência do template; remover/substituir no serviço derivado
│   └── shared/            # Kernel, infra, contratos e utilitários
├── tests/                 # Testes unitários, integração e contrato
└── .github/workflows/     # CI/CD do template
```

## Prompt para iniciar um novo microserviço

```text
Iremos implementar o microserviço `<MICROSERVIÇO>`.
Você está trabalhando a partir do template standard-ms.

Regras obrigatórias:
- Leia primeiro `AI_FIRST.md`.
- Leia `ACTUAL_STATE.md` antes de qualquer alteração.
- Execute `git submodule update --remote --recursive` antes de usar `./luciluci-docs/`.
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

- `docs/openapi/v1/profiles-api.json`
- `AI_FIRST.md`: instruções operacionais para humanos e IA.
- `ACTUAL_STATE.md`: estado vivo do template e handoff.
- `DRIFT_REPORT.md`: template de bloqueio por inconsistência documental.
- `api.http`: validação manual padronizada dos endpoints HTTP do serviço; deve permanecer sempre atualizado.
- `scripts/seed.ts`: geração de massa inicial e dados de referência para desenvolvimento e validação local; deve permanecer alinhado ao domínio real.
- `docs/asyncapi/v1/standard-ms-events.json`: contrato de eventos.
- `src/app.ts` e `src/main.ts`: bootstrap HTTP e runtime da aplicação.
