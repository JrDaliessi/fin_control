# UX-CHART-002 — Estratégia de testes do extrato contextual

- Fase: Dia 2 — Estratégia de testes e fundação TDD
- Estado de entrada: `ARCHITECTURE_READY`
- Estado de saída esperado: `TEST_STRATEGY_READY`
- Data: 2026-09-02
- Decisão arquitetural: `adr/0019-contextual-candle-statement.md`

## Objetivo

Provar, antes da implementação, que a seleção de um candle consulta somente os lançamentos pertencentes ao intervalo civil selecionado e ao usuário autenticado, oferecendo a mesma ação no gráfico e na tabela e apresentando um painel responsivo com estados previsíveis.

## Matriz por camada

| Camada | Contrato principal | Cenário feliz | Cenários críticos |
| --- | --- | --- | --- |
| Domain | intervalo civil semiaberto | aceita até 31 dias e preserva limites | data impossível, limites iguais/invertidos e mais de 31 dias |
| Application | listar extrato do intervalo | uma chamada ao port e DTO serializável | valida antes do repository e não altera input |
| Infrastructure | consulta Supabase mínima | `transactions`, ownership, `gte`/`lt` e ordem estável | payload nulo, erro do provider e mensagem sanitizada |
| Composition | Server Action autenticada | deriva `userId` de claims permanentes | claim ausente/inválida/anônima e `userId` forjado |
| Presentation mapper | intervalo do ponto | preserva `endOnExclusive` | não reconstrói limite a partir da data seguinte |
| ECharts adapter | seleção por `dataIndex` | um listener chama o callback com o intervalo correto | índice inválido ignorado e cleanup remove listener |
| Tabela | alternativa acessível | botão `Ver extrato` envia o mesmo candle | ação disponível por teclado e sem depender de cor/hover |
| Painel | consulta sob demanda | resumo OHLC e lançamentos no diálogo | fechado não consulta; loading, empty, error e resposta obsoleta |
| Arquitetura | fronteiras | port/application e repository/infrastructure separados | presentation sem Supabase/fetch direto e sem `ChartPort` genérico |

## Fixtures mínimas

- usuário permanente e usuário forjado distintos;
- candle diário de `2026-03-01` a `2026-03-02` com OHLC e dois movimentos;
- segundo candle para provar troca de seleção e descarte de resposta obsoleta;
- receita e despesa serializáveis, sem notas ou payload desnecessário;
- linha Supabase com somente as colunas aprovadas para projeção e ordenação.

## Cenários felizes

1. intervalo diário válido atravessa domain, application e repository sem conversão de timezone;
2. repository consulta somente o proprietário verificado e usa limites `>= start` e `< end`;
3. clique no candle e botão da tabela emitem o mesmo intervalo;
4. painel abre, anuncia o intervalo, exibe resumo e lista os lançamentos;
5. retorno vazio produz estado honesto sem inventar movimentação.

## Cenários alternativos e edge cases

1. intervalo de 31 dias é aceito; 32 dias é rejeitado;
2. datas civis impossíveis, início igual ao fim e início posterior ao fim falham antes da infraestrutura;
3. sessão ausente, claim inválida ou Auth anônimo falham antes de `from()`;
4. propriedade forjada enviada pelo cliente é ignorada;
5. erro Supabase não expõe código, hint, tabela ou detalhe do provider;
6. `dataIndex` inexistente não dispara consulta;
7. listener ECharts é único e removido no cleanup;
8. painel fechado não carrega dados;
9. resposta antiga não substitui uma seleção mais recente;
10. diálogo pode ser fechado por controle nomeado e preserva alternativa completa na tabela.

## Limites do Dia 2

- nenhum código funcional ou tipo de produção;
- nenhuma UI definitiva;
- nenhuma migration, RPC, policy, grant ou alteração remota;
- nenhuma dependência nova;
- nenhuma implementação da UX-CHART-003;
- o RED esperado deve decorrer somente dos contratos de produção ausentes ou do comportamento ainda não implementado.

## Critério de conclusão

- testes essenciais existem em domain, application, infrastructure e presentation;
- RED controlado foi executado e classificado;
- baseline anterior permanece verde quando as novas suítes/asserções são excluídas;
- lint dos arquivos de teste e `git diff --check` permanecem verdes;
- a implementação continua bloqueada até aprovação explícita do Dia 3.

## Resultado do Dia 2

- baseline anterior: 23 suítes e 182 testes de `financial-analytics` verdes; type-check verde;
- RED direcionado: 9 suítes falharam como esperado, com 14 contratos já executados, 8 falhas funcionais/estruturais e 5 suítes interrompidas pelos módulos deliberadamente ausentes;
- type-check após correção do harness: somente 5 `TS2307`, um por módulo funcional ainda inexistente;
- lint de toda a pasta de testes de analytics: verde, zero warnings;
- regressão anterior, excluindo as 9 suítes/assertivas afetadas: 20 suítes e 169 testes verdes;
- nenhuma implementação funcional, migration, RPC, policy, dependência ou configuração remota foi criada.
