# Domain Model

## Objetivo
Registrar o domínio financeiro inicial do MVP antes de qualquer implementação funcional.

## Subdomínios

### Autenticação e Perfil
Garante que dados financeiros pertençam a um usuário autenticado.

Entidades:
- `UserProfile`

Regras:
- todo dado financeiro deve pertencer a um usuário
- sessão deve ser validada antes de acessar área privada

### Contas Financeiras
Representa contas onde o usuário controla dinheiro disponível.

Entidades:
- `FinancialAccount`

Campos candidatos:
- `id`
- `userId`
- `name`
- `type`
- `initialBalanceInCents`
- `currency`
- `createdAt`
- `updatedAt`

Regras:
- valores monetários em centavos
- conta deve pertencer ao usuário
- saldo calculado não deve depender apenas de campo mutável

### Categorias
Classifica transações e permite orçamento por grupo.

Entidades:
- `Category`

Regras:
- categoria pode ser de receita, despesa ou ambas conforme decisão futura
- categoria sugerida por IA deve ser revisável pelo usuário

### Transações
Núcleo inicial do MVP.

Entidades:
- `Transaction`

Campos candidatos:
- `id`
- `userId`
- `accountId`
- `categoryId`
- `description`
- `amountInCents`
- `type`
- `occurredAt`
- `paymentMethod`
- `notes`
- `createdAt`
- `updatedAt`

Regras:
- descrição é obrigatória
- valor deve ser positivo
- tipo deve ser `income` ou `expense` no primeiro recorte
- data da transação é obrigatória
- transação deve referenciar conta e categoria válidas
- transferência, cartão e recorrência ficam fora da primeira small release

### Cartões de Crédito
Representa compromissos futuros, faturas e limite.

Entidades:
- `CreditCard`
- `CreditCardInvoice`
- `InstallmentPlan`

Regras:
- compra no cartão não reduz saldo bancário imediatamente
- compra parcelada deve gerar compromissos futuros
- vencimento e fechamento influenciam competência da fatura
- pagamento de fatura reduz saldo da conta pagadora

### Orçamentos
Controla limites mensais por categoria.

Entidades:
- `Budget`

Regras:
- orçamento pertence a um mês
- estouro de orçamento deve ser detectável por caso de uso

### Metas e Envelopes
Divide dinheiro planejado por objetivo.

Entidades:
- `GoalEnvelope`

Regras:
- envelope tem objetivo, valor-alvo e progresso
- sugestão de alocação por IA precisa ser confirmada pelo usuário

### Recorrências
Representa assinaturas, contas fixas e compromissos repetidos.

Entidades:
- `RecurringCommitment`

Regras:
- recorrência deve gerar previsão de compromisso
- cancelamento ou pausa deve preservar histórico

## Primeira Small Release

Nome: cadastro manual de transação simples.

Cenário feliz:
- usuário autenticado registra uma despesa manual com descrição, valor, data, conta e categoria
- sistema valida dados
- sistema persiste por contrato de repositório
- sistema retorna transação criada

Cenários críticos:
- valor zero ou negativo deve falhar
- descrição vazia deve falhar
- data ausente deve falhar
- conta ausente deve falhar
- categoria ausente deve falhar
- usuário ausente deve falhar

## Casos de Uso Iniciais
- `create-transaction.use-case.ts`
- `list-monthly-summary.use-case.ts`
- `get-dashboard-summary.use-case.ts`
- `calculate-real-balance.use-case.ts`

## Fora do Primeiro Recorte
- cartão de crédito
- parcelas
- importação
- IA
- Open Finance


