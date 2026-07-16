# Test Strategy — Dia 2

## Objetivo
Definir a estratégia de testes antes da implementação funcional da primeira small release: cadastro manual de transação simples.

## Prioridade por Camada
1. `domain`: validações puras de transação e value objects.
2. `application`: caso de uso `create-transaction.use-case`.
3. `infrastructure`: repositório Supabase apenas quando persistência real for implementada.
4. `presentation`: formulário de transação quando a UI entrar no escopo.

## Matriz de Testes

| Camada | Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- | --- |
| domain | `Transaction` | criar receita/despesa válida; rejeitar descrição vazia; rejeitar valor zero/negativo; rejeitar usuário/conta/categoria ausente | testes criados |
| application | `CreateTransactionUseCase` | validar entrada; persistir via contrato; não persistir entrada inválida; propagar erro de repositório | testes criados |
| infrastructure | `SupabaseTransactionRepository` | mapear dados e respeitar `user_id` | futuro |
| presentation | `TransactionForm` | estados de erro, submit, loading e sucesso | testes criados |

## Cenário Feliz
Usuário autenticado registra uma despesa manual com descrição, valor em centavos, data, conta e categoria. O sistema valida os dados, chama o repositório por contrato e retorna a transação criada.

## Cenários Alternativos
- usuário registra receita em vez de despesa
- repositório falha durante persistência
- descrição contém espaços nas extremidades e deve ser normalizada no Dia 3

## Edge Cases Críticos
- valor zero
- valor negativo
- descrição vazia
- usuário ausente
- conta ausente
- categoria ausente
- data inválida
- tipo de transação inválido

## Critério de Saída do Dia 2
- testes essenciais existem
- testes falham antes da implementação
- implementação funcional permanece bloqueada até Dia 3

## Dia 2 — SR-005 Resumo Mensal Básico

## Objetivo
Definir a estratégia de testes da small release `SR-005 — Resumo mensal básico` antes de implementar o caso de uso de cálculo mensal.

## Prioridade por Camada
1. `domain`: validar `MonthRef` como value object puro.
2. `application`: validar `ListMonthlySummaryUseCase` calculando totais a partir de transações.
3. `infrastructure`: permanece fora do escopo até persistência real com Supabase, auth e RLS.
4. `presentation`: permanece fora do escopo até o caso de uso estar estável.

## Matriz de Testes da SR-005

| Camada | Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- | --- |
| domain | `MonthRef` | criar `YYYY-MM` válido; normalizar espaços; rejeitar formato inválido; rejeitar mês fora de 1-12 | testes criados |
| application | `ListMonthlySummaryUseCase` | calcular receitas, despesas, saldo líquido e quantidade; retornar resumo zerado; rejeitar `monthRef` inválido; rejeitar usuário vazio | testes criados |
| infrastructure | `SupabaseTransactionRepository` | buscar transações por usuário e mês respeitando RLS | futuro |
| presentation | resumo mensal na UI | loading, empty, success e error | futuro |

## Cenário Feliz
Usuário solicita o resumo de `2026-07`. O sistema valida `userId` e `monthRef`, busca transações pelo contrato `TransactionRepository.findByMonth`, soma receitas, soma despesas, calcula saldo líquido e retorna a quantidade de transações consideradas.

## Cenários Alternativos
- mês válido sem transações retorna totais zerados
- transações fora do mês selecionado não entram no cálculo
- `userId` com espaços deve ser normalizado antes de consultar o repositório

## Edge Cases Críticos
- `monthRef` vazio
- `monthRef` fora do formato `YYYY-MM`
- mês `00`
- mês `13`
- `userId` vazio
- valores financeiros permanecem em centavos

## Testes Criados
- `src/features/transactions/tests/month-ref.test.ts`
- `src/features/transactions/tests/list-monthly-summary.use-case.test.ts`

## Resultado Esperado do TDD
- `npm run test:ci` deve falhar porque `MonthRef` e `ListMonthlySummaryUseCase` ainda não existem.
- `npm run type-check` deve falhar pelo mesmo motivo enquanto a implementação mínima não for criada.
- implementação funcional permanece bloqueada até o Dia 3.

## Resultado Observado do Dia 2
- `npm run test:ci -- src/features/transactions/tests/month-ref.test.ts src/features/transactions/tests/list-monthly-summary.use-case.test.ts`: falhou com 2 suites por módulos ausentes.
- `npm run type-check`: falhou com `TS2307` para `../domain/value-objects/month-ref` e `../application/use-cases/list-monthly-summary.use-case`.
- A falha é esperada e válida para a etapa vermelha do TDD.

## Resultado Observado do Dia 3
- `MonthRef` implementado em `src/features/transactions/domain/value-objects/month-ref.ts`.
- `ListMonthlySummaryUseCase` implementado em `src/features/transactions/application/use-cases/list-monthly-summary.use-case.ts`.
- `npm run test:ci -- src/features/transactions/tests/month-ref.test.ts src/features/transactions/tests/list-monthly-summary.use-case.test.ts`: passou, 2 suites e 12 testes.
- `npm run test:ci`: passou, 7 suites e 44 testes.
- `npm run type-check`: passou.
- `npm run lint`: passou.
- `npm run build`: passou.

## Resultado Observado do Dia 4
- `MonthlySummaryPanel` criado para expor o resumo mensal na apresentação.
- `list-session-monthly-summary.use-case.ts` criado como adapter local de sessão sobre o `ListMonthlySummaryUseCase`.
- `TransactionsPage` passou a exibir o resumo mensal sem Supabase e sem persistência real.
- `TransactionsPage.test.tsx` cobre empty state e resumo com receitas, despesas, saldo líquido e quantidade.
- `npm run test:ci -- src/features/transactions/tests/TransactionsPage.test.tsx`: passou, 1 suite e 2 testes.
- `npm run test:ci`: passou, 7 suites e 45 testes.
- `npm run type-check`: passou.
- `npm run lint`: passou.
- `npm run build`: passou.

## Resultado Observado do Dia 5
- `TransactionsPage.tsx` reduziu de 165 para 64 linhas.
- `useSessionMonthlySummary.ts` passou a concentrar o estado visual do resumo mensal.
- `TransactionSessionList.tsx` passou a concentrar a lista local da sessão.
- `formatCents.ts` removeu duplicação de formatação monetária na apresentação.
- `npm run test:ci -- src/features/transactions/tests/TransactionsPage.test.tsx`: passou, 1 suite e 2 testes.
- `npm run test:ci`: passou, 7 suites e 45 testes.
- `npm run type-check`: passou.
- `npm run lint`: passou.
- `npm run build`: passou.

## Resultado Observado do Dia 6
- Testes de apresentação passaram a validar controle segmentado com radios nativos para o tipo da transação.
- Testes de página passaram a validar `aria-live` nas regiões de resumo mensal e lançamentos da sessão.
- Testes de resumo passaram a validar métricas com `role="group"` e nomes acessíveis contendo rótulo e valor.
- Teste de PWA `tests/pwa-manifest.test.ts` passou a validar metadados instaláveis e shortcut de registro manual.
- Etapa vermelha: `npm run test:ci -- src/features/transactions/tests/TransactionForm.test.tsx src/features/transactions/tests/TransactionsPage.test.tsx tests/pwa-manifest.test.ts` falhou antes da implementação por ausência dos contratos de acessibilidade/PWA.
- Etapa verde: o mesmo comando passou com 3 suites e 16 testes.
- Suíte completa: `npm run test:ci` passou com 8 suites e 46 testes.
- `npm run type-check`, `npm run lint`, `npm audit` e `npm run build` passaram.

## Dia 2 — SR-006 Dashboard Financeiro Inicial

## Objetivo
Definir a estratégia de testes da small release `SR-006 — Dashboard financeiro inicial` antes da implementação do caso de uso e da apresentação.

## Prioridade por Camada
1. `domain`: reutilizar entidades e value objects já cobertos em `transactions`; nenhum tipo de domínio novo será criado nesta SR.
2. `application`: validar `GetDashboardSummaryUseCase` como orquestrador do resumo mensal e das transações recentes.
3. `presentation`: validar heading, empty state, call-to-action e landmark principal do dashboard.
4. `infrastructure`: permanece fora do escopo enquanto os dados forem locais de sessão.

## Matriz de Testes da SR-006

| Camada | Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- | --- |
| domain | tipos existentes de `transactions` | valores financeiros, transações e referência mensal já cobertos pelas suítes existentes | reutilizado; sem novo teste necessário |
| application | `GetDashboardSummaryUseCase` | resumo mensal; limite e ordenação das recentes; lista vazia; usuário e mês inválidos; filtro mensal; recentes entre meses | 8 testes criados |
| presentation | `DashboardPage` | heading; empty state; CTA para `/transactions`; landmark `main` | 4 testes criados |
| infrastructure | persistência do dashboard | acesso por repositório e isolamento por usuário | futuro; fora do escopo da SR-006 |

## Cenário Feliz
Usuário visualiza o dashboard de `2026-07`. O sistema reutiliza o resumo mensal existente e retorna, em ordem decrescente de data, até cinco transações recentes da sessão.

## Cenários Alternativos
- sessão sem transações retorna resumo zerado, lista vazia e empty state com CTA
- transações fora do mês não entram no resumo, mas podem aparecer na lista de recentes
- mais de cinco transações são limitadas às cinco mais recentes

## Edge Cases Críticos
- `userId` vazio ou composto apenas por espaços
- `monthRef` inválido
- transações fora do mês selecionado
- ordenação de transações recebidas fora de ordem
- ausência total de transações

## Testes Criados
- `src/features/dashboard/tests/get-dashboard-summary.use-case.test.ts`
- `src/features/dashboard/tests/DashboardPage.test.tsx`

## Resultado Observado do Dia 2
- O commit `0952a70` contém os dois arquivos de teste e não contém arquivos de implementação em `src/features/dashboard/application` ou `src/features/dashboard/presentation`.
- Nesse estado, `npm run test:ci -- src/features/dashboard/tests` falhou com `Cannot find module`, registrando a etapa vermelha esperada do TDD.
- As 8 suítes e os 46 testes anteriores permaneceram verdes.
- Implementação funcional permanece reservada ao Dia 3.

## Resultado Observado do Dia 3 — SR-006
- Os três arquivos parciais existentes foram revisados antes de serem incorporados ao escopo da fase.
- Um novo cenário crítico verificou que transações recentes pertencem apenas ao usuário solicitado.
- Etapa vermelha: o teste recebeu duas transações quando esperava uma, expondo uma transação de outro usuário.
- Etapa verde: `GetDashboardSummaryUseCase` passou a filtrar pelo `userId` normalizado.
- O adapter de repositório duplicado foi removido de `dashboard`; o resumo passou a reutilizar `listSessionMonthlySummary`.
- Testes do dashboard passaram com 2 suites e 13 testes.
- Suíte completa passou com 10 suites e 59 testes.
- Os testes novos foram alinhados ao padrão de imports de `@jest/globals` após o type-check detectar globais implícitos.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.

## Resultado Observado do Dia 4 — SR-006
- Testes de `DashboardPage` passaram a cobrir loading, empty state, success com resumo e recentes, error e CTA.
- `TransactionSessionProvider.test.tsx` cobre estado inicial e adição de transação à sessão em memória.
- `DashboardRoutes.test.tsx` cobre a composição de `/`, `/dashboard` e `/transactions`.
- `TransactionsPage.test.tsx` passou a renderizar sob o provider e validar o link de retorno ao dashboard.
- Etapa vermelha: 4 suites falharam porque provider e rotas ainda não existiam.
- Etapa verde direcionada: 5 suites e 21 testes passaram.
- Suíte completa: 12 suites e 65 testes passaram.
- O lint detectou `setState` síncrono dentro do efeito do dashboard; a correção passou a derivar loading pela requisição ativa.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.

## Resultado Observado do Dia 5 — SR-006
- `resolve-session-month-ref.test.ts` cobre seleção da transação mais recente fora de ordem e fallback para sessão vazia.
- `month-ref-formatter.test.ts` cobre a formatação compartilhada de competência mensal.
- `TransactionSessionProvider.test.tsx` passou a reproduzir mutação externa do objeto submetido.
- Etapa vermelha: dois módulos estavam ausentes e o provider expôs `Descrição alterada externamente` no lugar de `Mercado`.
- Etapa verde: provider clona entradas, contratos de leitura são readonly e hooks reutilizam a mesma resolução de competência.
- Recorte direcionado passou com 7 suites e 25 testes.
- Suíte completa passou com 14 suites e 69 testes.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.

## Dia 2 — SR-007 Cadastro Local de Conta Financeira

## Objetivo
Transformar as invariantes e o contrato aprovados no Dia 1 em testes executáveis antes de criar `FinancialAccount`, `AccountRepository` ou `CreateAccountUseCase`.

## Prioridade por Camada
1. `domain`: validar criação, normalização, tipos, moeda e saldo inicial.
2. `application`: validar a orquestração de `AccountRepository.create`.
3. `infrastructure`: fora do escopo até autenticação e RLS nas SR-008 e SR-009.
4. `presentation`: adiada até o caso de uso ficar estável e a expansão ser aprovada no Dia 4.

## Matriz de Testes da SR-007

| Camada | Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- | --- |
| domain | `FinancialAccount` | saldos positivo, zero e negativo; cinco tipos válidos; normalização; moeda padrão; entradas inválidas | testes criados |
| application | `CreateAccountUseCase` | validar e enviar ao repositório; não chamar com entrada inválida; propagar falha do repositório | testes criados |
| infrastructure | `SupabaseAccountRepository` | persistência e isolamento por usuário | futuro; bloqueado até SR-009 |
| presentation | formulário e sessão local | idle, submitting, success, error e explicação do saldo negativo | futuro; não aplicável ao Dia 2 |

## Cenário Feliz
O usuário informa uma conta corrente em BRL com nome e saldo inicial em centavos. O domínio normaliza e valida os dados; o caso de uso chama `AccountRepository.create` uma única vez e retorna a conta fornecida pelo contrato.

## Cenários Alternativos
- saldo inicial igual a zero
- saldo inicial negativo para representar a situação informada
- conta dos tipos poupança, dinheiro, pagamento ou investimento
- moeda omitida assume `BRL`
- repositório falha e o caso de uso preserva o erro

## Edge Cases Críticos
- usuário ou nome vazio
- nome normalizado acima de 80 caracteres
- tipo não suportado
- moeda diferente de `BRL`
- saldo fracionário, `NaN`, infinito ou fora do intervalo seguro
- repositório chamado diante de entidade inválida

## Testes Criados
- `src/features/accounts/tests/financial-account.entity.test.ts`
- `src/features/accounts/tests/create-account.use-case.test.ts`

## Resultado Esperado do TDD
- os testes direcionados devem falhar com `Cannot find module` porque os três módulos funcionais ainda não existem
- a suíte anterior deve permanecer verde quando executada sem `src/features/accounts/tests`
- implementação funcional permanece bloqueada até o Dia 3

## Resultado Observado do Dia 2 — SR-007
- `npm run test:ci -- src/features/accounts/tests`: falhou com 2 suítes por ausência de `FinancialAccount`, `AccountRepository` e `CreateAccountUseCase`.
- `npx jest --runInBand --testPathIgnorePatterns=src/features/accounts/tests`: passou com 14 suítes e 69 testes anteriores.
- `npm run type-check`: falhou com quatro erros `TS2307` para os módulos deliberadamente ausentes.
- `npm run lint`: passou sem warnings.
- `npm audit --omit=dev`: passou com 0 vulnerabilidades.
- Estado vermelho confirmado; implementação funcional permanece reservada ao Dia 3.

## Resultado Observado do Dia 3 — SR-007
- `FinancialAccount` implementado com as invariantes definidas no Dia 1.
- `AccountRepository` implementado como contrato de domínio, sem infraestrutura concreta.
- `CreateAccountUseCase` implementado com injeção do contrato.
- `npm run test:ci -- src/features/accounts/tests`: passou com 2 suítes e 21 testes.
- `npm run test:ci`: passou com 16 suítes e 90 testes.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.
- Apresentação, sessão local, Supabase e integração com transações permanecem fora do Dia 3.

## Resultado Observado do Dia 4 — SR-007
- Testes de formulário cobrem parsing em reais, submitting, success, erro local e erro do fluxo.
- Testes do provider cobrem estado inicial e criação validada em memória.
- Testes da página cobrem landmark, empty state, navegação e listagem com saldo negativo.
- Teste da rota cobre `/accounts`; teste do dashboard cobre o link `Contas`.
- Etapa vermelha: quatro módulos/rota ausentes e link do dashboard inexistente.
- Etapa verde direcionada: 7 suítes e 35 testes passaram.
- Suíte completa: 20 suítes e 99 testes passaram.
- Type-check detectou inferência incorreta de argumentos no mock assíncrono; a tipagem foi explicitada sem alterar comportamento.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.

## Resultado Observado do Dia 5 — SR-007
- `parseCurrencyToCents.test.ts` cobre formatos decimal/brasileiro, zero, negativos opt-in e entradas inválidas.
- `AccountSessionProvider.test.tsx` reproduziu mutação externa da conta inicial e da conta retornada.
- Etapa vermelha: parser ausente e duas referências externas alterando o estado visível.
- Etapa verde: parser compartilhado criado; contas armazenadas são cópias congeladas.
- Wrappers de `accounts` e `transactions` preservam políticas diferentes para saldo negativo.
- Recorte direcionado passou com 4 suítes e 28 testes.
- Suíte completa passou com 21 suítes e 109 testes.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.

## Dia 2 — SR-008 Autenticação e Sessão Protegida

## Objetivo
Transformar o ADR 0003, os contratos de autenticação e o threat model em testes executáveis antes de criar qualquer implementação funcional.

## Prioridade por Camada
1. `domain`: identidade autenticada mínima, normalizada e válida.
2. `application`: login, logout, usuário atual e política pura de rotas.
3. `infrastructure`: mapping do Supabase Auth, claims verificadas e propagação de cookies no Proxy.
4. `presentation`: formulário, feedback e redirecionamento permanecem planejados para a expansão controlada após estabilidade dos casos de uso.

## Matriz de Testes da SR-008

| Camada | Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- | --- |
| domain | `AuthUser` | normalizar ID/e-mail; rejeitar ID vazio, e-mail vazio e e-mail inválido | 4 testes criados |
| application | `SignInUseCase` | normalização; senha preservada; entradas inválidas; erro genérico sem enumeração | 5 testes criados |
| application | `SignOutUseCase` | logout da sessão corrente; falha controlada | 2 testes criados |
| application | `GetCurrentUserUseCase` | identidade verificada presente ou ausente | 2 testes criados |
| application | `resolveAuthRoute` | login público; usuário autenticado no login; quatro rotas privadas; acesso privado autenticado | 7 testes criados |
| infrastructure | `SupabaseAuthGateway` | login mapeado; claims válidas; claims ausentes/expiradas; logout local | 5 testes criados |
| infrastructure | `updateSupabaseSession` | claims válidas; cookie renovado; claims ausentes/expiradas; redirecionamento do login | 4 testes criados |
| presentation | login/logout | labels, loading, erro genérico, sucesso e foco | futuro; reservado à expansão controlada |

Total planejado no Dia 2: 7 suítes e 29 testes.

## Cenário Feliz
Usuário existente informa e-mail e senha válidos. O caso de uso normaliza apenas o e-mail, preserva a senha, autentica pelo contrato, recebe uma identidade válida e a sessão verificada permite acesso às rotas privadas. Cookies renovados são propagados para a resposta.

## Cenários Alternativos
- usuário sem sessão abre `/login`
- usuário autenticado abre `/login` e é redirecionado para `/dashboard`
- logout encerra somente a sessão corrente
- ausência de identidade verificada retorna `null`
- publishable key e URL são fornecidas ao adapter por configuração, sem chave privilegiada

## Edge Cases Críticos
- ID, e-mail ou senha vazios
- e-mail inválido ou com caixa/espaços inconsistentes
- senha contendo espaços intencionais não pode ser alterada
- erro do provedor não pode revelar existência do usuário
- claims ausentes, inválidas ou expiradas
- cookie renovado deve chegar à resposta
- usuário anônimo não acessa `/`, `/dashboard`, `/accounts` ou `/transactions`
- usuário autenticado não permanece na tela de login
- logout deve usar escopo local nesta primeira versão

## Fixtures
- identidades e credenciais exclusivamente demonstrativas em `src/features/auth/tests/fixtures/auth.fixtures.ts`
- nenhuma credencial real, token ou segredo foi usado

## Testes Criados
- `src/features/auth/tests/auth-user.entity.test.ts`
- `src/features/auth/tests/sign-in.use-case.test.ts`
- `src/features/auth/tests/sign-out.use-case.test.ts`
- `src/features/auth/tests/get-current-user.use-case.test.ts`
- `src/features/auth/tests/auth-route-policy.test.ts`
- `src/features/auth/tests/supabase-auth.gateway.test.ts`
- `src/features/auth/tests/supabase-proxy.test.ts`

## Resultado Observado do Dia 2 — SR-008
- primeira execução expôs um problema no próprio teste do Proxy: `jsdom` não fornecia `Request`
- o teste do Proxy foi isolado com `@jest-environment node`, sem criar código funcional
- etapa vermelha válida: 7 suítes falharam exclusivamente por módulos deliberadamente ausentes
- `npm run type-check` falhou somente com `TS2307` para os mesmos módulos ausentes
- a rede anterior passou com 21 suítes e 110 testes
- `npm run lint` passou sem warnings
- `npm audit --omit=dev` passou com 0 vulnerabilidades

## Implementação Bloqueada até o Dia 3
- `src/features/auth/domain/entities/auth-user.entity.ts`
- `src/features/auth/domain/interfaces/auth.gateway.ts`
- `src/features/auth/application/use-cases/sign-in.use-case.ts`
- `src/features/auth/application/use-cases/sign-out.use-case.ts`
- `src/features/auth/application/use-cases/get-current-user.use-case.ts`
- `src/features/auth/application/policies/auth-route-policy.ts`
- `src/features/auth/infrastructure/supabase/supabase-auth.gateway.ts`
- `src/lib/supabase/proxy.ts`

Nenhum formulário, rota, route group, migration ou política RLS pode ser criado no Dia 2.

## Resultado Observado do Dia 3 — SR-008
- `AuthUser`, `AuthGateway`, três casos de uso, política de rotas, gateway Supabase e adapter de Proxy foram implementados.
- `SignInUseCase` normaliza o e-mail, preserva a senha e converte falhas do provedor em erro genérico.
- `SupabaseAuthGateway` usa `getClaims()` para identidade verificada e logout com escopo `local`.
- `updateSupabaseSession` propaga cookies e headers anti-cache fornecidos por `@supabase/ssr`.
- O primeiro type-check revelou que `setAll` do pacote 0.12 usa `Record<string,string>` para headers; produção e teste foram alinhados sem `any`.
- Teste de regressão reproduziu `x-middleware-next: 1` sendo copiado indevidamente para redirects; o adapter passou a copiar somente cookies e headers de sessão fornecidos pelo Supabase.
- Suítes direcionadas: 7 suítes e 29 testes passaram.
- Suíte completa: 28 suítes e 139 testes passaram.
- `npm run type-check`, `npm run lint`, `npm audit --omit=dev` e `npm run build` passaram.
- Gates finais foram executados sequencialmente porque build e type-check paralelos disputaram temporariamente `.next/types`.
- Nenhuma UI, rota `/login`, route group, migration, tabela financeira ou política RLS foi criada.
- A composição do Proxy e das rotas públicas/privadas permanece reservada à expansão controlada do Dia 4.

## Resultado Observado do Dia 4 — SR-008
- Testes foram criados antes da apresentação para `LoginPage`, `SignOutButton`, `AuthSessionProvider`, route groups e convenção do Proxy.
- Etapa vermelha válida: 6 suítes falharam por componentes, provider, route groups e Proxy ainda inexistentes.
- Login cobre renderização acessível, loading com bloqueio de duplicidade, sucesso e erro genérico sem enumeração.
- Logout cobre progresso, sucesso, falha controlada e possibilidade de nova tentativa.
- Contexto de sessão cobre disponibilização da identidade verificada à apresentação privada.
- Teste de convenção cobre a função e o matcher de `src/proxy.ts`.
- Etapa verde direcionada: 9 suítes e 22 testes passaram.
- Suíte completa: 32 suítes e 146 testes passaram.
- `npm run type-check`, `npm run lint`, `npm audit --audit-level=high` e `npm run build` passaram.
- O cache obsoleto `.next/dev/types` foi removido após a migração das rotas; os tipos foram regenerados antes da validação final.
- O primeiro `proxy.ts` foi criado na raiz e não apareceu na saída do build; após registro do erro, foi movido para `src/proxy.ts` e o build passou a declarar `ƒ Proxy (Middleware)`.
- A inspeção visual foi tentada novamente em 2026-07-13; o navegador integrado bloqueou `localhost` e `127.0.0.1` antes do carregamento, sem navegador alternativo disponível. Testes de apresentação, revisão semântica e build foram mantidos como evidências.

## Correção TDD — BUG-001 URL inválida do Supabase

- Incidente: `createServerClient` lançou `Invalid supabaseUrl` no Proxy e impediu a abertura do app.
- RED: dois testes reproduziram a falha de inicialização em uma rota privada e em `/login`; ambos falharam pela exceção não tratada.
- GREEN: o Proxy passou a tratar falhas de configuração, inicialização e claims como sessão não autenticada.
- Segurança esperada: rota privada redireciona para `/login`; `/login` continua acessível; nenhuma configuração sensível é registrada.
- Teste direcionado: 1 suíte e 6 testes passaram.
- Rede completa: 32 suítes e 148 testes passaram.

## Resultado Observado do Dia 5 — SR-008

- Auditoria detectou três implementações divergentes para URL e chave pública do Supabase.
- Testes foram criados antes do módulo compartilhado e da ampliação do matcher.
- RED: `supabase-public-config.test.ts` falhou por módulo ausente; `root-proxy.test.ts` falhou pelo matcher antigo.
- GREEN: configuração prefere publishable key, mantém fallback anon, normaliza URL e rejeita valor malformado sem expô-lo.
- Testes direcionados: 3 suítes e 11 testes.
- Rede completa: 33 suítes e 152 testes.
- Lint, type-check, audit e build passaram.
- Validação externa concluída: URL e publishable key válidas; endpoint público do Supabase Auth respondeu `200`.

## Dia 2 — SR-009 Persistência e RLS de Contas

## Objetivo
Transformar o ADR 0004, os contratos persistentes e o threat model em testes executáveis antes de criar migration, repository ou composição funcional.

## Matriz de Testes da SR-009

| Camada | Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- | --- |
| domain | `FinancialAccount.restore` | preservar ID e timestamps; reaplicar invariantes já existentes | 2 testes criados em RED |
| application | `ListAccountsUseCase` | normalizar ator; lista com dados; lista vazia; ator ausente; falha do repository | 4 testes criados em RED |
| infrastructure | mapper | row `snake_case` para domínio; entidade nova para payload exato de insert | 2 testes criados em RED |
| infrastructure | `SupabaseAccountRepository` | create; filtro por owner; ordem `created_at/id desc`; erro sanitizado | 4 testes criados em RED |
| composition | `createAccountAction` | claims revalidadas; owner forjado ignorado; fail-closed; usuário anônimo bloqueado | 5 cenários criados em RED |
| database | schema/grants | tabela, colunas, constraints, FK, índice, RLS, policies, privilégios e Realtime | 38 testes pgTAP criados |
| database | constraints | saldos, nome, tipo, moeda, FK, defaults e nomes duplicados | 13 testes pgTAP criados |
| database | RLS | usuário A/B, `anon`, usuário anônimo, owner forjado, update/delete negados | 17 testes pgTAP criados |

## Cenário Feliz
Um usuário permanente com claims verificadas cria uma conta própria. A composição injeta o `sub` verificado, o repository insere somente os campos permitidos, o banco aceita a linha por grant e `WITH CHECK`, e a conta retorna reidratada com ID e timestamps. Na listagem, somente contas do mesmo ator são retornadas em ordem determinística.

## Cenários Alternativos
- saldo inicial positivo, zero ou negativo dentro do intervalo seguro
- lista sem contas retorna coleção vazia
- nomes duplicados são aceitos
- erros do provedor são convertidos para mensagem estável sem detalhes internos

## Edge Cases Críticos
- owner forjado no payload do navegador
- claims ausentes, inválidas ou de usuário anônimo
- usuário A tentando ler ou criar linha de B
- papel `anon` tentando selecionar ou inserir
- `UPDATE` e `DELETE` sem grants
- nome vazio, não aparado ou acima de 80 caracteres
- tipo ou moeda inválidos
- saldo fora do intervalo seguro do JavaScript
- conta vinculada a usuário Auth inexistente
- policy permissiva adicional ou publicação Realtime acidental

## Resultado Observado do Dia 2
- Jest direcionado: 5 suítes em RED; `FinancialAccount.restore` ausente e quatro módulos não encontrados, sem falha funcional inesperada.
- Type-check: somente seis referências ausentes planejadas.
- Rede anterior: 32 suítes e 135 testes verdes ao excluir apenas os testes RED da SR-009.
- Lint: verde, 0 warnings.
- Audit de produção: 0 vulnerabilidades.
- Supabase MCP: suíte estrutural executada em `BEGIN/ROLLBACK`; 34 de 38 testes falharam pela ausência da tabela.
- Pós-rollback: nenhuma tabela pública, migration ou instalação persistente de `pgtap`.

## Implementação Bloqueada até o Dia 3
- domínio persistente, contrato `listByUser` e caso de uso de listagem
- mapper e repository Supabase
- Server Action/composição persistente
- migration de `financial_accounts`, grants e RLS

Estado de saída: `TEST_STRATEGY_READY`.

## Matriz Planejada — Trilha FinControl Pulse

Esta matriz orienta os futuros Dias 2 de `UI-001` a `UI-006`. Nenhum teste ou código funcional foi antecipado nesta incorporação de escopo.

| Item | Prioridade de teste | Cenários essenciais |
| --- | --- | --- |
| UI-001 | tokens/tema/primitives | tema claro, escuro e automático; SSR sem flash relevante; contraste; foco; movimento reduzido |
| UI-002 | shell/navegação | rota ativa; somente rotas disponíveis; teclado; logout; sidebar/tablet/mobile; 44 px; sem overflow |
| UI-003 | dashboard | loading, empty, success, error; dados reais; ausência de projeção sem contrato; copy contextual; grid responsivo |
| UI-004 | contas | cards com campos reais; abrir/fechar drawer; foco contido e restaurado; create/list persistentes; mobile |
| UI-005 | transações | agrupamento; filtros suportados; drawer/bottom sheet; validação; persistência; estados e teclado |
| UI-006 | login/PWA | erro sem enumeração; loading; mostrar senha; install disponível/indisponível; ausência de promessa offline |

### Matriz executada no Dia 2 — UI-001

Os testes foram criados antes do código funcional e a etapa RED foi comprovada em 2026-07-14.

| Camada | Contrato a testar | Cenários mínimos |
| --- | --- | --- |
| Função pura de tema | `resolveTheme(preference, systemPrefersDark)` | light explícito; dark explícito; system claro; system escuro |
| Preferência persistida | allowlist `light | dark | system` | ausência; valor válido; valor malformado; escrita após interação |
| Inicialização | tema resolvido antes da hidratação | atributo dark aplicado; claro sem seletor dark; falha de storage com fallback seguro |
| Provider | sincronização DOM, storage e sistema | mudança manual; mudança de `matchMedia` em system; listener removido; tema explícito ignora sistema |
| ThemeSwitcher | controle acessível | nome acessível; três opções; seleção atual; teclado; área de toque mínima |
| Tokens/Tailwind | contrato semântico | todos os tokens mínimos nos dois temas; mapeamento com alfa; seletor dark correto; ausência de token órfão |
| Geist/branding | metadata e fonte | `FinControl` em metadata/manifest; variável Geist aplicada; fallback definido; sem pacote adicional |
| Button | primitive genérica | variantes aprovadas; disabled; foco visível; tipo previsível |
| Card | superfície genérica | elemento e classes sem semântica financeira embutida |
| FeedbackMessage | anúncio acessível | status com `role=status`; erro com `role=alert`; conteúdo textual |
| Regressão | rotas e formulários existentes | login, contas, dashboard, transações, logout e Proxy preservados |
| Acessibilidade | combinações reais | contraste AA de texto/ação/foco; informação não depende só de cor; redução de movimento |
| PWA | identidade e cores | manifest atualizado; theme/background coerentes; instalabilidade preservada |

Validações de browser para flash de tema, responsividade visual e preferência do sistema complementam Jest no Dia 6; não substituem os testes determinísticos do Dia 2.

Arquivos criados:

- `src/shared/theme/tests/resolveTheme.test.ts`
- `src/shared/theme/tests/ThemeProvider.test.tsx`
- `src/shared/components/ui/tests/ThemeSwitcher.test.tsx`
- `src/shared/components/ui/tests/ui-primitives.test.tsx`
- `tests/design-system-contract.test.ts`

Arquivo alterado:

- `tests/pwa-manifest.test.ts`

Evidência:

- baseline anterior: 36 suítes e 170 testes verdes
- RED direcionado: 6 suítes falharam por módulos e contratos visuais ainda ausentes
- rede anterior após o RED, excluindo apenas os contratos da UI-001: 35 suítes e 168 testes verdes
- lint: passou sem warnings
- type-check: falhou somente com oito `TS2307` planejados
- build: não executado porque a fase preserva o type-check vermelho

Estado de saída: `TEST_STRATEGY_READY`. A implementação permanece bloqueada até `dia 3 da UI-001`.

### Resultado GREEN do Dia 3 — UI-001

- primeira passagem: 23 de 24 testes direcionados verdes
- correção real de contraste: `muted-foreground` claro alterado de `#64748B` para `#5F6F85`
- resultado direcionado final: 6 suítes e 24 testes verdes
- regressão completa: 41 suítes e 192 testes verdes
- type-check, lint, audit de produção e build verdes
- asserção legada de accounts migrou para `text-danger-foreground` sem remover cobertura
- nenhuma expectativa funcional foi enfraquecida
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`

### RED/GREEN do Dia 4 — UI-001

- contrato novo: nenhuma superfície de produção ou ícone PWA pode manter `Controle Financeiro IA`
- cenário de apresentação: o login deve expor o radiogroup acessível `Tema`
- o primeiro alvo no shell foi descartado por violar a fronteira da UI-002; o erro foi documentado e o RED foi reaplicado na superfície correta
- RED corrigido: `LoginPage` falhou exclusivamente pela ausência do seletor
- GREEN direcionado: 3 suítes e 12 testes
- regressão final: 41 suítes e 193 testes
- lint, type-check, audit de produção e build verdes
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`

### Refatoração preservada por testes no Dia 5 — UI-001

- contrato estático novo exige `Button`, `FeedbackMessage` e `Card` nos fluxos selecionados
- RED confirmou que os componentes ainda duplicavam marcação das primitives
- testes de comportamento existentes preservaram labels, eventos, disabled, loading, success, error, `alert` e `status`
- GREEN direcionado: 8 suítes e 43 testes
- regressão completa: 41 suítes e 194 testes
- lint, type-check, audit de produção e build verdes
- nenhum teste funcional foi enfraquecido ou removido
- estado de saída: `IMPLEMENTATION_IN_PROGRESS`

### RED/GREEN do Dia 6 — UI-001

- contratos RED exigiram alvo de toque de 44 px no retorno de transações e nos labels do seletor
- radios permaneceram controles visuais compactos de 16 x 16 px
- metadata passou a ter cores de tema distintas para sistema claro e escuro
- manifest deixou de prometer IA antes da SR-023
- inspeção no navegador revelou HTML servido em `/theme-init.js`; o teste do matcher reproduziu a interceptação antes da correção
- GREEN direcionado inicial: 4 suítes e 14 testes
- teste adicional do Proxy passou após excluir JavaScript público do matcher
- regressão completa: 41 suítes e 194 testes
- lint, type-check, audit e build verdes
- estado de saída: `QUALITY_VALIDATION`

### Gate final do Dia 7 — UI-001

- nenhum teste foi removido, relaxado ou marcado como ignorado
- regressão completa: 41 suítes e 194 testes verdes
- lint e type-check verdes
- audit com 0 vulnerabilidades e build de produção verde
- contratos de tema, manifest, Proxy, primitives e regressão das rotas permaneceram determinísticos
- revisão estática confirmou separação entre `domain`/`application` e infraestrutura
- estado de saída: `READY_FOR_RELEASE`

Regras:

- RED deve preceder qualquer implementação funcional de cada item.
- testes de apresentação não substituem domínio/application para cálculos financeiros.
- snapshot visual isolado não é critério de acessibilidade ou comportamento.
- gráficos futuros exigem testes do view model, alternativa tabular, teclado, tooltip e dados insuficientes.
- copy dinâmica precisa de cenários positivo, atenção, crítico, sem dados e erro, quando aplicável.

## Dia 2 — UI-002 Shell e Navegação Responsiva

## Objetivo

Converter o ADR 0006 e a matriz aprovada de rotas privadas em contratos executáveis antes de criar configuração, componentes ou integração funcional do shell.

## Prioridade por Camada

1. configuração pura de presentation: destinos, rótulos, alias e resolução exata do pathname
2. composition root: navegação, estado ativo, ações globais e landmarks
3. responsividade e acessibilidade: desktop/tablet/mobile, nomes acessíveis e alvos mínimos
4. regressão: tema, logout, páginas privadas e Proxy já cobertos pelo baseline

## Matriz de Testes da UI-002

| Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- |
| `PRIVATE_NAVIGATION_ITEMS` | somente `/dashboard`, `/transactions` e `/accounts`; rótulos desktop/mobile | teste criado em RED |
| `getPrivateNavigationItemForPath` | alias `/`; três destinos canônicos; futuros e paths aninhados não ativam item | testes criados em RED |
| `PrivateAppShell` | landmarks nomeados, links aprovados, ausência de destinos futuros | teste criado em RED |
| estado ativo | `aria-current="page"` apenas no item correspondente nas duas navegações | teste criado em RED |
| ações globais | e-mail, tema, logout e exatamente um `main` pertencente à página | teste criado em RED |
| mobile | navegação fixa, espaço inferior e largura mínima segura | teste criado em RED |

## Cenário Feliz

Usuário autenticado abre `/accounts`. Sidebar/rail e navegação mobile mostram apenas Visão geral/Início, Transações e Contas; somente Contas recebe `aria-current="page"`; tema, e-mail e logout permanecem acessíveis; o conteúdo conserva seu único landmark `main`.

## Cenários Alternativos

- `/` e `/dashboard` ativam o mesmo destino canônico de Visão geral/Início
- desktop/tablet usam rótulo “Visão geral”, enquanto mobile usa “Início”
- `/transactions` e `/accounts` resolvem somente por correspondência exata

## Edge Cases Críticos

- rota futura como `/cards`, `/goals` ou `/settings`
- path aninhado inexistente como `/transactions/new`
- botões ou links “Adicionar”, “Mais”, notificações e configurações aparecendo antes dos fluxos
- navegação mobile cobrindo o conteúdo
- shell introduzindo um segundo elemento `main`
- item inativo expondo `aria-current`

## Testes Criados

- `src/app/(private)/tests/private-navigation.test.ts`
- `src/app/(private)/tests/PrivateAppShell.test.tsx`

## Resultado Observado do Dia 2

- 14 cenários planejados: 10 de configuração pura e 4 de composição.
- RED direcionado: 2 suítes falharam; 4 testes executáveis falharam pelos elementos ausentes e a suíte pura falhou pelo módulo não implementado.
- Type-check: somente um `TS2307` para `../navigation/private-navigation`.
- Rede anterior: 41 suítes e 194 testes verdes ao excluir somente os dois contratos RED.
- Lint: verde, 0 warnings.
- Build não executado por causa do RED deliberado; audit não repetido porque não houve mudança de dependências.
- Implementação funcional permanece bloqueada até `dia 3 da UI-002`.

Estado de saída: `TEST_STRATEGY_READY`.

## Resultado GREEN do Dia 3 — UI-002

- `PRIVATE_NAVIGATION_ITEMS` implementa somente `/dashboard`, `/transactions` e `/accounts`.
- `getPrivateNavigationItemForPath` resolve `/` como alias e usa correspondência exata para os demais paths.
- `DesktopPrivateNavigation` entrega sidebar expandida em desktop e rail compacto em tablet.
- `MobilePrivateNavigation` entrega três destinos com estado ativo e espaço seguro no conteúdo.
- `PrivateTopbar` preserva marca, título, e-mail, tema e logout.
- `PrivateAppShell` integra as superfícies sem duplicar o landmark `main`.
- Primeira passagem direcionada: 2 suítes e 14 testes verdes.
- Regressão completa: 43 suítes e 208 testes verdes.
- Type-check, lint, audit com 0 vulnerabilidades e build de produção verdes.
- Nenhum teste foi removido, relaxado ou marcado como ignorado.
- Nenhuma rota, dependência, integração Supabase ou capacidade futura foi antecipada.

Estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## RED/GREEN do Dia 4 — UI-002

- Novos contratos cobriram skip link, alvo focalizável, topbar sticky, logout integrado e fallback de path desconhecido.
- RED direcionado: 1 teste falhou pela ausência de “Pular para o conteúdo”; 16 testes permaneceram verdes.
- GREEN direcionado: 2 suítes e 17 testes verdes.
- O skip link aponta para `#conteudo-principal`, aparece ao foco e o alvo usa `tabIndex={-1}`.
- A topbar permanece disponível durante rolagem sem alterar os estados reais do logout.
- Logout local, redirect para `/login` e refresh do router foram validados na composition root.
- Path desconhecido usa “Área financeira” e não expõe `aria-current` indevido.
- Type-check detectou assinatura estreita no mock de `signOut`; o erro foi documentado e o harness alinhado ao contrato real.
- Regressão completa: 43 suítes e 211 testes verdes.
- Type-check, lint, audit e build verdes.
- Nenhum teste foi relaxado e nenhum fluxo futuro foi antecipado.

Estado de saída: `IMPLEMENTATION_IN_PROGRESS`.
