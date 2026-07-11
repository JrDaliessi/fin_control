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

Campos aprovados para a SR-007:
- `id`
- `userId`
- `name`
- `type`
- `initialBalanceInCents`
- `currency`
- `createdAt`
- `updatedAt`

Regras:
- `userId` é obrigatório e normalizado com remoção de espaços externos
- `name` é obrigatório, normalizado com espaços internos simples e limitado a 80 caracteres
- `type` aceita somente `checking`, `savings`, `cash`, `payment` ou `investment`
- `initialBalanceInCents` deve ser inteiro finito dentro do intervalo seguro de inteiros do JavaScript
- saldo inicial negativo é permitido para representar a situação real informada pelo usuário; não representa limite de crédito
- `currency` é fixa como `BRL` na SR-007; outras moedas ficam fora do recorte
- `id`, `createdAt` e `updatedAt` são metadados opcionais na criação local e serão atribuídos pela infraestrutura quando houver persistência
- a conta deve pertencer ao usuário indicado; isolamento real depende de autenticação e RLS nas SR-008 e SR-009
- saldo atual será calculado futuramente a partir do saldo inicial e dos movimentos; não haverá campo mutável de saldo atual na entidade

### SR-007 — Cadastro Local de Conta Financeira

Cenário feliz:
- usuário informa nome, tipo e saldo inicial em reais na apresentação futura
- a apresentação converte o valor para centavos antes do caso de uso
- o domínio normaliza e valida os dados
- o caso de uso envia a entidade válida ao `AccountRepository`
- o repositório retorna a conta criada

Cenários críticos para o Dia 2:
- usuário ou nome ausente deve falhar antes do repositório
- nome acima de 80 caracteres deve falhar
- tipo fora da enumeração deve falhar
- saldo fracionário, infinito, `NaN` ou fora do intervalo seguro deve falhar
- moeda diferente de `BRL` deve falhar
- saldo inicial positivo, zero ou negativo deve ser aceito quando inteiro e seguro
- repositório deve ser chamado uma única vez somente para entrada válida

Limites da SR-007:
- sem autenticação, banco, migrations ou RLS
- sem cálculo de saldo atual
- sem edição, exclusão, transferência, instituição bancária, cartão ou Open Finance
- sem integração da conta ao formulário de transações antes dos testes e contratos do ciclo correspondente

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
- `create-account.use-case.ts`
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

