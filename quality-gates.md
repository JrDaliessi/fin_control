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
