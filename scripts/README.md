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

## Exemplo de referência

No `products-ms`, a baseline esperada é:

- cerca de `200 produtos`
- cerca de `30 categorias`

com diversidade suficiente para validar os comportamentos principais do serviço.
