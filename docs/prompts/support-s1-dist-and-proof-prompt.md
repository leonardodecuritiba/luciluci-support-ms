# Support — Correção do entrypoint compilado e fechamento de S1

> **HISTÓRICO — concluído em 2026-09-10.** `DRIFT-SUP-S1-001` está
> `RESOLVED / PROVEN`; consulte o report de fechamento. Não reexecute este
> lote sem uma nova reprodução objetiva do mesmo drift.

## Missão e limite do lote

Execute a correção de `DRIFT-SUP-S1-001` e as provas de aceitação do bootstrap
S1 neste checkout de `support-ms`. Não refaça a derivação inteira, não
implemente RF01–RF13 e não aprove decisões funcionais por inferência.

O único drift de código autorizado neste lote é a inconsistência entre a
saída do build e os entrypoints compilados. Testes, checks, CI, runbooks e
provas PostgreSQL/processo real necessários ao fechamento pertencem a esse
lote. Novos defeitos independentes devem ser reproduzidos e registrados,
não corrigidos por refatoração ampla ou escondidos como limite ambiental.

Branch sugerida: `fix/support-s1-dist-entrypoints`.
Preserve a branch/árvore atual; não crie, troque ou resete branches sobre
trabalho local sem necessidade. Não faça commit, push, tag ou deploy.

## 1. Leitura e inventário seguros

Leia `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`,
`.codex/skills/drift-fix.md`, o drift específico,
`docs/workflows/support-bootstrap-plan.md`, o report de revisão S1 e sua
evidência. Consulte a documentação canônica `luciluci-docs/support/` na
revisão real local, principalmente README, notes, TDD e TP.

Registre `git status --short`, branch/HEAD e estado do submódulo separadamente.
O tar revisado não contém `.git` nem `luciluci-docs`; não promova os SHAs
citados pelo report anterior a revisões verificadas sem conferi-los.
Preserve alterações rastreadas e não rastreadas do usuário.

Não execute `git submodule update --remote`, checkout/reset/clean destrutivo,
nem substitua o conteúdo local do submódulo. Inicialize somente a revisão
fixada se necessário e seguro. Se a documentação canônica estiver
indisponível, registre o limite: a correção estritamente técnica pode avançar
com os contratos operacionais locais; nenhuma RF ou decisão de domínio pode
ser iniciada nessa condição.

Confira Node/npm, lockfile, Docker/daemon e disponibilidade de uma instância
PostgreSQL realmente descartável. Não leia ou publique segredos. Não carregue
`.env` existente como destino padrão para a prova e não o sobrescreva.

## 2. Reproduzir o defeito antes de corrigir

O anexo revelou:

- `tsconfig.json` define `rootDir: "."`; `tsconfig.build.json` herda essa raiz.
- A saída recebida possui `dist/src/main.js` e runners em `dist/src/shared/...`.
- `start` e `start:docker` exigem `dist/main.js`.
- `migration:run:dist` e `migration:revert:dist` exigem `dist/shared/...`.
- Os quatro comandos falharam com `MODULE_NOT_FOUND` no próprio entrypoint,
  antes de qualquer import da aplicação, conexão ou escrita.

Reproduza com as dependências fixadas do projeto (`npm ci`, sem atualizar
versões) e build limpo. Limpeza de `dist` só é permitida após confirmar que
é saída gerada, interna à raiz e sem symlink/arquivos do usuário. Na dúvida,
use uma cópia temporária controlada que contenha também as alterações locais
relevantes; não use somente HEAD se ele deixar de fora o trabalho recebido.

Antes de executar qualquer runner, comprove que o alvo ainda está ausente.
Se o checkout já contiver a correção, não execute migrations contra defaults
apenas para buscar um erro antigo: verifique o estado e passe às regressões
com banco explicitamente isolado.

Guarde comando, exit code, stderr e inventário do build. Não aceite um
diretório `dist` antigo como prova de compilação limpa.

## 3. Corrigir o alinhamento build → entrypoints

Prefira uma alteração localizada em `tsconfig.build.json` que produza o
layout de produção já declarado pelos scripts: raiz `src`, saída `dist` e
inclusão apenas das fontes de produção, sem arrastar scripts de seed,
configuração Jest ou suítes para dentro de uma raiz incompatível.

Preserve `tsconfig.json` para testes e scripts TypeScript executados em seu
fluxo próprio. Uma alternativa de ajustar os scripts ao layout atual só é
aceitável se houver motivo demonstrado e todos os consumidores — start,
start:docker, migration run/revert, Docker e documentação — forem alinhados.
Registre a decisão técnica; não mantenha dois layouts concorrentes nem copie
arquivos para mascarar a origem do erro.

Não altere modelo de domínio, semântica de HTTP, identidade do BFF,
X-Caller/X-Performed, idempotência de RF, paginação ou permissões. Não
reintroduza Profile, broker, outbox, AsyncAPI ou seed de domínio.

## 4. Regressão automatizada e CI

Adicione uma verificação real do build, com nome explícito no package, como
`build:check`, e seus testes positivos/negativos. Ela deve detectar a falta
dos arquivos efetivamente usados por start, start:docker e migration run/revert.
A verificação não pode se limitar a pesquisar texto no tsconfig, testar apenas
`createApp()` ou pressupor que `tsc` retornar zero comprova o entrypoint.

Execute o check depois de um build limpo. Cubra a ausência de um entrypoint
em fixture/diretório temporário próprio, sem apagar artefatos do usuário.
Registre o RED da configuração anterior e o GREEN da correção; não invente
execução retrospectiva. Integre o check à CI após build.

Acrescente prova dedicada PostgreSQL/processo real à CI ou ao fluxo de
aceitação versionado, com comando executável e falha explícita quando a prova
é exigida e não pode ser realizada. Não use SQLite como fallback. Não reduza
thresholds, não exclua código para melhorar percentuais e não use uma suíte
vazia ou `skip` como PASS de persistência.

A CI recebida provisiona PostgreSQL, mas as suítes examinadas usam SQLite
in-memory. O serviço PostgreSQL, sozinho, não é evidência de migration ou
startup real. A base usada no novo gate deve ser criada explicitamente e ser
a mesma apontada pelo runner e pelo processo; não suponha que `DB_NAME`
cria a base por existir como variável de ambiente.

## 5. Preparar prova PostgreSQL isolada

Use somente infraestrutura descartável criada para esta execução, com
identificador exclusivo, portas livres/efêmeras e bind de host restrito a
loopback quando aplicável. Não use `support_ms`, bancos de outros serviços,
recursos compartilhados ou credenciais existentes por mera conveniência.

Os compose files atuais possuem `container_name: support-ms-db` e volume de
dados. Não considere apenas mudar o nome do projeto Compose uma prova de
isolamento. Use configuração de prova independente, sem nomes fixos
conflitantes e sem os volumes persistentes do projeto. Não inicialize os
compose files normais contra recursos existentes para fazer este teste.

Antes de migration/revert/escrita, registre, sem senha: id do recurso criado,
identificador da execução, host/porta, nome do banco sintético e confirmação
SQL de `current_database()`/servidor e schema vazio. Não use `synchronize:true`.
Todos os DB\_\* da prova devem ser definidos explicitamente para que dotenv ou
defaults não selecionem outro destino.

Se Docker/PostgreSQL estiver indisponível, continue a correção e os gates que
não dependem dele. Registre `BLOCKED_BY_ENVIRONMENT` somente nos casos não
executáveis. Não promova o bootstrap a `AND_PROVEN` e não solicite acesso a
homologação/produção como atalho.

## 6. Provas obrigatórias de migration e persistência

No banco novo e isolado:

1. Execute o runner compilado oficial `npm run migration:run:dist`.
2. Inspecione o catálogo: `idempotency_keys` e a tabela de controle de
   migrations são esperadas; não pode haver tabelas de Profile, classificação,
   broker/outbox nem Department/Ticket/Message/AuditLog de negócio.
3. Confira colunas/chaves e o registro da migration técnica realmente
   executada. A tabela de controle do TypeORM não é uma tabela de domínio.
4. Execute o mesmo runner outra vez: não deve reaplicar a migration nem
   duplicar estrutura/dados de teste. Não confunda isso com idempotência de RF.
5. Prove um round-trip sintético usando o repositório/serviço genérico real:
   criação/leitura, conclusão e replay do status/body, preservando a forma do
   JSON. Não crie endpoint de negócio ou chave vinculada a cliente real.
6. Em recurso descartável sob a mesma guarda de ownership — ou segundo banco
   descartável — execute `migration:revert:dist`, verifique a remoção esperada
   e reaplique a migration. Nunca use revert contra ambiente compartilhado.
7. O runner TS continua disponível: valide sua compatibilidade em base isolada,
   sem usá-lo para encobrir falha do runner compilado.

Se surgir incompatibilidade real de migration/schema/persistência, não a
classifique como problema ambiental. Registre reprodução e impacto como novo
drift; mantenha a conclusão S1 bloqueada em vez de alterar silenciosamente a
semântica do kernel ou abrir uma RF.

## 7. Processo real e imagem

Inicie o processo compilado pelo comando oficial, não por Supertest nem
importando `createApp()`. Use porta isolada, polling de prontidão com timeout,
logs e verificação do exit code. A base deve ter migrations executadas.

Verifique em HTTP real:

- `/health`: estado esperado, `database: true`, mensageria desativada com
  `status: not_applicable`.
- `/metrics` e `/api-docs-json`: respostas válidas; JSON só com os quatro
  paths operacionais contratados.
- Swagger UI em `/api-docs`/`/api-docs/`, registrando redirects reais em vez de
  presumir um código exato não exercitado.
- `/profiles` e rota representativa de `/api/support/*` continuam ausentes
  quando se envia uma correlação válida. Sem correlação, a falha transversal
  não deve ser confundida com existência de endpoint de negócio.
- Tratamento de correlação/erro continua aderente aos testes S1 existentes.

Encerre somente o processo criado para a prova e registre o resultado. Teste
`start:docker` em ambiente isolado: ele deve completar o runner de migration e
chegar ao processo HTTP, não apenas existir como string no package.

Com Docker disponível, faça também build e smoke da imagem com o CMD real e
PostgreSQL isolado. `docker compose config` não substitui isso. Um smoke de
`start:docker` no host não comprova a imagem. Use contexto de build controlado,
sem arquivos `.env`, segredos ou resíduos locais capazes de mascarar falhas.
Não publique a imagem e não faça upgrades de dependências fora do drift.

Mantenha o teste de seed bloqueada antes de qualquer conexão/escrita, com
destino explicitamente descartável/inacessível em vez do banco do usuário.
Se imagem/daemon estiverem indisponíveis, reporte a prova de imagem como
pendente, sem apresentá-la como executada ou saudável.

## 8. Gates, evidências e classificação

Execute e registre separadamente:

```bash
npm ci
npm run lint
npm run build
# Executar aqui o check do build efetivamente criado no package.
npm run openapi:export
npm run openapi:check
npm run messaging:check
npm run test:unit
npm run test:integration
npm run test:contract
npm run test:coverage
npm run coverage:check
git diff --check
```

Confira também o diff do OpenAPI exportado: este lote não implementa novas
rotas de negócio. Registre os comandos reais adicionais de processo,
PostgreSQL, imagem e CI. Não credite o checker do JSON antigo como nova
execução de cobertura.

Estados:

| Estado                                | Critério                                                                                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BOOTSTRAP_INCOMPLETE`                | Entry point/build segue quebrado ou outra falha técnica aplicável foi reproduzida e não corrigida.                                                                |
| `BOOTSTRAP_IMPLEMENTED_PENDING_PROOF` | Correção e gates disponíveis passaram; somente provas identificadas permanecem sem execução, sem falha técnica aberta.                                            |
| `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`    | Gates aplicáveis, migrations PostgreSQL, persistência e processo compilado foram provados; registre imagem separadamente e não declare Docker saudável sem smoke. |

Na avaliação deste lote, se Docker integra a forma de entrega que se pretende
aprovar, sua prova também deve estar concluída para o aceite dessa forma de
entrega; um aceite restrito ao processo host deve ficar explícito no report.
Nenhum desses estados autoriza RF01 automaticamente. Não afirmar CI remoto
verde sem URL/run/SHA efetivamente consultados; workflow alterado ou execução
local não são um run remoto. Não faça push apenas para obter essa evidência.

## 9. Documentação, limpeza e encerramento

Atualize ACTUAL_STATE, DRIFT_REPORT, o drift, plano, README/runbooks pertinentes
e crie report com timestamp real, usando o template/skill do projeto. Preserve
o report original e a revisão que identificou a falha como histórico. Registre
comandos, versões, antes/depois, testes, banco/recursos sintéticos, limites,
checks não executados e diferenças entre PostgreSQL, SQLite e imagem.

Encerre processos/containers somente quando seu identificador pertencer a
esta prova e remova exclusivamente seus recursos descartáveis. Não execute
`npm run infra:down`, `docker system prune`, `down -v` sobre o projeto normal,
DROP/TRUNCATE em base preexistente ou reset/clean do Git. Se não for possível
comprovar ownership, preserve o recurso e registre sua existência.

Depois das provas, faça apenas o checklist de admissão de RF01: confira no
submódulo real as decisões aplicáveis de identidade (DEC-SUP-01), papel/ação
(03), responses/validações (08), UIDs (09) e idempotência (10), conforme o
plano e a baseline efetivamente presentes. Esse mapeamento vem da baseline
0.2 anterior e deve ser conferido no checkout, sem inventar conteúdo atual.
Não marque nenhuma decisão aprovada pelo envio deste prompt. Dúvidas exclusivas
de paginação, transferência ou mensagens não devem bloquear a correção de S1
nem ser resolvidas aqui. Pare antes de RF01.

## Formato da entrega

Apresente: resumo do drift; arquivos alterados; correção realizada; matriz de
comandos/resultados e provas RED/GREEN; documentação; situação de revisão da
PR; pendências ambientais ou novos defeitos; gates para RF01. RF01–RF13
permanecem `NOT_IMPLEMENTED` em todas as matrizes.
