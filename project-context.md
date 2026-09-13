# Project Context

project: FinControl
project_state: OPERATING
active_capabilities: [software, product, content, linkedin]
active_artifact: REPO-SHOWCASE-001
artifact_state: READY_FOR_RELEASE
phase: Modo rápido
last_release: LINKEDIN-001/LI-POST-002

## Current Goal

Preparar uma entrada pública intuitiva e factual para recrutadores, distinguindo claramente a arquitetura atual da evolução planejada para NestJS, sem alterar o aplicativo.

## Current Delivery State

- `origin/main` contém a promoção `Develop (#34)` no commit `b8bab6c`, incluindo `LI-POST-002` concluído editorialmente e ainda não publicado;
- o repositório `JrDaliessi/fin_control` foi confirmado como público em 2026-09-13;
- `REPO-SHOWCASE-001` materializa README orientado ao produto, visita técnica guiada, roadmap NestJS, ADR 0023 e política de segurança;
- o link principal `https://fin-control-two.vercel.app` foi validado em navegador e redireciona para `/login`;
- o portfólio `https://curriculo-web-ten.vercel.app/` foi validado e centraliza o acesso demo, mas seu link de código do FinControl ainda aponta para o repositório antigo `fincontrol-showcase`;
- o quality gate passou em links, YAML, escopo, credenciais, diff, ESLint, type-check, 97 suítes/669 testes, audit sem vulnerabilidades e build de produção.
- a branch `codex/repo-showcase-001` foi criada diretamente de `origin/main`; a PR `#35` e seus testes RED permanecem isolados.

## Blockers

Nenhum bloqueio técnico impede o versionamento da `REPO-SHOWCASE-001`.

Bloqueios externos antes de produção pública completa:

- `SEC-AUTH-001`: o Security Advisor confirmou em 2026-09-10 que a proteção nativa contra senhas vazadas segue desativada e depende de upgrade humano do Supabase;
- `SEC-HARD-001B`: decisão humana e credenciais externas para proteção adicional de autenticação;
- `HARD-OBS-001`: baseline produtivo de observabilidade ainda pendente.

## Active Risks

- `CI-ACTIONS-001` — BAIXO: `actions/checkout@v4` e `actions/setup-node@v4` dependem de runtime Node.js 20 e o runner atual as força para Node.js 24;
- `CI-VERCEL-002` — MÉDIO: contrato local/CI em Node.js 22 e projeto Vercel reportado em Node.js 24;
- `LINKEDIN-001` — MÉDIO: claims podem ficar imprecisos ou desatualizados sem vínculo obrigatório ao banco de evidências;
- publicação externa — ALTO: exige aprovação humana explícita e revisão de privacidade em cada post;
- `REPO-SHOWCASE-001` — MÉDIO: o link de código no portfólio precisa ser atualizado de `fincontrol-showcase` para o repositório público real `fin_control`.

## Current Context

- brief: `project-brief.md`
- project type: `project-type.yaml`
- capabilities: `capability-registry.yaml`
- product requirements: `docs/product/prd.md`
- architecture: `architecture.md`
- stack: `project-stack.md`
- toolchain: `project-toolchain.md`
- active artifact: `docs/showcase/`
- active status: `docs/showcase/status.md`
- active ADR: `adr/0023-incremental-nestjs-api-extraction.md`
- database contracts: `database-model.md`, `module-contracts.md`, `supabase/migrations/`
- editorial evidence: `docs/linkedin/evidence-base.md`
- editorial plan: `docs/linkedin/content-pillars.md`, `docs/linkedin/content-calendar.md`
- quality gates: `quality-gates.md`
- context routes: `context-map.yaml`
- showcase: `README.md`, `SECURITY.md`, `docs/showcase/`
- next architecture direction: `adr/0023-incremental-nestjs-api-extraction.md`

## Current Decisions

- conteúdo profissional deriva de evidências versionadas e distingue fato, inferência e decisão;
- nenhum dado financeiro, segredo, credencial, métrica ou resultado não comprovado pode ser publicado;
- publicação, alteração do perfil e comunicação externa exigem aprovação humana específica;
- o primeiro case de candles só entra em draft após concluir `UX-CHART-003C2/003C3`;
- a trilha editorial não altera a prioridade ou os gates das features de software.
- a evolução `Next.js → API NestJS → PostgreSQL no Supabase` está aprovada como direção e discovery, não como implementação concluída;
- o repositório oficial é `JrDaliessi/fin_control`; `fincontrol-showcase` não será mais utilizado.

## Next Action

Versionar `REPO-SHOWCASE-001`, abrir uma PR documental para `main` e validar seu head. A continuidade da `UX-CHART-003C2` permanece isolada na PR `#35` e exige comando próprio.

## History

Não carregar automaticamente. O contexto acumulado até a `UX-CHART-003B` foi preservado integralmente em `docs/history/project-context-v3-through-2026-09-08.md`. Releases consolidadas ficam em `docs/releases/`.
