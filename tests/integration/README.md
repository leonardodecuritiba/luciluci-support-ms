# tests/integration

Testes de integração com app Express real, PostgreSQL real e, quando aplicável, RabbitMQ real.

As suites desta pasta validam wiring HTTP com `supertest`, persistência no banco de teste e o fluxo ponta a ponta do outbox publisher até o broker sem mock da entrega final.
