# ADR 0020 — Períodos financeiros e granularidade adaptativa

- Status: arquitetura coordenada; implementação aguardando UX-CHART-002
- Data: 2026-09-01
- Feature: `UX-CHART-003`
- Depende de: ADR 0019

## Contexto

O dashboard suporta períodos financeiros atuais de até 31 dias e candles diários produzidos pela RPC existente. A experiência desejada adiciona atalhos `7D`, `15D`, `Mês`, `3M`, `Ano`, `Tudo` e intervalo personalizado. Repetir um candle por dia em históricos longos prejudicaria legibilidade, bundle e custo de dados; enviar todos os movimentos ao navegador também violaria minimização e não escala.

A feature precisa manter cards, linha, candles, tabela e extrato no mesmo intervalo, conservar URLs existentes e evitar aparência de plataforma de trading.

## Decisão

### Sequência incremental

1. `UX-CHART-003A` adiciona `7D`, `15D` e `Mês` sobre a RPC atual, sem migration, preservando os valores de URL já aceitos.
2. `UX-CHART-003B` adiciona `3M` e `Ano` por uma agregação server-side nova, migration forward-only e testes pgTAP.
3. `UX-CHART-003C` adiciona `Tudo` e intervalo personalizado e integra todos os buckets ao extrato contextual.

Cada recorte percorre Dias 1 a 7. `UX-CHART-003` não entra em TDD ou implementação enquanto `UX-CHART-002` não estiver concluída.

### Matriz de granularidade

| Intervalo selecionado | Bucket padrão | Limite operacional |
| --- | --- | --- |
| até 31 dias | diário | RPC atual, até 31 pontos |
| acima de 31 dias até 6 meses | semanal civil | preferencialmente 12–27 pontos |
| acima de 6 meses até 2 anos | mensal civil | preferencialmente 7–24 pontos |
| acima de 2 anos | trimestral civil | preferencialmente 12–60 pontos |

- Buckets são civis, consecutivos e semiabertos; primeiro e último podem ser parciais e devem refletir somente o intervalo selecionado.
- Abertura, máxima, mínima e fechamento preservam a ordenação determinística definida na SR-015.
- A escolha de bucket pertence ao domínio/application e não ao componente visual.
- O servidor aplica allowlist de buckets e limites máximos de intervalo/pontos. O browser nunca escolhe expressão SQL nem recebe movimentos brutos de históricos longos.

### URL e presentation

- O período selecionado permanece representável na URL e sobreviverá a refresh, navegação e compartilhamento.
- Valores antigos continuam válidos; valor desconhecido recai em default seguro e canônico.
- A barra é horizontal e rolável quando necessário, com botões de alvo mínimo de 44 px, `aria-pressed` e nomes acessíveis completos.
- O seletor controla uma única fonte de período para resumo, linha, candles, tabela e extrato.
- A tabela textual continua obrigatória e usa o mesmo bucket do gráfico.

### Agregação e segurança

- A RPC diária atual continua limitada a 31 dias e não será relaxada.
- O recorte 003B cria uma função agregadora `SECURITY INVOKER`, acessível somente a `authenticated`, com identidade validada, RLS, allowlist e limites explícitos.
- A migration será forward-only, reproduzível e validada por pgTAP antes de aplicação remota.
- A resposta contém somente agregados necessários para os view models; descrições e lançamentos são buscados sob demanda pelo contrato da UX-CHART-002.
- Nenhum valor financeiro, descrição, UUID ou e-mail entra em logs ou analytics.

## Contratos testáveis para o ciclo futuro

1. cada preset resolve intervalo civil determinístico e URL canônica;
2. URLs existentes continuam compatíveis e valores inválidos usam fallback seguro;
3. a granularidade segue a matriz e respeita o teto de pontos;
4. buckets são consecutivos, semiabertos e cobrem o intervalo uma única vez;
5. buckets parciais calculam OHLC apenas com dados pertencentes ao recorte;
6. linha, candles, tabela, cards e extrato recebem o mesmo período resolvido;
7. a RPC rejeita usuário ausente/anônimo, bucket fora da allowlist e intervalo excessivo;
8. RLS impede leitura cross-tenant e a migration preserva grants mínimos;
9. atalhos são operáveis por teclado, anunciam seleção e não causam overflow em 320 px;
10. históricos longos não enviam movimentos brutos ao cliente.

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

- Os atalhos curtos podem entregar valor sem migration.
- Períodos longos exigem ciclo crítico próprio, com TDD, pgTAP, revisão RLS e validação de performance.
- O limite visual de pontos fica previsível em mobile e desktop.
- O extrato contextual continua sob demanda e independente da granularidade agregada.
- A feature permanece em `DISCOVERY` até a conclusão da UX-CHART-002.

## Próximo passo

Concluir o ciclo da `UX-CHART-002`; depois revalidar este ADR no Dia 1 próprio da `UX-CHART-003A` antes de criar testes ou migration.
