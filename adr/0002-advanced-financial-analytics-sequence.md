# ADR 0002 - Sequencia para analytics financeiros e gamificacao

- Status: aceito
- Data: 2026-07-11

## Contexto

O produto passou a incluir evolucao, candles, distribuicao de frequencia, metas gamificadas e IA. O repositorio concluiu a SR-006 com dados em memoria e ainda nao possui autenticacao, RLS, persistencia financeira ou biblioteca de graficos.

## Decisao

1. Autenticacao, contas, categorias, persistencia e RLS precedem analytics de producao.
2. Periodos, evolucao, OHLC e frequencia ficam em `financial-analytics/domain` como funcoes puras.
3. Frequencia automatica inicial usa `k = ceil(sqrt(n))`, conforme o PDF.
4. Medidas por classes sao rotuladas como estimativas agrupadas.
5. Linha precede candles; biblioteca visual depende de spike e adapter.
6. Frequencia e opcional e desligada por padrao.
7. Metas precedem gamificacao; gamificacao precede desafios por frequencia.
8. IA entra por ultimo, com consentimento e minimizacao.
9. Cada SR percorre Dias 1 a 7.

## Consequencias

- O roadmap cresce, mas cada incremento permanece testavel.
- Candles exigem saldo inicial, ordenacao estavel e regras de transferencia/status.
- Dashboard nao recebe regras estatisticas.
- Pontos exigem eventos idempotentes e auditaveis.

## Alternativas rejeitadas

- Uma unica feature gigante no dashboard.
- Faixas amigaveis tratadas como classes automaticas.
- Gamificacao calculada em React.
- Candles sobre dados locais sem saldo confiavel.
- IA recebendo transacoes antes de consentimento e privacidade.
