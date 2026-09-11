# Project Context

project: FinControl
project_state: OPERATING
active_capabilities: [software, product, linkedin, content]
active_artifact: LINKEDIN-001
artifact_state: IN_PROGRESS
phase: Dia 3
last_release: UX-CHART-003C1

## Current Goal

Construir uma narrativa profissional verificável do FinControl para recrutadores, sem inventar métricas, resultados ou capacidades.

## Current Delivery State

- `UX-CHART-003C1` foi mesclada pela PR `#30` no commit `a96b564`;
- capabilities `linkedin` e `content` foram aprovadas para a `LINKEDIN-001`;
- requisitos, content spec, headline e voz editorial foram aprovados no Dia 1;
- três briefs possuem fontes, limites, dependências e critérios próprios;
- estratégia, rubricas e fixtures de validação foram materializadas no Dia 2;
- `LI-POST-002` possui oito claims delimitados e draft mínimo com gates factual e de privacidade verdes;
- inspeção read-only pelo plugin MCP confirmou no Supabase as migrations e fronteiras de RLS/grants/policies/FKs citadas no draft;
- rubrica editorial do draft atingiu 13/14, sem nota zero;
- `LI-POST-001` permanece bloqueado até `UX-CHART-003C2/003C3`; `LI-POST-003` segue em discovery;
- nenhum post foi redigido como final, publicado ou enviado a serviço externo;
- branch atual: `codex/linkedin-001-foundation`.

## Blockers

Nenhum bloqueio duro para produzir o draft mínimo do `LI-POST-002` no Dia 3.

Bloqueios externos antes de produção pública completa:

- `SEC-AUTH-001`: o Security Advisor confirmou em 2026-09-10 que a proteção nativa contra senhas vazadas segue desativada e depende de upgrade humano do Supabase;
- `SEC-HARD-001B`: decisão humana e credenciais externas para proteção adicional de autenticação;
- `HARD-OBS-001`: baseline produtivo de observabilidade ainda pendente.

## Active Risks

- `CI-ACTIONS-001` — BAIXO: `actions/checkout@v4` e `actions/setup-node@v4` dependem de runtime Node.js 20 e o runner atual as força para Node.js 24;
- `CI-VERCEL-002` — MÉDIO: contrato local/CI em Node.js 22 e projeto Vercel reportado em Node.js 24;
- `LINKEDIN-001` — MÉDIO: claims podem ficar imprecisos ou desatualizados sem vínculo obrigatório ao banco de evidências;
- publicação externa — ALTO: exige aprovação humana explícita e revisão de privacidade em cada post.

## Current Context

- brief: `project-brief.md`
- project type: `project-type.yaml`
- capabilities: `capability-registry.yaml`
- product requirements: `docs/product/prd.md`
- architecture: `architecture.md`
- stack: `project-stack.md`
- toolchain: `project-toolchain.md`
- active artifact: `docs/linkedin/LINKEDIN-001/`
- requirements: `docs/linkedin/LINKEDIN-001/feature-prd.md`
- specification: `docs/linkedin/LINKEDIN-001/content-spec.md`
- validation: `docs/linkedin/LINKEDIN-001/validation-strategy.md`, `docs/linkedin/LINKEDIN-001/rubrics.md`
- priority post: `docs/linkedin/posts/LI-POST-002/`
- positioning: `docs/linkedin/positioning.md`
- audience: `docs/linkedin/audience.md`
- evidence: `docs/linkedin/evidence-base.md`
- live evidence: `docs/linkedin/posts/LI-POST-002/supabase-evidence-2026-09-10.md`
- editorial plan: `docs/linkedin/content-pillars.md`, `docs/linkedin/content-calendar.md`
- quality gates: `quality-gates.md`
- context routes: `context-map.yaml`

## Current Decisions

- conteúdo profissional deriva de evidências versionadas e distingue fato, inferência e decisão;
- nenhum dado financeiro, segredo, credencial, métrica ou resultado não comprovado pode ser publicado;
- publicação, alteração do perfil e comunicação externa exigem aprovação humana específica;
- o primeiro case de candles só entra em draft após concluir `UX-CHART-003C2/003C3`;
- a trilha editorial não altera a prioridade ou os gates das features de software.

## Next Action

Executar o Dia 4 da `LINKEDIN-001` para expandir controladamente contexto, exemplo e CTA do `LI-POST-002` sem adicionar claims fora do contrato.

## History

Não carregar automaticamente. O contexto acumulado até a `UX-CHART-003B` foi preservado integralmente em `docs/history/project-context-v3-through-2026-09-08.md`. Releases consolidadas ficam em `docs/releases/`.
