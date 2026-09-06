# UX-CHART-002D — Estratégia de testes

- Fase: Dia 2 — Estratégia de testes e fundação TDD
- Estado de entrada: `ARCHITECTURE_READY`
- Estado de saída esperado: `TEST_STRATEGY_READY`
- Data: 2026-09-05
- Decisão arquitetural: `adr/0021-contextual-interval-volume-insights.md`

## Objetivo

Provar, antes da implementação, que o extrato diferencia saldo de fluxo, calcula métricas financeiras consistentes em centavos e revela no máximo dois insights determinísticos sem nova consulta, sem diálogo aninhado e sem mover regras para o JSX.

## Matriz por camada

| Camada | Contrato principal | Cenário feliz | Cenários críticos |
| --- | --- | --- | --- |
| Domain | análise do intervalo | deriva volume, resultado, percentuais e dois insights semânticos | zero, somente receita/despesa, equilíbrio, valores inválidos, overflow e divergência de volume |
| Application | sem alteração neste incremento | reutiliza o `FinancialCandle` já produzido pelo fluxo existente | comparação histórica não pode ser antecipada por port artificial |
| Infrastructure | sem alteração neste incremento | nenhuma nova consulta para a análise local | presentation não acessa Supabase, fetch ou histórico bruto |
| Presentation | resumo e expansão inline | card de movimentação aparece antes da lista e análise abre no mesmo painel | loading/erro da lista, troca de candle, recolhimento, sem chamada extra e limite de dois itens |
| Acessibilidade | disclosure nomeado | `aria-expanded` e `aria-controls` refletem o estado | foco visível, alvo de 44 px e conteúdo não dependente de cor |
| Arquitetura | fronteira da regra | serviço puro em domain e formatação em presentation | nenhum cálculo financeiro embutido no JSX e nenhum diálogo adicional |

## Fixtures mínimas

- intervalo diário com R$ 50,00 de receitas, R$ 20,00 de despesas e R$ 70,00 de volume;
- resultado positivo de R$ 30,00 e composição 71%/29%;
- candle somente receita;
- candle somente despesa;
- candle equilibrado;
- candle sem movimento;
- segundo candle para provar recolhimento e descarte da análise anterior;
- valores negativos, fracionários, inseguros e volume divergente.

## Cenários de domínio

1. retorna resumo consistente e não altera a entrada;
2. calcula o percentual de despesas por arredondamento e o de receitas por complemento;
3. retorna um insight `empty` sem percentuais para volume zero;
4. representa somente receita como 100%/0% e resultado positivo;
5. representa somente despesa como 0%/100% e resultado negativo;
6. representa 50%/50% e resultado neutro sem linguagem de ganho/perda;
7. limita a saída a no máximo dois insights;
8. rejeita total negativo, fracionário ou maior que `Number.MAX_SAFE_INTEGER`;
9. rejeita soma insegura e divergência entre volume e componentes;
10. rejeita contagem negativa/fracionária e intervalo civil inválido.

## Cenários de apresentação

1. card `Movimentação no intervalo` aparece com volume, receitas, despesas e resultado enquanto o extrato ainda carrega;
2. texto auxiliar explica que volume não é resultado líquido;
3. erro na consulta dos lançamentos não remove o resumo;
4. botão começa recolhido, referencia a região e alterna para `Ocultar análise`;
5. expansão mostra a composição e o resultado esperados em até dois itens;
6. abrir ou fechar não chama novamente `loadStatement`;
7. trocar o candle recolhe a análise e remove a copy anterior;
8. a análise fica dentro do diálogo atual, sem novo `role=dialog`;
9. o controle mantém `min-h-11` e foco visível.

## Baseline e RED esperado

- baseline do painel permaneceu verde antes das novas asserções: 1 suíte e 7 testes aprovados;
- a nova suíte de domínio deve falhar pela ausência deliberada do serviço aprovado;
- os novos contratos do painel devem falhar somente porque card, disclosure e copy ainda não existem;
- falhas de importação, tipagem ou ambiente não relacionadas ao comportamento esperado invalidam o RED e devem ser corrigidas ainda no Dia 2.

## Evidência do RED controlado

- comando direcionado executado em 2026-09-05 com as suítes de domínio, apresentação e fronteira arquitetural;
- resultado: 3 suítes em RED, 5 testes falhando, 14 testes anteriores passando e zero snapshots;
- domínio falha somente porque `domain/services/analyze-financial-interval.ts` ainda não existe;
- apresentação falha somente pela ausência do card `Movimentação no intervalo`, do disclosure e da análise planejada;
- a fronteira arquitetural falha somente pela ausência deliberada do novo serviço puro;
- ESLint dos três arquivos de teste: aprovado sem avisos;
- type-check: um único `TS2307`, referente ao mesmo serviço deliberadamente ausente; nenhum erro colateral de fixture, mock ou ambiente;
- nenhum warning de `act`, erro de console ou falha não planejada permaneceu na execução final.

## Limites do Dia 2

- nenhum arquivo funcional ou tipo de produção;
- nenhuma alteração em application, infrastructure, Server Action ou Supabase;
- nenhuma migration, RPC, policy, grant, dado, dependência ou configuração remota;
- nenhuma implementação da comparação histórica ou da UX-CHART-003;
- nenhum commit, push, merge ou deploy sem comando explícito.

## Critério de conclusão

- matriz e cenários estão documentados;
- testes essenciais existem em domain e presentation;
- application/infrastructure estão marcadas como não aplicáveis com justificativa;
- RED direcionado foi executado e classificado;
- baseline anterior continua verde;
- implementação permanece bloqueada até aprovação explícita do Dia 3.

## Estado de saída

- `TEST_STRATEGY_READY`;
- Dia 2 concluído sem bloqueio duro;
- próximo comando válido: `dia 3` para implementar o mínimo necessário para satisfazer estes contratos.
