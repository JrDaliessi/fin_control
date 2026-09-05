# ADR 0019 — Extrato contextual do candle

- Status: aprovado para TDD incremental
- Data: 2026-09-01
- Small release: `UX-CHART-002`
- Depende de: ADR 0015 e ADR 0018

## Contexto

Os candles da SR-015 explicam a variação diária do saldo por abertura, máxima, mínima, fechamento, volume e quantidade de movimentos. O tooltip ajuda na leitura imediata, mas não identifica quais lançamentos formaram o intervalo. Colocar descrições ou transações dentro do snapshot inicial aumentaria a exposição de dados financeiros e o payload mesmo quando o usuário não deseja investigar um candle.

A tabela OHLC já é a alternativa acessível do gráfico e precisa oferecer a mesma ação. O contrato atual do ponto visual conserva apenas a data inicial do candle, embora o domínio já possua limites semiabertos completos.

## Decisão

### Intervalo selecionável

- A seleção usa o contrato `{ startOnInclusive, endOnExclusive }`, preservado do domínio até o view model.
- O primeiro recorte suporta somente os candles diários e períodos atuais de até 31 dias.
- Clique ou toque em um candle seleciona seu `dataIndex`; o adapter traduz esse índice para o intervalo conhecido pela presentation.
- A tabela oferece um botão `Ver extrato` por linha. Essa ação é a alternativa integral de teclado, e não um fallback reduzido.
- O hook compartilhado do ECharts recebe somente a extensão estreita necessária para registrar e remover o evento de seleção. Não será criado um `ChartPort` genérico.

### Consulta sob demanda e camadas

- `financial-analytics/application` define `FinancialIntervalStatementQueryRepository`, separado do repositório transacional orientado a criação/listagem mensal.
- O port recebe proprietário confiável e intervalo civil semiaberto; devolve uma projeção mínima e serializável dos lançamentos.
- A implementação Supabase fica em `financial-analytics/infrastructure`, filtra explicitamente `user_id`, `occurred_on >= startOnInclusive` e `occurred_on < endOnExclusive` e usa ordenação determinística.
- Uma Server Action atua como composition root: valida claims, rejeita sessão anônima, injeta `claims.sub` e converte falhas internas em erro público genérico.
- O cliente envia apenas os limites do candle. `userId` nunca é aceito da presentation.
- A consulta ocorre somente após seleção. O snapshot inicial e a RPC financeira existente não recebem descrições nem lançamentos adicionais.
- Não há migration nem nova RPC nesta small release: as policies RLS e o índice atuais de `transactions` cobrem a consulta.

### Painel de extrato

- Abaixo de 768 px, o conteúdo abre como bottom sheet; a partir de 768 px, como painel lateral direito.
- O painel é um diálogo nomeado, com resumo OHLC, intervalo e lista mínima dos lançamentos.
- A projeção inicial contém somente identificador, data, descrição, tipo, valor e referência apresentacional de conta/categoria quando já disponível no contrato aprovado.
- Notas, edição, exclusão, exportação, busca e paginação ficam fora do primeiro recorte.
- Estados `loading`, `empty`, `error` e `success` são explícitos. Uma nova seleção invalida visualmente a anterior e respostas obsoletas não podem substituir a seleção atual.
- Foco inicial, contenção, restauração, `Escape`, backdrop, scroll confinado, safe areas e movimento reduzido reutilizam os padrões comprovados do shell sem antecipar uma biblioteca modal genérica.

### Segurança e privacidade

- A sessão server-side e RLS permanecem a autoridade; o filtro explícito de proprietário reduz superfície e melhora o plano da consulta.
- A consulta usa projeção mínima e nunca registra descrição, valor, UUID, e-mail ou payload financeiro em logs.
- Datas inválidas, intervalos invertidos, limites acima do recorte ou sessão ausente falham antes do repository.
- Erros públicos não distinguem ausência de sessão, item de outro usuário ou falha interna.

## Contratos testáveis para o Dia 2

1. o intervalo exige datas civis válidas, `start < end` e no máximo 31 dias;
2. o view model preserva `startOnInclusive` e `endOnExclusive` de cada candle;
3. o caso de uso consulta exatamente o intervalo selecionado e rejeita limites inválidos antes da infraestrutura;
4. a implementação Supabase aplica proprietário, limites semiabertos, projeção mínima e ordem determinística;
5. a Server Action deriva o proprietário de claims válidas e nunca aceita `userId` do cliente;
6. clique/toque no candle e `Ver extrato` na tabela produzem a mesma seleção;
7. apenas um listener é registrado e ele é removido no cleanup;
8. painel fechado não consulta dados; abertura cobre `loading`, `empty`, `error` e `success`;
9. resposta obsoleta não substitui o intervalo mais recente;
10. diálogo contém e restaura foco, fecha por botão, backdrop e `Escape` e restaura o scroll;
11. responsividade distingue bottom sheet e painel lateral sem overflow em 320, 768 e 1280 px;
12. tabela, tooltip e painel permanecem semanticamente equivalentes sem depender somente de cor.

## Small releases

1. `UX-CHART-002A` — contratos de domínio/application, DTO, consulta Supabase sob demanda e Server Action;
2. `UX-CHART-002B` — seleção estreita no ECharts, ação equivalente na tabela e painel responsivo;
3. `UX-CHART-002C` — proteção contra concorrência, acessibilidade, responsividade e validação real.

## Alternativas consideradas

### Incluir transações no snapshot inicial

Rejeitada por aumentar payload, exposição e acoplamento para todos os usuários, mesmo sem interação.

### Expandir a RPC financeira existente

Rejeitada porque a RPC agrega saldo e tem limite de 31 dias; detalhes transacionais têm ciclo, projeção e autorização próprios.

### Modal central em todos os viewports

Rejeitada por desperdiçar área útil para uma lista vertical. Bottom sheet e painel lateral preservam o contexto do gráfico e melhoram alcance/leitura.

### Tornar cada candle focável diretamente no SVG

Adiada. A tabela com botões oferece equivalência completa e previsível; qualquer navegação granular dentro do renderer exige investigação específica de suporte do ECharts.

## Consequências

- O gráfico passa a apoiar investigação sem carregar dados sensíveis antecipadamente.
- A application ganha um read port específico, mantendo o repositório transacional coeso.
- Eventos do ECharts e concorrência assíncrona tornam-se contratos críticos de presentation.
- O contrato genérico de intervalo prepara a UX-CHART-003 sem antecipar granularidades longas.
- Nenhuma implementação funcional, migration ou alteração remota é autorizada por este ADR antes do Dia 2.

## Próximo passo

Executar o Dia 2 da `UX-CHART-002` e criar os testes essenciais em RED antes de alterar contratos, repositories, Server Actions ou componentes.
