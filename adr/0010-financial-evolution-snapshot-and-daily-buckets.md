# ADR 0010 — Snapshot e agregação diária da evolução financeira

- Status: Aceito
- Data: 2026-08-26
- Small release: SR-013 — Agregação da evolução financeira

## Contexto

A SR-012 definiu períodos civis canônicos e intervalos semiabertos. A SR-013 precisa explicar saldo, receitas, despesas, líquido e quantidade ao longo desses intervalos, usando contas e transações persistidas sem mover matemática para React ou acoplar o domínio ao Supabase.

Consultar somente movimentos dentro do período não produz um saldo de abertura correto. Buscar todo o histórico no servidor de aplicação também cresce sem limite. A Data API suporta filtros por intervalo, mas agregações PostgREST são opt-in e ampliariam a superfície global de performance. A borda de “período atual” também precisava de um timezone IANA explícito.

## Decisão

1. Os cinco períodos atuais serão agregados em buckets civis diários e contínuos.
2. Cada bucket representa `[startOnInclusive, endOnExclusive)` e contém receitas, despesas, líquido, saldo de fechamento e quantidade de movimentos.
3. Dias sem movimentos são preservados, com totais zero e saldo de fechamento igual ao saldo anterior.
4. O saldo de abertura do período é a soma dos saldos iniciais configurados e dos movimentos anteriores ao início. No modelo atual, saldo inicial é a linha de base do livro financeiro e não possui data efetiva própria.
5. Todos os registros atuais de `transactions` são tratados como movimentos efetivos. Status, pendência, cancelamento, estorno e transferência não serão inferidos por descrição, categoria ou meio de pagamento.
6. O domínio recebe projeções neutras com data civil, tipo e valor positivo em centavos; não importa `Transaction`, React, Next.js ou Supabase.
7. A aplicação define `FinancialAnalyticsQueryRepository.loadEvolutionSnapshot`, que devolve `accountCount`, `openingBalanceInCents` e movimentos do intervalo.
8. A implementação Supabase usará `public.load_financial_evolution_snapshot(p_start_on date, p_end_on date)` para obter abertura e movimentos na mesma fotografia transacional, sem carregar histórico bruto na aplicação.
9. A função será `SECURITY INVOKER`, sem parâmetro `userId`, protegida pelas RLS existentes, com `EXECUTE` revogado de `PUBLIC`, `anon` e `service_role` e concedido somente a `authenticated`.
10. Nenhuma tabela, view, coluna, policy ou índice novo é necessário. O índice `(user_id, occurred_on desc, created_at desc, id desc)` já cobre o recorte temporal.
11. `America/Sao_Paulo` é o timezone IANA padrão explícito e temporário da borda de aplicação. Ele não pertence ao domínio e não converte `transactions.occurred_on`.
12. A âncora temporal será injetada como `referenceInstant`; nenhum resolver lê relógio, locale ou timezone implícito.
13. A presentation poderá compor seletor e tabela acessível no dashboard somente após dados reais atravessarem o caso de uso. O redesenho amplo da UI-003 e gráficos permanecem fora.
14. A função rejeita limites nulos, invertidos ou superiores a 31 dias, filtra explicitamente por `(select auth.uid())` além da RLS e ordena movimentos por `occurred_on`, `created_at` e `id` crescentes.
15. O retorno tabular repete `account_count` e `opening_balance_in_cents` por movimento e produz uma linha com movimento nulo quando o intervalo está vazio. O adapter elimina a repetição e valida tipos/inteiros seguros.
16. O Dia 3 só poderá aceitar a função após `EXPLAIN (ANALYZE, BUFFERS)` transacional e advisors confirmarem o uso dos índices e ausência de alerta crítico.

## Contratos essenciais

```ts
export type FinancialMovementProjection = Readonly<{
  id: string;
  occurredOn: string;
  createdAt: string;
  type: "income" | "expense";
  amountInCents: number;
}>;

export type FinancialEvolutionPoint = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
  incomeInCents: number;
  expenseInCents: number;
  netInCents: number;
  closingBalanceInCents: number;
  transactionCount: number;
}>;
```

Somatórios devem permanecer inteiros seguros. Valores fracionários, negativos na projeção, tipos inválidos, datas não canônicas, movimentos fora do período e overflow são rejeitados.

## Alternativas consideradas

### Estender `TransactionRepository.findByMonth`

Rejeitada porque analytics precisa de qualquer período, de uma projeção menor e de saldo de abertura. O domínio de transações não deve se tornar um repositório genérico de relatórios.

### Buscar todas as transações anteriores ao período

Rejeitada por crescimento ilimitado de memória e tráfego e por permitir inconsistência entre leituras independentes.

### Habilitar agregações PostgREST globalmente

Adiada. O recurso é opt-in e exige governança adicional de performance; uma função pequena e testada mantém a superfície explícita.

### Persistir saldo atual ou pontos de evolução

Rejeitada. Saldo e pontos continuam derivados para evitar dupla fonte de verdade.

### Usar timezone do navegador, servidor ou UTC

Rejeitada. A borda recebe instante e timezone explicitamente; o padrão temporário aprovado é centralizado e substituível por preferência futura.

## Consequências

- A matemática permanece pura e reutilizável por tabela, gráfico e IA futura.
- A consulta de abertura não carrega todo o histórico para o Next.js.
- A migration da SR-013 terá somente função, privilégios e testes pgTAP correspondentes.
- O significado temporal do saldo inicial permanece uma linha de base sem data efetiva; introduzir data de abertura exigirá release e migration próprias.
- Resultados atuais não distinguem agendado, pendente, cancelado, estornado ou transferência porque o schema ainda não representa esses conceitos.
- SP-001 e SR-014 recebem um view model estável, mas nenhuma biblioteca visual entra na SR-013.

## Fontes verificadas

- https://supabase.com/docs/reference/javascript/using-filters
- https://supabase.com/docs/reference/javascript/using-modifiers-order
- https://supabase.com/blog/postgrest-aggregate-functions
- https://supabase.com/docs/guides/api/securing-your-api
- https://supabase.com/docs/guides/database/functions
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/database/extensions/pgtap
- https://supabase.com/changelog
