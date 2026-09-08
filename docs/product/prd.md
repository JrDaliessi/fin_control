# Product PRD — FinControl

## Metadata

- produto: FinControl
- tipo: PWA de finanças pessoais
- estado: desenvolvimento incremental
- versão de governança: 4
- última consolidação: 2026-09-08

## Vision

Ser uma central pessoal de decisões financeiras que explique o que aconteceu com o dinheiro, evidencie tendências e antecipe riscos sem substituir a decisão humana.

## Problem

Aplicações financeiras frequentemente se limitam a registrar lançamentos ou apresentam informação complexa demais. O FinControl precisa unir persistência segura, períodos civis coerentes, visualizações compreensíveis e linguagem direta.

## Target Users

- pessoas que controlam receitas, despesas e contas próprias;
- usuários prioritariamente mobile que precisam de leitura rápida;
- avaliadores técnicos que exploram o produto por uma conta de demonstração restaurável.

## User Needs

- registrar e consultar movimentações;
- organizar contas e categorias;
- entender saldo e evolução por período;
- inspecionar a origem de um candle sem perder o contexto do gráfico;
- receber explicações determinísticas, acessíveis e proporcionais aos dados disponíveis.

## Value Proposition

Clareza financeira com visualizações acessíveis e regras verificáveis, mantendo segurança, privacidade e controle sobre qualquer ação sensível.

## Goals

- consolidar lançamentos e saldos reais do usuário autenticado;
- permitir análise de períodos curtos e históricos;
- manter experiência responsiva e acessível;
- construir cada capacidade em small releases validadas;
- demonstrar engenharia de produto, arquitetura, testes e segurança de forma rastreável.

## Non-Goals

- operar investimentos ou imitar uma plataforma de trading;
- executar transferências, pagamentos ou decisões financeiras automaticamente;
- oferecer Open Finance, aconselhamento financeiro ou IA sem contrato próprio;
- prometer suporte offline completo sem estratégia e validação específicas.

## Personas / Actors

- usuário autenticado: proprietário dos dados financeiros;
- usuário de demonstração: avaliador com dados controlados e restauração periódica;
- mantenedor: responsável por release, migrations, segurança e operação.

## Primary User Journey

1. autenticar-se;
2. visualizar o resumo e escolher um período;
3. alternar entre linha, candles e tabela equivalente;
4. selecionar um intervalo para consultar o extrato contextual;
5. cadastrar ou revisar contas, categorias e transações;
6. encerrar a sessão com segurança.

## Product Capabilities

- autenticação e sessão protegida;
- contas, categorias e transações persistentes;
- resumo e evolução financeira;
- gráficos expansíveis com equivalência textual;
- candles de saldo e extrato contextual;
- períodos adaptativos com agregação server-side;
- shell responsivo, temas e PWA;
- conta de demonstração restaurável.

## MVP Current Boundary

O produto já cobre autenticação, persistência financeira básica, dashboard e períodos até um ano. `UX-CHART-003C` permanece futura para `Tudo`, período personalizado e drill-down de buckets longos. Metas, gamificação, frequência, IA e Open Finance não pertencem ao recorte atual.

## Business Rules

- cada registro financeiro pertence a um único usuário autenticado;
- datas financeiras são datas civis, sem deslocamento silencioso por UTC;
- receitas aumentam e despesas reduzem o saldo;
- gráficos e tabelas usam o mesmo snapshot server-side;
- volume é a soma absoluta das movimentações do intervalo;
- insights atuais são determinísticos e derivados do período consultado;
- nenhum dado de outro usuário pode ser inferido ou retornado.

## Functional Requirements

- `PRD-RQ-001`: autenticar e encerrar sessão com identidade validada no servidor;
- `PRD-RQ-002`: cadastrar e consultar contas, categorias e transações próprias;
- `PRD-RQ-003`: consultar resumo e evolução pelo período selecionado;
- `PRD-RQ-004`: alternar linha, candles e representação tabular equivalente;
- `PRD-RQ-005`: expandir gráficos e consultar extrato do intervalo selecionado;
- `PRD-RQ-006`: preservar período na URL e aplicar granularidade compatível;
- `PRD-RQ-007`: suportar conta de demonstração sem expor credenciais privilegiadas.

## Non-Functional Requirements

- `PRD-NFR-001`: TypeScript forte e fronteiras arquiteturais preservadas;
- `PRD-NFR-002`: experiência mobile-first sem overflow global;
- `PRD-NFR-003`: teclado, foco, nomes acessíveis e alternativa textual;
- `PRD-NFR-004`: consultas históricas limitadas e agregadas no servidor;
- `PRD-NFR-005`: pipeline obrigatório verde para release;
- `PRD-NFR-006`: nenhum segredo ou dado financeiro real versionado.

## Security / Privacy

- RLS por proprietário é obrigatória;
- RPCs financeiras não aceitam `userId` arbitrário;
- credenciais de serviço não chegam ao navegador;
- Auth, migrations, RLS e dados financeiros são áreas críticas;
- produção pública completa permanece condicionada aos hardenings ativos registrados em `project-context.md`.

## Success Metrics / Analytics

Nesta fase, sucesso é medido por critérios técnicos e de experiência: fluxos concluídos, zero regressão crítica, acessibilidade coberta, limites de consulta respeitados e pipeline verde. Métricas comportamentais de produto ainda não foram aprovadas e não serão inventadas.

## Dependencies / Constraints / Risks

Consultar `project-brief.md`, `project-context.md`, `architecture.md` e `backlog.md`.

## Open Questions / Out of Scope

- política definitiva de produção pública;
- upgrade do Supabase para proteção nativa contra senhas vazadas;
- provedor e escopo de observabilidade produtiva;
- IA, Open Finance, pagamentos e automações sensíveis.

## Roadmap Relationship

O `roadmap.md` define marcos; o `backlog.md` define prioridade. Feature PRDs e specs futuras derivam os requisitos deste documento com IDs próprios.

## Approval

Consolida requisitos e decisões já aprovados nos ciclos anteriores. Mudanças centrais neste PRD exigem aprovação humana explícita.
