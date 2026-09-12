# UX-CHART-003B — Dia 6: UX, acessibilidade e PWA

- Data: 2026-09-08
- Estado de entrada: `IMPLEMENTATION_IN_PROGRESS`
- Estado de saída: `QUALITY_VALIDATION`
- Resultado: GREEN com risco operacional BAIXO documentado

## Problemas confirmados

1. ECharts escrevia `role` e `aria-label` no mesmo nó nomeado pelo React, substituindo a descrição curta em português por texto automático com valores brutos.
2. Em uma barra rolável estreita, períodos finais como `3M` e `Ano` poderiam iniciar fora da área visível.
3. Transformar todo o seletor em Client Component violaria a decisão arquitetural de navegação GET progressiva e server-rendered.

## Solução aplicada

- O wrapper externo de cada gráfico mantém `role="img"`, nome e descrição estáveis.
- O nó entregue ao ECharts é filho do wrapper e recebe `aria-hidden="true"`.
- A tabela textual continua como alternativa acessível e operável.
- O seletor principal permanece Server Component e formulário GET.
- Uma ilha cliente específica localiza somente o botão com `aria-pressed="true"` e centraliza-o pela rolagem do próprio container, sem mover foco nem deslocar a página verticalmente.
- A barra declara `touch-pan-x`, `overflow-x-auto` e `overscroll-x-contain`; os botões mantêm altura mínima de 44 px.

## Evidência de navegador

- Dashboard local autenticado em 1280 px sem overflow global (`clientWidth` e `scrollWidth` iguais a 1265 px).
- Sete períodos presentes; `Ano atual` selecionado com alvo de 44 px.
- `3M` atualizou a URL para `period=three_months` e apresentou semana na cópia, gráfico e tabela.
- `Ano` atualizou a URL para `period=year` e apresentou mês na cópia, gráfico e tabela.
- Linha e candles mantiveram nomes acessíveis em português; o renderer interno permaneceu oculto da árvore acessível.
- Extrato mensal abriu como diálogo modal, bloqueou scroll, fechou com Escape e devolveu foco ao botão correto.
- Nenhum overlay de erro foi encontrado; o aviso de `unsafe-eval` observado pertence exclusivamente ao CSP de desenvolvimento do React/Next.

## PWA e responsividade

- `lang="pt-BR"`, viewport `device-width`, manifesto standalone, theme colors claro/escuro, safe areas e reduced motion permanecem configurados.
- Contratos Jest verificam rótulos compactos, ordem, seleção exclusiva, teclado, 44 px, scroll confinado e GET progressivo.
- A tentativa de emulação isolada em 320/390/768/1280 abriu o app, mas o harness CDP não preencheu os inputs React e permaneceu em `/login`; os campos continuaram vazios e não houve erro do app.
- O harness e screenshots temporários foram removidos. A inspeção visual automatizada em 320/390 px será repetida no Preview durante o Dia 7; risco BAIXO porque a mesma barra-base já foi verificada em 320 px na `003A` e o comportamento novo possui teste determinístico.

## Gates

- gráficos: 2 suítes, 24 testes;
- seletor: 14 testes;
- feature: 32 suítes, 290 testes;
- regressão: 95 suítes, 621 testes;
- ESLint: verde sem warnings;
- type-check: verde;
- build Next.js 16.3.3: verde.

## Fora do escopo preservado

- `UX-CHART-003C`, `Tudo`, personalizado, comparação e drill-down;
- migrations, RPC, RLS, índices e dados remotos;
- estratégia offline para dados financeiros;
- dependências novas, commit, push, PR, merge, deploy e promoção.
