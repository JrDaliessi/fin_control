# Feature PRD — UX-CHART-003C

## Identificação

- Feature: `UX-CHART-003C — Tudo, período personalizado e drill-down`
- Capability: `software`, com apoio de `product`
- Estado: `REQUIREMENTS_READY`
- Derivada de: `UX-CHART-003`, ADR 0019, ADR 0020 e ADR 0021
- Aprovação humana: contrato do Dia 1 aprovado em 2026-09-08

## Problema

O dashboard permite analisar períodos predefinidos até um ano, mas ainda não oferece uma visão completa do histórico nem a escolha de datas específicas. Em intervalos longos, abrir diretamente todos os lançamentos também seria visualmente confuso, caro e incompatível com o limite seguro de 31 dias do extrato contextual.

## Usuário e valor esperado

Uma pessoa autenticada deve conseguir responder, sem conhecer conceitos de mercado financeiro:

- como o saldo evoluiu em todo o histórico disponível;
- o que ocorreu entre duas datas escolhidas;
- quais subdivisões explicam um bucket trimestral ou anual;
- quais lançamentos explicam o mês final selecionado.

O valor está em transformar uma visão histórica ampla em uma investigação progressiva, preservando clareza, desempenho e privacidade.

## Escopo

- adicionar o atalho `Tudo` à barra de períodos;
- adicionar o atalho `Personalizado` e um seletor de datas inclusivas;
- representar o período personalizado em URL canônica;
- derivar no servidor o início real de `Tudo` a partir da primeira transação pertencente ao usuário;
- selecionar granularidade diária, semanal, mensal, trimestral ou anual conforme o intervalo;
- limitar a consulta a no máximo 60 anos e 60 buckets;
- permitir drill-down progressivo no mesmo painel contextual;
- preservar ações equivalentes na tabela e no gráfico;
- buscar lançamentos brutos somente para o mês final, sob demanda e limitado a 31 dias.

## Fora do escopo

- comparar dois períodos simultaneamente;
- salvar intervalos favoritos;
- zoom livre, pan ou seleção por arrasto no gráfico;
- exportação de extrato;
- edição ou exclusão de lançamentos no painel;
- previsão de saldo ou preenchimento de datas futuras como projeção;
- agregação de histórico bruto no navegador;
- paginação do extrato mensal existente;
- mudança de semântica dos sete períodos já entregues.

## Regras de negócio

- `FPRD-UXCHART003C-BR-001`: `Tudo` começa na menor `occurred_on` das transações visíveis ao usuário pela RLS. `created_at` da conta é metadado técnico e não define início financeiro.
- `FPRD-UXCHART003C-BR-002`: sem transações, `Tudo` usa o mês civil da referência e exibe o saldo inicial, sem fabricar histórico anterior.
- `FPRD-UXCHART003C-BR-003`: as datas escolhidas na UI são inclusivas; o domínio converte `to` para o dia seguinte e opera com `[fromInclusive, toExclusive)`.
- `FPRD-UXCHART003C-BR-004`: segmentos futuros eventualmente contidos no intervalo não são projeções; carregam o último saldo e volume zero.
- `FPRD-UXCHART003C-BR-005`: a granularidade é diária até 31 dias, semanal acima de 31 dias até 6 meses, mensal acima de 6 meses até 2 anos, trimestral acima de 2 até 15 anos e anual acima de 15 anos.
- `FPRD-UXCHART003C-BR-006`: duração superior a 60 anos ou resolução superior a 60 buckets produz erro explícito; não há truncamento silencioso.
- `FPRD-UXCHART003C-BR-007`: o drill-down segue `ano → trimestres`, `trimestre → meses` e `mês → extrato`; um bucket de dia, semana ou mês dentro do limite existente pode abrir diretamente o extrato.
- `FPRD-UXCHART003C-BR-008`: o extrato bruto continua limitado a um intervalo máximo de 31 dias.
- `FPRD-UXCHART003C-BR-009`: cards, linha, candles, tabela e painel contextual usam uma única resolução canônica do período.

## Requisitos funcionais

- `FPRD-UXCHART003C-RQ-001`: oferecer `Tudo` e `Personalizado` junto aos períodos existentes, com seleção operável por toque, mouse e teclado.
- `FPRD-UXCHART003C-RQ-002`: serializar o personalizado como `?period=custom&from=YYYY-MM-DD&to=YYYY-MM-DD` e restaurar a mesma análise após refresh ou compartilhamento.
- `FPRD-UXCHART003C-RQ-003`: validar datas civis, ordem dos limites, duração máxima e quantidade máxima de buckets, apresentando uma mensagem acionável quando inválido.
- `FPRD-UXCHART003C-RQ-004`: resolver `Tudo` sem aceitar do browser uma data inicial efetiva ou um identificador de usuário.
- `FPRD-UXCHART003C-RQ-005`: produzir buckets civis consecutivos e semiabertos, incluindo buckets parciais nas extremidades.
- `FPRD-UXCHART003C-RQ-006`: devolver somente OHLC, receitas, despesas, volume, quantidade e limites para históricos longos.
- `FPRD-UXCHART003C-RQ-007`: abrir o detalhamento do bucket selecionado no painel já existente, substituindo seu conteúdo sem criar diálogo aninhado.
- `FPRD-UXCHART003C-RQ-008`: manter navegação de retorno, título do nível atual, carregamento, vazio, erro e proteção contra resposta obsoleta em cada etapa.
- `FPRD-UXCHART003C-RQ-009`: oferecer na tabela ação equivalente à seleção de cada candle ou bucket do gráfico.
- `FPRD-UXCHART003C-RQ-010`: consultar lançamentos detalhados somente ao atingir um mês de até 31 dias e somente após ação explícita.

## Requisitos não funcionais

- `FPRD-UXCHART003C-NFR-001`: preservar RLS, `SECURITY INVOKER`, identidade por `auth.uid()`, `search_path = ''` e execução somente para `authenticated`.
- `FPRD-UXCHART003C-NFR-002`: não enviar descrições, notas, categorias, contas ou IDs de transações em respostas agregadas.
- `FPRD-UXCHART003C-NFR-003`: manter no máximo 60 pontos em gráfico e tabela, inclusive em `Tudo`.
- `FPRD-UXCHART003C-NFR-004`: não registrar valores financeiros, e-mails, UUIDs ou descrições em logs e analytics.
- `FPRD-UXCHART003C-NFR-005`: preservar targets de 44 px, foco visível e restaurado, Escape, reduced motion, leitura sem depender de cor e ausência de overflow global em 320 px.
- `FPRD-UXCHART003C-NFR-006`: preservar compatibilidade das URLs e períodos existentes.

## Critérios de aceite

- `FPRD-UXCHART003C-AC-001` cobre RQ-001/RQ-002: `Tudo` e `Personalizado` são acessíveis, canônicos e sobrevivem a refresh.
- `FPRD-UXCHART003C-AC-002` cobre RQ-003: datas inválidas, ordem invertida, mais de 60 anos ou mais de 60 buckets são rejeitados com motivo explícito.
- `FPRD-UXCHART003C-AC-003` cobre RQ-004: `Tudo` começa na primeira transação do usuário; sem transações, usa o período corrente e preserva o saldo inicial.
- `FPRD-UXCHART003C-AC-004` cobre RQ-005/RQ-006: a matriz de granularidade é determinística, cobre o intervalo uma única vez e não envia lançamentos brutos para a visão ampla.
- `FPRD-UXCHART003C-AC-005` cobre RQ-007/RQ-008: selecionar um bucket anual mostra trimestres, selecionar um trimestre mostra meses e o painel permite voltar sem diálogo aninhado.
- `FPRD-UXCHART003C-AC-006` cobre RQ-009: teclado e leitor de tela têm na tabela as mesmas ações e informações essenciais do gráfico.
- `FPRD-UXCHART003C-AC-007` cobre RQ-010: somente o mês final dispara a consulta detalhada existente, limitada a 31 dias e protegida contra concorrência.
- `FPRD-UXCHART003C-AC-008` cobre NFR-001/NFR-002: usuário anônimo e leitura cross-tenant falham; respostas agregadas não expõem detalhes transacionais.
- `FPRD-UXCHART003C-AC-009` cobre NFR-003/NFR-005: 320, 390, 768 e 1280 px permanecem legíveis, sem overflow global e com até 60 pontos.
- `FPRD-UXCHART003C-AC-010` cobre NFR-004/NFR-006: não há PII/valores em telemetria e todos os sete períodos anteriores continuam compatíveis.

## Métricas e sinais

- seleção de `Tudo` e `Personalizado` concluída sem erro de validação;
- abertura e retorno de cada nível de drill-down;
- classe de granularidade e faixa de quantidade de buckets, sem valores financeiros;
- erro técnico ou rejeição defensiva por código sanitizado.

Os eventos são opcionais para o primeiro release, não contêm dados financeiros e não bloqueiam a feature se o baseline de observabilidade ainda não estiver disponível.

## Dependências e riscos

- depende de `UX-CHART-003A`, `UX-CHART-003B` e do painel da `UX-CHART-002`;
- exige migration forward-only para estender a allowlist agregada e consultar a âncora histórica;
- risco ALTO de consulta extensa, mitigado por agregação server-side, limites duplos, RLS e `EXPLAIN` antes de qualquer índice;
- risco MÉDIO de complexidade no painel, mitigado por uma pilha de navegação única e conteúdo substituído no mesmo diálogo;
- risco MÉDIO de meses com quantidade excepcional de lançamentos; paginação é dívida separada e não autoriza ampliar o escopo deste ciclo.

## Small releases aprovadas

1. `UX-CHART-003C1 — Domínio e URL`: tipos `all/custom`, limites civis, granularidade anual e estados do seletor.
2. `UX-CHART-003C2 — Agregação segura`: âncora server-side, buckets trimestrais/anuais, migration, RLS, grants e performance.
3. `UX-CHART-003C3 — Drill-down progressivo`: painel único, navegação ano/trimestre/mês, tabela equivalente e extrato final sob demanda.

## Aprovação

Requisitos, regras, critérios e fatiamento aprovados pelo usuário em 2026-09-08. Mudança estrutural ou ampliação de escopo exige nova decisão registrada.
