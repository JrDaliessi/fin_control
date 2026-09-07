# UX-CHART-003A — Estratégia de testes dos períodos imediatos

- Fase: Dia 2 — estratégia de testes e fundação TDD
- Data: 2026-09-06
- Estado: `TEST_STRATEGY_READY`
- Predecessora: Dia 1 aprovado e versionado na PR `#27`

## Objetivo

Converter o contrato da barra `Semana`, `7D`, `Quinzena`, `15D` e `Mês` em testes automatizados antes de alterar `FinancialPeriodSelector` ou a normalização dos parâmetros da rota.

## Matriz por camada

| Camada | Contrato | Evidência do Dia 2 | Estado |
| --- | --- | --- | --- |
| Domain | semana/quinzena civis continuam distintas de 7/15 dias móveis; intervalos permanecem semiabertos | testes existentes de `resolveFinancialPeriod` preservados | Verde |
| Application | uma única resposta continua alimentando resumo, pontos e candles; período resolvido permanece entrada fechada | testes existentes de resolução e listagem preservados | Verde |
| Presentation | cinco ações imediatas na ordem aprovada, nomes acessíveis completos, estado ativo, GET progressivo, alvo de 44 px e rolagem confinada | três novos contratos em `FinancialEvolutionPanel.test.tsx` | RED esperado |
| App Router | `/` mantém `month` por padrão; `/dashboard` aceita os cinco valores; valor desconhecido ou repetido recai em `month` | tabela dos cinco valores e cenário de parâmetro repetido em `DashboardRoutes.test.tsx` | Um RED esperado |
| Arquitetura | seletor permanece Server Component, sem fetch, Supabase ou hooks de navegação | teste de fronteira em `financial-analytics-boundaries.test.ts` | Verde |
| Infrastructure/Supabase | RPC diária, RLS, migrations e consultas permanecem inalteradas | nenhuma suíte nova necessária na `003A` | Não aplicável |

## Cenários felizes

1. a barra apresenta, nessa ordem, `Semana`, `7D`, `Quinzena`, `15D` e `Mês`;
2. cada ação envia por GET exatamente `week`, `rolling_7_days`, `fortnight`, `rolling_15_days` ou `month`;
3. os nomes acessíveis são `Semana atual`, `Últimos 7 dias`, `Quinzena atual`, `Últimos 15 dias` e `Mês atual`;
4. o período selecionado expõe `aria-pressed=true` e uma indicação visual adicional à cor;
5. as cinco opções continuam chegando ao mesmo carregador da rota e à mesma composição financeira.

## Cenários alternativos e limites

1. ausência de `period` usa `month`;
2. valor desconhecido usa `month`;
3. parâmetro `period` repetido usa `month`, sem escolher silenciosamente o primeiro valor;
4. o seletor não renderiza `combobox` nem exige o botão intermediário `Atualizar período`;
5. todos os controles mantêm `min-h-11` e não encolhem abaixo do alvo de interação;
6. a barra usa largura máxima e `overflow-x-auto`, confinando o excesso em 320 px;
7. não há Client Component, fetch direto, acesso Supabase, migration ou nova dependência.

## RED controlado

Comando executado com o runtime Node empacotado do workspace, pois o `npm` global local aponta para um módulo ausente:

```text
3 suítes executadas
1 suíte verde
2 suítes vermelhas
27 testes no total
23 testes preservados
4 falhas esperadas
0 snapshots
```

Falhas esperadas:

- a barra acessível ainda não existe;
- os cinco submit buttons e seus valores ainda não existem;
- o estado selecionado com `aria-pressed` e indicação não cromática ainda não existe;
- o parâmetro repetido ainda seleciona incorretamente o primeiro valor em vez de `month`.

## Rede de segurança preservada

- domínio, application e composição server-side: 4 suítes e 37 testes verdes;
- regressão completa: 93 suítes, 91 verdes e somente as 2 suítes RED planejadas; 567 testes verdes e somente as 4 falhas esperadas entre 571 testes;
- lint global: verde, sem avisos;
- type-check global: verde;
- `git diff --check`: verde;
- nenhuma implementação foi antecipada para tornar o RED verde.

## Implementação mínima liberada para o Dia 3

O Dia 3 poderá alterar somente:

- `FinancialPeriodSelector.tsx`, substituindo o `select` e o botão intermediário pela barra GET server-rendered;
- `financial-period-options.ts`, acrescentando rótulos curtos/completos e fazendo arrays recaírem em `month`;
- ajustes estritamente necessários nos testes sem enfraquecer seus contratos.

Permanecem bloqueados: novos períodos, Client Component, estado otimista, migration, RPC, alteração de RLS, histórico longo, drill-down e qualquer escopo das releases `003B/C`.

## Critério de pronto do Dia 2

- matriz por camada documentada;
- cenários felizes, alternativos e limites explícitos;
- RED reproduzível e diagnóstico;
- rede anterior preservada;
- estado atualizado para `TEST_STRATEGY_READY`;
- implementação funcional reservada ao comando explícito `dia 3`.
