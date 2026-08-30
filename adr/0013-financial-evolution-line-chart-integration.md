# ADR 0013 — Integração do gráfico de linha da evolução financeira

- Status: aprovado
- Data: 2026-08-30
- Small release: `SR-014`
- Depende de: ADRs 0010, 0011 e 0012

## Contexto

A SR-013 entrega um `FinancialEvolutionDto` real, carregado no servidor, com até 31 pontos diários, datas civis e valores inteiros em centavos. A UI-003 apresenta resumo e tabela acessível. O SP-001 aprovou Apache ECharts `6.1.0`, import modular, `SVGRenderer`, mapper puro e uma ilha cliente testada, mas deliberadamente isolada das rotas.

A SR-014 precisa integrar a linha de saldo ao dashboard sem criar uma segunda fonte de dados, ampliar a fronteira cliente ou transformar o gráfico na única representação da informação financeira.

## Decisão

1. `composeDashboardRoute` continuará carregando o DTO uma única vez no servidor para `/` e `/dashboard`.
2. `FinancialEvolutionPanel` permanecerá Server Component e chamará `toFinancialEvolutionChartModel` antes da fronteira cliente.
3. `FinancialEvolutionChart.client.tsx` receberá somente `FinancialEvolutionChartModel`, composto por strings de data civil, números inteiros e arrays/objetos planos.
4. A linha representará exclusivamente `closingBalanceInCents` por dia. Receitas, despesas e líquido continuarão no resumo e na tabela.
5. O gráfico será apresentado em card próprio, com heading “Evolução do saldo” e descrição objetiva, antes da tabela diária visível.
6. Estados `success` e `empty` renderizarão a linha; em `empty`, os pontos de saldo existentes formam uma linha plana informativa. `missing_accounts` não renderizará gráfico nem tabela.
7. Falha na consulta continuará usando o error boundary da rota. Falha apenas na inicialização do ECharts exibirá o fallback local e manterá a tabela disponível.
8. O painel importará diretamente a ilha cliente já aprovada. Não será criado um segundo wrapper `next/dynamic` com `ssr: false` sem evidência de incompatibilidade no build ou custo material medido.
9. O loading de dados permanecerá no `loading.tsx` da rota. A ilha síncrona não simulará um estado de carregamento inexistente.
10. ECharts continuará confinado a `presentation/charts/echarts`, com módulos explícitos e SVG. Nenhum domínio, caso de uso, repository, App Router ou componente server importará o pacote diretamente.
11. A tabela permanecerá visível, equivalente e navegável. ARIA/decal do gráfico continuará sendo complemento; cor e tooltip nunca serão a única fonte da informação.
12. A análise de bundle deverá comprovar ECharts somente nos chunks cliente de `/` e `/dashboard`. Rotas não relacionadas não podem receber o pacote.

## Fluxo de dados

```text
composeDashboardRoute (Server Component)
  -> loadFinancialEvolution (Auth + application + infrastructure)
  -> FinancialEvolutionDto
  -> FinancialEvolutionPanel (Server Component)
       -> resumo e tabela server-side
       -> toFinancialEvolutionChartModel (presentation pura, servidor)
       -> FinancialEvolutionChart.client (ilha cliente)
       -> adapter ECharts modular/SVG
```

## Estados

| Estado | Gráfico | Tabela | Comportamento |
| --- | --- | --- | --- |
| loading da rota | ainda ausente | ainda ausente | skeleton existente |
| `missing_accounts` | não | não | CTA para cadastrar conta |
| `empty` | linha plana | sim | feedback de período sem movimentos |
| `success` | linha do saldo | sim | resumo e evolução completos |
| erro de consulta | não | não | error boundary sanitizada |
| erro de inicialização ECharts | fallback textual | sim | orientar consulta à tabela |

## Contratos de teste antes da implementação

- painel `success` contém gráfico e tabela derivados do mesmo DTO;
- painel `empty` contém feedback, linha plana e tabela;
- `missing_accounts` não monta a ilha cliente;
- mapper preserva datas, ordem, centavos e imutabilidade;
- fronteira Server → Client permanece serializável;
- painel não recebe `use client` e a ilha não acessa fonte de dados;
- `/` e `/dashboard` continuam usando a mesma composição e uma única leitura;
- falha do chart não remove a tabela;
- build e analyzer isolam ECharts das rotas não relacionadas.

## Alternativas consideradas

### Buscar dados dentro da ilha

Rejeitada porque duplicaria a leitura, criaria waterfall e aproximaria presentation de Auth/Supabase.

### Converter todo o painel em Client Component

Rejeitada porque ampliaria o bundle e enviaria mais dados/estrutura para o navegador sem necessidade.

### Criar wrapper dinâmico adicional imediatamente

Rejeitada no recorte inicial porque a ilha já é a fronteira cliente. Um novo wrapper e loading só serão justificados por evidência de build ou bundle.

### Ocultar ou substituir a tabela

Rejeitada porque reduziria acessibilidade, precisão consultável e resiliência quando JavaScript/ECharts falhar.

### Incluir múltiplas séries ou candles

Rejeitada por expansão de escopo. Candles pertencem à SR-015 e exigem contratos OHLC próprios.

## Consequências

Positivas:
- uma fonte financeira server-side alimenta resumo, gráfico e tabela;
- a fronteira cliente permanece estreita e auditável;
- a informação continua disponível sem depender do sucesso do ECharts;
- a integração reutiliza o experimento validado sem abstração nova.

Trade-offs:
- ECharts passa a compor o JavaScript das rotas do dashboard;
- o custo real só pode ser medido após a integração funcional;
- a tabela visível aumenta a extensão vertical, mas preserva precisão e acessibilidade.

## Fora do escopo

- comparação entre períodos;
- previsão ou classificação de tendência;
- candles, OHLC, volume, zoom, brush ou exportação;
- analytics de produto ou logs contendo dados financeiros;
- Supabase, migrations, RLS, timezone, custom period ou novas regras de saldo.
