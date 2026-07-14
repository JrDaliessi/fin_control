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
    financial-analytics/
    gamification/
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
  supabase/
    migrations/
    tests/
      database/
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

### financial-analytics
Periodos financeiros, evolucao de saldo, agregacoes, candles OHLC, comparacao e distribuicao de frequencia. A matematica fica no dominio e nao depende da biblioteca visual.

### gamification
Eventos idempotentes, pontos, niveis, conquistas, sequencias e desafios opcionais. Recompensa apenas comportamentos financeiros saudaveis e auditaveis.

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
- `FinancialAnalyticsQueryRepository`
- `GoalContributionRepository`
- `GamificationEventRepository`

Services previstos:
- `AuthSessionProvider`
- `StatementImportParser`
- `AiFinancialAnalysisService`
- `OpenFinanceProviderGateway`

Casos de uso previstos:
- `create-account.use-case.ts`
- `create-transaction.use-case.ts`
- `list-monthly-summary.use-case.ts`
- `calculate-real-balance.use-case.ts`
- `register-credit-card-purchase.use-case.ts`
- `simulate-purchase.use-case.ts`
- `aggregate-financial-evolution.use-case.ts`
- `build-financial-candles.use-case.ts`
- `build-frequency-distribution.use-case.ts`
- `record-goal-contribution.use-case.ts`
- `process-gamification-event.use-case.ts`

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
- `dashboard` calcular OHLC, classes de frequencia ou pontuacao.
- `presentation` depender diretamente de biblioteca de grafico sem adapter local.
- gamificacao conceder pontos sem chave de idempotencia.

## Supabase
Supabase será usado para autenticação, banco de dados e storage quando necessário.

Regras:
- clients separados para browser e server
- acesso isolado em `src/lib/supabase` e `infrastructure`
- configuração pública centralizada em `src/lib/supabase/config.ts`, com URL HTTP/HTTPS validada e mensagens que não revelam valores
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` preferida; `NEXT_PUBLIC_SUPABASE_ANON_KEY` aceita somente como fallback legado
- RLS obrigatório antes de manipular dados financeiros reais

## Decisões Arquiteturais da SR-007

- `accounts` nasce como feature isolada nas camadas `domain`, `application`, `infrastructure` e `presentation` conforme necessidade de cada fase.
- No Dia 1 não será criada estrutura vazia nem código funcional; os diretórios surgirão junto dos testes no Dia 2.
- `FinancialAccount` pertence ao domínio e não depende de React, Next.js ou Supabase.
- `AccountRepository` é contrato do domínio; apenas `create` é obrigatório no recorte inicial.
- `CreateAccountUseCase` depende do contrato e não conhece UI ou persistência concreta.
- ID e timestamps são metadados opcionais na criação; a futura infraestrutura persistente será responsável por atribuí-los.
- Saldo atual não será armazenado como campo mutável: será derivado futuramente do saldo inicial e dos movimentos válidos.
- Estado local de apresentação, se criado nos Dias 3 e 4, é temporário e não constitui infraestrutura.
- Autenticação, persistência Supabase e RLS permanecem separadas nas SR-008 e SR-009.
- A decisão é uma aplicação da arquitetura-base existente e não exige novo ADR.

## Decisões Arquiteturais da SR-008

- Supabase Auth com e-mail e senha será o primeiro método; cadastro, recuperação, OAuth e MFA ficam fora desta small release.
- Sessões SSR usarão cookies e PKCE por `@supabase/ssr`.
- `getClaims()` validará identidade para páginas e dados privados; `getSession()` não será usado como autorização no servidor.
- `getUser()` ficará restrito a casos que exijam o registro atual do usuário no Auth server.
- `middleware.ts` foi migrado para `src/proxy.ts`, no mesmo nível de `src/app`, conforme a convenção do Next.js 16 para projetos que usam o diretório `src`.
- Proxy executa refresh e redirecionamento otimista, mas não substitui validação de identidade em operações sensíveis.
- Rotas públicas e privadas estão organizadas por route groups sem mudar URLs; providers financeiros existem somente no layout privado.
- O layout privado valida a identidade por `GetCurrentUserUseCase` e disponibiliza apenas `{ id, email }` serializável para a apresentação.
- `src/app` atua como composition root: containers de login/logout montam casos de uso e infraestrutura, enquanto componentes em `presentation` recebem callbacks e não conhecem Supabase.
- A camada de apresentação dependerá de casos de uso e contratos de `auth`; somente `infrastructure` e `src/lib/supabase` conhecerão Supabase.
- Browser, server e Proxy resolvem a mesma configuração pública pelo módulo compartilhado; o Proxy continua falhando fechado quando configuração ou claims não podem ser validadas.
- O matcher do Proxy exclui assets de imagem estáticos e o manifest, evitando trabalho de autenticação em recursos que não usam sessão.
- Dados financeiros e RLS permanecem fora da SR-008.
- A decisão completa está em `adr/0003-auth-session-boundary.md`.

## Decisões Arquiteturais da SR-009

- A primeira tabela financeira real será `public.financial_accounts`.
- O recorte funcional cobre somente criação e listagem de contas próprias.
- A composition root usa Server Component para leitura e Server Action para criação; cada operação revalida a identidade antes de chamar a aplicação.
- A UI não envia `userId` como autoridade. O ID do ator é obtido das claims verificadas e a RLS permanece a autoridade final contra BOLA/IDOR.
- `SupabaseAccountRepository` fica em `accounts/infrastructure` e implementa apenas contratos consumidos por casos de uso.
- O domínio usa `FinancialAccount.restore()` para preservar ID e timestamps do banco reaplicando invariantes.
- `AccountsPage` gerencia somente estado e feedback com callbacks injetados; o provider local de contas foi removido após a composição persistente tornar seu uso obsoleto.
- `authenticated` recebe somente `SELECT` e `INSERT`; `anon`, usuários anônimos do Auth, `UPDATE`, `DELETE` e uso de `service_role` pela aplicação permanecem bloqueados.
- Grants explícitos, RLS, policies, constraints e índice nascem na mesma migration.
- A FK para `auth.users(id)` usa `ON DELETE CASCADE`; exclusão futura de conta referenciada por transações deverá usar `RESTRICT`.
- Saldo inicial é imutável e `current_balance` não será persistido.
- Migrations são forward-only: correções usam nova migration; rollback destrutivo não é rotina de produção.
- Funções Auth usadas em policies são envolvidas diretamente por subqueries, como `(select auth.uid())` e `(select auth.jwt())`, para permitir initPlan por statement sem alterar autorização.
- Supabase MCP é o caminho oficial para aplicar migration, executar pgTAP transacional, inspecionar schema e rodar advisors.
- O caminho canônico dos artefatos locais passa a ser `supabase/migrations/` e `supabase/tests/database/`; os diretórios só surgirão quando os testes do Dia 2 exigirem.
- A decisão completa está em `adr/0004-financial-accounts-persistence-rls.md`.

## PWA
O projeto deve ter:
- manifest
- ícones
- mobile first
- instalabilidade
- estratégia offline definida de forma realista

## Sistema Visual FinControl Pulse

- FinControl Pulse é a direção visual oficial para marca, shell, dashboard, páginas internas e copywriting.
- A implementação ocorre em small releases `UI-001` a `UI-006`; a especificação não autoriza redesenho one-shot.
- `src/app/(private)/PrivateAppShell.tsx` é a composition root visual para sidebar, topbar, conteúdo e navegação mobile, sem regras financeiras.
- Tokens semânticos em `globals.css` são a fonte de verdade de temas; Tailwind apenas os expõe como classes.
- Primitives genéricas ficam em `src/shared/components/ui`; componentes com semântica financeira permanecem na feature dona do contrato.
- Rotas, CTAs, indicadores, gráficos e copy só podem aparecer quando o caso de uso correspondente existir.
- Domínio e aplicação não dependem de tokens, copy, React ou biblioteca visual.
- Gráficos continuam bloqueados até o `SP-001`, com adapter de presentation e alternativa tabular acessível.
- Preferência de tema é dado de apresentação; não autoriza persistência de dados financeiros no navegador.
- A copy segue `informar → explicar → sugerir`, sem culpa, promessa de resultado, IA antecipada ou dado fictício apresentado como real.
- Na `UI-001`, Geist será entregue por `next/font/google`, com variável CSS e fallback de sistema; não haverá pacote de fonte ou requisição do navegador a um CDN de fontes.
- Tokens são canais RGB definidos em `globals.css`; Tailwind os mapeia com suporte a alfa e não se torna uma segunda fonte de valores literais.
- A preferência tipada é `light | dark | system`; a resolução produz `light | dark` e aplica `data-theme="dark"` no elemento raiz.
- O armazenamento local é permitido somente para a chave de apresentação `fincontrol.theme`, com allowlist e fallback seguro para `system`. Nenhum dado financeiro ou de identidade pode entrar nesse mecanismo.
- A resolução inicial do tema ocorre antes da hidratação por um script estático local; um provider React sincroniza interação, armazenamento e mudança de preferência do sistema.
- O conjunto inicial compartilhado fica restrito a `Button`, `Card`, `FeedbackMessage` e `ThemeSwitcher`. Abstrações adicionais exigem uso real em mais de uma feature.
- O tema não altera contratos de domain/application/infrastructure e não introduz acesso ao Supabase.
- Decisão completa: `adr/0005-fincontrol-pulse-design-system.md`.
- Especificação completa: `docs/product/fincontrol-pulse-interface-copy.md`.

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
- `financial_goals`
- `goal_contributions`
- `gamification_events`
- `achievements`
- `user_achievements`
- `user_gamification_profiles`
- `user_financial_preferences`

Regras de dados:
- Todas as tabelas financeiras devem ter `user_id`.
- RLS deve restringir acesso por usuário.
- Valores monetários devem ser salvos em centavos.
- Datas de competência mensal devem usar referência explícita de mês.
- Dados importados devem guardar origem e lote de importação.
- Eventos de gamificacao devem ter idempotencia por usuario e origem.
- Analytics devem consultar por usuario e intervalo, sem misturar caches.

## Analytics Financeiros e Gamificacao

As decisoes detalhadas estao em `docs/product/advanced-financial-analytics-gamification.md` e `adr/0002-advanced-financial-analytics-sequence.md`.

Regras:
- semana, janela movel, quinzena, mes e personalizado sao tipos de dominio explicitos
- evolucao, candles e frequencia sao funcoes puras e deterministicas
- valores permanecem em centavos
- candles exigem saldo inicial e ordenacao estavel
- frequencia automatica inicial usa `ceil(sqrt(n))`
- medidas por classes sao estimativas agrupadas
- graficos recebem view models e nao consultam repositorios
- tabela textual e alternativa acessivel obrigatoria
- metas precedem gamificacao e desafios baseados em frequencia
- autenticacao, RLS e persistencia precedem analytics de producao

## ADRs
Decisões arquiteturais relevantes devem ser registradas em `adr/`.
