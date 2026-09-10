# Identidade do Serviço — Support

`service-identity.json` é a fonte machine-readable da identidade ativa:

| Campo                 | Valor S1                                 |
| --------------------- | ---------------------------------------- |
| templateSlug          | `standard-ms` (proveniência)             |
| serviceSlug / package | `support-ms`                             |
| domainSlug            | `support`                                |
| banco padrão / teste  | `support_ms` / `support_ms_test`         |
| OpenAPI               | `docs/openapi/v1/support-api.json`       |
| coleção HTTP          | `api.http`                               |
| documentação canônica | `./luciluci-docs/support/`               |
| mensageria            | `false`; AsyncAPI `null`; exchanges `{}` |

O inventário de termos do template em `mustBeReplacedWhenDeriving` é
histórico de auditoria, não configuração ativa. Toda RF futura deve atualizar
identidade, código, contrato, testes, CI e documentação no mesmo ciclo.
