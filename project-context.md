# Project Context — FinControl

## Estado do Projeto
- Estado atual da máquina de estados: `IMPLEMENTATION_IN_PROGRESS`
- Fase atual: Dia 3 da SR-010 concluído; implementação mínima, migration e RLS de categorias validadas
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
- Data da revisão de UX, acessibilidade e PWA da SR-005: 2026-07-09
- Data da validação final e entrega da SR-005: 2026-07-10
- Data do discovery da SR-006: 2026-07-10
- Data da estratégia de testes da SR-006: 2026-07-10
- Data da implementação mínima da SR-006: 2026-07-10
- Data da expansão controlada da SR-006: 2026-07-10
- Data da refatoração e hardening interno da SR-006: 2026-07-10
- Data da revisão de UX, acessibilidade e PWA da SR-006: 2026-07-10
- Data da validação final e preparação de release da SR-006: 2026-07-11
- Data do discovery e arquitetura da SR-007: 2026-07-11
- Data da estratégia de testes da SR-007: 2026-07-11
- Data da implementação mínima da SR-007: 2026-07-11
- Data da expansão controlada da SR-007: 2026-07-11
- Data da refatoração e hardening interno da SR-007: 2026-07-11
- Data da revisão de UX, acessibilidade e PWA da SR-007: 2026-07-12
- Data da validação final e preparação de release da SR-007: 2026-07-12
- Data do discovery e arquitetura da SR-008: 2026-07-12
- Data da estratégia de testes da SR-008: 2026-07-12
- Data da implementação mínima da SR-008: 2026-07-12
- Data da expansão controlada da SR-008: 2026-07-13
- Data do hardening interno da SR-008: 2026-07-13
- Data da revisão de UX, acessibilidade e PWA da SR-008: 2026-07-14
- Data da validação final e preparação de release da SR-008: 2026-07-14
- Data do discovery e arquitetura da SR-009: 2026-07-14
- Data da estratégia de testes da SR-009: 2026-07-14
- Data da implementação mínima da SR-009: 2026-07-14
- Data da expansão controlada da SR-009: 2026-07-14
- Data do hardening interno da SR-009: 2026-07-14
- Data da revisão de UX, acessibilidade e PWA da SR-009: 2026-07-14
- Data da validação final e preparação de release da SR-009: 2026-07-14
- Data de incorporação da proposta FinControl Pulse: 2026-07-14
- Data do discovery e arquitetura da UI-001: 2026-07-14
- Data da estratégia de testes da UI-001: 2026-07-14
- Data da implementação mínima da UI-001: 2026-07-14
- Data da expansão controlada da UI-001: 2026-07-15
- Data do hardening interno da UI-001: 2026-07-15
- Data da revisão de UX, acessibilidade e PWA da UI-001: 2026-07-15
- Data da validação final e preparação de release da UI-001: 2026-07-15
- Data do discovery e arquitetura da UI-002: 2026-07-16
- Data da estratégia de testes da UI-002: 2026-07-16
- Data da implementação mínima da UI-002: 2026-07-16
- Data da expansão controlada da UI-002: 2026-07-16
- Data da refatoração e hardening da UI-002: 2026-07-16
- Data da revisão de UX, acessibilidade e PWA da UI-002: 2026-07-16
- Data da validação final e preparação de release da UI-002: 2026-07-16
- Data do discovery e arquitetura da SR-010: 2026-07-16
- Data da estratégia de testes da SR-010: 2026-07-16
- Data da implementação mínima da SR-010: 2026-07-16
- Fonte inicial de produto: pesquisa comparativa de apps financeiros brasileiros e internacionais fornecida pelo usuário
- Fonte visual e editorial: proposta “Interface gráfica para FinControl” anexada e conversa referenciada pelo usuário

## Visão do Produto
FinControl é um aplicativo financeiro pessoal brasileiro, planejado para explicar o dinheiro do usuário, prever riscos financeiros e orientar decisões antes que problemas aconteçam. Recursos de IA permanecem futuros até a SR-023.

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
  supabase/
    migrations/
    tests/
      database/
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

## Convenções Git

### Branches
- `main` — produção estável, protegida
- `develop` — integração contínua, recebe squash merges das features
- `feature/<ID>-<desc>` — criada de `develop`, merge de volta com `--squash`
- `fix/<ID>-<desc>` — criada de `develop`, merge com `--squash`
- `hotfix/<ID>-<desc>` — criada de `main`, merge com `--no-ff` para `main` + `develop`

### Commits
- Formato: `<tipo>(<escopo>): <descrição> | Dia <N> <ID>`
- Tipos: `feat`, `fix`, `test`, `refactor`, `chore`, `docs`, `style`, `ci`, `perf`, `security`
- Escopos por domínio: `project`, `auth`, `accounts`, `transactions`, `dashboard`, `ui`, `shell`, `categories`, `analytics`, `goals`, `gamification`
- Template local configurado em `.gitmessage`
- Exemplo: `feat(accounts): implementar listagem por usuário | Dia 3 SR-009`

### Merge
- Feature → develop: `git merge --squash` (1 commit limpo por feature)
- develop → main: `git merge --no-ff` (merge commit preservando ponto de release)
- Tags: Semantic Versioning `vMAJOR.MINOR.PATCH`

### Documentação
- Fluxo completo em `docs/git-workflow.md`

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
- Analytics avancados dependem de autenticacao, RLS e persistencia real.
- Frequencia automatica inicial usa `k = ceil(sqrt(n))`, conforme o PDF analisado.
- Medidas calculadas sobre classes sao estimativas agrupadas.
- Frequencia e opcional e desligada por padrao na primeira versao.
- Grafico de linha precede candles; biblioteca de grafico depende de spike e adapter.
- Metas precedem gamificacao; desafios por frequencia dependem de ambos.
- Gamificacao nao pode incentivar gasto, culpa, risco ou ranking publico por patrimonio.
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
- Evolucao financeira semanal, quinzenal, mensal e personalizada
- Candles financeiros de saldo
- Distribuicao de frequencia continua
- Gamificacao de metas e habitos financeiros

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

## Dia 6 — Experiência, Acessibilidade e PWA da SR-005

Small release: `SR-005 — Resumo mensal básico`.

Melhorias aplicadas:
- tipo da transação trocado de `select` para controle segmentado com radios nativos acessíveis
- regiões de resumo mensal e lançamentos da sessão passaram a usar `aria-live="polite"`
- painel de resumo mensal expõe `aria-busy` durante cálculo
- métricas do resumo mensal receberam `role="group"` com nome acessível contendo rótulo e valor
- lista de lançamentos recebeu `aria-relevant="additions text"` para anunciar novas transações
- descrições longas de lançamentos agora quebram linha para reduzir risco de overflow em mobile
- manifest PWA recebeu shortcut para abrir o fluxo de registro manual de transação

Testes criados ou alterados:
- `src/features/transactions/tests/TransactionForm.test.tsx`
- `src/features/transactions/tests/TransactionsPage.test.tsx`
- `tests/pwa-manifest.test.ts`

Limites preservados:
- nenhuma migration Supabase criada
- nenhuma persistência real criada
- nenhuma autenticação real criada
- nenhum repositório Supabase criado
- nenhuma nova regra financeira criada
- nenhuma promessa de offline sem estratégia real
- dashboard completo, gráficos, cartões, parcelas, IA e importação continuam fora do escopo

Resultado TDD:
- `npm run test:ci -- src/features/transactions/tests/TransactionForm.test.tsx src/features/transactions/tests/TransactionsPage.test.tsx tests/pwa-manifest.test.ts`: falhou antes da implementação porque radios, `aria-live`, grupos de métricas e shortcut PWA ainda não existiam.
- Após implementação, o mesmo recorte passou com 3 suites e 16 testes.

Resultado dos gates:
- `npm run test:ci`: passou, 8 suites e 46 testes
- `npm run type-check`: passou
- `npm run lint`: passou
- `npm audit`: passou, 0 vulnerabilidades
- `npm run build`: passou

Estado de saída:
- projeto preparado para `QUALITY_VALIDATION`
- próximo passo recomendado: executar Dia 7 da SR-005 para validar testes, type-check, lint, build, segurança básica e readiness de release

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

## Expansao Planejada - Analytics Financeiros e Gamificacao

Data: 2026-07-11.

Fontes analisadas:
- conversas fornecidas pelo usuario
- `contexto-codex-novas-ideias-financeiras-2.md`
- PDF `1783573359393.pdf` com exemplo de distribuicao continua

Artefatos:
- `docs/product/advanced-financial-analytics-gamification.md`
- `adr/0002-advanced-financial-analytics-sequence.md`

Decisoes:
- features novas: `financial-analytics` e `gamification`
- contas, autenticacao, RLS, categorias e transacoes persistidas precedem analytics de producao
- periodos distinguem semana/ultimos 7 dias e quinzena/ultimos 15 dias
- classes iniciais usam raiz quadrada, intervalos em centavos e ultimo limite inclusivo
- media, mediana e moda agrupadas sao estimativas, nao substitutos silenciosos das medidas exatas
- linha precede candles; frequencia precede gamificacao baseada em frequencia
- IA entra por ultimo, com consentimento e minimizacao

Sequencia aprovada:
1. SR-007 a SR-011 - fundacao de dados reais
2. SR-012 a SR-014 - periodos, agregacao e linha
3. SR-015 - candles
4. SR-016 e SR-017 - frequencia
5. SR-018 a SR-022 - metas e gamificacao
6. SR-023 - IA

Regra operacional:
- cada SR percorre integralmente Dias 1 a 7
- nenhuma implementacao funcional foi autorizada nesta analise
- SR-007 foi selecionada e teve o Dia 1 concluído; o próximo comando válido é `dia 2`

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
- Revisão de UX, acessibilidade e PWA do Dia 6 da SR-005 concluída com testes direcionados verdes.
- Revisão de UX, acessibilidade e PWA do Dia 6 da SR-006 concluída com pipeline verde.
- Validação final do Dia 7 da SR-006 concluída com pipeline verde e CI versionado.
- Validação final do Dia 7 concluída com pipeline verde.
- Validação final do Dia 7 da SR-005 concluída com pipeline verde.

## Erros Recorrentes da IA e Como Evitar
- Erro: implementar código funcional antes de testes. Prevenção: bloquear implementação até Dia 2 gerar testes essenciais.
- Erro: o workflow Git passou a direcionar features para `develop`, mas o CI permaneceu limitado a `main`, permitindo merge de integração sem gates automáticos. Prevenção: toda mudança na estratégia de branches deve atualizar e testar os gatilhos de CI para branches de integração e release na mesma entrega.
- Erro: o mock de `signOut` adicionado no Dia 4 da UI-002 foi inferido sem parâmetros, gerando `TS2554` quando o teste verificou `{ scope: "local" }`. Prevenção: tipar mocks de integrações pela assinatura real antes do primeiro type-check e incluir explicitamente os argumentos relevantes no fake, mesmo quando o corpo não os utiliza.
- Erro: passar um route group com parênteses como filtro posicional do Jest resultou em `No tests found`, sem executar os contratos da UI-002. Prevenção: para testes dentro de `src/app/(grupo)`, usar `npx jest --runInBand --runTestsByPath` com caminhos literais e confirmar a lista de suítes executadas.
- Erro: importar `PrivateAppShell` estaticamente antes do mock de `next/navigation` fez o transformador Next/Jest carregar o hook real e falhar por ausência do App Router. Prevenção: registrar o mock antes do carregamento e obter o módulo com `jest.requireActual()` quando a ordem de avaliação fizer parte do harness.
- Erro: a seção de pendências manteve o Dia 4 da UI-001 como próximo passo depois de a UI-001 já ter concluído o Dia 7. Prevenção: ao encerrar qualquer fase, validar em conjunto o estado no topo, a seção de pendências, o backlog e o roadmap; nenhuma referência histórica pode permanecer redigida como instrução operacional atual.
- Erro: colocar regra de negócio em componente React. Prevenção: mover regra para `domain` ou `application`.
- Erro: acessar Supabase pela camada visual. Prevenção: usar repositórios em `infrastructure`.
- Erro: expandir escopo por conveniência. Prevenção: registrar item no backlog antes de executar.
- Erro: pular workflow de fase. Prevenção: consultar `project-context.md` e `.agents/workflows/dia-X-*.md` antes de executar comandos `dia X`.
- Erro: no Dia 4 da UI-001, o seletor de tema foi inicialmente inserido em `PrivateAppShell`, embora alterações de shell estivessem reservadas à UI-002. Prevenção: conferir também os gates específicos da small release antes de escolher a superfície de integração; a correção deve manter o shell intacto e expor o seletor em uma superfície já pertencente ao recorte visual.
- Erro: o matcher do Proxy interceptava `public/theme-init.js`, redirecionava a requisição anônima para `/login` e entregava HTML como JavaScript, impedindo a inicialização do tema. Prevenção: todo asset público executável referenciado antes da hidratação deve ter teste de matcher e verificação HTTP de status e `Content-Type`; o Proxy deve excluir scripts públicos sem ampliar o acesso às rotas privadas.
- Erro: permitir segredo real em arquivo de exemplo. Prevenção: manter `.env.example` apenas com placeholders, ignorar `.env` reais e rotacionar credenciais se forem expostas.
- Erro: criar `proxy.ts` na raiz em um projeto cujo App Router está em `src/app`; o build passou, mas não declarou o Proxy. Prevenção: manter `src/proxy.ts` no mesmo nível de `src/app` e exigir `ƒ Proxy (Middleware)` na saída de `next build`; o `middleware-manifest.json` legado pode permanecer vazio no Turbopack.
- Erro: uma `NEXT_PUBLIC_SUPABASE_URL` malformada fez a criação do client SSR lançar uma exceção no Proxy e derrubou toda a navegação com o overlay `Invalid supabaseUrl`. Prevenção: validar a configuração sem registrar valores sensíveis, cobrir falhas de inicialização e de leitura de claims com testes e fazer a proteção de rotas falhar de forma fechada — rota privada redireciona para `/login` e `/login` permanece acessível.
- Erro: um exemplo de Project URL com `<project-ref>` foi copiado literalmente para `.env.local`. Prevenção: exemplos devem declarar que marcadores precisam ser substituídos, a documentação deve preferir um hostname ilustrativo sem `<` e `>`, e a validação externa deve conferir o endpoint Auth antes de encerrar a fase.
- Erro: mocks Jest sem assinatura explícita foram inferidos como funções sem argumentos e criaram ruído no primeiro type-check do Dia 2 da SR-009. Prevenção: tipar estruturalmente os fakes de infraestrutura para que o RED contenha somente ausências funcionais planejadas.
- Erro: o teste inicial da Server Action da SR-009 assumiu que `jest.mock()` seria elevado acima de imports estáticos pelo transformador Next/Jest; após a implementação, o módulo real foi carregado e o mock não era uma função Jest. Prevenção: em testes de módulos Next com esse transformador, registrar os mocks antes do carregamento e usar `jest.requireMock()`/`jest.requireActual()` quando a ordem de avaliação fizer parte do isolamento; preservar as mesmas expectativas funcionais e registrar a correção do harness antes de continuar.
- Erro: mocks de callbacks do Dia 4 da SR-009 foram inicialmente inferidos com assinatura estreita e um destructuring de mock não utilizado gerou ruído no primeiro type-check/lint. Prevenção: tipar callbacks de apresentação pelo contrato real antes do GREEN e remover bindings de teste não consumidos antes dos gates completos.
- Erro: a referência visual inicial aprovou `#64748B` para texto secundário claro, mas o teste de contraste mediu 4,476:1 sobre `#F6F8FC`, abaixo de WCAG AA. Prevenção: tratar valores de paleta como candidatos até o teste da combinação real; o token foi corrigido para `#5F6F85`, com aproximadamente 4,818:1, sem reduzir o gate de 4,5:1.

## Dia 7 — Qualidade Final, Segurança, Observabilidade e Entrega da SR-005

Small release: `SR-005 — Resumo mensal básico`.

Pipeline final executado:
- `npm run test:ci`: passou, 8 suites e 46 testes
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou

Revisão básica de segurança:
- somente `.env.example` está versionado entre os arquivos de ambiente
- `.env`, `.env.local`, `.env.production`, `.env.development` e variantes estão ignorados pelo Git
- `.env.example` contém apenas placeholders vazios
- nenhum acesso Supabase encontrado em `src/features/transactions/presentation` ou `src/app`
- nenhum uso de `any` encontrado em `src` ou `tests`
- nenhum segredo real identificado nos arquivos versionáveis verificados
- clients Supabase usam `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`; `service role` não é usado no código

Cobertura de testes por camada:
- domain: `Transaction`, `Money`, `MonthRef` — 3 suites
- application: `CreateTransactionUseCase`, `ListMonthlySummaryUseCase` — 2 suites
- presentation: `TransactionForm`, `TransactionsPage` — 2 suites
- infraestrutura PWA: `pwa-manifest` — 1 suite
- total: 8 suites, 46 testes

Riscos residuais documentados:
- autenticação real, autorização e RLS ainda não foram implementados para dados financeiros reais
- fluxo atual usa dados demo/locais de sessão e não deve ser tratado como produção com usuários reais
- observabilidade de runtime ainda não possui ferramenta externa dedicada
- deploy real não foi executado nesta fase

Baseline de observabilidade:
- logs de build, lint, type-check, testes e audit são a evidência mínima de release
- falhas de ambiente Supabase disparam erro explícito de variável ausente
- próximos ciclos devem adicionar captura estruturada de erros de UI e eventos mínimos de produto quando houver persistência real
- eventos candidatos futuros: `monthly_summary_view`, `monthly_summary_empty_state`

Preparação de release incremental:
- release candidata: resumo mensal básico com painel visual, integrado à tela de transações
- escopo liberável: cálculo de receitas, despesas, saldo líquido e contagem de transações por mês; painel visual com estados de loading, empty, success e error; UX acessível com aria-live, radios nativos e landmarks
- fora da release: autenticação real, RLS, persistência real, dashboard completo, gráficos, cartões, parcelas, IA, importação e Open Finance
- estado final: `READY_FOR_RELEASE`

## Dia 1 — Discovery e Contexto da SR-006

Small release: `SR-006 — Dashboard financeiro inicial`.

Visão:
- o dashboard é a primeira tela útil do produto
- responde "quanto eu tenho?", "para onde vai meu dinheiro?" e "o que aconteceu recentemente?"
- opera com dados locais de sessão neste recorte

Escopo mínimo:
- painel de resumo mensal reutilizando `ListMonthlySummaryUseCase` via adapter de sessão
- lista resumida das 5 últimas transações registradas na sessão
- empty state com call-to-action para registrar primeira transação
- navegação mínima entre dashboard e registro de transação
- rota `/dashboard` dedicada
- rota `/` renderiza o dashboard como tela de entrada do produto
- rota `/transactions` para a página de registro de transações

Fora do escopo:
- gráficos e visualizações avançadas
- saldo por conta
- faturas e cartões
- orçamento mensal visual
- alertas de estouro e risco financeiro
- IA e insights
- persistência real e migrations Supabase
- autenticação real
- importação de extrato
- navegação por mês (seletor de período)

Decisões arquiteturais:
- feature `dashboard/` dedicada em `src/features/dashboard/`
- reuso do caso de uso `ListMonthlySummaryUseCase` sem duplicar lógica financeira
- `formatCents` movido para `src/shared/utils/formatCents.ts` para compartilhamento entre features
- caso de uso `GetDashboardSummaryUseCase` orquestra resumo mensal + transações recentes
- dashboard não acessa repositórios diretamente
- dashboard não introduz novas entidades de domínio nesta SR

Contratos entre camadas:
- domain: consome tipos existentes de transactions (`MonthlySummary`, `CreateTransactionInput`)
- application: `GetDashboardSummaryUseCase` retorna `DashboardSummary` com resumo mensal e transações recentes
- presentation: `DashboardPage`, `DashboardSummaryPanel`, `RecentTransactionsList`, `DashboardEmptyState`, `useDashboardSummary`
- infrastructure: nenhuma infraestrutura nova nesta SR

Critérios de pronto planejados:
- caso de uso testado com TDD (cenário feliz, sem transações, userId vazio, monthRef inválido)
- componente de dashboard renderiza empty state e estado com dados
- `formatCents` em shared sem quebrar testes existentes
- rotas `/dashboard` e `/transactions` funcionais
- navegação mínima entre as duas telas
- nenhum acesso Supabase na apresentação
- pipeline verde

## Dia 2 — Estratégia de Testes da SR-006

Small release: `SR-006 — Dashboard financeiro inicial`.

Testes essenciais criados:
- `src/features/dashboard/tests/get-dashboard-summary.use-case.test.ts`
- `src/features/dashboard/tests/DashboardPage.test.tsx`

Cenários cobertos pelo caso de uso:
- cenário feliz com receita e despesa: resumo mensal correto e transações recentes retornadas
- limite de transações recentes respeitado (máximo 5)
- transações recentes ordenadas da mais recente para a mais antiga
- mês sem transações retorna resumo zerado e lista vazia
- `userId` vazio rejeitado com `user is required`
- `monthRef` inválido rejeitado com `monthRef is invalid`
- resumo mensal considera apenas transações do mês selecionado
- transações recentes incluem todas as transações da sessão independentemente do mês

Cenários cobertos pela apresentação:
- heading do dashboard visível
- empty state renderizado quando não há transações
- link CTA para `/transactions` presente
- landmark `main` presente

Resultado esperado do TDD:
- `npm run test:ci -- src/features/dashboard/tests`: falhou com `Cannot find module` porque `GetDashboardSummaryUseCase` e `DashboardPage` ainda não existem.
- testes existentes (8 suítes, 46 testes) continuam passando.

Implementação bloqueada até o Dia 3:
- `src/features/dashboard/application/use-cases/get-dashboard-summary.use-case.ts`
- `src/features/dashboard/presentation/pages/DashboardPage.tsx`
- `src/features/dashboard/presentation/components/DashboardEmptyState.tsx`
- `src/features/dashboard/presentation/components/RecentTransactionsList.tsx`
- `src/shared/utils/formatCents.ts`

Limites preservados:
- nenhuma implementação funcional criada
- nenhuma UI nova criada
- nenhuma rota nova criada
- nenhuma migration Supabase criada
- nenhuma persistência real criada

## Validação Formal do Dia 2 — SR-006

Resultado da auditoria:
- commit `0952a70` contém os dois arquivos de teste da SR-006 e não contém implementação do dashboard, comprovando testes antes do código funcional
- matriz por camada, cenário feliz, cenários alternativos e edge cases foram registrados em `test-strategy.md`
- import não utilizado removido do teste de aplicação para corrigir o único warning de lint encontrado
- suíte anterior passou com 8 suites e 46 testes
- testes do dashboard passaram no worktree atual com 2 suites e 12 testes porque existem arquivos não rastreados antecipando o Dia 3; a evidência histórica da etapa vermelha permanece no commit do Dia 2
- `npm run lint` passou sem warnings
- `npm audit --omit=dev` passou com 0 vulnerabilidades

Estado de saída confirmado:
- `TEST_STRATEGY_READY`
- Dia 2 da SR-006 concluído
- implementação funcional permanece condicionada ao workflow e à aprovação do Dia 3

## Dia 3 — Implementação Mínima da SR-006

Small release: `SR-006 — Dashboard financeiro inicial`.

Implementação criada ou revisada:
- `src/features/dashboard/application/use-cases/get-dashboard-summary.use-case.ts`
- `src/features/dashboard/presentation/components/DashboardEmptyState.tsx`
- `src/features/dashboard/presentation/pages/DashboardPage.tsx`
- `src/features/dashboard/tests/get-dashboard-summary.use-case.test.ts`
- `src/features/dashboard/tests/DashboardPage.test.tsx`

Escopo entregue:
- `GetDashboardSummaryUseCase` reutiliza `listSessionMonthlySummary` sem conhecer repositório ou duplicar cálculo financeiro
- `userId` é normalizado e obrigatório
- resumo mensal permanece delegado aos casos de uso de `transactions`
- transações recentes são isoladas pelo usuário solicitado, ordenadas da mais recente para a mais antiga e limitadas a cinco
- `DashboardPage` e `DashboardEmptyState` implementam a apresentação mínima coberta pelos testes
- empty state mantém CTA para o futuro fluxo `/transactions`

Resultado TDD:
- novo teste de isolamento por usuário falhou inicialmente porque uma transação de outro usuário aparecia na lista de recentes
- após a correção, os testes do dashboard passaram com 2 suites e 13 testes
- suíte completa passou com 10 suites e 59 testes

Correção de gate:
- `npm run type-check` identificou globais Jest implícitos nos dois testes novos
- os testes foram alinhados ao padrão local com imports de `@jest/globals`
- `npm run type-check` passou após a correção

Resultado dos gates:
- `npm run test:ci`: passou, 10 suites e 59 testes
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou

Limites preservados:
- nenhuma migration Supabase criada
- nenhuma persistência real criada
- nenhuma autenticação ou RLS criada
- nenhum acesso a repositório ou Supabase dentro de `dashboard`
- rotas dedicadas, lista visual de recentes, painel com dados e estados adicionais permanecem para expansão controlada no Dia 4

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- próximo passo recomendado: executar Dia 4 da SR-006

## Dia 4 — Expansão Controlada da SR-006

Small release: `SR-006 — Dashboard financeiro inicial`.

Implementação criada ou alterada:
- `src/features/transactions/presentation/providers/TransactionSessionProvider.tsx`
- `src/features/dashboard/presentation/hooks/useDashboardSummary.ts`
- `src/features/dashboard/presentation/components/DashboardSummaryPanel.tsx`
- `src/features/dashboard/presentation/components/RecentTransactionsList.tsx`
- `src/features/dashboard/presentation/pages/DashboardPage.tsx`
- `src/features/transactions/presentation/pages/TransactionsPage.tsx`
- `src/shared/utils/formatCents.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/transactions/page.tsx`

Escopo entregue:
- provider mantém transações somente em memória durante a navegação sob o layout raiz
- `TransactionsPage` e `DashboardPage` consomem a mesma sessão sem persistência real
- dashboard implementa estados de loading, empty, success e error
- painel mensal exibe receitas, despesas, saldo líquido e quantidade de transações
- lista exibe até cinco transações recentes ordenadas pelo caso de uso
- rota `/` renderiza o dashboard
- rota `/dashboard` oferece endereço dedicado para o dashboard
- rota `/transactions` renderiza o registro manual
- navegação mínima entre dashboard e transações implementada com links do App Router
- `formatCents` movido para `src/shared/utils` para uso entre features

Resultado TDD:
- etapa vermelha: 4 suites falharam pela ausência do provider e das novas rotas
- etapa verde direcionada: 5 suites e 21 testes passaram após a implementação
- suíte completa: 12 suites e 65 testes passaram

Correção de gate:
- lint identificou atualização síncrona de estado dentro de `useEffect` em `useDashboardSummary`
- loading passou a ser derivado pela identidade da requisição, mantendo atualizações de estado apenas nas respostas assíncronas
- testes do dashboard e lint passaram após a correção

Validação local:
- `/`, `/dashboard` e `/transactions` responderam com HTTP 200
- dashboard e formulário foram inspecionados no navegador integrado em desktop e mobile
- viewport de 390px e desktop de 1280px não apresentaram overflow horizontal
- nenhum erro de console foi encontrado em `/dashboard`
- a automação do navegador integrado não conseguiu preencher o campo nativo `input[type=date]`; por isso, o submit completo e a persistência entre rotas foram validados pelos testes automatizados, não pela interação no navegador

Resultado dos gates:
- `npm run test:ci`: passou, 12 suites e 65 testes
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou com as rotas `/`, `/dashboard` e `/transactions`

Limites preservados:
- estado existe apenas em memória e é reiniciado ao recarregar a aplicação
- nenhuma migration Supabase criada
- nenhuma persistência real criada
- nenhuma autenticação ou RLS criada
- nenhum gráfico, cartão, parcela, IA, importação ou Open Finance criado

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- próximo passo recomendado: executar Dia 5 da SR-006

## Dia 5 — Refatoração e Hardening Interno da SR-006

Small release: `SR-006 — Dashboard financeiro inicial`.

Diagnóstico estrutural:
- nenhum arquivo de produção do dashboard ultrapassava 100 linhas; `useDashboardSummary.ts` era o maior, com 97 linhas
- resolução da competência mensal estava duplicada e tinha comportamento diferente entre os hooks de dashboard e transações
- `formatMonthRef` estava duplicado nos dois painéis mensais
- formatadores `Intl` eram recriados a cada chamada/renderização
- o provider armazenava referências externas mutáveis de transação
- `TransactionForm.tsx` permanece com 255 linhas, mas pertence ao fluxo anterior e não apresentou duplicação ou regressão ligada à SR-006; não foi refatorado neste ciclo

Plano aplicado:
- extrair resolução de competência para utilitário de aplicação compartilhado pela sessão
- centralizar formatação visual de `monthRef`
- reutilizar instâncias de `Intl.NumberFormat` e `Intl.DateTimeFormat`
- clonar transações na fronteira de entrada do provider
- expor coleções de transações como readonly nos contratos de leitura
- preservar componentes `SummaryMetric` separados porque seus tratamentos visuais são intencionalmente diferentes

Implementação criada ou alterada:
- `src/features/transactions/application/utils/resolve-session-month-ref.ts`
- `src/shared/utils/formatMonthRef.ts`
- `src/shared/utils/formatCents.ts`
- `src/features/transactions/presentation/providers/TransactionSessionProvider.tsx`
- `src/features/transactions/presentation/hooks/useSessionMonthlySummary.ts`
- `src/features/dashboard/presentation/hooks/useDashboardSummary.ts`
- contratos de sessão, dashboard e listas atualizados para leitura readonly

Resultado TDD:
- testes dos novos utilitários falharam inicialmente por módulos ausentes
- teste do provider falhou ao receber `Descrição alterada externamente` em vez de `Mercado`, comprovando mutação por referência
- etapa verde direcionada: 7 suites e 25 testes passaram
- suíte completa: 14 suites e 69 testes passaram

Resultado dos gates:
- `npm run test:ci`: passou, 14 suites e 69 testes
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/`, `/dashboard` e `/transactions`

Limites preservados:
- nenhuma regra financeira nova criada
- nenhuma persistência real, migration, autenticação ou RLS criada
- nenhuma abstração genérica criada apenas por semelhança visual
- comportamento e rotas do Dia 4 preservados

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS` após encerramento do hardening
- próximo passo recomendado: executar Dia 6 da SR-006

## Pendências e Próximos Passos
- SR-006 concluída e classificada como `READY_FOR_RELEASE`.
- SR-007 concluída e classificada como `READY_FOR_RELEASE`.
- Dia 1 da SR-008 concluído; item movido para `IN_PROGRESS` e arquitetura registrada no ADR 0003.
- Dia 2 da SR-008 concluído; 7 suítes e 29 testes essenciais criados em estado vermelho válido.
- Dia 3 da SR-008 concluído; implementação mínima passou em 28 suítes e 139 testes.
- Dias 4 e 5 da SR-008 concluídos; apresentação, route groups, Proxy e hardening validados.
- Dia 6 da SR-008 concluído; acessibilidade assíncrona, responsividade e assets PWA validados em 33 suítes e 153 testes.
- Dia 7 da SR-008 concluído; pipeline, segurança, observabilidade e release readiness validados em 33 suítes e 153 testes.
- Dias 2 a 6 da SR-009 concluídos; persistência, RLS, apresentação server-side, hardening e UX/PWA foram validados incrementalmente.
- Dia 7 da SR-009 concluído; pipeline, 70 testes pgTAP, advisors, threat model e baseline de observabilidade foram validados.
- Dia 7 da UI-001 concluído; pipeline final passou com 41 suítes e 194 testes.
- Dia 1 da UI-002 concluído; item movido para `IN_PROGRESS` e arquitetura registrada no ADR 0006.
- Próximo passo operacional: executar explicitamente o Dia 2 da UI-002; a SR-010 permanece em `DISCOVERY` e não foi iniciada.
- A proposta FinControl Pulse foi incorporada integralmente como especificação, ADR, trilha de roadmap e backlog `UI-001` a `UI-006`; nenhuma tela foi implementada fora de fase.
- A publicação dos commits locais da SR-006 continua pendente de autorização explícita e não bloqueia o discovery da SR-007.
- Manter fora do escopo imediato: cartão, parcelas, IA, importação e Open Finance.

## Mudança de Escopo — FinControl Pulse

Decisão:
- adotar FinControl Pulse como direção oficial de UI, UX, marca e copywriting
- padronizar futuramente a marca como `FinControl`, assinatura `Seu copiloto financeiro` e slogan `Entenda seu dinheiro. Antecipe riscos. Decida com clareza.`
- implementar a proposta em small releases, sem substituir a fundação de dados e sem criar rotas vazias

Impacto arquitetural:
- novo sistema de tokens semânticos e temas em presentation/shared
- `PrivateAppShell` evolui para composition root visual responsiva
- primitives genéricas ficam em `src/shared/components/ui`; cards financeiros permanecem nas features
- gráficos continuam atrás de adapter e do spike `SP-001`
- copy contextual permanece próxima da feature e não entra em domain/infrastructure

Mapeamento aprovado:
- `UI-001`: identidade visual, tipografia, tokens, tema e primitives
- `UI-002`: sidebar, topbar e navegação mobile
- `UI-003`: dashboard Pulse com capacidades reais disponíveis
- `UI-004`: apresentação de contas
- `UI-005`: apresentação de transações após categorias/transações persistidas
- `UI-006`: login, estados, microcopy e instalação PWA
- analytics, metas, gamificação e IA continuam nas SR-012 a SR-023
- cartões, orçamentos, compromissos, relatórios, importação, configurações e marketing ficam em backlog próprio

Restrições preservadas:
- “disponível de verdade” só pode ser exibido após regras completas de saldo e compromissos
- IA não pode ser apresentada como funcional antes da SR-023
- recuperação, cadastro, biometria e lembrar acesso não podem aparecer sem fluxos reais
- nenhuma promessa offline sem estratégia de consistência autenticada
- exemplos de valores nunca podem parecer dados reais do usuário

Artefatos:
- `docs/product/fincontrol-pulse-interface-copy.md`
- `adr/0005-fincontrol-pulse-design-system.md`
- `architecture.md`
- `roadmap.md`
- `backlog.md`

Estado:
- `UI-001` selecionada e movida para `IN_PROGRESS`
- Dia 1 concluído em `ARCHITECTURE_READY`
- código da SR-009 continua pronto para release; nenhum deploy foi executado

## Dia 1 — UI-001 Sistema Visual, Marca e Temas

Objetivo fechado:
- criar a fundação visual transversal do FinControl sem redesenhar shell ou features no mesmo incremento
- substituir cores e tipografia literais por contratos semânticos testáveis
- oferecer tema claro, escuro e automático sem persistir dados financeiros no navegador

Auditoria de entrada:
- `src/shared/components/ui` ainda não existe
- `globals.css` usa Arial e valores literais apenas para tema claro
- `tailwind.config.ts` expõe uma paleta curta e literal
- telas repetem superfícies, bordas, textos e controles sem primitives compartilhadas
- metadata, Apple title e manifest usam nomes diferentes: `Controle Financeiro IA` e `Finanças IA`
- `PrivateAppShell` contém somente sessão e logout; navegação estrutural pertence à UI-002
- testes existentes já protegem alvos de 44 px, semântica de feedback, foco, altura mobile e manifest

Decisões aprovadas:
- marca: `FinControl`; assinatura institucional: `Seu copiloto financeiro`
- tipografia: Geist via `next/font/google`, variável CSS e `font-sans`, sem pacote adicional
- tokens: canais RGB em `globals.css`, mapeados pelo Tailwind com `rgb(var(--token) / <alpha-value>)`
- tema: `ThemePreference = light | dark | system` e `ResolvedTheme = light | dark`
- dark mode: seletor `data-theme="dark"` com Tailwind 3.4 em modo `selector`
- persistência: somente chave não sensível `fincontrol.theme`, com allowlist e fallback para `system`
- inicialização: script estático local anterior à hidratação; provider React sincroniza DOM, storage e `matchMedia`
- primitives: somente `Button`, `Card`, `FeedbackMessage` e `ThemeSwitcher`
- dependência de classes: usar `clsx` já instalado; não adicionar biblioteca de tema ou kit visual

Estrutura planejada, ainda não criada:
```text
src/shared/components/ui/
  Button.tsx
  Card.tsx
  FeedbackMessage.tsx
  ThemeSwitcher.tsx
src/shared/theme/
  theme.types.ts
  theme.constants.ts
  resolveTheme.ts
  ThemeProvider.tsx
  useTheme.ts
public/
  theme-init.js
```

Limites obrigatórios:
- sem sidebar, topbar ou navegação mobile da UI-002
- sem dashboard Pulse da UI-003
- sem cards/drawers de contas ou transações das UI-004/UI-005
- sem refinamento completo de login/instalação PWA da UI-006
- sem gráficos, novas rotas, dados fictícios, regras financeiras, migrations ou Supabase
- sem criar Input, Modal, Drawer, BottomSheet, Badge, Tabs ou Skeleton sem necessidade real posterior

Contratos e testes preparados para o Dia 2:
- função pura de resolução de tema
- allowlist e fallback de preferência persistida
- inicialização anterior à hidratação e sincronização do provider
- tokens completos nos dois temas e mapeamento Tailwind
- primitives acessíveis e regressão das telas existentes
- metadata, manifest, contraste, foco, redução de movimento e PWA

Riscos:
- flash de tema se a resolução inicial ocorrer apenas após hidratação
- regressão global se classes literais forem migradas de uma vez sem testes
- contraste insuficiente em combinações específicas, ainda a ser comprovado no Dia 2 e no Dia 6
- inconsistência de marca enquanto a implementação não migrar todas as superfícies

Bloqueios:
- implementação funcional proibida antes dos testes essenciais do Dia 2
- nenhuma biblioteca nova aprovada ou necessária

Estado de saída:
- máquina de estados: `ARCHITECTURE_READY`
- backlog: `UI-001` em `IN_PROGRESS`
- próximo comando válido: `dia 2 da UI-001`

## Dia 2 — UI-001 Estratégia de Testes e Fundação TDD

Small release:
- `UI-001 — Sistema visual, marca e temas`

Aplicabilidade por camada:
- domain financeiro: não aplicável; nenhum contrato ou cálculo financeiro pertence a esta release
- application financeira: não aplicável; tema é estado transversal de presentation/shared
- função pura compartilhada: resolução determinística de `light | dark | system`
- presentation: provider, hook, switcher e primitives acessíveis
- contratos estáticos: tokens CSS, Tailwind, metadata, manifest e inicialização anterior à hidratação

Baseline anterior:
- `npm run test:ci`: passou com 36 suítes e 170 testes antes da criação dos contratos da UI-001
- após a criação do RED, a rede anterior excluindo apenas os contratos novos e o manifest alterado passou com 35 suítes e 168 testes

Testes criados:
- `src/shared/theme/tests/resolveTheme.test.ts`
- `src/shared/theme/tests/ThemeProvider.test.tsx`
- `src/shared/components/ui/tests/ThemeSwitcher.test.tsx`
- `src/shared/components/ui/tests/ui-primitives.test.tsx`
- `tests/design-system-contract.test.ts`

Teste alterado:
- `tests/pwa-manifest.test.ts`, que agora exige a marca `FinControl` e o fundo claro `#f6f8fc`

Cenários cobertos:
- preferência explícita clara ou escura vence o sistema
- preferência `system` resolve para light/dark
- preferência persistida válida é restaurada
- valor malformado ou storage indisponível usa fallback seguro
- mudança de `matchMedia` é observada somente em `system`
- listener do sistema é removido no unmount
- seleção manual persiste em `fincontrol.theme`
- `ThemeSwitcher` expõe grupo acessível com Claro, Escuro e Sistema e alvos mínimos
- `Button`, `Card` e `FeedbackMessage` preservam contratos genéricos, sem semântica financeira
- tokens light/dark possuem valores aprovados, contraste mínimo e mapeamento Tailwind com alfa
- layout usa FinControl, Geist e inicializador local anterior à hidratação
- initializer usa allowlist e chave não sensível
- classes literais de paleta são removidas da produção
- fallback global respeita `prefers-reduced-motion`
- manifest preserva instalabilidade enquanto adota a marca

Etapa RED observada:
- comando direcionado executou seis suítes e todas falharam conforme planejado
- quatro suítes falharam por módulos ausentes: `resolveTheme`, `ThemeProvider`, `useTheme`, `ThemeSwitcher`, `Button`, `Card` e `FeedbackMessage`
- contrato estático falhou por ausência de tokens, seletor dark, Geist, inicializador, reduced motion e pela presença de classes literais
- manifest falhou porque ainda declara `Controle Financeiro IA`/`Financas IA`
- nenhuma falha existente de domínio, aplicação, Auth, contas, transações ou dashboard foi introduzida

Gates aplicáveis:
- `npm run lint`: passou sem warnings
- `npm run type-check`: falhou somente com oito `TS2307` para os módulos deliberadamente ausentes
- build não foi executado porque o type-check deve permanecer vermelho por desenho TDD

Implementação bloqueada até o Dia 3:
- `src/shared/theme/resolveTheme.ts`
- `src/shared/theme/ThemeProvider.tsx`
- `src/shared/theme/useTheme.ts`
- `src/shared/components/ui/Button.tsx`
- `src/shared/components/ui/Card.tsx`
- `src/shared/components/ui/FeedbackMessage.tsx`
- `src/shared/components/ui/ThemeSwitcher.tsx`
- tokens, Tailwind, Geist, metadata/manifest, `public/theme-init.js` e migração de classes literais

Limites preservados:
- nenhum código funcional, token, provider, componente ou initializer foi criado
- nenhuma dependência foi instalada
- nenhuma regra financeira, rota, shell, dashboard Pulse, drawer, gráfico ou copy de outra UI foi antecipada
- nenhuma migration, policy, dado ou configuração Supabase foi alterada

Estado de saída:
- máquina de estados: `TEST_STRATEGY_READY`
- backlog: `UI-001` permanece `IN_PROGRESS`
- próximo comando válido: `dia 3 da UI-001`

## Dia 3 — UI-001 Implementação Mínima Orientada por Teste

Small release:
- `UI-001 — Sistema visual, marca e temas`

Núcleo de tema implementado:
- tipos `ThemePreference`, `ResolvedTheme` e `ThemeControllerValue`
- resolução pura de `light | dark | system`
- provider e hook isolados em `src/shared/theme`
- sincronização segura entre DOM, `matchMedia` e `fincontrol.theme`
- fallback para valor malformado ou storage indisponível
- listener de preferência do sistema removido no unmount
- script local `public/theme-init.js` executado antes da hidratação

Primitives implementadas:
- `Button` com variantes mínimas, tipo seguro, estado disabled e foco visível
- `Card` como superfície genérica sem semântica financeira
- `FeedbackMessage` com `status` e `alert`
- `ThemeSwitcher` acessível com Claro, Escuro e Sistema
- `clsx` já existente foi reutilizado; nenhuma dependência foi instalada

Integração visual mínima:
- `ThemeProvider` composto no root layout
- Geist configurada por `next/font/google` com variável CSS
- metadata, Apple title e manifest padronizados como `FinControl`
- tokens light/dark mapeados pelo Tailwind com canais RGB e suporte a alfa
- dark mode usa `data-theme="dark"`
- fallback global de `prefers-reduced-motion`
- classes literais de paleta migradas para tokens semânticos nas telas existentes
- rotas, conteúdo, regras financeiras e comportamento de autenticação foram preservados

Correção orientada por teste:
- primeira passagem direcionada passou em 23 de 24 testes
- `#64748B` sobre `#F6F8FC` mediu 4,476:1, abaixo do AA mínimo
- `muted-foreground` claro foi corrigido para `#5F6F85`, atingindo aproximadamente 4,818:1
- ADR, especificação, teste e contexto foram atualizados; o gate de 4,5:1 não foi reduzido
- uma asserção legada de accounts foi alinhada de `text-red-700` para `text-danger-foreground`, preservando role, mensagem e exigência semântica

Arquivos principais criados:
- `src/shared/theme/theme.types.ts`
- `src/shared/theme/theme.constants.ts`
- `src/shared/theme/resolveTheme.ts`
- `src/shared/theme/ThemeProvider.tsx`
- `src/shared/theme/useTheme.ts`
- `src/shared/components/ui/Button.tsx`
- `src/shared/components/ui/Card.tsx`
- `src/shared/components/ui/FeedbackMessage.tsx`
- `src/shared/components/ui/ThemeSwitcher.tsx`
- `public/theme-init.js`

Evidência TDD e quality gates:
- testes direcionados: 6 suítes e 24 testes verdes
- suíte completa: 41 suítes e 192 testes verdes
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/login` estática, rotas privadas dinâmicas e `ƒ Proxy (Middleware)`
- busca estática confirmou ausência das classes literais proibidas em produção
- busca arquitetural confirmou ausência de imports Supabase no novo sistema visual
- browser storage em produção ficou restrito a `fincontrol.theme`

Limites preservados:
- sem sidebar, topbar ou navegação da UI-002
- sem dashboard Pulse, cards/drawers, gráficos, novas rotas ou regras financeiras
- sem migration, policy, dados ou configuração Supabase
- sem nova dependência e sem abstrações adicionais às exigidas pelos testes
- validação visual interativa e exposição do switcher em uma superfície final ficam para expansão/UX das fases seguintes

Estado de saída:
- máquina de estados: `IMPLEMENTATION_IN_PROGRESS`
- backlog: `UI-001` permanece `IN_PROGRESS`
- próximo comando válido: `dia 5 da UI-001`

## Dia 4 — UI-001 Expansão Controlada

Small release:
- `UI-001 — Sistema visual, marca e temas`

TDD e escopo:
- o RED válido confirmou que o seletor de tema ainda não estava exposto em uma superfície final
- o contrato estático identificou quatro superfícies de produção e o ícone PWA com a marca legada `Controle Financeiro IA`
- a primeira integração no `PrivateAppShell` violou o limite reservado à UI-002; o desvio foi registrado em erros recorrentes, revertido e testado novamente
- a integração corrigida expõe `ThemeSwitcher` no login, que já está sob `ThemeProvider`, sem alterar o shell autenticado

Implementação criada ou alterada:
- `LoginPage` passou a oferecer `light | dark | system` antes da autenticação
- login, dashboard, contas e transações passaram a exibir a marca `FinControl`
- o rótulo acessível do ícone PWA passou a usar `FinControl`
- o contrato do design system impede a reintrodução da marca legada em código de produção

Estados e experiência preservados:
- loading, success e error do login continuam cobertos
- empty, loading, success e error das superfícies financeiras continuam cobertos pela regressão existente
- preferência permanece restrita a `fincontrol.theme`; nenhum dado financeiro ou de identidade foi adicionado ao storage
- nenhuma sidebar, topbar, navegação mobile, dashboard Pulse, drawer, gráfico ou regra financeira foi antecipada

Evidência:
- RED corrigido: `LoginPage` falhou somente pela ausência do radiogroup `Tema`
- GREEN direcionado final: 3 suítes e 12 testes
- regressão final: 41 suítes e 193 testes
- lint, type-check e build passaram
- `npm audit --omit=dev`: 0 vulnerabilidades
- build preservou `/`, `/accounts`, `/dashboard`, `/login`, `/transactions` e `Proxy (Middleware)`

Validação visual:
- o servidor local respondeu em `http://127.0.0.1:3000`
- a automação do Chrome não pôde inspecionar a página porque o registro do native host da extensão está ausente no Windows
- nenhuma tentativa de reparar o native host foi feita; a reinstalação do plugin Chrome pela interface do Codex é a recuperação indicada
- a limitação não substituiu nem enfraqueceu testes, acessibilidade estática ou build

Estado de saída:
- máquina de estados: `IMPLEMENTATION_IN_PROGRESS`
- backlog: `UI-001` permanece `IN_PROGRESS`
- próximo comando válido: `dia 5 da UI-001`

## Dia 5 — UI-001 Plano de Refatoração e Hardening

Auditoria de entrada:
- worktree limpo no commit `Dia 4 UI-001`
- rede de segurança com 41 suítes e 193 testes
- `TransactionForm` possui 255 linhas, mas permanece coeso ao fluxo específico e não será fragmentado sem necessidade
- `AccountForm` possui 175 linhas e `LoginPage` 154 linhas; a duplicação relevante está em botões e feedbacks, não em regras de negócio
- `Button`, `Card` e `FeedbackMessage` estão testados, porém ainda não são adotados pelas superfícies de produção

Plano incremental aprovado:
1. criar contrato estático RED para adoção das primitives aprovadas nos fluxos atuais
2. migrar botões nativos duplicados para `Button` sem mudar labels, estados ou eventos
3. migrar mensagens duplicadas para `FeedbackMessage` preservando `alert` e `status`
4. usar `Card` somente em contêiner não semântico compatível, sem enfraquecer landmarks
5. manter inputs, helpers e composição específica dentro das features para evitar abstração prematura
6. executar testes direcionados, regressão, lint, type-check, audit e build

Itens explicitamente não selecionados:
- componente genérico de formulário ou field wrapper
- componente polimórfico complexo para links ou sections
- divisão artificial do `TransactionForm`
- mudanças de copy, regra financeira, shell, navegação, Supabase ou dados

Refatoração aplicada:
- `Button` adotado em cadastro de conta, registro de transação, login e logout
- `FeedbackMessage` adotado nos formulários, login, logout, resumo mensal e erro do dashboard
- `Card` adotado no contêiner não semântico do empty state do dashboard
- labels, eventos, mensagens, `aria-busy`, `alert`, `status` e estados disabled foram preservados
- nenhum input, regra ou helper específico de feature foi movido para shared

Resultado estrutural:
- `AccountForm`: 175 para 168 linhas
- `TransactionForm`: 255 para 248 linhas
- `LoginPage`: 154 para 149 linhas
- arquivos maiores foram identificados; não houve fragmentação artificial porque permanecem coesos
- nenhuma dependência nova, regra financeira, acesso Supabase, migration ou alteração de dados

Evidência:
- RED: contrato estático falhou pela ausência das primitives nos fluxos auditados
- GREEN direcionado: 8 suítes e 43 testes
- regressão completa: 41 suítes e 194 testes
- lint e type-check passaram
- `npm audit --omit=dev`: 0 vulnerabilidades
- build passou preservando `/`, `/accounts`, `/dashboard`, `/login`, `/transactions` e `Proxy (Middleware)`
- `git diff --check` sem erros

Estado de saída:
- máquina de estados: `IMPLEMENTATION_IN_PROGRESS`
- backlog: `UI-001` permanece `IN_PROGRESS`
- próximo comando válido: `dia 6 da UI-001`

## Dia 6 — UI-001 UX, Acessibilidade, Responsividade e PWA

Auditoria e RED:
- o link de retorno de transações possuía alvo de 40 px, abaixo do mínimo de 44 px
- o radio visual do seletor ocupava 44 px; o alvo amplo deveria pertencer ao label, mantendo o controle visual compacto
- a cor de tema do viewport não diferenciava preferências clara e escura do sistema
- o manifest prometia IA antes da SR-023
- a inspeção no navegador revelou que o Proxy interceptava `theme-init.js`, devolvendo HTML e impedindo a aplicação do tema
- os cinco contratos foram reproduzidos em testes antes das correções correspondentes

Melhorias aplicadas:
- link de retorno e labels do seletor passaram a garantir `min-h-11`
- radios visuais passaram a 16 x 16 px dentro de labels com 44 px
- metadata de viewport passou a declarar cores distintas para `prefers-color-scheme: light` e `dark`
- descrição do manifest passou a `Seu copiloto financeiro pessoal.`, sem promessa de IA ou offline
- matcher do Proxy passou a excluir scripts JavaScript públicos; `/theme-init.js` responde `200` com `application/javascript`

Validação no navegador interno:
- viewport auditado em 320 x 800 px, sem overflow horizontal
- labels do tema medidos em 44 px; radios em 16 x 16 px
- tema escuro aplicou `data-theme="dark"`, `color-scheme: dark` e fundo `rgb(11, 18, 32)`
- viewport temporário foi restaurado e a aba de teste foi finalizada

Evidência:
- RED inicial: 4 suítes falharam pelos contratos de toque, viewport e copy do manifest
- GREEN inicial: 4 suítes e 14 testes
- RED/GREEN adicional: regressão do matcher de `theme-init.js` falhou e passou após a correção
- regressão completa: 41 suítes e 194 testes
- lint e type-check passaram
- `npm audit --audit-level=high`: 0 vulnerabilidades
- build passou preservando `/`, `/accounts`, `/dashboard`, `/login`, `/transactions` e `Proxy (Middleware)`
- nenhuma promessa offline, service worker, shell, dashboard Pulse, migration, regra financeira ou acesso Supabase foi adicionado

Estado de saída:
- máquina de estados: `QUALITY_VALIDATION`
- backlog: `UI-001` permanece `IN_PROGRESS` até o gate final
- próximo comando válido: `dia 7 da UI-001`

## Dia 7 — UI-001 Qualidade Final, Segurança, Observabilidade e Entrega

Escopo validado:
- o diff completo da UI-001 permanece limitado a marca, Geist, tokens, temas, primitives, ajustes acessíveis e assets PWA já aprovados
- nenhuma migration, política RLS, regra financeira, rota vazia, dashboard Pulse, drawer, gráfico, service worker ou capacidade de IA entrou na entrega
- `domain` e `application` não passaram a importar React, Next.js, Supabase ou clients de infraestrutura

Quality gates finais:
- `npm run lint`: passou sem warnings
- `npm run type-check`: passou
- `npm test`: 41 suítes e 194 testes passaram
- `npm audit --audit-level=high`: 0 vulnerabilidades
- `npm run build`: passou com `/`, `/accounts`, `/dashboard`, `/login`, `/transactions` e `Proxy (Middleware)` preservados
- `git diff --check`: passou

Revisão básica de segurança:
- nenhum segredo ou arquivo de ambiente sensível está versionado; `SUPABASE_SERVICE_ROLE_KEY` aparece somente como placeholder vazio em `.env.example`
- dependências Supabase estão fixadas no lockfile; a aplicação usa chave pública no client e não expõe `service_role`
- o Proxy valida a identidade com `getClaims()`, falha fechado em erro de configuração/autenticação e preserva cookies na resposta
- o matcher exclui assets públicos, incluindo `theme-init.js`, sem liberar rotas privadas
- somente a preferência não sensível `fincontrol.theme` é persistida no navegador

Threat model da UI-001:
- flash ou adulteração local de tema: mitigado por allowlist `light | dark | system`, fallback seguro e inicialização anterior à hidratação
- vazamento de dados no browser storage: mitigado pela persistência exclusiva da preferência de tema
- bypass de autenticação por assets ou erro de configuração: mitigado pelo matcher explícito, testes de Proxy e comportamento fail-closed
- supply chain: mitigada por versões exatas, lockfile, `npm ci` no CI e auditoria sem vulnerabilidades; pinagem por SHA das GitHub Actions permanece hardening não crítico já registrado

Baseline de observabilidade:
- CI registra lint, type-check, testes, auditoria e build por execução
- falhas de autenticação/configuração geram mensagens estáveis sem expor segredos
- regressões de tema, manifesto, Proxy e primitives possuem testes determinísticos
- telemetria externa, rastreamento de usuário ou analytics não foram adicionados; qualquer coleta futura exige item próprio, minimização e consentimento quando aplicável

Estado de saída:
- máquina de estados: `READY_FOR_RELEASE`
- backlog: `UI-001` movida para `DONE`
- riscos críticos: nenhum para a entrega incremental da UI-001
- riscos residuais não críticos: hardening de CI por SHA e validação visual contínua em navegadores reais permanecem no backlog existente
- commit, push e deploy: não executados por não fazerem parte da autorização deste Dia 7
- próximo passo válido: selecionar explicitamente a próxima small release; `UI-002` e `SR-010` permanecem em `DISCOVERY`

## Próximo Ciclo Selecionado — SR-007 Cadastro Local de Conta Financeira

Small release selecionada: `SR-007 — Cadastro local de conta financeira`.

Motivo da escolha:
- é o primeiro item de alta prioridade cujas dependências já estão concluídas
- cria a base de domínio necessária para substituir IDs demonstrativos de conta
- habilita a sequência segura SR-008 (autenticação), SR-009 (persistência/RLS de contas), SR-010 (categorias) e SR-011 (transações persistidas)
- entrega uma fronteira pequena e testável sem antecipar infraestrutura crítica

Escopo mínimo planejado:
- modelar `FinancialAccount` com identificadores, nome, tipo, saldo inicial em centavos, moeda e timestamps
- validar entradas no domínio e orquestrar o cadastro por caso de uso
- definir `AccountRepository` como contrato, sem implementação Supabase neste ciclo
- usar apenas memória/sessão caso a apresentação seja aprovada nas fases de implementação

Decisões fechadas no Dia 1:
- enumeração mínima dos tipos de conta aceitos
- política explícita para saldo inicial negativo
- limite de tamanho e normalização do nome
- responsabilidade pela geração de `id` e timestamps no recorte local

Bloqueios e limites:
- autenticação, migrations, persistência real e RLS estão fora da SR-007
- nenhuma transação será migrada para dados persistidos neste ciclo
- persistência de contas só pode começar após SR-008 e dentro da SR-009, com RLS e testes de isolamento

Ordem obrigatória do ciclo:
1. Dia 1: fechar regras, tipos e contratos, atualizando contexto e arquitetura se necessário.
2. Dia 2: escrever testes essenciais e observar a etapa vermelha.
3. Dia 3: implementar o mínimo para satisfazer os testes.
4. Dias 4 a 7: expandir de forma controlada, refatorar, revisar UX/PWA e executar os quality gates.

Estado após a seleção:
- SR-006 permanece registrada como release anterior pronta, sem controlar o estado do novo ciclo
- SR-007 está `IN_PROGRESS`, com Dia 1 concluído
- nenhum código funcional da SR-007 foi criado

## Dia 1 — Contexto, Discovery e Arquitetura da SR-007

Small release: `SR-007 — Cadastro local de conta financeira`.

Decisões de domínio:
- tipos iniciais: `checking`, `savings`, `cash`, `payment` e `investment`
- nome obrigatório, espaços normalizados e limite de 80 caracteres
- saldo inicial armazenado em centavos como inteiro seguro
- saldo inicial negativo permitido para representar a realidade informada; não equivale a limite de crédito
- moeda fixa como `BRL` no recorte inicial
- ID e timestamps opcionais antes da persistência e atribuídos pela infraestrutura futura
- saldo atual não será um campo mutável; será derivado futuramente do saldo inicial e dos movimentos

Contratos definidos:
- `FinancialAccount` concentra as invariantes puras
- `CreateAccountUseCase` cria a entidade e chama `AccountRepository.create`
- `AccountRepository.create` é obrigatório; `findById` permanece opcional até existir consumidor real
- apresentação futura converte reais digitados para centavos antes de chamar a aplicação

Estrutura planejada para nascer com testes no Dia 2:
- `src/features/accounts/domain/entities/financial-account.entity.ts`
- `src/features/accounts/domain/interfaces/account.repository.ts`
- `src/features/accounts/application/use-cases/create-account.use-case.ts`
- `src/features/accounts/tests/financial-account.entity.test.ts`
- `src/features/accounts/tests/create-account.use-case.test.ts`

Dependências críticas:
- SR-008 deve criar autenticação e sessão protegida antes de persistência real
- SR-009 deve criar migrations, repositório Supabase, RLS e testes de isolamento de contas
- integração de contas com transações será outro incremento testado e não faz parte da SR-007

Riscos:
- bloqueio duro: persistir dados financeiros sem autenticação e RLS
- bloqueio leve: o estado local será perdido ao recarregar até a fundação de dados reais
- risco controlado: saldo negativo pode ser confundido com crédito; a UI futura deverá explicar que representa o saldo informado

Validação arquitetural:
- feature permanece separada em `presentation`, `application`, `domain` e `infrastructure` conforme necessidade real
- domínio não depende de framework
- aplicação depende apenas do contrato de repositório
- UI não acessará Supabase
- nenhuma abstração adicional de relógio ou gerador de ID foi criada prematuramente
- nenhum ADR novo é necessário porque as decisões aplicam a arquitetura-base existente

Estado de saída:
- `ARCHITECTURE_READY`
- próximo passo recomendado: executar `dia 2`

## Dia 2 — Estratégia de Testes e Fundação TDD da SR-007

Small release: `SR-007 — Cadastro local de conta financeira`.

Matriz criada:
- domínio: `FinancialAccount` cobrindo saldos, tipos, normalização, moeda e entradas inválidas
- aplicação: `CreateAccountUseCase` cobrindo persistência por contrato, bloqueio de entrada inválida e propagação de erro
- infraestrutura: bloqueada até autenticação e RLS nas SR-008/SR-009
- apresentação: adiada até estabilidade do caso de uso e aprovação da expansão

Testes criados:
- `src/features/accounts/tests/financial-account.entity.test.ts`
- `src/features/accounts/tests/create-account.use-case.test.ts`

Etapa vermelha observada:
- `npm run test:ci -- src/features/accounts/tests`: falhou com 2 suítes por módulos ausentes
- `FinancialAccount`, `AccountRepository` e `CreateAccountUseCase` continuam deliberadamente inexistentes
- `npm run type-check`: falhou com quatro erros `TS2307` para os mesmos módulos ausentes

Rede de segurança anterior:
- `npx jest --runInBand --testPathIgnorePatterns=src/features/accounts/tests`: passou
- 14 suítes e 69 testes anteriores passaram
- uma tentativa anterior de exclusão via argumento do npm foi interpretada como configuração; mesmo assim, registrou 14 suítes anteriores verdes e somente as duas novas vermelhas

Gates aplicáveis:
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- build não foi executado porque o type-check deve permanecer vermelho por design nesta fase

Implementação bloqueada até o Dia 3:
- `src/features/accounts/domain/entities/financial-account.entity.ts`
- `src/features/accounts/domain/interfaces/account.repository.ts`
- `src/features/accounts/application/use-cases/create-account.use-case.ts`

Limites preservados:
- nenhum código funcional criado
- nenhuma apresentação, rota ou sessão local criada
- nenhuma migration, autenticação, persistência Supabase ou RLS criada

Estado de saída:
- `TEST_STRATEGY_READY`
- próximo passo recomendado: executar `dia 3`

## Dia 1 — Contexto, Discovery e Arquitetura da SR-010

Small release: `SR-010 — Persistência e RLS de categorias`.

Pré-requisitos confirmados:
- SR-008 concluiu autenticação e sessão protegida
- SR-009 concluiu persistência e RLS de contas
- UI-002 está integrada em `origin/develop`
- branch `feature/SR-010-categories-rls` criada a partir de `origin/develop`
- alterações locais preexistentes em `.gitignore` e `rewrite-msgs.sh` foram preservadas e permanecem fora do escopo
- nenhum bloqueio duro impede o discovery

Objetivo refinado:
- substituir categorias demonstrativas por categorias reais do usuário autenticado
- permitir criação e listagem seguras antes de persistir transações
- preparar integridade tenant-safe para a futura SR-011
- manter o recorte pequeno, sem antecipar personalização, manutenção completa ou analytics

Escopo aprovado:
- entidade `Category` com criação e restauração
- `CategoryKind` limitado a `income | expense`
- criar categoria própria
- listar categorias próprias em ordem determinística
- persistir `id`, `user_id`, `name`, `kind`, `created_at` e `updated_at`
- rota privada `/categories` como subfluxo de transações
- substituir opções demonstrativas do formulário local por categorias persistidas quando a apresentação for autorizada

Fora do escopo:
- editar, excluir, arquivar e ordenar manualmente categorias
- cor, ícone, categorias globais e seed automático
- categoria híbrida `both`
- sugestões ou classificação por IA
- persistência de transações, orçamento e analytics por categoria
- novo item na navegação principal da UI-002

Regras de domínio:
- `userId` é obrigatório, mas a apresentação não o fornece como autoridade
- nome é obrigatório, normalizado com espaços internos simples e limitado a 80 caracteres
- nomes duplicados por usuário e `kind` são rejeitados sem diferenciar maiúsculas e minúsculas
- o mesmo nome pode existir uma vez em `income` e uma vez em `expense`
- `kind` deve corresponder à polaridade futura da transação
- categoria sugerida futuramente por IA continua revisável pelo usuário

Contratos entre camadas:
- `Category.create()` valida nova categoria
- `Category.restore()` reidrata ID e timestamps reaplicando invariantes
- `CategoryRepository.create()` persiste uma categoria válida
- `CategoryRepository.listByUser()` lista categorias próprias
- `CreateCategoryUseCase` cria e persiste somente após validação
- `ListCategoriesUseCase` valida o ator e consulta o contrato
- `SupabaseCategoryRepository` e mapper ficam em `categories/infrastructure`
- Server Component e Server Action revalidam claims e injetam o `userId`
- presentation recebe DTOs e callbacks serializáveis, sem importar Supabase

Schema planejado:
- tabela `public.categories`
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `name text not null` com normalização e limite de 80 caracteres
- `kind text not null check (kind in ('income', 'expense'))`
- timestamps `created_at` e `updated_at` com `now()`
- unicidade case-insensitive por `(user_id, kind, lower(name))`
- unicidade adicional `(user_id, id)` para futura FK composta em `transactions`
- índice para listagem por usuário, kind, nome normalizado e ID
- nenhuma trigger de atualização enquanto `UPDATE` estiver fora do escopo

Grants e RLS planejados:
- revogar privilégios de `public`, `anon`, `authenticated` e `service_role`
- conceder somente `SELECT` e `INSERT` a `authenticated`
- habilitar e forçar RLS
- policy separada de `SELECT` com ownership e bloqueio de usuário anônimo
- policy separada de `INSERT` com `WITH CHECK`, ownership e bloqueio de usuário anônimo
- não criar grants ou policies de `UPDATE` e `DELETE`
- usar `(select auth.uid())` e `(select auth.jwt())` para initPlan por statement

Auditoria Supabase via MCP:
- projeto `fin_control` ativo e saudável em Postgres 17
- banco contém somente `public.financial_accounts`, com duas linhas, duas migrations e nenhuma tabela de categorias
- `financial_accounts` mantém RLS habilitada e forçada
- `authenticated` possui somente `SELECT` e `INSERT` na tabela existente
- policies atuais restringem leitura e criação por proprietário e bloqueiam `is_anonymous = true`
- Performance Advisor retornou sem alertas
- Security Advisor manteve somente `auth_leaked_password_protection`, já rastreado em `SEC-AUTH-001`
- documentação oficial atual confirma que grants controlam acesso ao objeto e RLS controla as linhas; ambos devem nascer juntos
- nenhum SQL mutável, migration ou dado foi criado ou alterado

Threat model:
- BOLA/IDOR: claims revalidadas, filtro explícito e RLS por proprietário
- owner forjado: `userId` não vem da UI e `WITH CHECK` rejeita divergência
- usuário anônimo: policy verifica `is_anonymous = false`
- mass assignment: mapper de insert aceitará somente `user_id`, `name` e `kind`
- duplicidade: índice único case-insensitive por usuário e kind
- vínculo futuro cross-tenant: FK de transações deverá usar `(user_id, category_id)` para `(user_id, id)`
- vazamento de detalhes: erros do Supabase serão traduzidos para mensagens estáveis
- chave privilegiada: `service_role` permanece ausente do cliente e revogado da tabela

Matriz preliminar para o Dia 2:
- domínio: criação/restauração, normalização, limite de nome e kinds inválidos
- aplicação: criação feliz, entrada inválida, chamada única e propagação controlada de erro
- aplicação: listagem feliz, usuário vazio e ordem recebida do contrato
- mapper: `snake_case`, timestamps e payload mínimo de insert
- repository: criação, listagem filtrada/ordenada e erro sanitizado
- banco/pgTAP: schema, constraints, grants, RLS forçada, owner, não owner, anon, owner forjado e duplicidade
- apresentação futura: formulário/lista, loading, empty, success, erro e integração sem `userId` livre

Riscos e limites:
- a unicidade case-insensitive não trata nomes com e sem acento como equivalentes; adicionar `unaccent` sem caso real foi rejeitado
- sem seed automático, o usuário precisará criar ao menos uma categoria antes de registrar transações futuras
- a SR-011 continua bloqueada até a SR-010 concluir seus testes e quality gates
- `SEC-AUTH-001` continua obrigatório antes de produção pública, mas não bloqueia o TDD local desta release

Artefatos atualizados:
- `project-context.md`
- `architecture.md`
- `database-model.md`
- `domain-model.md`
- `module-contracts.md`
- `roadmap.md`
- `backlog.md`
- `quality-gates.md`
- `adr/0007-categories-persistence-rls.md`
- `adr/README.md`

Limites preservados:
- nenhum código funcional ou teste criado
- nenhuma migration criada ou aplicada
- nenhum dado, grant, policy ou configuração Supabase alterado
- nenhuma dependência instalada
- nenhum commit, push, PR ou deploy executado

Estado de saída:
- `ARCHITECTURE_READY`
- SR-010 movida para `IN_PROGRESS`
- próximo passo recomendado: executar explicitamente `dia 2` da SR-010

## Dia 1 — Contexto, Discovery e Arquitetura da UI-002

Small release: `UI-002 — Shell e navegação responsiva`.

Objetivo refinado:
- transformar o cabeçalho privado mínimo em uma estrutura de orientação consistente entre os fluxos já existentes
- oferecer acesso previsível em desktop, tablet e mobile sem anunciar capacidades futuras
- preservar autenticação, tema, logout, acessibilidade e fronteiras arquiteturais validadas na UI-001 e na SR-008

Estado e dependências:
- UI-001 confirmada como `READY_FOR_RELEASE`
- branch atual `feature/UI-002-shell-nav`
- item UI-002 movido de `DISCOVERY` para `IN_PROGRESS`
- estado de entrada do novo ciclo: `READY_FOR_RELEASE`
- nenhum bloqueio duro identificado

Auditoria da base:
- `PrivateAppShell` atual é uma client composition root e concentra e-mail, montagem do logout e redirecionamento fixo para `/login`
- rotas privadas funcionais confirmadas: `/dashboard`, `/transactions` e `/accounts`
- `/` renderiza o dashboard e permanece alias funcional
- `ThemeSwitcher`, `SignOutButton`, tokens semânticos e Lucide já existem; nenhuma dependência adicional é necessária
- não existem busca, notificações, perfil, configurações, metas, agregador de ações ou menu “Mais” funcionais

Matriz de navegação aprovada:

| Destino | Desktop/tablet | Mobile | Estado ativo adicional |
| --- | --- | --- | --- |
| `/dashboard` | Visão geral | Início | `/` |
| `/transactions` | Transações | Transações | nenhum |
| `/accounts` | Contas | Contas | nenhum |

Contrato responsivo:
- desktop a partir de `1024px`: sidebar expandida e topbar
- tablet entre `768px` e `1023px`: rail compacto persistente com nomes acessíveis, sem depender de hover
- mobile abaixo de `768px`: topbar compacta e navegação inferior com apenas três destinos
- conteúdo reserva espaço para a navegação mobile e não pode apresentar overflow horizontal
- links mantêm foco visível, alvo mínimo de 44 × 44 px e `aria-current="page"` quando ativos

Decisões arquiteturais:
- `PrivateAppShell` permanece em `src/app/(private)` como composition root visual
- componentes específicos do shell serão criados em `src/app/(private)/components` e não em `shared` até existir reutilização real
- configuração de rotas será determinística e baseada somente no pathname; não depende de Supabase ou dados financeiros
- as páginas continuam proprietárias de seus elementos `main`; o shell fornece contêiner e landmarks, sem `main` duplicado
- o contrato de logout e seus casos de uso não serão alterados
- nenhuma nova primitive compartilhada foi aprovada nesta fase

Fora do escopo:
- busca, notificações, avatar/menu de perfil, configurações e ajuda
- Cartões, Planejamento, Orçamentos, Metas, Relatórios, Importações e FinControl IA
- botão central “Adicionar”, drawer, bottom sheet ou menu hambúrguer
- novas rotas, mudanças nas páginas internas, regras financeiras, Supabase, migrations e offline

Matriz preliminar para o Dia 2:
- configuração: contém apenas as três rotas aprovadas e resolve `/` como alias do dashboard
- apresentação: itens corretos por viewport, nomes acessíveis, estado ativo e `aria-current`
- apresentação: ausência explícita de rotas e ações futuras
- regressão: e-mail, tema, loading/erro do logout e redirecionamento permanecem funcionais
- responsividade: alvos de 44 × 44 px, espaço inferior mobile e ausência de overflow
- arquitetura: nenhum import de Supabase em componentes de navegação e nenhuma regra financeira no shell

Riscos:
- risco médio de regressão transversal porque o shell envolve todas as rotas privadas
- risco de dois destinos para o dashboard mitigado por `/dashboard` canônico e `/` tratado apenas como alias ativo
- risco de abstração prematura mitigado mantendo componentes específicos próximos ao App Router
- risco de falso affordance mitigado omitindo todas as capacidades não funcionais

Artefatos atualizados:
- `project-context.md`
- `architecture.md`
- `roadmap.md`
- `backlog.md`
- `quality-gates.md`
- `adr/0006-responsive-private-shell.md`
- `adr/README.md`

Limites preservados:
- nenhum código funcional ou teste criado
- nenhuma dependência instalada
- nenhuma alteração no Supabase, autenticação, domínio financeiro ou PWA
- arquivo não rastreado `rewrite-msgs.sh` preservado sem alteração

Estado de saída:
- `ARCHITECTURE_READY`
- próximo passo recomendado: executar explicitamente `dia 2` da UI-002

## Dia 2 — Estratégia de Testes e Fundação TDD da UI-002

Small release: `UI-002 — Shell e navegação responsiva`.

Prioridade por camada:
1. configuração pura de apresentação: matriz de rotas, alias e resolução exata do pathname
2. composition root: landmarks, estado ativo, ações globais e preservação de um único `main`
3. responsividade e acessibilidade: variantes desktop/mobile, nomes, foco e alvos mínimos
4. regressão: contratos existentes de tema, logout, rotas privadas e Proxy

Matriz executável:

| Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- |
| `PRIVATE_NAVIGATION_ITEMS` | somente dashboard, transações e contas; rótulos específicos por viewport | RED por módulo ausente |
| `getPrivateNavigationItemForPath` | `/` e `/dashboard`; paths canônicos; paths futuros, aninhados ou desconhecidos | RED por módulo ausente |
| `PrivateAppShell` | navegações nomeadas, links disponíveis, ausência de falso affordance | RED funcional |
| estado ativo | `aria-current="page"` somente no destino de `/accounts` nas duas variantes | RED funcional |
| ações globais | banner, e-mail, tema, logout e um único landmark `main` | RED pela ausência do tema no shell |
| layout mobile | contêiner com espaço inferior, largura mínima segura e nenhum `main` duplicado | RED por contêiner ausente |

Testes criados:
- `src/app/(private)/tests/private-navigation.test.ts`
- `src/app/(private)/tests/PrivateAppShell.test.tsx`

Cenários planejados:
- 10 cenários puros para matriz, alias, caminhos canônicos e caminhos indisponíveis
- 4 cenários de composição para navegação, estado ativo, ações globais e layout mobile
- testes existentes de `SignOutButton` e `ThemeSwitcher` permanecem como regressão específica, sem duplicação

Resultado TDD:
- primeira tentativa posicional do Jest não encontrou testes por interpretar os parênteses do route group; o comando foi corrigido sem alterar expectativas
- primeiro harness do shell carregou `useRouter()` real porque o mock não foi elevado; a ordem foi corrigida com `jest.requireActual()` após o mock
- RED direcionado válido: 2 suítes falharam; 4 testes executáveis do shell falharam pelos contratos ausentes e a suíte pura falhou ao carregar o módulo deliberadamente inexistente
- `npm run type-check`: falhou somente com um `TS2307` para `../navigation/private-navigation`
- rede anterior, excluindo somente os dois contratos RED: 41 suítes e 194 testes passaram
- `npm run lint`: passou com 0 warnings
- build não executado porque o type-check deve permanecer vermelho nesta fase
- audit não repetido porque nenhuma dependência ou lockfile foi alterado

Implementação bloqueada até o Dia 3:
- `src/app/(private)/navigation/private-navigation.ts`
- componentes específicos de sidebar/rail, topbar e navegação mobile
- integração responsiva em `PrivateAppShell.tsx`
- qualquer ajuste de apresentação necessário para satisfazer os contratos sem expandir escopo

Limites preservados:
- nenhum código funcional criado ou alterado
- nenhum teste existente removido, relaxado ou ignorado
- nenhuma dependência instalada
- nenhuma mudança em Supabase, autenticação, rotas, domínio financeiro ou PWA
- `rewrite-msgs.sh` permaneceu fora do escopo

Estado de saída:
- `TEST_STRATEGY_READY`
- próximo passo recomendado: executar explicitamente `dia 3` da UI-002

## Dia 3 — Implementação Mínima Orientada por Teste da UI-002

Small release: `UI-002 — Shell e navegação responsiva`.

Implementação mínima:
- configuração pura e tipada com três destinos canônicos e alias `/` para o dashboard
- resolução exata de pathname, sem ativar paths futuros ou aninhados desconhecidos
- sidebar fixa expandida em desktop e compacta como rail em tablet
- navegação inferior mobile com Início, Transações e Contas
- topbar com marca, título da rota, identidade disponível, `ThemeSwitcher` e `SignOutButton`
- composição responsiva em `PrivateAppShell`, preservando o único `main` pertencente à página
- reserva de espaço inferior mobile para impedir sobreposição pela navegação fixa

Arquivos criados:
- `src/app/(private)/navigation/private-navigation.ts`
- `src/app/(private)/components/PrivateNavigation.tsx`
- `src/app/(private)/components/PrivateTopbar.tsx`

Arquivo funcional alterado:
- `src/app/(private)/PrivateAppShell.tsx`

Resultado TDD:
- primeira passagem GREEN: 2 suítes e 14 testes direcionados passaram
- regressão completa: 43 suítes e 208 testes passaram
- `npm run type-check`: passou
- `npm run lint`: passou com 0 warnings
- `npm audit --audit-level=high`: passou com 0 vulnerabilidades
- `npm run build`: passou com `/`, `/accounts`, `/dashboard`, `/login`, `/transactions` e `ƒ Proxy (Middleware)`

Aderência arquitetural:
- configuração de navegação não depende de React, Next.js, Supabase ou domínio financeiro
- componentes específicos permanecem próximos ao App Router e não foram promovidos a primitives compartilhadas
- nenhum acesso Supabase foi introduzido nos componentes ou na configuração
- montagem existente de `SignOutUseCase` e `SupabaseAuthGateway` permaneceu na composition root
- nenhuma regra financeira, rota ou capacidade futura foi adicionada
- alteração automática de `next-env.d.ts` causada pelo build foi removida do diff

Escopo preservado:
- somente `/dashboard`, `/transactions` e `/accounts` aparecem na navegação
- `/` ativa o destino canônico do dashboard
- busca, notificações, perfil, configurações, ajuda, “Adicionar”, Metas, “Mais” e demais rotas futuras permanecem ausentes
- nenhuma dependência, migration, alteração de autenticação, PWA ou página interna
- `rewrite-msgs.sh` permaneceu intacto e fora do escopo

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- próximo passo recomendado: executar explicitamente `dia 4` da UI-002

## Dia 4 — Expansão Controlada da UI-002

Small release: `UI-002 — Shell e navegação responsiva`.

Auditoria de jornada:
- navegações desktop/tablet/mobile e estado ativo já estavam funcionais
- teclado precisava atravessar sidebar e topbar antes de chegar ao conteúdo em toda mudança de rota
- topbar desaparecia durante rolagem, afastando tema e logout
- integração de logout e fallback para path privado desconhecido ainda não tinham cobertura no shell

Contratos adicionados antes da implementação:
- link “Pular para o conteúdo” aponta para alvo estável
- alvo do conteúdo é focalizável programaticamente e mantém o único `main` da página
- topbar permanece sticky no topo
- logout da topbar chama escopo local, redireciona para `/login` e atualiza o router
- path desconhecido usa título neutro e não marca item de navegação como atual

Resultado RED/GREEN:
- RED direcionado: 1 teste falhou e 16 passaram; ausência do skip link foi a única falha funcional nova
- GREEN direcionado: 2 suítes e 17 testes passaram
- regressão completa: 43 suítes e 211 testes passaram
- `npm run type-check`: passou após correção documentada da assinatura do mock de logout
- `npm run lint`: passou com 0 warnings
- `npm audit --audit-level=high`: passou com 0 vulnerabilidades
- `npm run build`: passou com todas as rotas existentes e `ƒ Proxy (Middleware)`

Implementação:
- `PrivateAppShell` ganhou skip link visível ao foco e alvo `#conteudo-principal` com `tabIndex={-1}`
- `PrivateTopbar` passou a usar `sticky top-0 z-20`
- nenhum estado artificial de loading, empty, success ou error foi criado; o shell reutiliza os estados reais do logout

Limites preservados:
- nenhuma rota, ação, primitive ou dependência adicionada
- nenhuma mudança em Supabase, autenticação, domínio financeiro, páginas internas ou PWA
- nenhum destino futuro passou a ser exibido
- alteração automática de `next-env.d.ts` causada pelo build foi removida do diff
- inspeção visual aprofundada permanece planejada para o Dia 6
- `rewrite-msgs.sh` permaneceu intacto e fora do escopo

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- próximo passo recomendado: executar explicitamente `dia 5` da UI-002

## Dia 5 — Refatoração, Consistência e Hardening Interno da UI-002

Small release: `UI-002 — Shell e navegação responsiva`.

Auditoria estrutural:
- arquivos de produção do shell medidos; `PrivateNavigation.tsx` era o maior com 99 linhas e nenhum arquivo foi classificado como monólito
- componentes desktop e mobile permaneceram separados porque possuem composição, breakpoints e rótulos distintos
- nenhuma primitive ou abstração compartilhada foi criada sem reutilização real
- a resolução da rota ativa era repetida uma vez para cada item e foi consolidada em uma busca por variante

Hardening guiado por teste:
- contrato RED exigiu que o destino móvel ativo usasse fundo e peso além de cor e `aria-current`
- RED direcionado: 1 falha e 16 testes preservados
- GREEN direcionado: 2 suítes e 17 testes passaram
- item móvel ativo passou a usar `bg-surface-muted`, `font-semibold` e `text-primary`; itens inativos mantêm `font-medium`

Validação:
- regressão completa: 43 suítes e 211 testes passaram
- `npm run type-check`: passou
- `npm run lint`: passou com 0 warnings
- `npm audit --audit-level=high`: passou com 0 vulnerabilidades
- `npm run build`: passou para todas as rotas existentes e `ƒ Proxy (Middleware)`

Limites preservados:
- nenhuma rota, feature, dependência, regra financeira, integração Supabase, autenticação ou PWA foi alterada
- nenhuma reescrita ampla ou divisão cosmética foi realizada
- alteração automática de `next-env.d.ts` causada pelo build foi removida do diff
- `rewrite-msgs.sh` permaneceu intacto e fora do escopo

Estado de saída:
- `REFACTORING_IN_PROGRESS` encerrado
- retorno a `IMPLEMENTATION_IN_PROGRESS`
- próximo passo recomendado: executar explicitamente `dia 6` da UI-002

## Dia 6 — Experiência, Acessibilidade e PWA da UI-002

Small release: `UI-002 — Shell e navegação responsiva`.

Auditoria executada:
- jornada do shell revisada por semântica, testes de apresentação, classes responsivas e contratos PWA
- navegações mantêm landmarks nomeados, `aria-current`, foco visível, alvos mínimos de 44 px e somente destinos funcionais
- skip link foi validado como primeiro destino do teclado e aponta para conteúdo focalizável sem duplicar `main`
- desktop, tablet e mobile preservam composições específicas sem acesso direto da UI ao Supabase

Resultado TDD:
- RED direcionado confirmou duas lacunas: reserva inferior sem somar safe area e links sem tratamento explícito de movimento reduzido
- RED: 2 falhas e 17 testes preservados
- GREEN direcionado: 3 suítes e 19 testes passaram
- conteúdo móvel passou a reservar `5rem + env(safe-area-inset-bottom)`
- links das navegações passaram a usar `motion-reduce:transition-none`

Experiência PWA:
- manifest permanece ligado aos metadados, com `display: standalone`, ícones raster/maskable e shortcuts somente para fluxos reais
- HTTP local confirmou manifest `200 application/manifest+json` e ícone `200 image/png`
- acesso anônimo a `/dashboard` permaneceu protegido com `307` para `/login`
- nenhum service worker, Workbox, `next-pwa` ou promessa offline foi introduzido

Validação e limitação:
- inspeção visual automatizada não pôde iniciar porque o controle do navegador falhou ao preparar seus arquivos locais; o fallback de controle do Windows depende da mesma conexão indisponível
- limitação classificada como bloqueio leve; revisão semântica, responsiva, HTTP e testes automatizados permaneceram disponíveis
- regressão completa: 43 suítes e 211 testes passaram
- `npm run type-check`, `npm run lint`, `npm audit --audit-level=high` e `npm run build` passaram
- alteração automática de `next-env.d.ts` causada pelo build foi removida do diff
- `rewrite-msgs.sh` permaneceu intacto e fora do escopo

Estado de saída:
- `QUALITY_VALIDATION`
- próximo passo recomendado: executar explicitamente `dia 7` da UI-002

## Dia 7 — Qualidade Final, Segurança, Observabilidade e Entrega da UI-002

Small release: `UI-002 — Shell e navegação responsiva`.

Pipeline final:
- `npm run lint`: passou com 0 warnings
- `npm run type-check`: passou
- `npm run test:ci`: passou com 44 suítes e 212 testes
- `npm audit --audit-level=high`: passou com 0 vulnerabilidades
- `npm run build`: passou com todas as rotas existentes e `ƒ Proxy (Middleware)`
- `git diff --check` passou para o escopo versionado e para as alterações do Dia 7

Correção de gate orientada por teste:
- auditoria encontrou CI restrito a `main`, embora o fluxo Git direcione features para `develop`
- erro e prevenção foram registrados em Erros Recorrentes antes da correção
- RED: `tests/ci-workflow.test.ts` recebeu somente `main`
- GREEN: pushes e pull requests para `main` e `develop` passaram a acionar o mesmo pipeline

Revisão de segurança e threat model:
- componentes e configuração de navegação não acessam Supabase diretamente; integração de logout permanece na composition root por gateway e caso de uso
- logout usa escopo local e destino fixo `/login`; rota desconhecida não ativa destino indevido
- nenhum `any`, ignore de TypeScript, `eval`, `dangerouslySetInnerHTML`, segredo real ou chave privilegiada foi identificado no shell
- o único storage usado pela experiência é `fincontrol.theme`; o único match de `service_role` é placeholder vazio/documentação
- ameaças consideradas: open redirect, exposição de sessão, autorização inferida pela navegação, XSS no shell e sobreposição de conteúdo mobile
- mitigações: redirects fixos, ausência de logs sensíveis, proteção server-side independente da UI, renderização React, safe area e rotas limitadas a fluxos reais

Baseline de observabilidade:
- CI registra lint, type-check, testes, audit e build em branches de integração e release
- loading, erro e sucesso do logout são anunciáveis; fallback de rota privada desconhecida é neutro
- nenhum evento analítico novo foi criado; instrumentação futura não pode registrar e-mail, cookies, JWT ou dados financeiros

Riscos residuais:
- inspeção visual automatizada do Dia 6 permaneceu indisponível por falha ambiental; risco não crítico coberto parcialmente por testes semânticos e responsivos
- pinagem das GitHub Actions por SHA permanece dívida baixa já registrada para hardening de CI
- nenhum bloqueio crítico ou dívida crítica/alta aberta para a entrega incremental da UI-002

Preparação de release:
- escopo liberável: sidebar desktop, rail tablet, navegação inferior mobile, topbar, estado ativo, tema, logout, teclado, safe area e experiência PWA coerente
- fora da release: rotas futuras, busca, notificações, perfil, configurações, botão Adicionar, drawers, gráficos, IA e offline
- nenhum deploy, push, PR, migration, alteração Supabase ou dado persistente foi executado
- alteração automática de `next-env.d.ts` causada pelo build foi removida do diff
- `rewrite-msgs.sh` permaneceu intacto e fora do escopo

Estado de saída:
- `READY_FOR_RELEASE`
- UI-002 concluída sem avanço automático para outra small release
- próximo passo recomendado: selecionar explicitamente a próxima small release do backlog

## Dia 1 — Contexto, Discovery e Arquitetura da SR-009

Small release: `SR-009 — Persistência e RLS de contas`.

Pré-requisitos confirmados:
- SR-007 concluiu domínio, caso de uso e UI local de contas
- SR-008 concluiu autenticação e sessão protegida
- usuário confirmou login real no Chrome após limpar o cache do navegador
- projeto Supabase `fin_control` está ativo e saudável
- inspeção MCP encontrou Postgres 17, uma identidade Auth, nenhuma tabela pública e nenhuma migration

Objetivo refinado:
- substituir a sessão efêmera de contas por persistência real
- garantir que cada usuário permanente crie e liste somente suas próprias contas
- estabelecer a primeira fronteira financeira com grants mínimos, RLS e testes de isolamento

Escopo aprovado:
- tabela `public.financial_accounts`
- criação de conta própria
- listagem determinística de contas próprias
- reidratação de ID e timestamps
- repository e mapper Supabase isolados em `accounts/infrastructure`
- Server Component para leitura e Server Action para criação
- migration, grants, RLS, índice e testes pgTAP executados pelo Supabase MCP nas fases adequadas

Fora do escopo:
- edição, exclusão ou arquivamento de conta
- instituição, agência, conta principal e múltiplas moedas
- saldo atual persistido
- persistência de categorias e transações
- Realtime, triggers e funções privilegiadas
- idempotência de criação nesta small release

Schema aprovado:
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `name text not null`, aparado e entre 1 e 80 caracteres
- `type text not null` com check para os cinco tipos existentes
- `initial_balance_in_cents bigint not null` no intervalo seguro do JavaScript
- `currency text not null default 'BRL'` com check para `BRL`
- `created_at` e `updated_at` como `timestamptz not null default now()`
- índice `(user_id, created_at desc, id desc)`
- nomes duplicados permitidos; `current_balance` não existe

Grants e RLS aprovados:
- revogar defaults de `anon`, `authenticated` e `service_role` na tabela da feature
- conceder somente `SELECT` e `INSERT` a `authenticated`
- habilitar e forçar RLS
- policy separada de `SELECT` com ownership por `(select auth.uid()) = user_id`
- policy separada de `INSERT` com o mesmo ownership em `WITH CHECK`
- bloquear JWT com `is_anonymous = true`
- não criar grants ou policies de `UPDATE` e `DELETE`
- tabela, constraints, índice, grants e policies devem compor a mesma migration

Contratos entre camadas:
- `FinancialAccount.restore()` ou nome equivalente reidrata ID e timestamps por TDD
- `AccountRepository.create` persiste uma entidade válida
- `AccountRepository.listByUser` lista as contas do ator
- `findById` opcional não será antecipado sem consumidor
- `SupabaseAccountRepository` e mapper ficam em infrastructure
- composition roots revalidam claims e injetam o ator; UI não define ownership
- presentation recebe DTOs serializáveis e callbacks, sem importar Supabase

Threat model:
- BOLA/IDOR: RLS por `auth.uid()` em todas as operações concedidas
- owner forjado pelo navegador: Server Action revalida claims e `INSERT WITH CHECK` rejeita outro `user_id`
- acesso anônimo: sem grant para `anon` e bloqueio adicional de `is_anonymous`
- exposição automática pela Data API: grants explícitos e RLS na mesma migration
- mass assignment: nenhuma permissão de update; ID, owner, moeda e timestamps não são editáveis
- bypass privilegiado: aplicação não usa `service_role`
- vazamento por Realtime: tabela não participa de publication nesta SR
- exclusão: apagar usuário Auth remove suas contas; futura FK de transações deve restringir exclusão de conta

Estratégia TDD para o Dia 2:
- testes de reidratação e invariantes do domínio
- testes de `CreateAccountUseCase` e `ListAccountsUseCase` com ator verificado
- testes de mapper e repository para `snake_case`, `bigint` e timestamps
- testes de composição que rejeitam ausência de claims e owner forjado
- pgTAP transacional para schema, constraints, grants, usuário A, usuário B, `anon`, usuário anônimo, `UPDATE` e `DELETE` negados
- primeira execução deve falhar porque migration, repository e novos contratos ainda não existem

Estratégia operacional aprovada:
- Supabase MCP é o único canal de banco desta execução
- nenhuma instalação de CLI ou Docker e nenhuma branch paga
- Dia 2 cria os testes; Dia 3 poderá aplicar a migration somente após RED válido e nova aprovação da fase
- SQL aplicado será espelhado em `supabase/migrations/` com a versão registrada pelo histórico MCP
- testes de banco ficarão em `supabase/tests/database/`
- migrations são forward-only; rollback destrutivo exige backup/export e autorização explícita

Auditoria Supabase:
- changelog de 2026 confirma grants explícitos para exposição pela Data API em novos projetos/configurações
- pgtap está disponível, mas não instalado
- advisors de performance não reportaram achados
- advisor de segurança reportou proteção contra senhas vazadas desativada
- pendência `SEC-AUTH-001` registrada no backlog

Artefatos atualizados:
- `adr/0004-financial-accounts-persistence-rls.md`
- `architecture.md`
- `database-model.md`
- `domain-model.md`
- `module-contracts.md`
- `backlog.md`
- `roadmap.md`
- `quality-gates.md`
- `project-context.md`

Estado de saída:
- `ARCHITECTURE_READY`
- nenhuma migration, tabela, policy, teste ou código funcional foi criado
- próximo passo recomendado: executar `dia 2` da SR-009

## Dia 2 — Estratégia de Testes e Fundação TDD da SR-009

Small release: `SR-009 — Persistência e RLS de contas`.

Matriz criada:
- domínio: reidratação de `FinancialAccount` preservando metadados e reaplicando as invariantes existentes
- aplicação: `ListAccountsUseCase` validando e normalizando o ator antes de `listByUser`
- infrastructure: mapper `snake_case`, repository `create/listByUser`, ordenação determinística e erros sanitizados
- composição: Server Action revalida claims, ignora owner forjado e bloqueia claims ausentes, inválidas ou anônimas
- banco: schema, constraints, grants efetivos, policies e isolamento entre usuário A, usuário B, `anon` e usuário anônimo do Auth

Testes Jest criados ou alterados:
- `src/features/accounts/tests/financial-account.entity.test.ts`
- `src/features/accounts/tests/list-accounts.use-case.test.ts`
- `src/features/accounts/tests/supabase-account.mapper.test.ts`
- `src/features/accounts/tests/supabase-account.repository.test.ts`
- `src/features/accounts/tests/create-account.action.test.ts`

Testes de banco criados:
- `supabase/tests/database/financial_accounts_schema.test.sql` — 38 testes
- `supabase/tests/database/financial_accounts_constraints.test.sql` — 13 testes
- `supabase/tests/database/financial_accounts_rls.test.sql` — 17 testes

Etapa vermelha local:
- cinco suítes direcionadas falharam pela ausência deliberada de `FinancialAccount.restore`, `ListAccountsUseCase`, mapper, repository e Server Action
- o type-check falhou somente pelas mesmas seis referências ausentes planejadas
- a rede anterior, excluindo os testes RED da SR-009, passou com 32 suítes e 135 testes
- `npm run lint` passou sem warnings
- `npm audit --omit=dev` passou com 0 vulnerabilidades
- build não foi executado porque o type-check permanece vermelho por desenho TDD

Etapa vermelha no Supabase MCP:
- somente a suíte estrutural foi executada em transação
- pgTAP reportou 34 falhas de 38 pela ausência de `public.financial_accounts`
- as quatro verificações negativas compatíveis com banco vazio passaram sem tornar a suíte verde
- após `ROLLBACK`, o MCP confirmou zero tabelas públicas, zero migrations e `pgtap` com `installed_version = null`
- constraints e RLS comportamentais permanecem escritas, mas não foram executadas contra tabela ausente para evitar falha pouco diagnóstica

Implementação bloqueada até o Dia 3:
- `FinancialAccount.restore`
- `AccountRepository.listByUser`
- `ListAccountsUseCase`
- mapper e `SupabaseAccountRepository`
- Server Action e composição persistente da rota
- migration com tabela, constraints, índice, grants e RLS

Limites preservados:
- nenhuma migration aplicada ou criada
- nenhuma tabela, policy, grant ou extensão persistente criada
- nenhuma UI ou regra de negócio nova implementada
- nenhum Supabase CLI, Docker, branch paga ou `service_role` usado
- Supabase MCP permaneceu como único canal de banco

Estado de saída:
- `TEST_STRATEGY_READY`
- próximo passo recomendado: executar `dia 3 da SR-009`

## Dia 3 — Implementação Mínima Orientada por Teste da SR-009

Small release: `SR-009 — Persistência e RLS de contas`.

Implementação mínima:
- `FinancialAccount.restore` reidrata ID e timestamps reaplicando as invariantes existentes
- `AccountListingRepository` segrega o contrato de leitura sem acoplar o provider local temporário
- `ListAccountsUseCase` normaliza o ator verificado antes de listar
- mapper converte explicitamente entre domínio e colunas `snake_case`
- `SupabaseAccountRepository` implementa `create` e `listByUser`, ordena por `created_at desc, id desc` e sanitiza falhas do provider
- `createAccountAction` valida claims em cada chamada, rejeita Auth anônimo, ignora owner fornecido pelo cliente e revalida `/accounts`
- nenhuma UI existente foi conectada à persistência; essa composição visual continua reservada ao Dia 4 e deve nascer com testes de apresentação

Banco aplicado exclusivamente pelo Supabase MCP:
- migration remota `20260714053335_create_financial_accounts` aplicada uma única vez
- SQL espelhado em `supabase/migrations/20260714053335_create_financial_accounts.sql`
- tabela `public.financial_accounts` com oito colunas, FK `auth.users` com cascade, quatro constraints, índice composto, RLS enabled/forced e exatamente duas policies
- `authenticated` recebe somente `SELECT` e `INSERT`; `anon`, Auth anônimo, `service_role` e `PUBLIC` não recebem acesso de aplicação
- nenhuma publicação Realtime, trigger, função privilegiada ou extensão de teste persistente

Evidência TDD local:
- primeiro ciclo após implementação: 4 suítes verdes; a suíte da action expôs ausência de `TextEncoder` ao carregar `next/cache`
- segundo ciclo: carregamento dinâmico de `next/cache` isolou o runtime, mas revelou que o transformador não elevava o mock estático do client Supabase
- harness corrigido com `jest.requireMock()`/`jest.requireActual()`, sem alterar as expectativas de segurança
- testes direcionados: 5 suítes e 35 testes passaram
- suíte completa: 37 suítes e 170 testes passaram

Evidência pgTAP transacional:
- schema e grants: 38/38 testes passaram
- constraints e defaults: 13/13 testes passaram
- RLS e isolamento: 17/17 testes passaram
- fixtures de Auth e contas foram revertidas; tabela permaneceu com zero linhas
- `pgtap` permaneceu com `installed_version = null`

Quality gates:
- `npm run lint`: passou sem warnings
- `npm run type-check`: passou
- `npm run test:ci`: passou com 37 suítes e 170 testes
- `npm run build`: passou; `/accounts` permaneceu dinâmica
- `npm audit --omit=dev`: passou com 0 vulnerabilidades

Advisors e riscos:
- segurança manteve somente `auth_leaked_password_protection`, já rastreado em `SEC-AUTH-001`
- performance reportou `auth_rls_initplan` nas duas policies mesmo com as funções Auth em subconsultas; nenhuma segunda migration foi criada porque migrations iterativas estavam bloqueadas nesta fase
- investigação e eventual migration forward-only foram registradas como `DB-PERF-001` para hardening
- idempotência de submissão e conexão da UI persistente continuam fora deste incremento mínimo

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- Dia 3 concluído sem avanço automático
- próximo passo recomendado: executar `dia 4 da SR-009`

## Dia 4 — Expansão Controlada da SR-009

Small release: `SR-009 — Persistência e RLS de contas`.

Expansão entregue:
- rota `/accounts` passou a carregar a listagem persistida em Server Component dinâmico
- `listAccountsAction` e `createAccountAction` validam claims em cada chamada e retornam DTOs sem expor `userId` à apresentação
- `AccountsPage` inicia com as contas do servidor e atualiza o estado visual apenas com o registro persistido retornado pela action
- formulário deixou de receber owner controlado pelo cliente; o usuário é derivado exclusivamente da identidade verificada no servidor
- lista persistente recebeu estados de conteúdo e vazio; cópias de sessão temporária foram removidas
- arquivos de rota `loading.tsx` e `error.tsx` adicionaram feedback acessível de carregamento, erro sanitizado e nova tentativa

Evidência TDD:
- RED direcionado: 4 suítes falharam, com 7 testes expondo composição ainda local, retorno ausente da action, listagem ausente e estados de rota ausentes
- GREEN direcionado: 4 suítes e 16 testes passaram
- suíte completa: 37 suítes e 174 testes passaram
- o primeiro type-check/lint encontrou somente ruído de tipos e binding não utilizado no harness; as correções foram registradas na seção de erros recorrentes e os gates foram repetidos

Validação no Chrome autenticado:
- `/accounts` abriu na sessão real do usuário e exibiu formulário, heading `Suas contas` e empty state persistente
- cópias antigas de sessão temporária não estavam presentes
- viewport desktop e mobile `390x844` foram inspecionadas; mobile não apresentou overflow horizontal
- campos de nome e saldo permaneceram obrigatórios e a submissão vazia foi bloqueada pela validação nativa, sem chamada de gravação
- console do Chrome não apresentou warnings ou errors
- nenhuma conta foi criada durante a inspeção; a guia `/accounts` permaneceu aberta como entrega

Supabase MCP somente leitura:
- `public.financial_accounts` permaneceu com zero registros após toda a validação
- migrations remotas permaneceram limitadas a `20260714053335_create_financial_accounts`
- nenhuma migration, policy, grant, schema ou dado foi alterado no Dia 4

Quality gates:
- `npm run lint`: passou sem warnings
- `npm run type-check`: passou
- `npm run test:ci`: passou com 37 suítes e 174 testes
- `npm run build`: passou; `/accounts` permaneceu dinâmica e o Proxy ativo
- `npm audit --omit=dev`: passou com 0 vulnerabilidades

Limites e riscos preservados:
- edição, exclusão, arquivamento, categorias, transações, idempotência e segunda migration continuaram fora do escopo
- `AccountSessionProvider` legado permanece composto no layout privado, mas deixou de participar da página persistente; remoção segura foi reservada ao Dia 5
- `SEC-AUTH-001` e `DB-PERF-001` permanecem rastreados, sem novo risco crítico introduzido

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- Dia 4 concluído sem avanço automático
- próximo passo recomendado: executar `dia 5 da SR-009`

## Dia 5 — Refatoração, Consistência e Hardening Interno da SR-009

Small release: `SR-009 — Persistência e RLS de contas`.

Diagnóstico estrutural:
- nenhum arquivo de produção da feature foi classificado como monólito crítico; `AccountForm.tsx`, com 175 linhas, permanece coeso como renderização do formulário
- `AccountSessionProvider` não possuía consumidor no fluxo persistente e apenas envolvia desnecessariamente todo o layout privado
- `AccountSessionList` conservava nomenclatura de sessão embora já recebesse exclusivamente DTOs persistidos
- contratos de criação e listagem continuam segregados porque seus casos de uso têm consumidores distintos; unificá-los criaria acoplamento sem ganho
- `DB-PERF-001` foi reproduzido pelo advisor nas duas policies devido ao formato da chamada de `auth.jwt()`

Plano incremental executado:
1. validar a suíte de accounts antes das alterações
2. remover provider e testes exclusivos do estado local obsoleto
3. renomear a lista para refletir o contrato persistente
4. escrever regressão pgTAP de performance antes de alterar policies
5. aplicar migration forward-only somente após RED comprovado
6. repetir isolamento, constraints, advisors e pipeline local

Refatoração local:
- `AccountSessionProvider` foi removido do layout privado e do código da feature
- a suíte exclusiva do provider local foi removida junto com o comportamento obsoleto
- `AccountSessionList` foi substituída por `AccountList`, sem alterar estados visuais ou contrato de DTO
- baseline de accounts passou com 10 suítes e 53 testes; após a remoção do código morto, a feature passou com 9 suítes e 49 testes ativos

Hardening RLS orientado por teste:
- novo teste `financial_accounts_rls_performance.test.sql` falhou 2/2 contra as policies anteriores
- documentação atual do Supabase confirmou que cada função Auth deve ser envolvida diretamente por `select` para gerar initPlan por statement
- migration remota `20260714061527_optimize_financial_accounts_rls_auth_initplan` recriou atomicamente as duas policies usando `(select auth.jwt())`
- SQL remoto foi espelhado no arquivo local com a mesma versão
- autorização permaneceu idêntica: owner obrigatório, Auth anônimo bloqueado e somente `SELECT`/`INSERT` concedidos

Validação de banco pelo Supabase MCP:
- schema e grants: 38/38
- constraints e defaults: 13/13
- RLS e isolamento: 17/17
- performance RLS: 2/2
- total pgTAP: 70 testes verdes
- Performance Advisor: nenhum alerta após a migration; `DB-PERF-001` concluído
- Security Advisor: somente `SEC-AUTH-001` permanece
- tabela permaneceu com zero registros e `pgtap` permaneceu não instalado após os rollbacks

Quality gates:
- `npm run type-check`: passou
- `npm run lint`: passou sem warnings
- `npm run test:ci`: passou com 36 suítes e 170 testes
- `npm audit --omit=dev`: passou com 0 vulnerabilidades
- `npm run build`: passou com `/accounts` dinâmica e Proxy ativo

Limites preservados:
- nenhuma regra financeira, estado visual ou feature nova foi criada
- edição, exclusão, arquivamento, categorias, transações e idempotência permaneceram fora do escopo
- nenhuma abstração genérica ou divisão cosmética do formulário foi criada
- `SEC-AUTH-001` permanece como hardening externo antes de produção pública

Estado de saída:
- `REFACTORING_IN_PROGRESS` encerrado
- retorno a `IMPLEMENTATION_IN_PROGRESS`
- Dia 5 concluído sem avanço automático
- próximo passo recomendado: executar `dia 6 da SR-009`

## Dia 6 — Experiência, Acessibilidade e PWA da SR-009

Small release: `SR-009 — Persistência e RLS de contas`.

Auditoria e ajustes aplicados:
- o fluxo persistente de contas manteve labels, campos obrigatórios nativos, foco visível, estados `loading`, `empty`, `success` e `error` e alvos mínimos existentes
- o alerta de erro do formulário passou a usar `text-red-700` sobre `bg-red-50`, alinhado ao contraste WCAG AA essencial já adotado no login
- página, loading e error boundary de `/accounts` passaram a combinar `min-h-screen` com `min-h-dvh`
- a região viva `Suas contas` passou a declarar `aria-relevant="additions text"` para anunciar inclusões persistidas sem ruído desnecessário
- o shortcut PWA de contas deixou de descrever o fluxo como local e passou a declarar o fluxo persistente
- offline e service worker permaneceram fora do escopo porque não existe estratégia aprovada de consistência para dados financeiros autenticados

Ciclo TDD:
- RED direcionado: 4 suítes falharam, com 5 falhas esperadas e 7 testes da rede anterior passando
- GREEN direcionado: 4 suítes e 12 testes passaram
- suíte completa: 36 suítes e 170 testes passaram

Quality gates:
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm run test:ci`: passou, 36 suítes e 170 testes
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou; `/accounts` permaneceu dinâmica e `ƒ Proxy (Middleware)` ativo
- `git diff --check`: passou; alteração gerada de `next-env.d.ts` foi restaurada

Desbloqueio e validação no Chrome:
- o plugin Chrome foi reinstalado na versão `26.707.72221`, com `scripts/browser-client.mjs` presente e comunicação restabelecida
- a sessão autenticada em `http://localhost:3000` foi reconhecida e `/accounts` carregou duas contas persistidas sem nova submissão
- desktop validado em `1366x543`: composição em duas colunas, sem overflow horizontal, formulário com `430px` e região de contas com `690px`
- mobile validado em `390x844`: composição empilhada, margens de `16px`, `min-height` dinâmica de `844px` e sem overflow horizontal
- inputs, select, submit, retorno e logout mediram `44px` de altura
- região `Suas contas` expôs `aria-live="polite"` e `aria-relevant="additions text"`
- manifesto vinculado em `/manifest.webmanifest` respondeu `200` como `application/manifest+json`, declarou `display: standalone`, quatro ícones e shortcut persistente de contas
- console do Chrome não registrou warnings ou errors durante a inspeção
- nenhuma conta foi criada, editada ou excluída durante a validação

Estado de saída:
- `QUALITY_VALIDATION`
- Dia 6 concluído sem avanço automático
- próximo passo recomendado: executar `dia 7 da SR-009`

## Dia 7 — Qualidade Final, Segurança, Observabilidade e Entrega da SR-009

Small release: `SR-009 — Persistência e RLS de contas`.

Pipeline local validado:
- `npm run lint`: passou, 0 warnings
- `npm run type-check`: passou
- `npm run test:ci`: passou, 36 suítes e 170 testes
- `npm audit --audit-level=high`: passou, 0 vulnerabilidades
- `npm run build`: passou; `/accounts` permaneceu dinâmica e `ƒ Proxy (Middleware)` ativo
- `git diff --check`: passou após restaurar a alteração mecânica de `next-env.d.ts`

Validação remota via Supabase MCP:
- projeto `fin_control` permaneceu `ACTIVE_HEALTHY`, com as migrations `20260714053335_create_financial_accounts` e `20260714061527_optimize_financial_accounts_rls_auth_initplan`
- quatro suítes pgTAP transacionais passaram: 38 schema + 13 constraints + 17 RLS + 2 performance = 70 asserções
- rollback preservou as duas contas existentes e removeu a extensão pgTAP temporária; nenhuma alteração persistente de schema ou dados foi realizada
- RLS permanece habilitada e forçada, com duas policies; índice composto de owner/ordenação presente
- `authenticated` mantém somente `SELECT` e `INSERT`; `anon`, `UPDATE` e `DELETE` permanecem sem privilégio
- Performance Advisor retornou sem alertas
- Security Advisor manteve somente `auth_leaked_password_protection`, já registrado como `SEC-AUTH-001`

Threat model revisado:
- BOLA/IDOR: owner é derivado da identidade verificada e isolado por RLS
- owner forjado e mass assignment: DTO público não recebe `user_id`; policy `WITH CHECK` exige o owner autenticado
- acesso anônimo: bloqueado por grants e por claim `is_anonymous`
- escalada privilegiada: aplicação não usa `service_role`; UI não acessa Supabase diretamente
- mutações fora do escopo: ausência deliberada de grants e policies de `UPDATE`/`DELETE`
- risco residual: proteção contra senhas vazadas, rate limit/antiabuso e headers HTTP devem ser tratados antes do primeiro deploy público

Baseline de observabilidade:
- CI registra resultado e duração dos gates sem segredos
- eventos futuros permitidos: `accounts_list_load`, `accounts_list_failure`, `account_create_attempt`, `account_create_success` e `account_create_failure`
- atributos permitidos: ambiente, release, rota, resultado técnico e classe sanitizada do erro
- proibido registrar nome/saldo da conta, e-mail, UUID de usuário, JWT, cookies, senha, payload bruto ou mensagem bruta do provedor
- captura de erros, redaction, teste sintético autenticado e alertas operacionais permanecem em `HARD-OBS-001` antes de deploy público

Release incremental preparada:
- escopo liberável: criar e listar contas próprias com autenticação, grants mínimos e RLS por proprietário
- edição, exclusão, arquivamento, categorias, transações persistidas, idempotência e offline permanecem fora do escopo
- nenhum deploy, commit, push, migration, alteração de configuração Auth ou mutação de dados foi executado no Dia 7

Estado de saída:
- `READY_FOR_RELEASE`
- nenhum bloqueio crítico para entrega incremental de código
- deploy público continua condicionado a `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001`
- próxima small release não iniciada; requer seleção e comando explícitos

## Dia 7 — Qualidade Final, Segurança, Observabilidade e Entrega da SR-008

Small release: `SR-008 — Autenticação e sessão protegida`.

Validação executada:
- `npm ci`: passou, lockfile reproduzido com 754 pacotes e 0 vulnerabilidades
- `npm run lint`: passou, 0 warnings
- `npm run type-check`: passou
- `npm run test:ci`: passou, 33 suítes e 153 testes
- `npm audit --audit-level=high`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/login` estática, rotas privadas dinâmicas e `Proxy (Middleware)`
- `git diff --check`: passou antes do registro documental final

Hardening de release aplicado:
- Node foi limitado a `>=22 <23` e npm a `>=11 <12`; `packageManager` fixa npm `11.5.2`
- o CI instala npm `11.5.2` antes do `npm ci`
- o CI passou a exercitar `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, mantendo o fallback legado apenas como compatibilidade testada
- nenhuma regra de negócio, interface ou contrato de autenticação foi alterado

Revisão de segurança:
- claims são verificadas no servidor e erros de configuração, client ou sessão falham fechados
- redirects possuem destinos fixos, sem parâmetro aberto controlado pelo usuário
- login e logout preservam mensagens públicas genéricas e não enumeram usuários
- somente `.env.example` está versionado entre arquivos de ambiente
- não foram encontrados segredos versionados, uso de service role no código, `eval`, `dangerouslySetInnerHTML`, `localStorage` ou `sessionStorage`
- apresentação não acessa Supabase; integração permanece isolada em infrastructure e `src/lib/supabase`

Threat model e riscos residuais:
- existe uma service role key não vazia no `.env.local`, mas o arquivo está ignorado, a variável não é referenciada e nenhum valor foi exposto; remover se desnecessária e rotacionar caso já tenha sido compartilhada
- `getClaims()` valida assinatura e expiração, mas revogação remota imediata deve ser reavaliada antes de operações financeiras sensíveis
- rate limits, CAPTCHA/MFA e política antiabuso dependem da configuração externa do Supabase e devem ser validados antes de produção pública
- CSP e demais headers de segurança dependem do ambiente de deploy e ficaram registrados no backlog de hardening
- testes específicos de composição dos containers e layout privado seguem como melhoria não bloqueante; contratos, políticas, Proxy e fluxos de UI já possuem cobertura essencial

Baseline de observabilidade:
- a entrega atual usa CI, falhas explícitas de configuração e estados acessíveis de erro como sinais mínimos
- futura telemetria deve separar `invalid_credentials`, `provider_unavailable`, `invalid_session`, `invalid_config` e `unexpected`
- propriedades permitidas: resultado enumerado, superfície, faixa de duração, release e ambiente
- ficam proibidos: e-mail, senha, JWT, cookies, Authorization, user ID bruto, URL/chave Supabase e erro bruto
- session replay deve permanecer desativado ou integralmente mascarado na área financeira
- deploy público fica bloqueado até monitoramento sanitizado, redaction validada e teste sintético

Limitação de verificação externa:
- a consulta ao changelog e à documentação oficial atual do Supabase excedeu o tempo disponível e não entrou em repetição automática
- as versões `@supabase/ssr@0.12.0` e `@supabase/supabase-js@2.110.1` estão fixadas
- nenhuma API de runtime, migration, grant ou política RLS foi alterada no Dia 7; a validação local e o checklist de segurança permaneceram suficientes para esta release de código-fonte

Escopo liberável:
- login por e-mail/senha de usuário existente
- logout local
- identidade verificada no browser e no servidor
- refresh de sessão pelo Proxy
- proteção das rotas privadas e redirecionamentos fixos
- experiência acessível, responsiva e instalável da autenticação

Fora da release:
- cadastro, recuperação de senha, OAuth, telefone, MFA e confirmação de e-mail
- migrations financeiras, persistência de contas, grants, RLS e isolamento multiusuário no banco
- deploy público e configuração de monitoramento externo

Decisão final:
- riscos críticos: nenhum dentro do escopo da SR-008
- dívidas e hardenings residuais: registrados no `backlog.md`
- release local/de código-fonte: aprovada
- release remota: condicionada a push e CI verde
- deploy público: não autorizado e bloqueado até os gates pré-produção documentados
- estado final: `READY_FOR_RELEASE`

## Dia 4 — Expansão Controlada da SR-008

Small release: `SR-008 — Autenticação e sessão protegida`.

TDD e apresentação:
- testes foram criados antes de `LoginPage`, `SignOutButton`, `AuthSessionProvider`, route groups e Proxy
- etapa vermelha: 6 suítes falharam exclusivamente por módulos planejados ainda ausentes
- login acessível com e-mail/senha, estados `idle`, `loading`, `success` e `error`, prevenção de envio duplicado e mensagem genérica
- logout da sessão corrente com progresso, sucesso, erro controlado e redirecionamento fixo

Composição e proteção:
- `/login` pertence ao route group público
- `/`, `/dashboard`, `/accounts` e `/transactions` pertencem ao route group privado, sem mudança de URL
- layout privado valida identidade por `GetCurrentUserUseCase`, usa `dynamic = "force-dynamic"` e redireciona ausência de identidade para `/login`
- `AuthSessionProvider` fornece `id` e `email` verificados às páginas; IDs demonstrativos foram removidos
- providers de contas e transações foram movidos do layout raiz para o layout privado
- containers em `src/app` compõem casos de uso e infraestrutura; componentes da apresentação recebem callbacks e não acessam Supabase
- `middleware.ts` e o adapter legado foram removidos; `src/proxy.ts` compõe `src/lib/supabase/proxy.ts`

Correção governada:
- o primeiro `proxy.ts` foi colocado na raiz, embora o projeto use `src/app`
- o build passou sem declarar o Proxy, evidenciando que a fronteira não estava ativa
- o erro e a prevenção foram registrados antes da correção
- o arquivo foi movido para `src/proxy.ts`; o build passou a declarar `ƒ Proxy (Middleware)`

Validações:
- etapa verde direcionada: 9 suítes e 22 testes
- suíte completa: 32 suítes e 146 testes
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --audit-level=high`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/login`, `/`, `/accounts`, `/dashboard`, `/transactions` e Proxy
- inspeção visual reexecutada em 2026-07-13: o navegador integrado ficou disponível, mas bloqueou `http://localhost:3000/login` e `http://127.0.0.1:3000/login` com `ERR_BLOCKED_BY_CLIENT` antes do carregamento; não havia outro navegador conectado, então testes de apresentação, revisão semântica e build permaneceram como evidência

Limites preservados:
- nenhuma migration, tabela financeira, política RLS ou persistência real
- nenhum cadastro, recuperação de senha, OAuth, telefone, OTP ou MFA
- nenhuma `service_role`, secret key ou autorização por `user_metadata`
- nenhuma expansão para cartões, parcelas, IA, importação ou Open Finance

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- próximo passo recomendado: executar `dia 5`

### Correção crítica antes do Dia 5 — configuração inválida do Supabase

Incidente reproduzido em 2026-07-13:
- ao abrir o app, o Proxy tentou criar o client SSR com uma `NEXT_PUBLIC_SUPABASE_URL` presente, porém sem formato HTTP/HTTPS válido
- `createServerClient` lançou `Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL`
- a exceção escapou de `updateSupabaseSession` antes da política de rotas e produziu erro global de runtime

Regra ajustada antes da correção:
- falhas de configuração, inicialização do client ou leitura de claims devem ser tratadas como sessão não autenticada, sem expor valores de ambiente
- rotas privadas devem redirecionar para `/login`; a própria rota `/login` deve continuar renderizável para permitir recuperação operacional
- autenticação real permanece indisponível até a URL local ser corrigida para a Project URL HTTPS fornecida pelo Supabase

Estado operacional:
- `BUG-001` concluído por TDD: dois testes falharam em RED pela exceção não tratada e passaram após o fallback seguro
- teste direcionado: 1 suíte e 6 testes verdes
- suíte completa: 32 suítes e 148 testes verdes
- lint, type-check e build verdes; build declarou `ƒ Proxy (Middleware)`
- validação HTTP com o `.env.local` malformado: `/` respondeu `307` para `/login` e `/login` respondeu `200`, sem erro 500
- pendência externa: substituir `NEXT_PUBLIC_SUPABASE_URL` pela Project URL HTTPS real para habilitar login
- Dia 5 permanece pausado e pode ser retomado por comando explícito do usuário

## Dia 5 — Refatoração, Consistência e Hardening Interno da SR-008

Auditoria estrutural:
- `LoginPage.tsx` tem 136 linhas e permanece focado no formulário e seus estados; divisão adicional não reduziria responsabilidade
- `src/lib/supabase/proxy.ts` concentra cookies, claims e decisão de rota; extração cosmética foi rejeitada
- a duplicação real estava na resolução divergente de URL e chave pública em browser, server e Proxy
- o matcher do Proxy não excluía formatos genéricos de imagem

Plano incremental executado:
1. caracterizar preferência de chave, fallback legado, validação segura de URL e matcher
2. criar `src/lib/supabase/config.ts`
3. migrar browser, server e Proxy para o módulo compartilhado
4. ampliar exclusão de assets sem alterar rotas de aplicação

TDD e melhorias:
- RED: 2 suítes falharam pelo módulo ausente e matcher antigo
- GREEN direcionado: 3 suítes e 11 testes
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` passou a ser preferida; `ANON_KEY` permanece fallback temporário
- valores são normalizados; URL aceita apenas HTTP/HTTPS e erros não revelam o conteúdo
- imagens SVG, PNG, JPG, JPEG, GIF e WebP não atravessam o Proxy
- nenhuma regra de negócio, migration, persistência, RLS ou fluxo de autenticação novo foi criado

Integridade, consistência e performance:
- domínio, aplicação e apresentação não ganharam dependência de Supabase
- tratamento fail-closed do Proxy foi preservado
- nenhum estado visual foi alterado; design system existente permaneceu consistente
- assets estáticos deixam de pagar o custo desnecessário de inicialização do Auth

Quality gates:
- `npm run test:ci`: 33 suítes e 152 testes verdes
- `npm run lint`: verde, 0 warnings
- `npm run type-check`: verde
- `npm audit --audit-level=high`: 0 vulnerabilidades
- `npm run build`: verde com `ƒ Proxy (Middleware)`
- runtime local: `/` retornou `307` para `/login`; `/login` e `/icon.svg` retornaram `200`

Bloqueio de configuração resolvido:
- `NEXT_PUBLIC_SUPABASE_URL` foi validada como URL HTTPS hospedada no Supabase e sem marcadores de placeholder
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` está presente e foi selecionada pelo contrato preferencial
- endpoint público `/auth/v1/settings` respondeu `200`, sem registrar URL ou chave
- runtime local permaneceu correto: `/` retornou `307` para `/login`; `/login` e `/icon.svg` retornaram `200`

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- Dia 5 concluído sem dívida técnica crítica ou alta aberta
- próximo passo recomendado: executar `dia 6`

## Dia 6 — Experiência, Acessibilidade e PWA da SR-008

Small release: `SR-008 — Autenticação e sessão protegida`.

Auditoria executada:
- apresentação, composição, manifest e assets revisados por acessibilidade, UX, arquitetura e PWA
- arquitetura preservada: `presentation` continua sem acesso direto ao Supabase e `src/app` permanece composition root
- teclado, labels, autocomplete, zoom móvel, foco visível e alvos mínimos de 44 px já estavam adequados
- nenhum service worker ou promessa offline foi adicionado enquanto os dados financeiros permanecem efêmeros

TDD e melhorias:
- RED: testes de `LoginPage` e `SignOutButton` falharam por formulário sem nome, ausência de `aria-busy`, ausência de anúncio de processamento e conteúdo técnico na interface
- GREEN: 2 suítes e 5 testes direcionados passaram
- formulário de login recebeu nome acessível por `aria-labelledby` e estado `aria-busy`
- login e logout anunciam processamento por região `role="status"`
- instrução deixou de expor o detalhe técnico `Supabase Auth`
- slogan deixou de criar um `h2` anterior ao `h1`
- alerta de credenciais passou de `text-danger` sobre `red-50` para `text-red-700`, elevando o contraste acima do limiar AA de texto normal
- `min-h-dvh` foi adicionado com `min-h-screen` como fallback para viewport móvel dinâmica

PWA:
- RED: o teste do manifest falhou porque existia somente o SVG declarado como `any maskable`
- GREEN: manifest e quatro assets rasterizados foram validados
- adicionados ícones PNG `192x192`, `512x512`, maskable `512x512` e Apple Touch `180x180`
- SVG comum passou a `purpose: any`; ícone maskable ganhou fundo de sangria completa
- teste verifica formato PNG real, dimensões, existência e metadados do manifest
- offline permaneceu fora do escopo por não existir estratégia segura de consistência para dados financeiros

Validação visual no Chrome:
- cache antigo do Turbopack gerou incompatibilidade de hidratação; o cache `.next` foi preservado em `C:\tmp\controle-financeiro-next-stale-dia6-20260714` e regenerado
- origem local limpa `127.0.0.1` permitiu validar o bundle atual sem reutilizar assets antigos do `localhost`
- desktop `1366px`: card limitado a `1024px`, duas colunas, painel institucional visível e sem overflow horizontal
- mobile `390x844`: uma coluna, painel institucional oculto, margens de `16px`, `min-height` dinâmica e sem overflow horizontal
- nenhum dado de formulário foi submetido durante a inspeção

Quality gates:
- `npm run test:ci`: 33 suítes e 153 testes verdes
- `npm run lint`: verde, 0 warnings
- `npm run type-check`: verde
- `npm audit --audit-level=high`: 0 vulnerabilidades
- `npm run build`: verde com `/login` estática, rotas financeiras dinâmicas e `ƒ Proxy (Middleware)`

Riscos e limites preservados:
- testes de composição de `AuthLoginContainer`, `PrivateAppShell` e defesa do layout privado continuam recomendados para o Dia 7, sem bloquear esta fase
- cadastro, recuperação, OAuth, MFA, migrations financeiras, persistência e RLS não foram antecipados
- nenhuma dívida técnica crítica ou alta foi criada

Estado de saída:
- `QUALITY_VALIDATION`
- próximo passo recomendado: executar `dia 7`

## Dia 3 — Implementação Mínima Orientada por Teste da SR-008

Small release: `SR-008 — Autenticação e sessão protegida`.

Implementação criada:
- `src/features/auth/domain/entities/auth-user.entity.ts`
- `src/features/auth/domain/interfaces/auth.gateway.ts`
- `src/features/auth/application/use-cases/sign-in.use-case.ts`
- `src/features/auth/application/use-cases/sign-out.use-case.ts`
- `src/features/auth/application/use-cases/get-current-user.use-case.ts`
- `src/features/auth/application/policies/auth-route-policy.ts`
- `src/features/auth/infrastructure/supabase/supabase-auth.gateway.ts`
- `src/lib/supabase/proxy.ts`

Escopo entregue:
- entidade `AuthUser` normalizando ID e e-mail e rejeitando identidade inválida
- contrato `AuthGateway` independente de Supabase
- login com normalização de e-mail, preservação da senha e erro genérico de credenciais
- logout local com erro controlado
- leitura de usuário atual verificado
- política pura para `/login` e rotas privadas
- gateway Supabase mapeando usuário, `getClaims()` e `signOut({ scope: "local" })`
- adapter de Proxy renovando sessão, propagando cookies e headers anti-cache e aplicando redirecionamentos fixos
- publishable key aceita como contrato preferencial, com fallback isolado para legacy anon key

Correção orientada pelos gates:
- a primeira execução completa passou nos testes, mas type-check/build detectaram que os headers de `setAll` são `Record<string,string>` no `@supabase/ssr` 0.12
- teste e produção foram corrigidos para o contrato real instalado
- nenhuma asserção foi removida ou afrouxada
- teste de regressão reproduziu o header interno `x-middleware-next: 1` em uma resposta de redirect
- redirects passaram a receber somente cookies e headers anti-cache fornecidos pelo Supabase
- uma execução paralela de build/type-check gerou falha transitória em `.next/types`; os gates finais foram repetidos sequencialmente e passaram

Resultado TDD e quality gates:
- etapa vermelha registrada no Dia 2 com 7 suítes por módulos ausentes
- etapa verde direcionada: 7 suítes e 29 testes passaram
- suíte completa: 28 suítes e 139 testes passaram
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/`, `/accounts`, `/dashboard` e `/transactions`

Validação arquitetural:
- domínio não importa React, Next.js ou Supabase
- aplicação depende somente do contrato `AuthGateway`
- integração Supabase está isolada em `infrastructure` e `src/lib/supabase`
- apresentação existente não importa client Supabase
- política de rotas é pura e testável

Limites preservados:
- nenhuma UI, `/login` ou route group criado
- `middleware.ts` raiz ainda não foi substituído por `proxy.ts`
- nenhuma migration, tabela financeira, persistência ou política RLS
- nenhum cadastro, recuperação de senha, OAuth ou MFA
- nenhum ID demonstrativo foi substituído antes da composição autenticada do Dia 4

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- próximo passo recomendado: executar `dia 4`

## Dia 3 — Implementação Mínima Orientada por Teste da SR-007

Small release: `SR-007 — Cadastro local de conta financeira`.

Implementação criada:
- `src/features/accounts/domain/entities/financial-account.entity.ts`
- `src/features/accounts/domain/interfaces/account.repository.ts`
- `src/features/accounts/application/use-cases/create-account.use-case.ts`

Escopo entregue:
- entidade `FinancialAccount` sem dependência de framework
- tipos `checking`, `savings`, `cash`, `payment` e `investment`
- normalização de `userId` e espaços do nome
- nome obrigatório com limite de 80 caracteres
- saldo inicial positivo, zero ou negativo quando inteiro seguro em centavos
- moeda padrão e exclusiva `BRL`
- contrato `AccountRepository` com `create` obrigatório e `findById` opcional
- `CreateAccountUseCase` validando no domínio e persistindo apenas pelo contrato injetado
- erros do repositório propagados sem ocultação

Resultado TDD:
- etapa vermelha registrada no Dia 2 por módulos ausentes
- `npm run test:ci -- src/features/accounts/tests`: passou com 2 suítes e 21 testes
- `npm run test:ci`: passou com 16 suítes e 90 testes

Resultado dos gates:
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/`, `/dashboard` e `/transactions`

Validação arquitetural:
- domínio não importa React, Next.js ou Supabase
- aplicação depende somente de `AccountRepository`
- nenhuma implementação concreta de repositório foi criada
- nenhum componente, hook, provider ou rota foi criado
- integração mínima desta fase é apenas o contrato injetado

Limites preservados:
- nenhuma autenticação, migration, persistência Supabase ou RLS
- nenhuma integração de contas com transações
- nenhuma listagem, edição ou exclusão de conta
- apresentação e sessão local permanecem reservadas ao Dia 4

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- próximo passo recomendado: executar `dia 4`

## Dia 4 — Expansão Controlada da SR-007

Small release: `SR-007 — Cadastro local de conta financeira`.

Testes criados antes da expansão:
- `src/features/accounts/tests/AccountForm.test.tsx`
- `src/features/accounts/tests/AccountSessionProvider.test.tsx`
- `src/features/accounts/tests/AccountsPage.test.tsx`
- `src/features/accounts/tests/AccountsRoute.test.tsx`
- cenário de navegação para `/accounts` adicionado a `DashboardPage.test.tsx`

Etapa vermelha:
- quatro suítes falharam por ausência de formulário, provider, página e rota
- teste do dashboard falhou pela ausência do link `Contas`
- testes anteriores de domínio e aplicação permaneceram verdes

Implementação criada:
- `AccountForm` com nome, tipo, saldo inicial e estados de envio
- `useAccountForm` orquestrando parsing, validação e feedback
- `parseAccountBalanceToCents` aceitando formatos em reais e saldo negativo
- `AccountSessionProvider` usando `CreateAccountUseCase` e estado somente em memória
- `AccountSessionList` com empty state e lista acessível
- `AccountsPage` compondo cadastro e contas da sessão
- rota `/accounts`
- provider de contas composto no layout raiz
- link `Contas` adicionado ao dashboard

Estados e experiência:
- `idle`, `submitting`, `success` e `error` cobertos
- erro de saldo inválido associado ao campo com `aria-invalid`
- mensagens de sucesso usam `role=status` e falhas usam `role=alert`
- região de contas usa `aria-live=polite`
- interface informa que os dados são temporários e perdidos ao recarregar
- saldo negativo é explicado como saldo informado, não limite de crédito

Resultado TDD e quality gates:
- etapa verde direcionada: 7 suítes e 35 testes passaram
- suíte completa: 20 suítes e 99 testes passaram
- `npm run type-check`: passou após tipagem explícita do mock assíncrono do formulário
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/`, `/accounts`, `/dashboard` e `/transactions`

Limites preservados:
- provider local não acessa Supabase e não persiste após recarga
- nenhuma migration, autenticação ou RLS
- nenhuma edição, exclusão, cálculo de saldo atual ou integração com transações
- nenhuma refatoração ampla de módulos anteriores

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- próximo passo recomendado: executar `dia 5`

## Dia 5 — Refatoração, Consistência e Hardening Interno da SR-007

Small release: `SR-007 — Cadastro local de conta financeira`.

Diagnóstico:
- maior arquivo de produção da feature: `AccountForm.tsx`, com 177 linhas; não caracterizado como monólito crítico
- parsing de moeda duplicado entre `accounts` e `transactions`
- `AccountSessionProvider` armazenava referências recebidas em `initialAccounts`
- conta retornada por `createAccount` compartilhava referência com o estado armazenado
- estilos semelhantes dos formulários permaneceram locais porque ainda existem diferenças reais e não há componente compartilhado estável
- nenhum gargalo de performance ou dependência proibida identificado

Plano aplicado:
1. criar teste para um parser monetário compartilhado com negativo opt-in
2. reproduzir mutação externa da conta inicial e do objeto retornado
3. extrair o parser compartilhado preservando wrappers específicos por feature
4. clonar e congelar contas na fronteira de armazenamento da sessão
5. executar regressão completa e gates

Etapa vermelha:
- teste do parser falhou por módulo compartilhado ausente
- teste da conta inicial recebeu `Conta alterada externamente`
- teste do retorno recebeu `Retorno alterado` após nova renderização

Refatorações e correções:
- criado `src/shared/utils/parseCurrencyToCents.ts`
- `parseTransactionAmountToCents` passou a rejeitar negativos pelo comportamento padrão compartilhado
- `parseAccountBalanceToCents` habilita negativos explicitamente
- provider clona contas iniciais antes de armazenar
- provider armazena uma cópia diferente da conta retornada pelo caso de uso
- cópias mantidas na sessão são congeladas para impedir mutação acidental em runtime
- import runtime de `FinancialAccount` corrigido após o teste direcionado expor o uso apenas como tipo

Resultado dos gates:
- recorte direcionado: 4 suítes e 28 testes passaram
- suíte completa: 21 suítes e 109 testes passaram
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/`, `/accounts`, `/dashboard` e `/transactions`

Integridade e limites:
- comportamento visual preservado
- nenhuma regra financeira, rota ou feature nova
- nenhuma persistência, autenticação, migration ou RLS
- nenhuma dívida técnica crítica ou alta aberta
- extração de estilos genéricos não foi feita sem repetição estável suficiente

Estado de saída:
- `REFACTORING_IN_PROGRESS` encerrado
- retorno a `IMPLEMENTATION_IN_PROGRESS`
- próximo passo recomendado: executar `dia 6`

## Dia 6 — Experiência, Acessibilidade e PWA da SR-006

Small release: `SR-006 — Dashboard financeiro inicial`.

Auditoria executada:
- dashboard e registro manual inspecionados em viewport mobile de 390x844 e desktop de 1280x800
- nenhum overflow horizontal identificado
- landmarks, headings, labels, radiogroup, estados de loading, empty, success e error revisados
- controles do formulário mantêm altura mínima de 44 px
- manifest servido por `link[rel="manifest"]` e metadados de instalação revisados

Resultado TDD:
- teste do estado vazio falhou inicialmente porque a mensagem não era anunciável
- teste do CTA falhou inicialmente pela ausência de alvo mínimo e foco visível consistente
- teste do manifest falhou inicialmente porque o atalho apontava para `/` e a orientação estava bloqueada em retrato
- etapa verde direcionada: 2 suites e 6 testes passaram

Implementação criada ou alterada:
- `src/features/dashboard/presentation/components/DashboardEmptyState.tsx`
- `src/features/dashboard/tests/DashboardPage.test.tsx`
- `public/manifest.webmanifest`
- `tests/pwa-manifest.test.ts`

Melhorias aplicadas:
- empty state do dashboard anunciado com semântica de status
- CTA do empty state com altura mínima de 44 px e foco visível
- atalho PWA `Registrar transação` corrigido para `/transactions`
- bloqueio `portrait-primary` removido para permitir orientação compatível com o dispositivo
- aviso assíncrono de `act(...)` removido do teste do dashboard ao aguardar a estabilização do estado

Estratégia PWA:
- manifest, metadados, ícone, modo standalone e shortcut permanecem configurados
- service worker e offline não foram adicionados porque as transações ainda existem apenas em memória; cachear o shell sem consistência de dados criaria expectativa enganosa

Resultado dos gates:
- `npm run test:ci`: passou, 14 suites e 69 testes
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/`, `/dashboard` e `/transactions`

Estado de saída:
- projeto preparado para entrar em `QUALITY_VALIDATION`
- próximo passo recomendado: executar Dia 7 da SR-006

## Dia 7 — Qualidade Final, Segurança, Observabilidade e Entrega da SR-006

Small release: `SR-006 — Dashboard financeiro inicial`.

Pipeline final executado:
- `npm run lint`: passou, 0 warnings
- `npm run type-check`: passou
- `npm run test:ci`: passou, 14 suites e 69 testes
- `npm audit --audit-level=high`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/`, `/dashboard` e `/transactions`

Automação de qualidade criada:
- `.github/workflows/ci.yml`
- execução em push e pull request para `main`
- Node.js 22 com cache do npm
- gates de lint, type-check, testes, auditoria de dependências e build
- permissões do workflow limitadas a leitura de conteúdo
- placeholders não sensíveis usados somente no ambiente de CI

Revisão básica de segurança:
- apenas `.env.example` está versionado entre arquivos de ambiente
- arquivos `.env` reais permanecem ignorados
- nenhum segredo real foi identificado nos arquivos versionáveis
- o único alerta do scanner foi a documentação do placeholder vazio `SUPABASE_SERVICE_ROLE_KEY=`
- nenhum uso de service role, `any`, `eval`, `dangerouslySetInnerHTML`, `localStorage` ou `sessionStorage` encontrado no código da release
- nenhum acesso Supabase encontrado em `src/app` ou `src/features`; clients permanecem isolados em `src/lib/supabase`
- a release usa apenas dados locais de sessão e não envia dados financeiros a serviços externos

Threat model resumido:
- ativo: dados financeiros digitados durante a sessão
- fronteira atual: memória do navegador, sem persistência e sem sincronização externa
- ameaça mitigada: exposição de segredos por versionamento, com `.gitignore` e placeholders vazios
- ameaça não aplicável neste recorte: acesso indevido a registros persistidos, pois banco e autenticação ainda não participam do fluxo
- requisito obrigatório antes de dados reais: autenticação, autorização, RLS por usuário e testes de isolamento
- requisito antes de produção pública: revisar headers de segurança, política de conteúdo e observabilidade externa no ambiente de deploy

Baseline de observabilidade:
- logs de CI para lint, type-check, testes, audit e build
- erros de configuração Supabase falham explicitamente por variável ausente
- estados de erro de dashboard e formulário são visíveis e anunciáveis
- eventos candidatos futuros: `dashboard_view`, `dashboard_empty_state`, `transaction_create_attempt`, `transaction_create_success`, `transaction_create_failure`
- ferramenta externa de erros e métricas será escolhida quando houver persistência ou deploy real

Preparação de release incremental:
- escopo liberável: dashboard inicial com resumo mensal, últimas cinco transações, empty state, navegação e registro manual em sessão
- fora da release: persistência, autenticação, RLS, dados multiusuário reais, gráficos, cartões, parcelas, IA, importação e Open Finance
- riscos críticos abertos: nenhum dentro do escopo local demonstrativo
- estado final: `READY_FOR_RELEASE`

## Dia 6 — Experiência, Acessibilidade e PWA da SR-007

Small release: `SR-007 — Cadastro local de conta financeira`.

Auditoria executada:
- fluxo `/accounts` revisado por código, semântica acessível e testes de apresentação
- formulário mantém nome acessível, labels, campos obrigatórios, `aria-invalid`, descrição do saldo, `aria-busy` e mensagens anunciáveis
- lista mantém região nomeada com `aria-live="polite"` e empty state anunciado
- layout permanece mobile first, com composição em uma coluna antes do breakpoint `lg`
- manifest e experiência instalável foram revisados sem adicionar offline inconsistente

Resultado TDD:
- etapa vermelha confirmou três falhas: alvo de retorno com 40 px, nome longo sem quebra responsiva e ausência de shortcut PWA para contas
- etapa verde direcionada passou com 2 suítes e 4 testes
- suíte completa passou com 21 suítes e 110 testes

Implementação criada ou alterada:
- `src/features/accounts/presentation/pages/AccountsPage.tsx`
- `src/features/accounts/presentation/components/AccountSessionList.tsx`
- `src/features/accounts/tests/AccountsPage.test.tsx`
- `public/manifest.webmanifest`
- `tests/pwa-manifest.test.ts`

Melhorias aplicadas:
- link de retorno passou a ter alvo mínimo de 44 px
- nomes longos sem espaços passaram a quebrar dentro do contêiner flexível sem causar overflow horizontal
- saldo permaneceu não redutível na composição da linha
- manifest ganhou shortcut `Cadastrar conta` apontando para `/accounts`

Estratégia PWA:
- manifest, metadados, ícone, modo standalone e atalhos para transações e contas permanecem configurados
- service worker e offline não foram adicionados porque contas e transações ainda existem somente em memória
- nenhuma promessa de disponibilidade offline foi feita

Limitação registrada:
- a inspeção visual interativa foi interrompida porque a automação do Windows não conseguiu confirmar a URL local com segurança
- conforme autorização do usuário, a fase foi concluída sem nova inspeção visual interativa, usando testes automatizados, revisão semântica, classes responsivas e build como evidência

Resultado dos gates:
- `npm run test:ci`: passou, 21 suítes e 110 testes
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/`, `/accounts`, `/dashboard` e `/transactions`

Limites preservados:
- nenhuma autenticação, migration, persistência Supabase ou RLS
- nenhuma integração automática entre contas e transações
- nenhuma edição, exclusão ou nova regra financeira
- nenhuma expansão para cartões, parcelas, IA, importação ou Open Finance

Estado de saída:
- `QUALITY_VALIDATION`
- próximo passo recomendado: executar `dia 7`

## Dia 7 — Qualidade Final, Segurança, Observabilidade e Entrega da SR-007

Small release: `SR-007 — Cadastro local de conta financeira`.

Pipeline final executado:
- `npm run lint`: passou, 0 warnings
- `npm run type-check`: passou
- `npm run test:ci`: passou, 21 suítes e 110 testes
- `npm audit --audit-level=high`: passou, 0 vulnerabilidades
- `npm run build`: passou com `/`, `/accounts`, `/dashboard` e `/transactions`

Revisão básica de segurança:
- somente `.env.example` está versionado entre arquivos de ambiente
- `.env`, variantes locais e arquivos de chave permanecem ignorados
- `SUPABASE_SERVICE_ROLE_KEY` aparece somente como placeholder vazio em `.env.example`
- nenhum uso de service role, `eval`, `dangerouslySetInnerHTML`, `localStorage` ou `sessionStorage` foi identificado no código da release
- Supabase permanece isolado em `src/lib/supabase`; nenhum acesso foi encontrado em `src/app` ou `src/features`
- domínio e aplicação de contas não importam React, Next.js ou Supabase
- `package-lock.json` está presente e as dependências Supabase usam versões fixadas

Validação Supabase atualizada em 2026-07-12:
- changelog e documentação oficial de segurança foram consultados
- a mudança de defaults de exposição de tabelas não afeta esta release, pois nenhuma tabela ou migration foi criada
- para a futura SR-009, grants mínimos e RLS por proprietário devem ser entregues e testados juntos
- `service_role` ou secret key nunca podem ser expostos ao cliente
- autenticação da SR-008 continua sendo pré-requisito duro para persistência financeira

Threat model resumido:
- ativo: nome, tipo e saldo inicial da conta digitados na sessão
- fronteira atual: memória do navegador, sem banco, sincronização ou transmissão externa
- ameaça mitigada: versionamento acidental de segredos por `.gitignore` e placeholders
- ameaça mitigada: acesso direto da UI ao backend, inexistente nesta release
- ameaça residual aceita no recorte demonstrativo: perda dos dados ao recarregar
- risco bloqueado para produção: dados financeiros persistidos sem autenticação, autorização, grants mínimos, RLS por usuário e testes de isolamento

Baseline de observabilidade:
- logs do CI para lint, type-check, testes, audit e build
- falhas de configuração Supabase são explícitas
- formulário anuncia estados de sucesso e erro
- eventos candidatos futuros: `account_create_attempt`, `account_create_success`, `account_create_failure`, `accounts_empty_state`
- ferramenta externa de erros e métricas será escolhida quando houver autenticação, persistência ou deploy real

Preparação de release incremental:
- escopo liberável: domínio e caso de uso de conta financeira, cadastro local, lista da sessão, rota `/accounts`, navegação, experiência acessível e shortcut PWA
- fora da release: autenticação, persistência, migrations, RLS, edição, exclusão, saldo calculado e integração automática com transações
- riscos críticos abertos: nenhum dentro do escopo local demonstrativo
- dívida técnica crítica ou alta: nenhuma aberta
- próximo ciclo recomendado: SR-008 — Autenticação e sessão protegida
- estado final: `READY_FOR_RELEASE`

## Próximo Ciclo Selecionado — SR-008 Autenticação e Sessão Protegida

Seleção registrada em 2026-07-12.

Motivo da escolha:
- é o próximo item crítico na sequência aprovada da fundação de dados reais
- cria a fronteira de identidade necessária antes de qualquer persistência financeira
- reduz o risco de associação de contas, categorias e transações ao usuário errado
- desbloqueia a futura SR-009 sem antecipar migrations ou RLS

Estado da seleção:
- backlog: `IN_PROGRESS`
- Dia 3 concluído
- estado do ciclo: `IMPLEMENTATION_IN_PROGRESS`
- próximo comando válido: `dia 4`

Escopo preliminar a refinar no Dia 1:
- login e logout
- leitura segura de sessão no servidor
- proteção de rotas privadas
- contratos entre apresentação, aplicação e infraestrutura de autenticação
- cenários essenciais de sessão válida, ausente, expirada e encerrada

Limites obrigatórios:
- nenhuma persistência de contas, categorias ou transações nesta seleção
- nenhuma migration financeira ou política RLS antecipada
- nenhuma `service_role` ou secret key exposta ao cliente
- nenhuma decisão sobre provedor adicional além do Supabase Auth já definido na arquitetura
- nenhum código funcional antes dos testes essenciais do Dia 2

Pendências para o Dia 1:
- definir método inicial de autenticação dentro do Supabase Auth
- definir comportamento de redirecionamento e proteção das rotas
- definir contratos de sessão browser/server compatíveis com Next.js App Router
- produzir threat model específico do fluxo de autenticação
- fatiar a SR-008 em critérios testáveis sem expandir para persistência financeira

## Dia 1 — Contexto, Discovery e Arquitetura da SR-008

Small release: `SR-008 — Autenticação e sessão protegida`.

Objetivo refinado:
- estabelecer identidade real e verificável antes de qualquer persistência financeira
- permitir login e logout com sessão disponível no browser e no servidor
- impedir acesso anônimo às rotas financeiras atuais
- substituir progressivamente IDs demonstrativos pela identidade verificada sem antecipar banco financeiro

Escopo aprovado:
- login por e-mail e senha para usuário existente
- logout da sessão corrente
- refresh de tokens e cookies na fronteira Proxy
- leitura de identidade verificada no servidor
- proteção de `/`, `/dashboard`, `/accounts` e `/transactions`
- `/login` como rota pública
- redirecionamentos fixos: login bem-sucedido para `/dashboard`, logout ou ausência de sessão para `/login`

Fora do escopo:
- cadastro e confirmação de e-mail
- recuperação ou alteração de senha
- OAuth, telefone, magic link, OTP e MFA
- gestão de dispositivos e revogação global
- migrations, tabelas financeiras, repositórios persistentes e políticas RLS
- perfis, papéis administrativos e autorização por `user_metadata`

Regras de sessão e segurança:
- `getClaims()` valida identidade para proteção de páginas e dados
- `getUser()` só será usado quando o registro mais atual do usuário for necessário
- `getSession()` não será usado como fonte de autorização server-side
- Proxy renova cookies e faz guarda otimista, sem substituir validação dentro de operações sensíveis
- destinos de redirecionamento são fixos para evitar open redirect
- rotas autenticadas não podem compartilhar cache/ISR com respostas contendo sessão
- `service_role` e secret keys são proibidos no cliente
- publishable key é o contrato público alvo; compatibilidade temporária com anon key deve ser isolada e testada
- erros de credencial não devem revelar se o e-mail existe

Contratos entre camadas:
- `AuthUser`: identidade mínima com `id` e `email`
- `AuthGateway`: autenticar com senha, encerrar sessão e obter identidade verificada
- `SignInUseCase`: validar entrada e autenticar pelo contrato
- `SignOutUseCase`: encerrar a sessão corrente e tratar falhas
- `GetCurrentUserUseCase`: retornar usuário verificado ou ausência explícita
- `SupabaseAuthGateway`: implementação concreta em `infrastructure`
- adapter de Proxy: atualizar cookies e aplicar a política de rotas na fronteira Next.js

Estrutura planejada:
- feature `src/features/auth` separada em `presentation`, `application`, `domain`, `infrastructure` e `tests`
- route groups `(public)` e `(private)` sem alterar as URLs
- providers locais financeiros devem ficar no layout privado, não no layout raiz público
- `middleware.ts` raiz e `src/lib/supabase/middleware.ts` serão migrados para `proxy.ts` e `src/lib/supabase/proxy.ts`
- nenhum diretório vazio ou arquivo funcional foi criado no Dia 1

Threat model:
- cookie/JWT adulterado: validar claims assinadas no servidor
- token expirado: refresh no Proxy; falha vira ausência de sessão
- credencial inválida: resposta genérica e sem enumeração de usuário
- open redirect: destinos fixos
- cache entre usuários: impedir cache compartilhado em rotas autenticadas
- chave privilegiada vazada: somente publishable/anon pública pode chegar ao browser
- ID demonstrativo: deve ser substituído pela identidade validada antes de persistência

Matriz preliminar para o Dia 2:
- domínio/contrato: identidade válida, ID obrigatório e e-mail normalizado
- aplicação: login feliz, entrada inválida, credencial rejeitada e propagação controlada de falha
- aplicação: logout feliz e falha do gateway
- aplicação: usuário atual presente e ausente
- infraestrutura/Proxy: claims válidas, ausentes e expiradas; cookies propagados; rotas públicas e privadas
- apresentação futura: formulário acessível, loading, erro genérico e redirecionamento após sucesso

Auditoria da base existente:
- clients browser/server já existem em `src/lib/supabase`
- refresh atual usa `getUser()` e deve migrar para `getClaims()` com testes
- projeto usa `middleware.ts`, convenção depreciada no Next.js 16; migração para `proxy.ts` foi aprovada
- feature `auth` ainda não existe
- `.env.example` usa legacy anon key; contrato de publishable key será tratado incrementalmente

Banco de dados:
- nenhuma tabela, migration ou política foi desenhada ou criada nesta SR
- schema `auth` permanece gerenciado pelo Supabase
- tabelas financeiras e RLS continuam reservadas à SR-009 e posteriores

Artefatos:
- `adr/0003-auth-session-boundary.md`
- `architecture.md`
- `project-context.md`
- `roadmap.md`
- `backlog.md`
- `quality-gates.md`

Estado de saída:
- `ARCHITECTURE_READY`
- próximo passo recomendado: executar `dia 2`

## Dia 2 — Estratégia de Testes e Fundação TDD da SR-008

Small release: `SR-008 — Autenticação e sessão protegida`.

Matriz criada:
- domínio: `AuthUser` com normalização e validações de ID/e-mail
- aplicação: login, logout, usuário atual e política pura de rotas
- infraestrutura: mapping do Supabase Auth por `getClaims()` e adapter de Proxy com propagação de cookies
- apresentação: cenários documentados, mas testes adiados até os casos de uso ficarem estáveis

Testes e fixture criados:
- `src/features/auth/tests/fixtures/auth.fixtures.ts`
- `src/features/auth/tests/auth-user.entity.test.ts`
- `src/features/auth/tests/sign-in.use-case.test.ts`
- `src/features/auth/tests/sign-out.use-case.test.ts`
- `src/features/auth/tests/get-current-user.use-case.test.ts`
- `src/features/auth/tests/auth-route-policy.test.ts`
- `src/features/auth/tests/supabase-auth.gateway.test.ts`
- `src/features/auth/tests/supabase-proxy.test.ts`

Cenários cobertos:
- identidade normalizada e entradas inválidas
- login feliz, e-mail normalizado, senha preservada e erro sem enumeração de usuário
- logout local feliz e falha controlada
- usuário atual presente ou ausente
- acesso público/privado para usuário autenticado ou anônimo
- claims válidas, ausentes ou expiradas
- cookie atualizado propagado para a resposta
- redirecionamento fixo de `/login` e rotas privadas

Resultado TDD:
- a primeira execução revelou que o teste do Proxy precisava de ambiente Node para expor `Request`
- somente o ambiente do teste foi corrigido; nenhum código funcional foi criado
- etapa vermelha válida: 7 suítes falharam por módulos deliberadamente ausentes
- total planejado: 29 testes
- `npm run type-check` falhou somente com `TS2307` para os mesmos módulos ausentes
- rede anterior passou com 21 suítes e 110 testes
- `npm run lint` passou sem warnings
- `npm audit --omit=dev` passou com 0 vulnerabilidades

Implementação bloqueada até o Dia 3:
- entidade e contrato de autenticação
- três casos de uso
- política de rotas
- gateway Supabase
- adapter `src/lib/supabase/proxy.ts`

Limites preservados:
- nenhuma UI ou rota de login criada
- `middleware.ts` não foi renomeado
- `getUser()` existente não foi alterado
- nenhuma migration, tabela financeira ou política RLS
- nenhuma credencial real, token ou segredo em fixture

Estado de saída:
- `TEST_STRATEGY_READY`
- próximo passo recomendado: executar `dia 3`

## Dia 2 — Estratégia de Testes e Fundação TDD da SR-010

Small release: `SR-010 — Persistência e RLS de categorias`.

Matriz criada:
- domínio: criação/restauração, kinds, normalização e invariantes de `Category`
- aplicação: criação e listagem exclusivamente pelos contratos
- infraestrutura: mapper, repository, filtro de owner, ordenação e sanitização de erro
- banco: schema, constraints, grants, RLS, isolamento e performance das policies
- apresentação: cenários documentados e adiados até a estabilidade dos casos de uso

Testes e fixture Jest criados:
- `src/features/categories/tests/fixtures/category.fixtures.ts`
- `src/features/categories/tests/category.entity.test.ts`
- `src/features/categories/tests/create-category.use-case.test.ts`
- `src/features/categories/tests/list-categories.use-case.test.ts`
- `src/features/categories/tests/supabase-category.mapper.test.ts`
- `src/features/categories/tests/supabase-category.repository.test.ts`

Testes pgTAP criados:
- `supabase/tests/database/categories_schema.test.sql` com 33 asserções
- `supabase/tests/database/categories_constraints.test.sql` com 12 asserções
- `supabase/tests/database/categories_rls.test.sql` com 17 asserções
- `supabase/tests/database/categories_rls_performance.test.sql` com 3 asserções

Cenários cobertos:
- categoria `income` ou `expense`
- ator e nome normalizados
- usuário/nome ausente, nome longo e kind inválido
- criação, listagem vazia, ator ausente e falhas do repository
- mapper de row e payload mínimo de insert
- filtro explícito por owner e ordem `kind`, `name`, `id`
- sanitização de erros Supabase
- schema sem `color` ou `icon`
- FK de Auth, unicidade case-insensitive e chave composta futura
- grants mínimos, RLS forçada e policies separadas de SELECT/INSERT
- owner, não owner, `anon`, Auth anônimo e owner forjado
- ausência de UPDATE/DELETE e helpers Auth em initPlan

Resultado TDD:
- baseline anterior: 44 suítes e 212 testes verdes
- baseline de type-check e lint verde; audit com 0 vulnerabilidades
- RED direcionado: 5 suítes Jest falharam somente por módulos deliberadamente ausentes
- type-check falhou somente com 11 `TS2307` dos mesmos módulos planejados
- lint permaneceu verde com 0 warnings
- rede anterior excluindo apenas os testes de categorias: 44 suítes e 212 testes verdes
- RED remoto transacional via MCP: 1 falha de 1 porque `public.categories` ainda não existe
- rollback confirmado: banco permaneceu apenas com `financial_accounts`, duas migrations e `pgtap` não instalada
- build não foi executado porque o type-check vermelho é deliberado

Implementação bloqueada até o Dia 3:
- `src/features/categories/domain/entities/category.entity.ts`
- `src/features/categories/domain/interfaces/category.repository.ts`
- `src/features/categories/application/use-cases/create-category.use-case.ts`
- `src/features/categories/application/use-cases/list-categories.use-case.ts`
- `src/features/categories/infrastructure/supabase/category.mapper.ts`
- `src/features/categories/infrastructure/repositories/supabase-category.repository.ts`
- migration de `public.categories`

Limites preservados:
- nenhum código funcional, rota, action ou componente criado
- nenhuma migration criada ou aplicada
- nenhuma tabela, grant, policy, dado ou configuração Supabase alterado
- nenhum teste anterior relaxado, ignorado ou removido
- `.gitignore` e `rewrite-msgs.sh` permaneceram fora do escopo
- nenhum commit, push, PR ou deploy executado

Estado de saída:
- `TEST_STRATEGY_READY`
- próximo passo recomendado: executar explicitamente `dia 3` da SR-010

## Dia 3 — Implementação Mínima Orientada por Teste da SR-010

Small release: `SR-010 — Persistência e RLS de categorias`.

Implementação criada:
- `src/features/categories/domain/entities/category.entity.ts`
- `src/features/categories/domain/interfaces/category.repository.ts`
- `src/features/categories/application/use-cases/create-category.use-case.ts`
- `src/features/categories/application/use-cases/list-categories.use-case.ts`
- `src/features/categories/infrastructure/supabase/category.mapper.ts`
- `src/features/categories/infrastructure/repositories/supabase-category.repository.ts`
- `supabase/migrations/20260717022313_create_categories.sql`

Escopo entregue:
- categoria tipada como `income | expense`, com ator e nome normalizados e limite de 80 caracteres
- criação e listagem exclusivamente pelo contrato `CategoryRepository`
- mapper restrito aos campos aprovados e repository com erros sanitizados
- listagem filtrada por `user_id` e ordenada por `kind`, `name` e `id`
- tabela `public.categories` com seis colunas, FK para Auth, constraints, unicidade case-insensitive e chave composta futura
- grants mínimos de `SELECT` e `INSERT` somente para `authenticated`
- RLS habilitada/forçada com policies separadas de ownership e bloqueio de Auth anônimo
- índices compostos para RLS, unicidade e ordenação determinística

Validação Supabase:
- documentação e changelog atuais revisados antes da implementação; nenhuma breaking change aplicável ao banco hospedado foi identificada
- migration aplicada via MCP no projeto `fin_control` e versão local alinhada ao registro remoto `20260717022313`
- pgTAP remoto: 33/33 schema, 12/12 constraints, 17/17 RLS e 3/3 performance
- todos os testes SQL usaram transação e rollback; `categories` permaneceu vazia após as fixtures
- Performance Advisor sem alertas
- Security Advisor manteve apenas `auth_leaked_password_protection`, já rastreado em `SEC-AUTH-001` e não alterado fora do escopo

Resultado dos gates:
- testes direcionados: 5 suítes e 22 testes passaram
- `npm run test:ci`: 49 suítes e 234 testes passaram
- `npm run type-check`: passou
- `npm run lint`: passou, 0 warnings
- `npm audit --omit=dev`: passou, 0 vulnerabilidades
- `npm run build`: passou com Proxy e rotas existentes

Arquitetura e limites preservados:
- domain e application não dependem de React, Next.js ou Supabase
- integração concreta permanece isolada em infrastructure
- nenhuma UI, rota, action ou acesso direto da apresentação ao Supabase
- nenhuma edição, exclusão, arquivamento, cor, ícone, seed, categoria global ou persistência de transações
- `.gitignore` e `rewrite-msgs.sh` permaneceram fora do escopo
- nenhum commit, push, PR ou deploy executado

Estado de saída:
- `IMPLEMENTATION_IN_PROGRESS`
- próximo passo recomendado: executar explicitamente `dia 4` da SR-010
