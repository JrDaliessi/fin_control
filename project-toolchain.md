# Project Toolchain — FinControl

## Ambiente local

- gerenciador: npm 11;
- runtime contratado: Node.js 22;
- instalação reproduzível: `npm ci`;
- desenvolvimento: `npm run dev`.

## Quality gates

- `npm run lint`;
- `npm run type-check`;
- `npm run test:ci`;
- `npm run build`;
- `git diff --check`;
- testes pgTAP quando schema, RPC, RLS ou migration forem afetados.

## Entrega

- GitHub com branches isoladas e pull requests para `develop`;
- GitHub Actions executa os quality gates;
- Vercel cria previews e hospeda a aplicação;
- Supabase CLI/MCP é usado somente quando a tarefa envolve banco e após carregar as regras específicas.

## Convenções

- branches novas usam o prefixo `codex/`;
- commits descrevem a small release ou fase entregue;
- merge recomendado: squash para incrementos completos;
- `.env.local` nunca é versionado;
- ações remotas, migrations e deploys são validados no alvo correto antes da execução.

## Drift conhecido

`CI-VERCEL-002`: o repositório contrata Node.js 22, enquanto a configuração atual do projeto Vercel reportou Node.js 24. O Preview permanece funcional, mas o alinhamento deve ocorrer antes do hardening final de produção.
