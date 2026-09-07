# ADR 0020 — Períodos financeiros e granularidade adaptativa

- Status: arquitetura aprovada para `UX-CHART-003B`; `003A` mesclada e `003C` refinada para ciclo próprio
- Data: 2026-09-06
- Feature: `UX-CHART-003`
- Depende de: ADR 0019, ADR 0021 e merge `7434159`

## Contexto

O dashboard suporta períodos financeiros atuais de até 31 dias e candles diários produzidos pela RPC existente. A experiência desejada adiciona atalhos `7D`, `15D`, `Mês`, `3M`, `Ano`, `Tudo` e intervalo personalizado. Repetir um candle por dia em históricos longos prejudicaria legibilidade, bundle e custo de dados; enviar todos os movimentos ao navegador também violaria minimização e não escala.

A feature precisa manter cards, linha, candles, tabela e extrato no mesmo intervalo, conservar URLs existentes e evitar aparência de plataforma de trading.

## Decisão

### Sequência incremental

1. `UX-CHART-003A` substitui o `select` e o botão de confirmação por uma barra imediata com os cinco períodos já suportados: `Semana`, `7D`, `Quinzena`, `15D` e `Mês`. Reutiliza a RPC atual, não cria migration e preserva todos os valores de URL.
2. `UX-CHART-003B` adiciona `3M` e `Ano` por uma agregação server-side nova, migration forward-only e testes pgTAP.
3. `UX-CHART-003C` adiciona `Tudo`, intervalo personalizado e drill-down de buckets trimestrais antes do extrato detalhado.

Cada recorte percorre Dias 1 a 7. A `003A` foi concluída e mesclada em `develop`; a `003B` concluiu seu Dia 1 e é o único recorte autorizado a avançar ao Dia 2.

### Matriz de granularidade

| Intervalo selecionado | Bucket padrão | Limite operacional |
| --- | --- | --- |
| até 31 dias | diário | RPC atual, até 31 pontos |
| acima de 31 dias até 6 meses | semanal civil | aproximadamente 5–27 pontos |
| acima de 6 meses até 2 anos | mensal civil | preferencialmente 7–24 pontos |
| acima de 2 anos | trimestral civil | preferencialmente 12–60 pontos |

- Buckets são civis, consecutivos e semiabertos; primeiro e último podem ser parciais e devem refletir somente o intervalo selecionado.
- Abertura, máxima, mínima e fechamento preservam a ordenação determinística definida na SR-015.
- A escolha de bucket pertence ao domínio/application e não ao componente visual.
- O servidor aplica allowlist de buckets e limites máximos de intervalo/pontos. O browser nunca escolhe expressão SQL nem recebe movimentos brutos de históricos longos.

### URL e presentation

- O período selecionado permanece representável na URL e sobreviverá a refresh, navegação e compartilhamento.
- Valores antigos continuam válidos; valor desconhecido recai em default seguro e canônico.
- A `003A` preserva `week`, `rolling_7_days`, `fortnight`, `rolling_15_days` e `month`; o fallback permanece `month`.
- A barra é um formulário GET server-rendered com ações imediatas, horizontal e rolável quando necessário, sem exigir estado cliente para navegar.
- Os botões têm alvo mínimo de 44 px, `aria-pressed`, foco visível e nomes acessíveis completos; a seleção não depende somente de cor.
- A ordem é `Semana`, `7D`, `Quinzena`, `15D`, `Mês`, mantendo visível a diferença entre período civil e período móvel.
- O seletor controla uma única fonte de período para resumo, linha, candles, tabela e extrato.
- A tabela textual continua obrigatória e usa o mesmo bucket do gráfico.

### Semântica de 3M, Ano e períodos extensos

- `3M` representa o mês civil da referência e os dois meses civis anteriores; não significa noventa dias.
- `Ano` representa o ano civil da referência; doze meses móveis exigiriam um preset futuro distinto.
- `3M` usa o valor canônico `three_months` e bucket semanal civil iniciado na segunda-feira.
- `Ano` usa o valor canônico `year` e bucket mensal civil.
- Para a mesma referência usada pelo período mensal, `3M` termina no primeiro dia do mês seguinte e `Ano` termina no primeiro dia do ano seguinte; datas futuras sem movimentos apenas carregam saldo e não são tratadas como projeção.
- A RPC agregada aceita no máximo 366 dias e 60 buckets, limites suficientes para o ano bissexto e independentes da futura política de `Tudo`.
- `Personalizado` recebe limites inclusivos na UI e os converte para intervalo semiaberto no domínio.
- `Tudo` deriva sua âncora histórica no servidor por proprietário; o browser não escolhe a data inicial efetiva.
- A política para mais de 60 buckets trimestrais permanece decisão obrigatória do ciclo `003C`; truncamento silencioso é proibido.
- Bucket trimestral não consulta diretamente extrato bruto acima de 31 dias: primeiro ocorre drill-down para meses, depois a consulta detalhada existente.

### Agregação e segurança

- A RPC diária atual continua limitada a 31 dias e não será relaxada.
- O recorte 003B cria `public.load_financial_evolution_buckets(date, date, text)`, uma função agregadora `SECURITY INVOKER`, acessível somente a `authenticated`, com identidade validada, RLS, allowlist e limites explícitos.
- A função agregada usa `search_path = ''`, revoga `EXECUTE` de `PUBLIC`, `anon` e `service_role` e não aceita `userId` do cliente.
- A allowlist da RPC contém apenas `week` e `month`; a granularidade é resolvida no domínio/application e nunca por expressão SQL fornecida pela UI.
- Cada linha agregada contém somente limites do bucket, account count, OHLC, receitas, despesas, volume e contagem; descrições, notas, categorias, contas e identificadores de movimentos não são retornados.
- A migration será forward-only, reproduzível e validada por pgTAP antes de aplicação remota.
- A resposta contém somente agregados necessários para os view models; descrições e lançamentos são buscados sob demanda pelo contrato da UX-CHART-002.
- Nenhum valor financeiro, descrição, UUID ou e-mail entra em logs ou analytics.
- O índice composto existente deve ser validado com `EXPLAIN (ANALYZE, BUFFERS)` antes de qualquer índice novo; índices especulativos são rejeitados.

## Contratos testáveis para o ciclo atual da 003B

1. cada preset resolve intervalo civil determinístico e URL canônica;
2. URLs existentes continuam compatíveis e valores inválidos usam fallback seguro;
3. a granularidade segue a matriz e respeita o teto de pontos;
4. buckets são consecutivos, semiabertos e cobrem o intervalo uma única vez;
5. buckets parciais calculam OHLC apenas com dados pertencentes ao recorte;
6. linha, candles, tabela, cards e extrato recebem o mesmo período resolvido;
7. a RPC rejeita usuário ausente/anônimo, bucket fora da allowlist e intervalo excessivo;
8. RLS impede leitura cross-tenant e a migration preserva grants mínimos;
9. atalhos são operáveis por teclado, anunciam seleção e não causam overflow em 320 px;
10. o seletor da `003A` permanece Server Component, usa navegação GET e não consulta Supabase;
11. históricos longos não enviam movimentos brutos ao cliente;
12. buckets trimestrais exigem drill-down antes do extrato detalhado limitado a 31 dias.
13. `three_months` resolve o mês da referência e os dois anteriores, enquanto `year` resolve janeiro a janeiro inclusive em ano bissexto;
14. períodos curtos continuam usando a RPC de snapshot e períodos longos usam exclusivamente a RPC agregada;
15. a RPC agregada rejeita mais de 366 dias ou mais de 60 buckets e preserva buckets vazios com saldo carregado.

## Alternativas consideradas

### Usar candles diários para qualquer período

Rejeitada por densidade visual, custo de consulta e quantidade de pontos não controlada.

### Agregar no browser

Rejeitada porque exigiria transferir histórico bruto, duplicaria regras financeiras na presentation e aumentaria risco de exposição.

### Implementar todos os presets em uma única release

Rejeitada por misturar mudanças de UI, domínio, SQL, RLS e performance em um incremento grande demais.

### Remover o limite da RPC atual

Rejeitada. O limite existente é uma proteção correta para a consulta diária e deve permanecer explícito.

## Consequências

- Os atalhos curtos foram entregues e mesclados sem migration.
- Períodos longos exigem ciclo crítico próprio, com TDD, pgTAP, revisão RLS e validação de performance.
- O limite visual de pontos fica previsível em mobile e desktop.
- O extrato contextual continua sob demanda e independente da granularidade agregada.
- A `003B` passa a `ARCHITECTURE_READY`; a `003C` permanece refinada, mas não autorizada para teste ou implementação neste ciclo.

## Evidências do Dia 1 da 003B

- merge da `003A` confirmado em `origin/develop` no commit `7434159`;
- código atual possui cinco valores de período, resolver civil puro, uma única composição server-side e RPC diária limitada a 31 dias;
- projeto Supabase `fin_control` está `ACTIVE_HEALTHY` em Postgres 17.6.1, com RLS habilitada e forçada nas tabelas financeiras e seis migrations locais/remotas alinhadas;
- a RPC atual foi confirmada como invoker, com `search_path = ''` e execução somente para `authenticated`;
- o índice composto existente inicia por `user_id` e segue com `occurred_on`, `created_at` e `id`; nenhum índice novo foi aprovado sem `EXPLAIN`;
- discovery geral permanece em `docs/ux-chart-003-discovery.md` e o contrato próprio da `003B` está em `docs/ux-chart-003b-discovery.md`.

## Próximo passo

Executar o Dia 2 da `UX-CHART-003B` e criar testes Jest e pgTAP em RED para períodos, buckets, seleção do repository, mapper, RLS, grants, limites e performance antes de alterar código funcional ou criar a migration.
