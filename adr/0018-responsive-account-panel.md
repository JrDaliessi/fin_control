# ADR 0018 — Cabeçalho compacto e painel responsivo da conta

- Status: aprovado para TDD incremental
- Data: 2026-09-01
- Small release: `UX-SHELL-001`
- Evolui: ADR 0006

## Contexto

A UI-002 entregou sidebar/rail, navegação inferior e topbar privada. Com a evolução do tema e da sessão, a topbar passou a empilhar marca, título, e-mail, três opções de tema e logout no mobile. Na primeira dobra, essa composição ocupa espaço excessivo e repete o título que já existe como `h1` da página.

A navegação inferior já oferece os três destinos móveis disponíveis. Um menu hambúrguer com as mesmas rotas duplicaria a arquitetura de navegação e criaria ambiguidade. A necessidade real é recolher ações globais de conta e aparência sem esconder a navegação principal.

## Decisão

### Topbar

- A topbar terá uma única linha de até 64 px, além da safe area superior quando aplicável.
- Mobile mostra `FinControl` de forma compacta à esquerda e o trigger da conta à direita.
- A partir de 768 px, o shell pode mostrar o contexto atual da rota de forma discreta e mantém o mesmo trigger à direita.
- O título e a descrição principais continuam pertencendo às páginas. O header mobile não repete `Visão geral`.

### Trigger e conteúdo

- O trigger usa ícone de conta ou iniciais apresentacionais, alvo mínimo de 44 × 44 px e nome acessível `Abrir painel da conta`.
- O endereço completo não aparece permanentemente no header; fica dentro do painel.
- O painel contém título `Conta e aparência`, e-mail, `ThemeSwitcher` e `SignOutButton` separado visualmente ao final.
- Trocar o tema não fecha o painel. O fluxo de logout existente conserva loading, erro e redirecionamento.

### Comportamento responsivo

- Abaixo de 768 px, o diálogo é apresentado como bottom sheet e respeita `safe-area-inset-bottom`.
- A partir de 768 px, o mesmo conteúdo aparece como painel ancorado ao canto superior direito.
- O componente mantém semântica de diálogo em ambos os modos. `role=menu` foi rejeitado porque radiogroup e informação estática de sessão não correspondem ao padrão ARIA Menu.
- Backdrop, botão explícito e `Escape` fecham o painel; foco retorna ao trigger.
- Enquanto aberto, o foco permanece contido e o scroll do documento é bloqueado. Animações respeitam movimento reduzido.

### Fronteiras do Next.js e React

- `PrivateAppShell` permanece client composition root porque já usa `usePathname`, `useRouter` e monta a orquestração do logout.
- `PrivateTopbar` permanece componente de composição visual do App Router.
- Um `AccountPanel.client.tsx` específico do shell concentra abertura, fechamento, foco, teclado, backdrop, scroll e variação de layout.
- Props atravessam apenas a fronteira cliente já existente; não são introduzidas props não serializáveis de Server Component para Client Component.
- `ThemeSwitcher` e `SignOutButton` são reutilizados. Nenhum acesso direto ao Supabase é adicionado à topbar ou ao painel.
- Nenhuma primitive modal genérica será criada antes de existir evidência de reutilização. Possível extração de foco compartilhado será avaliada apenas no Dia 5.

## Contratos testáveis para o Dia 2

1. header mobile expõe marca e trigger, sem repetir o título da página;
2. painel permanece fechado por padrão e seus controles não são alcançáveis;
3. trigger expõe `aria-expanded` e abre diálogo nomeado com sessão, tema e logout;
4. abertura move foco para o painel; `Tab` e `Shift+Tab` não escapam;
5. botão, backdrop e `Escape` fecham e restauram foco;
6. scroll do documento é bloqueado somente enquanto aberto e restaurado ao fechar/desmontar;
7. troca de tema funciona sem fechar o diálogo;
8. logout mantém contrato assíncrono, erro e redirecionamento existentes;
9. navegações desktop/mobile e skip link permanecem funcionais;
10. classes responsivas distinguem bottom sheet e painel ancorado, com alvo mínimo e safe areas;
11. rota desconhecida mantém fallback neutro sem inventar destino;
12. nenhuma nova rota, dependência ou acesso Supabase é introduzido.

## Alternativas consideradas

### Menu hambúrguer com navegação

Rejeitado porque a navegação inferior já é persistente e integralmente funcional no mobile.

### Manter tema e logout sempre visíveis

Rejeitado porque mantém altura excessiva e dá prioridade permanente a ações de baixa frequência.

### Drawer lateral em todos os viewports

Rejeitado porque ocupa alcance e largura desnecessários no mobile; bottom sheet é mais confortável para ações ocasionais próximas à parte inferior da tela.

### Biblioteca externa de dialog/popover

Rejeitada nesta small release. O recorte é pequeno, não existe dependência equivalente e adicionar uma biblioteca aumentaria bundle e superfície de manutenção sem necessidade comprovada.

## Consequências

- Todas as páginas privadas ganham mais espaço útil sem modificar seus componentes.
- Sessão, tema e logout exigem uma ação adicional, compensada por um trigger previsível e persistente.
- Foco, teclado e scroll tornam-se contratos críticos de apresentação e devem nascer em TDD.
- A navegação móvel continua simples, sem duplicidade entre bottom bar e painel da conta.
- `UX-SHELL-001` fica pronta para o Dia 2; nenhuma implementação funcional foi criada no Dia 1.

## Próximo passo

Executar o Dia 2 e criar os testes essenciais em RED antes de alterar `PrivateTopbar` ou adicionar `AccountPanel.client.tsx`.
