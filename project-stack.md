# Project Stack — FinControl

## Status da decisão

Stack vigente, aprovada e já materializada antes da migração `GOV-V4-001`. Este documento consolida a decisão existente; não seleciona tecnologia nova.

## Aplicação

- Node.js `>=22 <23`;
- Next.js 16 com App Router;
- React 19;
- TypeScript 6 em modo estrito conforme `tsconfig.json`;
- Tailwind CSS 3;
- PWA com manifesto e comportamento responsivo validado.

## Dados e identidade

- Supabase Auth;
- PostgreSQL gerenciado pelo Supabase;
- Supabase SSR e `supabase-js`;
- migrations SQL forward-only;
- RLS por proprietário para dados financeiros;
- RPCs financeiras `SECURITY INVOKER`, com privilégios mínimos.

## Visualização

- Apache ECharts 6 encapsulado em adapters/componentes da camada `presentation`;
- tabelas textuais equivalentes para acessibilidade;
- cálculos financeiros determinísticos permanecem em `domain`/`application`.

## Validação

- Jest 30;
- Testing Library;
- ESLint 9;
- TypeScript (`tsc --noEmit`);
- build de produção do Next.js;
- pgTAP para contratos críticos de banco.

## Restrições arquiteturais

- `src/app` apenas compõe rotas, layouts e dependências;
- UI não acessa o banco diretamente;
- domínio não depende de React, Next.js ou Supabase;
- infraestrutura implementa ports definidos pelas camadas internas;
- novas dependências ou mudança de stack exigem trade-offs documentados e aprovação humana.

## Fontes autoritativas

- versões exatas: `package.json` e `package-lock.json`;
- arquitetura: `architecture.md` e ADRs ativos;
- banco: `database-model.md` e `supabase/migrations/`.
