# Bootstrap Prompt

Leia `AI_FIRST.md`, `ACTUAL_STATE.md`, `service-identity.json` e atualize `./luciluci-docs/` com `git submodule update --remote --recursive` antes de tocar no código.

Depois leia a documentação do domínio em `./luciluci-docs/<servico>/`.

Trabalhe RF por RF, mantenha `ACTUAL_STATE.md` atualizado e pare imediatamente em caso de DRIFT.
Comece auditando resíduos de `profile`, `profiles`, `standard-ms` e `standard_ms` antes de abrir a primeira RF.
Antes de registrar qualquer gap NFR no serviço derivado, classifique explicitamente a fronteira `implementado localmente` vs `upstream/plataforma` vs `compartilhado` vs `fora do escopo desta release`.
