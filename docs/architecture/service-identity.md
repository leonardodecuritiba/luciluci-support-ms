# Service Identity

## Objetivo

`service-identity.json` é a fonte de verdade local machine-readable da identidade do template e do futuro microserviço derivado.

Ele existe para reduzir resíduos de `profile`, `profiles`, `standard-ms` e `standard_ms` durante bootstrap, report e drift-fix.

## Localização

- raiz do repositório: `service-identity.json`

## O que o arquivo governa

- slug do template e do serviço
- nome de exibição do serviço
- feature de exemplo singular/plural
- nome padrão do banco
- artefatos canônicos de OpenAPI e AsyncAPI
- coleção HTTP manual
- exchanges padrão de RabbitMQ
- lista mínima de resíduos obrigatórios a substituir na derivação
- padrão de localização de `luciluci-docs`

## Regra de uso no bootstrap

Antes de implementar RFs em um serviço derivado:

1. atualize `service-identity.json`
2. audite resíduos de `profile`, `profiles`, `standard-ms` e `standard_ms`
3. renomeie artefatos, banco, exchanges, rotas, exemplos e docs a partir desse arquivo
4. só então avance RF por RF

## Regra de sincronismo

Toda mudança em `service-identity.json` deve permanecer alinhada, no mesmo ciclo, com os artefatos tocados pela derivação:

- código
- testes
- OpenAPI
- AsyncAPI
- `api.http`
- docs
- prompts
- CI

## Relação com a documentação canônica

- `service-identity.json` governa a identidade local do template/serviço
- `./luciluci-docs/<service>/` governa o domínio real quando ele existir
- se houver conflito de naming entre identidade local e domínio real, a decisão deve ser explicitada antes da implementação
