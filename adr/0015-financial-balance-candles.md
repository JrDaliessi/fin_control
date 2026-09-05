# ADR 0015 — Candles financeiros do saldo

- Status: aprovado
- Data: 2026-08-30
- Small release: `SR-015`
- Depende de: ADRs 0010, 0012, 0013 e 0014

## Contexto

A SR-013 já entrega, por uma única chamada autenticada, saldo de abertura e movimentos ordenáveis para um período de até 31 dias. A SR-014 usa o mesmo fluxo para apresentar a linha de fechamento diário e uma tabela acessível. O SP-001 aprovou ECharts modular/SVG, e o UX-CHART-001 aprovou um frame expansível independente do renderer.

A SR-015 precisa oferecer leitura OHLC do saldo sem interpretar dinheiro como ativo negociável, sem duplicar consultas e sem inventar precisão temporal que o modelo atual não possui: `occurredOn` é data civil e `createdAt` registra a criação no sistema.

## Decisão

1. O primeiro recorte produzirá um candle por dia para `week`, `rolling_7_days`, `fortnight`, `rolling_15_days` e `month`.
2. Um serviço puro de domínio receberá o período resolvido, `openingBalanceInCents` e movimentos; ele devolverá uma sequência contínua de candles.
3. O serviço ordenará movimentos por `occurredOn`, `createdAt` e `id`, independentemente da ordem recebida do repository.
4. Dentro do mesmo dia, máxima e mínima representarão a sequência de registro no FinControl. A UI não as descreverá como horário bancário real.
5. `open` será o saldo no início do bucket; `high` e `low` incluirão a abertura e todos os saldos intermediários; `close` será o saldo final.
6. `volumeInCents` será a soma absoluta dos movimentos efetivados. No domínio atual de valores positivos tipados, isso equivale a `incomeInCents + expenseInCents`.
7. Bucket vazio preservará o fechamento anterior em `open`, `high`, `low` e `close`, com totais e quantidade iguais a zero.
8. Todas as datas serão civis canônicas e todos os valores monetários permanecerão inteiros seguros em centavos; entradas inválidas e overflow falharão antes de produzir resultado parcial.
9. `ListFinancialEvolutionUseCase` chamará o agregador de evolução e o agregador de candles sobre o mesmo `FinancialEvolutionSnapshot`. O repository continuará sendo chamado uma vez por execução.
10. `FinancialEvolutionDto` será estendido com uma coleção `candles` plana. Não haverá novo port, repository, RPC, migration, grant ou policy.
11. `FinancialEvolutionPanel` permanecerá Server Component e mapeará os DTOs para view models serializáveis antes da fronteira cliente.
12. Uma ilha cliente de apresentação controlará o seletor “Evolução do saldo”/“Variação do saldo” e montará apenas o gráfico e a tabela do modo ativo, sem buscar ou recalcular dados financeiros.
13. O modo linha será o padrão para preservar a experiência atual. A preferência não será persistida nesta release.
14. O modo candles registrará `CandlestickChart` via imports modulares no adapter ECharts existente, reutilizando SVG, ARIA, tema, movimento reduzido, resize e dispose.
15. Ambos os modos reutilizarão `ExpandableChartFrame`; expansão manterá a instância ativa e não duplicará renderer.
16. A tabela OHLC será alternativa equivalente ao tooltip. Direção será expressa por texto/valores além de cor.
17. A análise de bundle deverá comprovar que o acréscimo permanece restrito aos chunks de `/` e `/dashboard` e registrar o delta sobre a baseline da SR-014.

## Fluxo de dados

```text
composeDashboardRoute (Server Component)
  -> loadFinancialEvolution (Auth)
  -> repository.loadSnapshot() [uma chamada]
  -> FinancialEvolutionSnapshot
       -> aggregateFinancialEvolution()
       -> aggregateFinancialCandles()
  -> FinancialEvolutionDto { points, candles }
  -> FinancialEvolutionPanel (Server Component)
       -> mappers de presentation
       -> seletor/visualização cliente com modelos planos
            -> gráfico de linha + tabela diária, ou
            -> candlestick + tabela OHLC
```

## Contrato do candle

```ts
type FinancialCandle = Readonly<{
  startOn: string;
  endOnExclusive: string;
  openInCents: number;
  highInCents: number;
  lowInCents: number;
  closeInCents: number;
  incomeInCents: number;
  expenseInCents: number;
  volumeInCents: number;
  transactionCount: number;
}>;
```

O nome final dos arquivos e tipos será confirmado pelos testes do Dia 2; o contrato semântico acima é autoritativo.

## Estados

| Estado | Seletor/visualização | Representação textual |
| --- | --- | --- |
| loading da rota | ausente | skeleton existente |
| `missing_accounts` | ausente | CTA existente |
| `empty` | linha plana ou candles planos | tabela ativa e feedback de vazio |
| `success` | modo selecionado | tabela ativa equivalente |
| erro de consulta | ausente | error boundary sanitizada |
| erro de ECharts | fallback local | tabela ativa preservada |

## Contratos TDD antes da implementação

- cálculo de OHLC inclui abertura e saldos intermediários;
- movimentos embaralhados produzem o mesmo resultado determinístico;
- empate de `createdAt` usa `id`;
- dias vazios mantêm continuidade e volume zero;
- saldo negativo e cruzamento de zero permanecem corretos;
- entradas inválidas e overflow são rejeitados;
- caso de uso realiza exatamente uma leitura e retorna pontos/candles coerentes;
- mapper não converte datas civis em `Date` nem moeda em ponto flutuante;
- modo linha é padrão e alternância não dispara rede;
- somente uma visualização fica montada e falha do renderer não remove a tabela;
- ECharts permanece fora de domain/application/infrastructure e das rotas não financeiras.

## Alternativas consideradas

### Novo RPC que devolve OHLC

Rejeitada porque os dados necessários já existem no snapshot, o período possui no máximo 31 dias e a regra pura precisa permanecer testável sem banco.

### Segundo caso de uso com nova leitura

Rejeitada por duplicar autenticação/consulta e abrir risco de snapshots divergentes entre linha e candles.

### Calcular candles na UI

Rejeitada porque moveria regra financeira para presentation e enviaria movimentos brutos desnecessários ao navegador.

### Usar `createdAt` como horário real da transação

Rejeitada semanticamente. O campo só prova ordem de criação; a interface deve comunicar essa limitação.

### Criar um `ChartPort` genérico

Rejeitada porque linha e candlestick compartilham apenas necessidades concretas já cobertas pelo adapter e pelo frame. Uma abstração universal anteciparia consumidores ainda inexistentes.

### Persistir a preferência do modo

Rejeitada por exigir contrato de preferências fora do escopo. Linha continua padrão a cada carregamento.

## Consequências

Positivas:
- linha e candles permanecem coerentes por derivarem do mesmo snapshot;
- OHLC é determinístico, puro e protegido por testes;
- nenhuma mudança de banco ou dependência é necessária;
- acessibilidade e expansão reutilizam contratos já validados.

Trade-offs:
- o DTO e a fronteira cliente carregam duas projeções pequenas de até 31 dias;
- candlestick aumenta o chunk das rotas financeiras e exige nova medição;
- a tabela OHLC é larga e precisará de tratamento mobile cuidadoso;
- máximas/mínimas não representam horário bancário enquanto o domínio tiver somente data civil.

## Fora do escopo

- períodos customizados ou acima de 31 dias;
- buckets semanais/mensais e agregação automática;
- preço, ativo, ordem, trading, alavancagem ou indicador técnico;
- comparação, previsão, zoom, brush ou exportação;
- persistência de preferência visual;
- Supabase, migration, RLS, cache financeiro, analytics ou logging de valores.
