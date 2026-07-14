# Backlog

## READY

Nenhum item pronto aguardando início no momento.

## IN_PROGRESS

### SR-008 — Autenticação e sessão protegida
- Tipo: Security Item / Small Release
- Objetivo de negócio: criar a fronteira real de usuário antes da persistência financeira.
- Valor esperado: identificar o usuário com segurança, proteger rotas privadas e habilitar isolamento futuro dos dados.
- Prioridade: Crítica
- Dependências: SR-007 concluída; nenhuma persistência real pode preceder esta SR.
- Risco: Alto
- Fase atual: Dia 6 concluído; aguardando Dia 7.
- Escopo aprovado: login por e-mail/senha de usuário existente, logout, identidade verificada no servidor, refresh por Proxy e proteção das rotas privadas.
- Fora do escopo: cadastro, recuperação de senha, confirmação de e-mail, OAuth, telefone, MFA, migrations financeiras e RLS.
- Contratos planejados: `AuthUser`, `AuthGateway`, `SignInUseCase`, `SignOutUseCase`, `GetCurrentUserUseCase` e adapter Supabase.
- Evidência TDD: 7 suítes e 29 testes criados; etapa vermelha válida por módulos ausentes; rede anterior com 21 suítes e 110 testes verdes.
- Entrega atual: autenticação, route groups e Proxy; configuração pública centralizada; estados assíncronos acessíveis; layout responsivo validado; ícones PWA raster e maskable; 33 suítes e 153 testes verdes.
- Critério imediato: executar quality gate final, revisão de segurança e baseline de observabilidade no Dia 7.
- Bloqueios: SR-009 permanece fora do ciclo atual até a conclusão formal da SR-008.
- Status: IN_PROGRESS

## DISCOVERY

### SR-009 - Persistencia e RLS de contas
- Tipo: Security Item / Small Release
- Objetivo de negocio: persistir contas isoladas por usuario.
- Valor esperado: saldo inicial e contas reais.
- Prioridade: Critica
- Dependencias: SR-007 e SR-008.
- Risco: Alto
- Fase recomendada: ciclo seguinte.
- Criterio de pronto: migration reversivel, repositorio, RLS e testes de isolamento.
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
- Critério de pronto: regras de fatura e parcelas testáveis documentadas.
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

Nenhuma dívida técnica aberta no Dia 7.

## DONE

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
