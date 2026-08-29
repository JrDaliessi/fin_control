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
