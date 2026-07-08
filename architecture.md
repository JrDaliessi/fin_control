# Architecture

## Decisão Base
O projeto usa Feature-Based + Clean Architecture leve sobre Next.js App Router.

## Justificativa
Essa arquitetura permite crescimento por domínio sem criar rigidez excessiva. Ela separa interface, regras de aplicação, domínio e infraestrutura, mantendo o projeto testável e evolutivo.

## Camadas

### presentation
Responsável por componentes React, hooks de UI, formulários, estados visuais e composição da experiência.

Não pode:
- acessar Supabase diretamente
- conter regra de negócio pesada
- orquestrar fluxo complexo de aplicação

### application
Responsável por casos de uso e coordenação entre domínio e infraestrutura.

Deve:
- ser testável sem interface
- depender de contratos claros
- concentrar regras de aplicação

### domain
Responsável por entidades, value objects, tipos, schemas, contratos e regras puras.

Não pode depender de:
- React
- Next.js
- Supabase
- APIs externas

### infrastructure
Responsável por Supabase, repositórios, adapters, services externos e persistência.

Deve:
- implementar contratos necessários
- isolar detalhes técnicos
- proteger a UI de acoplamento com banco e APIs

## Next.js App Router
`src/app` será usado como camada de entrada:
- rotas
- layouts
- page.tsx
- route groups

A lógica real deve ficar em `src/features`.

## Estrutura Feature-Based Aprovada

```text
src/
  app/
    (public)/
      login/
        page.tsx
    (private)/
      dashboard/
        page.tsx
    layout.tsx
    page.tsx
    globals.css
  features/
    auth/
    accounts/
    credit-cards/
    transactions/
    budgets/
    goals/
    dashboard/
    imports/
    ai-insights/
  shared/
    components/
      ui/
    constants/
    hooks/
    types/
    utils/
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
  migrations/
  tests/
    setupTests.ts
```

Cada feature deve conter, quando houver código:

```text
presentation/
application/
domain/
  entities/
  interfaces/
  schemas/
  types/
  value-objects/
infrastructure/
tests/
```

## Módulos e Responsabilidades

### auth
Autenticação, sessão, proteção de rotas e vínculo seguro entre usuário e dados financeiros.

### accounts
Contas financeiras, saldo inicial, saldo calculado, instituições e conta usada em pagamentos.

### credit-cards
Cartões, limites, fechamento, vencimento, faturas, compras parceladas e compromissos futuros.

### transactions
Receitas, despesas, transferências, recorrências e transações categorizadas.

### budgets
Orçamento mensal por categoria, alertas de limite e acompanhamento de consumo.

### goals
Metas e envelopes financeiros, incluindo reserva de emergência, dívidas e objetivos pessoais.

### dashboard
Composição de resumo financeiro, saldo real, risco de falta de dinheiro e próximos compromissos.

### imports
Importação de CSV, OFX ou extratos. Open Finance permanece fora do MVP inicial.

### ai-insights
Análises, explicações, categorização sugerida, simulação de compras e planos financeiros.

## Contratos Principais Entre Camadas

Contratos de repositório devem nascer no `domain` ou em `application` conforme a necessidade do caso de uso. Implementações concretas ficam em `infrastructure`.

Contratos previstos:
- `AccountRepository`
- `CategoryRepository`
- `TransactionRepository`
- `CreditCardRepository`
- `BudgetRepository`
- `GoalRepository`
- `FinancialSummaryRepository`

Services previstos:
- `AuthSessionProvider`
- `StatementImportParser`
- `AiFinancialAnalysisService`
- `OpenFinanceProviderGateway`

Casos de uso previstos:
- `create-transaction.use-case.ts`
- `list-monthly-summary.use-case.ts`
- `calculate-real-balance.use-case.ts`
- `register-credit-card-purchase.use-case.ts`
- `simulate-purchase.use-case.ts`

## Fronteiras de Dependência

```text
presentation -> application -> domain
application -> domain contracts
infrastructure -> domain/application contracts
app -> presentation/application composition
```

Proibido:
- `domain` importar React, Next.js ou Supabase.
- `presentation` importar clients Supabase.
- `app/page.tsx` conter regra de negócio.
- `ai-insights` executar ação financeira sensível.

## Supabase
Supabase será usado para autenticação, banco de dados e storage quando necessário.

Regras:
- clients separados para browser e server
- acesso isolado em `src/lib/supabase` e `infrastructure`
- RLS obrigatório antes de manipular dados financeiros reais

## PWA
O projeto deve ter:
- manifest
- ícones
- mobile first
- instalabilidade
- estratégia offline definida de forma realista

## IA
A IA deve atuar como análise e recomendação:
- categorizar transações
- explicar gastos
- detectar anomalias
- sugerir economia
- simular compras

Ela não deve executar ação financeira sensível sem confirmação do usuário.

## Modelo de Dados Conceitual Inicial

Tabelas candidatas para fases futuras:
- `profiles`
- `financial_accounts`
- `categories`
- `transactions`
- `credit_cards`
- `credit_card_invoices`
- `installment_plans`
- `budgets`
- `goal_envelopes`
- `recurring_commitments`
- `import_batches`
- `ai_insights`

Regras de dados:
- Todas as tabelas financeiras devem ter `user_id`.
- RLS deve restringir acesso por usuário.
- Valores monetários devem ser salvos em centavos.
- Datas de competência mensal devem usar referência explícita de mês.
- Dados importados devem guardar origem e lote de importação.

## ADRs
Decisões arquiteturais relevantes devem ser registradas em `adr/`.
