# Quality Gates

## Gate de Contexto
- `project-context.md` existe e está atualizado.
- Estado da máquina de estados está explícito.
- Fase atual e próximo passo estão documentados.
- Bloqueios e riscos estão registrados.

## Gate do Dia 1
- Visão do produto refinada.
- Escopo inicial validado.
- Módulos do MVP definidos.
- Domínio inicial documentado.
- Contratos principais entre camadas mapeados.
- Primeira small release selecionada.
- Backlog fatiado em small releases.
- Dependências críticas e bloqueios documentados.

### Resultado observado — SR-008
- Objetivo refinado para criar identidade verificável antes da persistência financeira.
- Escopo limitado a login por e-mail/senha, logout, sessão SSR, Proxy e proteção de rotas.
- Cadastro, recuperação, OAuth, MFA, banco financeiro e RLS permaneceram fora do escopo.
- Contratos `AuthUser`, `AuthGateway`, `SignInUseCase`, `SignOutUseCase` e `GetCurrentUserUseCase` definidos.
- Rotas públicas e privadas, redirecionamentos fixos e route groups planejados.
- Threat model documentado para cookies/JWT, expiração, enumeração, open redirect, cache e chaves.
- Auditoria identificou `getUser()` no refresh atual e `middleware.ts` depreciado; migração para `getClaims()` e `proxy.ts` foi planejada para nascer com testes.
- Nenhum código funcional, teste, migration, tabela ou política RLS criado.
- ADR `0003-auth-session-boundary.md` criado.
- Estado de saída validado como `ARCHITECTURE_READY`.

### Resultado observado — SR-009
- Dependências SR-007 e SR-008 confirmadas como concluídas.
- Login real validado pelo usuário no Chrome após limpeza de cache.
- Projeto Supabase `fin_control` inspecionado via MCP: Postgres 17, nenhuma tabela pública e nenhuma migration existente.
- Escopo limitado a criar e listar contas próprias; edição e exclusão permaneceram fora.
- Schema `public.financial_accounts`, constraints, índice e FK para `auth.users` definidos.
- Grants mínimos aprovados: somente `SELECT` e `INSERT` para `authenticated`.
- RLS por proprietário e bloqueio de usuários anônimos definidos; nenhuma policy `FOR ALL` planejada.
- Threat model cobre BOLA/IDOR, owner forjado, exposição da Data API, `service_role`, mass assignment e acesso anônimo.
- Supabase MCP aprovado para migration, pgTAP transacional, inspeção e advisors; nenhum SQL foi aplicado no Dia 1.
- Advisor de segurança identificou proteção contra senhas vazadas desativada; pendência `SEC-AUTH-001` registrada.
- ADR `0004-financial-accounts-persistence-rls.md` criado.
- Implementação funcional, testes e migration permanecem bloqueados até o Dia 2.
- Estado de saída validado como `ARCHITECTURE_READY`.

### Resultado observado do Dia 2 — SR-008
- Matriz de testes documentada em `test-strategy.md`.
- 7 suítes e 29 cenários criados para domínio, aplicação e infraestrutura crítica.
- Cenários cobrem login, logout, usuário atual, política de rotas, claims e cookies do Proxy.
- Fixtures usam somente identidade e credenciais demonstrativas.
- Primeira execução corrigiu apenas o ambiente do teste do Proxy de `jsdom` para `node`.
- Etapa vermelha válida: 7 suítes falharam exclusivamente por módulos funcionais ausentes.
- Rede anterior: 21 suítes e 110 testes passaram.
- `npm run type-check` falhou somente com `TS2307` dos módulos ausentes.
- `npm run lint` passou sem warnings.
- `npm audit --omit=dev` passou com 0 vulnerabilidades.
- Implementação, UI, rotas, migration e RLS permanecem bloqueados até o Dia 3.
- Estado de saída validado como `TEST_STRATEGY_READY`.

## Gate do Dia 2
- Setup técnico mínimo criado.
- Jest configurado.
- Testing Library configurada.
- Matriz de testes documentada.
- Testes essenciais de domínio criados.
- Testes essenciais de aplicação criados.
- Testes falham antes da implementação.
- Lint passa.
- Audit sem vulnerabilidades conhecidas.
- Implementação funcional segue bloqueada até Dia 3.

### Resultado observado — SR-009
- Matriz da persistência de contas documentada em `test-strategy.md`.
- Testes Jest criados para `FinancialAccount.restore`, `ListAccountsUseCase`, mapper, repository Supabase e Server Action autenticada.
- A composição testa claims ausentes, inválidas e anônimas, owner forjado e revalidação em cada chamada.
- Três suítes SQL pgTAP transacionais foram criadas para schema/grants, constraints e isolamento RLS.
- Planos pgTAP validados mecanicamente: 38 testes de schema, 13 de constraints e 17 de RLS.
- RED Jest: 5 suítes falharam somente por `restore` e quatro módulos deliberadamente ausentes; os 18 cenários anteriores executáveis permaneceram verdes no recorte.
- RED do type-check: somente seis ausências planejadas (`restore`, caso de uso, mapper, repository e action).
- Rede anterior, excluindo somente os testes RED da SR-009: 32 suítes e 135 testes passaram.
- RED remoto pelo Supabase MCP: pgTAP reportou 34 falhas de 38 porque `public.financial_accounts` ainda não existe.
- Rollback remoto confirmado: zero tabelas públicas, zero migrations e `pgtap` permaneceu não instalado.
- `npm run lint` passou sem warnings.
- `npm audit --omit=dev` passou com 0 vulnerabilidades.
- Build não foi executado porque o type-check deve permanecer vermelho por design nesta fase.
- Nenhuma migration, tabela, grant, policy ou implementação funcional foi criada.
- Estado de saída validado como `TEST_STRATEGY_READY`.

### Resultado observado — SR-006
- Matriz de testes do dashboard documentada em `test-strategy.md`.
- Testes de aplicação criados com 8 cenários para `GetDashboardSummaryUseCase`.
- Testes de apresentação criados com 4 cenários para `DashboardPage`.
- Testes de domínio novos não se aplicam: a SR-006 reutiliza tipos e regras já cobertos em `transactions` e não introduz entidade de domínio.
- Commit `0952a70` contém os testes e não contém implementação do dashboard, confirmando a etapa vermelha antes do Dia 3.
- Import não utilizado removido do teste de aplicação para satisfazer o lint com zero warnings.
- Suíte anterior passou com 8 suites e 46 testes.
- Testes do dashboard passaram no worktree atual com 2 suites e 12 testes devido à implementação do Dia 3 ainda não rastreada; essa execução não substitui a evidência histórica da etapa vermelha.
- `npm run lint` passou.
- `npm audit --omit=dev` passou com 0 vulnerabilidades.

- Estado de saída validado como `TEST_STRATEGY_READY`.

### Resultado observado — SR-007
- Matriz da SR-007 documentada em `test-strategy.md`.
- Teste de domínio criado para `FinancialAccount` com saldos positivo, zero e negativo, cinco tipos, normalização, BRL e entradas inválidas.
- Teste de aplicação criado para `CreateAccountUseCase` com chamada única ao contrato, bloqueio de entrada inválida e propagação de erro.
- Testes de apresentação não se aplicam ao Dia 2; formulário e sessão local permanecem futuros.
- Etapa vermelha: 2 suítes falharam por módulos funcionais ausentes.
- Rede anterior: 14 suítes e 69 testes passaram ao excluir `src/features/accounts/tests`.
- `npm run type-check` falhou com quatro `TS2307`, conforme esperado no estado vermelho.
- `npm run lint` passou sem warnings.
- `npm audit --omit=dev` passou com 0 vulnerabilidades.
- Implementação permanece bloqueada até o Dia 3.
- Estado de saída validado como `TEST_STRATEGY_READY`.

## Gate do Dia 3
- Código mínimo funcional implementado.
- Entidade de domínio criada sem dependência de framework.
- Caso de uso criado sem dependência de UI.
- Persistência acessada apenas por contrato.
- Testes principais passando.
- Type-check passando.
- Lint passando.
- Build passando.
- Audit sem vulnerabilidades conhecidas.
- Escopo não expandido para módulos fora da small release.

### Resultado observado — SR-008
- `AuthUser` implementado sem dependência de framework.
- `AuthGateway` criado como contrato do domínio.
- `SignInUseCase`, `SignOutUseCase` e `GetCurrentUserUseCase` dependem apenas do contrato.
- Política de rotas implementada como função pura.
- `SupabaseAuthGateway` concentra mapping de login, `getClaims()` e logout local na infraestrutura.
- Adapter de Proxy propaga cookies e headers anti-cache do `@supabase/ssr`.
- Primeiro type-check detectou contrato incorreto de headers; tipos foram alinhados ao pacote 0.12 sem `any`.
- Teste de regressão impediu que `x-middleware-next` fosse copiado de `NextResponse.next()` para redirects.
- Testes direcionados passaram com 7 suítes e 29 testes.
- Suíte completa passou com 28 suítes e 139 testes.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.
- Gates finais foram repetidos sequencialmente após uma disputa transitória de `.next/types` entre build e type-check paralelos.
- Nenhuma UI, rota de login, migration, tabela financeira ou RLS foi antecipada.
- Estado de saída validado como `IMPLEMENTATION_IN_PROGRESS`.

### Resultado observado — SR-009
- `FinancialAccount.restore`, `ListAccountsUseCase`, mapper, repository Supabase e Server Action autenticada implementados no mínimo exigido pelos testes.
- Contratos de criação e listagem permanecem independentes de React, Next.js e Supabase; integração concreta ficou em `infrastructure` e na composição do App Router.
- Server Action usa `getClaims()` em cada chamada, ignora owner do payload e falha fechada para claims ausentes, inválidas ou anônimas.
- Migration remota `20260714053335_create_financial_accounts` aplicada uma única vez pelo Supabase MCP e espelhada localmente.
- Schema possui FK, constraints, índice composto, RLS enabled/forced, grants mínimos e somente policies de `SELECT`/`INSERT` por proprietário.
- pgTAP remoto: 38/38 schema, 13/13 constraints e 17/17 RLS passaram; fixtures foram revertidas e `pgtap` não persistiu.
- Testes direcionados passaram com 5 suítes e 35 testes.
- Suíte completa passou com 37 suítes e 170 testes.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.
- Advisor de segurança manteve somente `SEC-AUTH-001`; aviso de performance das policies foi registrado como `DB-PERF-001`, sem criar migration iterativa fora do escopo.
- UI persistente, idempotência, edição, exclusão, categorias e transações não foram antecipadas.
- Estado de saída validado como `IMPLEMENTATION_IN_PROGRESS`.

### Resultado observado — SR-006
- `GetDashboardSummaryUseCase` implementado sem acesso direto a repositório.
- Resumo mensal delegado a `listSessionMonthlySummary`.
- Transações recentes isoladas por usuário, ordenadas por data e limitadas a cinco.
- `DashboardPage` e `DashboardEmptyState` implementados no escopo mínimo dos testes.
- Teste adicional reproduziu e corrigiu vazamento de transação recente entre usuários.
- Testes do dashboard passaram com 2 suites e 13 testes.
- Suíte completa passou com 10 suites e 59 testes.
- `npm run type-check`, `npm run lint` e `npm run build` passaram.
- `npm audit --omit=dev` passou com 0 vulnerabilidades.
- Estado de saída validado como `IMPLEMENTATION_IN_PROGRESS`.

### Resultado observado — SR-007
- `FinancialAccount` implementado sem dependência de framework.
- `AccountRepository` criado como contrato no domínio.
- `CreateAccountUseCase` depende apenas do contrato e não conhece UI ou Supabase.
- Saldos em centavos, tipos, BRL, nome e identificadores seguem as invariantes aprovadas.
- Testes direcionados passaram com 2 suítes e 21 testes.
- Suíte completa passou com 16 suítes e 90 testes.
- `npm run type-check`, `npm run lint` e `npm run build` passaram.
- `npm audit --omit=dev` passou com 0 vulnerabilidades.
- Nenhuma apresentação ou infraestrutura concreta foi antecipada.
- Estado de saída validado como `IMPLEMENTATION_IN_PROGRESS`.

## Gate do Dia 4
- Presentation inicial criada.
- Estados de idle, loading, success e error implementados quando aplicável.
- UI não acessa Supabase diretamente.
- UI não contém regra de negócio pesada.
- Testes relevantes de frontend criados.
- Testes passando.
- Type-check passando.
- Lint passando.
- Build passando.
- Audit sem vulnerabilidades conhecidas.
- Escopo não expandido para cartão, parcelas, dashboard completo, IA, importação ou Open Finance.

### Resultado observado — SR-006
- Estados loading, empty, success e error implementados no dashboard.
- Provider local mantém transações em memória entre rotas sem acessar infraestrutura.
- Painel mensal e lista de até cinco transações recentes implementados.
- Rotas `/`, `/dashboard` e `/transactions` geradas pelo build.
- Navegação entre dashboard e registro manual implementada.
- `formatCents` compartilhado em `src/shared/utils`.
- Etapa vermelha registrada com 4 suites falhando por módulos e rotas ausentes.
- Recorte direcionado passou com 5 suites e 21 testes.
- Suíte completa passou com 12 suites e 65 testes.
- `npm run type-check`, `npm run lint` e `npm run build` passaram.
- `npm audit --omit=dev` passou com 0 vulnerabilidades.
- Desktop de 1280px e mobile de 390px sem overflow horizontal no navegador integrado.
- Limitação de automação do campo nativo de data documentada.

### Resultado observado — SR-007
- Estados `idle`, `submitting`, `success` e `error` implementados no cadastro local.
- `AccountSessionProvider` mantém contas somente em memória e executa `CreateAccountUseCase`.
- Formulário, lista, página e rota `/accounts` implementados.
- Dashboard oferece link acessível para `Contas`.
- UI não importa Supabase e não contém regra financeira pesada.
- Saldo negativo é explicado como saldo informado, não limite de crédito.
- Etapa vermelha registrada por módulos, rota e link ausentes.
- Etapa verde direcionada passou com 7 suítes e 35 testes.
- Suíte completa passou com 20 suítes e 99 testes.
- `npm run type-check`, `npm run lint` e `npm run build` passaram.
- `npm audit --omit=dev` passou com 0 vulnerabilidades.
- Build gerou `/`, `/accounts`, `/dashboard` e `/transactions`.

### Resultado observado — SR-008
- Testes de apresentação e composição foram escritos antes da implementação; 6 suítes falharam por módulos e route groups ausentes.
- Login implementa estados `idle`, `loading`, `success` e `error`, com labels, autocomplete, bloqueio de envio duplicado e erro genérico.
- Logout usa o caso de uso e escopo local, com feedback de progresso, sucesso e falha controlada.
- `AuthSessionProvider` distribui a identidade verificada; IDs demonstrativos foram removidos das páginas financeiras.
- Providers financeiros foram removidos do layout raiz e compostos somente no layout privado.
- `/login` foi criada no route group público; `/`, `/dashboard`, `/accounts` e `/transactions` foram movidas para o route group privado sem alterar URLs.
- `middleware.ts` foi substituído por `src/proxy.ts`; o primeiro posicionamento na raiz foi corrigido após o build não declarar o Proxy.
- Etapa verde direcionada passou com 9 suítes e 22 testes.
- Suíte completa passou com 32 suítes e 146 testes.
- `npm run type-check`, `npm run lint`, `npm audit --audit-level=high` e `npm run build` passaram.
- Build declarou `ƒ Proxy (Middleware)` e gerou `/login` estática, com rotas financeiras dinâmicas.
- Inspeção visual reexecutada em 2026-07-13: o navegador integrado bloqueou os endereços locais antes do carregamento e não havia navegador alternativo; semântica, estados, responsividade e build permanecem validados por testes e revisão de código.
- Nenhuma migration, tabela financeira, política RLS, cadastro, recuperação, OAuth ou MFA foi adicionada.

### Resultado observado — SR-009
- Testes de apresentação, actions e estados de rota foram escritos antes da implementação; RED direcionado registrou 4 suítes falhando e 7 falhas esperadas.
- `/accounts` passou a listar contas persistentes em Server Component e a criar por Server Action com claims verificadas.
- DTOs da aplicação removem `userId` da fronteira visual; owner não é recebido nem controlado pelo cliente.
- Estados de loading, empty e error sanitizado foram implementados; success mantém o registro persistido retornado pela action.
- UI não importa Supabase e não contém regra financeira pesada.
- Etapa verde direcionada passou com 4 suítes e 16 testes.
- Suíte completa passou com 37 suítes e 174 testes.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.
- Chrome autenticado validou desktop e mobile `390x844` sem overflow horizontal, cópias persistentes, campos obrigatórios e console sem warnings/errors.
- Nenhuma gravação foi feita no navegador; Supabase MCP confirmou zero registros e somente a migration aprovada do Dia 3.
- Edição, exclusão, arquivamento, categorias, transações, idempotência e segunda migration permaneceram fora do escopo.
- Estado de saída validado como `IMPLEMENTATION_IN_PROGRESS`.

## Gate do Dia 5
- Arquivos inchados identificados.
- Plano de refatoração incremental documentado.
- Refatorações aplicadas preservando comportamento.
- Integridade de dados revisada.
- Consistência visual e estrutural preservada.
- Testes passando.
- Type-check passando.
- Lint passando.
- Build passando.
- Audit sem vulnerabilidades conhecidas.
- Escopo não expandido para nova feature de negócio.

### Resultado observado — SR-006
- Arquivos de produção do dashboard medidos; nenhum ultrapassava 100 linhas.
- Resolução duplicada de competência consolidada em utilitário de aplicação.
- `formatMonthRef` centralizado em `src/shared/utils`.
- Instâncias de formatadores `Intl` reutilizadas.
- Provider passou a clonar transações na entrada e contratos de leitura passaram a readonly.
- Teste reproduziu e corrigiu mutação externa da sessão.
- Componentes de métrica permaneceram separados por diferença visual intencional.
- `TransactionForm.tsx` registrado como fora do escopo da SR-006, sem refatoração oportunista.
- Recorte direcionado passou com 7 suites e 25 testes.
- Suíte completa passou com 14 suites e 69 testes.
- `npm run type-check`, `npm run lint` e `npm run build` passaram.
- `npm audit --omit=dev` passou com 0 vulnerabilidades.

### Resultado observado — SR-007
- Arquivos de produção medidos; `AccountForm.tsx` é o maior com 177 linhas e mantém responsabilidade única de renderização do formulário.
- Parsing monetário duplicado consolidado em utilitário compartilhado com negativo opt-in.
- Mutações externas de entrada e retorno da sessão foram reproduzidas por testes.
- Provider passou a armazenar cópias congeladas das contas.
- Estilos de formulário não foram abstraídos prematuramente.
- Recorte direcionado passou com 4 suítes e 28 testes.
- Suíte completa passou com 21 suítes e 109 testes.
- `npm run type-check`, `npm run lint` e `npm run build` passaram.
- `npm audit --omit=dev` passou com 0 vulnerabilidades.
- Nenhuma regra de negócio ou feature nova foi adicionada.
- Hardening encerrado com retorno a `IMPLEMENTATION_IN_PROGRESS`.

### Resultado observado — SR-008
- Auditoria identificou duplicação e divergência na configuração pública entre browser, server e Proxy.
- `LoginPage.tsx` e o adapter de Proxy foram mantidos coesos; não houve divisão cosmética por contagem de linhas.
- TDD RED: módulo de configuração ainda ausente e matcher limitado fizeram 2 suítes falharem.
- TDD GREEN direcionado: 3 suítes e 11 testes passaram.
- Configuração consolidada em `src/lib/supabase/config.ts`, preferindo publishable key e aceitando anon key como fallback legado.
- URL é normalizada e validada sem incluir seu conteúdo em mensagens de erro.
- Matcher do Proxy exclui SVG, PNG, JPG, JPEG, GIF e WebP, além dos assets internos e manifest.
- `npm run test:ci`: passou, 33 suítes e 152 testes.
- `npm run lint`: passou, 0 warnings.
- `npm run type-check`: passou.
- `npm audit --audit-level=high`: passou, 0 vulnerabilidades.
- `npm run build`: passou e declarou `ƒ Proxy (Middleware)`.
- Runtime local: `/` respondeu `307` para `/login`; `/login` e `/icon.svg` responderam `200`.
- Bloqueio resolvido: Project URL HTTPS e publishable key válidas; endpoint público do Supabase Auth respondeu `200` sem exposição dos valores.
- Estado de saída: retorno ao fluxo estável em `IMPLEMENTATION_IN_PROGRESS`, pronto para o Dia 6.

### Resultado observado — SR-009
- Baseline de accounts passou com 10 suítes e 53 testes antes da refatoração.
- `AccountSessionProvider` e seus 4 testes exclusivos foram removidos porque não possuíam consumidor no fluxo persistente.
- `AccountSessionList` foi renomeada para `AccountList`; comportamento visual e DTO persistente foram preservados.
- Nenhum arquivo de produção foi classificado como monólito crítico; `AccountForm.tsx` permaneceu coeso.
- RED pgTAP de performance falhou 2/2 antes da migration.
- Migration `20260714061527_optimize_financial_accounts_rls_auth_initplan` passou a envolver diretamente `auth.jwt()` em `select` nas duas policies.
- pgTAP completo passou com 38 testes de schema/grants, 13 de constraints, 17 de RLS e 2 de performance.
- Performance Advisor retornou sem alertas; Security Advisor manteve somente `SEC-AUTH-001`.
- Tabela permaneceu vazia e a extensão pgTAP não persistiu.
- Suíte Jest completa passou com 36 suítes e 170 testes.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.
- Build preservou `/accounts` dinâmica e `ƒ Proxy (Middleware)`.
- Estado de saída: retorno ao fluxo estável em `IMPLEMENTATION_IN_PROGRESS`, pronto para o Dia 6.

## Gate do Dia 6
- Layout mobile first revisado.
- Campos principais têm labels acessíveis.
- Campos obrigatórios usam semântica nativa.
- Tipo de transação usa radios nativos em controle segmentado.
- Erros de formulário usam `aria-invalid` e mensagens anunciáveis.
- Estados de sucesso e erro usam roles apropriadas.
- Região de lançamentos está semanticamente nomeada.
- Regiões de resumo mensal e lançamentos usam `aria-live="polite"`.
- Métricas do resumo mensal têm nomes acessíveis com rótulo e valor.
- Manifest PWA inclui shortcut para registro manual de transação.
- Manifest PWA revisado e servido localmente.
- Offline não foi prometido sem estratégia real.
- `npm run test:ci` passou com 8 suites e 46 testes.
- `npm run type-check` passou.
- `npm run lint` passou.
- `npm run build` passou.
- `npm audit` passou com 0 vulnerabilidades.
- Limitação de verificação visual pelo navegador integrado documentada.

### Resultado observado — SR-006
- Dashboard e registro manual inspecionados em 390x844 e 1280x800 sem overflow horizontal.
- Empty state do dashboard passou a ser anunciado como status.
- CTA do empty state passou a ter alvo mínimo de 44 px e foco visível consistente.
- Atalho do manifest corrigido para `/transactions`.
- Restrição de orientação removida por não ser essencial ao produto.
- Manifest permanece vinculado à aplicação e configurado para modo standalone.
- Offline permaneceu fora do escopo porque o estado financeiro atual existe apenas em memória.
- Etapa vermelha registrada com 3 falhas esperadas; etapa verde direcionada passou com 2 suites e 6 testes.
- `npm run test:ci`: passou, 14 suites e 69 testes.
- `npm run type-check`: passou.
- `npm run lint`: passou, 0 warnings.
- `npm audit --omit=dev`: passou, 0 vulnerabilidades.
- `npm run build`: passou com `/`, `/dashboard` e `/transactions`.

### Resultado observado — SR-007
- Fluxo de contas revisado por código, semântica e testes de apresentação.
- Link de retorno passou de 40 px para alvo mínimo de 44 px.
- Nomes de conta sem espaços receberam quebra responsiva e contêiner flexível sem largura mínima implícita.
- Manifest passou a oferecer shortcut `Cadastrar conta` para `/accounts`.
- Offline e service worker permaneceram fora do escopo porque as contas existem somente em memória.
- Inspeção visual interativa foi interrompida pela automação ao não conseguir confirmar a URL local com segurança; a limitação foi registrada e a validação continuou por testes, semântica, build e revisão de classes responsivas.
- Etapa vermelha direcionada: 2 suítes falharam com 3 critérios ainda ausentes.
- Etapa verde direcionada: 2 suítes e 4 testes passaram.
- `npm run test:ci`: passou, 21 suítes e 110 testes.
- `npm run type-check`: passou.
- `npm run lint`: passou, 0 warnings.
- `npm audit --omit=dev`: passou, 0 vulnerabilidades.
- `npm run build`: passou com `/`, `/accounts`, `/dashboard` e `/transactions`.
- Estado de saída validado como `QUALITY_VALIDATION`.

### Resultado observado — SR-008
- Formulário de login nomeado e com `aria-busy`; login e logout anunciam processamento por `role="status"`.
- Hierarquia de títulos corrigida e linguagem técnica removida da instrução ao usuário.
- Contraste do alerta de login elevado para o limiar WCAG AA essencial.
- Desktop validado em `1366px`, com duas colunas, card de `1024px` e sem overflow horizontal.
- Mobile validado em `390x844`, com uma coluna, margens de `16px`, `min-height` dinâmica e sem overflow horizontal.
- Manifest preserva shortcuts protegidos e passou a declarar PNG `192x192`, PNG `512x512` e maskable `512x512`.
- Apple Touch Icon `180x180` configurado; formato e dimensões dos quatro PNGs validados por teste.
- Offline e service worker permaneceram fora do escopo por ausência de estratégia segura de consistência.
- Etapa vermelha de acessibilidade: 2 suítes falharam pelos contratos semânticos ausentes.
- Etapa verde direcionada: 2 suítes e 5 testes passaram.
- Etapa vermelha PWA: manifest falhou pela ausência dos assets rasterizados.
- Etapa verde PWA: 1 suíte e 2 testes passaram.
- `npm run test:ci`: passou, 33 suítes e 153 testes.
- `npm run lint`: passou, 0 warnings.
- `npm run type-check`: passou.
- `npm audit --audit-level=high`: passou, 0 vulnerabilidades.
- `npm run build`: passou com `/login` estática e `ƒ Proxy (Middleware)`.
- Estado de saída validado como `QUALITY_VALIDATION`.

### Resultado observado — SR-009
- Alerta de erro do cadastro usa contraste reforçado; regiões vivas declaram atualização relevante e as superfícies de rota usam altura dinâmica com fallback.
- Shortcut PWA de contas descreve corretamente o fluxo persistente; offline e service worker não foram prometidos sem estratégia de consistência autenticada.
- Etapa vermelha direcionada: 4 suítes falharam, com 5 critérios ausentes.
- Etapa verde direcionada: 4 suítes e 12 testes passaram.
- `npm run test:ci`: passou, 36 suítes e 170 testes.
- `npm run type-check`: passou.
- `npm run lint`: passou, 0 warnings.
- `npm audit --omit=dev`: passou, 0 vulnerabilidades.
- `npm run build`: passou com `/accounts` dinâmica e `ƒ Proxy (Middleware)`.
- Chrome instalado/em execução e extensão instalada/habilitada; inspeção visual bloqueada porque a verificação oficial confirmou ausência do registro do host nativo do plugin.
- Estado de saída: `BLOCKED`; `QUALITY_VALIDATION` permanece pendente até a inspeção desktop/mobile real no Chrome.

## Gate do Dia 7
- Testes validados e documentados.
- Type-check validado e documentado.
- Lint validado e documentado.
- Audit validado e documentado.
- Build validado e documentado.
- Revisão básica de segurança executada.
- Segredos versionáveis verificados.
- Fronteiras arquiteturais críticas verificadas.
- Baseline de observabilidade definido.
- Riscos residuais documentados.
- Release incremental preparada.
- Estado final definido como `READY_FOR_RELEASE`.

### Resultado observado — SR-006
- `npm run lint`: passou, 0 warnings.
- `npm run type-check`: passou.
- `npm run test:ci`: passou, 14 suites e 69 testes.
- `npm audit --audit-level=high`: passou, 0 vulnerabilidades.
- `npm run build`: passou com `/`, `/dashboard` e `/transactions`.
- `.github/workflows/ci.yml` criado para reproduzir os gates em push e pull request para `main`.
- Nenhum segredo real, service role, `any`, armazenamento persistente no navegador ou acesso Supabase fora de `src/lib/supabase` foi identificado.
- Autenticação e RLS permanecem pré-requisitos duros antes de persistir dados financeiros reais.
- Baseline de observabilidade definida por logs de CI, falhas explícitas de configuração e estados de erro anunciáveis.
- Nenhum risco crítico aberto dentro do escopo demonstrativo da SR-006.
- Estado final: `READY_FOR_RELEASE`.

### Resultado observado — SR-007
- `npm run lint`: passou, 0 warnings.
- `npm run type-check`: passou.
- `npm run test:ci`: passou, 21 suítes e 110 testes.
- `npm audit --audit-level=high`: passou, 0 vulnerabilidades.
- `npm run build`: passou com `/`, `/accounts`, `/dashboard` e `/transactions`.
- Somente `.env.example` está versionado entre arquivos de ambiente; valores permanecem vazios ou demonstrativos.
- Nenhum uso de service role, `eval`, `dangerouslySetInnerHTML`, armazenamento persistente no navegador ou acesso Supabase fora de `src/lib/supabase` foi identificado no código da release.
- `package-lock.json` está versionado e as versões de `@supabase/ssr` e `@supabase/supabase-js` permanecem fixadas.
- Domínio e aplicação de contas não importam React, Next.js ou Supabase; apresentação não acessa banco.
- Orientação oficial atual do Supabase revisada: grants e RLS devem compor a mesma fronteira de segurança antes de expor tabelas; isso permanece bloqueado para a SR-009, após autenticação na SR-008.
- Baseline de observabilidade definida por logs de CI, erros de formulário anunciáveis e falhas explícitas de configuração.
- Nenhum risco crítico aberto dentro do escopo local e efêmero da SR-007.
- Estado final: `READY_FOR_RELEASE`.

### Resultado observado — SR-008
- `npm ci`: passou, 754 pacotes instalados pelo lockfile e 0 vulnerabilidades.
- `npm run lint`: passou, 0 warnings.
- `npm run type-check`: passou.
- `npm run test:ci`: passou, 33 suítes e 153 testes.
- `npm audit --audit-level=high`: passou, 0 vulnerabilidades.
- `npm run build`: passou; `/login` permaneceu estática, rotas privadas dinâmicas e `Proxy (Middleware)` ativo.
- Runtime fixado em Node `>=22 <23` e npm `>=11 <12`; CI instala npm `11.5.2` e exercita a publishable key preferencial.
- Somente `.env.example` está versionado; o segredo local privilegiado detectado permanece ignorado, não é referenciado pelo código e deve ser removido do ambiente se desnecessário.
- Autenticação usa claims verificadas, falha fechada e destinos de redirect fixos; UI não importa Supabase e erros públicos não enumeram usuários.
- Nenhum uso de service role no código, `eval`, `dangerouslySetInnerHTML`, armazenamento persistente no navegador ou segredo versionado foi identificado.
- Baseline de observabilidade definida sem PII: resultados técnicos enumerados, duração por faixas, release e ambiente; e-mail, senha, JWT, cookies, IDs brutos e replay ficam proibidos.
- Deploy público permanece condicionado a monitoramento sanitizado, rate limits/antiabuso, headers de segurança e validação do ambiente Supabase.
- Consulta atual ao changelog/documentação oficial do Supabase excedeu o tempo disponível; versões estão fixadas e nenhuma API, migration ou política RLS foi alterada nesta fase.
- Nenhum risco crítico aberto no escopo da SR-008.
- Estado final: `READY_FOR_RELEASE`.

## Gate de Arquitetura
- Feature respeita `presentation`, `application`, `domain`, `infrastructure`.
- UI não acessa Supabase diretamente.
- Domain não depende de frameworks.
- Infrastructure concentra integrações externas.
- Contratos entre camadas estão claros.

## Gate de TDD
- Testes essenciais existem antes de implementação funcional relevante.
- Domain e application têm prioridade de cobertura.
- Cenários críticos foram cobertos.
- Bugs começam por teste de reprodução.

## Gate de Qualidade Automatizada
A cada entrega relevante:
- lint deve passar
- type-check deve passar
- testes devem passar
- build deve passar

## Gate de Segurança
Obrigatório para áreas críticas:
- autenticação revisada
- autorização revisada
- RLS planejado ou implementado
- segredos fora do código
- dados financeiros protegidos
- ações sensíveis exigem confirmação do usuário

## Gate de PWA e UX
- layout mobile first
- estados principais de UI definidos
- acessibilidade mínima revisada
- manifest e ícones planejados ou implementados
- offline não deve ser prometido sem estratégia real

## Gate de Release
Uma release incremental só pode ser considerada pronta quando:
- critérios de pronto da fase foram satisfeitos
- quality gates aplicáveis estão verdes
- riscos remanescentes foram documentados
- backlog foi atualizado
- próximo passo está claro

## Correção crítica antes do Dia 5 — BUG-001

- `npm run test:ci -- src/features/auth/tests/supabase-proxy.test.ts`: passou, 1 suíte e 6 testes.
- `npm run test:ci`: passou, 32 suítes e 148 testes.
- `npm run lint`: passou, 0 warnings.
- `npm run type-check`: passou.
- `npm run build`: passou e declarou `ƒ Proxy (Middleware)`.
- Verificação HTTP com a configuração malformada: `/` respondeu `307` para `/login`; `/login` respondeu `200`; nenhum erro 500.
- Segurança: fallback falha fechado, sem liberar rota privada e sem expor valores de ambiente.
- Risco remanescente: autenticação real permanece indisponível enquanto `NEXT_PUBLIC_SUPABASE_URL` não for substituída pela Project URL HTTPS correta em `.env.local`.
