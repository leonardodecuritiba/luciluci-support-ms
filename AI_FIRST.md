# AI_FIRST

Leia nesta ordem:

1. `ACTUAL_STATE.md`
2. `docs/architecture/overview.md`
3. `src/README.md`
4. `tests/README.md`
5. `./luciluci-docs/<servico>/`

Precedência documental:

1. `./luciluci-docs/`
2. implementação viva do serviço atual
3. referências históricas

Regras operacionais:

- Trabalhe RF por RF.
- Antes de usar `./luciluci-docs/`, execute `git submodule update --remote --recursive`.
- Atualize `ACTUAL_STATE.md` ao abrir, executar e concluir blocos relevantes.
- Pare imediatamente se houver DRIFT entre docs e implementação.
- Não invente contrato, evento ou modelagem em caso de ambiguidade crítica.
- Em handoff, documente próximos passos, bloqueios e comandos de validação.
- Todo microserviço deve documentar acesso à documentação e à infraestrutura local relevante.
- Ao derivar um novo microserviço a partir deste template, remova todas as menções à feature de exemplo `profile` de código, testes, docs, contratos, exemplos, eventos, rotas e artefatos auxiliares.
- Nenhum serviço derivado pode ser considerado aderente enquanto ainda existirem referências residuais a `profile` ou `profiles` fora de documentação histórica explicitamente marcada como template legado.
- Todo microserviço HTTP aplicável deve exigir `X-Correlation-ID` como header obrigatório de entrada.
- Ao derivar o `standard-ms` para um domínio real, remova todas as menções residuais a `profile` em código, testes, docs, contratos e artefatos gerados. Diretórios vazios e referências herdadas do template também devem ser eliminados.
- Não é permitido fallback silencioso por autogeração de `X-Correlation-ID` em requisições HTTP externas.
- Na ausência de `X-Correlation-ID`, a requisição deve ser rejeitada com erro de cliente, usando o envelope padrão de erro.
- A OpenAPI local deve marcar `X-Correlation-ID` como `required: true` nos endpoints aplicáveis.
- O valor de `X-Correlation-ID` deve ser propagado para response, logs, auditoria, eventos e chamadas downstream quando aplicável.
- Components sem boundary HTTP direto (workers, consumers, jobs) podem gerar `correlation_id` apenas quando não houver contexto anterior para propagar.
- Todo microserviço derivado deve manter um arquivo `api.http` na raiz do repositório para validação manual dos endpoints HTTP expostos pelo serviço.
- O arquivo `api.http` deve cobrir todos os endpoints ativos e relevantes do microserviço, incluindo health, métricas, documentação e endpoints funcionais do domínio.
- Sempre que houver criação, remoção ou alteração de rota, método, path, headers obrigatórios, query params, request body ou exemplos de resposta, o `api.http` deve ser atualizado no mesmo trabalho.
- Não considerar a implementação concluída se o `api.http` estiver desatualizado em relação ao contrato e ao comportamento real do serviço.
- Todo microserviço derivado deve possuir seed com volume significativo de dados para desenvolvimento, validação manual e testes de integração locais.
- Seeds muito pequenos não devem ser tratados como suficientes para validar listagens, paginação, filtros, ordenação, cargas operacionais e fluxos em massa.
- Sempre que fizer sentido, usar `faker` para gerar massa realista, porém com determinismo controlado por seed fixa/reprodutível.
- A documentação do serviço deve declarar explicitamente a estratégia de seed, os volumes mínimos esperados e exemplos concretos por domínio.
- Exemplo de referência: no `products-ms`, o seed deve gerar aproximadamente `200 produtos` e `30 categorias`, com dados variados e relacionamentos válidos.

Navegação de baixo custo:

- `src/features/` mostra o desenho real das features do serviço atual; qualquer menção remanescente a `profile` deve ser tratada como resíduo de template e removida.
- `src/shared/` concentra kernel, infra e contratos reutilizáveis.
- `tests/` reflete o desenho real do template.
- `docs/runbooks/infra-access.md` concentra URLs, portas e credenciais operacionais.
