# Project Context — Controle Financeiro IA

## Estado do Projeto
- Estado atual da máquina de estados: `IMPLEMENTATION_IN_PROGRESS`
- Fase atual: Dia 5 — Refatoração e hardening interno da SR-005 concluídos
- Data de bootstrap: 2026-07-08
- Data de discovery inicial: 2026-07-08
- Data de estratégia de testes inicial: 2026-07-08
- Data da implementação mínima inicial: 2026-07-08
- Data da expansão controlada inicial: 2026-07-08
- Data do hardening interno inicial: 2026-07-08
- Data da revisão de UX, acessibilidade e PWA inicial: 2026-07-08
- Data da validação final e preparação de release inicial: 2026-07-08
- Data da estratégia de testes da SR-005: 2026-07-09
- Data da implementação mínima da SR-005: 2026-07-09
- Data da expansão controlada da SR-005: 2026-07-09
- Data da refatoração e hardening interno da SR-005: 2026-07-09
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
- `domain`: entidades, value objects, tipos, contratos, schemas e regras puras.
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

## Próximo Ciclo Selecionado — SR-005 Resumo Mensal Básico

Small release selecionada: resumo mensal básico.

Motivo da escolha:
- é a próxima dependência lógica antes de dashboard financeiro inicial
- aproveita a feature de transações já criada
- entrega valor de produto sem antecipar Supabase Database, migrations ou RLS
- mantém o ciclo incremental dentro de TDD

Escopo mínimo:
- receber `userId` e `monthRef` no formato `YYYY-MM`
- buscar transações por contrato de repositório
- calcular receitas do mês em centavos
- calcular despesas do mês em centavos
- calcular saldo líquido do mês em centavos
- retornar quantidade de transações consideradas

Fora do escopo deste ciclo:
- migrations Supabase
- autenticação real
- persistência real
- dashboard completo
- gráficos
- cartões de crédito
- parcelas
- IA
- importação de extrato

Ordem de execução obrigatória:
1. Dia 2: criar testes essenciais de domínio/aplicação para o resumo mensal.
2. Dia 3: implementar o mínimo necessário para satisfazer os testes.
3. Dia 4: integrar ou expor o resumo na apresentação apenas se o caso de uso estiver estável.

Critérios de pronto planejados:
- cenário feliz com receita e despesa no mesmo mês testado
- mês sem transações testado
- `monthRef` inválido rejeitado
- `userId` vazio rejeitado
- transações fora do mês ignoradas
- valores calculados em centavos
- UI sem acesso direto ao Supabase
- nenhuma migration criada antes de autenticação, contas, categorias e RLS estarem prontos

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

## Dia 2 — Estratégia de Testes da SR-005

Small release: `SR-005 — Resumo mensal básico`.

Testes essenciais criados:
- `src/features/transactions/tests/month-ref.test.ts`
- `src/features/transactions/tests/list-monthly-summary.use-case.test.ts`

Cenários cobertos:
- `MonthRef` aceita `YYYY-MM` válido
- `MonthRef` normaliza espaços externos
- `MonthRef` rejeita formatos inválidos e meses fora de 1-12
- `ListMonthlySummaryUseCase` calcula receitas, despesas, saldo líquido e quantidade de transações
- mês sem transações retorna totais zerados
- `monthRef` inválido é rejeitado antes de consultar repositório
- `userId` vazio é rejeitado antes de consultar repositório
- transações fora do mês selecionado não compõem o resumo

Resultado esperado do TDD:
- `npm run test:ci -- src/features/transactions/tests/month-ref.test.ts src/features/transactions/tests/list-monthly-summary.use-case.test.ts`: falhou porque `MonthRef` e `ListMonthlySummaryUseCase` ainda não existem.
- `npm run type-check`: falhou com `TS2307` pelos mesmos módulos ausentes.

Implementação bloqueada até o Dia 3:
- `src/features/transactions/domain/value-objects/month-ref.ts`
- `src/features/transactions/application/use-cases/list-monthly-summary.use-case.ts`

Limites preservados:
- nenhuma migration Supabase criada
- nenhuma persistência real criada
- nenhuma UI nova criada
- nenhuma integração direta entre apresentação e banco

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

## Dia 3 — Implementação Mínima da SR-005

Small release: `SR-005 — Resumo mensal básico`.

Implementação criada:
- `src/features/transactions/domain/value-objects/month-ref.ts`
- `src/features/transactions/application/use-cases/list-monthly-summary.use-case.ts`

Escopo entregue:
- value object `MonthRef` validando `YYYY-MM`
- normalização de espaços externos em `monthRef`
- rejeição de mês inválido ou formato inválido
- caso de uso `ListMonthlySummaryUseCase`
- normalização e validação de `userId`
- busca de transações por `TransactionRepository.findByMonth`
- cálculo de receitas do mês em centavos
- cálculo de despesas do mês em centavos
- cálculo de saldo líquido em centavos
- contagem de transações consideradas
- filtro defensivo para ignorar transações fora do mês retornadas pelo repositório

Limites preservados:
- nenhuma migration Supabase criada
- nenhuma persistência real criada
- nenhuma UI nova criada
- nenhuma integração direta entre apresentação e banco
- dashboard completo, gráficos, cartões, parcelas, IA e importação continuam fora do escopo

Resultado dos gates:
- `npm run test:ci -- src/features/transactions/tests/month-ref.test.ts src/features/transactions/tests/list-monthly-summary.use-case.test.ts`: passou, 2 suites e 12 testes
- `npm run test:ci`: passou, 7 suites e 44 testes
- `npm run type-check`: passou
- `npm run lint`: passou
- `npm run build`: passou

## Dia 4 — Expansão Controlada da SR-005

Small release: `SR-005 — Resumo mensal básico`.

Implementação criada ou alterada:
- `src/features/transactions/application/use-cases/list-session-monthly-summary.use-case.ts`
- `src/features/transactions/presentation/components/MonthlySummaryPanel.tsx`
- `src/features/transactions/presentation/pages/TransactionsPage.tsx`
- `src/features/transactions/tests/TransactionsPage.test.tsx`

Escopo entregue:
- painel de resumo mensal visível na tela atual de transações
- cálculo do resumo alimentado pelo `ListMonthlySummaryUseCase`
- adapter local de sessão para converter transações locais em entidades de domínio
- estados de `loading`, `empty`, `success` e `error` no painel
- teste de apresentação cobrindo empty state e resumo com receita, despesa, saldo líquido e quantidade
- mês visível baseado na transação mais recente da sessão quando houver lançamentos

Limites preservados:
- nenhuma migration Supabase criada
- nenhuma persistência real criada
- nenhum repositório Supabase criado
- nenhuma integração direta entre apresentação e banco
- dashboard completo, gráficos, cartões, parcelas, IA e importação continuam fora do escopo

Resultado dos gates:
- `npm run test:ci -- src/features/transactions/tests/TransactionsPage.test.tsx`: passou, 1 suite e 2 testes
- `npm run test:ci`: passou, 7 suites e 45 testes
- `npm run type-check`: passou
- `npm run lint`: passou
- `npm run build`: passou

## Dia 5 — Refatoração e Hardening Interno da SR-005

Small release: `SR-005 — Resumo mensal básico`.

Arquivos inchados identificados:
- `TransactionsPage.tsx` estava com 165 linhas e misturava composição da página, efeito de resumo mensal, cálculo de mês visível, lista de sessão e formatação monetária.
- `MonthlySummaryPanel.tsx` estava aceitável, mas duplicava formatação monetária com a página.
- `list-session-monthly-summary.use-case.ts` permaneceu pequeno e com escopo claro como adapter local de sessão.

Plano de refatoração aplicado:
- extrair formatação monetária para utilitário de apresentação compartilhado
- extrair estado visual do resumo mensal para hook de apresentação
- extrair lista de lançamentos da sessão para componente dedicado
- manter o caso de uso de aplicação como fonte do cálculo financeiro
- preservar comportamento coberto pelos testes existentes

Implementação criada ou alterada:
- `src/features/transactions/presentation/utils/formatCents.ts`
- `src/features/transactions/presentation/hooks/useSessionMonthlySummary.ts`
- `src/features/transactions/presentation/components/TransactionSessionList.tsx`
- `src/features/transactions/presentation/components/MonthlySummaryPanel.tsx`
- `src/features/transactions/presentation/pages/TransactionsPage.tsx`

Resultado estrutural:
- `TransactionsPage.tsx` reduziu de 165 para 64 linhas
- lista de transações ficou isolada em `TransactionSessionList`
- estado assíncrono do resumo ficou isolado em `useSessionMonthlySummary`
- duplicação de `Intl.NumberFormat` foi removida da feature
- regras financeiras continuam fora da UI

Limites preservados:
- nenhuma migration Supabase criada
- nenhuma persistência real criada
- nenhum repositório Supabase criado
- nenhuma nova regra de negócio criada
- nenhuma integração direta entre apresentação e banco

Resultado dos gates:
- `npm run test:ci -- src/features/transactions/tests/TransactionsPage.test.tsx`: passou, 1 suite e 2 testes
- `npm run test:ci`: passou, 7 suites e 45 testes
- `npm run type-check`: passou
- `npm run lint`: passou
- `npm run build`: passou

## Dia 4 — Expansão Controlada

Implementação criada:
- `src/features/transactions/presentation/hooks/useTransactionForm.ts`
- `src/features/transactions/presentation/components/TransactionForm.tsx`
- `src/features/transactions/presentation/pages/TransactionsPage.tsx`
- `src/features/transactions/tests/TransactionForm.test.tsx`
- `src/app/page.tsx` como composição da página de entrada

Escopo entregue:
- formulário manual de transação com campos de descrição, valor, tipo, conta, categoria e data
- estados de `idle`, `loading`, `success` e `error`
- validação leve de apresentação para valor, descrição, conta, categoria e data
- conversão de valor em reais para centavos antes de chamar a camada superior
- rota inicial renderizando a experiência de transação manual
- lista local de transações da sessão, sem persistência real

Limites preservados:
- UI não acessa Supabase
- UI não cria repositório
- nenhuma migration real foi criada
- cartão, parcelas, dashboard completo, IA, importação e Open Finance permanecem fora do escopo

Resultado dos gates:
- `npm run test:ci`: passou, 3 suites e 15 testes
- `npm run type-check`: passou
- `npm run lint`: passou
- `npm audit`: passou, 0 vulnerabilidades
- `npm run build`: passou

## Dia 5 — Refatoração, Consistência e Hardening Interno

Arquivos inchados identificados:
- `TransactionForm.tsx` tem tamanho moderado, mas sem necessidade de extração estrutural ampla neste momento.
- `TransactionsPage.tsx` permanece aceitável para composição da tela inicial.
- `useTransactionForm.ts` concentrava parsing monetário junto do fluxo visual e foi reduzido.

Plano de refatoração aplicado:
- extrair parsing de valor monetário para utilitário de apresentação testável
- criar value object `Money` no domínio para validar centavos positivos
- normalizar identificadores e descrição na entidade `Transaction`
- validar `paymentMethod` na entidade `Transaction`
- preservar fluxo visual e contrato do caso de uso existente

Implementação criada ou alterada:
- `src/features/transactions/domain/value-objects/money.ts`
- `src/features/transactions/presentation/utils/parseTransactionAmountToCents.ts`
- `src/features/transactions/domain/entities/transaction.entity.ts`
- `src/features/transactions/presentation/hooks/useTransactionForm.ts`
- `src/features/transactions/tests/money.test.ts`
- `src/features/transactions/tests/TransactionForm.test.tsx`
- `src/features/transactions/tests/transaction.entity.test.ts`

Escopo entregue:
- validação de dinheiro em centavos isolada no domínio
- parsing de entrada monetária isolado da lógica do hook
- rejeição de entradas monetárias ambíguas com mais de duas casas decimais
- normalização de `userId`, `accountId`, `categoryId` e `description`
- rejeição de `paymentMethod` inválido em runtime

Limites preservados:
- nenhuma nova feature de negócio criada
- UI continua sem acesso ao Supabase
- caso de uso continua dependendo apenas do contrato de repositório
- nenhuma migration real foi criada
- cartão, parcelas, dashboard completo, IA, importação e Open Finance permanecem fora do escopo

Resultado dos gates:
- `npm run test:ci`: passou, 4 suites e 30 testes
- `npm run type-check`: passou
- `npm run lint`: passou
- `npm audit`: passou, 0 vulnerabilidades
- `npm run build`: passou

## Dia 6 — Experiência, Acessibilidade e PWA

Melhorias aplicadas:
- labels da interface revisados para português correto com acentuação
- formulário recebeu nome acessível via `aria-label`
- formulário expõe `aria-busy` durante envio
- campos obrigatórios receberam `required`
- campos com erro recebem `aria-invalid`
- campo de valor recebeu descrição acessível com formato esperado
- mensagens de sucesso e erro usam `role="status"` e `role="alert"`
- seção de lançamentos recebeu região acessível nomeada
- empty state recebeu `role="status"`
- foco visível reforçado em campos e botão
- layout refinado para mobile first, com largura estável e sem depender de textos grandes
- lista de transações ajustada para quebrar melhor em telas pequenas
- metadata PWA ampliada com app name, ícones e viewport theme color
- manifest PWA ampliado com `id`, `scope`, `display_override`, `orientation`, categorias e `prefer_related_applications`

Implementação criada ou alterada:
- `src/features/transactions/presentation/components/TransactionForm.tsx`
- `src/features/transactions/presentation/hooks/useTransactionForm.ts`
- `src/features/transactions/presentation/pages/TransactionsPage.tsx`
- `src/features/transactions/tests/TransactionForm.test.tsx`
- `src/features/transactions/tests/TransactionsPage.test.tsx`
- `src/app/layout.tsx`
- `public/manifest.webmanifest`
- `tests/setupTests.ts`

Validação de acessibilidade mínima:
- testes de apresentação cobrem nome acessível do formulário
- testes cobrem campos obrigatórios
- testes cobrem descrição acessível do campo de valor
- testes cobrem erro por campo com `aria-invalid`
- testes cobrem landmarks da página e região de lançamentos

Validação PWA:
- `public/manifest.webmanifest` servido localmente com status 200
- rota `/` servida localmente com status 200
- offline não foi prometido nem implementado nesta fase

Limitação registrada:
- a tentativa de verificação interativa pelo navegador integrado travou em timeout ao navegar para `localhost`; a validação visual foi substituída por testes automatizados, build e verificação HTTP local.

Resultado dos gates:
- `npm run test:ci`: passou, 5 suites e 32 testes
- `npm run type-check`: passou
- `npm run lint`: passou
- `npm audit`: passou, 0 vulnerabilidades
- `npm run build`: passou

## Dia 7 — Qualidade Final, Segurança, Observabilidade e Entrega

Pipeline final executado:
- `npm run test:ci`: passou, 5 suites e 32 testes
- `npm run type-check`: passou
- `npm run lint`: passou
- `npm audit`: passou, 0 vulnerabilidades
- `npm run build`: passou

Revisão básica de segurança:
- somente `.env.example` está versionado entre os arquivos de ambiente
- `.env`, `.env.local`, `.env.production` e `.env.development` estão ignorados pelo Git
- `.env.example` contém placeholders vazios
- nenhum acesso Supabase foi encontrado em `src/features/transactions/presentation` ou `src/app`
- nenhum uso de `any` foi encontrado em `src` ou `tests`
- nenhum segredo real foi identificado nos arquivos versionáveis verificados; o único match sensível é `SUPABASE_SERVICE_ROLE_KEY=` vazio em `.env.example`
- clients Supabase usam `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`; `service role` não é usado no código

Riscos residuais documentados:
- autenticação real, autorização e RLS ainda não foram implementados para dados financeiros reais
- fluxo atual usa dados demo/locais de sessão e não deve ser tratado como produção com usuários reais
- observabilidade de runtime ainda não possui ferramenta externa dedicada
- deploy real não foi executado nesta fase

Baseline de observabilidade:
- logs de build, lint, type-check, testes e audit são a evidência mínima de release
- falhas de ambiente Supabase disparam erro explícito de variável ausente
- próximos ciclos devem adicionar captura estruturada de erros de UI e eventos mínimos de produto quando houver persistência real
- eventos candidatos futuros: `transaction_create_attempt`, `transaction_create_success`, `transaction_create_failure`

Preparação de release incremental:
- release candidata: cadastro manual de transação simples com UI acessível, sem persistência real
- escopo liberável: fluxo local de registro manual, validações, estados de formulário e lista da sessão
- fora da release: autenticação real, RLS, persistência real, contas reais, dashboard completo, IA, importação e Open Finance
- estado final: `READY_FOR_RELEASE`

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
- Hardening interno do Dia 5 concluído com gates verdes.
- Revisão de UX, acessibilidade e PWA do Dia 6 concluída com gates verdes.
- Validação final do Dia 7 concluída com pipeline verde.

## Erros Recorrentes da IA e Como Evitar
- Erro: implementar código funcional antes de testes. Prevenção: bloquear implementação até Dia 2 gerar testes essenciais.
- Erro: colocar regra de negócio em componente React. Prevenção: mover regra para `domain` ou `application`.
- Erro: acessar Supabase pela camada visual. Prevenção: usar repositórios em `infrastructure`.
- Erro: expandir escopo por conveniência. Prevenção: registrar item no backlog antes de executar.
- Erro: pular workflow de fase. Prevenção: consultar `project-context.md` e `.agents/workflows/dia-X-*.md` antes de executar comandos `dia X`.
- Erro: permitir segredo real em arquivo de exemplo. Prevenção: manter `.env.example` apenas com placeholders, ignorar `.env` reais e rotacionar credenciais se forem expostas.

## Pendências e Próximos Passos
- Dia 5 da `SR-005 — Resumo mensal básico` concluído com refatoração interna, responsabilidades mais claras e gates verdes.
- Próximo passo recomendado: executar Dia 6 para revisar experiência, acessibilidade, responsividade e PWA.
- Manter fora do escopo imediato: cartão, parcelas, dashboard completo, IA, importação e Open Finance.
