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

### SR-009 — Persistência e RLS de Contas

Escopo aprovado:
- criar conta do usuário autenticado
- listar somente contas pertencentes ao usuário autenticado
- reidratar `FinancialAccount` com `id`, `createdAt` e `updatedAt` atribuídos pela infraestrutura
- manter o mapper entre `snake_case` e domínio dentro de `infrastructure`

Regras adicionais:
- o `userId` enviado pelo cliente não é autoridade; a operação sensível revalida a identidade e a RLS aplica ownership no banco
- saldo inicial permanece imutável após criação nesta SR
- nomes duplicados são permitidos
- usuários anônimos do Supabase Auth não podem acessar dados financeiros
- erro bruto do Supabase não pode chegar à apresentação
- ordem de listagem é determinística por criação decrescente e ID

Fora da SR-009:
- editar, excluir ou arquivar contas
- instituição, agência, conta principal e múltiplas moedas
- saldo atual persistido
- idempotência de criação; risco de repetição será tratado em incremento futuro se necessário
- persistência de categorias e transações

### Categorias
Classifica transações e permite orçamento por grupo.

Entidades:
- `Category`

Regras:
- toda categoria pertence a um usuário autenticado
- `kind` aceita somente `income` ou `expense`; categoria híbrida fica fora para evitar ambiguidade na seleção e nos relatórios
- nome é obrigatório, normalizado com espaços internos simples e limitado a 80 caracteres
- nomes duplicados para o mesmo usuário e `kind` são rejeitados sem diferenciar maiúsculas e minúsculas
- o mesmo nome pode existir em `income` e `expense`
- categoria sugerida por IA deve ser revisável pelo usuário

### SR-010 — Persistência e RLS de Categorias

Escopo aprovado:
- criar categoria do usuário autenticado
- listar somente categorias pertencentes ao usuário autenticado
- reidratar `Category` com `id`, `createdAt` e `updatedAt` atribuídos pela infraestrutura
- ordenar categorias por `kind`, nome normalizado e ID
- disponibilizar `/categories` como subfluxo privado de transações sem ampliar a navegação principal

Regras adicionais:
- o `userId` enviado pelo cliente não é autoridade; a composition root injeta a identidade verificada e a RLS aplica ownership no banco
- usuários anônimos do Supabase Auth não podem acessar categorias
- a persistência deve impedir duplicidade de nome por usuário e `kind`
- a futura SR-011 deve validar que transação e categoria compartilham o mesmo `user_id` por FK composta, além da RLS
- erro bruto do Supabase não pode chegar à apresentação

Fora da SR-010:
- editar, excluir, arquivar ou reordenar manualmente categorias
- cor, ícone, categoria global, seed automático e sugestões por IA
- persistência de transações, filtros analíticos e orçamento por categoria
- integração completa da categoria com transações persistidas, reservada à SR-011

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

### SR-011 — Persistência e RLS de Transações

Escopo aprovado:
- criar transação manual efetiva do usuário autenticado
- consultar transações próprias por mês
- reidratar `Transaction` com `id`, `createdAt` e `updatedAt` do banco
- usar conta e categoria persistidas pertencentes ao mesmo usuário
- exigir que `Transaction.type` corresponda a `Category.kind`

Regras adicionais:
- a data informada é uma data civil e será persistida como `date`; o mapper a converte para meia-noite UTC no domínio
- descrição é aparada e limitada a 160 caracteres
- notas são opcionais; quando presentes, são aparadas e limitadas a 1000 caracteres
- valores permanecem positivos em centavos; o tipo determina receita ou despesa
- `paymentMethod` permanece limitado a `manual`, `pix`, `cash` ou `debit`
- não existe status persistido nesta SR; toda transação manual criada é efetiva
- o `userId` da apresentação não é autoridade; a composition root injeta a identidade verificada e a RLS reforça ownership
- erros de integridade ou Supabase não podem expor detalhes brutos à apresentação

Fora da SR-011:
- editar, excluir, cancelar ou conciliar transações
- transferências, cartão, parcelas, recorrências e importação
- saldo atual persistido ou trigger de saldo
- integração persistente do dashboard e analytics avançados

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
