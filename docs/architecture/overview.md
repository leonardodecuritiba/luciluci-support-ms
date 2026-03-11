# Arquitetura

O `standard-ms` segue o modelo validado no ecossistema LuciLuci:

- Express para HTTP
- TypeORM para persistência
- PostgreSQL como banco principal
- RabbitMQ para integração assíncrona
- Outbox para publicação confiável
- Clean Architecture com separação por feature

Fluxo principal:

1. Requisição HTTP entra com `X-Correlation-ID`
2. Controller valida DTO e orquestra o caso de uso
3. Escritas persistem entidade, audit log e outbox na mesma transação
4. Worker publica eventos pendentes do outbox
5. Consumer externo atualiza snapshot com idempotência de consumo
