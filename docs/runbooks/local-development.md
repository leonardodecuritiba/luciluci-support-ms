# Local Development

## Subir ambiente

```bash
npm install
cp .env.example .env
npm run infra:up
npm run migration:run
npm run seed
npm run dev
```

## Endpoints úteis

- `GET /health`
- `GET /metrics`
- `GET /api-docs`
- `GET /api-docs-json`
- `GET /events-docs`

## Acesso à documentação e à infraestrutura

Consulte `infra-access.md` para URLs, portas, credenciais padrão e regra documental obrigatória para futuros microserviços.

## Formatação ao salvar

- O workspace já configura `editor.formatOnSave` e `Prettier` em `.vscode/settings.json`.
- No VS Code, mantenha a extensão `esbenp.prettier-vscode` instalada para aplicar formatação automática em TypeScript, JavaScript, JSON, YAML e Markdown.
- Todo microserviço derivado deste template deve manter essa configuração funcional e documentada no fluxo local de desenvolvimento.

## Formatação em git hooks

- No `pre-commit`, o projeto roda `lint-staged`, aplica `Prettier` nos arquivos staged, executa `lint` e executa `test`.
- No `pre-push`, o projeto roda `npm run format`; se houver mudanças geradas pelo Prettier, o push é bloqueado para que essas mudanças sejam commitadas antes do envio.
- Todo microserviço derivado deste template deve documentar explicitamente quais hooks de formatação e validação existem em commit e push.

## Pipeline central

- O CI (`.github/workflows/ci.yml`) não depende dos hooks locais e executa seus próprios gates:
  - `npm run lint`
  - `npm run build`
  - `npm run openapi:export`
  - validação formal de OpenAPI via `npm run openapi:check`
  - compatibilidade backward de OpenAPI e AsyncAPI contra o baseline da branch base/commit anterior
  - `npm run test:coverage`
  - `npm run coverage:check`
- O workflow `.github/workflows/cd.yml` publica imagem Docker real no GHCR apenas para tags `v*`.
- Não existe deploy automático de ambiente neste repositório nesta release; o workflow de publicação entrega apenas o artefato de container.

## Observabilidade mínima

- logs estruturados com correlation id
- métricas Prometheus
- payload padronizado de erro
