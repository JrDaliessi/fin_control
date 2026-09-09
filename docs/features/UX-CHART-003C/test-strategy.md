# Estratégia de testes — UX-CHART-003C

## Identificação

- Feature: `UX-CHART-003C — Tudo, período personalizado e drill-down`
- Fase: Dia 2 — Validation Strategy
- Estado-alvo: `TEST_STRATEGY_READY`
- Small release em RED: `UX-CHART-003C1 — Domínio e URL`
- Baseline dirigido: 7 suítes, 77 testes, 0 snapshots, todos verdes antes do RED

## Princípio de execução

A matriz cobre a feature inteira, mas os testes executáveis seguem a ordem das small releases. O Dia 2 materializa RED somente para `003C1`; os contratos de `003C2` e `003C3` permanecem especificados abaixo e serão convertidos em RED imediatamente antes de cada implementação. Isso evita manter o pipeline inteiro vermelho enquanto a primeira fatia é construída.

Nenhum teste existente será enfraquecido. Expectativas alteradas refletem apenas requisitos aprovados que substituem o comportamento anterior, como `custom` deixar de ser um valor desconhecido.

## Matriz de rastreabilidade

| Critério | Cenários principais | Camada | Evidência planejada | Fase executável |
| --- | --- | --- | --- | --- |
| `FPRD-UXCHART003C-AC-001` | nove opções, `all`, `custom`, URL preservada após refresh | presentation/App Router | `FinancialPeriodSelector.test.tsx`, `DashboardRoutes.test.tsx`, `financial-period-search-params.test.ts` | `003C1` RED |
| `FPRD-UXCHART003C-AC-002` | data inválida, ordem invertida, >60 anos, >60 buckets | domain | `resolve-custom-financial-period.test.ts` | `003C1` RED |
| `FPRD-UXCHART003C-AC-003` | primeira transação e fallback sem movimentos | application/infrastructure/SQL | use case de evolução, repository e pgTAP de âncora | `003C2` planejado |
| `FPRD-UXCHART003C-AC-004` | fronteiras 31d/6m/2a/15a, buckets parciais e resposta agregada mínima | domain/SQL | resolver custom e pgTAP de comportamento | domínio em `003C1` RED; SQL em `003C2` |
| `FPRD-UXCHART003C-AC-005` | ano→trimestres, trimestre→meses, voltar no painel único | application/presentation | testes de drill-down e painel | `003C3` planejado |
| `FPRD-UXCHART003C-AC-006` | tabela e gráfico disparam o mesmo intervalo por teclado/clique | presentation | tabelas, gráficos e switcher | `003C3` planejado |
| `FPRD-UXCHART003C-AC-007` | mês final, máximo 31 dias, concorrência e resposta obsoleta | application/presentation | extrato e painel contextual | `003C3` planejado |
| `FPRD-UXCHART003C-AC-008` | anônimo, dois tenants, invoker, ACL e ausência de detalhe bruto | SQL/infrastructure | pgTAP schema/behavior/RLS e mapper | `003C2` planejado |
| `FPRD-UXCHART003C-AC-009` | até 60 pontos e 320/390/768/1280 px sem overflow | domain/presentation/e2e | resolver, testes DOM e browser autenticado | `003C1`, `003C3`, Dia 6 |
| `FPRD-UXCHART003C-AC-010` | sete valores antigos, parâmetros repetidos e telemetria sanitizada | domain/route/observability | regressão Jest e inspeção de eventos | `003C1` RED; Dia 7 |

## RED executável — UX-CHART-003C1

### Domain

Arquivo novo: `src/features/financial-analytics/tests/resolve-custom-financial-period.test.ts`.

- datas inclusivas viram limites semiabertos, inclusive em ano bissexto;
- `referenceOn` é igual a `to` inclusivo;
- 31 dias usa `day`; 32 dias usa `week`;
- até 6 meses usa `week`; acima usa `month`;
- até 2 anos usa `month`; acima usa `quarter`;
- até 15 anos usa `quarter`; acima usa `year`;
- intervalo anual alinhado de 60 anos pode produzir 60 buckets;
- duração acima de 60 anos e 61 buckets civis falham com causas distintas;
- datas inválidas e ordem invertida falham antes de produzir período.

O módulo atual será importado como namespace e o contrato futuro será tratado como opcional. Assim, a ausência de `resolveCustomFinancialPeriod` falha por uma expectativa explícita, não por erro de resolução de módulo ou infraestrutura.

### URL e App Router

Arquivo novo: `src/features/financial-analytics/tests/financial-period-search-params.test.ts`.

- presets existentes continuam válidos;
- `all` é válido sem limites fornecidos pelo browser;
- `custom` só é válido com dois escalares civis;
- datas ausentes, inválidas ou repetidas produzem `invalid_custom`;
- parâmetros extras não viram autoridade financeira.

`DashboardRoutes.test.tsx` comprova que uma seleção custom válida atravessa a composição server-side e uma inválida não chama a consulta financeira.

### Seletor

`FinancialPeriodSelector.test.tsx` passa a exigir nove opções, ordem previsível, `Tudo` como submit GET e `Personalizado` como acionador acessível de escolha de datas. Os sete valores anteriores permanecem cobertos.

## Contratos planejados — UX-CHART-003C2

### Jest

- port de âncora não recebe `userId` no payload da RPC;
- repository chama `load_financial_history_start` sem parâmetros controlados pelo browser;
- `null` recai no mês da referência e mantém o saldo inicial;
- erro de âncora falha como indisponibilidade financeira;
- agregação aceita somente `week/month/quarter/year`.

### pgTAP

- `financial_history_start_schema.test.sql`: assinatura única, invoker, `search_path = ''`, ACL somente `authenticated`;
- `financial_history_start_behavior.test.sql`: menor `occurred_on`, dois tenants, anônimo e retorno nulo;
- extensão dos testes de buckets: `quarter/year`, extremos parciais, máximo 60 anos, máximo 60 buckets, ausência de detalhe bruto e compatibilidade `week/month`;
- performance: claims configuradas, filtro por proprietário e evidência do índice existente antes de qualquer índice novo.

O probe remoto, quando autorizado na fase correspondente, será transacional e terminará em `rollback`.

## Contratos planejados — UX-CHART-003C3

- função pura transforma bucket e granularidade no próximo nível;
- painel mantém uma única árvore modal e uma pilha de navegação;
- título e botão Voltar anunciam o nível atual;
- nova seleção invalida respostas antigas;
- ano carrega trimestre, trimestre carrega mês e mês chama o extrato existente;
- Escape fecha o painel, não níveis intermediários; Voltar navega níveis;
- foco permanece contido e volta ao acionador ao fechar;
- tabela expõe a mesma ação do gráfico;
- loading, vazio, erro e retry não apagam o contexto do nível pai.

## Fixtures

- referência padrão: `2026-09-08` em `America/Sao_Paulo`;
- bissexto: `2024-02-29`;
- limite diário: `2026-01-01` a `2026-01-31`;
- limite de seis meses: `2026-01-01` a `2026-06-30`;
- limite de dois anos: `2024-01-01` a `2025-12-31`;
- limite de quinze anos: `2011-01-01` a `2025-12-31`;
- limite de sessenta buckets anuais: `1967-01-01` a `2026-12-31`;
- 61 buckets dentro de 60 anos: `1966-07-01` a `2026-06-30`;
- tenants SQL: dois UUIDs determinísticos, duas contas e movimentos com datas sobrepostas;
- conta sem movimentos com saldo inicial diferente de zero.

## Estratégia de regressão

1. suíte dirigida antes do RED;
2. RED isolado da `003C1` com lista de falhas esperadas;
3. Dia 3: GREEN dirigido e regressão de financial analytics/dashboard;
4. após cada fatia: suíte global, lint e type-check;
5. antes da release: build, audit, pgTAP, advisors, Preview e browser autenticado.

O audit atualmente vermelho por `js-yaml` e `sharp` é bloqueio de merge independente. Ele não será mascarado nem corrigido dentro do Dia 2.

## Critério de conclusão do Dia 2

- todos os dez ACs aparecem na matriz;
- os testes da `003C1` existem e falham somente pelo comportamento ausente;
- baseline anterior permanece registrado e verde;
- contratos SQL e de drill-down estão definidos sem antecipar código;
- nenhuma implementation, migration, dependência ou mutação remota foi criada;
- documentação viva aponta para o Dia 3.

## Evidência executada no Dia 4 — seletor personalizado

- abertura acessível com foco inicial na data de início;
- apresentação responsiva como bottom sheet no mobile e modal compacto no desktop;
- formulário GET canônico com `period=custom`, `from` e `to` e restauração dos valores selecionados;
- validações distintas para campos ausentes, ordem invertida, intervalo acima de 60 anos e mais de 60 candles;
- cancelamento, botão de fechar, backdrop e `Escape` restauram foco e scroll;
- suíte dirigida: 25 testes verdes; regressão completa: 97 suítes e 665 testes verdes.

## Evidência executada no Dia 5 — hardening

- erros do período personalizado expõem códigos estáveis sem alterar as mensagens internas já cobertas;
- a UI traduz códigos tipados e não depende de comparação de strings do domínio;
- cancelamento descarta datas em edição e restaura os valores aplicados presentes na URL;
- suíte dirigida: 2 suítes/41 testes; regressão completa: 97 suítes/666 testes;
- instalação limpa e audit confirmaram `js-yaml` 3.15.2/4.3.2 e `sharp` 0.35.4 sem vulnerabilidades conhecidas.
