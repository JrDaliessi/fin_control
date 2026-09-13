# Status — UX-CHART-003C2

- Estado: `IN_PROGRESS`
- Fase concluída: `Dia 3`
- Aprovação dos requisitos: confirmada em 2026-09-12
- Aprovação do Dia 2: confirmada em 2026-09-12
- Aprovação do Dia 3: confirmada em 2026-09-13
- Feature pai: `UX-CHART-003C`
- Branch: `codex/ux-chart-003c2-day-1`
- Código funcional alterado: sim, núcleo mínimo GREEN
- Migration criada/aplicada: criada localmente; não aplicada de forma persistente
- Supabase remoto alterado: não; validações terminaram em rollback

## Entrada validada

- `UX-CHART-003C1` está liberada e integrada em `develop`;
- Feature PRD, Spec, estratégia de testes e ADR 0022 da feature pai estão vigentes;
- domínio já reconhece `all/custom` e `quarter/year`;
- adapter concreto ainda bloqueia `quarter/year`, como proteção deliberada até esta migration;
- projeto Supabase está saudável em PostgreSQL 17.6 e possui sete migrations publicadas;
- RPC agregadora atual é `SECURITY INVOKER`, tem `search_path` vazio e grant explícito para `authenticated`;
- policies RLS atuais restringem contas e transações ao usuário autenticado;
- Security Advisor mantém somente a pendência externa `SEC-AUTH-001`; Performance Advisor reporta um índice de contas não utilizado, fora deste escopo.

## Entregáveis do Dia 1

- `feature-prd.md` com problema, escopo, regras, 7 requisitos funcionais, 6 não funcionais e 10 critérios de aceite;
- `feature-spec.md` com contratos por camada, SQL/RLS/ACL, migração, performance, rollback e validação planejada;
- `context.yaml` com dependências, impactos, fontes, gates e restrições;
- documentação viva da feature pai, backlog, roadmap, gates e Hot Context atualizada.

## Decisões preservadas

- `Tudo` ancora na primeira transação visível, nunca na criação da conta;
- sem transações, usa o mês civil da referência e preserva o saldo inicial;
- histórico longo trafega apenas como agregado;
- identidade não entra no payload RPC;
- `quarter/year` usam a RPC existente com assinatura preservada;
- 60 anos e 60 buckets continuam limites independentes;
- drill-down e lançamentos permanecem na `UX-CHART-003C3`.

## Decisões novas aprovadas

- se só houver transações futuras em relação à referência, `Tudo` trata o caso como ausência de histórico até aquela data e usa o mês civil da referência;
- quando houver histórico válido, `Tudo` termina na data de referência inclusiva, convertida para limite exclusivo no dia seguinte.

## Validação do Dia 1

- discovery de dependências percorreu domínio, application, adapter, migrations e testes SQL existentes;
- contrato confrontado com schema, funções, indexes, policies, grants e advisors do Supabase em modo somente leitura;
- documentação oficial do Supabase confirmou as práticas de invoker, `search_path`, grants explícitos e RLS;
- nenhum conflito arquitetural exigiu novo ADR;
- os três YAMLs afetados foram parseados e as 23 rotas do artefato ativo existem;
- contagem automatizada confirmou 7 requisitos funcionais, 6 não funcionais e 10 critérios de aceite únicos;
- ESLint, type-check e `git diff --check` passaram; o primeiro lint expôs um wrapper `npm` quebrado no PATH e a repetição com `npm.cmd` passou sem warnings;
- nenhuma migration, teste RED, código funcional, mutação remota, dependência, commit, push ou PR foi executado nesta fase.

## Riscos e bloqueios

- nenhum bloqueio duro impede o Dia 2;
- risco ALTO de performance permanece até fixtures e `EXPLAIN (ANALYZE, BUFFERS)`;
- risco ALTO de isolamento permanece até pgTAP multi-tenant/anônimo;
- novo índice permanece bloqueado sem evidência comparativa;
- `UX-CHART-003C3` permanece fora do escopo.

## Próximo passo

Preparar o Dia 4 para expansão controlada, sem antecipar drill-down da `UX-CHART-003C3`.

## Validação do Dia 2

- baseline dirigido antes do RED: 5 suítes/77 testes verdes e 0 snapshots;
- RED Jest: 3 suítes, 15 falhas esperadas, 17 regressões verdes e 0 snapshots;
- regressão fora do RED: 95 suítes/651 testes verdes;
- ESLint e type-check verdes após ajustar somente a tipagem do harness;
- 72 asserções pgTAP no Context Pack SQL, com todos os `plan()` coerentes;
- probe remoto transacional: 3/3 checks vermelhos pelas capacidades ausentes;
- rollback confirmado: pgTAP e RPC de âncora não persistiram, e a RPC atual manteve o contrato anterior;
- nenhum código funcional, migration, índice, dependência ou mutação remota persistente foi criado.

## Entregáveis do Dia 3

- `resolveAllFinancialPeriod` implementado reutilizando as regras civis e os limites já aprovados;
- port específico `FinancialHistoryStartQueryRepository` adicionado sem acoplar consumidores que não precisam da âncora;
- `ListFinancialEvolutionUseCase` passou a consultar a âncora somente para `all` e preserva fluxos existentes;
- adapter Supabase chama `load_financial_history_start` sem argumentos e aceita apenas `week/month/quarter/year` na RPC agregada;
- migration `20260913173700_extend_financial_history_aggregation.sql` criada pelo comando oficial;
- RPCs permanecem `SECURITY INVOKER`, com `search_path = ''`, identidade por `auth.uid()`, anonimato rejeitado e ACL exclusiva para `authenticated`;
- nenhuma descrição, categoria, conta, UUID ou lançamento bruto foi adicionada ao retorno agregado;
- nenhum índice especulativo foi criado.

## Validação do Dia 3

- RED reconfirmado: 3 suítes, 15 falhas esperadas e 17 regressões verdes;
- GREEN dirigido: 3 suítes e 32 testes verdes;
- seis contratos pgTAP e 72 asserções executados transacionalmente sem erro ou `not ok` reportado;
- rollback confirmado por leitura posterior do catálogo remoto;
- regressão completa: 98 suítes e 683 testes verdes, zero snapshots;
- ESLint, type-check, build de produção e `git diff --check` verdes;
- aplicação persistente da migration e deploy não fazem parte deste checkpoint.

## Riscos após o Dia 3

- aplicação remota persistente continua condicionada ao gate e à autorização da fase correspondente;
- revisão ampliada das fronteiras históricas e do plano observado permanece para hardening;
- `UX-CHART-003C3` continua fora do escopo.
