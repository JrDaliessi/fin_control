# Project Context

project: FinControl
project_state: OPERATING
active_capabilities: [software, product]
active_artifact: UX-CHART-003C
artifact_state: TEST_STRATEGY_READY
phase: Dia 2
last_release: GOV-V4-001

## Current Goal

Entregar `Tudo`, período personalizado e drill-down progressivo com limites explícitos, agregação server-side e extrato final sob demanda.

## Current Delivery State

- `UX-CHART-003A` e `UX-CHART-003B` foram mescladas em `develop`;
- `GOV-V4-001` foi mesclada pela PR `#29` no commit `42dd6db`;
- `UX-CHART-003C` concluiu o Dia 2 com matriz completa e RED executável da `003C1`;
- nenhuma implementação, migration ou alteração remota foi executada neste ciclo;
- branch atual: `codex/ux-chart-003c-all-custom-drilldown`.

## Blockers

Nenhum bloqueio duro para iniciar o Dia 3 da `UX-CHART-003C1`.

Bloqueio de merge da PR `#30`:

- `SUPPLY-CHAIN-003`: `npm audit` remoto encontrou severidade alta em `js-yaml` e `sharp`; corrigir em hardening separado antes do merge, sem misturar atualização de dependências ao RED da feature.

Bloqueios externos antes de produção pública completa:

- `SEC-AUTH-001`: proteção nativa contra senhas vazadas depende de upgrade humano do Supabase;
- `SEC-HARD-001B`: decisão humana e credenciais externas para proteção adicional de autenticação;
- `HARD-OBS-001`: baseline produtivo de observabilidade ainda pendente.

## Active Risks

- `CI-VERCEL-002` — MÉDIO: contrato local/CI em Node.js 22 e projeto Vercel reportado em Node.js 24;
- emulação autenticada automatizada isolada em 320/390/768 px — BAIXO: conector anterior não preencheu os inputs React; contratos responsivos e inspeções reais anteriores mitigam o risco;
- `UX-CHART-003C` — ALTO: histórico extenso exige limites duplos, RLS e validação de plano antes de qualquer índice;
- drill-down no painel único — MÉDIO: estados assíncronos e retorno precisam de cobertura de foco e concorrência;
- mês com quantidade extrema de lançamentos — MÉDIO: paginação permanece hardening separado.

## Current Context

- brief: `project-brief.md`
- project type: `project-type.yaml`
- capabilities: `capability-registry.yaml`
- product requirements: `docs/product/prd.md`
- architecture: `architecture.md`
- stack: `project-stack.md`
- toolchain: `project-toolchain.md`
- active artifact: `docs/features/UX-CHART-003C/`
- feature requirements: `docs/features/UX-CHART-003C/feature-prd.md`
- feature specification: `docs/features/UX-CHART-003C/feature-spec.md`
- validation strategy: `docs/features/UX-CHART-003C/test-strategy.md`
- relevant ADRs: `adr/0019-contextual-candle-statement.md`, `adr/0020-adaptive-financial-periods.md`, `adr/0021-contextual-interval-volume-insights.md`, `adr/0022-all-custom-periods-and-progressive-drilldown.md`
- quality gates: `quality-gates.md`
- context routes: `context-map.yaml`

## Current Decisions

- Feature-Based + Clean Architecture leve permanece a arquitetura vigente;
- TDD é obrigatório para comportamento de software relevante;
- Supabase fica isolado em infraestrutura, com RLS e privilégio mínimo;
- visualizações mantêm alternativa textual e não adotam semântica de trading;
- períodos financeiros usam datas civis em `America/Sao_Paulo`;
- `Tudo` começa na primeira transação do usuário; conta sem transação recai no mês civil atual;
- personalizado usa datas inclusivas na UI e intervalo semiaberto no domínio;
- granularidade progride de dia a ano, com máximo de 60 anos e 60 buckets;
- drill-down usa o mesmo painel e só carrega lançamentos brutos no mês final.

## Next Action

Executar explicitamente o Dia 3 da `UX-CHART-003C1`: implementar o mínimo para tornar verdes os contratos de domínio, URL e seletor, sem antecipar Supabase ou drill-down.

## History

Não carregar automaticamente. O contexto acumulado até a `UX-CHART-003B` foi preservado integralmente em `docs/history/project-context-v3-through-2026-09-08.md`. Releases consolidadas ficam em `docs/releases/`.
