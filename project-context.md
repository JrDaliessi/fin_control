# Project Context

project: FinControl
project_state: OPERATING
active_capabilities: [software, product]
active_artifact: GOV-V4-001
artifact_state: READY_FOR_RELEASE
phase: Dia 0 incremental
last_release: UX-CHART-003B

## Current Goal

Concluir a migração incremental da governança para Regras IDE v4, preservando o histórico e preparando um Context Pack enxuto para o próximo ciclo `UX-CHART-003C`.

## Current Delivery State

- `UX-CHART-003A` e `UX-CHART-003B` foram mescladas em `develop`;
- PR `#28` foi mesclada em 2026-09-08 no commit `45d1bab`;
- quality gates da PR `#28`: 95 suítes, 621 testes, lint, type-check, build, segurança, Supabase e Preview verdes;
- `UX-CHART-003` permanece `IN_PROGRESS` porque a small release `003C` ainda não começou;
- branch atual: `codex/gov-v4-001-bootstrap`.

## Blockers

Nenhum bloqueio duro para concluir `GOV-V4-001`.

Bloqueios externos antes de produção pública completa:

- `SEC-AUTH-001`: proteção nativa contra senhas vazadas depende de upgrade humano do Supabase;
- `SEC-HARD-001B`: decisão humana e credenciais externas para proteção adicional de autenticação;
- `HARD-OBS-001`: baseline produtivo de observabilidade ainda pendente.

## Active Risks

- `CI-VERCEL-002` — MÉDIO: contrato local/CI em Node.js 22 e projeto Vercel reportado em Node.js 24;
- emulação autenticada automatizada isolada em 320/390/768 px — BAIXO: conector anterior não preencheu os inputs React; contratos responsivos e inspeções reais anteriores mitigam o risco;
- `UX-CHART-003C` — ALTO: `Tudo`, período personalizado e granularidade trimestral exigirão limites server-side, RLS, performance e UX próprios.

## Current Context

- brief: `project-brief.md`
- project type: `project-type.yaml`
- capabilities: `capability-registry.yaml`
- product requirements: `docs/product/prd.md`
- architecture: `architecture.md`
- stack: `project-stack.md`
- toolchain: `project-toolchain.md`
- active artifact: `docs/governance/GOV-V4-001.md`
- relevant ADRs: `adr/0019-contextual-candle-statement.md`, `adr/0020-adaptive-financial-periods.md`, `adr/0021-contextual-interval-volume-insights.md`
- quality gates: `quality-gates.md`
- context routes: `context-map.yaml`

## Current Decisions

- Feature-Based + Clean Architecture leve permanece a arquitetura vigente;
- TDD é obrigatório para comportamento de software relevante;
- Supabase fica isolado em infraestrutura, com RLS e privilégio mínimo;
- visualizações mantêm alternativa textual e não adotam semântica de trading;
- períodos financeiros usam datas civis em `America/Sao_Paulo`;
- `UX-CHART-003C` terá ciclo Dias 1–7 próprio e não será antecipada nesta migração.

## Next Action

Versionar a `GOV-V4-001`, publicar a branch e submetê-la a PR. Após o merge, iniciar explicitamente o Dia 1 da `UX-CHART-003C`.

## History

Não carregar automaticamente. O contexto acumulado até a `UX-CHART-003B` foi preservado integralmente em `docs/history/project-context-v3-through-2026-09-08.md`. Releases consolidadas ficam em `docs/releases/`.
