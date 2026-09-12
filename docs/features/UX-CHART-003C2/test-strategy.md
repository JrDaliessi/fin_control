# Estratégia de testes — UX-CHART-003C2

## Identificação

- Feature: `UX-CHART-003C2 — Agregação segura para histórico completo`
- Fase: Dia 2 — Validation Strategy
- Estado: `TEST_STRATEGY_READY`
- Contrato de entrada: PRD e Spec aprovados em 2026-09-12
- Implementação funcional: ausente por desenho TDD

## Objetivo de validação

Comprovar, antes da implementação, que `Tudo` depende de uma âncora tenant-safe, que o domínio resolve corretamente suas fronteiras, que o adapter não envia autoridade do navegador e que a RPC agregadora precisa evoluir de `week/month` para `week/month/quarter/year` sem perder limites, RLS ou compatibilidade.

## Matriz de rastreabilidade

| Critério | Cenários | Camada | Evidência RED/planejada |
|---|---|---|---|
| `FPRD-UXCHART003C2-AC-001` | menor `occurred_on`, criação fora de ordem e dois tenants | SQL/infrastructure | `financial_history_start_behavior.test.sql`; repository sem payload de usuário |
| `FPRD-UXCHART003C2-AC-002` | âncora nula e âncora futura | domain/application | `resolve-all-financial-period.test.ts`; `list-financial-evolution.use-case.test.ts` |
| `FPRD-UXCHART003C2-AC-003` | âncora válida, término inclusivo e granularidade | domain/application | resolvedor dedicado e consulta trimestral no use case |
| `FPRD-UXCHART003C2-AC-004` | trimestre/ano, buckets parciais, vazios e OHLC existente | SQL/infrastructure | buckets behavior/schema e repository `quarter/year` |
| `FPRD-UXCHART003C2-AC-005` | ordem, allowlist, 60 anos e 60 buckets independentes | domain/SQL | resolvedor existente + mensagens SQL determinísticas |
| `FPRD-UXCHART003C2-AC-006` | dois tenants, `anon`, usuário Auth anônimo e ausência de `user_id` | SQL/infrastructure | schema/behavior de âncora, behavior de buckets e repository |
| `FPRD-UXCHART003C2-AC-007` | retorno escalar da âncora e projeção agregada exata | SQL/mapper | schema de âncora/buckets e regressão do mapper |
| `FPRD-UXCHART003C2-AC-008` | presets, personalizado, `week/month` e URLs existentes | regressão | baseline dirigido e suíte global fora do RED |
| `FPRD-UXCHART003C2-AC-009` | `quarter/year`, `null`, erro de provider e mismatch | infrastructure/application | repository e use case com erros sanitizados |
| `FPRD-UXCHART003C2-AC-010` | Jest, pgTAP, análise estática, plano e advisors | quality | evidências deste ciclo e gates dos Dias 3–7 |

## Contratos Jest em RED

### Domain

Arquivo novo: `src/features/financial-analytics/tests/resolve-all-financial-period.test.ts`.

- exige export dedicado `resolveAllFinancialPeriod`;
- cobre âncora anterior, igual, nula e futura;
- exige término na referência inclusiva;
- preserva `kind: all` no fallback mensal;
- comprova granularidade trimestral e anual.

O teste acessa o export por reflexão para continuar compilável enquanto a função ainda não existe. A falha observada é explícita: o export recebido é `undefined`.

### Application

Arquivo ampliado: `src/features/financial-analytics/tests/list-financial-evolution.use-case.test.ts`.

- consulta a âncora somente em `all`;
- usa buckets para histórico trimestral;
- usa snapshot diário no fallback mensal;
- cobre âncora nula e futura;
- sanitiza falha da consulta de âncora;
- preserva o baseline anterior.

A falha observada é `period kind is invalid`, porque o caso de uso ainda envia `all` ao resolvedor de presets.

### Infrastructure

Arquivo ampliado: `src/features/financial-analytics/tests/supabase-financial-analytics-query.repository.test.ts`.

- substitui legitimamente o contrato antigo que bloqueava `quarter/year`;
- exige `loadFinancialHistoryStart({ userId })` no port interno;
- exige chamada `rpc('load_financial_history_start')` com exatamente um argumento;
- aceita data ISO ou `null` e sanitiza erro externo;
- mantém ausência de `userId/user_id` nos payloads RPC.

As falhas observadas são a rejeição atual de `quarter/year` e a ausência do método de âncora.

## Contratos pgTAP

### Âncora

- `financial_history_start_schema.test.sql`: 15 asserções sobre existência, overload único, retorno `date`, zero argumentos, scalar, invoker, `search_path`, ACL, identidade, anonimato e índice existente;
- `financial_history_start_behavior.test.sql`: 5 asserções sobre ordem por ocorrência, dois tenants, retorno nulo, `anon` e usuário Auth anônimo;
- `financial_history_start_performance.test.sql`: 4 asserções sobre plano, índice composto, RLS com InitPlan e ausência de índice especulativo.

### Agregação longa

- `financial_evolution_buckets_schema.test.sql`: mantém 16 asserções e passa a exigir `quarter/year`, ausência do limite legado de 366 dias e limite longo explícito;
- `financial_evolution_buckets_behavior.test.sql`: passa de 22 para 27 asserções, cobrindo fronteiras parciais, anual longo, teto de 60 pontos, 60 anos e mensagens independentes;
- `financial_evolution_buckets_performance.test.sql`: mantém 5 asserções de plano/RLS/índices.

Total do Context Pack SQL: 72 asserções declaradas, com `plan()` conferido automaticamente em cada arquivo alterado ou criado.

## Fixtures

- referência application: `2026-09-12` em `America/Sao_Paulo`;
- âncora válida: `2020-04-03`;
- âncora igual à referência: `2026-09-12`;
- âncora futura: `2026-10-01`;
- fallback: mês civil `[2026-09-01, 2026-10-01)`;
- trimestre parcial: `[2024-02-15, 2027-04-10)`;
- anual longo: `[2000-06-15, 2026-09-13)`;
- 60 buckets anuais: `[1967-09-13, 2026-09-13)`;
- acima de 60 anos: `[1966-09-12, 2026-09-13)`;
- tenants SQL: três usuários permanentes e um usuário Auth anônimo, com ocorrências sobrepostas.

## Evidência executada

### Baseline antes do RED

- 5 suítes dirigidas;
- 77 testes verdes;
- 0 snapshots;
- nenhum arquivo funcional alterado antes da medição.

### RED Jest

- 3 suítes vermelhas;
- 15 cenários falharam pelas capacidades ainda ausentes;
- 17 regressões dentro dessas suítes permaneceram verdes;
- 0 snapshots;
- nenhuma falha de import, infraestrutura ou tipagem.

### Regressão fora do RED

- 95 suítes verdes;
- 651 testes verdes;
- 0 snapshots.

### RED pgTAP remoto transacional

Um probe mínimo executado pelo MCP Supabase falhou 3 de 3 checks esperados:

1. `load_financial_history_start()` ainda não existe;
2. a RPC agregadora ainda não contém `quarter/year`;
3. a RPC agregadora ainda mantém o teto legado de 366 dias.

O probe terminou em `ROLLBACK`. A confirmação posterior mostrou `pgtap_persisted=false`, `history_start_persisted=false` e contrato antigo preservado. Nenhuma função, extensão ou fixture persistiu.

### Análise estática

- ESLint verde, zero warnings;
- type-check verde;
- cardinalidade dos `plan()` pgTAP conferida;
- `git diff --check` deve permanecer verde no fechamento documental.

## Estratégia do Dia 3

Ordem mínima GREEN:

1. implementar o resolvedor puro de `Tudo`;
2. adicionar o método de âncora ao port e orquestrá-lo no use case;
3. implementar o adapter da âncora e abrir `quarter/year` no adapter;
4. gerar a migration via comando oficial do Supabase CLI quando disponível, ou registrar o bloqueio de toolchain antes de criar o arquivo;
5. implementar SQL localmente e executar pgTAP transacional antes de qualquer aplicação persistente;
6. executar regressão completa, análise estática e build.

## Critério de conclusão

- 10 critérios de aceite rastreados;
- RED Jest observado pela causa correta;
- RED pgTAP observado com rollback confirmado;
- regressão anterior, lint e type-check verdes;
- nenhum código funcional, migration, índice ou mutação remota persistente;
- próximo passo restrito ao Dia 3 após aprovação humana.
