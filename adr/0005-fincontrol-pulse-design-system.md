# ADR 0005 — FinControl Pulse como sistema visual incremental

## Status

Aceito em 2026-07-14 para discovery e implementação incremental.

## Contexto

A interface atual valida os primeiros fluxos, mas ainda não possui uma identidade unificada, navegação estrutural, temas ou componentes compartilhados de UI. A proposta FinControl Pulse adiciona sistema visual, shell responsivo, dashboard analítico, páginas internas, copywriting, metas, gamificação e IA.

Parte dessa proposta depende de domínios e dados ainda inexistentes. Implementá-la como redesenho único produziria componentes sem contratos, dados fictícios, rotas vazias e quebra do protocolo de small releases.

## Decisão

- FinControl Pulse é a direção visual oficial do produto.
- A implementação será dividida em `UI-001` a `UI-006` e integrada às SRs de domínio existentes.
- Tokens semânticos em CSS serão a fonte de cor e tema; Tailwind mapeará esses tokens.
- Geist será carregada por `next/font/google`, convertida em variável CSS e exposta como `font-sans`; o arquivo é auto-hospedado pelo build e não exige uma dependência adicional.
- `PrivateAppShell` será a composition root visual; não receberá regras financeiras.
- Primitives genéricas ficam em `src/shared/components/ui`; componentes com semântica financeira ficam na feature proprietária.
- Rotas, ações, indicadores e copy só aparecem quando a capacidade correspondente existir.
- Preferência de tema é dado de apresentação; não autoriza persistência de dados financeiros no navegador.
- Bibliotecas de gráficos continuam bloqueadas até o `SP-001`.
- Copy segue o tom “informar, explicar, sugerir”, sem culpa, promessa enganosa ou IA antecipada.

### Recorte aprovado da UI-001

- A marca técnica e visível será padronizada como `FinControl` em metadata, manifest e superfícies existentes. A assinatura “Seu copiloto financeiro” fica disponível para contextos institucionais, sem prometer IA já entregue.
- Tokens usam canais RGB em variáveis CSS e o formato Tailwind `rgb(var(--token) / <alpha-value>)`, preservando suporte a opacidade.
- O tema aceita `light`, `dark` e `system`; somente os valores permitidos podem ser persistidos sob a chave não sensível `fincontrol.theme`.
- O tema resolvido é aplicado em `data-theme="dark"` no elemento raiz. Tailwind 3.4 usará `darkMode: ["selector", '[data-theme="dark"]']`.
- Um inicializador estático, carregado antes da hidratação, resolve a preferência armazenada ou do sistema para evitar flash relevante. O provider React sincroniza mudanças posteriores e `matchMedia` quando a preferência for `system`.
- O armazenamento do navegador não pode receber saldo, transações, identidade ou outro dado financeiro. Tema é estado de apresentação e não depende de domain, application ou Supabase.
- Primitives iniciais ficam limitadas a `Button`, `Card`, `FeedbackMessage` e `ThemeSwitcher`, justificadas por repetição ou necessidade transversal real. Inputs, modal, drawer, badge, tabs, skeleton e componentes financeiros ficam fora deste recorte.
- `clsx`, já instalado, é suficiente para composição de classes. Nenhuma biblioteca de tema ou de componentes será adicionada.

### Paleta semântica de referência

| Token | Claro | Escuro |
| --- | --- | --- |
| `background` | `#F6F8FC` | `#0B1220` |
| `surface` | `#FFFFFF` | `#111827` |
| `surface-elevated` | `#FFFFFF` | `#1E293B` |
| `foreground` | `#111827` | `#F8FAFC` |
| `muted-foreground` | `#5F6F85` | `#94A3B8` |
| `border` | `#E5E7EB` | `#334155` |
| `primary` | `#0F766E` | `#2DD4BF` |
| `primary-hover` | `#115E59` | `#5EEAD4` |
| `primary-foreground` | `#FFFFFF` | `#042F2E` |
| `accent` | `#2563EB` | `#60A5FA` |
| `income` | `#15803D` | `#4ADE80` |
| `expense` | `#DC2626` | `#FB7185` |
| `danger-foreground` | `#B91C1C` | `#FDA4AF` |
| `warning` | `#D97706` | `#FBBF24` |
| `focus-ring` | `#2563EB` | `#7DD3FC` |

Os valores são referências aprovadas para os testes do Dia 2. Cada combinação real de texto, fundo, foco e estado ainda precisa comprovar WCAG AA antes da implementação ser aceita.

Correção orientada por teste em 2026-07-14: `#64748B` produziu contraste de apenas 4,476:1 sobre `#F6F8FC`. O token claro `muted-foreground` foi ajustado para `#5F6F85`, atingindo aproximadamente 4,818:1 sem alterar a hierarquia visual.

## Alternativas consideradas

### Redesenho completo imediato

Rejeitado por misturar navegação, domínio, analytics, metas e IA sem dados ou testes suficientes.

### Apenas trocar cores e fontes

Rejeitado porque não resolve hierarquia, navegação, responsividade, estados e clareza de conteúdo.

### Biblioteca de componentes externa completa

Adiada. Pode aumentar dependências e impor padrões antes de existir necessidade real. Primitives serão criadas incrementalmente.

## Consequências

- A percepção visual melhora em entregas pequenas e auditáveis.
- Alguns cards e rotas permanecerão ausentes até seus domínios existirem.
- O design system precisa de testes de contraste, tema, teclado, responsividade e movimento reduzido.
- Mudanças globais de marca e shell terão cobertura de regressão das rotas atuais.
- A especificação completa vive em `docs/product/fincontrol-pulse-interface-copy.md`.

## Referências técnicas

- Next.js — Fontes e `next/font`: https://nextjs.org/docs/app/getting-started/fonts
- Next.js — API de `next/font` e variável CSS: https://nextjs.org/docs/app/api-reference/components/font
- Tailwind CSS 3 — dark mode por seletor e preferência do sistema: https://v3.tailwindcss.com/docs/dark-mode
