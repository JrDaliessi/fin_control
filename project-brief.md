# Project Brief — FinControl

## Project Name

FinControl

## Project Type

Produto digital de software: PWA de finanças pessoais.

## Problem / Need

Pessoas precisam registrar e compreender sua vida financeira sem depender de interfaces de trading, planilhas complexas ou recomendações opacas. O produto deve transformar movimentações, contas e períodos civis em informação clara, preservando privacidade, segurança e controle humano.

## Expected Outcome

Uma aplicação responsiva que permita acompanhar contas, receitas, despesas, saldo e evolução financeira, com visualizações acessíveis e explicações determinísticas. Capacidades de IA permanecem futuras e só poderão complementar cálculos verificáveis com consentimento explícito.

## Audience

- pessoa usuária que deseja acompanhar finanças pessoais;
- recrutadores e avaliadores técnicos usando uma conta de demonstração;
- mantenedor do projeto, que precisa de entregas rastreáveis e verificáveis.

## Deliverables

- PWA Next.js responsiva e acessível;
- autenticação e isolamento de dados por usuário;
- contas, categorias e transações persistentes;
- dashboard com períodos financeiros, linha, candles, tabelas e extrato contextual;
- documentação viva, ADRs, migrations e testes automatizados;
- pipeline de qualidade e previews/deploys pela Vercel.

## Success Criteria

- fluxos entregues funcionam com dados reais do usuário autenticado;
- nenhuma UI acessa diretamente a persistência;
- RLS e isolamento cross-tenant protegem os dados financeiros;
- critérios de aceite possuem validação automatizada proporcional ao risco;
- lint, type-check, testes e build permanecem verdes antes da release;
- experiência principal funciona em desktop e mobile sem perder equivalência textual dos gráficos.

## Constraints

- desenvolvimento incremental por small releases e Dias 0–7;
- Feature-Based + Clean Architecture leve;
- datas financeiras seguem períodos civis em `America/Sao_Paulo`;
- não usar dados financeiros reais durante o desenvolvimento;
- recursos pagos ou credenciais externas dependem de decisão humana;
- nenhuma promessa de Open Finance, IA ou offline completo sem capacidade validada.

## Risks

- autenticação pública ainda depende dos hardenings `SEC-AUTH-001` e `SEC-HARD-001B`;
- ausência de observabilidade produtiva completa (`HARD-OBS-001`);
- divergência entre Node.js 22 no contrato do repositório e Node.js 24 configurado na Vercel (`CI-VERCEL-002`);
- agregações históricas e migrations exigem validação de RLS, limites e performance.

## Dependencies

- Supabase Auth e PostgreSQL com RLS;
- Vercel para preview e hospedagem;
- GitHub Actions para quality gates;
- ECharts encapsulado na camada de apresentação.

## Sources

- `docs/product/advanced-financial-analytics-gamification.md`;
- `docs/product/fincontrol-pulse-interface-copy.md`;
- `architecture.md`, `domain-model.md`, `database-model.md` e `module-contracts.md`;
- ADRs aceitos em `adr/`;
- histórico anterior em `docs/history/project-context-v3-through-2026-09-08.md`.

## Capabilities Needed

- `software`;
- `product`;
- núcleo de governança e rastreabilidade.

## Technology Required?

Sim. A stack existente foi decidida e validada incrementalmente antes da adoção da governança v4; sua consolidação está em `project-stack.md`.

## Toolchain Required?

Sim. O contrato operacional vigente está em `project-toolchain.md`.

## Approval

- intenção, stack e arquitetura: aprovadas nos ciclos anteriores registrados nos ADRs e no histórico;
- migração documental para Regras IDE v4: aprovada pelo usuário em 2026-09-08;
- qualquer mudança de requisito central, arquitetura, stack ou serviço pago exige nova aprovação humana.
