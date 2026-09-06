# UX-CHART-002D — Discovery e arquitetura

## Objetivo

Explicar o fluxo financeiro do intervalo selecionado sem transformar o painel em uma tela de trading, sem abrir um diálogo aninhado e sem depender de IA generativa para cálculos determinísticos.

## Recorte aprovado

### UX-CHART-002D-1 — Resumo do fluxo

- manter o card OHLC como resumo do saldo;
- adicionar um card compacto `Movimentação no intervalo` logo depois do OHLC;
- destacar `Volume movimentado` como soma bruta de receitas e despesas;
- exibir receitas, despesas e resultado líquido como valores complementares;
- explicar: `Soma de receitas e despesas; não representa o resultado líquido.`;
- usar os agregados do `FinancialCandle`, independentemente do estado da consulta do extrato.

### UX-CHART-002D-2 — Análise determinística expansível

- adicionar o botão secundário `Ver análise do intervalo` no card de movimentação;
- expandir o conteúdo no mesmo painel, sem modal ou portal adicional;
- alternar o rótulo para `Ocultar análise` quando aberto;
- expor `aria-expanded` e `aria-controls` e manter alvo mínimo de 44 px;
- calcular localmente e sob demanda no clique, sem chamada de rede;
- apresentar no máximo dois insights: composição e resultado líquido;
- preservar a lista de lançamentos logo abaixo, com a contagem atual.

### Comparação histórica — extensão posterior

- adicionar somente após contrato próprio em TDD;
- carregar no clique apenas uma referência agregada e autenticada;
- não retornar lançamentos brutos do período comparativo;
- priorizar a comparação histórica como primeiro insight e a composição como segundo;
- usar mensagem honesta quando a referência for zero ou insuficiente.

## Regras financeiras

Todos os valores são inteiros seguros em centavos.

```text
volume = receitas + despesas
resultado = receitas - despesas
percentualDespesas = round((despesas / volume) * 100)
percentualReceitas = 100 - percentualDespesas
```

- Com volume zero, percentuais são ausentes e o insight informa que não houve movimentação.
- Percentuais inteiros são calculados de forma complementar para sempre totalizarem 100%.
- O volume recebido do candle deve ser validado contra `receitas + despesas`; divergência é entrada inválida, não motivo para correção silenciosa.
- Valores negativos, não inteiros ou fora de `Number.isSafeInteger` são inválidos.
- O resultado pode ser positivo, negativo ou zero; cor é apenas reforço e nunca a única indicação.

## Priorização e copy dos insights

No primeiro incremento:

1. composição do volume;
2. resultado líquido.

Exemplos:

- despesas dominantes: `72% do volume correspondeu a despesas.`;
- receitas dominantes: `81% do volume correspondeu a receitas.`;
- composição equilibrada: `O volume ficou equilibrado: 50% em receitas e 50% em despesas.`;
- resultado positivo: `O intervalo terminou com resultado positivo de R$ 3.832,78.`;
- resultado negativo: `O intervalo terminou com resultado negativo de R$ 640,00.`;
- resultado neutro: `Receitas e despesas tiveram o mesmo valor no intervalo.`;
- sem movimento: `Nenhuma movimentação foi registrada neste intervalo.`.

Regras editoriais:

- não usar termos como `bom`, `ruim`, `excessivo` ou aconselhamento financeiro;
- não atribuir causa que os dados não comprovem;
- não dizer `ganho` quando o valor é somente receita ou saldo;
- não usar casas decimais em percentuais na interface;
- não repetir no insight valores já evidentes sem acrescentar interpretação.

## Referência histórica futura

| Bucket selecionado | Referência | Comparação |
| --- | --- | --- |
| 1 dia | sete dias civis completos anteriores | volume do dia contra média diária |
| 2–31 dias | intervalo anterior de mesma duração | médias diárias dos dois intervalos |
| semana | quatro semanas completas anteriores | volume semanal contra média semanal |
| mês | três meses completos anteriores | volume mensal contra média mensal |
| longo/customizado | intervalo anterior equivalente | definido junto à UX-CHART-003 |

```text
variacaoPercentual = round((volumeAtual - mediaReferencia) * 100 / mediaReferencia)
```

- Variação absoluta abaixo de 5% usa `ficou em linha com a referência`.
- Referência zero não produz percentual.
- A referência deve informar tipo, quantidade de buckets e intervalo considerado no DTO.
- A comparação será uma leitura autenticada separada; a presentation nunca acessará Supabase.

## Composição responsiva

Ordem vertical do painel:

1. cabeçalho e fechamento;
2. card OHLC;
3. card `Movimentação no intervalo`;
4. análise expandida, quando solicitada;
5. quantidade e lista de lançamentos.

Mobile:

- volume em linha própria;
- receitas e despesas em duas colunas;
- resultado em linha própria;
- botão ocupa toda a largura quando necessário;
- expansão aumenta a rolagem interna do bottom sheet, sem alterar o scroll do documento.

Desktop:

- preservar painel lateral de no máximo 448 px;
- manter a mesma ordem sem criar layout divergente;
- valores longos podem quebrar sem sobrepor rótulos.

## Contratos por camada

### Domain

- novo serviço puro para validar os agregados e produzir `FinancialIntervalAnalysis`;
- entrada genérica com limites semiabertos, receitas, despesas, volume e quantidade;
- saída sem texto formatado de moeda e sem dependência de React, Next.js ou Supabase;
- regra de seleção limitada a dois insights.

### Application

- nenhuma nova orquestração é necessária para `002D-1/2`, pois o candle já chega validado pela evolução financeira;
- a comparação histórica futura terá caso de uso e port próprios para não inchar o extrato transacional.

### Infrastructure

- nenhuma alteração no primeiro incremento;
- no futuro, implementar somente a referência agregada com sessão, ownership, RLS, limites e erro sanitizado.

### Presentation

- `FinancialIntervalStatementPanel` recebe o candle serializável existente;
- a interação apenas controla expandido/recolhido e adapta o resultado puro para copy em português;
- trocar de candle recolhe a análise anterior para evitar leitura fora de contexto;
- nenhum cálculo financeiro ficará embutido no JSX.

## Critérios de aceite

1. volume, receitas, despesas e resultado aparecem antes da lista e correspondem ao candle selecionado;
2. a explicação diferencia volume de resultado líquido;
3. falha ao carregar os lançamentos não remove o resumo do fluxo;
4. botão revela e oculta análise sem nova rede e sem abrir outro diálogo;
5. são exibidos no máximo dois insights;
6. zero, somente receitas, somente despesas, equilíbrio e resultados positivo/negativo são tratados;
7. seleção de outro candle não preserva análise aberta ou conteúdo anterior;
8. leitura funciona por teclado, leitor de tela, 320, 768 e 1280 px;
9. nenhuma migration, RPC, policy, grant, dependência ou configuração remota é alterada;
10. arquitetura e quality gates permanecem verdes.

## Fora do escopo deste ciclo

- IA generativa;
- aconselhamento financeiro;
- comparação por categoria;
- gráficos adicionais dentro do painel;
- edição, exclusão, busca ou exportação;
- migration, RPC ou aplicação remota no Supabase;
- comparação histórica antes do contrato TDD específico.

## Próxima fase

Dia 2 cria primeiro os testes de domínio e apresentação em RED para as regras e critérios acima.
