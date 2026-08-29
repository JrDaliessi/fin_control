# ADR 0012 — Apache ECharts atrás de adapter de presentation

- Status: aprovado
- Data: 2026-08-29
- Spike: `SP-001`

## Contexto

A SR-013 fornece até 31 pontos diários serializáveis com datas civis e valores inteiros em centavos. A UI-003 compõe esses dados no servidor e mantém uma tabela acessível. A SR-014 deverá adicionar uma linha de saldo sem remover essa tabela; a SR-015 deverá representar OHLC financeiro sem semântica de trading.

A biblioteca precisa suportar Next.js 16, React 19, TypeScript, mobile, temas, movimento reduzido, linha e candles. Domain e application não podem depender da tecnologia visual.

## Critérios e comparação

Pesos: linha/candles 25%, acessibilidade 20%, fronteira Next.js/React 15%, bundle 15%, mobile/temas 10%, TypeScript/testabilidade 10% e licença 5%.

| Opção | Resultado | Pontos fortes | Riscos |
| --- | ---: | --- | --- |
| Apache ECharts 6.1 | 4,10/5 | linha e candlestick nativos, SVG/Canvas, ARIA/decal, TypeScript e import modular | API imperativa e bundle ainda precisa ser medido |
| Recharts 3.10 | 3,90/5 | React 19 nativo, SVG, composição declarativa e camada de acessibilidade | candle é composição de `Bar` + `ErrorBar`, não uma série dedicada |
| Lightweight Charts 5.2 | 3,90/5 | linha/candle nativos, foco financeiro, TypeScript e dependência enxuta | client-only, Canvas, acessibilidade não embutida e atribuição TradingView obrigatória |

Fontes primárias consultadas:
- https://echarts.apache.org/handbook/en/basics/import/
- https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/
- https://echarts.apache.org/handbook/en/best-practices/aria/
- https://echarts.apache.org/examples/en/editor.html?c=candlestick-simple
- https://recharts.github.io/en-US/api/LineChart/
- https://recharts.github.io/en-US/examples/Candlestick/
- https://tradingview.github.io/lightweight-charts/tutorials/a11y/intro
- https://tradingview.github.io/lightweight-charts/tutorials/react/simple

## Decisão

1. Adotar `echarts@6.1.0` diretamente, sem `echarts-for-react`.
2. Importar apenas `echarts/core`, `LineChart`, futuramente `CandlestickChart`, componentes estritamente usados, `AriaComponent` e `SVGRenderer`.
3. Usar SVG porque os períodos atuais têm no máximo 31 pontos; Canvas só será reconsiderado com benchmark ou volume materialmente maior.
4. Manter `FinancialEvolutionPanel` como Server Component e criar uma ilha cliente pequena apenas para ciclo de vida, resize, tema e eventos do gráfico.
5. Passar à ilha cliente somente view model plano e serializável; nenhum repository, caso de uso ou DTO de infraestrutura atravessa a fronteira.
6. Manter inteiros em centavos no view model e formatá-los apenas em eixos, tooltip e descrição.
7. Manter a tabela diária renderizada e acessível. ARIA do ECharts é complemento, não substituto da tabela.
8. Desativar animação quando `prefers-reduced-motion` solicitar redução e nunca comunicar alta/queda somente por cor.
9. Não criar `ChartPort` genérico. O adapter permanece específico de financial analytics até existir um segundo consumidor real.

## Contrato planejado

```text
FinancialEvolutionDto (application, server)
  -> toFinancialEvolutionChartModel (presentation, função pura)
  -> FinancialEvolutionChartModel (datas civis + centavos)
  -> FinancialEvolutionChart.client (ilha cliente)
  -> buildEChartsOption (adapter ECharts em presentation)
```

Estrutura prevista para a SR-014:

```text
src/features/financial-analytics/presentation/
  charts/
    financial-evolution-chart.model.ts
    to-financial-evolution-chart-model.ts
    echarts/
      build-financial-evolution-option.ts
      echarts-client.ts
  components/
    FinancialEvolutionChart.client.tsx
```

O nome e a divisão final só serão criados após os testes do Dia 2 comprovarem a necessidade. A tabela existente permanece em `FinancialEvolutionTable.tsx`.

## Validação exigida antes da aceitação da dependência

- teste puro do mapper preservando ordem, datas e centavos;
- teste do option builder sem DOM;
- contrato arquitetural impedindo import de ECharts fora de `presentation/charts/echarts` e do componente cliente;
- teste de loading/fallback e presença simultânea da tabela;
- teste de resize, cleanup e movimento reduzido com adapter mockado;
- análise do delta do bundle com `next experimental-analyze`;
- prova mobile e contraste nos temas claro/escuro;
- auditoria de licença e dependências.

## Alternativas rejeitadas

### Recharts

Não foi escolhido porque o roadmap exige candles logo após a linha. A solução oficial usa composição manual de barras, error bars e shapes, ampliando código específico e testes.

### Lightweight Charts

Não foi escolhido porque não fornece acessibilidade embutida e exige camada própria de teclado/ARIA, além de atribuição pública. A especialização em trading também é maior que o necessário para um app financeiro pessoal.

### Wrapper React para ECharts

Não foi escolhido porque adicionaria uma segunda dependência e esconderia lifecycle, resize e import modular que o projeto precisa testar diretamente.

## Consequências

Positivas:
- uma tecnologia atende linha e candles;
- dependência fica confinada à presentation;
- tabela e RSC atuais permanecem intactos;
- renderer e módulos podem ser reduzidos ao necessário.

Trade-offs:
- uma ilha cliente e lifecycle imperativo são inevitáveis;
- o bundle precisa de evidência antes do gráfico de produção;
- acessibilidade continua exigindo tabela, descrição e testes próprios.

## Fora do escopo

- instalar a biblioteca no Dia 1;
- criar gráfico, tooltip ou adapter funcional;
- alterar DTO, domínio, application, infrastructure, Supabase ou persistência;
- antecipar OHLC, trading, zoom avançado ou indicadores técnicos.
