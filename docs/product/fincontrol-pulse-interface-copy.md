# FinControl Pulse — Interface, Experiência e Copywriting

## Status e fontes

- Tipo: especificação consolidada de produto, UX, UI e conteúdo
- Data: 2026-07-14
- Estado: aprovado para discovery e implementação incremental
- Fontes: proposta de interface anexada pelo usuário, conversa referenciada “Interface gráfica para FinControl”, repositório atual e `docs/product/advanced-financial-analytics-gamification.md`

Esta especificação registra a proposta completa sem autorizar implementação one-shot. Cada recorte funcional deve entrar no backlog, executar os Dias 1 a 7 e respeitar TDD, arquitetura, segurança, acessibilidade e dados realmente disponíveis.

## 1. Visão do produto

O FinControl deve evoluir de uma primeira interface funcional para uma central de decisões financeiras. A experiência precisa responder rapidamente:

1. Quanto eu tenho de verdade?
2. Para onde meu dinheiro está indo?
3. O que devo fazer agora?

O conceito visual é **FinControl Pulse**: clareza bancária, capacidade analítica, planejamento e inteligência explicável, com gamificação adulta e discreta.

O produto deve transmitir segurança, organização, inteligência, confiança, tranquilidade, controle e modernidade. Não deve parecer apenas um formulário de receitas e despesas.

## 2. Diagnóstico da interface atual

A base técnica já permite evolução segura: Next.js, React, TypeScript, Tailwind, PWA, Supabase e Feature-Based + Clean Architecture leve.

O estado atual ainda é propositalmente inicial:

- o shell privado mostra e-mail e saída, sem navegação estrutural;
- o dashboard possui resumo mensal e transações recentes;
- não há sidebar desktop ou navegação inferior mobile;
- não há gráficos financeiros, metas, compromissos ou IA no dashboard;
- Arial ainda é a fonte global;
- tokens visuais estão limitados a poucas cores fixas;
- não existe tema escuro;
- formulários de contas e transações ficam permanentemente visíveis;
- login é a tela visualmente mais madura e deve manter a composição dividida.

## 3. Posicionamento e marca

### Nome

- Marca principal: **FinControl**
- Assinatura: **Seu copiloto financeiro**
- Nome institucional: **FinControl — Controle Financeiro Inteligente**
- Nome curto da PWA: **FinControl**

O código ainda usa “Controle Financeiro IA” e “Finanças IA”. A padronização deve ocorrer em uma small release própria, incluindo metadata, manifesto, títulos visíveis e testes.

### Promessa

> O FinControl organiza seus números, explica o que está acontecendo e ajuda você a decidir o próximo passo.

### Slogan institucional

> Entenda seu dinheiro. Antecipe riscos. Decida com clareza.

### Slogan emocional

> Clareza hoje. Tranquilidade amanhã.

### Regra de disponibilidade

Enquanto a IA da SR-023 não existir, o produto não pode prometer análises personalizadas prontas. Copy permitida:

- “Análises inteligentes em desenvolvimento.”
- “Prepare seus dados para receber análises mais completas futuramente.”

## 4. Tom de voz

O FinControl fala como um especialista tranquilo: claro, acolhedor, direto, inteligente, seguro, respeitoso e otimista sem prometer resultados.

Fluxo obrigatório de comunicação:

> informar → explicar → sugerir

Evitar culpa, julgamento ou pressão.

| Evitar | Preferir |
|---|---|
| Você gastou demais. | Seus gastos ficaram acima do planejado neste período. |
| Sua situação está ruim. | Este mês exige um pouco mais de atenção. |
| Você falhou na meta. | Sua meta ficou pausada. Retome quando estiver pronto. |
| Você alcançará em novembro. | Mantendo o ritmo atual, você pode chegar lá aproximadamente em novembro. |

Toda copy deve explicar o que aconteceu, por que importa, o que significa e qual pode ser o próximo passo.

## 5. Identidade visual

### Tema claro

- fundo cinza muito claro, quase branco;
- superfícies brancas;
- bordas suaves;
- sombras discretas;
- bastante espaço entre elementos.

### Tema escuro

- fundo azul-marinho profundo;
- superfícies grafite ou azul-escuras;
- texto branco suave;
- verde, azul e roxo nos destaques;
- bordas discretas com contraste suficiente.

### Paleta semântica inicial

| Função | Referência clara |
|---|---|
| Background | `#F6F8FC` |
| Surface | `#FFFFFF` |
| Foreground | `#111827` |
| Muted | `#64748B` |
| Navegação escura | `#0B1220` |
| Primary | `#0F766E` |
| Accent/analytics | `#2563EB` |
| Income/success | `#15803D` |
| Expense/danger | `#DC2626` |
| Warning | `#D97706` |
| AI/goals | `#7C3AED` |
| Border | `#E5E7EB` |

As cores são referências de partida. Contraste WCAG AA e estados interativos prevalecem sobre fidelidade literal ao hexadecimal.

### Uso

- verde-petróleo: marca, ações principais, seleção e progresso positivo;
- azul: gráficos, filtros ativos, relatórios e informações analíticas;
- roxo: IA, metas, simulações e gamificação;
- vermelho: despesas, atraso, criticidade e erro;
- receitas e despesas nunca dependem somente de cor.

### Tipografia e forma

- fonte preferencial: Geist; alternativa: Inter; Manrope exige decisão adicional;
- cartões pequenos: raio de 14–18 px;
- cartões principais: 20–24 px;
- botões: 10–14 px;
- inputs: 10–12 px;
- ícones: Lucide;
- sombras leves e bordas pesadas somente quando semanticamente necessárias.

### Tokens esperados

```css
--background
--surface
--surface-elevated
--foreground
--muted
--primary
--primary-foreground
--income
--expense
--warning
--danger
--border
--chart-1
--chart-2
--chart-3
--chart-4
--focus-ring
```

## 6. Navegação e shell

### Desktop

Sidebar fixa:

- Visão geral;
- Transações;
- Contas;
- Cartões;
- Planejamento;
- Orçamentos;
- Metas;
- Relatórios;
- Importações;
- FinControl IA.

Rodapé da sidebar:

- Configurações;
- Ajuda;
- Perfil;
- Sair.

O item atual usa fundo sutil, ícone destacado, indicador lateral e contraste reforçado.

### Tablet

- sidebar recolhida com ícones;
- expansão temporária e operável por teclado;
- conteúdo não pode ficar inacessível apenas por hover.

### Mobile

Barra inferior:

> Início · Transações · Adicionar · Metas · Mais

O botão central abre um bottom sheet. Somente ações implementadas podem aparecer. A lista futura contempla despesa, receita, transferência, conta, meta e importação.

Rotas sem feature pronta não devem aparecer como links ativos. Podem permanecer ausentes ou explicitamente marcadas como indisponíveis, sem falso affordance.

### Cabeçalho

Desktop:

- saudação contextual;
- período;
- busca;
- notificações;
- tema;
- avatar e menu de perfil.

Mobile:

- título da página;
- notificações;
- avatar;
- menu compacto.

Copy-base:

> Bom dia, {nome}!  
> Aqui está o que está acontecendo com seu dinheiro hoje.

O nome deve vir de dado disponível e consentido. Na ausência de perfil, usar saudação neutra; nunca inferir nome do e-mail de forma enganosa.

## 7. Dashboard FinControl Pulse

O dashboard usa grid responsivo de 12 colunas e compõe casos de uso; não calcula regras financeiras na UI.

### 7.1 Disponível de verdade

Título recomendado:

> Disponível de verdade

Conteúdo futuro:

- saldo total;
- contas e despesas previstas;
- fatura atual;
- compromissos futuros;
- receitas esperadas;
- valor livre;
- projeção para o fim do mês.

Explicação:

> Este é o valor estimado após considerar contas, faturas e compromissos já conhecidos.

Mensagens possíveis:

- “Você pode usar até R$ X sem comprometer os pagamentos previstos.”
- “Evite assumir novas despesas acima de R$ X até a próxima receita.”
- “Adicione seus compromissos futuros para calcularmos um valor mais realista.”

Esse cartão só pode usar “disponível de verdade” quando as regras de contas, transações, faturas, parcelas, compromissos e receitas previstas estiverem implementadas. Antes disso, deve mostrar um resumo explicitamente parcial.

### 7.2 Indicadores

- **Entrou neste período** — receitas realizadas;
- **Saiu neste período** — despesas realizadas;
- **Você preservou** — economia calculada;
- **Ainda será pago** — compromissos conhecidos;
- **Previsão para o fim do mês** — projeção explicável.

Cada cartão contém ícone, valor, comparação equivalente, tendência não baseada só em cor e descrição curta. Comparações só aparecem com períodos equivalentes e dados suficientes.

### 7.3 Evolução financeira

Título:

> Como seu dinheiro evoluiu

Descrição:

> Acompanhe o que entrou, o que saiu e como seu saldo mudou ao longo do período.

Filtros:

- Esta semana;
- Últimos 7 dias;
- Últimos 15 dias;
- Este mês;
- Últimos 3 meses;
- Últimos 6 meses;
- Este ano;
- Escolher período.

Modos:

- Evolução/Linha como padrão;
- Área, se o spike aprovar;
- Variação do saldo, nome amigável para candles;
- Distribuição.

Candles continuam definidos como abertura, máxima, mínima e fechamento do saldo, nunca como trading. Gráficos sempre têm tabela ou resumo textual equivalente.

### 7.4 Onde seus gastos se concentram

Nome amigável para distribuição de frequência:

> Onde seus gastos se concentram

Descrição:

> Descubra se seu dinheiro está saindo em muitas compras pequenas ou em poucas compras maiores.

Copy de insight:

- “A maioria das suas despesas ficou entre R$ X e R$ Y.”
- “N pequenas compras somaram R$ X.”
- “N despesas representaram X% do total do período.”

Ações: “Ver análise por faixas” e “Mostrar tabela estatística”. A matemática permanece na especificação de analytics existente.

### 7.5 Distribuição por categoria

Gráfico de rosca futuro com Moradia, Alimentação, Transporte, Lazer, Saúde, Assinaturas, Educação e Outros. A seleção destaca a categoria, informa valor e filtra transações. Só entra após categorias e transações persistidas.

### 7.6 FinControl IA

Assinatura:

> Um olhar inteligente sobre sua vida financeira.

Títulos:

- “O que merece sua atenção”;
- “Um olhar sobre sua semana”.

Estrutura da mensagem:

1. fato verificável;
2. consequência estimada e rotulada;
3. sugestão reversível.

Ações futuras:

- Entender melhor;
- Ver movimentações;
- Simular mudança;
- Criar alerta;
- Ajustar orçamento;
- Não mostrar novamente.

IA só entra na SR-023, com consentimento, minimização, opt-out e sem movimentação financeira automática.

### 7.7 Seu progresso

Metas exibem título, atual, alvo, percentual, prazo, contribuição, ritmo e previsão aproximada. Gamificação mostra consistência, não consumo, patrimônio ou competição.

### 7.8 Próximos compromissos

Linha do tempo futura:

- contas a vencer;
- parcelas e assinaturas;
- fechamento e vencimento de cartão;
- receitas previstas;
- metas programadas.

Estados: normal, próximo, atenção, atrasado e concluído, sempre com texto e ícone além da cor.

### 7.9 Últimas movimentações

Cada item contém ícone, descrição, categoria, conta, data, valor, tipo, situação e ações permitidas. Receitas e despesas usam sinal, texto e ícone além da cor.

### 7.10 Ações rápidas

Conjunto futuro: nova despesa, nova receita, meta, importação, relatório e IA. Cada ação só aparece quando o fluxo existe e a autorização permite.

## 8. Transações

Título:

> Registrar movimentação

Descrição:

> Informe o que entrou ou saiu para manter seu saldo atualizado.

A listagem vira conteúdo principal, com resumo, busca, filtros e “Nova movimentação”. Agrupamento por Hoje, Ontem e datas, com totais recebidos, gastos e saldo do dia.

Filtros futuros: período, receita, despesa, transferência, conta, cartão, categoria, valor e status.

Formulário:

- drawer no desktop;
- bottom sheet no mobile;
- tipo, descrição, valor, data, conta e categoria no primeiro recorte persistente;
- forma de pagamento, recorrência, parcela, observação e anexo somente após seus contratos existirem.

Microcopy:

| Campo | Copy |
|---|---|
| Tipo | O dinheiro entrou ou saiu? |
| Descrição | O que aconteceu? |
| Placeholder | Ex.: supermercado, salário ou conta de luz |
| Valor | Qual foi o valor? |
| Conta | Onde o dinheiro entrou ou saiu? |
| Categoria | Como deseja classificar? |
| Data | Quando aconteceu? |

Botões: “Registrar despesa” ou “Registrar receita”.

Sucesso:

> Movimentação registrada. Seu resumo já foi atualizado.

Erros:

- “Conte brevemente o que aconteceu.”
- “Digite um valor válido para continuar.”

## 9. Contas

Título:

> Onde está seu dinheiro?

Descrição:

> Adicione suas contas para visualizar seu saldo total em um só lugar.

Cards futuros mostram nome, instituição, tipo, saldo, cor, ícone, movimentações, percentual do patrimônio e sincronização. Campos ainda não existentes não podem ser simulados como reais.

Topo futuro: saldo consolidado, quantidade, maior saldo e “Adicionar conta”. Cadastro abre em drawer ou modal.

Microcopy:

| Campo | Copy |
|---|---|
| Nome | Como você chama esta conta? |
| Placeholder | Ex.: Nubank, carteira ou poupança |
| Tipo | Que tipo de conta é esta? |
| Saldo | Quanto existe nela hoje? |
| Ajuda | Informe o saldo atual. Use um valor negativo somente quando a conta estiver no vermelho. |

Loading: “Adicionando conta...”. Sucesso: “Conta adicionada. Agora seu saldo está mais completo.”

## 10. Cartões, orçamentos, metas e relatórios

### Cartões

Card com fatura, limite, fechamento, vencimento, parcelas, faturas futuras, melhor dia e comprometimento. Depende de domínio de cartão/fatura/parcelas e não entra no shell como rota ativa antes disso.

### Orçamentos

Barras por categoria com valor usado/alvo e estados saudável, atenção, próximo do limite e ultrapassado. Sugestões de IA dependem de histórico confiável e SR-023.

### Metas

Título:

> Transforme planos em progresso

Descrição:

> Crie um objetivo, acompanhe cada contribuição e descubra quanto falta para chegar lá.

Campos: “O que você quer conquistar?”, “Quanto precisa guardar?”, “Quando deseja alcançar?” e “Quanto pretende guardar por mês?”. Projeções usam “aproximadamente”, “mantendo o ritmo atual” e “com base nos valores registrados”.

### Relatórios

Evolução, categorias, conta, cartão, dia da semana, faixas, comparação, recorrências e compromissos. Exportar PDF/planilha, compartilhar e salvar filtro exigem releases próprias, privacidade e segurança de artefatos.

## 11. Login e autenticação

Manter layout dividido.

Área institucional:

> FinControl  
> Seu copiloto financeiro

> Entenda seu dinheiro antes que ele vire preocupação.

> Acompanhe contas, receitas e despesas em um só lugar e descubra quanto está realmente disponível para você.

Segurança:

> Seus dados ficam protegidos e só podem ser acessados após a verificação da sua sessão.

Formulário:

> Que bom ter você de volta

> Entre para continuar acompanhando sua vida financeira.

Botão: “Entrar com segurança”. Loading: “Verificando seu acesso...”. Transição: “Tudo certo. Abrindo seu FinControl...”.

Erro:

> Não conseguimos confirmar seu acesso. Revise o e-mail e a senha e tente novamente.

Mostrar senha pode entrar como melhoria local testada. Lembrar acesso, recuperação, cadastro e biometria são features de autenticação separadas; não devem ser adicionadas apenas como links sem fluxo real.

## 12. Estados, alertas e confirmações

### Empty state

> Seu histórico começa aqui

> Registre uma receita ou despesa para começar a acompanhar seu saldo e entender seus hábitos financeiros.

CTA: “Adicionar primeira movimentação”.

### Loading

- “Atualizando seu resumo...”;
- “Organizando suas movimentações...”;
- “Calculando seu saldo disponível...”;
- “Preparando sua análise...”.

Usar somente quando a operação descrita realmente estiver ocorrendo.

### Erro geral

> Não conseguimos carregar seus dados agora. Tente novamente em alguns instantes. Suas informações continuam protegidas.

CTA: “Tentar novamente”.

### Alertas

- “Sua conta de energia vence em dois dias.”
- “Seu saldo disponível pode não cobrir todos os compromissos previstos.”
- “Você já utilizou X% do orçamento de {categoria}.”
- “Sua fatura está R$ X acima do mesmo período anterior.”
- “Esta conta está vencida há N dias.”

Alertas informam urgência sem pânico e só usam dados comprovados.

### Confirmações

Exclusão:

> Excluir esta movimentação? Ela será removida dos seus cálculos e relatórios.

Botões: “Manter movimentação” e “Excluir”.

Logout:

> Sair do FinControl? Você precisará entrar novamente para acessar seus dados.

Botões: “Continuar no app” e “Sair”.

## 13. Gamificação responsável

Nome:

> Seu progresso financeiro

Conquistas propostas:

- Primeiro passo;
- Mês organizado;
- Planejamento em dia;
- Reserva iniciada;
- Olhar atento;
- Consistência.

Sequência interrompida:

> Sua sequência foi pausada. Recomece quando estiver pronto.

Desafio:

> Que tal revisar suas pequenas despesas desta semana?

Botões: “Aceitar desafio”, “Ver detalhes” e “Agora não”. Regras detalhadas permanecem na especificação de gamificação existente.

## 14. PWA

Banner:

> Leve o FinControl com você

> Instale o aplicativo no seu celular e acesse suas finanças mais rapidamente.

Botões: “Instalar aplicativo” e “Agora não”.

Sucesso:

> FinControl instalado. Ele já está disponível na sua tela inicial.

Não prometer uso offline enquanto não existir estratégia de consistência para dados financeiros autenticados.

## 15. Tema e preferência

Opções: Claro, Escuro e Automático. A solução deve evitar flash de tema e preservar SSR. A persistência é uma preferência de apresentação, nunca um local para dados financeiros. Cookie versus storage deve ser decidido no Dia 1 da small release de design system.

## 16. Responsividade

### Desktop

- sidebar fixa;
- grid amplo;
- gráficos maiores;
- drawers laterais.

### Tablet

- sidebar recolhida;
- cartões em duas colunas;
- gráficos em largura total;
- menus compactos.

### Mobile

- barra inferior;
- cartões empilhados;
- filtros em chips;
- formulários em bottom sheet;
- ações próximas ao polegar;
- menos informação simultânea;
- evitar rolagem horizontal; gráficos devem refluír ou oferecer alternativa acessível.

## 17. Acessibilidade

- contraste de pelo menos 4,5:1 para texto normal e 3:1 para texto grande;
- teclado completo e foco visível;
- alvos de pelo menos 44 × 44 px;
- ícones com nome acessível quando executam ação;
- mensagens de erro e mudanças assíncronas anunciadas;
- receitas/despesas identificadas além da cor;
- redução de movimento via `prefers-reduced-motion`;
- gráficos com tabela/resumo equivalente;
- drawers, modais e bottom sheets com foco contido, retorno de foco e fechamento previsível;
- tema claro e escuro validados separadamente.

## 18. Componentes

Genéricos candidatos a `src/shared/components/ui`:

- `AppSidebar`;
- `MobileBottomNavigation`;
- `Topbar`;
- `PageHeader`;
- `MetricCard`;
- `PeriodSelector`;
- `FilterChip`;
- `EmptyState`;
- `Skeleton`;
- `Drawer`;
- `BottomSheet`;
- `Modal`;
- `Tabs`;
- `Badge`;
- `Tooltip`;
- `DropdownMenu`.

Componentes com semântica financeira permanecem na feature proprietária, mesmo quando visualmente reutilizáveis:

- `BalanceHeroCard` e analytics no dashboard/financial-analytics;
- `AiInsightCard` em ai-insights;
- `TransactionItem` em transactions;
- `AccountCard` em accounts;
- `CreditCardCard` em cards;
- `BudgetProgress` em budgets;
- `GoalCard`/`ProgressCard` em goals;
- `UpcomingCommitments` na feature que possuir o contrato de compromissos.

Não criar todos antecipadamente. Cada componente nasce com uma necessidade real e teste correspondente.

## 19. Alterações técnicas previstas

- `PrivateAppShell.tsx`: composition root visual com sidebar, topbar, main e navegação mobile; autenticação continua delegada aos casos de uso/gateway.
- `DashboardPage.tsx`: composição em grid de 12 colunas, sem regra financeira.
- `DashboardSummaryPanel.tsx`: evolução incremental para hero e métricas após contratos reais.
- `RecentTransactionsList.tsx`: categoria, conta, agrupamento e ações somente após persistência correspondente.
- `globals.css`: tokens semânticos, tipografia, temas e preferências de movimento.
- `tailwind.config.ts`: mapear classes aos tokens; não duplicar cores literais.
- gráficos: nenhuma biblioteca antes do `SP-001`; o spike compara Recharts, Chart.js e alternativas para candles por acessibilidade, peso e SSR.

## 20. Arquitetura e conteúdo

- `src/app` compõe rotas e shell.
- `presentation` controla layout, interação e copy contextual.
- `application` fornece view models e estados consumíveis.
- `domain` calcula regras e não conhece cores, componentes ou textos promocionais.
- `infrastructure` continua isolando Supabase e integrações.
- componentes compartilhados são primitives sem regra financeira.
- copy reutilizável pode usar constantes tipadas próximas da feature; é proibido um catálogo global monolítico sem necessidade.
- nenhum exemplo financeiro fictício aparece como se fosse dado real do usuário.

## 21. Mapeamento incremental

| Ordem | Item | Entrega | Dependências |
|---|---|---|---|
| 1 | `UI-001` | marca, tipografia, tokens, tema claro/escuro e primitives essenciais | arquitetura atual |
| 2 | `UI-002` | shell, sidebar, topbar e navegação mobile somente com rotas disponíveis | UI-001 |
| 3 | `UI-003` | dashboard Pulse com conteúdo realmente suportado | UI-001, UI-002 e dados disponíveis |
| 4 | `UI-004` | cards/listagem e drawer de contas | SR-009 e UI-001 |
| 5 | `UI-005` | listagem e drawer/bottom sheet de transações | SR-010, SR-011 e UI-001 |
| 6 | `UI-006` | refinamento de login, microcopy e instalação PWA | UI-001 e SR-008 |
| 7 | SR-012–017 | períodos, evolução, linha, candles e distribuição | fundação de dados |
| 8 | SR-018–022 | metas, progresso e gamificação | metas persistentes e analytics |
| 9 | SR-023 | FinControl IA | cálculos determinísticos, consentimento e privacidade |
| 10 | features futuras | cartões, orçamentos, relatórios, importação e configurações | domínios específicos |

`UI-001` foi selecionada e concluiu o Dia 1 em 2026-07-14. `UI-002` a `UI-006` permanecem em `DISCOVERY`; a existência desta especificação não autoriza antecipar suas telas ou alterar automaticamente a prioridade da SR-010.

### 21.1. Recorte aprovado da UI-001

Objetivo: estabelecer a fundação visual transversal sem redesenhar as features atuais no mesmo incremento.

Incluído:

- padronização do nome `FinControl` em metadata, manifest e superfícies existentes;
- Geist via `next/font/google`, exposta como variável CSS e `font-sans`;
- tokens semânticos para superfícies, texto, bordas, ação, feedback e indicadores;
- tema claro, escuro e automático conforme o sistema;
- persistência local somente da preferência não sensível `fincontrol.theme`;
- resolução anterior à hidratação para evitar flash relevante;
- primitives `Button`, `Card`, `FeedbackMessage` e `ThemeSwitcher`;
- migração incremental das classes literais atuais para tokens, preservando comportamento e acessibilidade.

Excluído:

- sidebar, topbar e navegação mobile, pertencentes à `UI-002`;
- novo grid, métricas e conteúdo do dashboard, pertencentes à `UI-003`;
- cards e drawer de contas, pertencentes à `UI-004`;
- listagem e drawer/bottom sheet de transações, pertencentes à `UI-005`;
- refinamento completo do login, copy global e instalação PWA, pertencentes à `UI-006`;
- gráficos, novas rotas, dados demonstrativos, regras financeiras, migrations e alterações no Supabase;
- biblioteca externa de tema ou pacote completo de componentes.

Primitives adicionais só podem entrar após evidência de repetição e contrato compartilhado real. Componentes com semântica financeira continuam dentro da feature proprietária.

### 21.2. Paleta semântica da UI-001

| Uso | Claro | Escuro |
|---|---|---|
| Fundo | `#F6F8FC` | `#0B1220` |
| Cartão | `#FFFFFF` | `#111827` |
| Superfície elevada | `#FFFFFF` | `#1E293B` |
| Texto principal | `#111827` | `#F8FAFC` |
| Texto secundário | `#5F6F85` | `#94A3B8` |
| Borda | `#E5E7EB` | `#334155` |
| Verde-petróleo principal | `#0F766E` | `#2DD4BF` |
| Azul de destaque | `#2563EB` | `#60A5FA` |
| Receita | `#15803D` | `#4ADE80` |
| Despesa | `#DC2626` | `#FB7185` |
| Alerta | `#D97706` | `#FBBF24` |
| Foco | `#2563EB` | `#7DD3FC` |

O Dia 2 deve transformar esta referência em testes de contrato, contraste e regressão antes de qualquer implementação.

## 22. Copy de aquisição futura

Landing page não faz parte do app privado atual, mas a mensagem aprovada fica registrada.

Hero:

> Seu dinheiro explicado de um jeito que faz sentido.

Subtítulo:

> Organize contas, acompanhe gastos, planeje metas e descubra quanto está realmente disponível para você.

CTA principal: “Começar meu controle”. CTA secundário: “Conhecer o FinControl”.

Benefícios:

- **Entenda seu momento** — veja o que entrou, saiu e ainda está livre;
- **Antecipe problemas** — acompanhe compromissos antes que apertem o orçamento;
- **Construa seus objetivos** — transforme planos em metas acompanháveis;
- **Receba explicações claras** — identifique padrões nos próprios dados.

Descrição curta:

> FinControl é o copiloto financeiro que ajuda você a entender seus gastos, organizar contas e decidir com mais clareza.

Bio:

> Seu dinheiro explicado. Controle, metas e decisões com clareza.

Anúncio:

> Você sabe quanto tem na conta. Mas sabe quanto realmente pode gastar? O FinControl considera seus compromissos e mostra o valor disponível de verdade.

Essas mensagens só podem mencionar capacidades efetivamente lançadas.

## 23. Critérios globais de pronto

Uma entrega visual só fica pronta quando:

- nasceu de testes essenciais;
- mantém domínio e infraestrutura fora da UI;
- usa apenas capacidades e dados reais disponíveis;
- possui loading, empty, success e error quando aplicável;
- funciona por teclado e leitor de tela;
- passa contraste e alvo de toque;
- funciona em desktop, tablet e mobile;
- respeita redução de movimento;
- não introduz promessa falsa de IA, offline ou cálculo;
- atualiza esta especificação, contexto, backlog e testes;
- passa lint, type-check, testes, audit e build.

## 24. Fora do escopo desta aprovação

- implementar toda a proposta em uma única mudança;
- liberar rotas vazias ou CTAs sem fluxo;
- inventar saldo disponível, projeções ou insights;
- instalar biblioteca de gráfico antes do spike;
- ativar IA antes da SR-023;
- persistir dados financeiros em storage do navegador;
- prometer offline;
- adicionar animações pesadas;
- alterar automaticamente a prioridade da próxima small release.

## 25. Estado incremental da UI-001

Dia 4 concluído em 2026-07-15:

- marca `FinControl` aplicada às superfícies atuais e ao rótulo acessível do ícone PWA;
- preferência `Claro | Escuro | Sistema` disponível no login antes da autenticação;
- estados existentes de loading, empty, success e error preservados;
- shell responsivo, dashboard Pulse, drawers e demais itens visuais continuam nas releases próprias;
- nenhuma promessa de IA, offline, projeção ou capacidade inexistente foi adicionada;
- inspeção automatizada no Chrome ficou pendente por indisponibilidade do native host da extensão, sem substituir os gates automatizados.
