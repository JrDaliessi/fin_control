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

## Dia 2 — SP-001 Biblioteca de Gráficos

## Objetivo

Converter a decisão arquitetural do ADR 0012 em contratos executáveis antes de instalar ECharts ou criar qualquer implementação de gráfico.

## Prioridade por Camada

1. `domain`: preservar datas civis, ordem e valores monetários inteiros; nenhuma regra nova foi introduzida pelo spike.
2. `application`: preservar o `FinancialEvolutionDto` serializável como entrada estável; nenhum caso de uso novo foi autorizado.
3. `presentation` pura: testar mapper e option builder sem DOM ou biblioteca carregada.
4. `presentation` cliente: testar lifecycle por adapter mockado, movimento reduzido e acessibilidade mínima.
5. `arquitetura/bundle`: impedir import total, wrapper React e vazamento de ECharts para outras camadas.

## Matriz de Testes do SP-001

| Camada | Alvo | Cenários essenciais | Estado no Dia 2 |
| --- | --- | --- | --- |
| domain | datas civis e agregação | limites civis, ordem, centavos e saldo negativo | contratos existentes: 2 suítes verdes |
| application | `FinancialEvolutionDto` | DTO serializável, vazio e ausência de contas | contrato existente: 1 suíte verde |
| presentation pura | mapper | ordem, datas civis, centavos, saldo negativo, vazio e imutabilidade | 3 cenários RED por módulo ausente |
| presentation pura | option builder | linha, eixos, tooltip, moeda na borda, imutabilidade, ARIA/decal e movimento reduzido | 3 cenários RED por módulo ausente |
| presentation cliente | ilha ECharts | SVG, nome/descrição acessíveis, `setOption`, atualização sem reinicialização, reduced motion, resize, dispose e fallback de erro | 5 cenários RED por módulo ausente |
| arquitetura | fronteiras e bundle | cinco arquivos permitidos, versão fixa, sem wrapper/import total, RSC e tabela preservados | 9 contratos: 7 RED e 2 verdes |

## Cenário Feliz

O DTO server-side é mapeado sem mutação para pontos com data civil e saldo em centavos. O builder cria uma série de linha acessível, a ilha inicializa o renderer SVG, aplica a opção, reage ao resize e libera recursos no unmount.

## Cenários Alternativos

- período sem pontos permanece como série vazia
- saldo negativo permanece inteiro e é formatado somente no eixo/tooltip
- preferência por movimento reduzido desativa animação
- tokens de tema entram como dados resolvidos, sem regra financeira ou acesso direto a CSS dentro do builder puro

## Edge Cases Críticos

- conversão indevida de centavos para ponto flutuante
- reordenação ou transformação das datas civis
- mutação do DTO/view model
- import direto de `echarts` ou uso de `echarts-for-react`
- import de ECharts fora de `presentation/charts/echarts`
- Canvas adotado apesar do renderer SVG aprovado
- observer/listener órfão ou instância sem `dispose`
- animação ignorando `prefers-reduced-motion`
- gráfico tratado como substituto da tabela acessível

## Testes Criados

- `src/features/financial-analytics/tests/to-financial-evolution-chart-model.test.ts`
- `src/features/financial-analytics/tests/build-financial-evolution-option.test.ts`
- `src/features/financial-analytics/tests/FinancialEvolutionChart.test.tsx`
- `src/features/financial-analytics/tests/financial-evolution-chart-boundaries.test.ts`

## Resultado Observado do Dia 2 — SP-001

- baseline: 71 suítes e 386 testes verdes
- domain/application direcionados: 3 suítes e 38 testes verdes
- RED direcionado: 4 suítes vermelhas; 7 testes arquiteturais falharam como esperado, 2 invariantes existentes passaram e as 3 suítes comportamentais pararam por módulos ausentes
- type-check RED: 7 `TS2307`, exclusivamente para os módulos planejados ausentes
- lint dos quatro arquivos novos: verde, 0 warnings
- rede anterior sem as quatro suítes RED: 71 suítes e 386 testes verdes
- nenhuma implementação, dependência, integração no dashboard, migration, dado ou configuração foi criada

## Implementação Bloqueada até o Dia 3

- `echarts@6.1.0`
- model e mapper de presentation
- option builder e client modular ECharts
- ilha cliente experimental
- qualquer integração de produção pertencente à SR-014

Estado de saída: `TEST_STRATEGY_READY`.

## Resultado GREEN do Dia 3 — SP-001

- `echarts@6.1.0` foi instalado diretamente, sem wrapper React.
- mapper e option builder permanecem funções puras e preservam datas civis, ordem, centavos e imutabilidade.
- adapter registra somente linha, ARIA, grid, tooltip e renderer SVG.
- ilha cliente recebe view model serializável, inicializa uma única instância, atualiza opções, observa resize, respeita movimento reduzido, libera recursos e mantém fallback acessível.
- primeiro GREEN parcial: 3 suítes e 15 testes verdes; o teste cliente expôs carregamento ESM anterior ao mock.
- GREEN direcionado final: 4 suítes e 20 testes verdes.
- regressão completa: 75 suítes e 406 testes verdes.
- type-check, lint global, audit com 0 vulnerabilidades e build de produção verdes.
- análise oficial do Next.js não encontrou ECharts nos chunks/rotas atuais, pois a ilha continua isolada do dashboard; delta atual de produção igual a zero.
- nenhum teste foi removido, relaxado ou ignorado.
- nenhuma rota, Supabase, migration, regra financeira ou gráfico de produção foi alterado.

Estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## RED/GREEN do Dia 4 — SP-001

- baseline antes dos cenários incrementais: 4 suítes e 20 testes verdes.
- RED test-first: 1 suíte, 2 falhas esperadas e 5 testes verdes; faltavam estado vazio e reação a `data-theme`.
- estado vazio passou a exibir status textual sem inicializar ECharts ou construir opções.
- mudança de tema passou a reaplicar tokens CSS na mesma instância, com cleanup do `MutationObserver` validado após unmount.
- loading foi classificado como não aplicável porque não existe operação assíncrona no experimento.
- GREEN do componente: 1 suíte e 7 testes verdes.
- GREEN direcionado: 4 suítes e 22 testes verdes.
- regressão completa: 75 suítes e 408 testes verdes.
- nenhum teste foi removido, relaxado ou ignorado; nenhuma rota ou integração de produção foi criada.

Estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## RED/GREEN do Dia 5 — SP-001

- baseline direcionado: 4 suítes e 22 testes verdes.
- RED test-first: 1 suíte, 3 falhas planejadas e 7 testes anteriores verdes.
- contratos novos cobrem IDs de descrição únicos, mudança de `prefers-reduced-motion` com cleanup e descarte da instância quando a configuração de resize falha.
- GREEN do componente: 1 suíte e 10 testes verdes.
- GREEN direcionado: 4 suítes e 25 testes verdes.
- regressão completa: 75 suítes e 411 testes verdes.
- integridade de datas civis e centavos, builder puro, imports modulares e painel server-side permaneceram protegidos.
- nenhum teste foi removido, relaxado ou ignorado; nenhuma rota, dependência ou integração de produção foi criada.

Estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## RED/GREEN do Dia 6 — SP-001

- baseline direcionado: 4 suítes e 25 testes verdes.
- auditoria confirmou layout fluido, resize reativo, alternativa tabular, estados textuais e contraste WCAG AA dos tokens claros/escuros.
- RED test-first: 2 suítes, 1 falha planejada e 20 testes verdes; faltavam tokens e listener de `forced-colors`.
- contratos verdes adicionais preservam classes responsivas e proíbem fonte de dados, storage, service worker ou promessa offline na ilha.
- GREEN de componente/fronteira: 2 suítes e 21 testes verdes.
- GREEN com manifesto PWA: 5 suítes e 29 testes verdes.
- regressão completa: 75 suítes e 413 testes verdes.
- nenhum teste foi removido, relaxado ou ignorado; nenhuma rota, dependência ou integração de produção foi criada.

Estado de saída: `QUALITY_VALIDATION`.

## Validação Final — SP-001

Objetivo: confirmar que o experimento de Apache ECharts pode ser aceito como decisão técnica sem integrar um gráfico às rotas antes da SR-014.

Evidências finais:
- quatro suítes específicas do spike cobrem mapper, option builder, lifecycle cliente e fronteiras arquiteturais;
- os cenários cobrem ordem e precisão dos dados, centavos, datas civis, SVG modular, ARIA/decal, tema, alto contraste, movimento reduzido, resize, cleanup, múltiplas instâncias, empty state e fallback transacional;
- regressão completa: 75 suítes e 413 testes verdes;
- lint, type-check, audit e build verdes;
- análise de bundle confirma ausência de ECharts nas rotas atuais.

Contratos adiados deliberadamente para a SR-014:
- integração real com `FinancialEvolutionPanel` e a rota do dashboard;
- presença simultânea do gráfico e da tabela no DOM de produção;
- teste visual end-to-end nos temas e viewports reais;
- medição do delta de JavaScript da rota após o dynamic boundary;
- observabilidade técnica sanitizada da inicialização/fallback, se houver necessidade operacional comprovada.

Critério observado: o SP-001 está `DONE`; a dependência foi aceita para uso controlado e a SR-014 deve iniciar novamente pelo Dia 1 antes de qualquer integração.

## Matriz originada no Dia 1 — SP-001

O Dia 1 definiu os contratos que deverão nascer em RED antes de qualquer instalação ou integração funcional:

- mapper puro: preserva ordem, datas civis, centavos, saldo negativo e pontos vazios;
- option builder: linha de fechamento, eixo/tooltip em moeda, SVG, ARIA e ausência de mutação do modelo;
- arquitetura: ECharts restrito a `presentation/charts/echarts` e ao componente cliente aprovado;
- RSC: painel continua server-compatible e envia somente props serializáveis à ilha cliente;
- lifecycle: init, resize, update, dispose e remoção de listeners com adapter mockado;
- acessibilidade: tabela permanece presente, descrição associada, informação não depende apenas de cor e movimento reduzido desativa animação;
- bundle: baseline e delta documentados com imports modulares; import total de `echarts` falha o contrato.

Nenhum desses testes foi criado no Dia 1. A seção executada acima registra sua materialização em RED no Dia 2; a instalação de `echarts@6.1.0` e qualquer implementação permanecem bloqueadas até aprovação do Dia 3.

## Matriz Executada no Dia 2 — UI-003

Os testes abaixo foram escritos antes de qualquer alteração funcional nos componentes:

| Camada | Alvo | Contratos essenciais |
| --- | --- | --- |
| architecture | `DashboardPage` | server-compatible; sem `use client`, Auth, `TransactionSessionProvider`, hook de resumo ou tipos financeiros |
| presentation | cabeçalho | “Visão geral”, saudação neutra, Contas e Transações; ausência de nome inferido e capacidades futuras |
| presentation | painel financeiro | “Saldo ao fim do período”, receitas, despesas, líquido, abertura/contexto e contagem com dados do DTO |
| presentation | estados | `missing_accounts`, `empty` e `success` distintos; sem zeros ou pontos fabricados |
| presentation | acessibilidade | um `main`, headings ordenados, `dl/dt/dd`, tabela/caption, foco e alvos de 44 px |
| route | composição | `searchParams` aguardado, kind normalizado, uma leitura server-side e slot compartilhado por `/` e `/dashboard` |
| boundary | RSC/bundle | DTO não atravessa para componente cliente; sem RPC, provider ou analytics nos chunks cliente |

Cenário feliz:
- usuário permanente com conta e movimentos abre o dashboard, seleciona um período e recebe saldo final, receitas, despesas, líquido e tabela diária calculados pela SR-013.

Cenários alternativos:
- conta existente sem movimentos no período mantém saldos e mensagem vazia
- ausência de contas mostra onboarding sem métricas fabricadas
- kind ausente ou inválido usa fallback aprovado
- falha de carregamento usa error boundary sanitizada e recuperável

Edge cases:
- saldo negativo
- receitas ou despesas iguais a zero
- período atravessando mês/ano
- texto longo e valores monetários grandes sem overflow
- viewport de 320 px, teclado, leitor de tela e movimento reduzido
- ausência explícita de “disponível de verdade”, previsão, comparação, gráfico e movimentações detalhadas

Resultado observado:
- baseline direcionado antes do RED: 4 suítes e 21 testes verdes
- RED direcionado: 4 suítes falharam; 11 testes falharam e 6 passaram
- causas exclusivas: dependências cliente legadas no `DashboardPage`, copy antiga, rótulo “Saldo final”, empty copy incompleta e ausência de `grid-cols-12`
- rede anterior, excluindo somente as 4 suítes RED: 68 suítes e 371 testes verdes
- type-check e lint local verdes; nenhuma implementação funcional foi criada

Implementação bloqueada até o Dia 3:
- tornar `DashboardPage` server-compatible e puramente visual
- remover o resumo/recentes baseados no provider cliente vazio
- aplicar copy, ações reais e slot aprovado
- reorganizar o resumo financeiro no grid de 12 colunas sem alterar cálculos

Estado de saída: `TEST_STRATEGY_READY`.

## GREEN do Dia 3 — UI-003

- `DashboardPage` tornou-se server-compatible e deixou de depender de Auth, sessão cliente, hook de resumo e componentes financeiros legados.
- copy, ações reais, slot React, métrica principal, empty state e grid de 12 colunas satisfizeram os contratos do Dia 2.
- GREEN direcionado: 4 suítes e 17 testes passaram.
- um contrato transversal de design system obsoleto foi reproduzido na regressão e realinhado para o `FinancialEvolutionPanel`, que efetivamente usa `Card` e `FeedbackMessage`.
- GREEN ampliado: 5 suítes e 26 testes passaram.
- regressão completa: 72 suítes e 388 testes passaram.
- lint, type-check e build de produção passaram.
- nenhum teste foi relaxado; o contrato transversal mudou de proprietário junto com a responsabilidade visual.

Estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## RED/GREEN do Dia 4 — UI-003

Contratos adicionados antes da implementação:
- grupo de ações exposto como navegação “Ações rápidas” e adaptável entre mobile e `sm`
- links reais com alvo mínimo de 44 px e foco visível
- loading contextualizado por “Visão geral” e marcado como ocupado
- alerta de erro associado programaticamente ao título e à descrição
- recuperação de erro usando a primitive compartilhada `Button`

RED observado:
- 2 suítes de apresentação confirmaram 3 falhas comportamentais
- 1 suíte transversal confirmou 1 falha de design system

GREEN observado:
- execução direcionada: 3 suítes e 17 testes passaram
- regressão completa: 72 suítes e 388 testes passaram
- nenhum teste foi relaxado, ignorado ou removido

Estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## RED/GREEN do Dia 5 — UI-003

Baseline pré-refatoração:
- 5 suítes direcionadas e 28 testes passaram
- regressão completa com 72 suítes e 388 testes
- lint, type-check e build verdes

Contratos arquiteturais adicionados antes da remoção:
- arquivos da antiga cadeia cliente do dashboard não podem voltar a existir
- layout privado não pode compor `TransactionSessionProvider` sem consumidor
- seletor de período deve reutilizar a primitive `Button`

RED observado:
- cadeia legada: 1 suíte falhou com 1 teste vermelho e 2 verdes
- provider global: 1 suíte falhou com 2 testes vermelhos e 2 verdes
- design system: 1 suíte falhou com 1 teste vermelho e 8 verdes

GREEN observado:
- limpeza inicial: 4 suítes e 20 testes passaram
- fronteira cliente: 4 suítes e 21 testes passaram
- design system: 2 suítes e 16 testes passaram
- regressão final: 70 suítes e 378 testes passaram
- duas suítes obsoletas foram removidas com seus únicos alvos de produção; dois contratos arquiteturais novos preservam a não regressão

Estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## RED/GREEN do Dia 6 — UI-003

- baseline direcionado: 5 suítes e 28 testes verdes; baseline completo: 70 suítes e 378 testes verdes
- RED: 3 suítes executadas, 2 falharam e 1 passou; 5 testes falharam e 14 passaram por contratos responsivos ainda ausentes
- GREEN direcionado: 3 suítes e 19 testes passaram após a implementação mínima
- contraste: 8 combinações verificadas automaticamente, com limiares WCAG AA de 4,5:1 para texto normal e 3:1 para foco/não texto
- dashboard: altura dinâmica do viewport coberta por teste
- seletor: fonte móvel de 16 px coberta para evitar zoom automático
- estado sem contas: CTA responsivo e largura segura cobertos
- resumo: valores longos e cards estreitos protegidos contra overflow
- tabela: gesto horizontal, teclado, orientação persistente para tecnologia assistiva e ocultação apenas visual em `sm`
- regressão completa: 71 suítes e 386 testes passaram
- lint: verde com 0 warnings; type-check: verde; build Next `16.3.3`: verde
- browser: 320 x 720 e 1366 x 768 sem overflow horizontal; console sem erro; manifesto HTTP 200
- nenhum teste ou implementação promete offline, cria service worker ou altera cálculo financeiro
- estado de saída: `QUALITY_VALIDATION`

## Dia 2 — Estratégia de Testes e Fundação TDD da SR-013

Small release: `SR-013 — Agregação da evolução financeira`.

### Prioridade por camada

1. `domain`: produzir buckets civis diários completos e validar aritmética financeira segura.
2. `application`: resolver a âncora em timezone explícito, orquestrar um snapshot e devolver DTO serializável.
3. `infrastructure`: mapear a projeção tabular da RPC e sanitizar falhas do provider.
4. `database`: proteger a função, preservar RLS e comprovar limites, isolamento e plano de consulta.
5. `presentation`: documentar contratos futuros; componentes permanecem bloqueados até a expansão controlada.

### Matriz executável

| Camada | Alvo | Cenários essenciais | Status no Dia 2 |
| --- | --- | --- | --- |
| domain | `aggregateFinancialEvolution` | buckets contínuos, dias vazios, bissexto, saldo negativo, ordem de entrada, intervalo semiaberto, entradas inválidas e overflow | RED por módulos ausentes |
| application | `resolveReferenceCivilDate` | virada UTC/local, timezone explícito, instante e IANA inválidos | RED por módulo ausente |
| application | `ListFinancialEvolutionUseCase` | success, missing accounts, empty, ator/período inválidos, uma consulta e erro sanitizado | RED por módulos ausentes |
| infrastructure | mapper de snapshot | numeric string, sentinela nula, repetição consistente, tipos e inteiros seguros | RED por módulo ausente |
| infrastructure | repository Supabase | uma RPC, limites civis, ausência de `userId` no payload e erro estável | RED por módulo ausente |
| database | assinatura e grants | dois parâmetros date, sete colunas, invoker, search path e EXECUTE mínimo | 9 falhas de 15 em RED remoto |
| database | comportamento/RLS | abertura, intervalo, ordem, tenants, anon, Auth anônimo, nulos, inversão e 31 dias | escrito; execução bloqueada até a função existir |
| database | performance | índices existentes, filtros explícitos e helpers Auth em initPlan | escrito; execução bloqueada até o Dia 3 |
| presentation | seletor/tabela/estados | nomes acessíveis, caption, headers, missing accounts, empty, success e ausência de cálculo na UI | documentado para Dia 4 |

### Cenário feliz

O caso de uso recebe um ator verificado, `rolling_7_days`, o instante `2026-03-07T15:00:00.000Z` e `America/Sao_Paulo`; resolve `[2026-03-01, 2026-03-08)`, carrega um snapshot, agrega sete pontos e devolve resumo e DTOs serializáveis.

### Cenários alternativos

- usuário possui contas, saldo de abertura e nenhum movimento no intervalo
- usuário ainda não possui conta financeira
- período atravessa fevereiro bissexto
- saldo de fechamento se torna negativo
- movimentos chegam fora de ordem e são agrupados pelo dia civil
- RPC retorna inteiros Postgres como strings numéricas
- snapshot vazio usa uma linha sentinela com colunas de movimento nulas

### Edge cases críticos

- início inclusivo e fim exclusivo
- movimento anterior ao início ou igual ao fim
- data civil inexistente
- tipo desconhecido, valor zero, fracionário ou inseguro
- overflow do total diário ou saldo acumulado
- instante inválido ou timezone IANA desconhecido
- divergência entre valores repetidos do snapshot
- payload RPC contendo ownership controlado pelo cliente
- função executável por `PUBLIC`, `anon`, `service_role` ou Auth anônimo
- limites nulos, invertidos ou acima de 31 dias
- plano sem os índices existentes de owner e data civil

### Testes criados

Jest:
- `src/features/financial-analytics/tests/aggregate-financial-evolution.test.ts`
- `src/features/financial-analytics/tests/resolve-reference-civil-date.test.ts`
- `src/features/financial-analytics/tests/list-financial-evolution.use-case.test.ts`
- `src/features/financial-analytics/tests/financial-evolution-snapshot.mapper.test.ts`
- `src/features/financial-analytics/tests/supabase-financial-analytics-query.repository.test.ts`
- `src/features/financial-analytics/tests/fixtures/financial-evolution.fixtures.ts`

pgTAP:
- `supabase/tests/database/financial_evolution_snapshot_schema.test.sql` — 15 asserções
- `supabase/tests/database/financial_evolution_snapshot_behavior.test.sql` — 14 asserções
- `supabase/tests/database/financial_evolution_snapshot_performance.test.sql` — 4 asserções

### Resultado RED observado

- 5 suítes Jest falharam antes de executar cenários porque os 7 módulos de produção planejados ainda não existem.
- type-check apresentou somente 7 erros `TS2307` para os mesmos módulos ausentes.
- contrato estrutural pgTAP executado transacionalmente no projeto `fin_control`: 9 falhas de 15 pela função ainda ausente.
- rollback confirmado: função continuou ausente e `pgtap` permaneceu não instalada.
- rede anterior excluindo somente as cinco suítes novas: 64 suítes e 336 testes verdes.
- lint: verde, 0 warnings.
- `git diff --check`: verde, com avisos esperados de normalização LF/CRLF.
- build não executado porque o type-check vermelho é deliberado.

### Implementação bloqueada até o Dia 3

- `src/features/financial-analytics/domain/types/financial-evolution.types.ts`
- `src/features/financial-analytics/domain/services/aggregate-financial-evolution.ts`
- `src/features/financial-analytics/application/services/resolve-reference-civil-date.ts`
- `src/features/financial-analytics/application/ports/financial-analytics-query.repository.ts`
- `src/features/financial-analytics/application/use-cases/list-financial-evolution.use-case.ts`
- `src/features/financial-analytics/infrastructure/supabase/financial-evolution-snapshot.mapper.ts`
- `src/features/financial-analytics/infrastructure/repositories/supabase-financial-analytics-query.repository.ts`
- migration `load_financial_evolution_snapshot`, grants e execução dos contratos comportamentais/performance
- qualquer componente, rota, gráfico, dependência visual ou expansão da UI-003

Estado de saída: `TEST_STRATEGY_READY`.

## Planejamento TDD da SR-013 — definido no Dia 1

Alvos obrigatórios para o Dia 2:
- domain: buckets diários completos, vazio, viradas de mês/ano, saldo negativo, totais, ordem, entradas inválidas e overflow
- application: ator, período, estados `missing_accounts | empty | success`, chamada única ao repository e erro sanitizado
- timezone: instante explícito em `America/Sao_Paulo`, incluindo viradas UTC/local, sem relógio global
- infrastructure: mapper do snapshot, limites `gte/lt`, ordenação estável e normalização de falhas
- database: assinatura da função, grants mínimos, `SECURITY INVOKER`, RLS por usuário, Auth anônimo bloqueado, abertura, intervalo e plano com índices
- presentation: seletor semanticamente nomeado, tabela com caption/headers, estados e ausência de cálculo financeiro na UI

Nenhum desses testes ou artefatos funcionais pertence ao Dia 1.

## Dia 2 — SR-012 Períodos Financeiros

## Objetivo

Transformar os contratos civis e temporais da SR-012 em testes executáveis antes de criar `CivilDate`, o resolvedor, o predicado de pertencimento ou o caso de uso.

## Prioridade por Camada

1. `domain`: validar datas civis reais, os cinco períodos e limites semiabertos.
2. `application`: validar o DTO serializável do caso de uso.
3. `infrastructure`: não aplicável nesta release.
4. `presentation`: não aplicável enquanto não existir consumidor real.

## Matriz de Testes da SR-012

| Camada | Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- | --- |
| domain | `CivilDate` | formato canônico, datas reais, bissexto, ano/mês/dia inválidos e rejeição de timestamp | testes criados |
| domain | `resolveFinancialPeriod` | cinco kinds, semana seg–dom, quinzenas, janelas móveis e viradas de mês/ano | testes criados |
| domain | `containsCivilDate` | início incluso, interior, último dia, fim exclusivo, antes do início e candidato inválido | testes criados |
| application | `ResolveFinancialPeriodUseCase` | DTO plano, serialização, kind inválido e referência inválida | testes criados |
| infrastructure | não aplicável | nenhuma consulta, migration ou integração autorizada | fora do escopo |
| presentation | não aplicável | nenhum seletor, rota ou componente autorizado | fora do escopo |

## Cenário Feliz

O caso de uso recebe `rolling_7_days` e a data civil `2026-08-25`, resolve o intervalo `[2026-08-19, 2026-08-26)` e devolve somente strings serializáveis.

## Cenários Alternativos

- semana civil atravessando a virada do ano
- primeira e segunda quinzenas
- janela móvel atravessando mês ou ano
- mês de fevereiro em ano bissexto
- mês de dezembro terminando em janeiro do ano seguinte

## Edge Cases Críticos

- data inexistente, timestamp ou formato não canônico
- ano, mês ou dia zero
- século não bissexto
- `custom` ou outro kind fora da união aprovada
- começo inclusivo e fim exclusivo
- candidato inválido no predicado de pertencimento
- uso acidental de `Date`, relógio, locale ou timezone nos contratos

## Testes Criados

- `src/features/financial-analytics/tests/civil-date.test.ts`
- `src/features/financial-analytics/tests/resolve-financial-period.test.ts`
- `src/features/financial-analytics/tests/resolve-financial-period.use-case.test.ts`

Fixtures compartilhadas não foram criadas: as entradas são primitivas e as tabelas locais mantêm cada resultado esperado explícito.

## Implementação Bloqueada até o Dia 3

- `src/features/financial-analytics/domain/value-objects/civil-date.ts`
- `src/features/financial-analytics/domain/types/financial-period.types.ts`
- `src/features/financial-analytics/domain/services/resolve-financial-period.ts`
- `src/features/financial-analytics/domain/services/contains-civil-date.ts`
- `src/features/financial-analytics/application/use-cases/resolve-financial-period.use-case.ts`

Não criar `presentation`, `infrastructure`, repository, migration, policy, grant, rota ou dependência nesta release.

## Resultado Observado do Dia 2 — SR-012

- baseline anterior: 61 suítes e 294 testes verdes
- 3 suítes novas com 37 cenários codificados
- RED direcionado: 3 suítes falharam antes da execução dos cenários por módulos deliberadamente ausentes
- type-check: 6 erros `TS2307`, todos limitados aos 5 módulos planejados
- rede anterior: 61 suítes e 294 testes permaneceram verdes ao excluir a pasta da SR-012
- lint: verde, 0 warnings
- `git diff --check`: verde, com avisos esperados de LF/CRLF
- build não executado porque o type-check vermelho é deliberado
- nenhum código funcional, UI, infrastructure, migration, integração ou dependência foi criado

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

## Dia 2 — SR-011 Persistência e RLS de Transações

## Objetivo

Transformar o ADR 0008 em contratos executáveis antes de criar `Transaction.restore`, mapper, repository ou migration.

## Prioridade por Camada

1. `domain`: limites, normalização, data civil, restauração e imutabilidade.
2. `application`: preservar criação e resumo mensal exclusivamente por contrato.
3. `infrastructure`: validar mapper, payload, consulta mensal, schema, integridade e RLS.
4. `presentation`: documentar a composição persistente de `/transactions` para o Dia 4, sem criar UI agora.

## Matriz de Testes da SR-011

| Camada | Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- | --- |
| domain | `Transaction.create` | notas normalizadas; descrição até 160; notas até 1000 | 3 cenários RED adicionados |
| domain | `Transaction.restore` | reidratação; ID/datas inválidos; proteção contra mutação | 6 cenários RED adicionados |
| application | criação e resumo mensal | cenário feliz, inválidos, falha do repository, mês vazio e fora do período | 7 cenários existentes preservados |
| infrastructure | mapper | row `date` para UTC; payload mínimo; bigint inseguro | 3 cenários RED criados |
| infrastructure | repository | insert; owner/período semiaberto; ordem estável; erro sanitizado | 4 cenários RED criados |
| database | schema/grants | 12 colunas, constraints, FKs, índices, policies, privilégios e ausência de status | 46 asserções pgTAP |
| database | constraints | valores, defaults, vínculos tenant-safe, `type/kind` e deletes restritos | 21 asserções pgTAP |
| database | RLS | owner, não owner, anon, Auth anônimo, owner forjado e mutações proibidas | 17 asserções pgTAP |
| database | performance | initPlan dos helpers Auth e índice mensal por owner | 3 asserções pgTAP |
| presentation | `/transactions` | dados persistidos, loading, empty, success, error e ausência de `userId` livre | documentado; testes adiados ao Dia 4 |

## Cenário Feliz

Um usuário permanente autenticado registra uma despesa manual usando conta e categoria próprias. O domínio normaliza os dados, o caso de uso persiste por contrato, o mapper envia somente campos aprovados e o repository retorna a linha reidratada. A consulta do mês usa intervalo semiaberto e retorna somente linhas do proprietário em ordem estável.

## Cenários Alternativos

- receita com categoria `income`
- método `pix`, `cash` ou `debit` em vez do default `manual`
- notas ausentes
- mês sem transações
- mudança de dezembro para janeiro no limite superior da consulta
- erro do provider convertido em mensagem estável

## Edge Cases Críticos

- descrição vazia, não aparada ou acima de 160 caracteres
- valor zero, negativo, decimal ou acima do inteiro seguro do JavaScript
- notas não aparadas ou acima de 1000 caracteres
- data, ID ou timestamps persistidos inválidos
- bigint inseguro retornado pelo provider
- conta ou categoria inexistente
- conta ou categoria pertencente a outro usuário
- categoria `income` em despesa ou categoria `expense` em receita
- owner forjado, `anon` ou usuário anônimo do Supabase Auth
- tentativa de `UPDATE` ou `DELETE`
- policy sem initPlan, owner sem índice ou tabela exposta sem grant explícito

## Testes Criados ou Alterados

Jest:
- `src/features/transactions/tests/fixtures/transaction.fixtures.ts`
- `src/features/transactions/tests/transaction.entity.test.ts`
- `src/features/transactions/tests/supabase-transaction.mapper.test.ts`
- `src/features/transactions/tests/supabase-transaction.repository.test.ts`

pgTAP:
- `supabase/tests/database/transactions_schema.test.sql`
- `supabase/tests/database/transactions_constraints.test.sql`
- `supabase/tests/database/transactions_rls.test.sql`
- `supabase/tests/database/transactions_rls_performance.test.sql`

## Implementação Bloqueada até o Dia 3

- `Transaction.restore` e novos limites do domínio
- `transaction.mapper.ts`
- `supabase-transaction.repository.ts`
- obrigatoriedade de `TransactionRepository.findByMonth`
- migration de `public.transactions` e constraints auxiliares
- qualquer Server Action, rota ou mudança de apresentação

## Resultado Observado do Dia 2 — SR-011

- baseline anterior: 53 suítes e 255 testes verdes
- type-check e lint da baseline: verdes
- audit de produção: 0 vulnerabilidades
- RED direcionado: 3 suítes falharam; 9 testes falharam e 11 testes anteriores permaneceram verdes
- falhas deliberadas: `Transaction.restore`, normalização/limites, mapper e repository ainda ausentes
- type-check RED: 5 erros, exclusivamente `TS2307` dos dois módulos ausentes e `TS2339` de `Transaction.restore`
- lint dos contratos: verde, 0 warnings
- rede anterior excluindo somente os três contratos RED: 52 suítes e 244 testes verdes
- planos pgTAP validados mecanicamente: 46 + 21 + 17 + 3 = 87 asserções
- RED remoto transacional: 1 falha de 1 porque `public.transactions` ainda não existe
- rollback remoto confirmado: duas tabelas, três migrations e `pgtap` não instalada
- nenhuma implementação, migration, tabela, grant, policy, fixture persistente ou configuração foi criada
- build não executado porque o type-check vermelho é deliberado

Estado de saída: `TEST_STRATEGY_READY`. A implementação permanece bloqueada até `dia 3` da SR-011.

## Resultado GREEN do Dia 3 — SR-011

- RED inicial reproduzido: 3 suítes falharam, 9 testes falharam, 11 passaram e type-check teve 5 erros planejados.
- GREEN direcionado: 5 suítes e 34 testes passaram.
- `Transaction.restore`, normalização, limites e proteção de datas satisfizeram os contratos do domínio.
- mapper e repository satisfizeram payload mínimo, data civil, bigint seguro, owner, período, ordenação e sanitização.
- pgTAP: 46 schema + 21 constraints + 17 RLS + 5 performance = 89 asserções verdes.
- três cenários RLS falsamente negativos foram corrigidos após registro no contexto; os testes agora alcançam diretamente as policies negadas.
- duas asserções de índices nasceram em RED após o advisor identificar FKs descobertas e passaram após migration incremental.
- regressão completa: 55 suítes e 271 testes verdes.
- type-check, lint, audit com 0 vulnerabilidades e build de produção verdes.
- nenhuma cobertura foi relaxada, removida ou ignorada.

Estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## RED/GREEN do Dia 6 — SR-011

- contratos do formulário passaram a exigir bloqueio de todos os controles durante o envio, foco no primeiro erro local e limpeza do feedback ao corrigir a entrada
- RED direcionado: 2 testes falharam e 11 passaram
- GREEN direcionado: 1 suíte e 13 testes passaram
- regressão completa: 61 suítes e 292 testes passaram
- browser complementou Jest em desktop, `390 x 844` e `320 x 800`, sem overflow e sem persistir fixtures
- manifest, idioma, viewport e `theme-color` foram confirmados; nenhuma promessa offline foi adicionada
- lint, type-check, audit e build permaneceram verdes
- estado de saída: `QUALITY_VALIDATION`

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

## RED/GREEN do Dia 5 — UI-002

- Auditoria mediu os componentes e não identificou monólito; `PrivateNavigation.tsx` tinha 99 linhas antes do hardening.
- O novo contrato exige que o item móvel ativo seja distinguido por fundo e peso, além de cor e `aria-current`.
- RED direcionado: 1 teste falhou e 16 permaneceram verdes.
- GREEN direcionado: 2 suítes e 17 testes passaram.
- A rota ativa passou a ser resolvida uma única vez por variante de navegação, preservando alias e correspondência exata.
- Regressão completa: 43 suítes e 211 testes passaram.
- Type-check, lint, audit com 0 vulnerabilidades e build de produção passaram.
- Nenhuma cobertura foi relaxada e nenhum destino ou fluxo futuro foi antecipado.

Estado de saída: `IMPLEMENTATION_IN_PROGRESS`.

## RED/GREEN do Dia 6 — UI-002

- Contratos cobriram safe area da navegação inferior e preferência por movimento reduzido.
- RED direcionado: 2 testes falharam e 17 permaneceram verdes.
- GREEN direcionado: 3 suítes e 19 testes passaram, incluindo manifest PWA.
- Conteúdo móvel reserva a altura original mais `env(safe-area-inset-bottom)` e deixa de ser coberto em dispositivos com recorte inferior.
- Links desktop/tablet/mobile desabilitam transição quando `prefers-reduced-motion` está ativo.
- Ordem de teclado validada: o skip link é o primeiro destino focalizável do shell.
- Regressão completa: 43 suítes e 211 testes passaram.
- Type-check, lint, audit com 0 vulnerabilidades e build de produção passaram.
- Inspeção visual automatizada ficou indisponível por falha ambiental e foi registrada como limitação, sem relaxar contratos automatizados.

Estado de saída: `QUALITY_VALIDATION`.

## Validação final do Dia 7 — UI-002

- Auditoria encontrou divergência entre o fluxo Git para `develop` e o CI limitado a `main`.
- Novo contrato estático falhou em RED recebendo somente `main` e passou em GREEN após cobrir `main` e `develop` em push e pull request.
- Suíte direcionada do CI: 1 suíte e 1 teste passaram.
- Regressão completa: 44 suítes e 212 testes passaram.
- Type-check, lint, audit com 0 vulnerabilidades e build de produção passaram.
- Nenhum teste foi relaxado, ignorado ou removido.

Estado de saída: `READY_FOR_RELEASE`.

## Dia 2 — SR-010 Persistência e RLS de Categorias

## Objetivo

Transformar o domínio, os contratos, o schema planejado e o threat model da SR-010 em testes executáveis antes de criar qualquer implementação funcional ou migration.

## Prioridade por Camada

1. `domain`: validar criação, restauração, normalização e kinds de categoria.
2. `application`: validar criação e listagem exclusivamente por contratos.
3. `infrastructure`: validar mapper, repository, schema, constraints, grants e RLS.
4. `presentation`: documentar cenários para o Dia 4 sem criar UI no Dia 2.

## Matriz de Testes da SR-010

| Camada | Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- | --- |
| domain | `Category` | `income`/`expense`; normalização; entradas inválidas; restauração e invariantes | 9 cenários criados |
| application | `CreateCategoryUseCase` | criação normalizada; entrada inválida; falha do repository | 3 cenários criados |
| application | `ListCategoriesUseCase` | ator normalizado; lista vazia; ator ausente; falha do repository | 4 cenários criados |
| infrastructure | mapper | row para domínio; payload mínimo de insert | 2 cenários criados |
| infrastructure | `SupabaseCategoryRepository` | criar; filtrar/ordenar; sanitizar erros de create/list | 4 cenários criados |
| database | schema/grants | colunas, constraints, índices, policies, privilégios e ausência de campos futuros | 33 asserções pgTAP |
| database | constraints | kinds, nome normalizado, FK, unicidade e defaults | 12 asserções pgTAP |
| database | RLS | owner, não owner, anon, Auth anônimo, owner forjado e operações proibidas | 17 asserções pgTAP |
| database | performance | initPlan dos helpers Auth e índice de ownership | 3 asserções pgTAP |
| presentation | `/categories` | loading, empty, success, error, formulário e ausência de `userId` livre | documentado; testes adiados ao Dia 4 |

## Cenário Feliz

Um usuário permanente autenticado cria uma categoria de despesa. O domínio normaliza nome e ator, o caso de uso persiste pelo contrato, o mapper envia apenas `user_id`, `name` e `kind`, e o banco permite que o proprietário liste a categoria.

## Cenários Alternativos

- categoria de receita em vez de despesa
- lista vazia sem categorias inventadas
- mesmo nome em kinds diferentes
- mesmo nome e kind para usuários diferentes
- falha do repository convertida em erro estável

## Edge Cases Críticos

- usuário ou nome vazio
- nome acima de 80 caracteres
- espaços externos ou repetidos
- kind fora de `income | expense`
- duplicidade case-insensitive por usuário e kind
- usuário inexistente na FK de Auth
- leitura e insert de outro proprietário
- acesso por `anon` ou usuário anônimo do Supabase Auth
- tentativa de `UPDATE` ou `DELETE` sem grant
- policy sem initPlan ou coluna de ownership sem índice
- `color` e `icon` surgindo prematuramente no schema

## Testes Criados

Jest:
- `src/features/categories/tests/fixtures/category.fixtures.ts`
- `src/features/categories/tests/category.entity.test.ts`
- `src/features/categories/tests/create-category.use-case.test.ts`
- `src/features/categories/tests/list-categories.use-case.test.ts`
- `src/features/categories/tests/supabase-category.mapper.test.ts`
- `src/features/categories/tests/supabase-category.repository.test.ts`

pgTAP:
- `supabase/tests/database/categories_schema.test.sql`
- `supabase/tests/database/categories_constraints.test.sql`
- `supabase/tests/database/categories_rls.test.sql`
- `supabase/tests/database/categories_rls_performance.test.sql`

## Resultado Observado do Dia 2 — SR-010

- Baseline anterior: 44 suítes e 212 testes verdes; type-check e lint verdes; audit com 0 vulnerabilidades.
- RED Jest direcionado: 5 suítes falharam por módulos de produção ausentes; nenhum teste funcional executou prematuramente.
- RED do type-check: 11 erros `TS2307`, todos referentes aos módulos planejados ausentes.
- Lint permaneceu verde com 0 warnings.
- Rede anterior, excluindo somente `src/features/categories/tests`: 44 suítes e 212 testes verdes.
- Planos pgTAP validados mecanicamente: 33 + 12 + 17 + 3 = 65 asserções.
- RED remoto via MCP: contrato mínimo confirmou 1 falha de 1 porque `public.categories` ainda não existe.
- Rollback remoto confirmado: somente `financial_accounts`, duas migrations e extensão `pgtap` não instalada.
- Nenhuma implementation, migration, tabela, grant, policy, dado ou configuração foi criada.
- Build não foi executado porque o type-check deve permanecer vermelho por design.

## Implementação Bloqueada até o Dia 3

- entidade e contrato de categorias
- casos de uso de criação e listagem
- mapper e repository Supabase
- migration `public.categories`
- qualquer rota, action ou componente de apresentação

Estado de saída: `TEST_STRATEGY_READY`.
