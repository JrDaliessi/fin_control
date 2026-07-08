# Project Context — Controle Financeiro IA

## Estado do Projeto
- Estado atual da máquina de estados: `FOUNDATION_DEFINED`
- Fase atual: Dia 0 — Bootstrap operacional
- Data de bootstrap: 2026-07-08
- Fonte inicial de produto: pesquisa comparativa de apps financeiros brasileiros e internacionais fornecida pelo usuário

## Visão do Produto
Controle Financeiro IA é um aplicativo financeiro pessoal brasileiro com IA, focado em explicar o dinheiro do usuário, prever riscos financeiros e orientar decisões antes que problemas aconteçam.

O produto não deve ser apenas um registrador de gastos. Ele deve responder diariamente:
- Quanto eu tenho de verdade?
- Para onde meu dinheiro está indo?
- O que eu devo fazer agora?

## Objetivo do Sistema
Construir um PWA financeiro com dashboard claro, controle de contas/cartões/parcelas, orçamento, metas e análises inteligentes. A primeira versão deve priorizar entrada manual e importação de extratos antes de integrações automáticas via Open Finance.

## Escopo Inicial
MVP planejado:
- login
- cadastro de contas
- cadastro de cartões
- receitas
- despesas
- parcelas
- categorias
- orçamento mensal
- metas/envelopes
- dashboard inicial
- relatórios simples
- importação de extrato
- IA analisando dados lançados pelo usuário

Fora do escopo inicial:
- Open Finance em produção
- pagamentos automatizados
- movimentação automática de dinheiro
- integração bancária não oficial
- recomendações financeiras sensíveis sem confirmação do usuário

## Regras de Negócio Principais
- A IA pode analisar, sugerir e alertar, mas não pode executar ação financeira sensível sem confirmação explícita do usuário.
- O saldo disponível real deve considerar saldo, despesas futuras conhecidas, cartão, parcelas, contas vencidas e receitas previstas.
- Compras parceladas devem impactar faturas futuras.
- Assinaturas e recorrências devem ser tratadas como compromissos futuros.
- Categorias devem permitir automação futura, mas o usuário deve poder revisar e corrigir classificações.
- Dados financeiros são área crítica: autenticação, autorização, RLS, criptografia e auditoria devem ser tratados como requisitos de arquitetura.

## Stack Obrigatória
- PWA
- Node.js
- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth e Database
- Jest
- Testing Library
- TDD

## Arquitetura Escolhida
Feature-Based + Clean Architecture leve.

Cada feature deve ser organizada em:
- `presentation`: componentes, páginas internas da feature, hooks e estados visuais.
- `application`: casos de uso e orquestração de fluxos.
- `domain`: entidades, tipos, contratos, schemas e regras puras.
- `infrastructure`: repositórios, clients, adapters e integrações externas.

O diretório `src/app` deve atuar como entrada do Next.js App Router, com rotas, layouts e composição macro. Regras de negócio devem ficar nas features.

## Estrutura de Pastas Alvo
```text
src/
  app/
    (public)/
      login/
        page.tsx
    (private)/
      dashboard/
        page.tsx
    layout.tsx
    page.tsx
    globals.css
  features/
    auth/
      presentation/
      application/
      domain/
      infrastructure/
      tests/
    finance/
      presentation/
      application/
      domain/
      infrastructure/
      tests/
    dashboard/
      presentation/
      application/
      domain/
      infrastructure/
      tests/
  shared/
    components/
      ui/
    constants/
    hooks/
    types/
    utils/
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
  migrations/
  tests/
    setupTests.ts
```

## Convenções
- Componentes React: `PascalCase.tsx`
- Hooks: `useNomeDoHook.ts`
- Casos de uso: `nome-da-acao.use-case.ts`
- Repositórios: `nome-entidade.repository.ts`
- Services: `nome-entidade.service.ts`
- Schemas: `nome-entidade.schema.ts`
- Tipos: `nome-entidade.types.ts`
- Testes: `*.spec.ts` ou `*.test.ts`
- Componentes genéricos ficam em `src/shared/components/ui`
- Componentes específicos ficam dentro da própria feature

## Padrão de Testes
- TDD obrigatório para regras principais.
- Ordem preferencial: domain, application, infrastructure crítica, presentation importante.
- Todo fluxo novo deve nascer com teste de cenário feliz e cenários críticos.
- Toda correção de bug deve começar com teste que reproduz o bug.
- Nenhuma feature relevante pode ser concluída com lint, type-check, testes ou build quebrados.

## Contratos Entre Camadas
- `presentation` não acessa Supabase diretamente.
- `application` coordena casos de uso e depende de contratos, não de UI.
- `domain` não depende de Next.js, React ou Supabase.
- `infrastructure` implementa contratos técnicos e concentra integrações externas.

## Decisões Técnicas Já Tomadas
- Open Finance deve ser feito por provedores formais, como Pluggy ou Belvo, em fase posterior.
- MVP começa com lançamento manual e importação de extratos.
- IA inicial deve ser analítica e assistiva, sem execução financeira autônoma.
- A arquitetura deve ser pragmática, sem microserviços e sem abstrações prematuras.
- O projeto deve operar por fases `dia 0` a `dia 7`, sem salto de fase.

## Features Planejadas
- Auth
- Contas financeiras
- Cartões de crédito
- Transações
- Parcelas
- Categorias
- Orçamento mensal
- Metas/envelopes
- Dashboard financeiro
- Relatórios
- Importação de extrato
- Análise financeira com IA
- Assinaturas e recorrências
- Calendário financeiro
- Open Finance

## Backlog Inicial de Alto Nível
- Dia 1: detalhar produto, domínio, módulos e contratos.
- Dia 2: definir matriz de testes e criar testes essenciais da primeira small release.
- Dia 3: implementar mínimo para satisfazer os testes da primeira small release.
- Dia 4: expandir estados de UI e validações.
- Dia 5: refatorar e endurecer estrutura interna.
- Dia 6: revisar UX, acessibilidade, responsividade e PWA.
- Dia 7: rodar quality gates, segurança básica, observabilidade e preparação de release.

## Restrições
- Não criar microserviços no MVP.
- Não acessar banco diretamente pela UI.
- Não usar API bancária não oficial.
- Não implementar feature sem teste essencial.
- Não expandir escopo fora do backlog.
- Não esconder dívida técnica fora da documentação.

## Checklists Técnicos
- Contexto central criado.
- Arquitetura documentada.
- Roadmap criado.
- Backlog inicial criado.
- Quality gates definidos.
- Workflows do Dia 0 ao Dia 7 criados.
- Catálogo mínimo de agents e skills criado.

## Erros Recorrentes da IA e Como Evitar
- Erro: implementar código funcional antes de testes. Prevenção: bloquear implementação até Dia 2 gerar testes essenciais.
- Erro: colocar regra de negócio em componente React. Prevenção: mover regra para `domain` ou `application`.
- Erro: acessar Supabase pela camada visual. Prevenção: usar repositórios em `infrastructure`.
- Erro: expandir escopo por conveniência. Prevenção: registrar item no backlog antes de executar.
- Erro: pular workflow de fase. Prevenção: consultar `project-context.md` e `.agents/workflows/dia-X-*.md` antes de executar comandos `dia X`.

## Pendências e Próximos Passos
- Confirmar Dia 0 concluído após validação dos artefatos.
- Executar Dia 1 para discovery, arquitetura detalhada, domínio e backlog refinado.
- Definir primeira small release candidata antes de qualquer implementação funcional.

