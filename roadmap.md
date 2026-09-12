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

Estado atual: Dia 7 da SR-011 concluído em `READY_FOR_RELEASE`; a fundação de dados reais de contas, categorias e transações está validada para entrega incremental de código.

Evidência da SR-007: pipeline final verde com 21 suítes e 110 testes, cadastro local acessível e nenhuma persistência real antecipada.

Recorte da SR-007: domínio, contrato e cadastro local de conta financeira, sem Supabase Database, migrations, autenticação ou RLS.

Recorte da SR-008: login por e-mail/senha, logout, identidade validada no servidor, Proxy do Next.js 16 e proteção de rotas privadas; cadastro, recuperação, OAuth, MFA, banco financeiro e RLS permanecem fora.

Evidência da SR-009: migrations `20260714053335_create_financial_accounts` e `20260714061527_optimize_financial_accounts_rls_auth_initplan`, 70 testes pgTAP verdes, Performance Advisor limpo, 36 suítes/170 testes Jest, audit sem vulnerabilidades e build verde; no Dia 7, os testes SQL transacionais preservaram as duas contas reais existentes, grants/RLS foram confirmados e o threat model e a baseline de observabilidade foram registrados.

Recorte da SR-010: criar e listar categorias próprias com nome normalizado e `kind` `income | expense`; rota `/categories` como subfluxo de transações, grants mínimos `SELECT/INSERT`, RLS por proprietário e futura integridade composta com transações. Edição, exclusão, personalização visual, seeds e transações persistidas permanecem fora.

Evidência da SR-010: migration `20260717022313_create_categories`, 65 testes pgTAP verdes, Performance Advisor limpo, 53 suítes/255 testes Jest, audit sem vulnerabilidades e build verde; no Dia 7, grants/RLS, threat model e baseline de observabilidade foram confirmados sem persistir fixtures.

Recorte da SR-011: criar e consultar por mês transações manuais próprias, com data civil, FKs compostas para conta/categoria, compatibilidade `type/kind`, grants mínimos `SELECT/INSERT` e RLS por proprietário. Edição, exclusão, status, transferência, cartão, recorrência, importação e dashboard persistente permanecem fora.

Evidência do Dia 3 da SR-011: migrations `20260717070131_create_transactions` e `20260717070559_add_transaction_fk_indexes`, 89 asserções pgTAP verdes, 55 suítes/271 testes Jest, type-check/lint/audit/build verdes e nenhuma fixture persistida. O Security Advisor manteve somente `SEC-AUTH-001`; os únicos avisos de performance são índices recém-criados ainda sem uso porque a tabela está vazia.

Evidência do Dia 4 da SR-011: DTO sem ownership, Server Actions com claims revalidadas, criação e leitura mensal persistentes, estados loading/error/empty/configuração ausente, 61 suítes/289 testes Jest e lint/type-check/audit/build verdes. A rota autenticada foi inspecionada sem erros de console e sem persistir fixtures.

Evidência do Dia 5 da SR-011: `TX-PERF-001` encerrada com uma única leitura mensal, resumo puro reutilizável e mapeadores de IDs persistidos; 61 suítes/292 testes Jest e lint/type-check/audit/build verdes, sem alteração remota.

Evidência do Dia 6 da SR-011: formulário bloqueia todos os campos durante o envio, move foco para erro local e limpa feedback obsoleto; desktop, `390 x 844` e `320 x 800` foram validados sem overflow, manifesto honesto preservado e 61 suítes/292 testes permaneceram verdes.

Evidência do Dia 7 da SR-011: divergência de Anonymous Sign-In no Proxy corrigida em TDD; 61 suítes/294 testes, lint, type-check, audit e build verdes; 89 asserções pgTAP com rollback, migrations alinhadas, Performance Advisor limpo e threat model/observabilidade documentados.

Próximo passo concluído em 2026-08-25: Dia 1 da `SR-012 — Períodos financeiros` concluiu discovery, domínio e arquitetura. Deploy público continua condicionado a `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001`.

Saida: dados isolados por usuario e prontos para consultas por periodo.

## Trilha Transversal — FinControl Pulse

Status: `UI-001`, `UI-002` e `UI-003` concluídas; Dia 7 da `UI-003` encerrou em 2026-08-29 no estado `READY_FOR_RELEASE`; `UI-004` a `UI-006` permanecem em `DISCOVERY`. O dashboard Pulse usa fonte real, composição server-side e passou por pipeline, segurança, observabilidade, hardening responsivo, acessível e PWA sem promessa offline.

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

Saída arquitetural da UI-002 no Dia 1:

- rotas navegáveis limitadas a `/dashboard`, `/transactions` e `/accounts`;
- `/` permanece alias do dashboard e compartilha o estado ativo de Visão geral;
- sidebar expandida em desktop, rail compacto em tablet e navegação inferior com três destinos em mobile;
- `PrivateAppShell` permanece composition root visual e conserva autenticação, tema e logout já validados;
- componentes do shell ficam próximos ao App Router até existir reutilização real; nenhuma nova primitive compartilhada foi autorizada;
- busca, notificações, perfil, configurações, botão “Adicionar” e rotas futuras continuam ausentes.

Ciclo concluído: Dia 7 da `SR-014 — Gráfico de linha da evolução` encerrou em `READY_FOR_RELEASE`. O gráfico está integrado, expansível e responsivo em desktop/mobile, com safe areas, fullscreen progressivo, tabela acessível e pipeline verde.

Mudança transversal entregue no Dia 4: `UX-CHART-001` criou um frame expansível reutilizável com overlay CSS e Fullscreen API progressiva. O gráfico de evolução é o primeiro consumidor; candles e histogramas futuros deverão adotar o mesmo contrato em suas próprias releases.

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

### UX-SHELL-001 — Cabeçalho responsivo compacto

Estado atual: Dia 7 concluído em `READY_FOR_RELEASE`. Mobile, tablet e desktop foram validados sem overflow; foco, teclado, backdrop, contraste WCAG AA, PWA, segurança local, Supabase, Preview Vercel e PR ficaram verdes, com 86 suítes/505 testes, lint, type-check, audit e build aprovados.

Objetivo: reduzir a topbar privada a uma única linha e mover sessão, tema e logout para um painel da conta responsivo, recuperando espaço vertical em todas as páginas.

Composição aprovada:
- mobile: marca compacta, trigger de conta no canto superior direito e bottom sheet;
- tablet/desktop: contexto discreto da rota, trigger de conta e painel ancorado à direita;
- navegação inferior e sidebar/rail permanecem como navegação primária e não são duplicadas;
- o título principal permanece na página, eliminando a repetição no header mobile;
- nenhuma dependência, rota, Auth, Supabase ou dado novo.

Sequência:
1. `UX-SHELL-001A` — contratos de apresentação e implementação mínima;
2. `UX-SHELL-001B` — responsividade, foco, teclado, backdrop e scroll;
3. `UX-SHELL-001C` — consistência visual, safe areas e validação PWA em 320/768/1280 px.

Próximo passo: versionar a documentação e atualizar a PR `#23`; depois, mediante decisão humana, realizar squash merge em `develop`. Produção pública permanece bloqueada por `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001B`.

## Marco 9 - Periodos e Evolucao

Ordem: SR-012 periodos, SR-013 agregacao/tabela acessivel, SP-001 biblioteca de graficos e SR-014 grafico de linha.

Estado atual: SR-013, UI-003, SP-001, SR-014 e SR-015 concluídos. Linha e candles estão integrados, expansíveis, acessíveis, responsivos e isolados em `/` e `/dashboard`. A SR-015 encerrou o Dia 7 em `READY_FOR_RELEASE`, com pipeline local, segurança, Supabase, Vercel, observabilidade e PR validados.

Próximo passo concluído: PR `#19` mesclada por squash em `develop` no commit `496424e`; deployment Vercel da branch ficou `READY` e sem erro/fatal recente.

## Marco 10 - Candles Financeiros

SR-015 entrega OHLC diário de saldo, intervalos vazios, tabela/tooltip acessíveis, volume e seletor Linha/Candles sobre o mesmo snapshot server-side, sem recursos de trading. A primeira release cobre somente os períodos atuais de até 31 dias; granularidades longas dependem de ciclo próprio.

Evidência do Dia 3: agregador determinístico, DTO e mapper, registro modular de Candlestick, seletor local, tabela textual e frame expansível estão integrados; lint, type-check, build, analyzer e 83 suítes/470 testes estão verdes. O chunk ECharts permanece exclusivo de `/` e `/dashboard`, com delta gzip de 7.437 bytes.

Evidência do Dia 4: tooltip rotulado, direção textual, fallback com tabela, vazio, lifecycle, expansão e região ativa nomeada estão cobertos; lint, type-check, build, analyzer e 84 suítes/479 testes permanecem verdes, com delta de apenas 286 bytes gzip.

Evidência do Dia 5: `useFinancialChart` extrai somente inicialização, resize, preferências visuais, atualização e cleanup já duplicados; builders e estados concretos permanecem nas ilhas, sem `ChartPort`. Lint, type-check, build e 84 suítes/480 testes estão verdes; o chunk ficou em 525.257 bytes brutos e 179.344 bytes gzip.

Evidência do Dia 6: o mapper normaliza `timestamptz` válido na fronteira, as duas tabelas executam rolagem horizontal por setas e o dashboard autenticado foi validado em 320, 768 e 1280 px sem overflow global ou erros no console. Expansão/foco, manifesto PWA e pipeline local ficaram verdes com 84 suítes/482 testes.

Evidência do Dia 7: 84 suítes/482 testes, lint, type-check, build e auditorias npm ficaram verdes; bundle permaneceu restrito a `/` e `/dashboard`. Migrations locais/remotas estão alinhadas, logs recentes não indicaram erro explícito/fatal/5xx, preview está `READY` e checks da PR `#19` estão verdes. A entrega incremental pode ser mergeada após a atualização documental e nova validação remota, mas produção pública continua bloqueada pelos hardenings globais já registrados.

## Marco 10A - Interações avançadas dos candles

Ordem aprovada: `UX-CHART-002 — Extrato contextual do candle` e, depois de seu ciclo completo, `UX-CHART-003 — Períodos e granularidade adaptativa`.

Estado da `UX-CHART-002`: Dia 7 concluído em `READY_FOR_RELEASE`. Pipeline, supply chain, threat model, Supabase, observabilidade, Preview e PR foram validados no head `f865576`. A PR `#24` está draft, mergeável, limpa e com checks verdes; produção pública permanece bloqueada pelos hardenings globais já registrados.

Small releases da `UX-CHART-002`:
1. `002A` — contratos, DTO, consulta sob demanda e Server Action;
2. `002B` — seleção no ECharts/tabela e painel responsivo;
3. `002C` — concorrência, acessibilidade, responsividade e validação real.

Extensão priorizada: `UX-CHART-002D — Volume e insight contextual do intervalo`, com Dia 7 concluído em `READY_FOR_RELEASE` e GREEN. Volume e resultado líquido ganharam prioridade em largura total no celular, receitas/despesas preservam a leitura comparativa e o disclosure respeita reduced motion. As 93 suítes/562 testes, lint, type-check, audit e build estão verdes; Supabase saudável e alinhado, Preview da PR `#26` `READY` e observabilidade sem erro de runtime em 24 horas.

Estado da `UX-CHART-003`: `003A` foi mesclada em `develop` no commit `7434159`; `003B` foi mesclada pela PR `#28` no commit `45d1bab`; `003C1` foi mesclada pela PR `#30` no commit `a96b564`, após foco acionável, modal responsivo autenticado e 669 testes verdes. A feature pai permanece em andamento para `003C2/003C3`.

Decisões: `adr/0019-contextual-candle-statement.md`, `adr/0020-adaptive-financial-periods.md`, `adr/0021-contextual-interval-volume-insights.md` e `adr/0022-all-custom-periods-and-progressive-drilldown.md`.

Próximo passo de software: iniciar a `003C2` somente após novo comando explícito.

## Hardening pré-produção — SEC-AUTH-001

Estado atual: Dia 1 concluído com arquitetura registrada no ADR 0016. O Security Advisor confirma proteção contra senhas vazadas desativada, e a organização está no plano Supabase Free.

Bloqueio: o recurso nativo exige Pro ou superior. Nenhuma configuração Auth foi alterada e produção pública permanece bloqueada. Por decisão humana, o upgrade foi adiado enquanto o app permanecer em desenvolvimento e previews privados.

Próximo passo selecionado: executar o Dia 1 da `SEC-HARD-001`. Retomar o Dia 2 da `SEC-AUTH-001` somente após o upgrade humano para Pro ou superior, antes da produção pública.

## Hardening pré-produção — SEC-HARD-001

Estado atual: Dia 7 da `SEC-HARD-001A` concluído em `READY_FOR_RELEASE`. As 85 suítes/494 testes, lint, type-check, auditorias npm e build estão verdes; Supabase, Preview, observabilidade e PR `#22` foram validados no head `f8049e4`, sem regressão crítica.

Sequência aprovada:
1. `SEC-HARD-001A` — TDD e implementação dos headers determinísticos no Next.js;
2. validação em Preview da resposta real, hidratação, tema, login, sessão, gráficos e PWA;
3. `SEC-HARD-001B` — somente após decisão humana sobre CAPTCHA e credenciais externas.

Decisão de borda: rate limit WAF sobre `/login` não protege o password grant enviado pelo browser diretamente ao Supabase. Não será criado proxy próprio de senha para contornar essa fronteira.

Próximo passo: versionar a documentação do Dia 7 e atualizar a PR `#22`; realizar squash merge em `develop` somente após os novos checks verdes. Produção pública permanece condicionada a `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001B`.

## Marco 11 - Distribuicao de Frequencia

SR-016 entrega algoritmo continuo, tabela, FI, FR, percentuais, acumuladas e medidas agrupadas. SR-017 adiciona histograma, toggle, filtros e comparacao. O metodo inicial usa `k = ceil(sqrt(n))`.

## Marco 12 - Metas e Gamificacao

Ordem: SR-018 metas/contribuicoes, SR-019 progresso/projecao, SR-020 eventos/pontos/conquistas, SR-021 desafios/sequencias e SR-022 desafios opcionais baseados em frequencia.

## Marco 13 - Insights de IA

SR-023 entra somente com calculos deterministas, consentimento, minimizacao e politica de privacidade.

## Marco 14 — Portfólio técnico e LinkedIn

Small release inicial: `LINKEDIN-001 — Posicionamento e portfólio técnico do FinControl`.

Estado atual: `READY_FOR_RELEASE`. O Dia 7 revalidou a evidência Supabase e a PR `#33` passou em `validate` e Vercel no commit de conteúdo `201fe3f`. O `final.md` do `LI-POST-002` foi aprovado internamente em 2026-09-12 e aguarda integração; nenhum conteúdo foi publicado.

Sequência planejada:
1. aprovar posicionamento, público, claims permitidos e critérios editoriais;
2. consolidar banco de evidências e três briefs de posts;
3. produzir e revisar um post por small release, sem publicação automática;
4. publicar somente após aceite humano explícito do texto final.

Primeira narrativa planejada: como os candles foram adaptados de uma metáfora de trading para uma leitura acessível de finanças pessoais. O draft depende da conclusão da `UX-CHART-003C2/003C3` para refletir o fluxo completo.

## Cadencia

Cada SR executa, sem salto, Dias 1 a 7. Nenhum marco autoriza implementacao one-shot ou varias SRs simultaneas.
