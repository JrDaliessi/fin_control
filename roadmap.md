# Roadmap

## Direção do Produto
Construir um copiloto financeiro brasileiro com IA, começando por controle financeiro manual/importado e evoluindo para automação via Open Finance.

## Marco 0 — Fundação Operacional
Status: concluído no Dia 0.

Entregas:
- contexto central
- arquitetura base
- backlog inicial
- quality gates
- workflows e catálogos de agents/skills

## Marco 1 — Discovery e Domínio
Fase: Dia 1
Status: concluído.

Entregas:
- visão de produto refinada
- módulos iniciais
- contratos entre camadas
- estrutura de pastas aprovada
- backlog refinado em small releases

Resultado:
- primeira small release funcional selecionada: cadastro manual de transação simples
- módulos do MVP definidos
- contratos iniciais entre camadas mapeados
- dependências críticas identificadas

## Marco 2 — Estratégia de Testes
Fase: Dia 2
Status: concluído.

Entregas:
- matriz de testes
- cenários felizes e críticos
- testes iniciais da primeira small release

Ordem planejada:
- preparar setup técnico mínimo para permitir testes
- criar testes de domínio de transação
- criar testes de aplicação do caso de uso de criação de transação
- documentar matriz de testes por camada

Resultado:
- setup técnico mínimo criado
- matriz de testes documentada em `test-strategy.md`
- testes essenciais de transação criados
- testes falhando por implementação ausente, conforme TDD

## Marco 3 — Primeira Small Release Funcional
Fases: Dia 3 e Dia 4
Status: concluído para o recorte inicial.

Candidatas:
- cadastro manual de transação simples
- dashboard financeiro inicial
- cadastro de conta financeira
- simulação básica de compra parcelada

Ordem recomendada:
1. cadastro manual de transação simples
2. expansão controlada da transação manual
3. resumo mensal básico
4. cadastro de conta financeira
5. dashboard financeiro inicial
6. compra parcelada no cartão

Resultado parcial:
- Dia 3 implementou `Transaction`, `TransactionRepository` e `CreateTransactionUseCase`.
- Testes, type-check, lint, audit e build passaram.
- Dia 4 implementou apresentação inicial da transação manual, estados de interação e rota inicial.
- Testes, type-check, lint, audit e build passaram.

Resultado final do ciclo:
- Dia 5 revisou estrutura, consistência interna e riscos.
- Dia 6 refinou experiência, acessibilidade e PWA.
- Dia 7 validou testes, lint, type-check, audit, build, segurança básica e release incremental.

Próxima small release selecionada:
- `SR-005 — Resumo mensal básico`
- Entrada recomendada: Dia 2 para criar testes essenciais antes da implementação.
- Banco de dados real e migrations permanecem fora deste recorte.

## Marco 4 — Hardening e Experiência
Fases: Dia 5 e Dia 6

Status: concluído para a primeira small release.

Entregas:
- refatoração orientada por testes
- consistência visual
- acessibilidade mínima
- PWA inicial

## Marco 5 — Release Incremental
Fase: Dia 7

Status: concluído para a primeira small release.

Entregas:
- lint verde
- type-check verde
- testes verdes
- build verde
- revisão básica de segurança
- baseline de observabilidade

## Marco 6 — Resumo Mensal Básico
Fases: Dia 2 a Dia 7

Status: concluído. SR-005 entregue com pipeline verde.

Entregas:
- testes essenciais do resumo mensal concluídos
- caso de uso `list-monthly-summary.use-case.ts` implementado
- cálculo de receitas, despesas e saldo líquido em centavos implementado
- exposição visual do resumo mensal criada
- responsabilidades internas refinadas no Dia 5
- UX, acessibilidade e PWA revisados no Dia 6
- quality gates finais validados no Dia 7

Fora do marco:
- Supabase Database
- migrations
- autenticação real
- dashboard completo

## Marco 7 — Dashboard Financeiro Inicial
Fases: Dia 1 a Dia 7 (ciclo atual)

Status: concluído. SR-006 validada com pipeline verde, revisão de segurança, baseline de observabilidade e CI versionado.

Small release: SR-006

Entregas planejadas:
- caso de uso `GetDashboardSummaryUseCase` testado
- painel de resumo mensal reutilizando caso de uso existente
- lista resumida de transações recentes
- empty state com call-to-action
- rotas `/` (dashboard) e `/transactions` (registro)
- navegação mínima entre telas
- `formatCents` compartilhado em `src/shared/utils/`

Próximo passo:
- Dia 1 da SR-007 concluído com domínio, regras e contratos definidos
- executar `dia 2` para criar os testes essenciais antes da implementação
- manter analytics avancados bloqueados ate a fundacao de dados reais

## Marco 8 - Fundacao de Dados Reais

Ordem: SR-007 conta local, SR-008 autenticacao, SR-009 contas com RLS, SR-010 categorias com RLS e SR-011 transacoes com RLS.

Estado atual: Dia 7 da SR-009 concluído em `READY_FOR_RELEASE`; entrega incremental de código pronta, sem deploy executado.

Evidência da SR-007: pipeline final verde com 21 suítes e 110 testes, cadastro local acessível e nenhuma persistência real antecipada.

Recorte da SR-007: domínio, contrato e cadastro local de conta financeira, sem Supabase Database, migrations, autenticação ou RLS.

Recorte da SR-008: login por e-mail/senha, logout, identidade validada no servidor, Proxy do Next.js 16 e proteção de rotas privadas; cadastro, recuperação, OAuth, MFA, banco financeiro e RLS permanecem fora.

Evidência da SR-009: migrations `20260714053335_create_financial_accounts` e `20260714061527_optimize_financial_accounts_rls_auth_initplan`, 70 testes pgTAP verdes, Performance Advisor limpo, 36 suítes/170 testes Jest, audit sem vulnerabilidades e build verde; no Dia 7, os testes SQL transacionais preservaram as duas contas reais existentes, grants/RLS foram confirmados e o threat model e a baseline de observabilidade foram registrados.

Próximo passo: selecionar explicitamente a próxima small release. A SR-010 permanece em `DISCOVERY`; edição, exclusão, categorias, transações e idempotência não foram antecipadas. Deploy público da SR-009 permanece condicionado ao hardening de Auth, observabilidade e borda HTTP registrado no backlog.

Saida: dados isolados por usuario e prontos para consultas por periodo.

## Trilha Transversal — FinControl Pulse

Status: `UI-001` selecionada e com Dia 1 concluído em 2026-07-14; `UI-002` a `UI-006` permanecem em `DISCOVERY`. Nenhuma implementação visual foi iniciada antes da fundação TDD.

Objetivo: transformar o app em uma central de decisões financeiras com identidade consistente, navegação responsiva, copy acolhedora e dashboard progressivo, sem antecipar domínios ou dados.

Ordem visual recomendada:

1. `UI-001` — marca, tipografia, tokens, temas e primitives essenciais;
2. `UI-002` — sidebar, topbar, shell e navegação mobile apenas para rotas disponíveis;
3. `UI-003` — dashboard Pulse usando somente indicadores suportados por casos de uso reais;
4. `UI-004` — apresentação de contas em cards e cadastro em drawer/modal;
5. `UI-005` — listagem de transações e formulário em drawer/bottom sheet após SR-010/SR-011;
6. `UI-006` — login, microcopy, estados e instalação PWA sem promessa offline.

Saída arquitetural da UI-001:

- marca padronizada como `FinControl`;
- Geist por `next/font/google`, sem nova dependência;
- tokens CSS em canais RGB mapeados pelo Tailwind;
- preferência `light | dark | system`, persistida apenas em `fincontrol.theme`;
- seletor de dark mode por `data-theme="dark"` e resolução anterior à hidratação;
- primitives limitadas a `Button`, `Card`, `FeedbackMessage` e `ThemeSwitcher`;
- shell, dashboard, drawers, gráficos, regras financeiras e Supabase permanecem fora do item.

Próximo passo obrigatório da trilha: `dia 2 da UI-001`, para criar a matriz e os testes essenciais em RED antes de implementar.

Integrações posteriores:

- SR-012 a SR-017 recebem períodos, evolução, linha, variação do saldo/candles e distribuição;
- SR-018 a SR-022 recebem metas, progresso e gamificação responsável;
- SR-023 recebe FinControl IA com consentimento e cálculos determinísticos;
- cartões, orçamentos, compromissos, relatórios, importação, configurações e landing page permanecem em itens próprios.

Governança:

- cada item executa os Dias 1 a 7;
- nenhuma rota ou ação sem fluxo funcional;
- nenhuma biblioteca de gráficos antes do `SP-001`;
- nenhuma promessa de IA ou offline antes de capacidade real;
- a próxima small release continua dependendo de seleção humana explícita entre os itens `READY`/`DISCOVERY` aplicáveis.

## Marco 9 - Periodos e Evolucao

Ordem: SR-012 periodos, SR-013 agregacao/tabela acessivel, SP-001 biblioteca de graficos e SR-014 grafico de linha.

## Marco 10 - Candles Financeiros

SR-015 entrega OHLC de saldo, intervalos vazios, tooltip acessivel, volume e seletor Linha/Candles, sem recursos de trading.

## Marco 11 - Distribuicao de Frequencia

SR-016 entrega algoritmo continuo, tabela, FI, FR, percentuais, acumuladas e medidas agrupadas. SR-017 adiciona histograma, toggle, filtros e comparacao. O metodo inicial usa `k = ceil(sqrt(n))`.

## Marco 12 - Metas e Gamificacao

Ordem: SR-018 metas/contribuicoes, SR-019 progresso/projecao, SR-020 eventos/pontos/conquistas, SR-021 desafios/sequencias e SR-022 desafios opcionais baseados em frequencia.

## Marco 13 - Insights de IA

SR-023 entra somente com calculos deterministas, consentimento, minimizacao e politica de privacidade.

## Cadencia

Cada SR executa, sem salto, Dias 1 a 7. Nenhum marco autoriza implementacao one-shot ou varias SRs simultaneas.
