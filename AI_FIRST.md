# AI_FIRST

Leia nesta ordem:

1. `ACTUAL_STATE.md`
2. `docs/architecture/overview.md`
3. `src/README.md`
4. `tests/README.md`
5. `./luciluci-docs/<servico>/` quando o submodule estiver montado

Precedência documental:

1. `./luciluci-docs/`
2. implementação viva do serviço atual
3. referências históricas

Regras operacionais:

- Trabalhe RF por RF.
- Atualize `ACTUAL_STATE.md` ao abrir, executar e concluir blocos relevantes.
- Pare imediatamente se houver DRIFT entre docs e implementação.
- Não invente contrato, evento ou modelagem em caso de ambiguidade crítica.
- Em handoff, documente próximos passos, bloqueios e comandos de validação.

Navegação de baixo custo:

- `src/features/profile/` mostra o padrão da feature.
- `src/shared/` concentra kernel, infra e contratos reutilizáveis.
- `tests/` reflete o desenho real do template.

