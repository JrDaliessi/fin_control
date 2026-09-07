# UX-CHART-003B — Estratégia de testes e RED controlado

- Fase: Dia 2 — estratégia de testes e fundação TDD
- Data: 2026-09-06
- Estado de entrada: `ARCHITECTURE_READY`
- Estado de saída: `TEST_STRATEGY_READY`
- Escopo: presets `3M` e `Ano`, granularidade semanal/mensal e agregação server-side

## Objetivo

Transformar os contratos aprovados no Dia 1 em uma rede de segurança executável antes de alterar código funcional ou criar a migration. A estratégia cobre domínio, aplicação, infraestrutura TypeScript, apresentação, composição server-side, schema PostgreSQL, comportamento multiusuário e plano de consulta.

## Matriz por camada

| Camada | Contratos essenciais | Evidência executável |
| --- | --- | --- |
| Domain | `three_months` resolve três meses civis; `year` resolve janeiro a janeiro; ano bissexto e limites civis; granularidade `day`/`week`/`month` | `resolve-financial-period.test.ts` |
| Application | períodos curtos mantêm snapshot bruto; períodos longos usam somente buckets agregados; DTO final continua único | `list-financial-evolution.use-case.test.ts` |
| Infrastructure | RPC agregada recebe somente limites e allowlist; `userId` não atravessa a fronteira; resposta mínima é validada estritamente | testes do repository e do mapper de buckets |
| Presentation | sete opções, nomes acessíveis completos, seleção anunciada, orientação civil/móvel e ordem por teclado | `FinancialPeriodSelector.test.tsx` |
| Composição | URL aceita os dois novos valores e o loader autenticado encaminha bucket correto à RPC agregada | testes de dashboard e rota financeira |
| Banco/schema | assinatura única, invoker, search path vazio, projeção mínima, ausência de proprietário no input e grants mínimos | `financial_evolution_buckets_schema.test.sql` |
| Banco/comportamento | buckets civis parciais, OHLC determinístico, carry de saldo, totais, isolamento RLS e rejeições de limites/identidade | `financial_evolution_buckets_behavior.test.sql` |
| Banco/performance | índices existentes e initplans RLS; nenhuma criação especulativa de índice | `financial_evolution_buckets_performance.test.sql` |

## Cenários críticos

- `3M` com referência em setembro começa em 1º de julho e termina em 1º de outubro, usando semanas civis iniciadas na segunda-feira e recortadas ao intervalo.
- `3M` atravessa a virada do ano sem aritmética baseada em noventa dias.
- `Ano` preserva doze meses civis inclusive em ano bissexto e rejeita limite exclusivo fora da faixa civil.
- buckets vazios carregam o fechamento anterior, com receitas, despesas, volume e contagem iguais a zero.
- movimentos no mesmo instante usam `occurred_on`, `created_at` e `id` para desempate determinístico.
- fim exclusivo, proprietário diferente e sessão anônima não contaminam o agregado.
- bucket fora de `week`/`month`, intervalo inválido, duração acima de 366 dias e mais de 60 buckets são rejeitados.
- resposta inválida, valores inseguros, volume inconsistente, lacunas, sobreposições e quebra de continuidade são recusados pelo mapper.

## Fixtures

- usuário A com conta e movimentos em fronteiras, empate temporal, bucket vazio e saldo carregado;
- usuário B com dados no mesmo intervalo para provar isolamento;
- usuário C autenticado sem conta;
- sessão sem identidade e sessão anônima;
- ano bissexto e intervalo que cruza dezembro/janeiro.

## Evidência RED

Baseline anterior às mudanças:

- 7 suítes existentes passaram;
- 69 testes passaram;
- zero snapshots.

RED Jest direcionado:

- 7 suítes selecionadas falharam como planejado;
- nas 6 suítes carregadas: 70 testes, 42 verdes e 28 falhas esperadas;
- a nova suíte do mapper contém 18 contratos e parou no carregamento porque o módulo funcional futuro ainda não existe;
- falhas observadas: tipos/intervalos/granularidades ausentes, seleção da RPC agregada ausente, método do repository ausente, mapper ausente, duas opções/copy ausentes e fallback atual das rotas para `month`.

Validação do harness:

- ESLint passou nos 7 arquivos Jest afetados;
- `type-check` ficou somente com um `TS2307`, correspondente ao mapper futuro deliberadamente ausente;
- os três arquivos pgTAP possuem, respectivamente, 16, 22 e 5 assertions diretas, totalizando 43;
- probe pgTAP remoto falhou 2 de 2 checks pela função ainda inexistente;
- o probe usou transação com rollback; depois dele, `pgtap` continuou não instalado e a função continuou ausente.

## Restrições preservadas

- nenhum código funcional foi criado;
- nenhuma migration foi criada ou aplicada;
- nenhuma RPC, policy, grant, tabela, dado ou configuração remota foi persistida;
- nenhum índice novo foi aprovado; o Dia 3 deverá medir o plano antes de qualquer decisão;
- a RPC diária existente e seu limite de 31 dias permanecem intactos;
- `UX-CHART-003C` continua fora do ciclo.

## Critério de entrada do Dia 3

O Dia 3 poderá implementar somente o mínimo para tornar estes contratos verdes: tipos e resolver, port/use case, mapper/repository, opções/rota e uma migration forward-only para a função agregada. Aplicação remota, se necessária para validar pgTAP, exige a declaração e a aprovação próprias do Dia 3.

## Conversão GREEN no Dia 3

- os contratos Jest direcionados passaram em 7 suítes e 88 testes;
- a regressão completa passou em 95 suítes e 609 testes;
- os três contratos pgTAP passaram 43 assertions no total;
- a migration forward-only `20260907041839_create_financial_evolution_buckets.sql` foi aplicada e verificada no Supabase;
- lint, type-check e build Next.js 16.3.3 ficaram verdes;
- nenhum teste foi relaxado, nenhum índice novo foi criado e `UX-CHART-003C` permaneceu fora do escopo.
