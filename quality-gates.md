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

### Resultado observado — SR-012
- SR-011 confirmada em `develop` e branch `feature/SR-012-periodos-financeiros` criada a partir da base integrada.
- Escopo limitado a `week`, `rolling_7_days`, `fortnight`, `rolling_15_days` e `month`.
- `CivilDate` e intervalos semiabertos foram definidos sem `Date`, relógio ou timezone implícito no domínio.
- Timezone ficou restrito à futura conversão explícita de instante para data civil; `occurred_on date` não sofre conversão.
- Contratos de domínio e aplicação foram documentados com DTOs serializáveis.
- `custom`, consulta persistente por intervalo, agregação, UI, gráficos e alterações Supabase permaneceram fora.
- ADR `0009-financial-periods-civil-date-boundaries.md` criado.
- Nenhum código funcional, teste, migration, policy, grant, rota ou dependência foi criado.
- `git diff --check`, lint e type-check passaram; testes e build não foram executados por se tratar de uma entrega exclusivamente documental.
- Estado de saída validado como `ARCHITECTURE_READY`.
- Próximo comando válido: `dia 2`.

### Resultado observado — UI-002
- UI-001 confirmada como dependência concluída e UI-002 movida para `IN_PROGRESS`.
- Rotas funcionais auditadas e limitadas a `/dashboard`, `/transactions` e `/accounts`; `/` permanece alias do dashboard.
- Matriz desktop, tablet e mobile definida sem renderizar rotas ou ações futuras.
- `PrivateAppShell` preservado como composition root visual, sem regra financeira e sem novo acesso ao Supabase.
- Componentes específicos planejados próximos ao App Router; nenhuma primitive genérica ou dependência adicional autorizada.
- Contratos preliminares cobrem estado ativo, `aria-current`, teclado, foco, 44 × 44 px, overflow, tema e logout.
- Busca, notificações, perfil, configurações, botão “Adicionar”, drawers, bottom sheets e novas rotas permaneceram fora do escopo.
- ADR `0006-responsive-private-shell.md` criado.
- Nenhum código funcional ou teste criado no Dia 1.
- Estado de saída validado como `ARCHITECTURE_READY`.

### Resultado observado — SR-010
- Dependências SR-008 e SR-009 confirmadas como concluídas; branch criada a partir de `origin/develop` com alterações locais alheias preservadas.
- Projeto Supabase `fin_control` inspecionado via MCP em modo somente leitura: Postgres 17, apenas `public.financial_accounts` e duas migrations aplicadas.
- Grants atuais confirmados como `SELECT/INSERT` somente para `authenticated`; RLS habilitada/forçada e policies de ownership de contas permanecem coerentes.
- Performance Advisor retornou sem alertas; Security Advisor manteve somente `auth_leaked_password_protection`, já rastreado em `SEC-AUTH-001`.
- Escopo limitado a criar e listar categorias próprias com nome normalizado e `kind` `income | expense`.
- Schema `public.categories`, constraints, índices, FK para Auth, chave composta futura, grants mínimos e policies separadas de `SELECT`/`INSERT` foram definidos.
- Rota `/categories` planejada como subfluxo privado de transações, sem ampliar a navegação principal da UI-002.
- Threat model cobre BOLA/IDOR, owner forjado, usuário anônimo, mass assignment, duplicidade e vínculo futuro cross-tenant.
- Supabase MCP aprovado para migration, pgTAP transacional, inspeção e advisors nas fases correspondentes; nenhum SQL mutável foi executado no Dia 1.
- ADR `0007-categories-persistence-rls.md` criado.
- Implementação funcional, testes e migration permanecem bloqueados até o Dia 2.
- Estado de saída validado como `ARCHITECTURE_READY`.

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

### Resultado observado — SR-012
- Matriz de domain e application documentada em `test-strategy.md`.
- 3 suítes e 37 cenários foram criados antes da implementação.
- RED direcionado válido: 3 suítes falharam exclusivamente pelos módulos de produção ausentes.
- Type-check falhou somente com 6 erros `TS2307` referentes aos 5 módulos planejados.
- Rede anterior passou com 61 suítes e 294 testes ao excluir os contratos RED da SR-012.
- Lint passou com 0 warnings e `git diff --check` passou.
- Build não foi executado porque o type-check vermelho é deliberado.
- Nenhum código funcional, migration, integração, UI ou dependência foi criado.
- Estado de saída validado como `TEST_STRATEGY_READY`.
- Próximo comando válido: `dia 3`.
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

### Resultado observado — SR-010
- Matriz documentada em `test-strategy.md` para domínio, aplicação, infrastructure, banco e apresentação futura.
- Seis arquivos Jest foram criados, incluindo fixture, com 22 cenários planejados.
- Quatro suítes pgTAP foram criadas com planos validados de 33, 12, 17 e 3 asserções.
- Baseline anterior passou com 44 suítes e 212 testes, type-check, lint e audit com 0 vulnerabilidades.
- RED Jest válido: 5 suítes falharam exclusivamente pelos módulos de produção ausentes.
- Type-check falhou somente com 11 `TS2307` referentes aos mesmos módulos planejados.
- Lint passou com 0 warnings.
- Rede anterior permaneceu verde com 44 suítes e 212 testes ao excluir apenas os contratos RED da SR-010.
- RED remoto via MCP confirmou 1 falha de 1 pela ausência de `public.categories`.
- Rollback remoto preservou uma tabela pública, duas migrations e `pgtap` não instalada.
- Nenhuma implementação, migration, tabela, grant, policy, dado ou configuração Supabase foi criada.
- Build não foi executado porque o type-check vermelho é deliberado.
- Estado de saída validado como `TEST_STRATEGY_READY`.

### Resultado observado — UI-002
- Matriz documentada em `test-strategy.md` com configuração pura, composition root, acessibilidade, responsividade e regressão.
- Dois arquivos de teste criados antes da implementação, totalizando 14 cenários planejados.
- RED direcionado válido: 2 suítes falharam; 4 testes do shell executaram e falharam pelos contratos ausentes, enquanto a suíte de configuração foi bloqueada pelo módulo ainda inexistente.
- O harness foi corrigido para carregar `PrivateAppShell` depois do mock de `next/navigation`; nenhuma expectativa funcional foi alterada.
- Type-check falhou somente com um `TS2307` para `navigation/private-navigation`.
- Rede anterior: 41 suítes e 194 testes passaram ao excluir apenas os dois contratos RED da UI-002.
- Lint passou com 0 warnings.
- Build não foi executado porque o type-check vermelho é deliberado; audit não foi repetido porque dependências e lockfile não mudaram.
- Nenhum código funcional, componente, rota, dependência ou integração foi criado.
- Estado de saída validado como `TEST_STRATEGY_READY`.

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

### Resultado observado — SR-012
- `CivilDate`, tipos de período, resolução dos cinco períodos, pertencimento ao intervalo e caso de uso foram implementados sem `Date`, React, Next.js, Supabase ou `any`.
- Testes direcionados passaram com 3 suítes e 37 testes.
- Regressão completa passou com 64 suítes e 331 testes.
- Type-check, lint, build e `git diff --check` passaram.
- A auditoria encontrou 4 vulnerabilidades altas em produção e 6 no conjunto completo; nenhuma dependência foi alterada fora do escopo do Dia 3.
- A dívida `SEC-DEPS-001` foi registrada com severidade ALTA e prazo anterior ao Dia 7.
- A implementação está apta à expansão controlada, mas release e deploy permanecem bloqueados até a remediação da auditoria.
- Estado de saída validado como `IMPLEMENTATION_IN_PROGRESS`.

### Resultado observado — UI-002
- Configuração pura de três rotas e alias `/` implementada sem dependência de framework ou infraestrutura.
- Sidebar/rail, topbar e navegação mobile criadas próximas ao App Router, sem nova primitive compartilhada.
- `PrivateAppShell` preserva autenticação, tema, logout e exatamente um `main` pertencente à página.
- Somente dashboard, transações e contas aparecem; destinos e ações futuras permanecem ausentes.
- Testes direcionados passaram com 2 suítes e 14 testes.
- Regressão completa passou com 43 suítes e 208 testes.
- Type-check e lint passaram; lint registrou 0 warnings.
- Audit passou com 0 vulnerabilidades.
- Build passou com todas as rotas existentes e `ƒ Proxy (Middleware)`.
- Inspeção estática confirmou ausência de Supabase e regras financeiras nos novos componentes e configuração.
- Estado de saída validado como `IMPLEMENTATION_IN_PROGRESS`.

### Resultado observado — SR-010
- `Category`, `CategoryRepository`, casos de uso de criação/listagem, mapper e repository Supabase foram implementados no mínimo exigido pelos contratos RED.
- Domínio e aplicação permanecem independentes de React, Next.js e Supabase; a integração concreta está isolada em `infrastructure`.
- Migration `20260717022313_create_categories` foi aplicada pelo MCP do Supabase e alinhada ao arquivo local sem drift de versão.
- Schema possui seis colunas aprovadas, FK com cascade, constraints, unicidade case-insensitive, chave composta futura e índices de ownership/ordenação.
- RLS está habilitada e forçada; somente `authenticated` possui `SELECT`/`INSERT`, com policies separadas por proprietário e bloqueio de Auth anônimo.
- pgTAP remoto passou com 33/33 schema, 12/12 constraints, 17/17 RLS e 3/3 performance; fixtures e extensão temporária foram revertidas.
- Testes direcionados passaram com 5 suítes e 22 testes; suíte completa passou com 49 suítes e 234 testes.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.
- Performance Advisor não retornou alertas; Security Advisor manteve somente `SEC-AUTH-001`, aviso preexistente e fora do escopo desta migration.
- Nenhuma UI, rota, action, edição, exclusão, seed, personalização visual ou persistência de transações foi antecipada.
- Estado de saída validado como `IMPLEMENTATION_IN_PROGRESS`.

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

### Resultado observado — SR-012
- Presentation e estados visuais não se aplicam à SR-012, conforme arquitetura aprovada para esta release de domínio puro.
- RED direcionado confirmou 2 falhas: `month` e `fortnight` aceitavam fim exclusivo no ano `10000`.
- `CivilDate` passou a ter cobertura explícita dos limites `0001-01-01` e `9999-12-31`.
- O formatador interno agora rejeita qualquer limite calculado fora dos anos `0001` a `9999`.
- GREEN direcionado passou com 3 suítes e 42 testes; regressão completa passou com 64 suítes e 336 testes.
- Type-check, lint, build e `git diff --check` passaram; o build precisou de acesso de rede somente para baixar Geist pelo `next/font`.
- Nenhuma UI, infraestrutura, integração, dependência ou nova capacidade financeira foi adicionada.
- A auditoria permanece com 4 vulnerabilidades altas em produção e 6 no conjunto completo, já registradas em `SEC-DEPS-001`; release continua bloqueado.
- Estado de saída validado como `IMPLEMENTATION_IN_PROGRESS`.

### Resultado observado — UI-002
- RED direcionado confirmou somente a ausência do atalho de conteúdo; 16 cenários anteriores permaneceram verdes.
- Skip link e alvo focalizável adicionados sem introduzir um segundo `main`.
- Topbar passou a permanecer sticky com tema, identidade e logout disponíveis durante rolagem.
- Testes de integração confirmaram logout local, redirect fixo e refresh do router.
- Path desconhecido mantém título neutro e nenhum item com `aria-current`.
- GREEN direcionado: 2 suítes e 17 testes.
- Regressão completa: 43 suítes e 211 testes.
- Type-check, lint, audit com 0 vulnerabilidades e build passaram.
- Assinatura inicialmente estreita do mock de logout foi documentada e corrigida sem alterar código funcional.
- Nenhuma rota, dependência, integração ou capacidade futura foi adicionada.
- Estado de saída validado como `IMPLEMENTATION_IN_PROGRESS`.

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

### Resultado observado — SR-010
- Testes de apresentação, actions, rota e integração com Transações foram escritos antes da implementação; RED direcionado confirmou módulos e link ausentes.
- `/categories` lista categorias persistentes em Server Component e cria por Server Action com claims verificadas.
- DTOs removem `userId` da fronteira visual; owner é obtido exclusivamente do claim autenticado.
- Estados `submitting`, `success`, `error`, `loading` e `empty` foram implementados com mensagens acessíveis e erro sanitizado.
- UI não importa Supabase e não contém regra de negócio pesada; `/categories` permanece subfluxo de Transações.
- GREEN direcionado passou com 5 suítes e 16 testes; navegação privada passou com 1 suíte e 11 testes.
- Suíte completa passou com 53 suítes e 249 testes.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.
- Navegador interno autenticado validou formulário, estado vazio, link contextual único e console sem erros; nenhuma gravação foi realizada.
- Chrome externo bloqueou `localhost` pela extensão, sem impedir a validação autenticada alternativa.
- Edição, exclusão, arquivamento, personalização visual, seeds e persistência de transações permaneceram fora do escopo.
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

### Resultado observado — SR-012
- Arquivos medidos: o resolver possui 181 linhas e permanece coeso; nenhum módulo foi classificado como monólito.
- A única duplicação relevante, cálculo de ano bissexto e dias do mês, foi consolidada no serviço puro `gregorian-calendar.ts`.
- Deslocamentos permanecem limitados a no máximo 15 iterações civis; nenhum gargalo justificou otimização adicional.
- A refatoração preservou 3 suítes e 42 testes direcionados.
- Next foi atualizado de `16.2.10` para `16.3.3` seguindo a trilha oficial da versão 16, sem codemod ou mudança de major.
- React/React DOM `19.2.8`, ESLint Config Next `16.3.3`, PostCSS `8.5.23`, Sharp `0.35.3`, Nanoid `3.3.18`, `brace-expansion` e `js-yaml` foram alinhados sem `--force`.
- Auditorias de produção e completa passaram com 0 vulnerabilidades; `SEC-DEPS-001` foi concluída.
- Regressão completa passou com 64 suítes e 336 testes; type-check, lint e build com `ƒ Proxy (Middleware)` passaram.
- Nenhuma regra financeira, UI, integração, Supabase ou migration foi adicionada.
- Hardening encerrado com retorno a `IMPLEMENTATION_IN_PROGRESS`.

### Resultado observado — UI-002
- Arquivos do shell medidos; o maior tinha 99 linhas e nenhum foi classificado como monólito.
- Componentes desktop e mobile permaneceram separados por diferenças reais de composição e responsividade.
- RED direcionado confirmou ausência de forma e peso no estado ativo móvel: 1 falha e 16 testes preservados.
- GREEN direcionado passou com 2 suítes e 17 testes.
- Resolução da rota ativa consolidada em uma busca por variante, sem nova abstração.
- Estado ativo móvel reforçado com fundo, peso, cor e `aria-current`.
- `npm run test:ci`: 43 suítes e 211 testes passaram.
- `npm run type-check`: passou.
- `npm run lint`: passou com 0 warnings.
- `npm audit --audit-level=high`: passou com 0 vulnerabilidades.
- `npm run build`: passou com todas as rotas existentes e `ƒ Proxy (Middleware)`.
- Nenhuma rota, dependência, integração, regra de negócio ou capability futura foi adicionada.
- Hardening encerrado com retorno a `IMPLEMENTATION_IN_PROGRESS`.

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

### Resultado observado — SR-010
- Arquivos da feature foram medidos; nenhum monólito crítico foi identificado e `CategoryForm.tsx` permaneceu coeso.
- Auditoria encontrou normalização duplicada, projeções `select("*")` e metadados persistidos mutáveis/sem validação própria.
- RED direcionado confirmou seis falhas antes da correção.
- `Category.restore` passou a validar ID e datas; cópias defensivas protegem `createdAt` e `updatedAt` na entrada e leitura.
- Normalização de nome foi centralizada no domínio e reutilizada pelo hook de apresentação.
- Repository passou a selecionar somente `id,user_id,name,kind,created_at,updated_at`.
- GREEN direcionado passou com 3 suítes e 20 testes.
- MCP confirmou RLS habilitada/forçada, grants mínimos, policies com initPlan e índices adequados; nenhuma mudança remota foi necessária.
- Performance Advisor permaneceu limpo; Security Advisor manteve somente `SEC-AUTH-001` preexistente.
- `npm run test:ci`: 53 suítes e 253 testes passaram.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.
- Nenhuma migration, feature, regra de negócio, dependência ou capability futura foi adicionada.
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

### Resultado observado — SR-012
- Presentation, responsividade e microinterações específicas são não aplicáveis porque a release aprovada permanece domínio puro.
- Contratos atuais expõem somente strings civis serializáveis; nenhum `Date`, timezone, locale ou estado visual atravessa a fronteira de application.
- A futura UI-003 deve localizar os cinco rótulos na presentation, oferecer seleção única acessível e delegar todo cálculo temporal aos casos de uso.
- Manifest preserva instalação `standalone`, idioma `pt-BR`, ícones 192/512/maskable e shortcuts apenas para transações e contas existentes.
- Metadata preserva viewport responsivo, temas claro/escuro e `prefers-reduced-motion`; shell mantém skip link, landmarks, safe area e alvos mínimos de 44 px.
- Nenhum service worker, cache financeiro, shortcut analítico ou promessa offline foi criado.
- Testes direcionados de PWA, design system, shell e páginas passaram com 9 suítes e 46 testes.
- Regressão completa passou com 64 suítes e 336 testes; type-check, lint, audit com 0 vulnerabilidades e build com `ƒ Proxy (Middleware)` passaram.
- A competência UTC preexistente da rota de transações foi registrada como `TIME-BOUNDARY-001`, fora do escopo desta release.
- Estado de saída validado como `QUALITY_VALIDATION`.

### Resultado observado — UI-002
- Shell revisado por semântica, testes, classes responsivas e contratos PWA.
- RED direcionado confirmou reserva inferior sem safe area e ausência de tratamento explícito para movimento reduzido: 2 falhas e 17 testes preservados.
- GREEN direcionado passou com 3 suítes e 19 testes.
- Conteúdo móvel passou a reservar `5rem + env(safe-area-inset-bottom)`.
- Navegações passaram a respeitar `prefers-reduced-motion` sem remover foco ou estado ativo.
- Skip link validado como primeiro destino do teclado; landmarks, `aria-current` e alvos de 44 px preservados.
- Manifest servido com `200 application/manifest+json`, ícone PNG com `200` e rota privada anônima com `307` para `/login`.
- Nenhum service worker, Workbox, `next-pwa` ou promessa offline foi introduzido.
- Inspeção visual automatizada indisponível por falha ambiental na conexão de controle; bloqueio leve documentado.
- `npm run test:ci`: 43 suítes e 211 testes passaram.
- `npm run type-check`: passou.
- `npm run lint`: passou com 0 warnings.
- `npm audit --audit-level=high`: passou com 0 vulnerabilidades.
- `npm run build`: passou com todas as rotas existentes e `ƒ Proxy (Middleware)`.
- Estado de saída validado como `QUALITY_VALIDATION`.

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
- Chrome validou `/accounts` autenticada em desktop `1366x543` e mobile `390x844`: duas colunas/empilhamento corretos, sem overflow horizontal e alvos de interação com 44 px.
- Manifesto respondeu `200`, declarou modo `standalone`, quatro ícones e shortcut persistente de contas; console permaneceu sem warnings ou errors.
- Estado de saída validado como `QUALITY_VALIDATION`.

### Resultado observado — SR-010
- Jornada de cadastro, lista, estado vazio, loading, erro recuperável e retorno para Transações foi revisada.
- RED direcionado confirmou três falhas: campos editáveis durante envio, foco no botão após validação e feedback obsoleto após correção.
- Nome e tipo passaram a ficar desabilitados durante o envio; erro local foca o nome e é limpo ao editar.
- GREEN direcionado passou com 4 suítes e 13 testes.
- Contratos confirmam alvos mínimos de 44 px, padding mobile-first, altura dinâmica e quebra de nomes longos sem largura mínima implícita.
- Manifest preserva modo standalone e não promete offline; `/categories` continua subfluxo e não foi promovida a shortcut PWA.
- Manifest e ícones 192/512/maskable responderam `200` com MIME correto; `/categories` anônima respondeu `307` para `/login`.
- Nenhum service worker, cache financeiro, mutation Supabase ou nova dependência foi introduzido.
- Inspeção visual interativa indisponível porque o módulo obrigatório do plugin de navegador não estava presente; testes, semântica, classes responsivas, HTTP e build foram usados como evidência alternativa.
- `npm run test:ci`: 53 suítes e 255 testes passaram.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.
- Estado de saída validado como `QUALITY_VALIDATION`.

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

### Resultado observado — UI-002
- `npm run lint`: passou com 0 warnings.
- `npm run type-check`: passou.
- `npm run test:ci`: passou com 44 suítes e 212 testes.
- `npm audit --audit-level=high`: passou com 0 vulnerabilidades.
- `npm run build`: passou com todas as rotas e `ƒ Proxy (Middleware)`.
- `git diff --check` passou para a release e para as alterações do Dia 7.
- Contrato RED reproduziu CI restrito a `main`; GREEN passou após incluir `develop` em push e pull request.
- Componentes do shell permanecem sem acesso direto a Supabase, escapes de tipagem ou APIs perigosas.
- Logout usa escopo local e redirect fixo; nenhum segredo real ou chave privilegiada foi identificado.
- CI cobre branches de integração e release; estados de logout permanecem observáveis e anunciáveis.
- Inspeção visual automatizada indisponível permanece risco não crítico; pinagem das Actions por SHA permanece dívida baixa registrada.
- Nenhum deploy, push, PR, migration ou alteração Supabase foi executado.
- Estado final: `READY_FOR_RELEASE`.

### Resultado observado — SR-009
- `npm run lint`: passou, 0 warnings.
- `npm run type-check`: passou.
- `npm run test:ci`: passou, 36 suítes e 170 testes.
- `npm audit --audit-level=high`: passou, 0 vulnerabilidades.
- `npm run build`: passou; `/accounts` permaneceu dinâmica e `ƒ Proxy (Middleware)` ativo.
- Supabase MCP confirmou duas migrations aplicadas, RLS habilitada/forçada, duas policies e índice de owner/ordenação.
- Quatro suítes pgTAP transacionais passaram com 70 asserções; rollback preservou as duas contas existentes e não deixou a extensão temporária instalada.
- Grants mínimos confirmados: `authenticated` somente com `SELECT`/`INSERT`; sem `anon`, `UPDATE` ou `DELETE`.
- Performance Advisor: sem alertas.
- Security Advisor: somente `auth_leaked_password_protection`, rastreado em `SEC-AUTH-001` e obrigatório antes de produção pública.
- Nenhum segredo real versionado, uso de service role no código, `eval`, `dangerouslySetInnerHTML`, armazenamento persistente no navegador ou `any` TypeScript foi identificado; os matches de `any` pertencem ao valor válido `purpose: "any"` do manifesto.
- Threat model cobre BOLA/IDOR, owner forjado, acesso anônimo, mass assignment, escalada privilegiada e mutações fora do escopo.
- Baseline de observabilidade proíbe PII, dados financeiros, JWT, cookies, senha e payloads brutos; captura sanitizada, alertas e teste sintético permanecem em `HARD-OBS-001` antes de deploy público.
- Nenhum deploy, commit, push, alteração de Auth, migration ou mutação persistente foi executado.
- Estado final: `READY_FOR_RELEASE` para entrega incremental de código; deploy público permanece condicionado aos itens de hardening documentados.

### Resultado observado — SR-010
- `npm run lint`: passou, 0 warnings.
- `npm run type-check`: passou.
- `npm run test:ci`: passou, 53 suítes e 255 testes.
- `npm audit --omit=dev`: passou, 0 vulnerabilidades.
- `npm run build`: passou; `/categories` permaneceu dinâmica e `ƒ Proxy (Middleware)` ativo.
- Supabase MCP confirmou a migration `20260717022313_create_categories`, RLS habilitada/forçada, duas policies e índices de ownership, unicidade e ordenação.
- Quatro suítes pgTAP transacionais passaram com 65 asserções; rollback preservou `public.categories` com zero registros.
- Grants mínimos confirmados: `authenticated` somente com `SELECT`/`INSERT`; sem `anon`, Auth anônimo, `UPDATE`, `DELETE` ou privilégio de aplicação para `service_role`.
- Performance Advisor: sem alertas.
- Security Advisor: somente `auth_leaked_password_protection`, rastreado em `SEC-AUTH-001` e obrigatório antes de produção pública.
- Busca em arquivos versionados não identificou segredo real, uso de `service_role` no código, autorização por `user_metadata` ou mensagem bruta de infraestrutura na UI.
- Threat model cobre BOLA/IDOR, owner forjado, acesso anônimo, mass assignment, escalada privilegiada, enumeração e mutações fora do escopo.
- Baseline de observabilidade proíbe nome/payload de categoria, PII, dados financeiros, JWT, cookies, senha, segredos e mensagens brutas; captura sanitizada, alertas e teste sintético permanecem em `HARD-OBS-001` antes de deploy público.
- Nenhum deploy, commit, push, alteração de Auth, migration ou mutação persistente foi executado.
- Estado final: `READY_FOR_RELEASE` para entrega incremental de código; deploy público permanece condicionado aos itens de hardening documentados.

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

## Gate FinControl Pulse
- marca e copy correspondem às capacidades realmente disponíveis
- nenhuma rota, ação, filtro ou card existe sem fluxo funcional
- tokens semânticos evitam cores literais dispersas
- tema claro, escuro e automático passam contraste, foco e redução de movimento
- desktop, tablet e mobile são validados sem overflow indevido
- navegação, drawer, modal e bottom sheet funcionam por teclado e leitor de tela
- alvos interativos têm pelo menos 44 x 44 px
- receita, despesa, atenção e tendência não dependem somente de cor
- gráficos têm tabela ou resumo textual equivalente
- “disponível de verdade”, projeções e insights só usam regras determinísticas e dados suficientes
- IA, offline, biometria, cadastro e recuperação não são prometidos antes das respectivas features
- copy segue informar, explicar e sugerir, sem culpa ou promessa enganosa
- componentes compartilhados permanecem genéricos; semântica financeira fica na feature
- especificação `docs/product/fincontrol-pulse-interface-copy.md` e backlog são atualizados a cada incremento

### Gate específico da UI-001

- marca `FinControl` consistente entre metadata, manifest e superfícies migradas
- Geist auto-hospedada pelo build, com variável CSS e fallback
- tokens light/dark completos e Tailwind sem duplicar valores literais
- preferência `light | dark | system` com allowlist, fallback seguro e sincronização do sistema
- somente `fincontrol.theme` pode ser persistido; nenhum dado financeiro ou de identidade no browser storage
- inicialização anterior à hidratação sem flash relevante
- `Button`, `Card`, `FeedbackMessage` e `ThemeSwitcher` cobertos; primitives adicionais exigem justificativa
- regressão das rotas atuais, acessibilidade e PWA preservadas
- shell, dashboard Pulse, drawers, gráficos e Supabase não entram no diff da UI-001

Evidência do Dia 2:

- baseline anterior: 36 suítes e 170 testes verdes
- contratos RED: 5 arquivos de teste criados e 1 teste de manifest atualizado
- rede anterior preservada: 35 suítes e 168 testes verdes ao excluir somente os contratos da UI-001
- lint verde; type-check vermelho apenas pelos oito módulos planejados ausentes
- nenhuma implementação funcional ou dependência adicionada
- estado de saída: `TEST_STRATEGY_READY`

Evidência do Dia 3:

- testes direcionados: 6 suítes e 24 testes verdes
- regressão completa: 41 suítes e 192 testes verdes
- type-check, lint, audit de produção e build verdes; Proxy e matriz de rotas preservados
- contraste secundário claro corrigido de 4,476:1 para aproximadamente 4,818:1 sem reduzir o gate AA
- classes literais proibidas removidas do código de produção
- storage restrito a `fincontrol.theme`; nenhum acoplamento novo com Supabase
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`

Evidência do Dia 4:

- RED funcional confirmou seletor ausente e marca legada nas superfícies atuais
- integração inicial indevida no shell foi revertida e registrada antes da conclusão
- GREEN direcionado final: 3 suítes e 12 testes
- regressão completa: 41 suítes e 193 testes
- lint, type-check, audit de produção e build verdes
- marca `FinControl` consistente em login, dashboard, contas, transações e ícone PWA
- `ThemeSwitcher` exposto no login sem alterar `PrivateAppShell`
- inspeção automatizada no Chrome indisponível por native host não registrado; limitação documentada
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`

Evidência do Dia 5:

- auditoria identificou duplicação real de botões e feedbacks; arquivos maiores permaneceram coesos
- contrato RED exigiu adoção explícita das primitives aprovadas
- `Button`, `FeedbackMessage` e `Card` adotados sem criar nova primitive
- GREEN direcionado: 8 suítes e 43 testes
- regressão completa: 41 suítes e 194 testes
- lint, type-check, audit de produção e build verdes
- nenhum hook, caso de uso, repositório, migration ou dado alterado
- shell, dashboard Pulse, drawers, gráficos e Supabase permaneceram fora do diff
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`

Evidência do Dia 6:

- contratos RED cobriram alvo de toque, radio compacto, cores de viewport e copy honesta do manifest
- inspeção no navegador encontrou `theme-init.js` interceptado pelo Proxy; teste de regressão foi criado antes da correção
- `/theme-init.js` passou a responder `200` com `application/javascript`
- viewport de 320 x 800 px validado sem overflow horizontal
- labels do seletor medidos em 44 px e radios em 16 x 16 px
- tema escuro validado com `data-theme="dark"`, `color-scheme: dark` e fundo `rgb(11, 18, 32)`
- regressão completa: 41 suítes e 194 testes
- lint, type-check, audit com 0 vulnerabilidades e build verdes
- nenhuma promessa offline, IA antecipada, shell, dashboard Pulse ou alteração de Supabase entrou no diff
- estado de saída: `QUALITY_VALIDATION`

Evidência do Dia 7:

- escopo Git completo da UI-001 revisado e `git diff --check` verde
- fronteiras arquiteturais verificadas sem importação de React, Next.js ou Supabase em `domain` e `application`
- lint e type-check verdes
- regressão completa: 41 suítes e 194 testes
- `npm audit --audit-level=high`: 0 vulnerabilidades
- build de produção verde com todas as rotas existentes e `Proxy (Middleware)` preservados
- nenhum segredo versionado; chave `service_role` ausente do código e presente somente como placeholder vazio em `.env.example`
- fluxo SSR usa `getClaims()`, falha fechado e mantém cookies de sessão nas respostas
- threat model e baseline de observabilidade documentados no `project-context.md`
- riscos residuais são não críticos e já constam do backlog de hardening
- estado de saída: `READY_FOR_RELEASE`

## Gate do Dia 4 — SR-011

- RED válido: 6 suítes novas falharam antes da implementação dos contratos persistentes.
- GREEN direcionado: 8 suítes e 33 testes passaram.
- regressão completa: 61 suítes e 289 testes passaram.
- type-check: verde.
- lint: verde, 0 warnings.
- auditoria: verde, 0 vulnerabilidades em nível alto.
- build: verde; `/transactions` dinâmica e Proxy preservado.
- arquitetura: presentation sem Supabase e sem `userId` como autoridade; claims revalidadas no servidor.
- experiência: loading, error, empty, success e configuração ausente cobertos conforme aplicável.
- navegador: sessão autenticada, estados vazios e CTA de categoria validados; console limpo e nenhuma gravação executada.
- alterações remotas: nenhuma migration, policy, grant, configuração ou fixture.
- risco não crítico: criação visual não exercitada por ausência de categoria na sessão; contratos automatizados permanecem verdes.
- dívida registrada: `TX-PERF-001` para remover leitura mensal duplicada no Dia 5.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## Gate do Dia 5 — SR-011

- baseline da feature: 17 suítes e 84 testes verdes.
- auditoria: `TX-PERF-001` e casts de IDs confirmados; arquivos maiores permaneceram coesos.
- RED válido: 3 suítes falharam, 4 testes falharam e 10 passaram.
- GREEN direcionado: 3 suítes e 14 testes passaram.
- regressão completa: 61 suítes e 292 testes passaram.
- type-check: verde.
- lint: verde, 0 warnings.
- auditoria npm: verde, 0 vulnerabilidades em nível alto.
- build: verde; `/transactions` dinâmica e Proxy preservado.
- performance: uma única consulta mensal alimenta lista e resumo.
- integridade: DTOs rejeitam opções sem ID persistido e nenhum `as string` permanece na composition root.
- Supabase remoto: nenhuma alteração ou fixture executada.
- escopo: nenhuma feature, mudança visual, dependência, migration, policy ou grant adicionados.
- estado de saída: retorno estável a `IMPLEMENTATION_IN_PROGRESS`.

## Gate do Dia 6 — SR-011

- baseline da feature: 17 suítes e 87 testes verdes.
- RED válido: 2 testes falharam e 11 passaram no formulário.
- GREEN direcionado: 1 suíte e 13 testes passaram.
- regressão completa: 61 suítes e 292 testes passaram.
- type-check: verde.
- lint: verde, 0 warnings.
- auditoria npm: verde, 0 vulnerabilidades em nível alto.
- build: verde; `/transactions` dinâmica e Proxy preservado.
- acessibilidade: envio bloqueia todos os controles; erro local recebe foco; feedback obsoleto é removido na correção; semântica existente preservada.
- responsividade: desktop, `390 x 844` e `320 x 800` sem overflow; alvos visíveis de pelo menos 44 px.
- PWA: manifest, `theme-color`, viewport e idioma validados; nenhuma promessa offline ou cache financeiro adicionado.
- Supabase remoto: nenhuma alteração, consulta administrativa ou fixture executada.
- escopo: domínio, banco, regras financeiras, dependências e capabilities futuras permaneceram inalterados.
- `git diff --check`: verde, com avisos esperados de normalização LF/CRLF.
- estado de saída: `QUALITY_VALIDATION`.

## Gate do Dia 7 — SR-011

- auditoria de segurança encontrou divergência crítica de Anonymous Sign-In entre Proxy, Actions e RLS.
- erro documentado antes da correção; RED isolado: 1 teste falhou e 6 passaram.
- Proxy passou a exigir `sub` não vazio e `is_anonymous !== true`; GREEN isolado: 1 suíte e 8 testes.
- regressão completa: 61 suítes e 294 testes passaram.
- lint: verde, 0 warnings.
- type-check: verde.
- auditoria npm: verde, 0 vulnerabilidades em nível alto.
- build: verde; `/transactions` dinâmica e `ƒ Proxy (Middleware)` preservados.
- arquitetura: domínio/aplicação sem React, Next.js ou Supabase; apresentação sem acesso direto ao banco.
- segredos: nenhum `any`, segredo real ou `service_role` de aplicação encontrado em `src`; somente placeholder vazio em `.env.example`.
- migrations: cinco versões locais/remotas alinhadas.
- pgTAP remoto: 46 schema + 21 constraints + 17 RLS + 5 performance = 89 asserções verdes.
- rollback: a 1 transação preexistente foi preservada e `pgtap` permaneceu ausente.
- grants/RLS: `authenticated` somente com `SELECT`/`INSERT`; `anon`, Auth anônimo, `UPDATE`, `DELETE`, owner forjado e `service_role` de aplicação bloqueados.
- Performance Advisor: sem alertas após a validação.
- Security Advisor: somente `auth_leaked_password_protection`, rastreado em `SEC-AUTH-001`.
- threat model cobre BOLA/IDOR, Auth anônimo, owner forjado, mass assignment, relações cross-tenant, escalada privilegiada, integridade e vazamento de infraestrutura.
- observabilidade proíbe PII, UUIDs, conteúdo financeiro, JWT, cookies, credenciais e payloads brutos; implementação externa permanece em `HARD-OBS-001`.
- `git diff --check`: verde, com avisos esperados de normalização LF/CRLF.
- nenhum deploy, commit, push, PR, migration, policy, grant, configuração ou fixture foi executado.
- estado final: `READY_FOR_RELEASE` para entrega incremental de código; deploy público permanece condicionado aos hardenings documentados.

## Gate de Release
Uma release incremental só pode ser considerada pronta quando:
- critérios de pronto da fase foram satisfeitos
- quality gates aplicáveis estão verdes
- riscos remanescentes foram documentados
- backlog foi atualizado
- próximo passo está claro

## Gate do Dia 1 — SR-013

- contexto central e workflow do Dia 1 consultados antes da execução.
- SR-012 confirmada em `develop` e SR-013 selecionada em branch própria.
- escopo, domínio, casos de uso, port de consulta, RPC futura e contrato da tabela acessível definidos.
- ADR 0010 registra snapshot consistente, buckets diários, baseline de saldo e timezone explícito.
- Supabase revisado somente por migrations locais e documentação oficial; nenhuma consulta ou alteração remota executada.
- índice existente segue a ordem recomendada: igualdade por `user_id`, range por `occurred_on` e desempates estáveis.
- RPC futura exige privilégio mínimo, `SECURITY INVOKER`, RLS, intervalo máximo de 31 dias, pgTAP, `EXPLAIN (ANALYZE, BUFFERS)` e advisors antes de aceitação.
- lint: verde, 0 warnings.
- type-check: verde.
- `git diff --check`: verde, com avisos esperados de normalização LF/CRLF.
- testes e build não executados porque o Dia 1 alterou somente documentação.
- estado de saída: `ARCHITECTURE_READY`.

## Gate do Dia 2 — SR-013

- contexto central e workflow do Dia 2 consultados antes da execução.
- skills Supabase e Postgres aplicadas ao desenho de função, grants, RLS e performance.
- changelog e documentação oficiais atuais revisados; nenhuma breaking change aplicável bloqueia os contratos.
- testes Jest: 5 suítes novas em RED por 7 módulos deliberadamente ausentes.
- type-check: RED somente com 7 erros `TS2307` planejados.
- lint: verde, 0 warnings.
- baseline anterior: 64 suítes e 336 testes verdes ao excluir somente o novo RED.
- pgTAP estrutural remoto: 9 falhas de 15 pela função ausente, com rollback confirmado.
- pgTAP comportamental e performance: 18 asserções escritas e bloqueadas até o Dia 3.
- segurança: função exige `SECURITY INVOKER`, search path fixo, ausência de `userId`, grants mínimos e bloqueio de Auth anônimo.
- performance: contratos exigem filtros explícitos, índices existentes e `EXPLAIN (ANALYZE, BUFFERS)` transacional.
- `git diff --check`: verde, com avisos esperados de normalização LF/CRLF.
- build não executado porque o type-check vermelho é parte da evidência TDD.
- nenhuma implementação, migration persistente, tabela, policy, grant, índice, dependência, UI, commit, push ou PR foi criada.
- estado de saída: `TEST_STRATEGY_READY`.

## Gate do Dia 3 — SR-013

- contexto central e workflow do Dia 3 consultados; declaração operacional aprovada antes da implementação.
- skills Supabase e Postgres aplicadas; changelog e documentação oficial atual revisados.
- GREEN direcionado: 5 suítes e 39 testes passaram.
- regressão completa: 69 suítes e 375 testes passaram.
- type-check: verde.
- lint: verde, 0 warnings.
- build: verde em Next `16.3.3`; `ƒ Proxy (Middleware)` preservado.
- pgTAP remoto: 15/15 asserções de schema, 14/14 de comportamento e 4/4 de performance passaram.
- migration remota e local alinhadas em `20260826190714_create_financial_evolution_snapshot`.
- RPC usa `SECURITY INVOKER`, search path fixo, RLS, identidade da sessão e `EXECUTE` somente para `authenticated` permanente.
- `PUBLIC`, `anon`, `service_role` e Auth anônimo não podem executar a função.
- `EXPLAIN (ANALYZE, BUFFERS)` confirmou os índices existentes; nenhum índice novo foi criado.
- advisors não identificaram alerta novo da RPC; o aviso global de proteção contra senhas vazadas permanece fora do escopo.
- `git diff --check`: verde, com avisos esperados de normalização LF/CRLF.
- nenhuma UI, gráfico, biblioteca visual, deploy, commit, push, PR ou merge foi executado.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## Gate do Dia 4 — SR-013

- contexto central e workflow do Dia 4 consultados; declaração operacional aprovada antes da implementação.
- testes de presentation e composição nasceram em RED por módulos deliberadamente ausentes.
- seletor GET acessível oferece somente `week`, `rolling_7_days`, `fortnight`, `rolling_15_days` e `month`, com fallback seguro para `month`.
- estados `missing_accounts`, `empty` e `success` permanecem distintos; loading/error pertencem ao App Router e mensagens de erro não expõem detalhes do provider.
- tabela semântica contém caption e colunas Dia, Receitas, Despesas, Líquido, Saldo e Movimentos; wrapper responsivo preserva leitura mobile.
- composição server-side revalida claims, bloqueia Auth anônimo e passa somente DTO serializável à presentation; UI não acessa Supabase.
- timezone padrão temporário está explícito como `America/Sao_Paulo`; a competência de transações deixou de usar UTC direto e ganhou testes de virada civil.
- nenhuma migration, policy, grant, tabela, índice, dado, dependência, gráfico, biblioteca visual, comparação ou redesenho amplo foi criado.
- regressão: 71 suítes e 385 testes verdes; lint, type-check, build e `git diff --check`: verdes.
- validação HTTP local: `/dashboard` anônimo redirecionou para `/login` com resposta 200 e sem erro de aplicação; a inspeção autenticada da nova tabela ficou limitada porque o CLI `agent-browser` não está instalado e não havia sessão reutilizável.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## Gate do Dia 5 — SR-013

- contexto central e workflow do Dia 5 consultados; plano revisado e aprovado antes da refatoração.
- inventário não encontrou arquivo funcional monolítico crítico; os módulos da SR-013 permanecem entre 1 e 150 linhas.
- RED estrutural confirmou dependência de analytics no `DashboardPage` cliente, duplicação entre `/` e `/dashboard` e ausência do slot server-rendered.
- GREEN focado: 5 suítes e 21 testes passaram após a composição compartilhada e o slot React.
- `DashboardPage` cliente não importa DTO, domínio ou componente de financial analytics.
- inspeção do build não encontrou referências a `FinancialEvolutionPanel`, RPC ou configuração de períodos nos chunks cliente.
- repository permanece com uma RPC por carregamento, sem `userId` no payload; mapper, inteiros seguros, `SECURITY INVOKER`, grants e RLS não foram alterados.
- nenhuma migration, policy, grant, tabela, índice, dependência, regra de negócio, gráfico ou redesenho foi criado.
- regressão: 72 suítes e 388 testes verdes.
- lint: verde, 0 warnings.
- type-check: verde.
- build Next `16.3.3`: verde após liberar acesso de rede para o download da Geist; `ƒ Proxy (Middleware)` e rotas dinâmicas preservados.
- `git diff --check`: verde, com avisos esperados de normalização LF/CRLF.
- estado de saída: retorno estável a `IMPLEMENTATION_IN_PROGRESS`, pronto para o Dia 6.

## Gate do Dia 7 — SR-012

- regressão completa: 64 suítes e 336 testes passaram.
- lint: verde, 0 warnings.
- type-check: verde.
- auditoria npm completa: verde, 0 vulnerabilidades.
- build: verde em Next `16.3.3`; `ƒ Proxy (Middleware)` preservado.
- GitHub Actions: workflow `Quality Gates`, execução 36, verde no commit `cd103d0`.
- arquitetura: domínio/application sem React, Next.js, Supabase, IO, relógio ou timezone implícito.
- segurança: entradas canônicas e limitadas; calendário validado; laços limitados; nenhum segredo real encontrado.
- observabilidade futura: evento técnico categórico e latência, com proibição de PII, UUIDs, datas exatas, valores financeiros, tokens, cookies e payloads brutos.
- previews remotos: `Vercel – fin-control` e `Vercel – fin-control-zljm` permanecem vermelhos.
- diagnóstico confirmado pelo GitHub/Vercel Bot: deployments bloqueados antes do build porque o autor `JuniorDaliessi` não possui acesso ao time Vercel de `JrDaliessi`.
- identidade esperada para a reexecução: GitHub `JrDaliessi` (ID `131720853`), usando endereço noreply canônico no escopo deste repositório.
- nenhum deploy, merge, mudança de configuração externa ou Supabase foi executado.
- correção operacional: identidade Git do repositório alinhada a `JrDaliessi`, sem reescrever commits publicados.
- revalidação remota no commit `268ab3e`: GitHub Actions, `Vercel Preview Comments`, `Vercel – fin-control` e `Vercel – fin-control-zljm` verdes.
- estado final: `READY_FOR_RELEASE` para entrega incremental de código; hardenings globais de produção continuam explicitamente rastreados.

## Gate do Dia 6 — SR-013

- regressão completa: 72 suítes e 390 testes verdes.
- lint: verde, 0 warnings; type-check: verde; build Next `16.3.3`: verde.
- seletor responsivo, grupos `dl/dt/dd`, região horizontal operável por teclado e algarismos tabulares validados.
- manifest, viewport mobile, idioma, alvos de 44 px, foco e preferência de movimento reduzido preservados.
- nenhum cache financeiro, service worker ou promessa offline foi introduzido.
- estado de saída: `QUALITY_VALIDATION`.

## Gate do Dia 7 — SR-013

- regressão completa: 72 suítes e 390 testes passaram.
- lint: verde, 0 warnings; type-check: verde.
- auditoria npm online: verde, 0 vulnerabilidades.
- build Next `16.3.3`: verde; `ƒ Proxy (Middleware)`, `/` e `/dashboard` dinâmicos preservados.
- `git diff --check`: verde para os artefatos da fase.
- migrations: seis versões locais/remotas alinhadas.
- pgTAP remoto em rollback: 15/15 schema, 14/14 comportamento e 4/4 performance; `pgtap` ausente após os testes.
- grants/RLS: RPC `SECURITY INVOKER`, search path fixo, `EXECUTE` somente para `authenticated`; RLS habilitada nas três tabelas consultadas.
- segredos: somente `.env.example` está rastreado, com placeholder de `service_role` vazio; `.env.local` permanece ignorado e nenhum logging direto foi encontrado na feature.
- advisors: nenhum alerta novo da SR-013; `auth_leaked_password_protection` permanece em `SEC-AUTH-001` e três índices sem uso permanecem informativos.
- GitHub/Vercel: workflow `validate` e quatro checks Vercel verdes no commit `e508f6b`; deployment atual `READY`.
- segurança: threat model cobre BOLA/IDOR, Auth anônimo, abuso de intervalo, escalada privilegiada e vazamento de dados/segredos.
- observabilidade: preview atual sem `error`/`fatal` recente; erro DNS histórico ficou restrito a deployment anterior; captura externa sanitizada permanece em `HARD-OBS-001`.
- nenhum commit, push, merge, migration, alteração de Auth, fixture ou deploy de produção foi executado.
- estado final: `READY_FOR_RELEASE` para entrega incremental de código; produção pública permanece condicionada aos hardenings documentados.

## Gate do Dia 1 — UI-003

- contexto central e workflow do Dia 1 consultados; declaração operacional aprovada antes da execução.
- dashboard atual confrontado com especificação, arquitetura, contratos, domínio, backlog e código real.
- fonte financeira aprovada limitada ao `FinancialEvolutionDto` da SR-013.
- resumo mensal e recentes baseados no `TransactionSessionProvider` vazio identificados como fonte não persistente a remover do dashboard.
- composição server-side, slot RSC, `searchParams` assíncrono e props serializáveis preservados conforme a skill Next.js.
- grid de 12 colunas, copy, estados e ações reais definidos sem criar regra financeira.
- ADR 0011 criado; UI-003 fatiada em fonte/hierarquia, resumo responsivo e hardening visual.
- nenhum componente, teste, dependência, migration, Supabase, commit, push, PR ou deploy foi criado na fase.
- lint, type-check e `git diff --check`: verdes.
- estado de saída: `ARCHITECTURE_READY`.

## Gate do Dia 2 — UI-003

- contexto central e workflow do Dia 2 consultados; declaração operacional revisada e aprovada antes da execução.
- baseline direcionado: 4 suítes e 21 testes verdes.
- RED direcionado: 4 suítes falharam; 11 testes falharam e 6 passaram exclusivamente pelos contratos ainda não implementados.
- contratos cobrem fronteira server/client, copy aprovada, ações reais, slot compartilhado, estados sem dados fabricados, métrica principal e grid de 12 colunas.
- loading/error do App Router, semântica da tabela, seletor e composição com uma leitura permanecem cobertos pela rede existente.
- regressão excluindo somente as 4 suítes RED: 68 suítes e 371 testes verdes.
- lint local: verde, 0 warnings; type-check: verde.
- wrapper global do npm continua indisponível no ambiente; validação de lint foi executada pelo binário local fixado no projeto.
- nenhuma implementação funcional, dependência, Supabase, migration, persistência, commit, push, PR ou deploy foi executado.
- estado de saída: `TEST_STRATEGY_READY`.

## Gate do Dia 3 — UI-003

- declaração operacional aprovada antes da implementação.
- GREEN direcionado: 4 suítes e 17 testes passaram.
- regressão identificou e corrigiu um contrato transversal obsoleto do design system, sem reintroduzir dependência artificial no dashboard.
- GREEN ampliado: 5 suítes e 26 testes passaram.
- regressão completa: 72 suítes e 388 testes passaram.
- lint local: verde, 0 warnings; type-check: verde.
- build Next `16.3.3`: verde; `/`, `/dashboard` e `ƒ Proxy (Middleware)` preservados.
- `DashboardPage` é server-compatible, recebe apenas `ReactNode` e não usa hooks, Auth, sessão de transações, analytics ou infraestrutura.
- `FinancialEvolutionPanel` mantém DTO plano, seletor GET, três estados e tabela acessível; nenhuma regra financeira foi movida para a UI.
- revisão pelas skills Next.js e React não encontrou prop não serializável, async Client Component, fetch cliente, effect ou estado derivado duplicado.
- nenhuma dependência, Supabase, migration, persistência, gráfico, commit, push, PR, merge ou deploy foi executado.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## Correção crítica antes do Dia 5 — BUG-001

- `npm run test:ci -- src/features/auth/tests/supabase-proxy.test.ts`: passou, 1 suíte e 6 testes.
- `npm run test:ci`: passou, 32 suítes e 148 testes.
- `npm run lint`: passou, 0 warnings.
- `npm run type-check`: passou.
- `npm run build`: passou e declarou `ƒ Proxy (Middleware)`.
- Verificação HTTP com a configuração malformada: `/` respondeu `307` para `/login`; `/login` respondeu `200`; nenhum erro 500.
- Segurança: fallback falha fechado, sem liberar rota privada e sem expor valores de ambiente.
- Risco remanescente: autenticação real permanece indisponível enquanto `NEXT_PUBLIC_SUPABASE_URL` não for substituída pela Project URL HTTPS correta em `.env.local`.

## Gate do Dia 4 — UI-003

- declaração operacional aprovada antes da implementação.
- TDD RED: 3 falhas comportamentais em 2 suítes e 1 falha transversal de design system.
- GREEN direcionado: 3 suítes e 17 testes passaram.
- regressão completa: 72 suítes e 388 testes passaram.
- lint local: verde, 0 warnings; type-check: verde.
- build Next `16.3.3`: verde; `/`, `/dashboard` e `ƒ Proxy (Middleware)` preservados.
- ações reais agrupadas em navegação nomeada, responsiva, com alvo mínimo e foco visível.
- loading preserva contexto e estado ocupado; error boundary possui relações acessíveis e recuperação pela primitive `Button`.
- revisão Next.js/React confirmou fronteiras server/client mínimas, props serializáveis e ausência de novo fetch, hook, effect ou estado cliente.
- estados financeiros existentes foram preservados sem dados fabricados ou alteração de cálculo.
- nenhuma dependência, Supabase, migration, persistência, regra financeira, gráfico, commit, push, PR, merge ou deploy foi executado.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## Gate do Dia 5 — UI-003

- PR #13 mesclado com checks verdes antes da criação da branch isolada do Dia 5.
- baseline: 5 suítes/28 testes direcionados e 72 suítes/388 testes completos, todos verdes.
- três ciclos RED/GREEN comprovaram código morto, provider cliente global sem consumidor e duplicação da primitive `Button`.
- cinco arquivos de produção do dashboard legado, seu teste exclusivo, o provider de sessão em memória e seu teste exclusivo foram removidos.
- layout privado preserva Auth e shell, mas não envia mais estado de transações vazio para todas as rotas.
- `FinancialPeriodSelector` reutiliza `Button` sem alterar submissão GET, alvo mínimo ou foco.
- regressão final: 70 suítes e 378 testes passaram.
- lint local: verde, 0 warnings; type-check: verde.
- build Next `16.3.3`: verde; `/`, `/dashboard` e `ƒ Proxy (Middleware)` preservados.
- revisão Next.js/React: `error.tsx` cliente somente por `reset`; demais superfícies server-compatible; nenhum hook, effect, fetch cliente, prop não serializável ou cálculo financeiro novo.
- `git diff --check` verde; artefato gerado `next-env.d.ts` restaurado.
- nenhuma dependência, Supabase, migration, persistência, regra financeira, gráfico, commit, push, PR adicional ou deploy foi executado.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## Gate do Dia 6 — UI-003

- PR #14 mesclado antes da criação da branch isolada do Dia 6; baseline direcionado de 5 suítes/28 testes e completo de 70 suítes/378 testes, todos verdes.
- TDD RED: 5 falhas em contratos de viewport dinâmico, controles móveis, CTA, contenção de valores e orientação da tabela.
- GREEN direcionado: 3 suítes e 19 testes passaram.
- contraste WCAG AA: 8 combinações automatizadas; texto normal >= 4,5:1 e foco/não texto >= 3:1.
- regressão completa: 71 suítes e 386 testes passaram.
- lint local: verde, 0 warnings; type-check: verde.
- build Next `16.3.3`: verde; `/`, `/dashboard` e `ƒ Proxy (Middleware)` preservados.
- browser real: 320 x 720 e 1366 x 768 sem overflow horizontal; inputs móveis com 16 px; botão principal com 44 px; console sem warning/error.
- rota privada sem sessão redireciona para `/login`; credenciais não foram transmitidas pelo agente e o dashboard autenticado permaneceu coberto por testes determinísticos.
- manifesto servido com HTTP 200 e `application/manifest+json`; nenhuma promessa offline, cache ou service worker introduzido.
- revisão Next.js/React: Server Components e fronteiras existentes preservados; nenhum hook, effect, fetch cliente, dependência ou regra financeira nova.
- `git diff --check` verde; artefatos gerados pelo Next restaurados/removidos; `rewrite-msgs.sh` preservado fora do escopo.
- estado de saída: `QUALITY_VALIDATION`.

## Gate do Dia 7 — UI-003

- PR #15 mesclado por squash no `develop` com commit `38430ecdb11c8c5882991d2dfbe3235778d5b862`; branch isolada do Dia 7 criada após sincronização.
- regressão completa: 71 suítes e 386 testes passaram.
- lint: verde, 0 warnings; type-check: verde.
- auditoria npm de produção: verde, 0 vulnerabilidades; 697 pacotes com assinaturas de registro e 102 com attestations verificadas.
- build Next `16.3.3`: verde; `/`, `/dashboard` e `ƒ Proxy (Middleware)` preservados.
- `git diff --check`: verde; `rewrite-msgs.sh` preservado fora do escopo.
- GitHub Actions: workflow Quality Gates #60 verde no commit `7f1cd31`; status Vercel no GitHub também verde.
- Supabase: seis migrations alinhadas; três tabelas públicas com RLS habilitada/forçada, grants mínimos e policies de ownership; RPC invoker limitada a `authenticated`.
- Security Advisor: somente `auth_leaked_password_protection`, rastreado em `SEC-AUTH-001`; três índices sem uso permanecem informativos.
- segredos: apenas `.env.example` rastreado, com `SUPABASE_SERVICE_ROLE_KEY` vazio; nenhum logging direto encontrado em `src`.
- Vercel: preview `dpl_FjFhZDd3P7aYtjy8gJRazK6BqSRj` `READY`, sem erro de runtime atual; produção permanece em deployment anterior e não foi promovida.
- observabilidade: logs recentes de Supabase sem erro/fatal/5xx; preview protegido por SSO não recebeu bypass; captura externa sanitizada permanece em `HARD-OBS-001`.
- hardening: ausência de headers definidos pela aplicação permanece em `SEC-HARD-001`; vínculo/runtime/npm divergentes da Vercel foram registrados em `CI-VERCEL-002`.
- estado final: `READY_FOR_RELEASE` para entrega incremental de código; produção pública permanece bloqueada pelos hardenings documentados.

## Gate do Dia 1 — SP-001

- contexto central e workflow do Dia 1 consultados; declaração operacional aprovada antes da execução.
- código real, DTO, composição server-side, tabela acessível, roadmap e ADRs anteriores confrontados.
- comparação oficial cobriu Apache ECharts 6.1, Recharts 3.10 e Lightweight Charts 5.2 por linha/candles, acessibilidade, Next.js/React, bundle, mobile, TypeScript e licença.
- Apache ECharts escolhido com import modular, SVG, ARIA/decal e sem wrapper React adicional.
- fronteira definida: mapper puro e option builder em presentation; ilha cliente mínima; domain/application/infrastructure/App Router sem import da biblioteca.
- tabela acessível, centavos, datas civis, movimento reduzido, contraste e ausência de semântica de trading permanecem obrigatórios.
- nenhuma dependência, gráfico, teste funcional, Supabase, migration, dado, commit, push, PR ou deploy foi criado.
- lint, type-check e build não foram repetidos porque somente documentação foi alterada; `git diff --check` é o gate aplicável da fase.
- estado de saída: `ARCHITECTURE_READY`.

## Gate do Dia 2 — SP-001

- contexto central e workflow do Dia 2 consultados; declaração operacional aprovada antes da execução.
- baseline completo antes do RED: 71 suítes e 386 testes verdes.
- domain/application relevantes permaneceram verdes: 3 suítes e 38 testes.
- quatro suítes test-first foram criadas para mapper, option builder, lifecycle e fronteiras arquiteturais.
- RED direcionado final: 4 suítes vermelhas; 7 falhas arquiteturais esperadas, 2 invariantes existentes verdes e 3 suítes bloqueadas por módulos planejados ausentes.
- type-check RED contém somente 7 erros `TS2307` dos módulos funcionais planejados.
- lint dos quatro testes novos passou com 0 warnings.
- regressão anterior, excluindo somente as quatro suítes RED, permaneceu em 71 suítes e 386 testes verdes.
- falso positivo do scanner e assinatura incorreta do mock DOM foram registrados no contexto e corrigidos antes da aceitação do RED.
- nenhuma implementação, instalação, gráfico de produção, Supabase, migration, dado, commit, push, PR ou deploy foi executado.
- estado de saída: `TEST_STRATEGY_READY`.

## Gate do Dia 3 — SP-001

- RED reconfirmado antes da implementação: 4 suítes vermelhas por módulos/dependência ausentes.
- `echarts@6.1.0` instalado com versão exata; licença Apache-2.0 e dependências `tslib`/`zrender` verificadas.
- cinco arquivos funcionais mínimos criados somente em presentation: model, mapper, option builder, adapter modular SVG e ilha cliente.
- primeiro GREEN parcial: 3 suítes e 15 testes; desvio ESM/Jest registrado antes da correção do harness.
- GREEN direcionado final: 4 suítes e 20 testes verdes.
- regressão completa: 75 suítes e 406 testes verdes.
- type-check: verde; lint global: verde, 0 warnings.
- audit de produção: verde, 0 vulnerabilidades.
- build Next.js 16.3.3: verde; todas as rotas e `ƒ Proxy (Middleware)` preservados.
- `next experimental-analyze --output`: nenhum módulo ECharts nas rotas/chunks atuais; delta de bundle de produção igual a zero enquanto a ilha não é importada.
- `FinancialEvolutionPanel` continua server-side com tabela acessível e sem import do experimento.
- `next-env.d.ts` restaurado; `rewrite-msgs.sh` preservado fora do escopo.
- nenhuma integração no dashboard, SR-014, Supabase, migration, dado, commit, push, PR ou deploy foi executado.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## Gate do Dia 4 — SP-001

- contexto central e workflow do Dia 4 consultados; declaração operacional aprovada antes da execução.
- baseline direcionado: 4 suítes e 20 testes verdes.
- RED test-first: 1 suíte com 2 falhas esperadas e 5 testes verdes para estado vazio e mudança de tema.
- GREEN do componente: 1 suíte e 7 testes verdes; GREEN direcionado: 4 suítes e 22 testes verdes.
- estado vazio não inicializa ECharts; tema dinâmico reaplica opções sem recriar a instância e desconecta o observer no unmount.
- fallback, resize, reduced motion, atualização de modelo e cleanup existentes permaneceram verdes.
- regressão completa: 75 suítes e 408 testes verdes.
- type-check: verde; lint global: verde, 0 warnings.
- audit de produção: verde, 0 vulnerabilidades.
- build Next.js 16.3.3: verde; todas as rotas e `ƒ Proxy (Middleware)` preservados.
- `next experimental-analyze --output`: nenhum módulo ECharts nas rotas/chunks atuais.
- loading não se aplica sem operação assíncrona; validação em navegador não se aplica sem rota de experimento aprovada.
- `next-env.d.ts` restaurado; `rewrite-msgs.sh` preservado fora do escopo.
- nenhuma integração no dashboard, SR-014, Supabase, migration, dado, commit, push, PR ou deploy foi executado.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## Gate do Dia 5 — SP-001

- contexto central e workflow do Dia 5 consultados; declaração operacional aprovada antes da execução.
- diagnóstico confirmou cinco arquivos de produção coesos, sem monólito, duplicação relevante ou abstração genérica necessária.
- baseline direcionado: 4 suítes e 22 testes verdes.
- RED test-first: 1 suíte com 3 falhas planejadas e 7 testes anteriores verdes.
- GREEN do componente: 1 suíte e 10 testes verdes; GREEN direcionado: 4 suítes e 25 testes verdes.
- `useId`, listener de redução de movimento e aquisição transacional do lifecycle foram adicionados sem mudar regras financeiras.
- regressão completa: 75 suítes e 411 testes verdes.
- type-check: verde; lint global: verde, 0 warnings.
- audit de produção: verde, 0 vulnerabilidades.
- build Next.js 16.3.3: verde; todas as rotas e `ƒ Proxy (Middleware)` preservados.
- `next experimental-analyze --output`: nenhum módulo ECharts nas rotas/chunks atuais.
- datas civis, centavos inteiros, imports modulares, RSC e tabela acessível permaneceram protegidos.
- `next-env.d.ts` restaurado; `rewrite-msgs.sh` preservado fora do escopo.
- nenhuma integração no dashboard, SR-014, Supabase, migration, dado, commit, push, PR ou deploy foi executado.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## Gate do Dia 6 — SP-001

- contexto central e workflow do Dia 6 consultados; declaração operacional aprovada antes da execução.
- baseline direcionado: 4 suítes e 25 testes verdes.
- contraste auditado: mínimos de `5,12:1` no tema claro e `6,92:1` no tema escuro para texto secundário; linha principal acima de `5,47:1`.
- RED test-first: 2 suítes com 1 falha planejada e 20 testes verdes para alto contraste.
- GREEN de componente/fronteira: 2 suítes e 21 testes; GREEN com manifesto PWA: 5 suítes e 29 testes.
- `forced-colors` usa cores semânticas do sistema, atualiza a instância existente e remove o listener no unmount.
- largura fluida, altura mínima, resize, nomes/descrições, estados textuais e tabela equivalente permaneceram protegidos.
- manifesto instalável, ícones e atalhos reais permanecem verdes; nenhum service worker, cache financeiro ou promessa offline foi criado.
- regressão completa: 75 suítes e 413 testes verdes.
- type-check: verde; lint global: verde, 0 warnings.
- audit de produção: verde, 0 vulnerabilidades.
- build Next.js 16.3.3: verde; todas as rotas e `ƒ Proxy (Middleware)` preservados.
- `next experimental-analyze --output`: nenhum módulo ECharts nas rotas/chunks atuais.
- validação visual em navegador permanece condicionada à rota real da SR-014 e não foi simulada artificialmente.
- `next-env.d.ts` restaurado; `rewrite-msgs.sh` preservado fora do escopo.
- nenhuma integração no dashboard, SR-014, Supabase, migration, dado, commit, push, PR ou deploy foi executado.
- estado de saída: `QUALITY_VALIDATION`.

## Gate do Dia 7 — SP-001

- contexto central e workflow do Dia 7 consultados; declaração operacional aprovada antes da execução.
- regressão completa: 75 suítes e 413 testes passaram.
- lint: verde, 0 warnings; type-check: verde.
- auditoria npm completa: verde, 0 vulnerabilidades; 701 pacotes com assinaturas de registro e 102 com attestations verificadas.
- ECharts `6.1.0`, ZRender `6.1.0`, dependências transitivas imediatas e licença Apache-2.0 inspecionados.
- build Next.js `16.3.3`: verde; rotas atuais e `ƒ Proxy (Middleware)` preservados.
- análise de bundle: nenhum módulo ECharts ou arquivo do experimento presente nos chunks das rotas atuais.
- revisão estática do adapter: sem rede, Supabase, storage, service worker, `eval`, HTML arbitrário ou logging de dados financeiros.
- segredos: somente `.env.example` rastreado, com valores vazios; nenhum arquivo de ambiente sensível adicionado.
- GitHub Actions Quality Gates #69 e status Vercel verdes no commit `ce41b301120c44db91b451d530ac0d2d9b25ef6e`.
- Preview Vercel `dpl_2JyLQ9bTgP8S4T7hTybUB5Sp8nZj` `READY`; `/login` respondeu HTTP 200, sem erro/fatal nem runtime error na janela disponível de 1 hora.
- nenhum risco crítico específico do SP-001 identificado; bundle real e validação visual end-to-end permanecem obrigatórios na SR-014.
- telemetria de produto não foi criada sem rota real; baseline futura proíbe PII, identidade e conteúdo financeiro em eventos/logs.
- `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001` continuam bloqueando produção pública; `CI-VERCEL-002` deve ser resolvida antes de operação direta por CLI ou promoção.
- nenhuma integração no dashboard, SR-014, Supabase, migration, dado, promoção, merge, commit, push ou novo PR foi executado.
- `git diff --check` verde; `next-env.d.ts` restaurado e `rewrite-msgs.sh` preservado fora do escopo.
- estado final: `READY_FOR_RELEASE`; SP-001 marcado como `DONE`.

## Gate do Dia 1 — SR-014

- contexto central e workflow do Dia 1 consultados; declaração operacional aprovada antes da execução.
- PR #17 confirmado como squash merge em `develop` no commit `f741e680234f3182bfe6f6d8bc9201bb2baf9927`.
- `develop` sincronizada por fast-forward e branch `codex/sr-014-financial-evolution-chart` criada da base integrada.
- DTO, loader, composition root, painel, tabela, mapper, ilha cliente, adapter, testes e ADRs anteriores foram confrontados.
- escopo limitado a uma linha do saldo de fechamento diário em `/` e `/dashboard`, sem nova fonte de dados ou regra financeira.
- painel permanece Server Component; mapper roda no servidor; ilha recebe somente view model plano e serializável.
- estados `success`, `empty`, `missing_accounts`, erro da rota e erro local do chart foram definidos sem inventar loading cliente.
- tabela visível e equivalente, heading, descrição, alto contraste, movimento reduzido e responsividade permanecem obrigatórios.
- estratégia de bundle exige ECharts somente nos chunks do dashboard e documenta delta real antes do encerramento.
- `next/dynamic`, wrapper adicional, múltiplas séries, candles, comparação, previsão, analytics e offline foram excluídos sem evidência/contrato.
- erro de quoting do PowerShell foi documentado em Erros Recorrentes antes da leitura corrigida com `-LiteralPath`.
- ADR 0013, arquitetura, backlog, roadmap, estratégia de testes e especificação de produto atualizados.
- nenhum código funcional, teste executável, dependência, Supabase, migration, dado, commit, push, PR ou deploy foi criado.
- lint, type-check, testes e build não foram repetidos porque a entrega é exclusivamente documental; `git diff --check` é o gate aplicável.
- estado de saída: `ARCHITECTURE_READY`; próximo comando válido: `dia 2`.

## Gate do Dia 2 — SR-014

- contexto central e workflow do Dia 2 consultados; declaração operacional aprovada antes da execução.
- baseline completa antes do RED: 75 suítes e 413 testes verdes; type-check e lint verdes.
- 4 contratos novos criados em 2 suítes, sem código funcional.
- RED direcionado confirmado: 2 suítes falharam; 4 testes falharam e 17 passaram, total de 21 testes.
- falhas correspondem somente à integração ainda ausente do mapper, da ilha, do heading e do fallback local no painel.
- regressão anterior, excluindo apenas as 2 suítes intencionalmente RED: 73 suítes e 396 testes verdes.
- testes alterados passaram por lint com 0 warnings; type-check permaneceu verde.
- nenhum teste foi removido, ignorado ou relaxado; domain, application, infrastructure e rotas permaneceram intactos.
- build, bundle e browser não se aplicam enquanto a implementação funcional permanece bloqueada.
- três falhas operacionais da IA foram registradas no contexto antes das respectivas correções; nenhuma representa defeito do projeto.
- nenhum Supabase, migration, dado, dependência, commit, push, PR ou deploy foi executado.
- `rewrite-msgs.sh` permaneceu não rastreado e fora do escopo.
- estado de saída: `TEST_STRATEGY_READY`; próximo comando válido: `dia 3`.

## Gate do Dia 3 — SR-014

- contexto central, workflow do Dia 3 e referências RSC/bundling da skill `vercel:nextjs` consultados após aprovação operacional.
- produção alterada somente em `FinancialEvolutionPanel.tsx`: mapper server-side, card, heading e ilha cliente antes da tabela.
- GREEN direcionado inicial: 2 suítes e 21 testes passaram.
- falha de isolamento no harness de rotas registrada antes da correção; GREEN ampliado com 3 suítes e 25 testes.
- regressão completa: 75 suítes e 417 testes verdes.
- lint global: verde com 0 warnings; type-check: verde.
- build Next.js `16.3.3` com Turbopack: verde; rotas e Proxy preservados.
- analyzer de produção: verde; chunk ECharts/ZRender de 500.653 bytes brutos e 170.071 bytes gzip somente em `/` e `/dashboard`.
- `/login`, `/accounts`, `/categories` e `/transactions` não referenciam o chunk do gráfico.
- nenhum teste relaxado; nenhum domain, application, infrastructure, Supabase, migration, dado ou dependência alterado.
- `next-env.d.ts` restaurado e `rewrite-msgs.sh` preservado fora do escopo.
- nenhuma validação visual, deploy, commit, push ou atualização de PR foi executada.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`; próximo comando válido: `dia 4`.

## Gate do Dia 4 — SR-014 / UX-CHART-001

- mudança de escopo documentada em contexto, arquitetura, roadmap, backlog, estratégia e ADR 0014 antes do código.
- testes essenciais criados em RED antes da primitive e da integração.
- `ExpandableChartFrame.client.tsx` não importa ECharts, Supabase, domain ou application.
- fallback CSS, API nativa, rejeição, saída, foco, scroll, focus trap, cleanup e múltiplos frames cobertos.
- integração mantém a mesma instância ECharts e o `ResizeObserver` existente.
- GREEN direcionado final: 3 suítes e 33 testes.
- regressão completa: 76 suítes e 428 testes verdes.
- lint global: verde com 0 warnings; type-check: verde.
- build Next.js `16.3.3`: verde; rotas e Proxy preservados.
- analyzer: ECharts/ZRender somente em `/` e `/dashboard`; delta de +3.021 bytes brutos e +1.195 bytes gzip.
- revisão `vercel:react-best-practices`: callbacks estáveis, listeners condicionais, cleanup explícito e sem duplicação de dados/renderers.
- nenhuma dependência, Supabase, migration, regra financeira, orientação forçada ou gráfico futuro foi criado.
- validação visual/browser e acessibilidade aprofundada permanecem para o Dia 6.
- `next-env.d.ts` restaurado; `rewrite-msgs.sh` preservado fora do escopo.
- `git diff --check`: verde.
- nenhum commit, push, deploy ou atualização de PR foi executado nesta fase.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`; próximo comando válido: `dia 5`.

## Gate do Dia 5 — SR-014 / UX-CHART-001

- contexto central, workflow do Dia 5 e skill `vercel:react-best-practices` consultados; declaração aprovada antes da execução.
- inventário: primitive com 200 linhas e ilha com 189; nenhuma extração ampla ou abstração adicional foi justificada.
- baseline direcionado: 3 suítes e 33 testes verdes.
- RED test-first: 1 suíte com 1 falha esperada e 9 testes verdes para resolução tardia de `requestFullscreen()`.
- GREEN da primitive: 1 suíte e 10 testes; GREEN direcionado: 3 suítes e 34 testes.
- tentativas nativas agora possuem identidade monotônica; tentativas obsoletas encerram fullscreen adquirido tardiamente.
- rejeição de `exitFullscreen()` é observada sem impedir o recolhimento do overlay.
- regressão completa: 76 suítes e 429 testes verdes.
- lint global: verde com 0 warnings; type-check: verde.
- build Next.js `16.3.3`: verde; rotas e Proxy preservados.
- analyzer: ECharts/ZRender somente em `/` e `/dashboard`; chunk com 503.929 bytes brutos e 171.551 bytes gzip, delta de +255/+285 bytes sobre o Dia 4.
- nenhuma dependência, regra financeira, Supabase, migration, dado, orientação forçada ou gráfico futuro foi criado.
- validação browser/mobile e acessibilidade aprofundada permanecem reservadas ao Dia 6.
- `next-env.d.ts` restaurado; `rewrite-msgs.sh` preservado fora do escopo.
- `git diff --check`: verde.
- nenhum commit, push, deploy ou atualização de PR foi executado nesta fase.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS` estável; próximo comando válido: `dia 6`.

## Gate do Dia 6 — SR-014 / UX-CHART-001

- contexto central, workflow e skills de browser consultados; declaração aprovada antes da execução.
- baseline direcionado: 4 suítes e 36 testes verdes.
- primeiro RED: 3 suítes com 4 falhas esperadas e 30 testes verdes para safe areas e altura adaptável.
- segundo RED: 2 suítes com 2 falhas esperadas e 22 testes verdes para `min-width: 0` após overflow real no browser.
- GREEN direcionado final: 5 suítes e 45 testes verdes.
- regressão completa: 76 suítes e 429 testes verdes.
- lint global: verde com 0 warnings; type-check: verde.
- build Next.js `16.3.3`: verde; rotas e Proxy preservados; falha inicial foi exclusivamente o download bloqueado da Geist e passou com rede autorizada.
- analyzer: ECharts/ZRender somente em `/` e `/dashboard`; chunk com 504.020 bytes brutos e 171.587 bytes gzip, delta de +91/+36 bytes sobre o Dia 5.
- browser: conteúdo e gráfico reais, sem overlay, warning ou erro; desktop e mobile `390 x 844`/`844 x 390` sem overflow.
- expansão: safe areas computadas em 16/24 px, botão 52 x 44 px, foco e scroll preservados, SVG igual ao viewport disponível.
- auditoria básica: `pt-BR`, viewport, theme colors, manifest, nomes acessíveis e IDs únicos confirmados; temas alternaram sem erro.
- `Escape` físico não foi propagado pela superfície de automação; o contrato permanece verde em Jest e não foi contabilizado como validação browser.
- PWA permanece instalável e honesta, sem orientação forçada, service worker, cache financeiro ou promessa offline.
- nenhum domain, application, infrastructure, Supabase, migration, dado, dependência ou regra financeira mudou.
- `next-env.d.ts` restaurado; `AGENTS.md`/`CLAUDE.md` automáticos removidos; `rewrite-msgs.sh` preservado fora do escopo.
- `git diff --check`: verde.
- nenhum commit, push, deploy ou atualização de PR foi executado.
- estado de saída: `QUALITY_VALIDATION`; próximo comando válido: `dia 7`.

## Gate do Dia 7 — SR-014 / UX-CHART-001

- contexto central e workflow do Dia 7 consultados; declaração operacional aprovada antes da execução.
- skills `vercel:deployments-cicd`, `vercel:observability` e `vercel:vercel-api` aplicadas em modo de leitura; nenhum deploy ou promoção foi disparado.
- lint global: verde com zero warnings.
- type-check: verde.
- regressão completa: 76 suítes e 429 testes verdes; zero snapshots e nenhum teste ignorado.
- auditoria de dependências: `npm audit --audit-level=high` verde com zero vulnerabilidades.
- build Next.js `16.3.3` com Turbopack: verde; `/`, `/accounts`, `/categories`, `/dashboard`, `/login`, `/transactions` e Proxy preservados.
- analyzer de produção: verde; chunk ECharts/ZRender com 504.020 bytes brutos e referência somente nos manifests cliente de `/` e `/dashboard`.
- revisão de segurança do diff: sem Supabase, Auth, RLS, migration, variável pública, storage, HTML arbitrário, rede, regra financeira, dependência ou segredo novo.
- PR #18: aberto, não draft, `MERGEABLE`, base `develop`; checks `validate`, Vercel e Vercel Preview Comments verdes no commit `ff4bb73`.
- Vercel: deployment `dpl_2qV1zdyc8bdLpJqVYxfEw3trT6K4` em `READY`; `/login` respondeu HTTP 200 com HSTS e `noindex`.
- observabilidade Vercel: nenhum cluster de erro de runtime e nenhum log preview `error`/`fatal` nas últimas 24 horas; nenhum comentário Toolbar não resolvido na branch.
- plano Hobby sem drains: runtime logs/dashboard são a baseline disponível; captura externa sanitizada continua rastreada em `HARD-OBS-001`.
- `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001` continuam bloqueando produção pública, mas não a entrega incremental deste código.
- `CI-VERCEL-002` permanece dívida MÉDIA: vínculo local aponta para projeto antigo e há drift Node/npm entre Vercel, `package.json` e CI; preview atual não é afetado.
- `next-env.d.ts` restaurado; `rewrite-msgs.sh` preservado fora do escopo; nenhum arquivo funcional foi alterado no Dia 7.
- `git diff --check`: verde; somente `backlog.md`, `project-context.md`, `quality-gates.md` e `roadmap.md` foram alterados nesta fase.
- nenhum commit, push, merge ou deploy de produção foi executado nesta fase.
- estado final: `READY_FOR_RELEASE`; SR-014 e UX-CHART-001 marcadas como `DONE`.

## Gate do Dia 1 — SR-015

- contexto central e workflow do Dia 1 consultados; declaração operacional aprovada antes da execução.
- branch `codex/sr-015-financial-candles` criada da `develop` integrada no commit `503d037`.
- períodos, snapshot/RPC, movimentos, agregador diário, caso de uso, DTO, painel, tabela, adapter ECharts e ADRs anteriores confrontados.
- contrato limitado a candles diários para os cinco períodos atuais de até 31 dias.
- OHLC, volume, vazios, ordem por data civil/registro e ressalva semântica sobre ausência de horário bancário documentados.
- uma única leitura server-side preservada; nenhuma nova consulta, migration, RLS ou dependência aprovada.
- ilha cliente limitada ao seletor e visualização; modelos planos, tabela equivalente, frame expansível e imports modulares permanecem obrigatórios.
- matriz TDD planejada para domain, application, presentation, arquitetura e bundle; nenhum teste executável criado no Dia 1.
- erro de caminhos presumidos registrado em Erros Recorrentes antes da correção.
- ADR 0015, contexto, arquitetura, backlog, roadmap, estratégia de testes e especificação de produto atualizados.
- nenhum código funcional, Supabase, migration, dado, commit, push, PR ou deploy executado.
- lint, type-check, testes e build não foram repetidos porque a entrega é exclusivamente documental; `git diff --check` é o gate aplicável.
- estado de saída: `ARCHITECTURE_READY`; próximo comando válido: `dia 2`.

## Gate do Dia 2 — SR-015

- contexto central e workflow do Dia 2 consultados; declaração operacional aprovada antes da execução.
- baseline completa: 76 suítes e 429 testes verdes; type-check e lint verdes.
- sete suítes e três fixtures adicionais criadas antes de qualquer código funcional.
- matriz declara 41 contratos de domain, application, presentation, adapter e arquitetura.
- RED direcionado confirmado: sete suítes falharam; Jest materializou 13 falhas e um teste verde antes das falhas esperadas de resolução.
- `candles` ausente no DTO falhou nos estados `success`, `empty` e `missing_accounts`.
- sete fronteiras, `CandlestickChart`, mapper, builder, tabela e switcher falharam somente por ainda não existirem.
- type-check RED contém exclusivamente cinco `TS2307` dos módulos planejados ausentes.
- lint direcionado dos oito arquivos novos/alterados: verde, zero warnings.
- regressão anterior, excluindo apenas as sete suítes RED: 76 suítes e 429 testes verdes.
- nenhum teste anterior foi removido, ignorado ou relaxado; `git diff --check` verde.
- nenhum código funcional, dependência, Supabase, migration, dado, commit, push, PR ou deploy executado.
- `rewrite-msgs.sh` permaneceu não rastreado e fora do escopo.
- estado de saída: `TEST_STRATEGY_READY`; próximo comando válido: `dia 3`.

## Gate do Dia 3 — SR-015

- contexto central, workflow e skills `vercel:nextjs`/`vercel:react-best-practices` consultados; declaração operacional aprovada antes do código.
- agregador OHLC puro, tipo, DTO, mapper, builder ECharts, registro modular, gráfico, tabela, seletor e painel server-side implementados.
- uma única chamada ao repository preservada; linha e candles derivam o mesmo snapshot, sem nova consulta ou migration.
- primeiro GREEN: 37/41 contratos; quatro falsos negativos do jsdom foram registrados antes do polyfill compartilhado.
- fixtures, mocks server-side e boundary transversal desatualizados foram registrados antes do alinhamento à arquitetura aprovada.
- GREEN direcionado final: 7 suítes e 41 testes; GREEN transversal: 3 suítes e 26 testes.
- regressão completa: 83 suítes e 470 testes verdes; zero snapshots.
- lint global: verde com zero warnings; type-check: verde.
- build Next.js `16.3.3` com Turbopack: verde; rotas e Proxy preservados.
- analyzer: ECharts/ZRender somente em `/` e `/dashboard`; chunk com 525.017 bytes brutos e 179.024 bytes gzip, delta de +20.997/+7.437 bytes.
- revisão React/Next: painel server-side, props planas serializáveis, estado local derivado, sem fetch ou persistência cliente e imports diretos.
- `TECH-CHART-002` registra para o Dia 5 a avaliação da duplicação entre ciclos de vida das ilhas, sem abstração prematura no Dia 3.
- nenhum Supabase, RPC, migration, RLS, dado, dependência, recurso de trading, deploy, commit, push ou PR executado.
- `next-env.d.ts` restaurado; `rewrite-msgs.sh` preservado fora do escopo; `git diff --check` verde.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`; próximo comando válido: `dia 4`.

## Gate do Dia 4 — SR-015

- contexto central, workflow e skill `vercel:react-best-practices` consultados; declaração operacional aprovada antes dos testes.
- RED direcionado: 3 suítes, 2 falhas esperadas e 12 testes verdes para tooltip financeiro e relação semântica do seletor.
- nova suíte da ilha cobre inicialização SVG, descrição, resize, cleanup, atualização, expansão, falha e vazio.
- GREEN direcionado final: 3 suítes e 15 testes verdes.
- tooltip contém data, OHLC, direção textual, volume e quantidade; índice inválido possui fallback estável.
- botões e região ativa estão ligados por `aria-controls`/`aria-labelledby`; apenas um renderer e sua tabela permanecem montados.
- falha local do renderer mantém a tabela OHLC disponível.
- ruído tipado inicial do harness foi documentado antes da correção; expectativas funcionais permaneceram intactas.
- regressão completa: 84 suítes e 479 testes verdes; zero snapshots.
- lint global verde com zero warnings; type-check verde.
- build Next.js `16.3.3` verde; rotas e Proxy preservados.
- analyzer: ECharts/ZRender somente em `/` e `/dashboard`; 525.841 bytes brutos e 179.310 bytes gzip, delta de +824/+286 bytes.
- revisão React: estado mínimo, valores derivados no render, condicionais explícitas, hooks estáveis e ausência de rede/persistência cliente.
- nenhum domain, application, infrastructure, Supabase, migration, dado, dependência, período ou recurso de trading alterado.
- `next-env.d.ts` restaurado; `rewrite-msgs.sh` preservado; `git diff --check` verde.
- nenhum deploy, commit, push ou atualização de PR executado.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`; próximo comando válido: `dia 5`.

## Gate do Dia 5 — SR-015

- contexto central, workflow do Dia 5 e skill `vercel:react-best-practices` consultados; declaração operacional aprovada antes da refatoração.
- inventário confirmou 160 ocorrências de linhas iguais entre as duas ilhas e justificou extração limitada ao lifecycle.
- baseline direcionada antes da mudança: sete suítes e 53 testes verdes.
- RED arquitetural: novo contrato falhou somente porque `presentation/hooks/useFinancialChart.ts` ainda não existia.
- GREEN direcionado: sete suítes e 54 testes verdes após a extração.
- hook interno tipado centraliza inicialização SVG, resize, preferências visuais, atualização e cleanup; builders, modelos, temas, textos e estados permanecem específicos.
- contrato arquitetural proíbe `ChartPort`, Supabase e fetch no hook; ECharts continua confinado ao adapter de presentation.
- revisão React: listeners únicos com remoção simétrica, callbacks com dependências estreitas e nenhum estado derivado em efeito.
- regressão completa: 84 suítes e 480 testes verdes; zero snapshots.
- lint global verde com zero warnings; type-check verde.
- build Next.js `16.3.3` verde; rotas e Proxy preservados.
- analyzer: chunk ECharts/ZRender com 525.257 bytes brutos e 179.344 bytes gzip; delta de -584/+34 bytes sobre o Dia 4.
- tentativa incompatível com pnpm registrada no contexto; pacotes restaurados e artefatos temporários removidos antes dos gates finais.
- `next-env.d.ts` restaurado; `rewrite-msgs.sh` preservado fora do escopo.
- nenhum domain, application, infrastructure, Supabase, migration, dado, dependência, commit, push, PR ou deploy alterado.
- `TECH-CHART-002` encerrada como `DONE`.
- estado de saída: retorno estável a `IMPLEMENTATION_IN_PROGRESS`; próximo comando válido: `dia 6`.

## Gate do Dia 6 — SR-015

- contexto central, workflow do Dia 6 e declaração operacional consultados e aprovados antes da execução.
- skills `vercel:nextjs`, `vercel:react-best-practices`, `vercel:agent-browser-verify`, Browser e `supabase:supabase` aplicadas dentro do escopo aprovado.
- baseline direcionada: cinco suítes e 25 testes de UX/PWA verdes.
- bloqueio real reproduzido em RED: `timestamptz` PostgreSQL válido com offset atravessava o mapper sem normalização e era rejeitado pelo domínio.
- correção mínima aprovada e isolada em infrastructure: `toISOString()` na fronteira, sem mudança de RPC, migration, RLS, dados, ordenação ou fórmulas OHLC.
- GREEN de integridade: quatro suítes e 32 testes direcionados.
- RED/GREEN de acessibilidade: duas tabelas focáveis passaram a executar rolagem horizontal por `ArrowRight`/`ArrowLeft`; duas suítes e 14 testes verdes.
- navegador autenticado: `/` renderizado com dados reais, sem overlay, erro ou warning; alternância Linha/Candles e tabela equivalente preservadas.
- responsividade: 320, 768 e 1280 px sem overflow global; botões do seletor com 44 px; overflow largo confinado à tabela.
- expansão: diálogo modal, scroll do body bloqueado, foco no controle de recolher e restauração de foco/scroll confirmados.
- teclado real: tabela OHLC avançou 216 px com `ArrowRight` e retornou a zero com `ArrowLeft` em 320 px.
- PWA: manifesto HTTP 200 como `application/manifest+json`, `display: standalone`, quatro ícones e dois atalhos; nenhuma promessa de offline.
- revisão React: handlers estáveis, sem listener global, efeito ou estado derivado novo; regra permanece na presentation.
- regressão completa: 84 suítes e 482 testes verdes, sem snapshots.
- lint global: verde com zero warnings; type-check: verde.
- build Next.js `16.3.3` com Turbopack: verde; rotas e Proxy preservados.
- cache corrompido `.next/dev/types` foi validado dentro do workspace, removido e regenerado; `next-env.d.ts` voltou ao conteúdo versionado.
- `git diff --check`: verde; `rewrite-msgs.sh` preservado fora do escopo.
- nenhum deploy, commit, push ou PR foi executado.
- estado de saída: `QUALITY_VALIDATION`; próximo comando válido: `dia 7`.

## Gate do Dia 7 — SR-015

- contexto central e workflow do Dia 7 consultados; declaração operacional aprovada antes da execução.
- regressão completa: 84 suítes e 482 testes verdes, sem snapshots.
- lint global verde com zero warnings; type-check verde.
- auditorias npm completa e de produção verdes, ambas com zero vulnerabilidades.
- build Next.js `16.3.3` com Turbopack verde; rotas e Proxy preservados.
- analyzer: ECharts/ZRender somente em `/` e `/dashboard`; 525.530 bytes brutos e 179.457 bytes gzip, delta de +273/+113 bytes sobre a baseline do Dia 5.
- revisão local de segurança confirmou autenticação server-side por claims, RPC `SECURITY INVOKER`, ownership, limite de 31 dias, ausência de segredo de serviço no cliente e fronteira cliente sem fetch/Supabase/persistência financeira.
- migrations locais e remotas alinhadas; nenhuma migration é necessária nesta etapa.
- Security Advisor manteve somente `SEC-AUTH-001`; três índices sem uso permaneceram informativos; logs recentes de Auth, API e Postgres não apresentaram erro explícito, fatal ou 5xx.
- preview Vercel do commit `22df2d6` está `READY`, sem erro/fatal recente; manifesto servido corretamente e nenhum comentário pendente da toolbar.
- PR `#19` está aberta, não draft e mergeable; Quality Gates, Vercel e Vercel Preview Comments estão verdes no head publicado.
- `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001` continuam bloqueando produção pública; `CI-VERCEL-002` permanece dívida MÉDIA antes de CLI/promoção.
- nenhum código funcional, migration, dado, RLS, configuração Auth, commit, push, merge, deploy ou promoção foi executado.
- `next-env.d.ts` restaurado; `rewrite-msgs.sh` preservado fora do escopo; `git diff --check` verde após a atualização documental.
- estado de saída: `READY_FOR_RELEASE`; próximo passo válido é versionar esta documentação e atualizar a PR `#19`, mantendo o merge condicionado aos checks do novo head.

## Gate do Dia 1 — SEC-AUTH-001

- contexto central, workflow do Dia 1 e skill `supabase:supabase` consultados; declaração operacional aprovada antes da execução.
- changelog e documentação atuais do Supabase consultados; nenhum breaking change aplicável alterou a arquitetura.
- projeto `fin_control` confirmado como `ACTIVE_HEALTHY`; organização confirmada no plano `free`.
- Security Advisor confirmou exclusivamente `auth_leaked_password_protection` como aviso externo.
- documentação oficial confirmou Pwned Passwords/Have I Been Pwned e requisito de plano Pro ou superior.
- código e SDK instalados foram inspecionados: sessão válida pode transportar `weakPassword`; falhas reais continuam separadas por `error`.
- ADR 0016 define provider nativo, ausência de tratamento próprio de senhas, contratos TDD, validação remota e rollback.
- nenhuma configuração Auth, usuário, senha, sessão, migration, RLS, dado, segredo, dependência ou código funcional foi alterado.
- estado arquitetural: `ARCHITECTURE_READY`; estado operacional: `BLOCKED` até upgrade humano para Pro ou superior.

## Gate do Dia 1 — SEC-HARD-001

- contexto central e workflow do Dia 1 consultados; declaração operacional aprovada antes da execução.
- skills `supabase:supabase`, `vercel:nextjs` e `vercel:vercel-api` aplicadas somente em discovery e leitura.
- documentação atual de headers do Next.js, rate limits/CAPTCHA do Supabase e WAF rate limiting da Vercel consultada.
- inspeção local confirmou ausência de headers em `next.config.mjs` e responsabilidade exclusiva de sessão no Proxy.
- inspeção remota confirmou HTTPS/HSTS da Vercel e ausência da baseline completa na resposta pública do aplicativo.
- fronteira de tráfego confirmada: `signInWithPassword` sai do browser para o Supabase; WAF em `/login` não limita o password grant.
- ADR 0017 separa headers locais (`SEC-HARD-001A`) de CAPTCHA externo (`SEC-HARD-001B`) e proíbe proxy próprio de credenciais.
- nenhuma configuração, código funcional, teste executável, Auth, CAPTCHA, rate limit, segredo, migration, RLS, dado, dependência ou deploy foi alterado.
- `SEC-HARD-001A`: `READY`; `SEC-HARD-001B`: `BLOCKED`; estado de saída: `ARCHITECTURE_READY`.

## Gate do Dia 2 — SEC-HARD-001A

- contexto central e workflow do Dia 2 consultados; declaração operacional aprovada antes da execução.
- skills `vercel:nextjs` e `supabase:supabase` consultadas apenas para o contrato da configuração do Next.js e da origem Supabase.
- baseline anterior ao RED: 84 suítes e 482 testes verdes, sem snapshots.
- nova suíte server-side usa a configuração real do Next.js e cobre 12 casos de headers, CSP, origem Supabase, produção/preview e fronteira do Proxy.
- RED direcionado válido: 1 suíte falhou, com 11 falhas intencionais e 1 teste de fronteira verde.
- regressão ampliada: 84 suítes anteriores verdes; somente a nova suíte falhou; 483 testes verdes e 11 falhas planejadas em 494 testes.
- as falhas são causadas exclusivamente pela implementação ainda ausente em `next.config.mjs`, conforme exigido pelo TDD.
- type-check verde; lint global verde com zero warnings; zero snapshots.
- `next.config.mjs` e `src/proxy.ts` não foram alterados; nenhum header funcional, Auth, CAPTCHA, rate limit, Supabase remoto, migration, RLS, dado, segredo, dependência ou deploy foi modificado.
- `next.config.d.mts` tipa somente a importação da configuração no teste; `rewrite-msgs.sh` permanece não rastreado e fora do escopo.
- estado de saída: `TEST_STRATEGY_READY`; próximo comando válido: `dia 3`.

## Gate do Dia 7 — UX-SHELL-001

- contexto central e workflow do Dia 7 consultados; declaração operacional aprovada antes da execução;
- lint e type-check verdes; regressão completa com 86 suítes, 505 testes e zero snapshots;
- auditoria do lockfile em severidade alta verde com zero vulnerabilidades;
- build Next.js `16.3.3` com Turbopack verde, preservando todas as rotas e o Proxy;
- revisão do diff confirmou ausência de mudança em Auth, Supabase, migrations, RLS, dados financeiros, segredos ou variáveis de ambiente;
- CSP, headers, claims verificadas, rejeição anônima, atualização de cookies e falha fechada permanecem preservados;
- Supabase `ACTIVE_HEALTHY`, seis migrations alinhadas, somente `SEC-AUTH-001` no Security Advisor e três índices sem uso como alertas informativos;
- Preview `dpl_F7b8DgT51THXnShNQdrnDCTDrXMi` no head `f232e5d` está `READY`; runtime sem `error/fatal` em 24 horas;
- PR `#23` aberta, limpa e mergeável, com Quality Gates, Vercel e Vercel Preview Comments verdes;
- observabilidade mínima coberta por GitHub Actions e logs Vercel; `HARD-OBS-001` continua bloqueando produção pública;
- avisos de Node/npm e vínculo local antigo permanecem registrados em `CI-VERCEL-002` como dívida MÉDIA;
- nenhum Auth remoto, migration, dado, configuração permanente, commit, push, merge, deploy ou promoção foi executado;
- estado de saída: `READY_FOR_RELEASE`; próximo passo: versionar a documentação e atualizar a PR `#23`.

## Gate do Dia 3 — UX-SHELL-001

- contexto central e workflow do Dia 3 consultados; declaração operacional aprovada antes da implementação.
- `PrivateTopbar` compactada e `AccountPanel.client.tsx` criado sem alterar os testes do Dia 2.
- GREEN direcionado: 1 suíte e 12 testes verdes, zero snapshots.
- regressão intermediária detectou somente literal `bg-black/50`; corrigido para token semântico `bg-navigation/70` sem flexibilizar contratos.
- regressão final: 85 suítes e 499 testes verdes, zero snapshots.
- lint global verde com zero warnings; type-check verde.
- build Next.js `16.3.3` com Turbopack verde; todas as rotas e o Proxy preservados.
- revisão Next.js confirmou manutenção da client composition root; revisão React confirmou callback estável, cleanup de listener/scroll e portal ancorado ao viewport.
- nenhuma dependência, rota, regra financeira, Auth, Supabase, migration, RLS, dado ou configuração remota foi alterada.
- `next-env.d.ts` restaurado; anexos, script local e stash de charts preservados fora do escopo.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`; próximo comando válido: `dia 4`.

## Gate do Dia 4 — UX-SHELL-001

- contexto central e workflow do Dia 4 consultados; declaração operacional aprovada antes da execução.
- baseline direcionada: 1 suíte e 12 testes verdes; novos contratos produziram RED com 11 verdes e 2 falhas esperadas.
- GREEN direcionado: 1 suíte e 13 testes verdes, zero snapshots.
- diálogo passou a ter descrição acessível da sessão, fundo `inert`/`aria-hidden` com restauração integral e foco restaurado após o cleanup.
- topbar e painel passaram a respeitar safe areas laterais; painel preserva safe areas superior/inferior e contém overscroll.
- validação real em 320, 768 e 1280 px confirmou ausência de overflow, breakpoints corretos, foco/scroll restaurados e composição bottom sheet/painel ancorado.
- nenhum overlay de erro foi encontrado; o único log foi o aviso esperado do React Dev por a CSP segura bloquear `unsafe-eval`, sem impacto no build de produção.
- regressão final: 85 suítes e 500 testes verdes, zero snapshots.
- lint global verde com zero warnings; type-check verde; build Next.js `16.3.3` verde com todas as rotas e o Proxy preservados.
- o runtime Node empacotado foi usado porque o shim global do npm permanece quebrado; `next-env.d.ts` foi restaurado e artefatos auxiliares do dev server removidos.
- nenhuma dependência, rota, Auth, Supabase, migration, RLS, dado, configuração remota, commit, push, merge ou deploy foi alterado.
- anexos, `rewrite-msgs.sh` e stash de `UX-CHART-002/003` permaneceram fora do escopo.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`; próximo comando válido: `dia 5`.

## Gate do Dia 5 — UX-SHELL-001

- contexto central e workflow do Dia 5 consultados; declaração operacional aprovada antes da refatoração.
- baseline direcionada: 2 suítes e 23 testes verdes, zero snapshots.
- plano incremental rejeitou uma primitive modal comum e limitou a extração à única duplicação comprovada: contenção de foco.
- RED do utilitário: suíte falhou pela ausência de `containKeyboardFocus`; GREEN unitário passou em cinco cenários.
- RED do backdrop: 12 testes verdes e 1 falha esperada por `aria-hidden` ausente; ajuste mínimo levou o contrato a GREEN.
- GREEN direcionado final: 3 suítes e 28 testes verdes, zero snapshots.
- `AccountPanel` reduziu de 202 para 170 linhas e `ExpandableChartFrame` de 220 para 188; utilitário compartilhado possui 39 linhas.
- revisão React confirmou imports diretos, dependências estreitas e listeners com cleanup; scan de design/arquitetura não encontrou `any`, cor literal ou Supabase no recorte.
- regressão final: 86 suítes e 505 testes verdes, zero snapshots.
- lint global verde com zero warnings; type-check verde; build Next.js `16.3.3` verde com todas as rotas e o Proxy preservados.
- `next-env.d.ts` restaurado; nenhuma dependência, rota, Auth, Supabase, migration, RLS, dado, configuração remota, commit, push, merge ou deploy foi alterado.
- anexos, `rewrite-msgs.sh` e stash de `UX-CHART-002/003` permaneceram fora do escopo.
- `REFACTORING_IN_PROGRESS` encerrado; retorno estável a `IMPLEMENTATION_IN_PROGRESS`; próximo comando válido: `dia 6`.

## Gate do Dia 3 — SEC-HARD-001A

- contexto central e workflow do Dia 3 consultados; declaração operacional aprovada antes da implementação.
- skills `vercel:nextjs` e `supabase:supabase` aplicadas somente à configuração do Next.js e ao contrato da origem pública.
- documentação atual confirmou `headers()` como função assíncrona de configuração; nenhum breaking change do Supabase afeta a origem HTTPS gerenciada usada pela CSP.
- implementação mínima confinada a `next.config.mjs`: `poweredByHeader: false`, baseline global, CSP, validação HTTPS da origem Supabase e políticas exclusivas de produção.
- GREEN direcionado: 1 suíte e 12 testes verdes, sem remoção ou relaxamento de expectativas.
- regressão completa: 85 suítes e 494 testes verdes, sem snapshots.
- lint global verde com zero warnings; type-check verde.
- build Next.js `16.3.3` com Turbopack verde; todas as rotas e o Proxy foram preservados.
- primeira execução do build falhou somente pela rede isolada ao buscar Geist; repetição com acesso autorizado compilou e gerou todas as páginas.
- `next-env.d.ts` restaurado após geração automática; `git diff --check` verde.
- nenhum Auth remoto, CAPTCHA, rate limit, Supabase remoto, migration, RLS, dado, segredo, dependência, commit, push, merge ou deploy foi alterado.
- `rewrite-msgs.sh` permanece não rastreado e fora do escopo.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`; próximo comando válido: `dia 4`.

## Gate do Dia 4 — SEC-HARD-001A

- contexto central e workflow do Dia 4 consultados; declaração operacional e uso das credenciais de validação aprovados antes da execução.
- deployment Preview `dpl_4fgmbZgiKjdW62xJmnmdCQFxichL` confirmado `READY` no commit `9604e44` e na PR `#22`.
- Vercel Authentication preservada; acesso automatizado realizado por link oficial efêmero, com expiração automática em 23 horas e sem configuração permanente.
- login real, sessão autenticada, dashboard com três movimentos, gráfico de linha, Candlestick e tabelas acessíveis validados no Preview.
- expansão do Candlestick validada como diálogo nomeado, com foco no recolhimento, scroll bloqueado e restauração de foco/scroll ao fechar.
- temas escuro e sistema funcionais; nenhum overlay do Next.js ou bloqueio funcional de CSP foi observado.
- resposta real de `/login`: HTTP 200, CSP em enforcement com origem Supabase exata, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, políticas de referrer/permissões, HSTS e ausência de `X-Powered-By`.
- manifesto remoto: HTTP 200 como `application/manifest+json`; contrato versionado mantém `display: standalone`, quatro ícones e dois atalhos.
- validação local complementar do mesmo build confirmou console sem erro/warning e redirecionamento de rota privada sem sessão.
- regressão completa: 85 suítes e 494 testes verdes, sem snapshots.
- lint global verde com zero warnings; type-check verde.
- build Next.js `16.3.3` isolado verde; rotas e Proxy preservados. Uma execução concorrente com Jest falhou por escrita do ambiente após compilar, e a repetição isolada passou sem mudança de código.
- nenhum código funcional, Auth remoto, CAPTCHA, rate limit, Supabase remoto, migration, RLS, dado, dependência, configuração permanente da Vercel, merge ou deploy foi alterado.
- credenciais e links temporários não foram persistidos; `rewrite-msgs.sh` permanece não rastreado e fora do escopo.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`; próximo comando válido: `dia 5`.

## Gate do Dia 5 — SEC-HARD-001A

- contexto central e workflow do Dia 5 consultados; declaração operacional aprovada antes da execução.
- skill `vercel:nextjs` aplicada à revisão de `next.config.mjs` e da fronteira com o Proxy.
- auditoria confirmou configuração curta, coesa e determinística; helpers locais possuem responsabilidade única e nenhuma extração adicional reduziria risco ou duplicação.
- CSP, origem Supabase exata, falha fechada, headers comuns e políticas exclusivas de produção permaneceram inalterados.
- baseline direcionada: 1 suíte e 12 testes verdes.
- regressão completa: 85 suítes e 494 testes verdes, sem snapshots.
- lint global verde com zero warnings; type-check verde.
- build Next.js `16.3.3` com Turbopack verde; todas as rotas e o Proxy foram preservados.
- o shim global de `npm` estava inválido; os gates foram executados com os binários locais pelo runtime Node empacotado do workspace, sem alteração de dependência ou configuração do projeto.
- `next-env.d.ts` regenerado pelo build foi restaurado ao conteúdo versionado.
- nenhum código funcional, Auth remoto, CAPTCHA, rate limit, Supabase remoto, migration, RLS, dado, segredo, dependência, commit, push, merge ou deploy foi alterado.
- `UX-CHART-002` e `UX-CHART-003` foram preservadas como documentação futura; `.codex-remote-attachments/` e `rewrite-msgs.sh` permaneceram fora do escopo.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS` estável; próximo comando válido: `dia 6`.

## Gate do Dia 6 — SEC-HARD-001A

- contexto central e workflow do Dia 6 consultados; declaração operacional e uso do Preview protegido aprovados antes da execução.
- deployment `dpl_Bg9ZwECGhPPr9L3SAyQwTmqhA6at` no commit `f4506dc` e na PR `#22` confirmado `READY`.
- login e dashboard autenticado renderizaram sem erro ou warning no console; nenhuma credencial ou URL temporária foi persistida.
- responsividade em 320, 768 e 1280 px sem overflow global; navegação adaptativa, cards, tabela e gráfico preservados.
- alvos principais de 44 px, rótulos, landmark, `lang=pt-BR`, viewport e alternância claro/escuro/sistema validados.
- tabela manteve rolagem horizontal confinada e avançou 216 px com `ArrowRight` em 320 px.
- expansão do candle manteve diálogo nomeado, foco no recolhimento, bloqueio do body e restauração de foco/scroll ao fechar.
- simulação de `Escape` no navegador protegido foi inconclusiva; o contrato específico continuou verde no Jest e não foi tratado como defeito sem reprodução confiável.
- abertura isolada do manifesto foi bloqueada pela autenticação SSO da Vercel; link/metadata foram validados no DOM e o contrato versionado permaneceu verde, sem promessa offline ou service worker.
- sete suítes direcionadas e 42 testes verdes; regressão completa com 85 suítes e 494 testes verdes, sem snapshots.
- lint global verde com zero warnings; type-check verde.
- build Next.js `16.3.3` com Turbopack verde; todas as rotas e o Proxy preservados.
- nenhum código funcional, Auth remoto, CAPTCHA, rate limit, Supabase remoto, migration, RLS, dado, segredo, dependência, configuração permanente da Vercel, commit, push, merge ou deploy foi alterado.
- `next-env.d.ts` restaurado; `.codex-remote-attachments/` e `rewrite-msgs.sh` preservados fora do escopo.
- estado de saída: `QUALITY_VALIDATION`; próximo comando válido: `dia 7`.

## Gate do Dia 7 — SEC-HARD-001A

- contexto central e workflow do Dia 7 consultados; declaração operacional aprovada antes da execução.
- regressão completa: 85 suítes e 494 testes verdes, sem snapshots.
- lint global verde com zero warnings; type-check verde.
- auditorias npm completa e de produção verdes com zero vulnerabilidades.
- supply chain: 701 pacotes com assinaturas verificadas e 102 com attestations verificadas.
- build Next.js `16.3.3` com Turbopack verde; todas as rotas e o Proxy preservados.
- revisão local confirmou CSP, headers globais, falha fechada da origem Supabase, claims verificadas, rejeição de Auth anônimo e ausência de segredo de serviço rastreado.
- seis migrations locais/remotas alinhadas; RLS forçada, ownership, grants mínimos e RPC `SECURITY INVOKER` preservados.
- projeto Supabase `ACTIVE_HEALTHY`; Security Advisor manteve somente `SEC-AUTH-001`; três índices sem uso permaneceram informativos; logs recentes sem erro/fatal/5xx relevante ao fluxo.
- deployment `dpl_DnyxprjAaichYi5NuEjoUYEbimpG` no head `f8049e4` está `READY`, sem cluster de runtime, log `error/fatal` ou resposta 5xx em 24 horas.
- PR `#22` aberta, não draft, mergeável e com Quality Gates, Vercel e Vercel Preview Comments verdes no head publicado.
- avisos remotos de Node/npm e vínculo local antigo continuam em `CI-VERCEL-002` como dívida MÉDIA antes de CLI/promoção.
- `SEC-HARD-001A` pronta para release incremental; produção pública continua bloqueada por `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001B`.
- nenhum Auth remoto, CAPTCHA, rate limit, migration, RLS, dado, segredo, dependência, commit, push, merge, deploy ou promoção foi executado.
- `next-env.d.ts` restaurado; `UX-CHART-002/003`, `.codex-remote-attachments/` e `rewrite-msgs.sh` preservados fora do escopo.
- estado de saída: `READY_FOR_RELEASE`; próximo passo: versionar a documentação do Dia 7 e atualizar a PR `#22`.

## Gate do Dia 2 — UX-SHELL-001

- contexto central e workflow do Dia 2 consultados; declaração operacional aprovada antes dos testes.
- baseline direcionada anterior ao RED: 1 suíte e 7 testes verdes.
- matriz classifica domain, application e infrastructure como não aplicáveis; o recorte permanece integralmente em presentation.
- suíte do `PrivateAppShell` ampliada para 12 testes sem criar componente ou código funcional.
- RED direcionado: 4 testes verdes e 8 falhas planejadas pela ausência do trigger, painel e classes compactas.
- regressão completa: 85 suítes, 84 verdes e somente a suíte do shell vermelha; 499 testes, 491 verdes e 8 vermelhos planejados; zero snapshots.
- lint global verde com zero warnings; type-check verde.
- falhas cobrem topbar compacta, diálogo, foco, teclado, backdrop, scroll, tema e logout, sem flexibilizar comportamento esperado.
- nenhuma dependência, rota, Auth, Supabase, migration, RLS, dado, configuração remota, código funcional, commit, push, merge ou deploy foi alterado.
- `.codex-remote-attachments/`, `rewrite-msgs.sh` e o stash de `UX-CHART-002/003` foram preservados fora do escopo.
- estado de saída: `TEST_STRATEGY_READY`; próximo comando válido: `dia 3`.

## Gate do Dia 3 — UX-CHART-002

- contexto central e workflow do Dia 3 consultados; declaração operacional aprovada antes da implementação.
- skill `supabase:supabase` aplicada ao contrato server-side, com claims permanentes, RLS preservada, filtro explícito de proprietário e consulta civil semiaberta.
- skill `vercel:react-best-practices` aplicada após as alterações TSX; efeitos, refs, listeners, estado assíncrono, acessibilidade e composição foram revisados.
- segurança: `userId` do cliente é descartado e o ator autenticado sobrescreve tentativa forjada; sessões ausentes, inválidas e anônimas falham antes da consulta.
- repository usa projeção mínima e ordenação determinística; erros do provider são sanitizados.
- seleção ECharts registra um listener estreito e o remove no cleanup; a tabela oferece ação integral de teclado.
- painel carrega somente após seleção, apresenta loading/empty/error/success e rejeita respostas assíncronas obsoletas.
- contratos focados: 9 suítes e 40 testes verdes.
- regressão de `financial-analytics`: 29 suítes e 209 testes verdes.
- regressão completa: 92 suítes e 532 testes verdes, sem snapshots.
- lint global verde com zero warnings; type-check e build Next.js 16.3.3 verdes; `git diff --check` verde, salvo avisos informativos de normalização LF/CRLF.
- o build inicial foi bloqueado somente pelo acesso ao Google Fonts; a reexecução autorizada compilou e gerou todas as rotas, e `next-env.d.ts` foi restaurado ao conteúdo versionado.
- nenhuma migration, RPC, policy, grant, dado, dependência, configuração Supabase remota, commit, push, merge ou deploy foi criado/executado.
- `.codex-remote-attachments/`, `rewrite-msgs.sh` e o stash histórico permaneceram preservados.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS` em GREEN; próximo comando válido: `dia 4`.

## Gate do Dia 4 — UX-CHART-002

- contexto central e workflow do Dia 4 consultados; declaração operacional aprovada antes da implementação.
- skill `vercel:react-best-practices` aplicada após as alterações TSX; portal, efeitos, refs, callbacks, cleanup e estado assíncrono foram revisados.
- RED controlado observado: 3 dos 7 contratos do painel falharam pela ausência de diálogo durante loading, isolamento/foco/scroll e backdrop.
- diálogo nomeado e modal preservado durante loading, empty, error e success; retry mantém o intervalo aberto.
- foco inicial, contenção por teclado, restauração ao acionador, `Escape`, backdrop, bloqueio/restauração de scroll e isolamento/restauração do background cobertos.
- bottom sheet usa safe areas, overscroll confinado, movimento reduzido e target de 44 px; painel lateral desktop preservado.
- gráfico e tabela convergem para o mesmo loader e intervalo semiaberto na composição real.
- contratos direcionados: 2 suítes e 12 testes verdes.
- regressão de `financial-analytics`: 29 suítes e 213 testes verdes.
- regressão completa: 92 suítes e 536 testes verdes, sem snapshots.
- lint global verde com zero warnings; type-check e build Next.js 16.3.3 verdes; `git diff --check` verde, salvo avisos informativos de LF/CRLF.
- nenhuma migration, RPC, policy, grant, dado, dependência, configuração Supabase remota, commit, push, merge, deploy ou promoção foi executado.
- `.codex-remote-attachments/` e `rewrite-msgs.sh` permaneceram preservados fora do escopo; `UX-CHART-003` continua em `DISCOVERY`.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS` em GREEN; próximo comando válido: `dia 5`.

## Gate do Dia 5 — UX-CHART-002

- contexto central e workflow do Dia 5 consultados; declaração operacional aprovada antes da refatoração.
- baseline de painel e switcher anterior à edição: 2 suítes e 12 testes verdes.
- duplicação concreta de lifecycle modal identificada entre `AccountPanel` e `FinancialIntervalStatementPanel`.
- primitive `useModalDialogLifecycle` criada em shared presentation, sem mover regra financeira ou infraestrutura para o hook.
- portal, foco inicial/contido/restaurado, `Escape`, scroll, `aria-hidden`, `inert` e cleanup permanecem cobertos nos dois consumidores.
- skill `vercel:react-best-practices` aplicada com leitura das regras de listeners, dependências estreitas e handlers em refs; callback estável usa a implementação externa mais recente sem reinstalar o lifecycle.
- nenhuma dependência de compartilhamento de eventos foi adicionada porque o contrato mantém um único modal ativo e não há evidência de gargalo.
- consumidores diretamente afetados: 3 suítes e 25 testes verdes.
- regressão completa: 92 suítes e 536 testes verdes, sem snapshots.
- lint global verde com zero warnings; type-check e build Next.js 16.3.3 verdes.
- `next-env.d.ts` restaurado ao conteúdo versionado; `git diff --check` verde, salvo avisos LF/CRLF informativos.
- nenhuma dívida CRÍTICA ou ALTA identificada; nenhuma migration, RPC, policy, grant, dado, dependência, configuração remota, commit, push, merge, deploy ou promoção foi executado.
- `.codex-remote-attachments/` e `rewrite-msgs.sh` permaneceram preservados fora do escopo; `UX-CHART-003` continua em `DISCOVERY`.
- `REFACTORING_IN_PROGRESS` encerrado; retorno estável a `IMPLEMENTATION_IN_PROGRESS` em GREEN; próximo comando válido: `dia 6`.

## Gate do Dia 6 — UX-CHART-002

- contexto central e workflow do Dia 6 consultados; declaração operacional e uso das credenciais aprovados antes da validação autenticada.
- ciclo TDD direcionado: RED com 3 falhas planejadas; GREEN com 3 suítes e 20 testes.
- instrução visível orienta seleção pelo candle ou ação `Ver extrato`; descrição acessível apresenta a alternativa integral de teclado.
- coluna `Extrato` movida para imediatamente após `Dia`, mantendo rolagem horizontal confinada à região da tabela.
- validação autenticada em 320, 768 e 1280 px sem overflow global; sessão existente reutilizada sem digitar ou persistir credenciais.
- em 320 px, extrato validado como bottom sheet; em 768/1280 px, painel lateral de 448 px e altura total.
- foco inicial, contenção por `Tab`/`Shift+Tab`, `Escape`, bloqueio/restauração de scroll e retorno do foco ao acionador confirmados no navegador.
- estado vazio real e Server Action sob demanda confirmados sem criar ou alterar dados financeiros.
- PWA: `lang=pt-BR`, viewport, theme colors e manifesto válidos; quatro ícones existentes, incluindo maskable, e dois atalhos. Nenhuma promessa offline ou service worker foi introduzida.
- console sem erro funcional; apenas diagnóstico conhecido do React em desenvolvimento sob CSP, ausente do build de produção.
- regressão completa: 92 suítes e 539 testes verdes, zero snapshots.
- lint global, type-check e build Next.js 16.3.3 verdes; `next-env.d.ts` restaurado ao conteúdo versionado.
- nenhuma migration, RPC, policy, grant, dado, configuração remota, dependência, commit, push, PR, merge, deploy ou promoção foi executado.
- `.codex-remote-attachments/` e `rewrite-msgs.sh` permaneceram preservados fora do escopo; `UX-CHART-003` continua em `DISCOVERY`.
- estado de saída: `QUALITY_VALIDATION`; próximo comando válido: `dia 7`.

## Gate do Dia 7 — UX-CHART-002

- contexto central e workflow do Dia 7 consultados; declaração operacional aprovada antes da execução.
- regressão completa: 92 suítes e 539 testes verdes, zero snapshots.
- lint global, type-check e build Next.js 16.3.3 com Turbopack verdes; todas as rotas e o Proxy preservados.
- auditorias npm completa e de produção: zero vulnerabilidades; supply chain sem assinatura inválida ou ausente.
- revisão estática confirmou claims permanentes, rejeição de Auth anônimo, intervalo civil semiaberto limitado a 31 dias, projeção mínima, erro sanitizado e ausência de acesso Supabase na presentation.
- tabela `transactions` mantém RLS habilitada/forçada, ownership, grants mínimos e índice composto; seis migrations locais/remotas alinhadas.
- projeto Supabase `ACTIVE_HEALTHY`; Security Advisor manteve somente `SEC-AUTH-001`; três índices sem uso seguem informativos.
- logs Supabase em 24 horas: 40 chamadas API HTTP 200, 31 eventos Auth informativos sem erro e 23 eventos Postgres rotineiros.
- logs administrados da Data API registram o UUID do filtro de ownership, sem descrição, valor, token ou cookie; retenção/redaction permanece em `HARD-OBS-001` antes de produção pública.
- deployment `dpl_CZqRhecqZKsv8BTZKWeszs3jdhRc` no commit `f865576` e PR `#24` está `READY`; não há runtime errors nem logs `error/fatal/warning` em 24 horas.
- PR `#24` aberta, draft, mergeável e `clean`; checks `validate` e `Vercel Preview Comments` concluídos em sucesso.
- drift de vínculo local, Node e npm permanece dívida MÉDIA `CI-VERCEL-002`; não afeta o Preview, mas bloqueia CLI/promoção até correção.
- nenhum código funcional, migration, RLS, dado, dependência, configuração remota, commit, push, alteração da PR, merge, deploy ou promoção foi executado.
- `next-env.d.ts` restaurado; `.codex-remote-attachments/` e `rewrite-msgs.sh` preservados fora do escopo.
- `UX-CHART-002` pronta para release incremental; produção pública continua bloqueada por `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001B`.
- estado de saída: `READY_FOR_RELEASE`; próximo passo: versionar o Dia 7 e atualizar a PR `#24`.

## Gate do Dia 6 — UX-CHART-002D

- ciclo TDD responsivo: RED com 1 teste novo falhando e 14 anteriores passando; GREEN com 1 suíte e 15 testes aprovados.
- volume e resultado líquido ocupam largura total abaixo de `sm`; receitas e despesas permanecem em duas colunas e todas as métricas retomam grade compacta a partir de `sm`.
- disclosure mantém alvo mínimo de 44 px, foco visível, `aria-expanded`, `aria-controls` e passa a respeitar explicitamente `motion-reduce`.
- painel, shell privado, contraste, design system e PWA: 5 suítes e 47 testes verdes.
- PWA mantém manifesto instalável, `standalone`, `pt-BR`, theme colors, ícones raster/maskable e atalhos, sem prometer offline nem registrar service worker.
- regressão financial-analytics: 30 suítes e 239 testes verdes; regressão completa: 93 suítes e 562 testes verdes, zero snapshots.
- ESLint global, type-check e build Next.js 16.3.3 verdes; todas as rotas e o Proxy foram preservados.
- conector do navegador não iniciou por falha local de caminho de assets; confirmação visual autenticada no Preview fica como risco BAIXO explícito para o Dia 7.
- nenhuma migration, RLS, dado, dependência, configuração remota, commit, push, PR, merge, deploy ou promoção foi executado.
- `next-env.d.ts` restaurado; anexos privados e `rewrite-msgs.sh` preservados fora do escopo.
- estado de saída: `QUALITY_VALIDATION`; próximo comando válido: `dia 7`.

## Gate do Dia 7 — UX-CHART-002D

- contexto central e workflow do Dia 7 consultados; declaração operacional aprovada antes da execução.
- regressão completa: 93 suítes e 562 testes verdes, zero snapshots.
- ESLint global sem avisos, type-check e build Next.js 16.3.3 com Turbopack verdes; todas as rotas e o Proxy preservados.
- auditoria npm retornou zero vulnerabilidades.
- revisão estática confirmou ausência de segredo privilegiado versionado, Supabase isolado da presentation, cálculos em centavos e nenhum histórico bruto adicional no browser.
- projeto Supabase `ACTIVE_HEALTHY`; três tabelas públicas com RLS, seis migrations locais/remotas alinhadas e Security Advisor somente com `SEC-AUTH-001`.
- Performance Advisor reportou somente um índice de contas ainda sem uso, aviso informativo sem relação com esta entrega.
- Preview `dpl_AXTEHPDNfd3sS92FWQVbsUWWciqM` da PR `#26`, commit `5d17de9`, está `READY`; não houve runtime error nem log `error/fatal` nas últimas 24 horas.
- Vercel mantém o aviso conhecido de Node/npm coberto por `CI-VERCEL-002`; nenhuma configuração remota foi alterada.
- conector do navegador permaneceu indisponível por falha local de assets; confirmação visual autenticada ficou como risco BAIXO, mitigado por testes responsivos/acessíveis, build e Preview verdes.
- nenhuma migration, RLS, dado, dependência, configuração remota, commit, push, alteração da PR, merge, deploy ou promoção foi executado.
- `next-env.d.ts` restaurado; anexos privados e `rewrite-msgs.sh` preservados fora do escopo.
- produção pública continua bloqueada por `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001B`, sem impedir o merge incremental da feature.
- estado de saída: `READY_FOR_RELEASE`; próximo passo: versionar o Dia 7 e atualizar a PR `#26`.

## Gate do Dia 1 — UX-CHART-003A

- contexto central e workflow do Dia 1 consultados; declaração operacional aprovada antes da execução.
- PR `#26` confirmada como squash merge `70fd53c` em `origin/develop`; branch da `UX-CHART-003` avançada da base antiga sem descartar commits próprios.
- stash documental antigo foi somente inspecionado e permaneceu preservado para evitar reaplicar contexto obsoleto.
- discovery separou `003A` para barra dos cinco períodos atuais, `003B` para `3M/Ano` agregados e `003C` para `Tudo/Personalizado` com drill-down.
- `003A` preserva os cinco valores de URL, resolver civil, composition root, caso de uso e RPC diária limitada a 31 dias.
- arquitetura mantém seletor como Server Component e navegação GET progressiva, sem estado cliente ou acesso Supabase na presentation.
- baseline atual aprovada com 3 suítes e 30 testes, zero snapshots, cobrindo resolver de período, composição financeira e rotas.
- projeto Supabase `ACTIVE_HEALTHY`, três tabelas sob RLS e seis migrations locais/remotas alinhadas; nenhuma mutação remota foi executada.
- futura RPC de `003B` condicionada a `SECURITY INVOKER`, `search_path = ''`, ownership, grants mínimos, pgTAP, advisors e plano medido antes de novo índice.
- erro documental residual da predecessora foi registrado em erros recorrentes e corrigido antes da saída.
- nenhum código funcional, teste, migration, dado, dependência, commit, push, PR, merge remoto, deploy ou promoção foi criado/executado.
- `docs/ux-chart-003-discovery.md`, ADR 0020, backlog, roadmap e contexto central compõem os artefatos do Dia 1.
- estado de saída: `ARCHITECTURE_READY`; próximo comando válido: `dia 2` da `UX-CHART-003A`.

## Gate do Dia 2 — UX-CHART-003A

- contexto central e workflow do Dia 2 consultados; declaração operacional aprovada antes da execução.
- matriz por camada, cenários felizes, alternativos e limites documentados em `docs/ux-chart-003-test-strategy.md`.
- presentation recebeu três contratos para ordem e nomes da barra, navegação GET progressiva, valores de URL, alvo de 44 px, rolagem confinada, `aria-pressed` e indicação ativa não limitada à cor.
- rotas receberam a matriz dos cinco períodos e o fallback de parâmetro repetido para `month`.
- teste de arquitetura preserva o seletor como Server Component sem fetch, Supabase ou hooks de navegação.
- RED controlado: 3 suítes, 27 testes, 23 preservados e 4 falhas esperadas, zero snapshots.
- rede de segurança de domínio, application e composição: 4 suítes e 37 testes verdes, zero snapshots.
- regressão completa: 93 suítes, 91 verdes e apenas 2 suítes RED; 567 testes verdes e somente as 4 falhas planejadas entre 571 testes, zero snapshots.
- ESLint global e type-check global verdes; `git diff --check` verde.
- falha ambiental do `npm` global foi contornada com o runtime Node empacotado, sem instalação ou alteração de dependências.
- nenhum código funcional, migration, RLS, dado, dependência, configuração remota, commit, push, alteração da PR, merge, deploy ou promoção foi executado.
- anexos privados, `rewrite-msgs.sh` e stashes permaneceram intocados.
- estado de saída: `TEST_STRATEGY_READY`; próximo comando válido: `dia 3` da `UX-CHART-003A`.

## Gate do Dia 3 — UX-CHART-003A

- contexto central e workflow do Dia 3 consultados; declaração operacional aprovada antes da execução.
- quatro contratos RED do Dia 2 tornaram-se verdes sem enfraquecimento das expectativas.
- barra GET server-rendered apresenta `Semana`, `7D`, `Quinzena`, `15D` e `Mês` com valores canônicos existentes.
- nomes acessíveis completos, `aria-pressed`, anel ativo, alvos de 44 px e rolagem horizontal confinada implementados.
- ausência, valor desconhecido e parâmetro repetido usam o fallback seguro `month`.
- seletor permanece Server Component sem fetch, Supabase, hooks de navegação ou estado cliente.
- contratos direcionados: 3 suítes e 27 testes verdes; regressão completa: 93 suítes e 571 testes verdes; zero snapshots.
- ESLint, type-check, build Next.js 16.3.3 e `git diff --check` verdes.
- `next-env.d.ts` restaurado após a reescrita automática do build.
- nenhum período novo, migration, RLS, dado, dependência, configuração remota, commit, push, alteração da PR, merge, deploy ou promoção foi executado.
- anexos privados, `rewrite-msgs.sh` e stashes permaneceram intocados.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS` em GREEN; próximo comando válido: `dia 4` da `UX-CHART-003A`.

## Gate do Dia 4 — UX-CHART-003A

- contexto central e workflow do Dia 4 consultados; declaração operacional aprovada antes da implementação.
- skill `vercel:nextjs` aplicada para preservar o seletor como Server Component e o formulário GET progressivo.
- RED dirigido: 1 suíte, 19 testes, 17 preservados e 2 falhas esperadas pela orientação e redução de movimento ainda ausentes.
- orientação curta diferencia períodos civis e móveis e está ligada ao grupo por `aria-describedby`.
- matriz dos cinco períodos garante uma única seleção semântica; ordem por teclado e `prefers-reduced-motion` estão cobertos.
- seletor permanece disponível em `success`, `empty` e `missing_accounts`.
- contratos direcionados: 3 suítes e 34 testes verdes, zero snapshots.
- regressão completa: 93 suítes e 578 testes verdes, zero snapshots.
- ESLint global, type-check e build Next.js 16.3.3 com Turbopack verdes; todas as rotas e o Proxy preservados.
- `next-env.d.ts` restaurado ao conteúdo versionado depois do build.
- nenhum período novo, Client Component, migration, RPC, RLS, dado, dependência, configuração remota, commit, push, alteração da PR, merge, deploy ou promoção foi executado.
- anexos privados, `rewrite-msgs.sh` e os dois stashes permaneceram intocados.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS` em GREEN; próximo comando válido: `dia 5` da `UX-CHART-003A`.

## Gate do Dia 5 — UX-CHART-003A

- contexto central e workflow do Dia 5 consultados; declaração operacional aprovada antes da refatoração.
- baseline: 2 suítes e 24 testes verdes, zero snapshots.
- auditoria identificou `FinancialEvolutionPanel.test.tsx` com 561 linhas e nove contratos exclusivos do seletor; o componente de produção possui 51 linhas e já está coeso.
- contratos do seletor foram movidos para `FinancialPeriodSelector.test.tsx`, sem alterar expectativas ou acoplar os testes à configuração interna.
- suíte do painel reduzida para 405 linhas; nova suíte focada com 133 linhas.
- validação dirigida após refatoração: 3 suítes e 24 testes verdes, zero snapshots.
- regressão completa: 94 suítes e 578 testes verdes, zero snapshots.
- ESLint global, type-check e build Next.js 16.3.3 com Turbopack verdes; todas as rotas e o Proxy preservados.
- componente, design system, domain, application, infrastructure, Supabase e contratos financeiros permaneceram inalterados.
- `next-env.d.ts` restaurado ao conteúdo versionado após o build.
- nenhum período novo, migration, RPC, RLS, dado, dependência, configuração remota, commit, push, alteração da PR, merge, deploy ou promoção foi executado.
- anexos privados, `rewrite-msgs.sh` e os dois stashes permaneceram intocados.
- `REFACTORING_IN_PROGRESS` encerrado com retorno estável a `IMPLEMENTATION_IN_PROGRESS` em GREEN; próximo comando válido: `dia 6` da `UX-CHART-003A`.

## Gate do Dia 6 — UX-CHART-003A

- contexto central e workflow do Dia 6 consultados; declaração operacional aprovada antes da implementação.
- skill `vercel:agent-browser` aplicada para validação autenticada do dashboard em navegador real.
- inspeção inicial em 320 px encontrou `scrollWidth` de 388 px para 273 px disponíveis, deixando o período ativo `Mês` fora da área visível.
- primeiro RED introduziu rótulos compactos responsivos e espaçamento seguro; a validação real revelou precedência do `px-4` base do `Button`, levando a um segundo RED para padding explícito.
- estado final em 320 px: cinco opções integralmente visíveis, `clientWidth = scrollWidth = 273`, alvos de 44 px, anel ativo íntegro e nenhum overflow horizontal global.
- em 768 e 1280 px, rótulos completos, alvos de 44 px e ausência de overflow foram confirmados.
- navegação por Tab exibiu foco visível; seleção de `7D` atualizou a URL para `?period=rolling_7_days` e manteve `aria-pressed` coerente.
- `lang="pt-BR"`, viewport, manifesto, cores de tema e experiência standalone permaneceram válidos; console sem erros ou avisos.
- suíte do seletor: 11 testes verdes; regressão completa final: 94 suítes e 579 testes verdes, zero snapshots.
- ESLint global, type-check e build Next.js 16.3.3 com Turbopack verdes; todas as rotas e o Proxy preservados.
- nenhuma migration, RPC, RLS, dado, dependência, configuração remota, commit, push, alteração da PR `#27`, merge, deploy ou promoção foi executado.
- `next-env.d.ts` restaurado; anexos privados, `rewrite-msgs.sh` e os dois stashes preservados fora do escopo.
- estado de saída: `QUALITY_VALIDATION` em GREEN; próximo comando válido: `dia 7` da `UX-CHART-003A`.

## Gate do Dia 7 — UX-CHART-003A

- contexto central e workflow do Dia 7 consultados; declaração operacional aprovada antes da execução.
- regressão completa: 94 suítes e 579 testes verdes, zero snapshots.
- ESLint global sem avisos, type-check e build Next.js 16.3.3 com Turbopack verdes; todas as rotas e o Proxy preservados.
- auditoria npm encontrou zero vulnerabilidades; 701 assinaturas de registro e 102 attestations verificadas.
- revisão estática confirmou seletor Server Component, valores GET em allowlist, fallback seguro, ausência de Supabase na presentation e nenhum segredo privilegiado rastreado.
- projeto Supabase `ACTIVE_HEALTHY`; três tabelas públicas com RLS e seis migrations locais/remotas alinhadas.
- Security Advisor manteve somente `SEC-AUTH-001`; Performance Advisor trouxe um índice de contas sem uso como informação.
- Preview `dpl_6G1AWR6qK11d6c9RyYSeUyPd4PZV` da PR `#27`, no commit `d40529b`, está `READY`; `/dashboard` respondeu HTTP 200 e redirecionou corretamente a requisição sem sessão para login.
- CSP, HSTS, proteção contra frames, Permissions Policy, `noindex` e manifesto foram confirmados na resposta real.
- não houve cluster de runtime error nem log `error/fatal` no deployment nas últimas 24 horas.
- PR `#27` aberta, não draft, `CLEAN` e mergeável, com Quality Gates e Vercel verdes; nenhum comentário de toolbar pendente.
- vínculo local antigo permanece em `CI-VERCEL-002`; plano Hobby sem drains mantém `HARD-OBS-001` como bloqueio de produção pública.
- nenhuma migration, RLS, dado, dependência, configuração remota, commit, push, alteração da PR, merge, deploy ou promoção foi executado.
- `next-env.d.ts` restaurado; anexos privados, `rewrite-msgs.sh` e os dois stashes preservados fora do escopo.
- estado de saída: `READY_FOR_RELEASE`; próximo passo: versionar o Dia 7 e atualizar a PR `#27`.

## Gate do Dia 1 — UX-CHART-003B

- contexto central e workflow do Dia 1 consultados; declaração operacional aprovada antes da execução.
- `UX-CHART-003A` confirmada como squash merge `7434159` em `origin/develop`; branch `codex/ux-chart-003b-periodos-historicos` criada sobre essa base.
- semântica aprovada: `three_months` cobre o mês da referência e os dois anteriores com buckets semanais civis; `year` cobre o ano civil com doze buckets mensais.
- intervalos e buckets são semiabertos, consecutivos, recortados ao período e preservam saldo em buckets vazios.
- arquitetura mantém a RPC diária e seu limite de 31 dias; a futura `load_financial_evolution_buckets(date, date, text)` retorna somente OHLC e totais agregados.
- contrato da RPC exige invoker, search path vazio, identidade permanente, ausência de `user_id`, allowlist `week`/`month`, máximo de 366 dias/60 buckets e execução somente por `authenticated`.
- Supabase `fin_control` confirmado `ACTIVE_HEALTHY` em Postgres 17.6.1; RLS habilitada e forçada nas tabelas financeiras, seis migrations alinhadas e ACL da RPC atual restrita a `authenticated`.
- índice existente `(user_id, occurred_on desc, created_at desc, id desc)` foi confirmado; nenhum índice novo foi aprovado antes de `EXPLAIN (ANALYZE, BUFFERS)`.
- Security Advisor manteve somente `SEC-AUTH-001`; Performance Advisor manteve informação sobre índice de contas sem uso, sem relação causal com a `003B`.
- baseline dirigida: 4 suítes, 45 testes verdes e zero snapshots, cobrindo resolução de período, caso de uso, seletor e rota financeira.
- `docs/ux-chart-003b-discovery.md`, ADR 0020, backlog, roadmap e contexto central compõem os artefatos do Dia 1.
- nenhuma implementação, teste, migration, RPC, dado remoto, dependência, commit, push, PR, merge, deploy ou promoção foi executado.
- estado de saída: `ARCHITECTURE_READY`; próximo comando válido: `dia 2` da `UX-CHART-003B`.

## Gate do Dia 2 — UX-CHART-003B

- contexto central e workflow do Dia 2 consultados; declaração operacional aprovada antes da execução.
- baseline dirigida anterior ao RED: 7 suítes, 69 testes verdes e zero snapshots.
- 7 suítes RED selecionadas falharam como planejado; 6 carregaram 70 testes, com 42 verdes e 28 falhas esperadas.
- a suíte futura do mapper contém 18 contratos e parou no import deliberadamente ausente.
- os testes cobrem domínio, application, repository, mapper, apresentação, URL e composição autenticada.
- três arquivos pgTAP adicionam 16 assertions de schema/grants, 22 de comportamento/RLS e 5 de performance, total 43.
- probe pgTAP remoto confirmou 2/2 falhas pela função inexistente; rollback verificado com `pgtap` e função ainda ausentes.
- ESLint passou em todos os 7 arquivos Jest afetados.
- type-check contém somente um `TS2307`, correspondente ao mapper futuro; nenhum ruído acidental permaneceu.
- nenhuma implementação funcional, migration aplicada, RPC, policy, grant, índice, dado remoto, dependência ou configuração foi alterada.
- nenhum commit, push, PR, merge, deploy ou promoção foi executado; artefatos privados e stashes foram preservados.
- estado de saída: `TEST_STRATEGY_READY`; próximo comando válido: `dia 3` da `UX-CHART-003B`.

## Gate do Dia 3 — UX-CHART-003B

- contexto central e workflow do Dia 3 consultados; declaração operacional aprovada antes da implementação e da migration.
- contratos RED foram convertidos em GREEN sem relaxar expectativas: 7 suítes direcionadas e 88 testes passaram, zero snapshots.
- regressão completa: 95 suítes e 609 testes verdes, zero snapshots.
- ESLint global, type-check e build Next.js 16.3.3 com Turbopack passaram; todas as rotas e o Proxy foram preservados.
- domínio resolve `3M` civil com semanas e `Ano` civil com meses; períodos curtos continuam usando a RPC diária limitada a 31 dias.
- application, port, mapper, repository, seletor e rotas mantêm as fronteiras Feature-Based/Clean e não expõem Supabase à presentation.
- migration `20260907041839_create_financial_evolution_buckets` aplicada e alinhada como a sétima migration local/remota.
- pgTAP passou 16 assertions de schema/grants, 22 de comportamento/RLS/OHLC e 5 de performance, total 43.
- RPC pós-DDL confirmada como invoker, `search_path = ''`, projeção agregada, ACL somente para `authenticated` e sem `pgtap` persistido.
- Security Advisor manteve somente `SEC-AUTH-001`; Performance Advisor manteve apenas a informação preexistente de índice de contas sem uso.
- nenhum índice novo, tabela, policy, dado, dependência ou segredo foi criado.
- `next-env.d.ts` restaurado; anexos privados, `rewrite-msgs.sh` e os dois stashes preservados.
- nenhum commit, push, PR, merge, deploy ou promoção foi executado.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS` em GREEN; próximo comando válido: `dia 4` da `UX-CHART-003B`.

## Gate do Dia 4 — UX-CHART-003B

- contexto central e workflow do Dia 4 consultados; declaração operacional aprovada antes da execução.
- RED dirigido: 6 suítes, 59 testes, 52 verdes e 7 falhas esperadas para copy/granularidade, nomes acessíveis e limites agregados.
- GREEN dirigido: 6 suítes e 59 testes verdes; feature completa: 32 suítes e 286 testes verdes; zero snapshots.
- regressão completa: 95 suítes e 617 testes verdes, zero snapshots.
- painel, alternador, gráficos e tabelas apresentam dia/semana/mês conforme `FinancialPeriod.bucketGranularity`.
- application rejeita cobertura agregada divergente no início ou fim e mantém erro público sanitizado.
- estado anual vazio mantém os buckets e saldos disponíveis, sem movimentos fabricados.
- revisão Next.js/React preservou Server Component, serialização mínima, props primitivas e ausência de efeitos/memoização supérfluos.
- ESLint global, type-check, build Next.js 16.3.3 e `git diff --check` verdes; `next-env.d.ts` restaurado.
- nenhuma migration, RPC, RLS, dado, dependência, commit, push, PR, merge, deploy ou promoção foi executado.
- estado de saída: `IMPLEMENTATION_IN_PROGRESS` em GREEN; próximo comando válido: `dia 5` da `UX-CHART-003B`.

## Gate do Dia 5 — UX-CHART-003B

- contexto central e workflow do Dia 5 consultados; declaração operacional aprovada antes da execução.
- inventário documentado: nenhum arquivo de production monolítico justificou reescrita; uma seleção contextual obsoleta e cinco formatadores civis duplicados foram priorizados.
- RED: suíte do switcher executou 8 testes, com 7 verdes e 1 falha esperada pelo diálogo antigo permanecer aberto.
- GREEN dirigido: 5 suítes e 38 testes verdes; feature completa: 32 suítes e 287 testes verdes.
- regressão completa: 95 suítes e 618 testes verdes, zero snapshots.
- estado interativo agora é delimitado por granularidade, início e fim do período, sem `useEffect` de sincronização.
- formatter de presentation único preserva formatos completos e compactos em tabelas, painel e ECharts.
- revisão Next.js/React confirmou fronteira Server/Client, props serializáveis, imports diretos e ausência de rerender ou abstração artificial.
- ESLint global, type-check, build Next.js 16.3.3 e `git diff --check` verdes; `next-env.d.ts` restaurado.
- nenhuma migration, RPC, RLS, dado, dependência, commit, push, PR, merge, deploy ou promoção foi executado.
- estado de saída: retorno estável a `IMPLEMENTATION_IN_PROGRESS` em GREEN; próximo comando válido: `dia 6` da `UX-CHART-003B`.
