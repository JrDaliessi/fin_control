# Evolucao Financeira, Frequencia e Gamificacao

## Status e fontes

- Tipo: especificacao consolidada de produto e arquitetura
- Data: 2026-07-11
- Estado: aprovado para discovery incremental
- Fontes: conversas fornecidas pelo usuario, `contexto-codex-novas-ideias-financeiras-2.md` e PDF `1783573359393.pdf`

O PDF original nao deve ser versionado porque contem identificadores academicos pessoais. Este documento registra somente a logica relevante ao produto.

## 1. Objetivo e principios

Adicionar, em small releases independentes: filtros temporais, evolucao de saldo, grafico de linha, candles financeiros, distribuicao de frequencia, metas, gamificacao e insights de IA.

- Evolucao responde o que mudou ao longo do tempo.
- Frequencia explica como os valores se concentram.
- Gamificacao transforma diagnosticos confiaveis em motivacao opcional.
- IA explica e sugere; nao executa acoes financeiras.
- A interface simples permanece padrao; analises avancadas sao opcionais.
- Nenhuma mecanica incentiva gasto, risco, culpa ou competicao publica por patrimonio.
- Cada item percorre integralmente os Dias 1 a 7.

## 2. Pre-requisitos

Antes de usar dados reais devem existir usuario autenticado, sessao segura, contas e categorias reais, transacoes persistidas, RLS por usuario, consulta por intervalo, saldo inicial e regras de status, cancelamento, estorno, transferencia e timezone.

Sem isso, calculos podem existir somente em dominio puro e fixtures, nunca como dado real de producao.

## 3. Periodos financeiros

- `week`: segunda a domingo;
- `rolling_7_days`: sete dias corridos;
- `fortnight`: dias 1 a 15 ou 16 ao ultimo dia do mes;
- `rolling_15_days`: quinze dias corridos;
- `month`: primeiro ao ultimo dia do mes;
- `custom`: intervalo inclusivo escolhido pelo usuario.

Regras: diferenciar calendario de janela movel na UI, validar inicio/fim, respeitar timezone, agregar periodos longos e comparar apenas periodos equivalentes.

## 4. Evolucao financeira

```ts
type FinancialEvolutionPoint = {
  periodStart: Date
  periodEnd: Date
  incomeInCents: number
  expenseInCents: number
  netInCents: number
  closingBalanceInCents: number
  transactionCount: number
}
```

- receita efetivada aumenta saldo;
- despesa efetivada reduz saldo;
- transferencia interna nao altera patrimonio consolidado;
- pendencias e cancelamentos nao compoem saldo realizado;
- estorno neutraliza a origem conforme regra explicita;
- ordenacao usa data e desempate estavel;
- valores permanecem em centavos.

O primeiro modo visual e linha/area acompanhado por tabela acessivel. Deve exibir saldo, receitas, despesas, liquido, quantidade e, quando possivel, comparacao anterior. Estados: loading, empty, insufficient-data, success e error.

## 5. Candles financeiros

Candles representam saldo, nao preco de ativo.

```ts
type FinancialCandle = {
  periodStart: Date
  periodEnd: Date
  openInCents: number
  highInCents: number
  lowInCents: number
  closeInCents: number
  incomeInCents: number
  expenseInCents: number
  volumeInCents: number
  transactionCount: number
}
```

- `open`: saldo anterior a primeira transacao do intervalo;
- `close`: saldo apos a ultima;
- `high` e `low`: extremos do saldo acumulado;
- `volume`: soma absoluta das movimentacoes efetivadas;
- intervalo vazio preserva saldo: `open = close = high = low`, com volume zero.

Granularidade: dia para semana/quinzena/mes, semana para 3-6 meses, mes para ano e automatica para personalizado.

Nao incluir trading, ordens, alavancagem ou indicadores tecnicos. Alta/queda nao dependem so de cor e o tooltip possui alternativa textual.

## 6. Distribuicao de frequencia continua

### 6.1 Primeira metrica

Valores individuais de despesas efetivadas no periodo, positivos e em centavos. Futuro: receitas, gasto diario, variacao de saldo, quantidade por dia e recortes por categoria, conta ou cartao.

### 6.2 Metodo automatico inicial

A implementacao inicial segue o PDF:

```text
n = quantidade de observacoes
k = ceil(sqrt(n))
amplitudeTotal = max - min
larguraClasse = ceil(amplitudeTotal / k)
```

Casos especiais:

- `n = 0`: sem dados;
- `n = 1`: uma classe;
- `max = min`: largura minima de 1 centavo;
- classes `[inferior, superior)`, com ultimo limite inclusivo;
- limites inteiros em centavos;
- resultado deterministico.

Faixas amigaveis podem existir depois como outro modo. Nao substituem silenciosamente o metodo estatistico.

### 6.3 Tabela

```ts
type FrequencyClass = {
  lowerBoundInCents: number
  upperBoundInCents: number
  midpointInCents: number
  absoluteFrequency: number
  relativeFrequency: number
  percentage: number
  cumulativeFrequency: number
  cumulativePercentage: number
}
```

- `FI`: frequencia absoluta;
- `FR = FI / n`;
- `% = FR * 100`;
- `Fac`: soma acumulada de FI;
- `Fac%`: percentual acumulado;
- `Xi`: ponto medio.

Invariantes: soma FI igual a `n`, FR aproximadamente 1, percentual aproximadamente 100, acumuladas crescentes e final igual a `n`/100%.

### 6.4 Medidas agrupadas

- media agrupada: `sum(FI * Xi) / n`;
- mediana agrupada: interpolacao na classe mediana;
- moda agrupada: interpolacao na classe modal e adjacentes.

Esses resultados sao estimativas agrupadas. Medidas exatas das transacoes sao mais precisas e devem ser diferenciadas na UI.

### 6.5 UX

- frequencia desligada por padrao;
- toggle explicito;
- histograma e tabela usam o mesmo resultado;
- tabela e alternativa acessivel obrigatoria;
- dados insuficientes nao geram tendencias inventadas;
- comparacao usa as mesmas classes ou explica o recalculo.

## 7. Metas

Primeira versao: titulo, tipo, valor-alvo, prazo opcional, contribuicoes manuais, progresso, restante, ritmo sugerido e historico. Tipos: reserva, divida, compra planejada, viagem e personalizada.

O saldo da meta deve ser derivado das contribuicoes ou atualizado atomicamente. Duas fontes de verdade sem transacao confiavel sao proibidas.

## 8. Gamificacao responsavel

Eventos devem ser verificaveis e idempotentes:

```ts
type GamificationEvent = {
  userId: string
  eventType: string
  sourceType: string
  sourceId: string
  idempotencyKey: string
  points: number
  occurredAt: Date
}
```

Conquistas iniciais: primeira meta, primeira contribuicao, R$ 100 guardados, meta concluida, duas semanas contribuindo e reducao consciente de gastos altos com contexto suficiente.

Proibido: pontos por transacao falsa ou gasto, ranking publico, punicao de imprevisto, classificar toda despesa alta como ruim, desafio sem aceite ou dado sensivel em notificacao/log.

Desafios de frequencia so entram depois de frequencia e metas estaveis e devem excluir/sinalizar essenciais, emergencias, transferencias, investimentos, dividas e compras planejadas.

## 9. IA

Entra depois dos calculos deterministas. Pode explicar evolucao, periodo, faixa modal, sugerir desafio e projetar meta. Exige consentimento, minimizacao, rotulo de estimativa, opt-out e nenhuma acao automatica.

## 10. Arquitetura

```text
src/features/
  financial-analytics/
    presentation/
    application/
    domain/
    infrastructure/
    tests/
  goals/
  gamification/
  ai-insights/
```

- periodos, agregacao, OHLC e frequencia ficam em `financial-analytics/domain`;
- dashboard apenas compoe casos de uso;
- biblioteca visual fica atras de adapter de presentation;
- Supabase fica em infrastructure;
- gamificacao consome eventos de aplicacao, nunca React.

Tabelas futuras: `financial_accounts`, `categories`, `transactions`, `financial_goals`, `goal_contributions`, `gamification_events`, `achievements`, `user_achievements`, `user_gamification_profiles` e preferencias financeiras. Todas as tabelas de usuario exigem RLS. Eventos exigem chave idempotente unica por usuario.

## 11. Testes obrigatorios

Periodos/evolucao: calendario versus janela movel, quinzenas, fim de mes, ano bissexto, timezone, status, transferencia, estorno, saldo negativo e intervalo vazio.

Candles: OHLC, vazio, abertura zero, empate de horario e continuidade.

Frequencia: vazio, unico valor, iguais, `k`, amplitude, largura, limites, ultimo inclusivo, FI/FR/percentuais/acumuladas, medidas agrupadas, centavos e determinismo.

Metas/gamificacao: contribuicao, estorno, progresso, idempotencia, conquista unica, sequencia, pausa, exclusao de origem e nenhuma recompensa por gasto.

Presentation: todos os estados, periodos, modos, toggle, tabela alternativa, teclado, leitor de tela, contraste e mobile.

## 12. Ordem de small releases

1. SR-007 - conta financeira local;
2. SR-008 - autenticacao e sessao;
3. SR-009 - persistencia/RLS de contas;
4. SR-010 - persistencia/RLS de categorias;
5. SR-011 - persistencia/RLS de transacoes;
6. SR-012 - periodos financeiros;
7. SR-013 - agregacao e tabela de evolucao;
8. SP-001 - biblioteca de graficos;
9. SR-014 - grafico de linha;
10. SR-015 - candles;
11. SR-016 - frequencia continua e tabela;
12. SR-017 - histograma, toggle e comparacao;
13. SR-018 - metas e contribuicoes;
14. SR-019 - progresso e projecao;
15. SR-020 - eventos, pontos e conquistas;
16. SR-021 - desafios e sequencias;
17. SR-022 - desafios por frequencia;
18. SR-023 - insights de IA.

Cada item executa Dia 1 discovery, Dia 2 testes, Dia 3 minimo, Dia 4 expansao, Dia 5 hardening, Dia 6 UX/PWA e Dia 7 release.

## 13. Fora do escopo inicial

Trading, indicadores tecnicos, ranking publico, recompensa monetaria, classes totalmente livres, automacao bancaria nao aprovada, IA sem confirmacao, offline sem consistencia, animacoes pesadas e mecanicas semelhantes a cassino.

## 14. Decisoes pendentes

A biblioteca de gráficos foi resolvida pelo `SP-001` no ADR 0012: Apache ECharts modular, SVG e adapter de presentation. A SR-014 definiu no ADR 0013 a integração de uma única linha de saldo diário, com painel server-side, ilha cliente serializável, tabela visível e medição obrigatória do bundle por rota.

Permanecem pendentes: timezone, status/estorno/transferencia, saldo inicial consolidado, preferencias, provedor de IA e observabilidade de producao.
