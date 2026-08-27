# ADR 0011 — Dashboard Pulse com composição server-side e dados reais

- Status: aprovado
- Data: 2026-08-27
- Small release: `UI-003`

## Contexto

A SR-013 entrega saldo de abertura, evolução diária e resumo do período a partir de uma RPC protegida e de um caso de uso server-side. O dashboard anterior também calcula resumo mensal e últimas transações a partir de um `TransactionSessionProvider` cliente, mas o layout privado inicializa esse provider sem as transações persistidas. As duas fontes podem apresentar estados contraditórios.

A proposta FinControl Pulse contém capacidades futuras que ainda não possuem domínio ou dados: disponível de verdade, compromissos, previsão, comparação, gráficos, IA e lista detalhada alinhada a períodos móveis.

## Decisão

1. O snapshot da SR-013 é a única fonte financeira da UI-003.
2. `composeDashboardRoute` permanece server-side e compartilhada por `/` e `/dashboard`.
3. `DashboardPage` torna-se apresentação server-compatible e recebe o conteúdo financeiro por slot React.
4. O DTO financeiro permanece dentro da composição server-side e de `financial-analytics/presentation`.
5. O resumo baseado em `TransactionSessionProvider` deixa de compor o dashboard.
6. “Saldo ao fim do período” substitui qualquer promessa de “Disponível de verdade”.
7. Ações ficam limitadas a Contas e Transações.
8. A tabela diária permanece a representação acessível; gráficos aguardam `SP-001` e SR-014.

## Alternativas consideradas

### Hidratar o provider cliente com transações persistidas

Rejeitada porque duplicaria a leitura, serializaria `Date`/entidades na fronteira RSC e manteria duas fontes de verdade.

### Criar uma API ou Route Handler para o dashboard

Rejeitada porque a leitura é interna a um Server Component; adicionaria round-trip e contrato HTTP sem consumidor externo.

### Exibir todas as seções futuras desabilitadas

Rejeitada porque cria affordances e promessas sem fluxos reais.

### Antecipar biblioteca de gráficos

Rejeitada porque `SP-001` existe para avaliar acessibilidade, peso, SSR e candles antes da escolha.

## Consequências

Positivas:
- uma única fonte financeira real;
- menos JavaScript e menos estado cliente;
- fronteira RSC preservada;
- copy auditável e sem promessa fictícia;
- evolução futura por small releases.

Trade-offs:
- movimentações recentes detalhadas permanecem ausentes;
- não há comparação, tendência ou previsão;
- o dashboard continua textual/tabular até o spike de gráficos.

## Validação

O Dia 2 deve criar testes arquiteturais, de apresentação, estados e composição. O Dia 3 só pode implementar o mínimo após RED válido.
