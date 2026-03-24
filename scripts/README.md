# scripts

Scripts operacionais do template.

Arquivo principal desta release: `seed.ts`

## Regra obrigatória para seeds

O script `seed.ts` não deve gerar apenas um conjunto mínimo simbólico de registros.

Ele deve produzir uma massa de dados útil para:

- desenvolvimento local
- validação manual
- testes de integração locais
- inspeção de paginação, filtros, ordenação e relacionamentos

## Diretrizes

- Sempre que fizer sentido, usar `faker` para gerar dados realistas.
- Preferir seed determinística/reprodutível.
- O volume gerado deve ser significativo para o domínio do microserviço.
- O seed deve acompanhar a evolução do domínio e não pode ficar congelado em poucos registros estáticos.

## Estratégia materializada no template

O `standard-ms` agora materializa a estratégia com:

- `3` perfis de referência fixos, usados também como apoio para o `api.http`
- `117` perfis adicionais gerados com `faker`
- seed fixa `20260324` para manter reprodutibilidade
- variação de `status`, `entityType`, `country`, `city` e `classification snapshot`

Regra de herança:

- esse volume é apenas o exemplo do template-base
- o microserviço derivado deve redefinir volumes, entidades e relacionamentos de acordo com o domínio real
- a expectativa herdável é manter massa útil para paginação, filtros, ordenação, validação manual e testes locais

Scripts principais desta release:

- `seed.ts`
- `check-asyncapi.js`
- `check-asyncapi-backward-compatibility.js`
- `export-openapi.js`
- `check-openapi.js`
- `check-openapi-backward-compatibility.js`
- `check-coverage.js`
