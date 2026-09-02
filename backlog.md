# Backlog

## READY

Nenhum item pronto aguardando início no momento.

## IN_PROGRESS

### UX-CHART-002 — Extrato contextual do candle
- Tipo: UX Improvement / Feature.
- Descrição objetiva: permitir abrir, a partir de um candle ou de sua linha equivalente na tabela, o extrato do intervalo representado sem sobrecarregar o gráfico.
- Objetivo de negócio: explicar quais lançamentos produziram a abertura, os extremos, o fechamento e o volume do candle selecionado.
- Valor esperado: transformar o gráfico em ferramenta de investigação financeira simples, contextual e acionável.
- Prioridade: Alta; selecionada antes da `UX-CHART-003` porque estabelece o contrato genérico de intervalo consumido pelos períodos futuros.
- Dependências: SR-015 e UX-SHELL-001 concluídas; sessão server-side, RLS de `transactions`, índice `(user_id, occurred_on, created_at, id)` e primitive compartilhada de contenção de foco existentes.
- Escopo: seleção por clique/toque no candle; ação equivalente na tabela; bottom sheet abaixo de 768 px; painel lateral a partir de 768 px; resumo OHLC; lista mínima de lançamentos carregada sob demanda; estados loading, empty, error e success.
- Fora do escopo: editar/excluir transações, pré-carregar descrições no snapshot, notas, exportação, busca, períodos acima de 31 dias, nova RPC, migration ou mudança nos cálculos OHLC.
- Arquitetura: `FinancialIntervalStatementQueryRepository` como port de application em `financial-analytics`; implementação Supabase server-side com RLS e filtro explícito por proprietário; Server Action como composition root; presentation recebe somente DTO serializável e callback injetado.
- Segurança e dados: `userId` nunca vem do cliente; claims verificadas fornecem o ator; consulta usa `startOnInclusive`/`endOnExclusive`, projeção mínima e ordenação determinística; erros públicos permanecem genéricos.
- Acessibilidade: diálogo nomeado; foco inicial/contido/restaurado; botão, `Escape` e backdrop; scroll confinado; targets de 44 px; tabela com botão `Ver extrato` como alternativa integral ao clique no gráfico.
- Risco: Médio por eventos ECharts, concorrência de requests, foco e layout responsivo; Alto se detalhes forem enviados antecipadamente ou consultados sem ownership.
- Small releases: `UX-CHART-002A` contratos e consulta sob demanda; `UX-CHART-002B` seleção no gráfico/tabela e painel responsivo; `UX-CHART-002C` concorrência, acessibilidade, responsividade e validação real.
- Fase recomendada: ciclo atual Dias 1–7.
- Critério de pronto: candle diário abre exatamente os lançamentos do intervalo; gráfico e tabela convergem para o mesmo painel; estados e navegação funcionam em 320/768/1280 px; isolamento por usuário e todos os quality gates ficam verdes.
- Status: IN_PROGRESS — Dia 2 concluído em `TEST_STRATEGY_READY`; matriz, fixtures e testes essenciais estão em RED controlado, sem implementação funcional ou migration.

## DISCOVERY

### UX-CHART-003 — Períodos e granularidade adaptativa
- Tipo: UX Improvement / Feature.
- Descrição objetiva: oferecer seleção rápida de `7D`, `15D`, `Mês`, `3M`, `Ano`, `Tudo` e intervalo personalizado, escolhendo automaticamente a granularidade dos candles.
- Objetivo de negócio: permitir analisar tendências curtas e históricas com leitura consistente, sem transformar o FinControl em interface de trading.
- Valor esperado: comparação temporal intuitiva, preservando clareza no celular e desempenho para históricos extensos.
- Prioridade: Alta após a conclusão da `UX-CHART-002`.
- Dependências: SR-012 a SR-015; contrato genérico de intervalo da `UX-CHART-002`; nova agregação server-side para períodos acima de 31 dias; migration forward-only e testes pgTAP.
- Escopo planejado: barra horizontal responsiva; compatibilidade com URLs e períodos atuais; granularidade diária até 31 dias, semanal até 6 meses, mensal até 2 anos e trimestral acima disso; limite preferencial de 12–60 pontos.
- Segurança e dados: a RPC diária atual permanece limitada a 31 dias; períodos longos usam consulta agregada `SECURITY INVOKER`, claims/RLS, allowlist de buckets e limites de intervalo/pontos; nenhum lançamento bruto em massa chega ao browser.
- Acessibilidade: botões com `aria-pressed`, nomes completos, teclado, alvos de 44 px, rolagem confinada, estado na URL e tabela equivalente ao gráfico.
- Risco: Alto por OHLC agregado, intervalos civis parciais, performance e migration; mitigado por TDD de domínio, pgTAP e rollout separado.
- Small releases: `UX-CHART-003A` seletor `7D`/`15D`/`Mês` sobre a RPC atual; `UX-CHART-003B` `3M`/`Ano` e agregação server-side; `UX-CHART-003C` `Tudo`/personalizado e integração completa com o extrato contextual.
- Fase recomendada: novo ciclo Dias 1–7 após a `UX-CHART-002`.
- Critério de pronto: cards, linha, candles, tabela e extrato usam o mesmo intervalo; nenhuma visualização excede os limites aprovados; URLs existentes continuam válidas; RLS, performance, responsividade e quality gates ficam verdes.
- Status: DISCOVERY — arquitetura coordenada registrada, mas execução bloqueada até a conclusão da `UX-CHART-002`.

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

### SEC-AUTH-001 — Ativar proteção contra senhas vazadas
- Tipo: Security Item
- Descrição objetiva: habilitar a proteção nativa do Supabase Auth contra senhas presentes na base Pwned Passwords do Have I Been Pwned, sem processar credenciais no FinControl.
- Objetivo de negócio: impedir uso de credenciais conhecidamente comprometidas.
- Valor esperado: reduzir risco de account takeover.
- Prioridade: Alta antes de produção pública
- Dependências: upgrade humano da organização Supabase do plano Free para Pro ou superior; ADR 0016; contratos TDD do login.
- Risco: Médio no ambiente atual; Alto em produção pública.
- Fase recomendada: hardening de autenticação antes do deploy público.
- Critério de pronto: contrato de sessão válida com `weakPassword` protegido por teste; proteção ativada; login sintético e logs de Auth sem regressão; advisor sem `auth_leaked_password_protection`.
- Small releases:
  - `SEC-AUTH-001A`: testes de compatibilidade do password grant e erro genérico.
  - `SEC-AUTH-001B`: ativação nativa, smoke test sanitizado e advisor limpo.
- Motivo do bloqueio: organização confirmada no plano Free; o recurso nativo está disponível somente no Pro ou superior.
- Decisão de priorização: upgrade adiado enquanto o app permanecer em desenvolvimento e previews privados; retomar antes da produção pública.
- Ação mínima de desbloqueio: aprovar e concluir o upgrade Supabase, sem compartilhar credenciais ou senhas com o agente.
- Status: BLOCKED

## DÍVIDA TÉCNICA

### SEC-DEPS-001 — Atualizar dependências com vulnerabilidades altas
- Tipo: Security Item / Dívida Técnica
- Descrição: a auditoria de 2026-08-25 identificou 4 vulnerabilidades altas em dependências de produção e 6 altas no conjunto completo, envolvendo `nanoid`, `next`, `postcss`, `sharp`, `brace-expansion` e `js-yaml`.
- Objetivo de negócio: impedir que uma entrega pública use versões com vulnerabilidades conhecidas.
- Valor esperado: reduzir exposição a negação de serviço, SSRF, cache poisoning e falhas nas cadeias de imagem, proxy e build.
- Prioridade: Alta
- Dependências: ciclo controlado de atualização do Next.js e dependências transitivas, consulta às notas oficiais e regressão completa.
- Risco: Alto em produção pública; controlado enquanto não houver release/deploy.
- Severidade: ALTA
- Fase recomendada: hardening dedicado antes do Dia 7 e de qualquer release público.
- Prazo: resolver antes da validação final da SR-012.
- Critério de pronto: `npm audit --omit=dev --audit-level=high` e auditoria completa sem vulnerabilidades altas; testes, type-check, lint e build verdes; Proxy e fluxos atuais preservados.
- Resultado: Next `16.3.3`, React `19.2.8`, PostCSS `8.5.23`, Sharp `0.35.3`, Nanoid `3.3.18` e transitivas vulneráveis atualizados sem `--force`; auditorias de produção e completa retornaram 0 vulnerabilidades; 64 suítes e 336 testes, type-check, lint e build permaneceram verdes.
- Data de conclusão: 2026-08-26
- Status: DONE

### TIME-BOUNDARY-001 — Remover competência mensal ancorada em UTC da rota de transações
- Tipo: Bug / Dívida Técnica
- Descrição: `src/app/(private)/transactions/page.tsx` usa `new Date()` com `getUTCFullYear()` e `getUTCMonth()` para escolher a competência inicial, podendo abrir o mês incorreto perto da virada civil do usuário.
- Objetivo de negócio: garantir que a competência padrão corresponda ao dia financeiro percebido pelo usuário.
- Valor esperado: evitar navegação inicial confusa sem alterar ou converter `occurred_on` persistido.
- Prioridade: Média
- Dependências: contrato explícito de `referenceInstant` e timezone IANA na borda de aplicação; decisão futura sobre preferência do usuário ou timezone padrão aprovado.
- Risco: Médio para experiência; não há corrupção de dados.
- Severidade: MÉDIA
- Fase recomendada: antes da composição da SR-013 com a UI-003.
- Critério de pronto: remover relógio/UTC direto da página, injetar a âncora temporal na aplicação e cobrir viradas UTC/local por testes sem converter datas civis persistidas.
- Resultado: a rota injeta o instante ISO em um resolver de application que converte a âncora para `America/Sao_Paulo`; testes cobrem a virada em `2026-04-01T02:30Z`/`03:30Z` e `occurred_on` permanece civil e inalterado.
- Data de conclusão: 2026-08-26
- Status: DONE

### TX-PERF-001 — Eliminar consulta mensal duplicada na composição de transações
- Tipo: Dívida Técnica / Hardening
- Descrição: a carga de `/transactions` consulta o mesmo mês uma vez para a lista e outra vez para o resumo mensal.
- Objetivo de negócio: manter a página previsível quando o histórico crescer sem alterar resultados financeiros.
- Valor esperado: reduzir round-trips e trabalho duplicado no banco.
- Prioridade: Média
- Dependências: composição autenticada do Dia 4 da SR-011 e testes existentes de lista/resumo.
- Risco: Baixo com tabela vazia; Médio em escala.
- Severidade: MÉDIA
- Fase recomendada: Dia 5 da SR-011.
- Critério de pronto: calcular lista e resumo com uma única leitura mensal, preservar os contratos de application e manter todos os gates verdes.
- Resultado: a composition root passou a consultar transações uma vez e `calculateMonthlySummary` deriva o resumo do conjunto já carregado; 61 suítes e 292 testes permaneceram verdes.
- Status: DONE

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
- Prioridade: Alta antes de produção pública.
- Dependências: Next.js/Vercel atuais; configuração Auth do Supabase; decisão humana de provedor para CAPTCHA.
- Risco: Médio em previews privados; Alto em produção pública sem headers e proteção contra abuso.
- Fase recomendada: ciclo dedicado Dias 1–7 antes da promoção pública.
- Small releases:
  - `SEC-HARD-001A`: headers globais, CSP compatível, contrato da origem Supabase e validação real em Preview — `READY_FOR_RELEASE`, com Dia 7 concluído em GREEN; pipeline, segurança, Supabase, observabilidade, Preview e PR validados no head `f8049e4`.
  - `SEC-HARD-001B`: inventário dos rate limits e CAPTCHA nativo com token efêmero — `BLOCKED` até decisão humana de provedor e credenciais seguras.
- Critério de pronto: headers validados na resposta do app, console sem violação CSP, HTTPS/HSTS confirmados, login/sessão/PWA/gráficos sem regressão e controles de abuso explicitamente verificados.
- Limite: WAF de `/login` não será tratado como proteção do password grant direto ao Supabase; nenhum proxy próprio de senha será criado.
- ADR: `adr/0017-auth-environment-security-hardening.md`.
- Status: `SEC-HARD-001A` pronta para release incremental; `SEC-HARD-001B` continua `BLOCKED`, mantendo o item agregado bloqueado para produção pública

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

### CI-VERCEL-002 — Alinhar vínculo local e runtime da Vercel
- Tipo: Dívida Técnica / Hardening
- Descrição objetiva: o `.vercel/project.json` local referencia um projeto antigo, enquanto o projeto ativo `fin-control` usa outro ID; o projeto declara Node 24, o `package.json` força Node 22 e a imagem de build usa npm 10 apesar do engine npm 11.
- Objetivo de negócio: tornar inspeções, previews e futuras promoções por CLI determinísticas e direcionadas ao projeto correto.
- Valor esperado: remover avisos de engine e reduzir risco de operar no projeto Vercel incorreto.
- Prioridade: Média
- Dependências: autorização para relink local e ajuste das configurações do projeto Vercel.
- Risco: Médio antes de operação direta por CLI ou promoção de produção; baixo para o preview atual já validado.
- Severidade: MÉDIA
- Fase recomendada: próximo hardening de CI/deploy, antes do primeiro deploy público.
- Critério de pronto: vínculo local aponta para `prj_G2U1I0AKTCyMlMm9ydglk2B17y2g`, Node/npm estão alinhados entre Vercel, `package.json` e CI, build passa sem `EBADENGINE` e preview continua associado ao repositório correto.
- Status: DISCOVERY

## DONE

### UX-SHELL-001 — Cabeçalho responsivo compacto e painel da conta
- Tipo: Small Release / UX Improvement.
- Resultado: topbar privada reduzida a uma linha e sessão, tema e logout consolidados em painel acionado no canto superior direito, com bottom sheet no mobile e popover ancorado em tablet/desktop.
- Arquitetura: `PrivateAppShell` preservado como composition root; apresentação sem acesso direto ao Supabase; contratos existentes de tema, logout e sessão reutilizados sem regra financeira nova.
- UX/PWA: 320/768/1280 px sem overflow; targets de 44 px, foco circular/restaurado, `Escape`, backdrop, scroll bloqueado, contraste WCAG AA e manifesto/assets PWA validados.
- Evidência final: lint, type-check, audit e build verdes; regressão completa com 86 suítes/505 testes e zero snapshots.
- Evidência remota: Supabase `ACTIVE_HEALTHY` e migrations alinhadas; Preview Vercel `READY`, logs sem `error/fatal` em 24 horas e checks da PR `#23` verdes no head publicado.
- Riscos residuais: `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001B` bloqueiam produção pública; `CI-VERCEL-002` deve ser resolvida antes de CLI/promoção, mas nenhum deles bloqueia o merge incremental da UI.
- Data de conclusão: 2026-09-01.
- Status: DONE.

### SR-015 — Candles financeiros
- Tipo: Small Release
- Resultado: saldo diário apresentado como linha ou candles OHLC sobre o mesmo snapshot server-side, com seletor, tooltip explicável, tabela equivalente e frame expansível.
- Integridade: abertura, máxima, mínima e fechamento seguem ordem determinística de registro; intervalos vazios, overflow e timestamps PostgreSQL com offset estão cobertos sem semântica de trading.
- UX/PWA: 320, 768 e 1280 px sem overflow global; controles de 44 px, teclado horizontal, foco modal, manifesto standalone e fallback textual validados.
- Evidência final: 84 suítes/482 testes, lint, type-check, build e auditorias npm verdes; chunk ECharts/ZRender restrito a `/` e `/dashboard` com 179.457 bytes gzip.
- Evidência remota: migrations alinhadas, advisors/logs revisados, preview `READY` e checks da PR `#19` verdes no head publicado.
- Riscos residuais: `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001` bloqueiam produção pública; `CI-VERCEL-002` deve ser resolvida antes de operação direta por CLI ou promoção.
- Data de conclusão: 2026-08-31
- Status: DONE

### BUG-ANALYTICS-001 — Normalizar `timestamptz` do snapshot financeiro
- Tipo: Bug / Data Integrity
- Resultado: o mapper converte todo instante válido recebido do PostgreSQL para ISO UTC canônico antes de construir o snapshot e continua rejeitando valores inválidos.
- Limites preservados: nenhuma mudança em RPC, migration, RLS, dados, ordenação, fórmulas financeiras ou contrato do domínio.
- Evidência TDD: teste com offset falhou antes da correção; quatro suítes/32 testes direcionados e regressão completa de 84 suítes/482 testes ficaram verdes.
- Evidência real: dashboard autenticado renderizou dois movimentos sem overlay, erro ou warning após a correção.
- Data de conclusão: 2026-08-31
- Status: DONE

### TECH-CHART-002 — Ciclo de vida compartilhado das ilhas ECharts
- Tipo: Dívida Técnica / Refatoração
- Resultado: `useFinancialChart` centraliza inicialização SVG, resize, preferências visuais, atualização e cleanup das duas ilhas existentes.
- Limites preservados: builders, temas, modelos, copy e estados continuam concretos; nenhum `ChartPort`, fetch, persistência ou regra financeira foi criado.
- Evidência TDD: contrato arquitetural falhou antes da extração e passou depois; sete suítes/54 testes direcionados e regressão completa de 84 suítes/480 testes verdes.
- Bundle: 525.257 bytes brutos e 179.344 bytes gzip, variação imaterial de -584/+34 bytes sobre o Dia 4.
- Data de conclusão: 2026-08-31
- Status: DONE

### SR-014 — Gráfico de linha da evolução
- Tipo: Small Release
- Resultado: linha do saldo de fechamento diário integrada ao painel real em `/` e `/dashboard`, junto da tabela acessível e com uma única leitura server-side.
- Arquitetura: Server Component, mapper serializável, ilha ECharts e adapter específico preservam as fronteiras; ECharts permanece ausente das rotas não relacionadas.
- Experiência: estados vazio/erro, tema, movimento reduzido, alto contraste, responsividade e expansão progressiva validados em TDD e navegador real.
- Quality gates: 76 suítes/429 testes, lint, type-check, auditoria com zero vulnerabilidades, build, analyzer, GitHub Actions e Vercel Preview verdes.
- Segurança: sem alteração em Supabase, Auth, RLS, migrations, dados, regras financeiras, secrets ou dependências.
- Observabilidade: deployment `ff4bb73` em `READY`, `/login` HTTP 200, sem erro/fatal ou cluster de runtime nas últimas 24 horas e sem comentário Vercel pendente.
- Riscos residuais: `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001` bloqueiam produção pública; `CI-VERCEL-002` deve ser resolvida antes de operação direta por CLI ou promoção.
- ADR: `adr/0013-financial-evolution-line-chart-integration.md`.
- Status: DONE

### UX-CHART-001 — Expansão universal de gráficos
- Tipo: Small Release / UX Improvement transversal
- Resultado: primitive reutilizável com overlay CSS, Fullscreen API progressiva, safe areas e adaptação a mobile retrato/paisagem.
- Acessibilidade: diálogo nomeado, controle acessível, focus trap, restauração de foco e scroll, `Escape` testado e tabela equivalente preservada.
- Robustez: mesma instância ECharts, resize por observer, múltiplos frames independentes e resolução tardia de fullscreen protegida.
- Quality gates: coberta pela regressão de 429 testes, browser real, lint, type-check, build e preview verdes da SR-014.
- ADR: `adr/0014-expandable-chart-frame.md`.
- Status: DONE

### SP-001 — Avaliar biblioteca de gráficos
- Tipo: Spike
- Resultado: Apache ECharts `6.1.0` aceita por decisão auditável, com adapter modular específico de presentation e experimento isolado das rotas.
- Arquitetura: domain, application, infrastructure e App Router permanecem sem dependência de ECharts; a ilha cliente recebe somente view model plano e serializável.
- Acessibilidade e experiência: tabela server-side obrigatória, nomes e descrições únicos, estados vazio/erro, alto contraste, movimento reduzido, responsividade e PWA sem promessa offline validados.
- Quality gates: 75 suítes/413 testes, lint, type-check, auditoria com 0 vulnerabilidades, assinaturas/attestations npm, build, GitHub Actions e Vercel Preview verdes.
- Segurança: sem Supabase, rede, storage, HTML arbitrário, logging financeiro, secrets, migrations ou dados; nenhum risco crítico específico identificado.
- Observabilidade: Preview respondeu HTTP 200 e não mostrou erro/fatal na janela disponível; telemetria financeira permanece proibida e a instrumentação técnica só será considerada com rota real.
- Riscos residuais: bundle e validação visual end-to-end deverão ser medidos na SR-014; hardenings globais `SEC-AUTH-001`, `HARD-OBS-001`, `SEC-HARD-001` e `CI-VERCEL-002` permanecem rastreados.
- Fora do escopo preservado: integração no dashboard, gráfico de produção, candles, analytics, Supabase, migrations, dados, promoção e merge.
- Status: DONE

### UI-003 — Dashboard FinControl Pulse
- Tipo: Small Release / UX Improvement
- Resultado: dashboard reorganizado com fonte financeira real, composição server-side, grid responsivo, estados honestos, ações disponíveis e experiência acessível/PWA sem promessa offline.
- Escopo concluído: `UI-003A` fonte real e hierarquia; `UI-003B` resumo responsivo do período; `UI-003C` hardening visual.
- Quality gates: 71 suítes/386 testes, lint, type-check, auditoria com 0 vulnerabilidades, assinaturas/attestations npm, build, GitHub Actions e Vercel Preview verdes.
- Segurança: UI sem acesso direto ao Supabase; RLS/grants/RPC revalidados; nenhum segredo, migration, configuração Auth ou dado foi alterado.
- Observabilidade: preview atual sem erro de runtime e logs recentes de Supabase sem erro/fatal/5xx; baseline externa sanitizada permanece rastreada.
- Riscos residuais: `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001` bloqueiam produção pública; `CI-VERCEL-002` deve ser resolvida antes de operação direta por CLI ou promoção.
- Fora do escopo preservado: gráficos, comparações, projeções, IA, analytics, service worker, offline e novas regras financeiras.
- Status: DONE

### SR-013 — Agregação da evolução financeira
- Tipo: Small Release
- Resultado: saldo de abertura e evolução diária por período entregues com tabela acessível baseada em dados reais, sem antecipar biblioteca de gráficos.
- Arquitetura: domínio e application puros; composição server-side; UI recebe DTO serializável; Supabase permanece isolado no repository.
- Banco: migration `20260826190714_create_financial_evolution_snapshot` alinhada local/remoto; RPC `SECURITY INVOKER`, RLS e grants mínimos; 33 asserções pgTAP verdes em rollback.
- Quality gates: 72 suítes/390 testes, lint, type-check, auditoria sem vulnerabilidades, build, GitHub Actions e três previews Vercel verdes no commit `e508f6b`.
- Segurança e observabilidade: ownership derivado da sessão, Auth anônimo bloqueado, intervalo máximo de 31 dias, erros sanitizados e baseline remota validada sem registrar PII ou conteúdo financeiro.
- Riscos residuais: `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001` permanecem como hardening obrigatório antes de produção pública; três índices sem uso continuam apenas informativos.
- Status: DONE

### SR-012 — Períodos financeiros
- Tipo: Small Release
- Resultado: cinco períodos financeiros civis e móveis implementados com datas canônicas, limites semiabertos, viradas de calendário e pertencimento ao intervalo cobertos por testes.
- Arquitetura: domínio e application puros; nenhuma UI, persistência, agregação, Supabase ou timezone implícito antecipado.
- Quality gates: 64 suítes/336 testes, lint, type-check, auditoria sem vulnerabilidades, build, GitHub Actions e dois previews Vercel verdes.
- Segurança e observabilidade: entradas limitadas, calendário validado, loops curtos e baseline sanitizada sem PII ou dados financeiros.
- Riscos residuais: `TIME-BOUNDARY-001` foi resolvido no Dia 4 da SR-013; hardenings globais de deploy público permanecem rastreados.
- Status: DONE

### CI-VERCEL-001 — Corrigir autoria Git dos previews Vercel
- Tipo: Hardening
- Resultado: divergência entre `JuniorDaliessi` e `JrDaliessi` corrigida no escopo local do repositório, sem reescrever histórico.
- Evidência: commit `268ab3e` associado ao GitHub `JrDaliessi` (ID `131720853`); ambos os previews e GitHub Actions concluíram com sucesso.
- Observação: dois projetos Vercel continuam conectados ao repositório; avaliação de consolidação permanece opcional e separada.
- Status: DONE

### SR-011 — Persistência e RLS de transações
- Tipo: Security Item / Small Release
- Resultado: criação e consulta mensal de transações próprias entregues com identidade server-side, vínculos tenant-safe, grants mínimos, RLS e apresentação acessível.
- Escopo concluído: domínio, casos de uso, mapper, repository, migrations, Server Actions, lista/resumo persistentes, UX responsiva e hardening interno.
- Banco: migrations `20260717070131_create_transactions` e `20260717070559_add_transaction_fk_indexes` alinhadas; 89 asserções pgTAP verdes; rollback preservou a 1 transação preexistente e não deixou `pgtap` instalada.
- Quality gates: lint, type-check, 61 suítes/294 testes Jest, auditoria com 0 vulnerabilidades, build e `git diff --check` verdes.
- Segurança: Proxy, Actions e RLS bloqueiam Auth anônimo; ownership é injetado no servidor; FKs compostas impedem conta/categoria cross-tenant; somente `SELECT`/`INSERT` estão liberados.
- Observabilidade: eventos e atributos sanitizados definidos; conteúdo financeiro, PII, UUIDs, tokens, cookies, credenciais e payloads brutos são proibidos.
- Riscos residuais: `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001` bloqueiam deploy público, mas não a entrega incremental do código.
- Fora do escopo preservado: edição, exclusão, status, transferência, cartão, parcelas, recorrência, importação, analytics avançado, offline e IA.
- Status: DONE

### BUG-AUTH-ANON-001 — Proxy aceitava Supabase Anonymous Sign-In como sessão permanente
- Tipo: Bug / Security Item
- Resultado: o Proxy agora exige subject válido e rejeita `is_anonymous=true`, alinhado às Server Actions e policies financeiras.
- Evidência TDD: RED com 1 falha e 6 testes verdes; GREEN com 1 suíte e 8 testes verdes; regressão completa com 61 suítes e 294 testes.
- Risco resolvido: usuário Auth anônimo não atravessa mais a proteção de rotas privadas.
- Status: DONE

### SR-010 — Persistência e RLS de categorias
- Tipo: Security Item / Small Release
- Resultado: criação e listagem persistentes de categorias próprias entregues com identidade server-side, grants mínimos, RLS forçada e isolamento por proprietário.
- Escopo concluído: domínio, casos de uso, migration, repository, mapper, Server Actions autenticadas, estados acessíveis e experiência PWA coerente.
- Banco: migration `20260717022313_create_categories` aplicada; 65 asserções pgTAP verdes; Performance Advisor limpo; tabela permaneceu vazia após os testes transacionais do Dia 7.
- Quality gates: lint, type-check, 53 suítes/255 testes Jest, auditoria sem vulnerabilidades e build de produção verdes.
- Segurança: `authenticated` somente com `SELECT`/`INSERT`; `anon`, Auth anônimo, `UPDATE`, `DELETE`, owner forjado e uso de `service_role` pela aplicação bloqueados.
- Observabilidade: eventos e atributos sanitizados definidos; nomes, payloads, PII, credenciais, tokens e conteúdo financeiro são proibidos.
- Riscos residuais: `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001` bloqueiam deploy público, mas não a entrega incremental do código.
- Fora do escopo preservado: edição, exclusão, arquivamento, cor, ícone, seeds, categorias globais, persistência de transações, offline e IA.
- Status: DONE

### UI-002 — Shell e navegação responsiva
- Tipo: Small Release / UX Improvement
- Resultado: sidebar desktop, rail tablet, navegação inferior mobile e topbar entregues somente com destinos funcionais.
- Escopo concluído: estado ativo por rota/alias, teclado, foco, alvos de 44 px, safe area, movimento reduzido, tema, logout e experiência PWA coerente.
- Quality gates: lint, type-check, 44 suítes/212 testes, auditoria com 0 vulnerabilidades, build e `git diff --check` verdes.
- Segurança: logout local com redirect fixo, UI sem acesso direto a Supabase, sem segredo real ou escape de tipagem.
- Governança: CI validado por teste e executado em pushes/PRs para `develop` e `main`.
- Riscos residuais não críticos: inspeção visual automatizada indisponível e pinagem das Actions por SHA registrada como dívida baixa.
- Fora do escopo preservado: rotas futuras, busca, notificações, perfil, configurações, Adicionar, drawers, gráficos, IA e offline.
- Status: DONE

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
