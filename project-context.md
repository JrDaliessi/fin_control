# Project Context

project: FinControl
project_state: OPERATING
active_capabilities: [software, product]
active_artifact: UX-CHART-003C2
artifact_state: SPEC_READY
phase: Dia 1
last_release: LINKEDIN-001/LI-POST-002

## Current Goal

Definir a agregação segura que habilita `Tudo`, trimestre e ano sem expor lançamentos brutos, romper RLS ou degradar históricos extensos.

## Current Delivery State

- PR `#33` foi mesclada por squash em `develop` no commit `ca33431`; `LI-POST-002` está concluído editorialmente e permanece não publicado por decisão humana;
- `UX-CHART-003C1` está liberada; `Tudo` e personalizado já possuem domínio/URL, mas `quarter/year` seguem bloqueados no adapter;
- Dia 1 da `UX-CHART-003C2` definiu PRD, Spec e rastreabilidade, sem código ou migration;
- Supabase foi inspecionado em modo somente leitura em 2026-09-12: PostgreSQL 17.6, sete migrations, RLS ativa e uma RPC agregadora invoker;
- a RPC atual suporta `week/month`, preserva `search_path` vazio e grant de aplicação para `authenticated`;
- o índice composto atual de transações é a hipótese inicial para âncora/recorte, mas qualquer novo índice depende de `EXPLAIN`;
- branch atual: `codex/ux-chart-003c2-day-1`.

## Blockers

Nenhum bloqueio duro impede o Dia 2 da `UX-CHART-003C2`.

Bloqueios externos antes de produção pública completa:

- `SEC-AUTH-001`: o Security Advisor confirmou em 2026-09-10 que a proteção nativa contra senhas vazadas segue desativada e depende de upgrade humano do Supabase;
- `SEC-HARD-001B`: decisão humana e credenciais externas para proteção adicional de autenticação;
- `HARD-OBS-001`: baseline produtivo de observabilidade ainda pendente.

## Active Risks

- `CI-ACTIONS-001` — BAIXO: `actions/checkout@v4` e `actions/setup-node@v4` dependem de runtime Node.js 20 e o runner atual as força para Node.js 24;
- `CI-VERCEL-002` — MÉDIO: contrato local/CI em Node.js 22 e projeto Vercel reportado em Node.js 24;
- `UX-CHART-003C2` — ALTO: RLS/ACL e plano de consulta precisam de pgTAP e `EXPLAIN` antes da migration remota;
- `UX-CHART-003C2` — MÉDIO: fronteiras históricas e transações futuras precisam de testes de borda explícitos;
- publicação externa — ALTO: permanece pausada e exige aprovação humana específica.

## Current Context

- brief: `project-brief.md`
- project type: `project-type.yaml`
- capabilities: `capability-registry.yaml`
- product requirements: `docs/product/prd.md`
- architecture: `architecture.md`
- stack: `project-stack.md`
- toolchain: `project-toolchain.md`
- active artifact: `docs/features/UX-CHART-003C2/`
- requirements: `docs/features/UX-CHART-003C2/feature-prd.md`
- specification: `docs/features/UX-CHART-003C2/feature-spec.md`
- artifact context: `docs/features/UX-CHART-003C2/context.yaml`
- artifact status: `docs/features/UX-CHART-003C2/status.md`
- parent feature: `docs/features/UX-CHART-003C/`
- relevant ADR: `adr/0022-all-custom-periods-and-progressive-drilldown.md`
- database contracts: `database-model.md`, `module-contracts.md`, `supabase/migrations/`
- quality gates: `quality-gates.md`
- context routes: `context-map.yaml`

## Current Decisions

- `Tudo` usa a primeira transação visível e nunca o `created_at` da conta;
- sem transações, o mês civil da referência preserva o saldo inicial sem história fictícia;
- identidade é derivada de `auth.uid()` e não entra no payload RPC;
- históricos longos entregam apenas agregados, com 60 anos e 60 buckets como limites independentes;
- funções permanecem invoker, com `search_path` vazio, grants explícitos e RLS;
- nenhum índice será criado sem plano de consulta comparativo;
- drill-down e lançamentos continuam reservados à `UX-CHART-003C3`.
- transações somente futuras usam o fallback do mês civil da referência;
- com histórico válido, `Tudo` termina na data de referência inclusiva.

## Next Action

Executar o Dia 2 da `UX-CHART-003C2` para criar a matriz e os testes RED em Jest e pgTAP, sem implementação funcional.

## History

Não carregar automaticamente. O contexto acumulado até a `UX-CHART-003B` foi preservado integralmente em `docs/history/project-context-v3-through-2026-09-08.md`. Releases consolidadas ficam em `docs/releases/`.
