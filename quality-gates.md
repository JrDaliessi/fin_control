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
