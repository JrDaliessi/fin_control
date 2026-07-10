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
