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
- `id`
- `user_id`
- `name`
- `type`
- `initial_balance_in_cents`
- `currency`
- `created_at`
- `updated_at`

### categories
- `id`
- `user_id`
- `name`
- `kind`
- `color`
- `icon`
- `created_at`
- `updated_at`

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
Todas as políticas devem restringir acesso por `auth.uid() = user_id`.

## Fora do Dia 1
- migrations reais
- seed de produção
- integração Supabase implementada
- índices definitivos
- políticas RLS executadas

