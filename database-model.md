# Database Model

## Objetivo
Registrar modelo conceitual inicial do banco antes de criar migrations.

Este arquivo não é uma migration. Migrations só devem ser criadas quando os testes e contratos da feature exigirem persistência concreta.

## Convenções
- IDs UUID.
- Valores monetários em centavos.
- Tabelas financeiras com `user_id`.
- RLS obrigatória em dados de usuário.
- `created_at` e `updated_at` em registros principais.

## Tabelas Candidatas

### profiles
- `id`
- `user_id`
- `display_name`
- `created_at`
- `updated_at`

### financial_accounts
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `name text not null`, aparado e entre 1 e 80 caracteres
- `type text not null`, limitado a `checking`, `savings`, `cash`, `payment` ou `investment`
- `initial_balance_in_cents bigint not null`, limitado ao intervalo seguro do JavaScript
- `currency text not null default 'BRL'`, limitada a `BRL`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Decisões da SR-009:
- nomes duplicados por usuário são permitidos
- saldo inicial é imutável neste recorte; correções futuras usam movimento de ajuste
- não existe `current_balance` persistido
- índice composto planejado: `(user_id, created_at desc, id desc)`
- exclusão do usuário Auth remove suas contas por cascade; futura exclusão de conta referenciada por transações deverá usar `RESTRICT`
- nenhuma trigger de `updated_at` enquanto `UPDATE` estiver fora do escopo

### categories
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `name text not null`, normalizado e entre 1 e 80 caracteres
- `kind text not null`, limitado a `income` ou `expense`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Decisões da SR-010:
- o recorte permite somente criar e listar categorias próprias
- nome é único por usuário e `kind` em comparação case-insensitive
- nomes iguais podem existir para o mesmo usuário quando pertencem a kinds diferentes
- `color`, `icon`, categoria global, seed automático, edição, exclusão e arquivamento ficam fora
- listagem é determinística por `kind`, nome normalizado e ID
- uma restrição única `(user_id, id)` prepara a futura FK composta de transações e impede vínculo cross-tenant no banco
- exclusão do usuário Auth remove suas categorias por cascade; a futura FK de transações deverá usar `RESTRICT`
- nenhuma trigger de `updated_at` enquanto `UPDATE` estiver fora do escopo

### transactions
- `id`
- `user_id`
- `account_id`
- `category_id`
- `description`
- `amount_in_cents`
- `type`
- `payment_method`
- `occurred_at`
- `notes`
- `created_at`
- `updated_at`

### credit_cards
- `id`
- `user_id`
- `name`
- `limit_in_cents`
- `closing_day`
- `due_day`
- `created_at`
- `updated_at`

### credit_card_invoices
- `id`
- `user_id`
- `credit_card_id`
- `month_ref`
- `status`
- `total_in_cents`
- `due_date`
- `paid_at`
- `created_at`
- `updated_at`

### installment_plans
- `id`
- `user_id`
- `credit_card_id`
- `category_id`
- `description`
- `total_amount_in_cents`
- `installment_count`
- `first_month_ref`
- `created_at`
- `updated_at`

### budgets
- `id`
- `user_id`
- `category_id`
- `month_ref`
- `limit_in_cents`
- `created_at`
- `updated_at`

### goal_envelopes
- `id`
- `user_id`
- `name`
- `target_amount_in_cents`
- `current_amount_in_cents`
- `target_date`
- `created_at`
- `updated_at`

### recurring_commitments
- `id`
- `user_id`
- `category_id`
- `description`
- `amount_in_cents`
- `frequency`
- `next_occurrence_at`
- `status`
- `created_at`
- `updated_at`

### import_batches
- `id`
- `user_id`
- `source`
- `file_name`
- `status`
- `created_at`
- `updated_at`

### ai_insights
- `id`
- `user_id`
- `period_start`
- `period_end`
- `kind`
- `content`
- `created_at`

## Relações Iniciais
- `transactions.user_id` referencia o usuário autenticado.
- `transactions.account_id` referencia `financial_accounts`.
- `transactions.category_id` referencia `categories`.
- `credit_card_invoices.credit_card_id` referencia `credit_cards`.
- `budgets.category_id` referencia `categories`.

## RLS Inicial Planejada
Todas as políticas devem restringir acesso por `(select auth.uid()) = user_id`.

Para `financial_accounts` na SR-009:
- revogar privilégios de `anon`, `authenticated` e `service_role` antes dos grants explícitos
- conceder somente `SELECT` e `INSERT` a `authenticated`
- habilitar e forçar RLS
- criar policy de `SELECT` por proprietário
- criar policy de `INSERT` com `WITH CHECK` por proprietário
- bloquear explicitamente JWT com `is_anonymous = true`
- não criar grants ou policies de `UPDATE` e `DELETE`
- tratar tabela, constraints, índice, grants e RLS na mesma migration

Para `categories` na SR-010:
- revogar privilégios de `public`, `anon`, `authenticated` e `service_role` antes dos grants explícitos
- conceder somente `SELECT` e `INSERT` a `authenticated`
- habilitar e forçar RLS
- criar policy de `SELECT` por proprietário
- criar policy de `INSERT` com `WITH CHECK` por proprietário
- bloquear JWT com `is_anonymous = true`
- não criar grants ou policies de `UPDATE` e `DELETE`
- tratar tabela, constraints, índices, grants e RLS na mesma migration

## Fora do Dia 1
- migrations reais
- seed de produção
- integração Supabase implementada
- políticas RLS executadas
