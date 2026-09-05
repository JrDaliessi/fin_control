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

## Decisões Arquiteturais da SR-010

- A feature `categories` será criada com separação entre `presentation`, `application`, `domain` e `infrastructure`.
- O recorte funcional cobre criação e listagem de categorias próprias; edição, exclusão, arquivamento e categorias globais permanecem fora.
- Cada categoria pertence a um usuário e possui `kind` estritamente `income` ou `expense`; o valor `both` foi rejeitado para preservar filtragem e validação determinísticas por tipo de transação.
- O nome é normalizado, limitado a 80 caracteres e único por usuário e `kind` em comparação case-insensitive. Cor e ícone permanecem fora até existir personalização real.
- A rota privada `/categories` será um subfluxo de transações, sem ampliar a navegação principal definida pela UI-002.
- A composition root usará Server Component para leitura e Server Action para criação; ambas revalidarão claims e nunca aceitarão `userId` da apresentação como autoridade.
- `CategoryRepository` exporá somente `create` e `listByUser`; `findById` permanece fora até a SR-011 possuir consumidor real.
- `SupabaseCategoryRepository` e o mapper `snake_case` ficarão em `categories/infrastructure`; erros brutos do Supabase não atravessarão a fronteira.
- `public.categories` terá FK para `auth.users`, constraints, ordenação determinística e chave composta candidata `(user_id, id)` para a futura FK tenant-safe de transações.
- `authenticated` receberá somente `SELECT` e `INSERT`; `anon`, usuários anônimos do Auth, `UPDATE`, `DELETE` e uso de `service_role` pela aplicação permanecerão bloqueados.
- Grants explícitos, RLS forçada, policies por proprietário, constraints e índices nascerão na mesma migration somente após os testes do Dia 2.
- Supabase MCP será usado para aplicar a migration, executar pgTAP transacional, inspecionar schema e rodar advisors nos dias autorizados; no Dia 1 seu uso é somente leitura.
- A decisão completa está em `adr/0007-categories-persistence-rls.md`.

## Decisões Arquiteturais da SR-011

- O recorte cobre criação persistente e consulta mensal de transações manuais próprias.
- `Transaction` e os casos de uso existentes continuam independentes de React, Next.js e Supabase; restauração persistente será adicionada ao domínio sob TDD.
- `TransactionRepository.findByMonth` torna-se obrigatório; a implementação concreta e o mapper ficam em `transactions/infrastructure`.
- A data manual será persistida como `occurred_on date`, pois a UI captura uma data civil sem horário. O mapper usa meia-noite UTC para manter compatibilidade com o domínio atual.
- A tabela terá ownership direto por `user_id` e vínculos compostos tenant-safe com contas e categorias.
- A FK de categoria incluirá `type/kind`, impedindo que uma despesa use categoria de receita ou vice-versa.
- `financial_accounts` e `categories` receberão somente constraints auxiliares necessárias às FKs compostas; não haverá mudança nas operações liberadas dessas features.
- A composition root revalidará claims em Server Component e Server Action. A apresentação não enviará `userId` como autoridade e não importará Supabase.
- O contrato de apresentação usa DTOs serializáveis, mantém `occurredOn` como data civil e omite ownership; somente a Server Action converte a data e injeta o `sub` verificado.
- A rota `/transactions` é um Server Component dinâmico; a página cliente recebe apenas dados iniciais e a action autorizada, e solicita `router.refresh()` após criação bem-sucedida.
- Loading e erro pertencem ao App Router; estados empty, configuração ausente e success pertencem à apresentação da feature.
- A composition root executa uma única consulta mensal e deriva lista e resumo do mesmo conjunto; o caso de uso público de resumo continua disponível para consumidores independentes.
- DTOs de opções exigem IDs persistidos em runtime, evitando casts que poderiam propagar entidades incompletas à apresentação.
- `authenticated` receberá somente `SELECT` e `INSERT`; RLS será habilitada e forçada, e usuários Auth anônimos serão bloqueados explicitamente.
- Não haverá `UPDATE`, `DELETE`, status, transferência, cartão, recorrência, importação, trigger de saldo ou dashboard persistente nesta release.
- Migrations e testes pgTAP permanecem bloqueados até o RED do Dia 2; alteração remota só pode ocorrer no Dia 3.
- A decisão completa está em `adr/0008-transactions-persistence-rls.md`.

## Decisões Arquiteturais da SR-012

- `financial-analytics/domain` é a fonte de verdade para semântica de períodos financeiros.
- A release cobre somente `week`, `rolling_7_days`, `fortnight`, `rolling_15_days` e `month`; `custom` permanece fora.
- Limites usam datas civis canônicas `YYYY-MM-DD`, não instâncias de `Date`.
- Todo intervalo é semiaberto: `[startOnInclusive, endOnExclusive)`.
- `week` começa na segunda-feira; janelas móveis incluem a data de referência; quinzena é 1–15 ou 16–fim do mês.
- O domínio recebe `referenceOn` como data civil e não consulta relógio, locale ou timezone do host.
- Timezone participa apenas da futura conversão de um instante para a data civil do usuário, em uma borda explícita com timezone IANA e relógio injetados.
- `transactions.occurred_on` já é uma data civil e não pode ser reinterpretada por timezone.
- `ResolveFinancialPeriodUseCase` expõe DTOs serializáveis; classes de domínio e `Date` não atravessam a fronteira RSC.
- `presentation` e `infrastructure` não serão criadas na SR-012 sem consumidor real.
- O port de consulta por intervalo será criado na SR-013; a SR-012 não estende `TransactionRepository.findByMonth` nem importa `Transaction` no domínio de analytics.
- Nenhuma migration, policy, grant, view, RPC, dependência ou rota é necessária nesta release.
- Dashboard e outras features podem compor casos de uso públicos de analytics, mas não recalcular períodos.
- A decisão completa está em `adr/0009-financial-periods-civil-date-boundaries.md`.

## Decisões Arquiteturais da SR-013

- `financial-analytics/domain` agrega movimentos neutros em buckets civis diários contínuos para os cinco períodos atuais.
- Pontos expõem limites semiabertos, receitas, despesas, líquido, saldo de fechamento e quantidade; valores permanecem inteiros seguros em centavos.
- Saldo de abertura combina saldos iniciais configurados e movimentos anteriores ao início do período.
- `FinancialAnalyticsQueryRepository` nasce em `application/ports`; o domínio não importa `Transaction`, `FinancialAccount` ou contratos de outras features.
- A implementação concreta pertence a `financial-analytics/infrastructure` e usa uma função SQL `SECURITY INVOKER` para obter abertura e movimentos na mesma fotografia.
- A função não recebe identidade livre, depende da sessão Supabase e das RLS existentes, e terá `EXECUTE` mínimo para `authenticated` permanente.
- Nenhuma tabela, view, coluna, policy ou índice novo é necessário; saldo e pontos não são persistidos.
- `America/Sao_Paulo` é a configuração IANA explícita e temporária da borda de aplicação. `referenceInstant` é injetado e `occurred_on date` não é convertido.
- A tabela acessível poderá ser composta no dashboard sem antecipar gráfico ou o redesenho amplo da UI-003.
- `/` e `/dashboard` delegam à mesma composição server-side; o painel de analytics é passado como slot React para o `DashboardPage` cliente, evitando serializar o DTO financeiro ou incluir módulos de analytics no bundle cliente.
- A decisão completa está em `adr/0010-financial-evolution-snapshot-and-daily-buckets.md`.

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
- Gráficos de produção dependem do `SP-001` concluído e de uma small release própria, com adapter de presentation e alternativa tabular acessível.
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

## Shell e Navegação Responsiva — UI-002

- `src/app/(private)/PrivateAppShell.tsx` permanece a composition root cliente do shell privado e não recebe regras financeiras.
- A matriz navegável inicial contém somente `/dashboard`, `/transactions` e `/accounts`; `/` permanece alias do dashboard e deve ativar o mesmo item de Visão geral.
- O estado ativo deriva exclusivamente do pathname conhecido, com correspondência exata para evitar ativação indevida, e expõe `aria-current="page"`.
- Desktop a partir de `1024px` usa sidebar expandida; tablet entre `768px` e `1023px` usa rail compacto com nomes acessíveis; mobile abaixo de `768px` usa topbar compacta e navegação inferior.
- O mobile contém apenas Início, Transações e Contas. O botão “Adicionar”, Metas e “Mais” permanecem ausentes porque seus fluxos agregadores ainda não existem.
- A topbar pode compor marca, título derivado da rota conhecida, `ThemeSwitcher`, identidade disponível e `SignOutButton`; busca, notificações e menu de perfil não são exibidos antes de seus respectivos fluxos.
- Navegação e topbar são componentes de composição do App Router e ficam em `src/app/(private)/components` enquanto não houver reutilização fora do shell. Isso evita transformar candidatos visuais em primitives genéricas prematuras.
- O contrato de logout existente permanece inalterado: `SignOutUseCase` e `SupabaseAuthGateway` são montados na composition root, com redirecionamento fixo para `/login`.
- Conteúdo deve preservar um único `main` pertencente à página. O shell fornece contêiner e landmarks de navegação, sem envolver as páginas em um segundo `main`.
- Em mobile, o conteúdo deve reservar espaço inferior para que a navegação fixa não cubra controles; todas as ações mantêm alvo mínimo de 44 × 44 px, foco visível e uso completo por teclado.
- Nenhuma mudança de domain, application, infrastructure, Supabase, migration, PWA offline ou regra financeira pertence à UI-002.
- Decisão completa: `adr/0006-responsive-private-shell.md`.

## Cabeçalho Responsivo Compacto — UX-SHELL-001

- `UX-SHELL-001` evolui a topbar criada pela UI-002 sem alterar a matriz de navegação, autenticação ou regras financeiras.
- A topbar usa uma única linha de até 64 px, além da safe area superior; o `h1` e a descrição continuam pertencendo à página.
- Mobile exibe marca compacta e trigger de conta. Tablet/desktop preservam contexto discreto da rota e o mesmo trigger, mantendo sidebar/rail existentes.
- O trigger abre um diálogo responsivo: bottom sheet abaixo de 768 px e painel ancorado à direita a partir de 768 px.
- O painel recebe semântica de diálogo, e não de menu ARIA, porque compõe identidade, radiogroup de tema e logout.
- `AccountPanel.client.tsx` permanece específico do shell em `src/app/(private)/components` e concentra somente estado visual, foco, teclado, backdrop, scroll e responsividade.
- `ThemeSwitcher` e `SignOutButton` são compostos sem alterar seus contratos. O endereço completo da sessão aparece somente dentro do painel.
- `PrivateAppShell` continua a client composition root e proprietária da orquestração do logout existente; nenhuma nova fronteira Server → Client ou prop não serializável é introduzida.
- A navegação inferior permanece a única navegação primária mobile; suas rotas não são duplicadas no painel.
- Nenhuma primitive modal, dependência, rota, Supabase, Auth, migration, RLS, dado ou configuração remota é adicionada neste recorte.
- O contrato mínimo inclui alvo de 44 px, `aria-expanded`, diálogo nomeado, foco inicial/contido/restaurado, fechamento explícito/`Escape`/backdrop, scroll bloqueado, safe areas e movimento reduzido.
- Decisão completa: `adr/0018-responsive-account-panel.md`.

## Dashboard FinControl Pulse — UI-003

- `src/app/(private)/dashboard/compose-dashboard-route.tsx` permanece a composition root server-side compartilhada por `/` e `/dashboard`.
- A rota aguarda `searchParams`, normaliza o período e carrega `FinancialEvolutionDto` diretamente no servidor; não cria Route Handler nem fetch de leitura no cliente.
- `DashboardPage` deve ser apresentação pura e server-compatible, recebendo composição por slot React sem importar Auth, transações, analytics, Supabase ou infraestrutura.
- `FinancialEvolutionPanel` permanece na feature dona da semântica financeira e recebe somente DTO plano e kind aprovado.
- A UI-003 elimina o resumo cliente em memória e remove `TransactionSessionProvider` do layout privado, porque não havia consumidor de produção e o estado vazio não representava a persistência real.
- A única fonte financeira deste recorte é o snapshot da SR-013: abertura, receitas, despesas, líquido, fechamento, contagem e buckets diários.
- O grid é lógico de 12 colunas e mobile first. Layout não altera cálculos nem replica valores em estado cliente.
- Loading e error permanecem em arquivos especiais do App Router; `missing_accounts`, `empty` e `success` pertencem ao DTO da aplicação.
- “Saldo ao fim do período” é a métrica principal. “Disponível de verdade”, comparação, tendência e previsão continuam bloqueados até contratos próprios.
- Links ficam restritos a `/accounts` e `/transactions`; lista detalhada recente permanece fora até existir projeção server-side alinhada ao período selecionado.
- Nenhuma mudança de domínio, application financeira, infrastructure, Supabase, migration, RLS, policy, grant ou dependência pertence à UI-003.
- O SP-001 está concluído; gráficos de produção permanecem bloqueados até a SR-014, e a tabela acessível continua obrigatória mesmo após a integração.
- Decisão completa: `adr/0011-dashboard-pulse-real-data-composition.md`.

## Adapter de gráficos financeiros — SP-001

- Apache ECharts `6.1.0` é a biblioteca visual escolhida para validação incremental nas SR-014/SR-015.
- A dependência fica confinada a `financial-analytics/presentation/charts/echarts`; domain, application, infrastructure e App Router não importam ECharts.
- `FinancialEvolutionPanel` permanece Server Component. Apenas o lifecycle do gráfico forma uma ilha cliente estreita com props planas e serializáveis.
- Importações usam `echarts/core`, charts/componentes necessários, `AriaComponent` e `SVGRenderer`; import total e wrapper React adicional são proibidos.
- O adapter mantém datas civis e inteiros em centavos. Formatação de moeda pertence a eixo, tooltip e descrição, não altera cálculos.
- A tabela acessível permanece presente e equivalente. ARIA/decal do gráfico é complementar; cor ou tooltip nunca são a única forma de transmitir informação.
- Movimento reduzido, resize, dispose, temas e delta de bundle devem ser comprovados por testes e experimento antes do gráfico de produção.
- Não existe `ChartPort` genérico nesta fase; nova abstração depende de segundo consumidor real.
- Decisão completa: `adr/0012-chart-library-presentation-adapter.md`.

## Gráfico de linha da evolução — SR-014

- `composeDashboardRoute` continua sendo a composition root server-side compartilhada por `/` e `/dashboard` e realiza uma única leitura financeira.
- `FinancialEvolutionPanel` permanece Server Component e converte `FinancialEvolutionDto` por `toFinancialEvolutionChartModel` antes da fronteira cliente.
- `FinancialEvolutionChart.client.tsx` recebe somente um view model plano com datas civis e saldos de fechamento em centavos; não recebe identidade, token, funções, classes ou objetos `Date`.
- O painel integra diretamente a ilha cliente aprovada. Um segundo wrapper com `next/dynamic` e `ssr: false` só pode surgir se build ou medição de bundle demonstrarem necessidade concreta.
- O gráfico renderiza nos estados `success` e `empty`; `missing_accounts` continua sem gráfico ou tabela. Falha de dados usa o error boundary da rota, enquanto falha de ECharts preserva a tabela e exibe fallback local.
- A linha representa apenas saldo de fechamento diário. Receitas, despesas, comparação, previsão, candles, zoom, exportação e semântica de trading permanecem fora.
- O gráfico fica em card próprio com heading de nível 3 e descrição; a tabela diária continua visível, equivalente e navegável por teclado.
- ECharts permanece confinado ao adapter de presentation e deve aparecer somente nos chunks cliente de `/` e `/dashboard`; qualquer vazamento para rotas não relacionadas bloqueia a release.
- Não há nova leitura cliente, Route Handler, Server Action, Suspense artificial, cache, Supabase, migration ou mudança de regra financeira.
- Decisão completa: `adr/0013-financial-evolution-line-chart-integration.md`.

## Expansão universal de gráficos — UX-CHART-001

- `ExpandableChartFrame.client.tsx` é uma primitive de presentation compartilhada; não conhece ECharts, DTOs ou regras financeiras.
- O frame preserva o mesmo elemento e a mesma instância do gráfico ao alternar entre fluxo normal e overlay de viewport.
- Fullscreen nativo é melhoria progressiva; overlay CSS, botão de saída, `Escape`, foco e scroll formam o contrato mínimo.
- Solicitações nativas assíncronas recebem identidade de tentativa; resoluções obsoletas encerram qualquer fullscreen adquirido sem reabrir a UI.
- O overlay respeita `safe-area-inset-*` nos quatro lados e não força orientação.
- Wrappers e viewports de renderer em grid/flex usam `min-width: 0`; a altura mínima normal é liberada somente durante a expansão.
- Componentes de gráficos futuros compõem a primitive dentro de suas ilhas cliente, sem ampliar a fronteira de dados Server → Client.
- A tabela equivalente permanece fora do frame e não pode ser removida pelo modo expandido.
- Nenhuma dependência, orientação forçada ou abstração de domínio é introduzida.
- Decisão completa: `adr/0014-expandable-chart-frame.md`.

## Candles financeiros — SR-015

- O candle representa saldo financeiro diário, nunca preço de ativo, ordem de mercado ou recomendação de trading.
- Um agregador puro do domínio recebe o período resolvido, o saldo de abertura e os movimentos do snapshot; ele não depende de React, Next.js, Supabase ou ECharts.
- Os movimentos são ordenados por `occurredOn`, `createdAt` e `id`. Como `occurredOn` é data civil, a ordem intradiária representa a ordem de registro no sistema e deve ser explicada na interface.
- A fronteira Supabase normaliza todo `timestamptz` válido para ISO UTC canônico com `toISOString()` antes de construir o snapshot; o domínio continua rejeitando instantes inválidos e independente das representações textuais do PostgreSQL.
- Cada candle inclui `open`, `high`, `low`, `close`, receita, despesa, volume e quantidade em inteiros seguros de centavos. Dias vazios preservam o último saldo com volume zero.
- `ListFinancialEvolutionUseCase` calcula evolução e candles a partir do mesmo `FinancialEvolutionSnapshot`; a SR-015 não cria segunda consulta, Route Handler, Server Action, RPC ou migration.
- O DTO adiciona uma coleção `candles` plana e serializável. Domain e application permanecem independentes da visualização.
- `FinancialEvolutionPanel` continua Server Component. Uma ilha cliente estreita recebe os modelos de linha e candles e controla somente o seletor visual e a montagem do modo ativo.
- A ilha não acessa Supabase, Auth, repository ou rede. Apenas um gráfico e uma tabela equivalentes ficam ativos por vez.
- O adapter ECharts registra `CandlestickChart` por import modular e preserva SVG, ARIA, tema, movimento reduzido, resize, dispose e isolamento de bundle das rotas não financeiras.
- `useFinancialChart` é um hook interno de presentation compartilhado somente pelos dois renderers existentes; ele concentra lifecycle e preferências visuais, enquanto builders, temas, modelos, estados e textos permanecem concretos. Ele não constitui nem autoriza um `ChartPort` genérico.
- Linha e candles reutilizam `ExpandableChartFrame`; expansão não duplica renderer nem dados.
- A tabela OHLC é a alternativa do tooltip e comunica alta/queda também por texto e valores, nunca somente por cor.
- O primeiro recorte usa buckets diários nos cinco períodos atuais, todos limitados a 31 dias. Semana/mês para intervalos longos e período customizado permanecem fora.
- Decisão completa: `adr/0015-financial-balance-candles.md`.

## Extrato contextual do candle — UX-CHART-002

- A seleção preserva o intervalo semiaberto do candle como `{ startOnInclusive, endOnExclusive }`; nenhum componente reconstrói o fim a partir da data inicial.
- O primeiro recorte cobre somente candles diários nos períodos atuais de até 31 dias.
- Clique/toque no candle e o botão `Ver extrato` da linha equivalente convergem para a mesma seleção. A tabela é a alternativa integral de teclado.
- `financial-analytics/application` define um read port específico, `FinancialIntervalStatementQueryRepository`; o repositório de escrita/listagem mensal de transações não é ampliado com responsabilidade analítica.
- A implementação Supabase fica em infrastructure e aplica projeção mínima, `user_id` explícito, limites `>= start`/`< end` e ordenação determinística sob as policies RLS existentes.
- Uma Server Action verifica claims, rejeita Auth anônimo e injeta o proprietário. `userId` nunca atravessa a fronteira cliente.
- Os lançamentos são carregados somente após seleção; o snapshot financeiro e a RPC existente não recebem descrições ou detalhes transacionais.
- A presentation estende o adapter/hook ECharts somente com registro e cleanup do evento necessário. A decisão não autoriza um `ChartPort` genérico.
- O extrato usa diálogo responsivo: bottom sheet abaixo de 768 px e painel lateral a partir de 768 px, com estados `loading`, `empty`, `error` e `success` e proteção contra respostas obsoletas.
- Foco contido/restaurado, `Escape`, backdrop, scroll confinado, safe areas, movimento reduzido e targets de 44 px seguem a primitive comprovada do shell.
- Não há migration, nova RPC, edição, exclusão, notas, exportação, busca ou períodos longos nesta feature.
- Decisão completa: `adr/0019-contextual-candle-statement.md`.

## Períodos e granularidade adaptativa — UX-CHART-003

- A feature começa somente após a UX-CHART-002, reutilizando seu contrato genérico de intervalo e extrato sob demanda.
- `UX-CHART-003A` entrega `7D`, `15D` e `Mês` com a RPC atual e compatibilidade de URL, sem migration.
- `UX-CHART-003B` entrega `3M` e `Ano` com agregação server-side própria; `UX-CHART-003C` entrega `Tudo`, personalizado e integração completa.
- A granularidade pertence ao domínio/application: diária até 31 dias, semanal até 6 meses, mensal até 2 anos e trimestral acima disso, mantendo preferencialmente 12–60 pontos.
- Buckets são civis, consecutivos e semiabertos; buckets parciais respeitam exatamente o intervalo selecionado e a ordenação OHLC da SR-015.
- Cards, linha, candles, tabela e extrato consomem uma única resolução de período representável na URL; valores atuais continuam compatíveis.
- Períodos longos nunca enviam movimentos brutos ao browser. Uma futura RPC agregadora será `SECURITY INVOKER`, com Auth/RLS, grants mínimos, allowlist de bucket e limites de intervalo/pontos.
- A RPC diária existente permanece limitada a 31 dias. A migration futura será forward-only e validada por pgTAP.
- O seletor usa botões com `aria-pressed`, nomes completos, alvos de 44 px e rolagem horizontal confinada no mobile.
- Decisão completa: `adr/0020-adaptive-financial-periods.md`.

## Proteção contra senhas vazadas — SEC-AUTH-001

- A proteção será fornecida nativamente pelo Supabase Auth e não por código próprio.
- Nenhuma senha ou hash será enviado a presentation, application, domínio financeiro, Edge Function, banco, log ou observabilidade.
- A ativação depende de plano Supabase Pro ou superior; a organização atual está no plano Free.
- O password grant pode devolver sessão válida acompanhada de `weakPassword`; o contrato de infrastructure deve preservar a sessão e continuar falhando fechado quando houver erro real ou usuário ausente.
- A UI mantém mensagem genérica para falhas de autenticação e não expõe existência de conta, detalhes do provider ou motivos de comprometimento antes de sessão válida.
- O quality gate remoto exige login sintético sanitizado, logs de Auth sem regressão e Security Advisor sem `auth_leaked_password_protection`.
- Rollback é exclusivamente operacional: desativar a opção nativa e repetir os mesmos gates. Não existe migration ou rollback de dados.
- Troca/recuperação de senha e remediação guiada de usuários existentes permanecem fora deste item e exigem ciclo próprio.
- Decisão completa: `adr/0016-native-leaked-password-protection.md`.

## Restauração da conta de demonstração — DEMO-001

- A automação pertence ao PostgreSQL/Supabase Cron; o Next.js não recebe endpoint, chave privilegiada, Server Action ou responsabilidade de manutenção da massa demo.
- O alvo é resolvido exclusivamente por `auth.users.raw_app_meta_data`, exigindo `account_type = demo`, `audience = recruiter` e cardinalidade exatamente igual a um. Dados editáveis pelo usuário, e-mail e UUID fixo não autorizam o reset.
- A função fica no schema `private`, usa `SECURITY INVOKER`, `search_path` vazio e nomes totalmente qualificados. `PUBLIC`, `anon`, `authenticated` e `service_role` não possuem `EXECUTE`.
- O job pertence a `postgres`, único ator autorizado a executar a função e a ultrapassar as RLS forçadas para manutenção administrativa deliberada.
- Advisory lock transacional serializa chamadas. Transações, categorias e contas são removidas nessa ordem e a baseline é recriada na mesma transação, sem estado intermediário observável após commit.
- A data civil do job é derivada com `America/Sao_Paulo`; testes recebem referência explícita para permanecerem determinísticos.
- O Cron diário usa nome estável `reset-recruiter-demo-data-daily` e agenda `0 7 * * *` em UTC. O comando não contém segredo, e-mail nem identificador de usuário.
- Auth, senha, sessão e metadados permanecem intactos. O escopo atual cobre somente `financial_accounts`, `categories` e `transactions`.
- Rollback operacional desativa o job; alterações estruturais posteriores são forward-only. Execuções e falhas são auditadas em `cron.job_run_details` com retenção limitada à própria tarefa.
- Decisão completa: `adr/0021-recruiter-demo-account-reset.md`.

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

## Hardening da borda HTTP e autenticação — SEC-HARD-001

- Headers estáticos e CSP pertencem à configuração Next.js, não ao Proxy responsável pela renovação da sessão Supabase.
- A baseline global inclui CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS de produção e remoção de `X-Powered-By`.
- A CSP permite conexão somente com a própria origem e com a origem HTTPS exata do projeto Supabase; nenhum wildcard de provider, Realtime ou analytics será antecipado.
- O login atual chama o Supabase Auth diretamente no navegador. Rate limit da Vercel sobre `/login` não protege o password grant e não substitui os controles nativos do Supabase.
- CAPTCHA permanece uma integração separada: presentation coleta token efêmero, application orquestra, infrastructure adapta ao Supabase e nenhum segredo chega ao cliente.
- Não será criado proxy próprio de credenciais. Mensagens públicas continuam genéricas e autorização permanece baseada em claims server-side e RLS.
- Decisão completa: `adr/0017-auth-environment-security-hardening.md`.
