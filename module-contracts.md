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
  create(input: Transaction): Promise<Transaction>;
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

### Contrato Persistente da SR-011

Domínio:
- `Transaction.create()` valida novas transações manuais
- `Transaction.restore()` reidrata ID, data civil e timestamps persistidos reaplicando invariantes
- `TransactionRepository.findByMonth` deixa de ser opcional porque passa a ter consumidor persistente real

Infrastructure planejada:
- `SupabaseTransactionRepository` implementa `create` e `findByMonth`
- mapper converte `snake_case`, `date`, `bigint` seguro e timestamps para o domínio
- criação envia somente as colunas aprovadas; ID e timestamps são responsabilidade do banco
- consulta filtra explicitamente por `user_id` e intervalo mensal semiaberto, com ordem determinística
- erros de FK, RLS ou provider são sanitizados antes de cruzar a fronteira

Composition root planejada:
- Server Component de `/transactions` revalida claims e carrega contas, categorias e transações do período
- Server Action revalida claims, injeta `userId` e chama `CreateTransactionUseCase`
- apresentação recebe DTOs serializáveis e callbacks; não instancia client Supabase

Banco planejado:
- `SELECT` e `INSERT` são as únicas operações concedidas a `authenticated`
- RLS habilitada e forçada, com owner e bloqueio de Auth anônimo
- FKs compostas impedem conta/categoria cross-tenant e categoria incompatível com o tipo
- `UPDATE` e `DELETE` permanecem sem grants, policies ou casos de uso
- migration e testes pgTAP só podem nascer após o RED do Dia 2

### Infrastructure
Implementações planejadas para os Dias 2 e 3:
- `supabase-transaction.repository.ts`
- `transaction.mapper.ts`

### Presentation
Componentes existentes ou planejados:
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
export type ListAccountsByUserInput = {
  userId: string;
};

export interface AccountRepository {
  create(input: FinancialAccount): Promise<FinancialAccount>;
}

export interface AccountListingRepository {
  listByUser(input: ListAccountsByUserInput): Promise<readonly FinancialAccount[]>;
}
```

Decisões:
- `create` é o único método obrigatório na SR-007
- `AccountListingRepository.listByUser` existe na SR-009 porque há consumidor real para a lista persistida, sem ampliar o contrato de criação
- `findById` permanece fora até existir um caso de uso real; métodos opcionais não serão usados para antecipar escopo
- a implementação local pode existir na apresentação apenas em ciclo posterior e não substitui infraestrutura
- repositório Supabase, migrations e RLS pertencem à SR-009
- componentes React não recebem nem importam clients Supabase

### Contrato Persistente da SR-009

Casos de uso:
- `CreateAccountUseCase` recebe o ator autenticado pela composition root, não confia em um `userId` livre da UI
- `ListAccountsUseCase` valida o ator e consulta `AccountRepository.listByUser`

Domínio:
- `FinancialAccount.create()` continua responsável por nova conta
- `FinancialAccount.restore()` reidrata ID e timestamps persistidos reaplicando as invariantes do domínio

Infrastructure:
- `SupabaseAccountRepository` implementa `create` e `listByUser`
- mapper converte `snake_case`, `bigint` seguro e `timestamptz` para o domínio
- consulta inclui filtro explícito por `user_id` para desempenho, sem substituir RLS

Composition root:
- Server Component lista contas após revalidar claims
- Server Action cria conta após revalidar claims e injeta o `userId` verificado
- presentation recebe DTOs serializáveis e callbacks; não instancia client ou repositório Supabase
- `AccountsPage` mantém somente o estado visual derivado dos DTOs persistidos e do retorno da Server Action

Banco:
- migration, grants, RLS e testes pgTAP são executados exclusivamente pelo Supabase MCP
- operações permitidas nesta SR: `SELECT` e `INSERT`
- `UPDATE` e `DELETE` não fazem parte do contrato

### Presentation

Implementada no Dia 4:
- `AccountForm.tsx`: nome, tipo, saldo inicial e feedback acessível
- `useAccountForm.ts`: estados `idle`, `submitting`, `success` e `error`
- `parseAccountBalanceToCents.ts`: conversão de reais para centavos, incluindo saldo negativo
- `AccountList.tsx`: empty state e lista de DTOs persistidos
- `AccountsPage.tsx`: composição e estado visual alimentado por callbacks persistentes
- `/accounts`: Server Component dinâmico com loading e error boundary

Regras preservadas:
- presentation não recebe `userId` e não acessa Supabase
- a lista inicial vem do servidor e a criação adiciona somente o DTO retornado após persistência
- o provider local de contas foi removido no Dia 5 por não possuir consumidor
- erros de entrada são associados ao campo e anunciados
- saldo negativo tem explicação explícita na interface
- dashboard oferece navegação para `/accounts`
- parsing monetário comum fica em `src/shared/utils/parseCurrencyToCents.ts`; wrappers das features definem se negativos são permitidos

Fora da SR-009:
- editar, excluir ou arquivar contas
- selecionar instituição e agência
- calcular saldo atual
- associar automaticamente transações existentes

## Categories

### Domain

Tipos aprovados para a SR-010:

```ts
export type CategoryKind = "income" | "expense";

export type CreateCategoryInput = {
  userId: string;
  name: string;
  kind: CategoryKind;
};

export type CategoryProps = CreateCategoryInput & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
```

Invariantes:
- `userId` obrigatório e normalizado
- nome obrigatório, espaços normalizados e limite de 80 caracteres
- `kind` limitado a `income` ou `expense`
- unicidade case-insensitive por usuário e `kind` reforçada pelo banco

### Application e Repository

Contratos aprovados:

```ts
export type ListCategoriesByUserInput = {
  userId: string;
};

export interface CategoryRepository {
  create(input: Category): Promise<Category>;
  listByUser(
    input: ListCategoriesByUserInput
  ): Promise<readonly Category[]>;
}
```

Casos de uso planejados:
- `CreateCategoryUseCase`: cria a entidade válida e persiste uma única vez
- `ListCategoriesUseCase`: valida o ator e lista categorias próprias em ordem determinística

Decisões:
- `findById`, `update` e `delete` não entram sem consumidor real
- o ator vem da sessão verificada na composition root, não de campo livre da UI
- duplicidade do banco vira erro estável de aplicação sem expor detalhes do Supabase

### Infrastructure e Composition Root

- `SupabaseCategoryRepository` implementa criação e listagem
- mapper converte `snake_case` e timestamps para o domínio
- consulta filtra explicitamente por `user_id` para desempenho sem substituir RLS
- Server Component de `/categories` lista dados após revalidar claims
- Server Action cria categoria após revalidar claims e injeta `userId`
- presentation recebe DTOs serializáveis e callbacks; não instancia client Supabase

### Presentation planejada para o Dia 4

- rota privada `/categories` com formulário pequeno, lista e estados de loading, empty, success e error
- acesso como subfluxo de `/transactions`, sem novo item na navegação principal
- categorias persistidas podem substituir opções demonstrativas do formulário local, mas transações continuam efêmeras até a SR-011
- cor, ícone, edição, exclusão, seeds e IA permanecem fora

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

## Financial Analytics — SR-012

### Domain

```ts
export type FinancialPeriodKind =
  | "week"
  | "rolling_7_days"
  | "fortnight"
  | "rolling_15_days"
  | "month";

export type FinancialPeriod = {
  kind: FinancialPeriodKind;
  referenceOn: string;
  startOnInclusive: string;
  endOnExclusive: string;
};
```

`CivilDate` valida e encapsula strings `YYYY-MM-DD`. O domínio expõe:

```ts
export function resolveFinancialPeriod(input: {
  kind: FinancialPeriodKind;
  referenceOn: string;
}): FinancialPeriod;

export function containsCivilDate(
  period: FinancialPeriod,
  candidateOn: string,
): boolean;
```

Regras:
- limites são civis e semiabertos
- nenhuma função lê `new Date()`, timezone ou locale do ambiente
- `Date`, React, Next.js, Supabase e `Transaction` não são dependências do domínio
- `custom` não pertence à união da SR-012

### Application

```ts
export type ResolveFinancialPeriodInput = {
  kind: FinancialPeriodKind;
  referenceOn: string;
};

export type FinancialPeriodDto = {
  kind: FinancialPeriodKind;
  referenceOn: string;
  startOnInclusive: string;
  endOnExclusive: string;
};

export interface ResolveFinancialPeriodUseCase {
  execute(input: ResolveFinancialPeriodInput): FinancialPeriodDto;
}
```

O DTO usa somente strings serializáveis. A conversão futura de um instante para `referenceOn` deverá receber timezone IANA e relógio explicitamente; ela não integra a SR-012.

### Infrastructure e Presentation

- nenhuma implementação nesta release
- o port de consulta por intervalo nasce somente na SR-013, quando houver consumidor
- nenhuma rota, seletor, migration, policy, grant ou dependência adicional é autorizada

## Financial Analytics — SR-013

### Domain

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

export function aggregateFinancialEvolution(input: {
  period: FinancialPeriod;
  openingBalanceInCents: number;
  movements: readonly FinancialMovementProjection[];
}): readonly FinancialEvolutionPoint[];
```

### Application

```ts
export type LoadFinancialEvolutionSnapshotInput = {
  userId: string;
  startOnInclusive: string;
  endOnExclusive: string;
};

export type FinancialEvolutionSnapshot = Readonly<{
  accountCount: number;
  openingBalanceInCents: number;
  movements: readonly FinancialMovementProjection[];
}>;

export interface FinancialAnalyticsQueryRepository {
  loadEvolutionSnapshot(
    input: LoadFinancialEvolutionSnapshotInput,
  ): Promise<FinancialEvolutionSnapshot>;
}
```

`ListFinancialEvolutionUseCase` recebe ator, kind, `referenceInstant` ISO e `timeZone`, deriva `referenceOn`, resolve o período, consulta o snapshot e devolve DTO plano com status `missing_accounts | empty | success`, resumo e pontos diários.

O estado `missing_accounts` não fabrica pontos diários. O estado `empty` preserva todos os buckets e o saldo de abertura quando existem contas, mas nenhum movimento no intervalo.

A borda de período atual recebe `referenceInstant` e `timeZone` explicitamente. A composition root usa temporariamente `America/Sao_Paulo`; nenhuma instância de `Date` atravessa a fronteira RSC.

### Infrastructure

- repository próprio em `financial-analytics/infrastructure`
- RPC `load_financial_evolution_snapshot(p_start_on date, p_end_on date)` com limites civis, `SECURITY INVOKER` e `search_path` fixo
- identidade derivada da sessão/RLS, nunca de parâmetro livre da RPC
- projeção ordenada por `occurred_on`, `created_at` e `id`
- intervalo máximo de 31 dias; limites nulos ou invertidos são rejeitados no banco
- retorno contém `account_count`, `opening_balance_in_cents` e colunas nullable do movimento; intervalo vazio preserva uma linha de snapshot
- consultas incluem filtro explícito por `(select auth.uid())` para selecionar os índices compostos, sem substituir RLS
- plano será validado com `EXPLAIN (ANALYZE, BUFFERS)` dentro de teste transacional antes da aceitação
- nenhuma extensão de `TransactionRepository.findByMonth`
- nenhuma tabela, view, coluna, policy ou índice novo

### Presentation

- `FinancialPeriodSelector` escolhe somente os cinco kinds existentes
- `FinancialEvolutionTable` renderiza dados reais com caption e cabeçalhos semânticos
- tabela não calcula período, saldo ou agregação
- gráficos, comparação, `custom`, calendário histórico e redesign completo do dashboard permanecem fora

## Sistema Visual — UI-001

Este contrato é transversal de apresentação. Ele não pertence ao domínio financeiro e não pode importar Supabase, casos de uso financeiros ou infraestrutura.

### Tema

```ts
export type ThemePreference = "light" | "dark" | "system";

export type ResolvedTheme = "light" | "dark";

export type ThemeControllerValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};
```

Função pura planejada:

```ts
export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme;
```

Regras:

- `light` e `dark` sempre vencem a preferência do sistema.
- `system` resolve por `matchMedia('(prefers-color-scheme: dark)')` e acompanha mudanças posteriores.
- valor ausente ou inválido no armazenamento é tratado como `system`.
- somente a chave `fincontrol.theme` pode ser usada e somente os três valores da allowlist são aceitos.
- `resolvedTheme === "dark"` aplica `data-theme="dark"`; o tema claro remove esse seletor.
- a resolução inicial usa script estático local antes da hidratação; o provider React mantém o estado depois dela.
- nenhum dado financeiro, identificador de usuário ou sessão é persistido por esse contrato.

### Tokens

- `globals.css` define tokens de light e dark como canais RGB.
- `tailwind.config.ts` apenas os expõe usando `rgb(var(--token) / <alpha-value>)`.
- tokens mínimos: background, surface, surface-elevated, foreground, muted-foreground, border, primary, primary-hover, primary-foreground, accent, income, expense, danger-foreground, warning e focus-ring.
- contraste é validado por combinação de uso, e não apenas pelo valor isolado do token.

### Primitives compartilhadas

- `Button`: variantes visuais essenciais, estado desabilitado e foco visível; não conhece navegação ou regra financeira.
- `Card`: superfície estrutural sem semântica financeira.
- `FeedbackMessage`: feedback `status` ou `error` com papel acessível adequado.
- `ThemeSwitcher`: controla `ThemePreference`, oferece nome acessível e não conhece persistência além do controller.

Inputs, modal, drawer, bottom sheet, badge, tabs, skeleton e cards financeiros não fazem parte da UI-001.

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
