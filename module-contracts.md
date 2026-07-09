# Module Contracts

## Objetivo
Definir contratos iniciais entre camadas para evitar acoplamento entre UI, domínio e infraestrutura.

## Regra Geral
Componentes de `presentation` chamam hooks ou ações de aplicação. Casos de uso em `application` dependem de contratos. Implementações concretas ficam em `infrastructure`.

## Transactions

### Domain
Tipos e entidades:
- `Transaction`
- `TransactionType`
- `PaymentMethod`
- `Money`

Validações:
- descrição obrigatória
- valor positivo em centavos
- tipo válido
- data obrigatória
- usuário, conta e categoria obrigatórios

### Application
Casos de uso:
- `create-transaction.use-case.ts`
- `list-monthly-summary.use-case.ts`
- `list-session-monthly-summary.use-case.ts`

Contrato previsto:

```ts
export interface TransactionRepository {
  create(input: CreateTransactionRepositoryInput): Promise<Transaction>;
  findByMonth(input: FindTransactionsByMonthInput): Promise<Transaction[]>;
}
```

Contrato implementado para `list-monthly-summary.use-case.ts`:

```ts
export interface ListMonthlySummaryInput {
  userId: string;
  monthRef: string;
}

export interface MonthlySummary {
  monthRef: string;
  incomeTotalInCents: number;
  expenseTotalInCents: number;
  netBalanceInCents: number;
  transactionCount: number;
}
```

Regras planejadas para a SR-005:
- `monthRef` deve usar o formato `YYYY-MM`
- `userId` é obrigatório
- receitas somam em `incomeTotalInCents`
- despesas somam em `expenseTotalInCents`
- saldo líquido é receitas menos despesas
- valores permanecem em centavos
- o caso de uso não conhece Supabase nem UI
- transações fora do mês selecionado são ignoradas defensivamente

Adapter local de sessão:
- `list-session-monthly-summary.use-case.ts` recebe transações locais da sessão e reutiliza `ListMonthlySummaryUseCase`
- não persiste dados
- não acessa Supabase
- existe apenas para a experiência local antes da infraestrutura real

### Infrastructure
Implementações futuras:
- `supabase-transaction.repository.ts`
- `in-memory-transaction.repository.ts` apenas para testes quando fizer sentido

### Presentation
Componentes futuros:
- `TransactionForm.tsx`
- `TransactionList.tsx`
- `MonthlySummaryPanel.tsx`

Regras:
- componente não calcula regra financeira crítica
- componente não importa Supabase
- resumo mensal visível deve consumir resultado da camada de aplicação

## Accounts

Contrato previsto:

```ts
export interface AccountRepository {
  findById(input: FindAccountByIdInput): Promise<FinancialAccount | null>;
  create(input: CreateAccountInput): Promise<FinancialAccount>;
}
```

Uso inicial:
- validar se uma transação referencia conta existente
- calcular saldo em casos de uso futuros

## Categories

Contrato previsto:

```ts
export interface CategoryRepository {
  findById(input: FindCategoryByIdInput): Promise<Category | null>;
  listByUser(input: ListCategoriesInput): Promise<Category[]>;
}
```

Uso inicial:
- validar categoria de transação
- alimentar formulário de transação no futuro

## Dashboard

Contrato inicial:

```ts
export interface FinancialSummaryRepository {
  getMonthlySummary(input: MonthlySummaryInput): Promise<MonthlySummary>;
}
```

Regra:
- dashboard consome casos de uso e resumos
- dashboard não consulta tabela diretamente

## AI Insights

Contrato futuro:

```ts
export interface AiFinancialAnalysisService {
  analyzeMonthlyBehavior(input: MonthlyFinancialAnalysisInput): Promise<FinancialInsight>;
}
```

Regras:
- não executar ação financeira sensível
- não enviar dados além do necessário
- registrar política de privacidade antes de uso real

## Open Finance

Contrato futuro:

```ts
export interface OpenFinanceProviderGateway {
  createConsent(input: CreateConsentInput): Promise<OpenFinanceConsent>;
  listTransactions(input: ListProviderTransactionsInput): Promise<ProviderTransaction[]>;
}
```

Status:
- bloqueado para ciclo futuro
- exige ADR, revisão de segurança e escolha entre Pluggy, Belvo ou alternativa formal
