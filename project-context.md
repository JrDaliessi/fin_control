# Project Context

project: FinControl
project_state: OPERATING
active_capabilities: [software, product, linkedin, content]
active_artifact: LINKEDIN-001
artifact_state: READY_FOR_RELEASE
phase: Dia 7
last_release: UX-CHART-003C1

## Current Goal

Construir uma narrativa profissional verificável do FinControl para recrutadores, sem inventar métricas, resultados ou capacidades.

## Current Delivery State

- PR `#31` entregou a fundação e os Dias 1–3 no commit `c42effb`;
- PR `#32` entregou o Dia 4 no commit `fce2159` com checks verdes;
- `LI-POST-002` possui oito claims e versão final textual de 303 palavras aprovada internamente;
- Supabase foi revalidado em 2026-09-11 sem alteração de migrations, RLS, grants, policies, FKs ou advisors;
- PR `#33` versionou os Dias 5–7 no commit de conteúdo `201fe3f`, com `validate` e Vercel verdes nesse commit;
- `LI-POST-001` permanece bloqueado por `UX-CHART-003C2/003C3`; `LI-POST-003` segue em discovery;
- `final.md` foi criado por aprovação humana em 2026-09-12; nenhum perfil foi alterado e nenhuma publicação foi executada;
- branch atual: `codex/linkedin-001-days-5-7`.

## Blockers

Nenhum bloqueio técnico impede o versionamento da versão final do `LI-POST-002`.

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

Versionar `final.md` na PR `#33` e validar o novo head. Depois, decidir o merge separadamente; publicação continuará não autorizada até uma autorização posterior e específica.

## History

Não carregar automaticamente. O contexto acumulado até a `UX-CHART-003B` foi preservado integralmente em `docs/history/project-context-v3-through-2026-09-08.md`. Releases consolidadas ficam em `docs/releases/`.
