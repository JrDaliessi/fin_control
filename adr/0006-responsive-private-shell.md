# ADR 0006 — Shell privado e navegação responsiva

- Status: Aceito
- Data: 2026-07-16
- Small release: `UI-002`

## Contexto

A UI-001 entregou marca, temas e primitives essenciais. O shell privado atual exibe somente e-mail e logout, enquanto as rotas `/dashboard`, `/transactions` e `/accounts` já possuem fluxos funcionais. A especificação FinControl Pulse descreve uma navegação futura mais ampla, mas a maioria desses destinos ainda não existe e não pode ser apresentada como affordance real.

O shell atravessa todas as rotas privadas e deve preservar autenticação, logout, temas, acessibilidade e responsividade sem absorver regras financeiras ou antecipar componentes como drawer e bottom sheet.

## Decisão

### Matriz de rotas

| Destino canônico | Rótulo desktop/tablet | Rótulo mobile | Alias ativo | Disponibilidade |
| --- | --- | --- | --- | --- |
| `/dashboard` | Visão geral | Início | `/` | disponível |
| `/transactions` | Transações | Transações | nenhum | disponível |
| `/accounts` | Contas | Contas | nenhum | disponível |

Rotas futuras não entram na configuração e não são renderizadas como itens desabilitados. O estado ativo usa o pathname e expõe `aria-current="page"`.

### Composição por viewport

- Desktop (`>= 1024px`): sidebar expandida com marca e três destinos; topbar preserva ações globais realmente disponíveis.
- Tablet (`768px–1023px`): rail compacto persistente com ícones, nomes acessíveis e nenhuma informação dependente apenas de hover.
- Mobile (`< 768px`): topbar compacta e navegação inferior com Início, Transações e Contas.

O botão central “Adicionar”, Metas e “Mais” permanecem ausentes. Duplicar Transações com um atalho “Adicionar” ou abrir um bottom sheet nesta release criaria fluxo e primitive fora do recorte.

### Fronteiras

- `PrivateAppShell` permanece composition root cliente em `src/app/(private)`.
- Componentes específicos de sidebar, topbar e navegação mobile ficam em `src/app/(private)/components` até haver reutilização concreta.
- Nenhuma nova primitive é adicionada a `src/shared/components/ui` no Dia 1.
- O shell não contém cálculo, estado ou copy de domínio financeiro.
- `SignOutUseCase`, `SupabaseAuthGateway`, `ThemeSwitcher` e a identidade verificada existente são compostos sem mudar seus contratos.
- As páginas continuam proprietárias de seus elementos `main`; o shell fornece apenas estrutura visual e landmarks de navegação.

## Contratos testáveis para o Dia 2

- somente os três destinos aprovados são renderizados;
- `/` e `/dashboard` ativam Visão geral/Início;
- `/transactions` e `/accounts` ativam somente seus itens correspondentes;
- links ativos expõem `aria-current="page"`;
- desktop, tablet e mobile oferecem nomes acessíveis e alvos mínimos de 44 × 44 px;
- navegação mobile reserva espaço do conteúdo e não introduz overflow horizontal;
- tema, e-mail, estado assíncrono e falha de logout continuam acessíveis;
- busca, notificações, perfil, configurações, ajuda, botão “Adicionar” e rotas futuras não aparecem;
- a matriz de rotas é determinística e não depende do Supabase.

## Alternativas consideradas

### Renderizar toda a navegação futura desabilitada

Rejeitada porque cria ruído e falso affordance para capacidades inexistentes.

### Adotar menu hambúrguer ou drawer no tablet e mobile

Rejeitada nesta release porque exigiria uma nova primitive modal, contenção e retorno de foco sem necessidade para apenas três destinos.

### Colocar os componentes imediatamente em `shared/components/ui`

Rejeitada por ausência de reutilização real fora do shell e pelo risco de abstração prematura.

### Manter somente o cabeçalho atual

Rejeitada porque não oferece orientação persistente nem acesso coerente entre as três rotas funcionais.

## Consequências

- A navegação inicial é menor que a visão futura, porém honesta e integralmente funcional.
- O shell passa a depender do pathname do App Router apenas para estado de apresentação.
- Mudanças em todas as rotas privadas exigem testes de regressão do shell e do logout.
- A expansão futura ocorre adicionando destinos somente após seus fluxos entrarem no backlog e ficarem funcionais.

## Próximo passo

Executar o Dia 2 da UI-002, criando primeiro testes de apresentação para a matriz de rotas, estado ativo, acessibilidade e preservação do logout.
