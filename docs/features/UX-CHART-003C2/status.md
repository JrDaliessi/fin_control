# Status — UX-CHART-003C2

- Estado: `SPEC_READY`
- Fase concluída: `Dia 1`
- Aprovação dos requisitos: confirmada em 2026-09-12
- Feature pai: `UX-CHART-003C`
- Branch: `codex/ux-chart-003c2-day-1`
- Código funcional alterado: não
- Migration criada/aplicada: não
- Supabase remoto alterado: não

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

Executar o Dia 2 para materializar a matriz de rastreabilidade e os testes RED em Jest e pgTAP, sem implementação funcional.
