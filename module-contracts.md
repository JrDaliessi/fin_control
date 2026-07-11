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

Resolução de competência da sessão:
- `resolve-session-month-ref.ts` seleciona a transação mais recente sem depender da ordem de entrada
- sessão vazia usa uma data de fallback
- hooks de dashboard e transações reutilizam o mesmo contrato

### Infrastructure
Implementações futuras:
- `supabase-transaction.repository.ts`
- `in-memory-transaction.repository.ts` apenas para testes quando fizer sentido

### Presentation
Componentes futuros:
- `TransactionForm.tsx`
- `TransactionList.tsx`
- `MonthlySummaryPanel.tsx`
- `TransactionSessionList.tsx`

Hooks:
- `useSessionMonthlySummary.ts`

Utils:
- `formatCents.ts`

Regras:
- componente não calcula regra financeira crítica
- componente não importa Supabase
- resumo mensal visível deve consumir resultado da camada de aplicação
- página deve compor fluxo, evitando concentrar estado derivado e lista detalhada
- estados visuais relevantes devem ser anunciáveis por semântica acessível quando mudarem
- controles de escolha de modo, como receita/despesa, devem preferir radios nativos ou controle segmentado acessível

## Accounts

### Domain

Tipos aprovados para a SR-007:

```ts
export type FinancialAccountType =
  | "checking"
  | "savings"
  | "cash"
  | "payment"
  | "investment";

export type CreateFinancialAccountInput = {
  userId: string;
  name: string;
  type: FinancialAccountType;
  initialBalanceInCents: number;
  currency?: "BRL";
};

export type FinancialAccountProps = CreateFinancialAccountInput & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
```

Invariantes:
- nome normalizado e limitado a 80 caracteres
- saldo inicial representado por inteiro seguro em centavos, aceitando valores negativos
- moeda padrão e única da SR-007: `BRL`
- nenhum saldo atual mutável armazenado na entidade

### Application

Caso de uso planejado:
- `create-account.use-case.ts`

Fluxo:
1. receber `CreateFinancialAccountInput`
2. criar e validar `FinancialAccount`
3. chamar `AccountRepository.create` uma única vez
4. retornar a conta criada pelo repositório

### Repository

Contrato aprovado:

```ts
export interface AccountRepository {
  create(input: FinancialAccount): Promise<FinancialAccount>;
  findById?: (input: FindAccountByIdInput) => Promise<FinancialAccount | null>;
}
```

Decisões:
- `create` é o único método obrigatório na SR-007
- `findById` permanece opcional até um caso de uso real exigir consulta
- a implementação local pode existir na apresentação apenas em ciclo posterior e não substitui infraestrutura
- repositório Supabase, migrations e RLS pertencem à SR-009
- componentes React não recebem nem importam clients Supabase

### Presentation

Implementada no Dia 4:
- `AccountForm.tsx`: nome, tipo, saldo inicial e feedback acessível
- `useAccountForm.ts`: estados `idle`, `submitting`, `success` e `error`
- `parseAccountBalanceToCents.ts`: conversão de reais para centavos, incluindo saldo negativo
- `AccountSessionProvider.tsx`: adapter local que executa `CreateAccountUseCase` e mantém contas em memória
- `AccountSessionList.tsx`: empty state e lista das contas locais
- `AccountsPage.tsx`: composição da experiência
- `/accounts`: rota do App Router

Regras preservadas:
- provider local não substitui repositório Supabase
- recarregar a aplicação reinicia as contas
- provider armazena cópias congeladas e isoladas das referências de entrada e retorno
- erros de entrada são associados ao campo e anunciados
- saldo negativo tem explicação explícita na interface
- dashboard oferece navegação para `/accounts`
- parsing monetário comum fica em `src/shared/utils/parseCurrencyToCents.ts`; wrappers das features definem se negativos são permitidos

Fora da SR-007:
- listar, editar ou excluir contas
- selecionar instituição e agência
- calcular saldo atual
- associar automaticamente transações existentes

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

### Domain

Nesta SR, o dashboard não introduz novas entidades de domínio. Consome tipos existentes de transactions:
- `MonthlySummary` de `list-monthly-summary.use-case.ts`
- `CreateTransactionInput` de `transaction.entity.ts`

### Application

Caso de uso:
- `get-dashboard-summary.use-case.ts`

Contrato:

```ts
export type DashboardSummaryInput = {
  userId: string;
  monthRef: string;
  transactions: CreateTransactionInput[];
};

export type DashboardSummary = {
  monthlySummary: MonthlySummary;
  recentTransactions: CreateTransactionInput[];
};
```

Regras:
- orquestra resumo mensal via `listSessionMonthlySummary`, que reutiliza `ListMonthlySummaryUseCase`
- seleciona as N transações mais recentes da sessão
- não acessa repositórios diretamente
- `userId` e `monthRef` validados antes de execução
- transações recentes são filtradas pelo `userId` solicitado antes da ordenação e do limite

### Presentation

Componentes:
- `DashboardPage.tsx` — composição macro da tela
- `DashboardSummaryPanel.tsx` — exibe o resumo mensal retornado pela aplicação
- `RecentTransactionsList.tsx` — lista compacta das últimas transações
- `DashboardEmptyState.tsx` — call-to-action quando não há dados

Hooks:
- `useDashboardSummary.ts` — estado assíncrono do cálculo do resumo

Regras:
- componente não calcula regra financeira
- componente não importa Supabase
- estados visuais anunciáveis por semântica acessível
- navegação mínima entre dashboard e registro de transação
- `DashboardPage` consome a sessão local por `useTransactionSession`
- `useDashboardSummary` coordena loading, success e error sobre `GetDashboardSummaryUseCase`

### Sessão Local de Apresentação

- `TransactionSessionProvider` pertence à apresentação de `transactions`
- o provider é composto em `src/app/layout.tsx`
- transações existem apenas em memória durante a navegação
- recarregar a aplicação reinicia a sessão
- o provider não substitui repositório, Supabase, autenticação ou RLS
- o provider clona a transação e sua data na entrada para impedir mutação externa da sessão
- contratos de leitura expõem coleções readonly
- `formatCents` e `formatMonthRef` ficam em `src/shared/utils` por serem usados em mais de uma feature

### Rotas

- `/` renderiza `DashboardPage`
- `/dashboard` renderiza `DashboardPage`
- `/transactions` renderiza `TransactionsPage`

### Infrastructure

Nenhuma infraestrutura nova nesta SR. Sem repositórios, sem clients, sem Supabase.

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
