# ADR 0007 — Persistência, grants e RLS de categorias

## Contexto

A autenticação e a persistência isolada de contas já existem, mas o formulário de transações ainda usa categorias demonstrativas. A SR-010 deve criar a segunda tabela financeira real sem antecipar transações persistidas, personalização visual ou operações de manutenção que ainda não possuem casos de uso.

O projeto Supabase `fin_control` foi inspecionado em 2026-07-16. O banco contém somente `public.financial_accounts`, com RLS habilitada e forçada, grants `SELECT/INSERT` para `authenticated`, duas policies por proprietário e Performance Advisor sem alertas. O Security Advisor mantém apenas a pendência já registrada de proteção contra senhas vazadas.

## Decisão

Criar a feature `categories` seguindo Feature-Based + Clean Architecture leve e limitar a SR-010 a criação e listagem de categorias do usuário autenticado.

O domínio terá:
- `Category` com criação e restauração validadas
- `CategoryKind` restrito a `income | expense`
- nome normalizado, obrigatório e limitado a 80 caracteres
- metadados persistentes `id`, `createdAt` e `updatedAt`

O banco planejado terá:
- tabela `public.categories`
- ownership por `user_id` referenciando `auth.users(id) on delete cascade`
- unicidade case-insensitive de `(user_id, kind, name)`
- restrição única `(user_id, id)` para futura FK composta tenant-safe em `transactions`
- índice de listagem por usuário, kind, nome normalizado e ID
- RLS habilitada e forçada
- policies separadas de `SELECT` e `INSERT` com `(select auth.uid()) = user_id`
- bloqueio explícito de usuários com claim `is_anonymous = true`
- revogação inicial e grants mínimos `SELECT/INSERT` somente para `authenticated`

A aplicação terá `CreateCategoryUseCase` e `ListCategoriesUseCase`. A infraestrutura concreta ficará em `categories/infrastructure`. A composition root revalidará claims em Server Component/Server Action e injetará o ator; a apresentação não enviará `userId` como autoridade.

A rota `/categories` será um subfluxo privado ligado a transações. Ela não adicionará um quarto destino à navegação principal da UI-002. Categorias persistidas poderão substituir as opções demonstrativas do formulário local, mas a persistência de transações continuará reservada à SR-011.

## Alternativas consideradas

### Permitir `kind = both`

Rejeitada neste recorte porque torna a seleção por tipo e as agregações futuras ambíguas. Um caso de uso real poderá reabrir a decisão.

### Incluir cor, ícone e categorias globais

Rejeitada por ausência de consumidor obrigatório e por ampliar schema, validações, seeds e governança visual antes da necessidade.

### Criar policies `FOR ALL`

Rejeitada porque concederia superfície maior que os contratos atuais. `UPDATE` e `DELETE` não possuem casos de uso nesta SR.

### Confiar apenas no filtro do repositório

Rejeitada por risco de BOLA/IDOR. O filtro explícito serve desempenho; RLS e integridade relacional permanecem a fronteira de segurança.

## Consequências

- SR-011 poderá consumir categorias reais e criar FK composta por proprietário.
- Categorias duplicadas por capitalização serão rejeitadas pelo banco.
- O usuário precisará criar categorias manualmente; defaults automáticos ficam para release própria.
- A migration, os testes pgTAP e qualquer mutação Supabase continuam bloqueados até as fases autorizadas.
- Erros de unicidade e infraestrutura precisarão de mensagens estáveis sem expor detalhes internos.

## Referências verificadas

- [Securing your API — grants e RLS](https://supabase.com/docs/guides/api/securing-your-api)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Password security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

## Threat model resumido

- BOLA/IDOR: mitigado por claims revalidadas, filtro por usuário e RLS por proprietário.
- `user_id` forjado: ignorado na UI e validado por `WITH CHECK`.
- usuário anônimo: bloqueado por policy além do papel `authenticated`.
- mass assignment: mapper de insert envia somente `user_id`, `name` e `kind`.
- duplicidade intencional: índice único case-insensitive por usuário e kind.
- vínculo futuro cross-tenant: preparado com chave composta `(user_id, id)`.
- segredo privilegiado: `service_role` permanece revogado da tabela e ausente do cliente.

## Data

2026-07-16
