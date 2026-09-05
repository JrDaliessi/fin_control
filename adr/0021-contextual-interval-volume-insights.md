# ADR 0021 — Volume e insights contextuais do intervalo

- Status: arquitetura aprovada; aguardando estratégia de testes
- Data: 2026-09-05
- Small release: `UX-CHART-002D`
- Depende de: ADR 0019 e ADR 0020

## Contexto

O extrato contextual apresenta OHLC e lançamentos, mas a quantidade de movimentos não explica quanto dinheiro circulou nem sua composição. O domínio do candle já expõe receitas, despesas, volume bruto e resultado implícito. Esses dados permitem melhorar a leitura sem nova consulta. Comparações como “acima da média semanal”, porém, exigem uma referência histórica honesta e não devem ser inferidas somente do candle selecionado.

## Decisão

### Resumo financeiro

- Usar o rótulo `Volume movimentado`, definido como a soma bruta de receitas e despesas.
- Exibir receitas, despesas e resultado líquido como composição complementar.
- Manter OHLC como bloco principal e criar logo abaixo um card compacto `Movimentação no intervalo`, sem duplicar um segundo modal.
- Valores continuam em centavos inteiros e são formatados somente na presentation.
- O `FinancialCandle` é a fonte do resumo; uma falha na consulta da lista não remove as métricas já disponíveis.

### Análise contextual

- O controle será `Ver análise do intervalo`, alternando para `Ocultar análise`, com expansão inline dentro do painel atual.
- A apresentação mostra no máximo dois insights, priorizando composição e resultado; não usa linguagem causal, moralizante ou prescritiva.
- A primeira versão é determinística e auditável. Não haverá modelo generativo nem rótulo de IA.
- A análise é calculada localmente no clique a partir do candle já serializado, portanto não cria waterfall ou chamada de rede.
- Sem baseline histórico suficiente, o sistema informa a indisponibilidade em vez de fabricar comparação.
- A futura comparação recebe `{ startOnInclusive, endOnExclusive, granularity }` e carrega somente agregados necessários, sob demanda.

### Referências temporais futuras

- intervalo diário: média dos sete dias civis completos anteriores;
- intervalo de 2 a 31 dias: período imediatamente anterior de mesma duração, com comparação adicional por média diária quando necessário;
- semana: média das quatro semanas completas anteriores;
- mês: média dos três meses completos anteriores;
- intervalos longos: período anterior equivalente, sujeito ao discovery da `UX-CHART-003`.

Essas referências documentam o contrato futuro, mas não autorizam ampliar a RPC ou criar migration antes de testes e validação de segurança específicos.

### Fórmulas e prioridades

- `volume = incomeInCents + expenseInCents`;
- `net = incomeInCents - expenseInCents`;
- percentuais são inteiros complementares, calculando despesas por arredondamento e receitas por `100 - despesas`;
- volume zero não produz percentual;
- divergência entre `volumeInCents` e a soma dos componentes é inválida e não será corrigida silenciosamente;
- no primeiro incremento, composição é o primeiro insight e resultado líquido é o segundo;
- quando a referência histórica existir, comparação temporal assume a primeira posição e composição permanece como segunda;
- variação absoluta abaixo de 5% será descrita como alinhada à referência.

## Fronteiras arquiteturais

- `domain`: valida agregados, calcula métricas e seleciona insights por regras puras.
- `application`: não ganha dependência no primeiro incremento; futuramente orquestra somente a referência histórica por port próprio.
- `infrastructure`: consulta somente agregados autenticados quando a comparação histórica for ativada.
- `presentation`: controla expansão, adapta a saída pura para copy e renderiza; não acessa Supabase nem embute fórmulas no JSX.

## Contratos testáveis

1. volume é `receitas + despesas`, sem compensação pelo resultado líquido;
2. percentuais usam o volume como denominador e tratam volume zero sem divisão inválida;
3. resultado líquido é `receitas - despesas`;
4. a análise exibe no máximo dois insights relevantes e não inventa comparação;
5. o controle possui `aria-expanded`, `aria-controls` e não abre diálogo aninhado;
6. o conteúdo permanece coerente ao trocar rapidamente o candle;
7. nenhum acesso Supabase parte da presentation;
8. uma futura consulta histórica só ocorre por ação explícita e retorna agregados mínimos.

## Alternativas rejeitadas

- Gerar texto por LLM no primeiro recorte: custo, latência e variabilidade não agregam valor às regras numéricas simples.
- Abrir outro modal: prejudica foco, navegação e contexto, especialmente no celular.
- Enviar histórico bruto ao browser: amplia payload e exposição sem necessidade.
- Chamar volume de ganho ou saldo: semanticamente incorreto.

## Consequências

- O extrato fica mais explicativo sem migration no primeiro incremento.
- A lógica financeira passa a ter um serviço puro reutilizável por períodos futuros.
- A comparação histórica permanece separada até existir baseline seguro e testado.
- A `UX-CHART-003` continua em `DISCOVERY` e será retomada depois deste ciclo.

## Próximo passo

Executar o Dia 5 da `UX-CHART-002D` para revisar estrutura, consistência e robustez interna sem alterar o comportamento financeiro validado.
