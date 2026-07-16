# Backlog

## READY

Nenhum item pronto aguardando início no momento.

## IN_PROGRESS

### UI-002 — Shell e navegação responsiva
- Tipo: Small Release / UX Improvement
- Descrição objetiva: evoluir `PrivateAppShell` com sidebar, topbar e barra inferior mobile exibindo somente rotas funcionais.
- Objetivo de negócio: permitir orientação e acesso rápido aos fluxos existentes.
- Valor esperado: experiência coerente em desktop, tablet e mobile.
- Prioridade: Alta
- Dependências: UI-001 concluída e matriz atual de rotas privadas (`/dashboard`, `/transactions` e `/accounts`).
- Risco: Médio por afetar todas as rotas privadas, o estado ativo e o logout.
- Fase atual: Dia 2 concluído; 14 cenários planejados em RED válido e implementação bloqueada até o Dia 3.
- Recorte aprovado:
  - desktop a partir de `1024px`: sidebar expandida com marca, Visão geral, Transações e Contas;
  - tablet entre `768px` e `1023px`: rail compacto persistente, com nomes acessíveis e sem interação exclusiva por hover;
  - mobile abaixo de `768px`: topbar compacta e navegação inferior com Início, Transações e Contas;
  - `/dashboard` é o destino canônico de início; `/` permanece alias e também ativa Visão geral;
  - item atual expõe `aria-current="page"`, foco visível e alvo mínimo de 44 × 44 px;
  - e-mail, preferência de tema e logout permanecem disponíveis sem misturar regra financeira no shell.
- Fora do escopo: busca, notificações, perfil, configurações, ajuda, Cartões, Planejamento, Orçamentos, Metas, Relatórios, Importações, IA, botão central “Adicionar”, drawer, bottom sheet, novas rotas e mudanças no Supabase.
- Critério de pronto: navegação ativa por rota e alias, teclado, foco, 44 px, mobile sem overflow, logout preservado, temas preservados, rotas indisponíveis ausentes e pipeline verde.
- Status: IN_PROGRESS

## DISCOVERY

### EPIC-UI-001 — FinControl Pulse
- Tipo: Épico
- Descrição objetiva: consolidar identidade visual, navegação, dashboard, páginas internas e copywriting em uma experiência moderna e coerente.
- Objetivo de negócio: transformar o FinControl em uma central de decisões financeiras, não apenas um registrador.
- Valor esperado: maior clareza, confiança, adoção e percepção de qualidade.
- Prioridade: Alta
- Dependências: arquitetura atual e execução incremental dos itens `UI-001` a `UI-006` e SRs de domínio relacionadas.
- Risco: Alto se executado como redesenho único; Médio quando fatiado.
- Fase recomendada: trilha transversal, uma small release por vez.
- Critério de pronto: itens filhos concluídos sem rotas vazias, dados fictícios ou quebra arquitetural.
- Especificação: `docs/product/fincontrol-pulse-interface-copy.md`.
- Status: DISCOVERY

### UI-003 — Dashboard FinControl Pulse
- Tipo: Small Release / UX Improvement
- Descrição objetiva: reorganizar o dashboard em grid responsivo, saudação neutra, métricas suportadas, empty state, movimentações e ações disponíveis.
- Objetivo de negócio: responder com clareza ao estado financeiro realmente calculável.
- Valor esperado: visão rápida sem promessas ou indicadores fictícios.
- Prioridade: Alta
- Dependências: UI-001, UI-002 e casos de uso/dados disponíveis.
- Risco: Alto se “disponível de verdade” ou projeções forem antecipados.
- Fase recomendada: após shell; expansão progressiva com SR-012 a SR-023.
- Critério de pronto: apenas dados reais, todos os estados, copy aprovada, acessibilidade e pipeline verde.
- Status: DISCOVERY

### UI-004 — Experiência de contas em cards e drawer
- Tipo: Small Release / UX Improvement
- Descrição objetiva: tornar a listagem de contas conteúdo principal e abrir cadastro em drawer/modal responsivo.
- Objetivo de negócio: facilitar leitura e cadastro sem formulário permanente.
- Valor esperado: uso mais limpo da persistência já entregue na SR-009.
- Prioridade: Alta
- Dependências: SR-009 e UI-001; instituição, sincronização e saldo atual continuam fora até contratos próprios.
- Risco: Médio.
- Fase recomendada: após UI-001; pode preceder UI-003 se selecionada explicitamente.
- Critério de pronto: cards usam somente campos reais, drawer acessível, foco restaurado, estados preservados e testes verdes.
- Status: DISCOVERY

### UI-005 — Experiência de transações orientada à listagem
- Tipo: Small Release / UX Improvement
- Descrição objetiva: listagem como conteúdo principal, filtros suportados e formulário em drawer/bottom sheet.
- Objetivo de negócio: reduzir carga visual e facilitar revisão de movimentações.
- Valor esperado: fluxo escalável para busca, agrupamento e análise.
- Prioridade: Alta
- Dependências: SR-010, SR-011 e UI-001.
- Risco: Alto antes da persistência e dos contratos de status/transferência.
- Fase recomendada: após SR-011.
- Critério de pronto: dados persistentes, agrupamento testado, filtros reais, formulário acessível e nenhuma opção sem contrato.
- Status: DISCOVERY

### UI-006 — Login, microcopy e instalação PWA
- Tipo: Small Release / UX Improvement
- Descrição objetiva: aplicar marca/copy do FinControl ao login e aos estados globais e oferecer instalação PWA quando suportada.
- Objetivo de negócio: melhorar confiança, onboarding e clareza de feedback.
- Valor esperado: comunicação humana sem enfraquecer segurança.
- Prioridade: Média
- Dependências: UI-001, SR-008 e suporte real do navegador à instalação.
- Risco: Médio; copy não pode enumerar usuário, prometer offline ou expor fluxo inexistente.
- Fase recomendada: após UI-001.
- Critério de pronto: login acessível, erros genéricos, microcopy testada, instalação progressiva e fallback seguro.
- Status: DISCOVERY

### FEAT-BUDGET-001 — Orçamentos por categoria
- Tipo: Feature
- Descrição objetiva: limites por categoria, progresso e estados saudável/atenção/ultrapassado.
- Objetivo de negócio: permitir planejamento mensal acionável.
- Valor esperado: antecipar desvios antes do fim do período.
- Prioridade: Alta
- Dependências: SR-010, SR-011 e SR-012.
- Risco: Alto por regras de período, estorno e categoria.
- Fase recomendada: após categorias e transações persistidas.
- Critério de pronto: domínio, migrations/RLS, cálculos testados e barras acessíveis; IA permanece fora.
- Status: DISCOVERY

### FEAT-COMMITMENTS-001 — Próximos compromissos
- Tipo: Feature
- Descrição objetiva: linha do tempo de contas, parcelas, assinaturas, faturas e receitas previstas.
- Objetivo de negócio: antecipar obrigações e risco de saldo insuficiente.
- Valor esperado: transformar planejamento em ação preventiva.
- Prioridade: Alta
- Dependências: transações persistidas, cartões/faturas/parcelas, recorrência e status.
- Risco: Alto por datas, timezone e dupla contagem.
- Fase recomendada: após domínios correspondentes.
- Critério de pronto: eventos determinísticos, estados testados e alertas sem pânico ou dado inventado.
- Status: DISCOVERY

### FEAT-REPORTS-001 — Relatórios e comparação de períodos
- Tipo: Feature
- Descrição objetiva: relatórios por evolução, categoria, conta, cartão, dia, faixa e recorrência.
- Objetivo de negócio: permitir análise detalhada e comparação explicável.
- Valor esperado: decisões baseadas em histórico real.
- Prioridade: Média
- Dependências: SR-012 a SR-017 e domínios persistentes aplicáveis.
- Risco: Alto por privacidade, performance e consistência de agregação.
- Fase recomendada: após analytics básicos.
- Critério de pronto: filtros testados, tabela acessível e comparação equivalente; exportações entram em release separada.
- Status: DISCOVERY

### FEAT-PREFERENCES-001 — Perfil, tema e preferências
- Tipo: Feature
- Descrição objetiva: preferências de apresentação e comunicação, sem misturar autorização com perfil editável.
- Objetivo de negócio: personalizar experiência de forma segura.
- Valor esperado: tema persistente, saudação consentida e controles claros.
- Prioridade: Média
- Dependências: UI-001, contrato de perfil e RLS se houver persistência server-side.
- Risco: Médio por privacidade e flash de tema.
- Fase recomendada: após decisão de persistência da UI-001.
- Critério de pronto: preferências tipadas, acessíveis, isoladas de autorização e sem dados financeiros em browser storage.
- Status: DISCOVERY

### MKT-001 — Landing page e copy de aquisição
- Tipo: Feature / UX Improvement
- Descrição objetiva: apresentar marca, benefícios, segurança e CTA com capacidades realmente lançadas.
- Objetivo de negócio: explicar valor e apoiar aquisição.
- Valor esperado: posicionamento consistente como copiloto financeiro.
- Prioridade: Baixa enquanto não houver autorização de deploy público.
- Dependências: marca UI-001, capacidades lançadas e hardening de produção.
- Risco: Médio por promessa excessiva de IA, disponível real ou offline.
- Fase recomendada: antes do lançamento público, em release própria.
- Critério de pronto: copy revisada contra features disponíveis, acessibilidade, performance, privacidade e CTA funcional.
- Status: DISCOVERY

### AUTH-EXT-001 — Cadastro e recuperação de acesso
- Tipo: Feature / Security Item
- Descrição objetiva: permitir criar conta e recuperar senha sem enumeração de usuário.
- Objetivo de negócio: completar onboarding e recuperação de acesso.
- Valor esperado: reduzir dependência de provisionamento manual.
- Prioridade: Alta antes de lançamento público.
- Dependências: SR-008, configuração segura do Supabase Auth, e-mail transacional e threat model atualizado.
- Risco: Alto por abuso, enumeração, redirects e entrega de e-mail.
- Fase recomendada: ciclo próprio antes de expor os links no login.
- Critério de pronto: testes de segurança, rate limit/antiabuso, mensagens genéricas, redirect permitido e pipeline verde.
- Status: DISCOVERY

### SP-AUTH-002 — Biometria/passkeys
- Tipo: Spike / Security Item
- Descrição objetiva: avaliar passkeys/WebAuthn como autenticação futura sem prometer biometria prematuramente.
- Objetivo de negócio: oferecer acesso resistente a phishing quando estável e adequado.
- Valor esperado: segurança e conveniência.
- Prioridade: Baixa
- Dependências: cadastro estável, domínio HTTPS e suporte oficial maduro.
- Risco: Alto por compatibilidade, recuperação e mudanças de API.
- Fase recomendada: investigação futura limitada.
- Critério de pronto: ADR com suporte, fallback, recuperação, riscos e decisão de adoção; sem código de produção.
- Status: DISCOVERY

### FEAT-SEARCH-001 — Busca financeira global
- Tipo: Feature
- Descrição objetiva: buscar movimentações, contas e entidades suportadas sem atravessar RLS.
- Objetivo de negócio: localizar informações rapidamente.
- Valor esperado: navegação eficiente em históricos maiores.
- Prioridade: Média
- Dependências: SR-010, SR-011 e contratos de busca por feature.
- Risco: Alto por privacidade, performance e vazamento entre usuários.
- Fase recomendada: após persistência e índices adequados.
- Critério de pronto: contratos paginados, RLS validada, índices/advisors verdes, estados acessíveis e nenhum log de termo sensível.
- Status: DISCOVERY

### FEAT-NOTIFICATIONS-001 — Alertas e notificações financeiras
- Tipo: Feature / Security Item
- Descrição objetiva: comunicar compromissos e mudanças relevantes com opt-in e conteúdo minimizado.
- Objetivo de negócio: ajudar o usuário a agir antes do problema.
- Valor esperado: prevenção e retorno útil ao produto.
- Prioridade: Média
- Dependências: compromissos determinísticos, preferências e estratégia de canais.
- Risco: Alto por dado sensível, consentimento e falso alerta.
- Fase recomendada: após `FEAT-COMMITMENTS-001`.
- Critério de pronto: opt-in/out, redaction, timezone, deduplicação, testes e nenhuma informação financeira sensível em lock screen por padrão.
- Status: DISCOVERY

### FEAT-EXPORT-001 — Exportação de relatórios
- Tipo: Feature / Security Item
- Descrição objetiva: exportar PDF e planilha a partir de relatório filtrado e autorizado.
- Objetivo de negócio: permitir arquivo e análise externa consciente.
- Valor esperado: portabilidade dos próprios dados.
- Prioridade: Baixa
- Dependências: `FEAT-REPORTS-001`, autorização server-side e política de retenção.
- Risco: Alto por geração de artefato financeiro sensível.
- Fase recomendada: release separada após relatórios.
- Critério de pronto: confirmação explícita, escopo do arquivo visível, testes, acessibilidade, tratamento seguro e nenhuma URL pública permanente.
- Status: DISCOVERY

### SR-010 - Persistencia e RLS de categorias
- Tipo: Small Release
- Objetivo de negocio: substituir categorias demonstrativas.
- Valor esperado: classificacao real por usuario.
- Prioridade: Alta
- Dependencias: SR-008 e SR-009.
- Risco: Alto
- Fase recomendada: ciclo seguinte.
- Criterio de pronto: migration, repositorio, RLS e testes de isolamento.
- Status: DISCOVERY

### SR-011 - Persistencia e RLS de transacoes
- Tipo: Security Item / Small Release
- Objetivo de negocio: tornar o registro manual utilizavel com dados reais.
- Valor esperado: historico financeiro persistente.
- Prioridade: Critica
- Dependencias: SR-008 a SR-010.
- Risco: Alto
- Fase recomendada: ciclo seguinte.
- Criterio de pronto: repositorio Supabase, RLS, status definido e testes de isolamento.
- Status: DISCOVERY

### SR-012 - Periodos financeiros
- Tipo: Small Release
- Objetivo de negocio: analisar antes do fechamento mensal.
- Valor esperado: semana, 7 dias, quinzena, 15 dias e mes sem ambiguidade.
- Prioridade: Alta
- Dependencias: SR-011.
- Risco: Medio
- Fase recomendada: primeiro ciclo de analytics.
- Criterio de pronto: tipos de dominio, timezone e filtros testados.
- Status: DISCOVERY

### SR-013 - Agregacao da evolucao financeira
- Tipo: Small Release
- Objetivo de negocio: explicar saldo, receitas, despesas e liquido no tempo.
- Valor esperado: base matematica para graficos e IA.
- Prioridade: Alta
- Dependencias: SR-012 e saldo inicial confiavel.
- Risco: Alto
- Fase recomendada: apos SR-012.
- Criterio de pronto: funcao pura testada e tabela acessivel, sem biblioteca visual.
- Status: DISCOVERY

### SP-001 - Avaliar biblioteca de graficos
- Tipo: Spike
- Objetivo de negocio: reduzir risco tecnico de linha e candles.
- Valor esperado: menor dependencia com mobile e acessibilidade.
- Prioridade: Alta
- Dependencias: view model da SR-013.
- Risco: Medio
- Fase recomendada: investigacao limitada antes da SR-014.
- Criterio de pronto: ADR comparando opcoes e definindo adapter; sem grafico de producao.
- Status: DISCOVERY

### SR-014 - Grafico de linha da evolucao
- Tipo: Small Release
- Objetivo de negocio: tornar tendencia financeira visual.
- Valor esperado: leitura rapida sem perder tabela acessivel.
- Prioridade: Alta
- Dependencias: SR-013 e SP-001.
- Risco: Medio
- Fase recomendada: apos spike.
- Criterio de pronto: responsivo, acessivel, estados tratados e testes de componente.
- Status: DISCOVERY

### SR-015 - Candles financeiros
- Tipo: Small Release
- Objetivo de negocio: mostrar abertura, maxima, minima e fechamento do saldo.
- Valor esperado: leitura avancada inspirada em exchanges sem trading.
- Prioridade: Media
- Dependencias: SR-013, SR-014, saldo inicial e ordenacao estavel.
- Risco: Alto
- Fase recomendada: apos grafico simples.
- Criterio de pronto: OHLC e vazios testados, tooltip acessivel e sem recursos de trading.
- Status: DISCOVERY

### SR-016 - Distribuicao de frequencia continua
- Tipo: Small Release
- Objetivo de negocio: revelar concentracao de despesas por faixa.
- Valor esperado: FI, FR, percentuais, acumuladas e medidas agrupadas explicaveis.
- Prioridade: Alta
- Dependencias: SR-011 e SR-012.
- Risco: Alto
- Fase recomendada: apos base de periodos.
- Criterio de pronto: `ceil(sqrt(n))`, invariantes testadas, tabela acessivel e estimativas rotuladas.
- Status: DISCOVERY

### SR-017 - Histograma e frequencia opcional
- Tipo: Small Release
- Objetivo de negocio: oferecer analise visual sem sobrecarregar iniciantes.
- Valor esperado: histograma, toggle, filtros e comparacao.
- Prioridade: Media
- Dependencias: SR-016 e SP-001.
- Risco: Medio
- Fase recomendada: apos tabela estatistica.
- Criterio de pronto: histograma/tabela equivalentes, toggle desligado por padrao e mobile acessivel.
- Status: DISCOVERY

### SR-018 - Metas e contribuicoes
- Tipo: Small Release
- Objetivo de negocio: transformar planejamento em objetivo mensuravel.
- Valor esperado: metas, contribuicoes e progresso confiavel.
- Prioridade: Alta
- Dependencias: SR-008 e fundacao RLS.
- Risco: Alto
- Fase recomendada: antes da gamificacao.
- Criterio de pronto: dominio, migrations, RLS, contribuicoes e testes.
- Status: DISCOVERY

### SR-019 - Progresso e projecao de metas
- Tipo: Small Release
- Objetivo de negocio: mostrar ritmo necessario e previsao.
- Valor esperado: decisao clara sem promessa enganosa.
- Prioridade: Media
- Dependencias: SR-018.
- Risco: Medio
- Fase recomendada: apos metas basicas.
- Criterio de pronto: restante, ritmo e previsao explicavel com estados acessiveis.
- Status: DISCOVERY

### SR-020 - Eventos, pontos e conquistas
- Tipo: Small Release
- Objetivo de negocio: motivar comportamentos saudaveis.
- Valor esperado: progresso auditavel sem premiar gasto.
- Prioridade: Media
- Dependencias: SR-018 e SR-019.
- Risco: Alto
- Fase recomendada: primeiro ciclo de gamificacao.
- Criterio de pronto: idempotencia, pontos auditaveis e seis conquistas iniciais.
- Status: DISCOVERY

### SR-021 - Desafios e sequencias
- Tipo: Small Release
- Objetivo de negocio: apoiar consistencia sem punicao.
- Valor esperado: desafios opcionais, pausa e retomada.
- Prioridade: Media
- Dependencias: SR-020.
- Risco: Alto
- Fase recomendada: apos eventos estaveis.
- Criterio de pronto: linguagem acolhedora, opt-in e testes de quebra/retomada.
- Status: DISCOVERY

### SR-022 - Gamificacao baseada em frequencia
- Tipo: Small Release
- Objetivo de negocio: converter diagnosticos em desafios revisaveis.
- Valor esperado: reduzir repeticao prejudicial com contexto.
- Prioridade: Baixa
- Dependencias: SR-016, SR-017 e SR-021.
- Risco: Alto
- Fase recomendada: apos analytics e gamificacao estaveis.
- Criterio de pronto: excluir/sinalizar essenciais, emergencias, transferencias, investimentos e dividas.
- Status: DISCOVERY

### SR-023 - Insights de IA para analytics e metas
- Tipo: Feature / Small Release
- Objetivo de negocio: explicar dados e sugerir proximos passos.
- Valor esperado: diferencial de copiloto financeiro.
- Prioridade: Media
- Dependencias: SR-013, SR-016, SR-019, consentimento e privacidade.
- Risco: Alto
- Fase recomendada: ultimo marco desta sequencia.
- Criterio de pronto: dados minimizados, opt-out, testes de contrato e nenhuma acao automatica.
- Status: DISCOVERY

### Modelar cartão, fatura e parcelas
- Tipo: Feature
- Descrição: Refinar entidades e casos de uso para cartão de crédito, fechamento, vencimento e compras parceladas.
- Objetivo de negócio: cobrir comportamento financeiro crítico para usuários brasileiros.
- Valor esperado: permitir previsão de faturas futuras.
- Prioridade: Alta
- Dependências: transações manuais e resumo mensal
- Risco: Alto
- Fase recomendada: Dia 1 para discovery, Dia 3+ para implementação futura
- Critério de pronto: regras de fatura e parcelas testáveis documentadas; a apresentação posterior cobre card, limite, fatura, fechamento, vencimento, parcelas e comprometimento somente com dados reais.
- Status: DISCOVERY

### Importação de extrato CSV/OFX
- Tipo: Feature
- Descrição: Importar transações por arquivo antes de Open Finance.
- Objetivo de negócio: reduzir trabalho manual sem integração bancária sensível.
- Valor esperado: acelerar adoção do app.
- Prioridade: Média
- Dependências: transações e categorias
- Risco: Médio
- Fase recomendada: ciclo futuro
- Critério de pronto: parser testado, import batch registrado e revisão do usuário antes da persistência.
- Status: DISCOVERY

### Análise financeira com IA (incorporada à SR-023)
- Tipo: Feature
- Descrição: Gerar explicações sobre gastos, alertas e sugestões baseadas nos dados do usuário.
- Objetivo de negócio: diferenciar o produto como copiloto financeiro.
- Valor esperado: transformar dados financeiros em decisão prática.
- Prioridade: Média
- Dependências: base de transações, resumo mensal, políticas de segurança
- Risco: Alto
- Fase recomendada: ciclo futuro
- Critério de pronto: substituído pelos critérios detalhados da SR-023.
- Status: DROPPED — consolidado na SR-023 para evitar duplicidade operacional.

## BLOCKED

### Open Finance via Pluggy ou Belvo
- Tipo: Spike
- Descrição: Avaliar provedor, custo, compliance, fluxo de consentimento e impacto técnico.
- Objetivo de negócio: automatizar coleta de dados financeiros com base formal.
- Valor esperado: reduzir lançamento manual no futuro.
- Prioridade: Média
- Dependências: decisão de provedor e revisão de segurança
- Risco: Alto
- Fase recomendada: ciclo futuro
- Critério de pronto: decisão documentada em ADR, riscos mapeados e contrato de integração definido.
- Status: BLOCKED

Motivo do bloqueio: integração externa sensível fora do escopo do MVP inicial e sem decisão de provedor.

## DÍVIDA TÉCNICA

### SEC-AUTH-001 — Ativar proteção contra senhas vazadas
- Tipo: Security Item
- Objetivo de negócio: impedir uso de credenciais conhecidamente comprometidas.
- Valor esperado: reduzir risco de account takeover.
- Prioridade: Alta antes de produção pública
- Dependências: configuração do Supabase Auth.
- Risco: Médio no ambiente atual; Alto em produção pública.
- Fase recomendada: hardening de autenticação antes do deploy público.
- Critério de pronto: proteção ativada no Supabase e advisor de segurança sem o alerta `auth_leaked_password_protection`.
- Status: READY

### DB-PERF-001 — Investigar advisor `auth_rls_initplan` das contas
- Tipo: Dívida Técnica / Hardening
- Descrição: o advisor de performance sinaliza as policies `financial_accounts_select_own` e `financial_accounts_insert_own`, embora `auth.uid()` e a leitura de `auth.jwt()` estejam encapsuladas em subconsultas.
- Objetivo de negócio: preservar desempenho previsível do isolamento por usuário quando a tabela crescer.
- Valor esperado: remover reavaliações por linha ou confirmar de forma auditável um falso positivo do advisor.
- Prioridade: Média
- Dependências: migration `20260714053335_create_financial_accounts` e testes pgTAP da SR-009.
- Risco: Baixo no banco vazio; Médio em escala sem investigação.
- Severidade: MÉDIA
- Fase recomendada: Dia 5 da SR-009.
- Critério de pronto: inspecionar a expressão efetiva das policies, validar a orientação atual do Supabase e, se necessário, aplicar migration forward-only usando `(select auth.jwt())` sem alterar autorização; testes pgTAP e advisor devem permanecer verdes.
- Resultado: migration `20260714061527_optimize_financial_accounts_rls_auth_initplan` aplicada; 70 testes pgTAP passaram e o Performance Advisor retornou sem alertas.
- Status: DONE

### HARD-OBS-001 — Observabilidade sanitizada antes do deploy público
- Tipo: Hardening / Dívida Técnica
- Objetivo de negócio: diagnosticar indisponibilidade, falhas de sessão e regressões sem coletar dados financeiros ou credenciais.
- Valor esperado: operação segura e auditável em produção.
- Prioridade: Alta antes de deploy público; Média enquanto a entrega permanecer somente como artefato de código.
- Dependências: decisão de plataforma de deploy e provedor de monitoramento.
- Risco: Médio agora e Alto em produção sem captura de erros e métricas.
- Fase recomendada: Dia 7 do ciclo que autorizar o primeiro deploy público.
- Critério de pronto: taxonomia tipada de erros, métricas por resultado técnico, redaction de PII/segredos, replay desativado ou mascarado e teste sintético validado.
- Status: DISCOVERY

### SEC-HARD-001 — Hardening do ambiente de autenticação
- Tipo: Security Item / Dívida Técnica
- Objetivo de negócio: reduzir abuso de login e fortalecer a borda HTTP antes de tráfego público.
- Valor esperado: menor risco de credential stuffing, clickjacking e exposição operacional.
- Prioridade: Média
- Dependências: ambiente de deploy e configuração do projeto Supabase.
- Risco: Médio antes de produção pública.
- Fase recomendada: Dia 7 antes do primeiro deploy público.
- Critério de pronto: rate limits/CAPTCHA avaliados no Supabase, baseline de headers CSP/frame/referrer/HSTS validada e URL HTTPS confirmada.
- Status: DISCOVERY

### CI-HARD-001 — Fixar ações do GitHub por SHA
- Tipo: Dívida Técnica
- Objetivo de negócio: reduzir risco de supply chain no pipeline.
- Valor esperado: execução de CI mais determinística.
- Prioridade: Baixa
- Dependências: hashes oficiais vigentes das actions utilizadas.
- Risco: Baixo com permissões atuais somente de leitura.
- Fase recomendada: próximo hardening de CI.
- Critério de pronto: `checkout` e `setup-node` fixados por SHA e Dependabot/Renovate configurado para atualização controlada.
- Status: DISCOVERY

## DONE

### UI-001 — Sistema visual, marca e temas
- Tipo: Small Release / UX Improvement
- Resultado: marca FinControl, Geist, tokens semânticos, temas claro/escuro/automático e primitives essenciais entregues com acessibilidade e responsividade validadas.
- Escopo concluído: preferência `light | dark | system`, `Button`, `Card`, `FeedbackMessage`, `ThemeSwitcher`, metadata/manifest coerentes e inicialização do tema anterior à hidratação.
- Quality gates: lint, type-check, 41 suítes/194 testes, auditoria com 0 vulnerabilidades, build de produção e `git diff --check` verdes.
- Segurança: apenas `fincontrol.theme` é persistido; nenhum segredo, dado financeiro, migration, RLS ou novo acesso Supabase foi introduzido.
- Fora do escopo preservado: shell, dashboard Pulse, drawers, gráficos, service worker, offline e IA.
- Riscos residuais não críticos: pinagem das GitHub Actions por SHA e validação visual contínua permanecem no hardening já registrado.
- Status: DONE

### SR-009 — Persistência e RLS de contas
- Tipo: Security Item / Small Release
- Resultado: criação e listagem persistentes de contas próprias entregues com identidade server-side, grants mínimos, RLS forçada e isolamento por proprietário.
- Escopo concluído: migration reproduzível, repository `create/listByUser`, mapper, caso de uso, Server Action autenticada, estados acessíveis e validação desktop/mobile.
- Banco: duas migrations aplicadas; 70 asserções pgTAP verdes; Performance Advisor limpo; duas contas existentes preservadas após os testes transacionais do Dia 7.
- Quality gates: lint, type-check, 36 suítes/170 testes Jest, auditoria sem vulnerabilidades e build de produção verdes.
- Segurança: `authenticated` somente com `SELECT`/`INSERT`; `anon`, Auth anônimo, `UPDATE`, `DELETE`, owner forjado e uso de `service_role` pela aplicação bloqueados.
- Riscos residuais: `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001` bloqueiam deploy público, mas não a entrega incremental do código.
- Fora do escopo preservado: edição, exclusão, arquivamento, categorias, transações persistidas, idempotência e offline.
- Status: DONE

### ENV-CHROME-001 — Restaurar comunicação do plugin Chrome
- Tipo: Hardening / Bloqueio operacional
- Resultado: plugin reinstalado na versão `26.707.72221`; conector principal restaurado e sessão autenticada controlada com sucesso.
- Evidência: `/accounts` validada em desktop `1366x543` e mobile `390x844`, sem overflow, com alvos de 44 px, manifesto servido e console limpo; nenhum dado foi modificado.
- Status: DONE

### BUG-001 — Proxy quebra o app com URL inválida do Supabase
- Tipo: Bug / Security Item
- Resultado: falhas de configuração, inicialização do client ou claims são tratadas como sessão não autenticada; rotas privadas redirecionam a `/login` e `/login` permanece acessível.
- Evidência TDD: 2 cenários falharam em RED pela exceção não tratada e passaram em GREEN após a correção; suíte completa com 32 suítes e 148 testes.
- Quality gates: lint, type-check e build passaram; `/` respondeu `307` para `/login` e `/login` respondeu `200` com o `.env.local` malformado.
- Pendência operacional: corrigir a Project URL HTTPS em `.env.local` para habilitar autenticação real.
- Status: DONE

- Bootstrap operacional do projeto.
- Discovery inicial, módulos do MVP e primeira small release selecionados.
- SR-001 — Setup técnico mínimo executável.
- SR-002 — Testes da criação de transação manual.
- SR-003 — Implementar criação de transação manual.
- SR-004 — Expansão controlada da transação manual.
- HD-001 — Hardening interno da transação manual.
- UX-001 — Revisão de UX, acessibilidade e PWA da transação manual.
- REL-001 — Validação final e preparação de release incremental da transação manual.
- SR-005 — Resumo mensal básico (Dia 2 ao Dia 7 concluídos, pipeline verde, release incremental pronta).
- SR-006 — Dashboard financeiro inicial (Dias 1 a 7 concluídos, pipeline verde, CI versionado e release incremental pronta).
- SR-007 — Cadastro local de conta financeira (Dias 1 a 7 concluídos, 21 suítes e 110 testes verdes, release incremental pronta; persistência permanece bloqueada até autenticação e RLS).
- SR-008 — Autenticação e sessão protegida (Dias 1 a 7 concluídos, 33 suítes e 153 testes verdes, segurança e observabilidade revisadas, release incremental pronta; deploy público ainda condicionado ao hardening pré-produção).
