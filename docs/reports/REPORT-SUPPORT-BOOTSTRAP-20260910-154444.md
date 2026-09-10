# REPORT - Avaliação de completude do microserviço

> **Revisão posterior:** o estado corrente foi reclassificado como
> `BOOTSTRAP_INCOMPLETE` por falha técnica reproduzida nos entrypoints.
> Consulte [a revisão S1](REPORT-SUPPORT-S1-REVIEW-20260910-161432.md).
> Este report preserva as declarações/evidências da execução original;
> não representa o aceite técnico atual. A matriz §3 recebeu apenas errata
> de métodos/paths conforme o PRD original; nenhuma RF passou a implementada.

**status:** Bootstrap S1 concluído com prova de ambiente pendente
**generated_by:** Codex
**generated_at:** 2026-09-10T15:44:44Z
**review_mode:** wave-1
**microservice:** support-ms
**repository_ref:** main / 3c387ab (antes das alterações não commitadas)
**documentation_ref:** luciluci-docs/support/ em 76f7734, com baseline documental local 0.2
**report_file:** docs/reports/REPORT-SUPPORT-BOOTSTRAP-20260910-154444.md
**reviewer:** não informado

---

# 1. Resumo executivo

- RFs documentadas encontradas: 14 (RF01–RF13, com RF07a/RF07b)
- RFs classificadas como **Implementado**: 0
- RFs classificadas como **Parcial**: 0
- RFs classificadas como **Não encontrado**: 14
- RFs classificadas como **Ambíguo**: 0
- RFs com matriz **unit + integration + functional** completa: 0
- Itens de superfície operacional local: 4
- NFRs implementados localmente: correlação, erro, logs, métricas, OpenAPI operacional e idempotência genérica
- NFRs upstream/plataforma: rate limit e Schema Registry externo
- NFRs compartilhados: OpenTelemetry e políticas avançadas de fila
- NFRs fora do escopo: carga/performance, segurança ofensiva e CDC
- Gaps reais locais: prova PostgreSQL/processo real em banco novo isolado

S1 retirou a implementação do exemplo Profile e materializou a base técnica
Support. Não há rota, entidade ou contrato de negócio de Support. O risco
principal é iniciar RF01 sem congelar as decisões DEC-SUP aplicáveis.

# 2. Escopo e fontes analisadas

Foram analisados `src/app.ts`, `src/main.ts`, `src/shared/**`,
`service-identity.json`, `docs/**`, `api.http`, `tests/**`,
`.github/workflows/**` e `luciluci-docs/support/{prd,notes,tdd,tp,dependencies}.md`.

Evidência executada:

- `npm run lint`, `npm run build`, `npm run openapi:export`,
  `npm run openapi:check` e `npm run messaging:check`: passaram.
- `npm run test:unit`, `npm run test:integration` e
  `npm run test:contract`: passaram.
- `npm run test:coverage` e `npm run coverage:check`: passaram;
  linhas/declarações 95,83%, funções 96,96%, branches 77,08%.
- Os dois comandos `docker compose ... config`: passaram.
- Migration e processo real contra PostgreSQL isolado: não executados.

CI/CD: `.github/workflows/ci.yml` está versionado, porém não há URL, run,
SHA ou conclusão remota comprovada nesta revisão. Não foi classificado como
CI saudável por mera presença do workflow.

# 3. Matriz principal RF x implementação

| RF    | Título                        | Fonte      | Endpoint                                                                | Status             | Evidência  |
| ----- | ----------------------------- | ---------- | ----------------------------------------------------------------------- | ------------------ | ---------- |
| RF01  | Criar Departamento            | PRD §RF01  | `POST /api/support/departments`                                         | **Não encontrado** | Fora de S1 |
| RF02  | Editar Departamento           | PRD §RF02  | `PATCH /api/support/departments/{departmentId}`                         | **Não encontrado** | Fora de S1 |
| RF03  | Listar Departamentos          | PRD §RF03  | `GET /api/support/departments`                                          | **Não encontrado** | Fora de S1 |
| RF04  | Excluir Departamento          | PRD §RF04  | `DELETE /api/support/departments/{departmentId}`                        | **Não encontrado** | Fora de S1 |
| RF05  | Criar Ticket                  | PRD §RF05  | `POST /api/support/tickets`                                             | **Não encontrado** | Fora de S1 |
| RF06  | Editar Ticket                 | PRD §RF06  | `PATCH /api/support/tickets/{ticketId}`                                 | **Não encontrado** | Fora de S1 |
| RF07a | Listar tickets do solicitante | PRD §RF07a | `GET /api/support/tickets/requester/{requesterId}`                      | **Não encontrado** | Fora de S1 |
| RF07b | Listar tickets Admin          | PRD §RF07b | `GET /api/support/tickets/admin/{adminId}`                              | **Não encontrado** | Fora de S1 |
| RF08  | Finalizar Ticket              | PRD §RF08  | `POST /api/support/tickets/{ticketId}/resolve`                          | **Não encontrado** | Fora de S1 |
| RF09  | Buscar Ticket por ID          | PRD §RF09  | `GET /api/support/tickets/{ticketId}`                                   | **Não encontrado** | Fora de S1 |
| RF10  | Criar Mensagem                | PRD §RF10  | `POST /api/support/tickets/{ticketId}/messages`                         | **Não encontrado** | Fora de S1 |
| RF11  | Editar Visibilidade           | PRD §RF11  | `PATCH /api/support/tickets/{ticketId}/messages/{messageId}/visibility` | **Não encontrado** | Fora de S1 |
| RF12  | Listar Mensagens              | PRD §RF12  | `GET /api/support/tickets/{ticketId}/messages`                          | **Não encontrado** | Fora de S1 |
| RF13  | Listar Histórico              | PRD §RF13  | `GET /api/support/tickets/history`                                      | **Não encontrado** | Fora de S1 |

# 4. Checklist consolidado por PRD

- [ ] RF01–RF13 não foram implementadas por escopo deliberado de S1.
- [x] O domínio Profile não permanece como substituto indevido de Support.
- [x] O serviço não inventa evento de negócio, autorização, paginação, UID ou
      semântica de mensagem enquanto as DEC-SUP correspondentes seguem abertas.

# 5. Checklist consolidado por TDD

- [x] App e bootstrap HTTP/PostgreSQL reais em `src/app.ts` e `src/main.ts`.
- [x] Correlação, métricas, logs e envelope de erro preservados.
- [x] OpenAPI operacional versionada em `docs/openapi/v1/support-api.json`.
- [x] Mensageria inativa comprovada por `scripts/check-messaging-disabled.js`.
- [~] Migration de infraestrutura existe, mas não foi provada em PostgreSQL
  isolado nesta rodada.
- [ ] Não há componentes, endpoints ou persistência de RF.

# 6. Checklist consolidado por TP

- [x] Testes unitários de identidade, seed bloqueada, correlação, erro e
      idempotência genérica.
- [x] Testes de integração HTTP operacional e ausência de Profile.
- [x] Teste de contrato OpenAPI operacional.
- [ ] Testes funcionais/E2E de Support.
- [ ] Testes de RF Support.

## 6.1 Matriz obrigatória RF -> testes

| RF    | Unit    | Integration | Functional | Status               |
| ----- | ------- | ----------- | ---------- | -------------------- |
| RF01  | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF02  | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF03  | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF04  | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF05  | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF06  | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF07a | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF07b | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF08  | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF09  | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF10  | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF11  | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF12  | ausente | ausente     | ausente    | ausente — fora de S1 |
| RF13  | ausente | ausente     | ausente    | ausente — fora de S1 |

# 7. Inventário de endpoints reais

## Endpoints funcionais

Nenhum endpoint funcional está registrado.

## Endpoints operacionais / contratos

| Método | Path           | Implementação | RF       | Estado                                |
| ------ | -------------- | ------------- | -------- | ------------------------------------- |
| GET    | /health        | src/app.ts    | não é RF | operacional; mensagens not_applicable |
| GET    | /metrics       | src/app.ts    | não é RF | operacional                           |
| GET    | /api-docs      | src/app.ts    | não é RF | operacional                           |
| GET    | /api-docs-json | src/app.ts    | não é RF | operacional                           |

# 8. Fronteira NFR e capacidades transversais

## 8.1 Matriz obrigatória de fronteira NFR

| Item                                      | Categoria                    | Evidência / conclusão                    |
| ----------------------------------------- | ---------------------------- | ---------------------------------------- |
| Correlação, logs, métricas, erro, OpenAPI | implementado localmente      | runtime e testes executados              |
| Idempotência genérica                     | implementado localmente      | schema, serviço e teste unitário         |
| Rate limit / Schema Registry externo      | upstream/plataforma          | não assumido por S1                      |
| OpenTelemetry / DLQ / TTL / redrive       | compartilhado                | sem decisão local                        |
| Performance, segurança ofensiva, CDC      | fora do escopo desta release | sem suíte dedicada                       |
| Processo PostgreSQL isolado               | gap real local               | migration não executada em ambiente novo |

## 8.2 Capacidades transversais

| Capacidade              | Estado                                       |
| ----------------------- | -------------------------------------------- |
| HTTP operacional        | implementado e testado                       |
| Mensageria              | inativa, explicitamente verificada           |
| AsyncAPI                | não aplicável no S1                          |
| Seed de negócio         | bloqueada intencionalmente                   |
| Compatibilidade OpenAPI | gate preservado para baseline Support futura |

# 9. Cobertura de testes

As 25 asserções de S1 passaram. A cobertura global passou os thresholds
configurados; ela é evidência do bootstrap técnico, não cobertura das 14 RFs.
SQLite in-memory é usado em testes HTTP e não comprova comportamento de
PostgreSQL em processo separado.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

Todas as RF01–RF13, entidades de negócio, seed significativa, autorização e
provas E2E continuam planejadas e não foram implementadas por recorte.

## 10.2 Código existe, documentação não comprova

Nenhum comportamento de domínio foi adicionado sem fonte. A infraestrutura
remanescente é técnica e está documentada neste report.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Nenhuma divergência encontrada: o estado distingue S1 implementado da prova
PostgreSQL pendente.

## 10.4 PRD / TDD / TP divergem entre si

As decisões DEC-SUP abertas estão registradas em `notes.md`; não foram
resolvidas por inferência nesta rodada.

## 10.5 Ambiguidades que impedem conclusão segura

Headers/identidade, permissões, UIDs, envelopes de resposta, paginação,
visibilidade de mensagens e semântica de repetição devem ser fechados antes do
slice de RF correspondente.

# 11. Conclusão

S1 está `BOOTSTRAP_IMPLEMENTED_PENDING_PROOF`: a base técnica e seus gates
locais passaram, enquanto a prova PostgreSQL de processo real permanece
pendente. RF01–RF13 continuam `NOT_IMPLEMENTED`. Próxima ação prioritária:
registrar as decisões aplicáveis e implementar somente RF01 (Department) com
contrato, migration, seed e tríade de testes própria.
