# Project Context — Controle Financeiro IA

## Estado do Projeto
- Estado atual da máquina de estados: `IMPLEMENTATION_IN_PROGRESS`
- Fase atual: Dia 3 — Implementação mínima orientada por teste
- Data de bootstrap: 2026-07-08
- Data de discovery inicial: 2026-07-08
- Data de estratégia de testes inicial: 2026-07-08
- Data da implementação mínima inicial: 2026-07-08
- Fonte inicial de produto: pesquisa comparativa de apps financeiros brasileiros e internacionais fornecida pelo usuário

## Visão do Produto
Controle Financeiro IA é um aplicativo financeiro pessoal brasileiro com IA, focado em explicar o dinheiro do usuário, prever riscos financeiros e orientar decisões antes que problemas aconteçam.

O produto não deve ser apenas um registrador de gastos. Ele deve responder diariamente:
- Quanto eu tenho de verdade?
- Para onde meu dinheiro está indo?
- O que eu devo fazer agora?

## Objetivo do Sistema
Construir um PWA financeiro com dashboard claro, controle de contas/cartões/parcelas, orçamento, metas e análises inteligentes. A primeira versão deve priorizar entrada manual e importação de extratos antes de integrações automáticas via Open Finance.

## Escopo Inicial
MVP planejado:
- login
- cadastro de contas
- cadastro de cartões
- receitas
- despesas
- parcelas
- categorias
- orçamento mensal
- metas/envelopes
- dashboard inicial
- relatórios simples
- importação de extrato
- IA analisando dados lançados pelo usuário

Fora do escopo inicial:
- Open Finance em produção
- pagamentos automatizados
- movimentação automática de dinheiro
- integração bancária não oficial
- recomendações financeiras sensíveis sem confirmação do usuário

## Regras de Negócio Principais
- A IA pode analisar, sugerir e alertar, mas não pode executar ação financeira sensível sem confirmação explícita do usuário.
- O saldo disponível real deve considerar saldo, despesas futuras conhecidas, cartão, parcelas, contas vencidas e receitas previstas.
- Compras parceladas devem impactar faturas futuras.
- Compra no cartão de crédito não reduz saldo de conta bancária imediatamente; ela aumenta compromisso de fatura.
- Pagamento de fatura reduz saldo da conta usada para pagamento.
- Transações devem pertencer a um usuário autenticado.
- Valores financeiros devem ser representados em centavos para evitar erro de ponto flutuante.
- Assinaturas e recorrências devem ser tratadas como compromissos futuros.
- Categorias devem permitir automação futura, mas o usuário deve poder revisar e corrigir classificações.
- Dados financeiros são área crítica: autenticação, autorização, RLS, criptografia e auditoria devem ser tratados como requisitos de arquitetura.

## Stack Obrigatória
- PWA
- Node.js
- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth e Database
- Jest
- Testing Library
- TDD

## Arquitetura Escolhida
Feature-Based + Clean Architecture leve.

Cada feature deve ser organizada em:
- `presentation`: componentes, páginas internas da feature, hooks e estados visuais.
- `application`: casos de uso e orquestração de fluxos.
- `domain`: entidades, tipos, contratos, schemas e regras puras.
- `infrastructure`: repositórios, clients, adapters e integrações externas.

O diretório `src/app` deve atuar como entrada do Next.js App Router, com rotas, layouts e composição macro. Regras de negócio devem ficar nas features.

## Estrutura de Pastas Alvo
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
      presentation/
      application/
      domain/
      infrastructure/
      tests/
    accounts/
      presentation/
      application/
      domain/
      infrastructure/
      tests/

    credit-cards/
      presentation/
      application/
      domain/
      infrastructure/
      tests/

    transactions/
      presentation/
      application/
      domain/
      infrastructure/
      tests/

    budgets/
      presentation/
      application/
      domain/
      infrastructure/
      tests/

    goals/
      presentation/
      application/
      domain/
      infrastructure/
      tests/
    dashboard/
      presentation/
      application/
      domain/
      infrastructure/
      tests/

    imports/
      presentation/
      application/
      domain/
      infrastructure/
      tests/

    ai-insights/
      presentation/
      application/
      domain/
      infrastructure/
      tests/
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

## Convenções
- Componentes React: `PascalCase.tsx`
- Hooks: `useNomeDoHook.ts`
- Casos de uso: `nome-da-acao.use-case.ts`
- Repositórios: `nome-entidade.repository.ts`
- Services: `nome-entidade.service.ts`
- Schemas: `nome-entidade.schema.ts`
- Tipos: `nome-entidade.types.ts`
- Testes: `*.spec.ts` ou `*.test.ts`
- Componentes genéricos ficam em `src/shared/components/ui`
- Componentes específicos ficam dentro da própria feature

## Padrão de Testes
- TDD obrigatório para regras principais.
- Ordem preferencial: domain, application, infrastructure crítica, presentation importante.
- Todo fluxo novo deve nascer com teste de cenário feliz e cenários críticos.
- Toda correção de bug deve começar com teste que reproduz o bug.
- Nenhuma feature relevante pode ser concluída com lint, type-check, testes ou build quebrados.

## Contratos Entre Camadas
- `presentation` não acessa Supabase diretamente.
- `application` coordena casos de uso e depende de contratos, não de UI.
- `domain` não depende de Next.js, React ou Supabase.
- `infrastructure` implementa contratos técnicos e concentra integrações externas.

## Decisões Técnicas Já Tomadas
- Open Finance deve ser feito por provedores formais, como Pluggy ou Belvo, em fase posterior.
- MVP começa com lançamento manual e importação de extratos.
- IA inicial deve ser analítica e assistiva, sem execução financeira autônoma.
- A arquitetura deve ser pragmática, sem microserviços e sem abstrações prematuras.
- O projeto deve operar por fases `dia 0` a `dia 7`, sem salto de fase.
- A primeira small release funcional será cadastro manual de transação simples.
- O setup técnico executável com Next.js, Tailwind, Jest, Supabase clients e PWA é pré-requisito operacional do Dia 2 antes da criação dos testes.
- Features financeiras serão separadas por domínio (`accounts`, `credit-cards`, `transactions`, `budgets`, `goals`) para evitar uma feature genérica `finance` inchada.

## Features Planejadas
- Auth
- Contas financeiras
- Cartões de crédito
- Transações
- Parcelas
- Categorias
- Orçamento mensal
- Metas/envelopes
- Dashboard financeiro
- Relatórios
- Importação de extrato
- Análise financeira com IA
- Assinaturas e recorrências
- Calendário financeiro
- Open Finance

## Módulos do MVP

### Auth
Responsável por autenticação, leitura segura de sessão, proteção de rotas privadas e vínculo entre usuário e dados financeiros.

### Accounts
Responsável por contas financeiras manuais, saldo inicial, saldo atual calculado e conta usada para pagamento de faturas.

### Credit Cards
Responsável por cartões de crédito, limite, vencimento, fechamento, faturas e compras parceladas.

### Transactions
Responsável por receitas, despesas, transferências, transações no cartão e transações recorrentes.

### Budgets
Responsável por orçamento mensal por categoria, acompanhamento de consumo e alertas de estouro.

### Goals
Responsável por metas/envelopes como emergência, aluguel, dívidas, viagem e investimentos.

### Dashboard
Responsável por consolidar saldo real, gastos do mês, faturas, próximas contas e risco financeiro.

### Imports
Responsável por importação futura de CSV, OFX e extratos. Não deve integrar Open Finance no MVP inicial.

### AI Insights
Responsável por análises, explicações, categorizações sugeridas, simulações e planos financeiros. Não executa ações sensíveis.

## Domínio Inicial

Entidades iniciais:
- `UserProfile`
- `FinancialAccount`
- `CreditCard`
- `Category`
- `Transaction`
- `InstallmentPlan`
- `CreditCardInvoice`
- `Budget`
- `GoalEnvelope`
- `RecurringCommitment`

Value objects iniciais:
- `Money`
- `MonthRef`
- `DateRange`
- `DueDate`
- `TransactionType`
- `PaymentMethod`

Casos de uso candidatos:
- cadastrar conta financeira
- cadastrar categoria
- registrar transação manual
- listar resumo mensal
- calcular saldo disponível real
- registrar compra no cartão
- projetar parcelas futuras
- criar orçamento mensal por categoria
- simular compra futura
- gerar análise financeira textual

## Primeira Small Release Selecionada

Small release: cadastro manual de transação simples.

Escopo mínimo:
- criar transação de receita ou despesa
- validar descrição, valor, data, tipo, conta e categoria
- persistir por contrato de repositório
- permitir resumo mensal básico em caso de uso separado

Fora do escopo desta small release:
- cartão de crédito
- parcelas
- importação
- IA
- relatórios avançados
- Open Finance

Critério de pronto futuro:
- testes de domínio e aplicação criados no Dia 2
- implementação mínima no Dia 3
- UI essencial apenas depois de testes essenciais
- sem acesso direto da UI ao Supabase

## Dia 2 — Estratégia de Testes

Setup técnico criado:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Jest
- Testing Library
- Supabase clients isolados em `src/lib/supabase`
- PWA mínimo com manifest e ícone
- ESLint
- scripts de `test`, `test:ci`, `lint`, `type-check` e `build`

Testes essenciais criados:
- `src/features/transactions/tests/transaction.entity.test.ts`
- `src/features/transactions/tests/create-transaction.use-case.test.ts`

Resultado esperado do TDD:
- `npm run test:ci` falha porque `Transaction` e `CreateTransactionUseCase` ainda não existem.
- `npm run type-check` falha pelo mesmo motivo: módulos de implementação ainda ausentes.
- `npm run lint` passa.
- `npm audit` e `npm audit --omit=dev` passam com 0 vulnerabilidades.

Implementação bloqueada até o Dia 3:
- `src/features/transactions/domain/entities/transaction.entity.ts`
- `src/features/transactions/domain/interfaces/transaction.repository.ts`
- `src/features/transactions/application/use-cases/create-transaction.use-case.ts`

## Dia 3 — Implementação Mínima

Implementação criada:
- `src/features/transactions/domain/entities/transaction.entity.ts`
- `src/features/transactions/domain/interfaces/transaction.repository.ts`
- `src/features/transactions/application/use-cases/create-transaction.use-case.ts`

Escopo entregue:
- entidade `Transaction` com validação de usuário, conta, categoria, descrição, valor em centavos, tipo e data
- contrato `TransactionRepository`
- caso de uso `CreateTransactionUseCase` persistindo apenas por contrato injetado
- nenhum acesso direto da UI ao Supabase
- nenhuma migration real
- nenhuma expansão para cartão, parcelas, dashboard, IA, importação ou Open Finance

Resultado dos gates:
- `npm run test:ci`: passou, 2 suites e 11 testes
- `npm run type-check`: passou
- `npm run lint`: passou
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm audit`: passou, 0 vulnerabilidades
- `npm run build`: passou

Risco tratado:
- `.env.example` foi restaurado para placeholders após detecção de valores reais. Arquivos `.env` reais foram reforçados no `.gitignore`.

## Backlog Inicial de Alto Nível
- Dia 1: detalhar produto, domínio, módulos e contratos.
- Dia 2: definir matriz de testes e criar testes essenciais da primeira small release.
- Dia 3: implementar mínimo para satisfazer os testes da primeira small release.
- Dia 4: expandir estados de UI e validações.
- Dia 5: refatorar e endurecer estrutura interna.
- Dia 6: revisar UX, acessibilidade, responsividade e PWA.
- Dia 7: rodar quality gates, segurança básica, observabilidade e preparação de release.

## Restrições
- Não criar microserviços no MVP.
- Não acessar banco diretamente pela UI.
- Não usar API bancária não oficial.
- Não implementar feature sem teste essencial.
- Não expandir escopo fora do backlog.
- Não esconder dívida técnica fora da documentação.

## Checklists Técnicos
- Contexto central criado.
- Arquitetura documentada.
- Roadmap criado.
- Backlog inicial criado.
- Quality gates definidos.
- Workflows do Dia 0 ao Dia 7 criados.
- Catálogo mínimo de agents e skills criado.

## Erros Recorrentes da IA e Como Evitar
- Erro: implementar código funcional antes de testes. Prevenção: bloquear implementação até Dia 2 gerar testes essenciais.
- Erro: colocar regra de negócio em componente React. Prevenção: mover regra para `domain` ou `application`.
- Erro: acessar Supabase pela camada visual. Prevenção: usar repositórios em `infrastructure`.
- Erro: expandir escopo por conveniência. Prevenção: registrar item no backlog antes de executar.
- Erro: pular workflow de fase. Prevenção: consultar `project-context.md` e `.agents/workflows/dia-X-*.md` antes de executar comandos `dia X`.
- Erro: permitir segredo real em arquivo de exemplo. Prevenção: manter `.env.example` apenas com placeholders, ignorar `.env` reais e rotacionar credenciais se forem expostas.

## Pendências e Próximos Passos
- Dia 3 concluído com implementação mínima da criação manual de transação.
- Executar Dia 4 para expansão controlada da feature, incluindo composição inicial de UI e estados de interação quando aplicável.
- Manter fora do escopo imediato: cartão, parcelas, dashboard completo, IA, importação e Open Finance.
