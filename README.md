# FinControl

PWA de finanças pessoais que busca explicar o dinheiro do usuário, antecipar riscos e apoiar decisões financeiras. O produto combina lançamentos manuais, visão consolidada e, em ciclos futuros, análises assistidas por IA — sem executar ações financeiras sensíveis sem confirmação explícita.

> Projeto em desenvolvimento. Não use dados financeiros reais nesta etapa.

## Estado atual

- Projeto: `OPERATING`
- Última release integrada: `GOV-V4-001`, PR `#29`, merge `42dd6db`
- Small release ativa: `UX-CHART-003C — Tudo, período personalizado e drill-down`
- Fase atual: Dia 1 concluído em `SPEC_READY`
- Próximo ciclo: Dia 2 da `UX-CHART-003C`, com Validation First e testes RED
- Produção pública completa continua condicionada aos hardenings descritos em `project-context.md`

O estado operacional fica em [`project-context.md`](project-context.md); as rotas de contexto ficam em [`context-map.yaml`](context-map.yaml), e o histórico anterior permanece em `docs/history/`.

## Funcionalidades disponíveis

- cadastro local de receitas e despesas;
- resumo mensal básico;
- dashboard financeiro inicial;
- contas financeiras persistidas e isoladas por usuário;
- login por e-mail/senha, logout local e sessão verificada;
- rotas financeiras protegidas por Proxy e layout privado;
- manifest PWA e experiência mobile-first inicial.

Contas financeiras usam Supabase Database com RLS; transações ainda permanecem na sessão da aplicação. A UI-001 está somente em arquitetura e não alterou o comportamento disponível.

## Stack

- Next.js 16 com App Router;
- React 19 e TypeScript;
- Tailwind CSS;
- Supabase Auth e Database;
- Jest e Testing Library;
- PWA;
- TDD.

As versões exatas estão fixadas em [`package.json`](package.json) e [`package-lock.json`](package-lock.json).

## Arquitetura

O projeto segue **Feature-Based + Clean Architecture leve**. Cada feature mantém as responsabilidades separadas em:

- `presentation`: interface, componentes, hooks e estados visuais;
- `application`: casos de uso e orquestração;
- `domain`: entidades, contratos e regras puras;
- `infrastructure`: Supabase, adapters e outros detalhes técnicos.

`src/app` é a camada de entrada e composição do App Router. A apresentação não acessa o Supabase diretamente, e o domínio não depende de React, Next.js ou Supabase.

```text
src/
  app/                 # rotas, layouts e composição
  features/
    accounts/          # contas financeiras
    auth/              # autenticação e sessão
    dashboard/         # visão consolidada
    transactions/      # receitas, despesas e resumo mensal
  lib/supabase/        # clients e adapters Supabase
  shared/              # utilitários e componentes compartilhados
tests/                 # setup e testes transversais
public/                # manifest e ativos públicos
```

Consulte [`architecture.md`](architecture.md) e os registros em [`adr/`](adr/) para detalhes e decisões arquiteturais.

## Pré-requisitos

- Node.js compatível com Next.js 16;
- npm;
- projeto Supabase para executar os fluxos de autenticação.

## Configuração local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo local de ambiente a partir do exemplo:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Preencha em `.env.local`:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnopqrst.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_sua_chave
   ```

   Substitua os valores ilustrativos pelos dados do diálogo **Connect** do seu projeto. A URL deve ser a **Project URL completa**, iniciada por `https://`, sem `<`, `>` ou outros marcadores de placeholder.

4. Inicie o ambiente de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000`.

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` é a opção preferida. `NEXT_PUBLIC_SUPABASE_ANON_KEY` permanece disponível apenas como fallback temporário para projetos legados.

Se a configuração pública do Supabase estiver ausente ou malformada, o Proxy trata a sessão como não autenticada: rotas privadas redirecionam para `/login`, que permanece acessível. Esse fallback evita erro global, mas o login real só funciona depois que a URL e a chave locais forem corrigidas.

### Segurança das variáveis

- nunca envie `.env.local` ao Git;
- nunca exponha `SUPABASE_SERVICE_ROLE_KEY` ou secret keys no navegador;
- variáveis com prefixo `NEXT_PUBLIC_` são públicas;
- `SUPABASE_SERVICE_ROLE_KEY` não é necessária na release atual e deve permanecer vazia;
- dados financeiros persistentes só serão habilitados com autenticação, autorização, RLS por proprietário e testes de isolamento.

## Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run lint         # lint sem tolerância a warnings
npm run type-check   # validação TypeScript
npm run test         # testes Jest
npm run test:watch   # testes em modo interativo
npm run test:ci      # testes sequenciais para CI
npm run build        # build de produção
npm start            # executa o build de produção
npm audit            # auditoria de dependências
```

Antes de considerar uma entrega concluída, o pipeline mínimo deve permanecer verde: lint, type-check, testes, auditoria e build.

## Desenvolvimento por fases

O projeto usa ciclos operacionais controlados:

| Comando | Objetivo |
| --- | --- |
| `dia 0` | bootstrap e governança |
| `dia 1` | contexto, discovery e arquitetura |
| `dia 2` | estratégia de testes e TDD |
| `dia 3` | implementação mínima |
| `dia 4` | expansão controlada |
| `dia 5` | refatoração e hardening |
| `dia 6` | UX, acessibilidade e PWA |
| `dia 7` | qualidade, segurança e entrega |

Cada fase consulta o contexto central, valida os critérios de entrada e exige aprovação humana antes da execução. Features relevantes são divididas em small releases e começam pelos testes essenciais.

## Documentação do projeto

- [`engineering-rules.md`](engineering-rules.md): regras-mestre e protocolo operacional;
- [`project-context.md`](project-context.md): fonte central de verdade;
- [`architecture.md`](architecture.md): arquitetura e fronteiras;
- [`roadmap.md`](roadmap.md): direção e marcos do produto;
- [`backlog.md`](backlog.md): fila priorizada de trabalho;
- [`test-strategy.md`](test-strategy.md): estratégia de testes;
- [`quality-gates.md`](quality-gates.md): critérios de qualidade;
- [`.agents/workflows/`](.agents/workflows/): workflows dos Dias 0 a 7.

## Escopo e limites atuais

O MVP prioriza entrada manual e importação de extratos antes de Open Finance. Pagamentos automáticos, movimentação autônoma de dinheiro, integrações bancárias não oficiais e recomendações financeiras sensíveis sem confirmação estão fora do escopo.

O backlog oficial e os critérios de pronto de cada small release estão em [`backlog.md`](backlog.md).
