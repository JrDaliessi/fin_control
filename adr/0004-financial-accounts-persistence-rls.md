# ADR 0004 — Persistência e RLS de contas financeiras

- Status: Aceito
- Data: 2026-07-14
- Small release: SR-009 — Persistência e RLS de contas

## Contexto

A SR-007 criou o domínio e a experiência local de contas. A SR-008 estabeleceu autenticação e sessão protegida. O projeto Supabase `fin_control` ainda não possui tabelas públicas nem migrations. A SR-009 cria a primeira fronteira de dados financeiros reais e, por isso, grants, RLS e testes de isolamento são requisitos inseparáveis.

## Decisão

- Criar `public.financial_accounts` com UUID opaco, ownership por `user_id`, valores em centavos e timestamps com timezone.
- Limitar a SR a criar e listar contas próprias.
- Não conceder edição ou exclusão.
- Usar `text + check` para tipo e moeda, evitando enum prematuro.
- Manter `initial_balance_in_cents` no intervalo seguro do JavaScript.
- Não persistir saldo atual.
- Permitir nomes duplicados.
- Usar índice `(user_id, created_at desc, id desc)`.
- Referenciar `auth.users(id)` com `ON DELETE CASCADE` para apagar contas quando a identidade for removida.
- Futuras transações deverão impedir exclusão silenciosa da conta por `RESTRICT`.
- Conceder somente `SELECT` e `INSERT` a `authenticated`.
- Não conceder privilégios a `anon` ou `service_role` para o fluxo da aplicação.
- Habilitar e forçar RLS.
- Separar policies de `SELECT` e `INSERT`, ambas por `(select auth.uid()) = user_id`.
- Bloquear JWT de usuário anônimo pelo claim confiável `is_anonymous`.
- Tratar tabela, constraints, índice, grants e RLS como uma migration atômica.

## Contratos

- `AccountRepository.create(account)` persiste e retorna a entidade reidratada.
- `AccountRepository.listByUser({ userId })` retorna somente contas do ator.
- `FinancialAccount.restore()` ou nome equivalente reidrata ID e timestamps por caminho testado.
- `SupabaseAccountRepository` e o mapper pertencem a `accounts/infrastructure`.
- Server Component e Server Action atuam como composition roots e revalidam claims em cada operação.
- Presentation recebe DTOs e callbacks, nunca client Supabase ou `userId` livre como autoridade.

## Segurança

- RLS é a autoridade final contra BOLA/IDOR.
- Filtro explícito por `user_id` na consulta melhora desempenho, mas não substitui RLS.
- Usuários anônimos do Auth, embora usem o role `authenticated`, não acessam dados financeiros.
- `service_role`, secret key e `user_metadata` são proibidos na autorização da aplicação.
- A tabela não será adicionada ao Realtime nesta SR.
- Falhas do Supabase serão normalizadas antes de chegar à interface.

## Estratégia de Testes e Migration

- O Dia 2 cria testes de domínio, aplicação, mapper/repository, composição e pgTAP antes de qualquer migration.
- Os testes pgTAP usam transação e rollback, simulando `anon`, usuário permanente A, usuário permanente B e usuário anônimo.
- O Supabase MCP é o canal oficial para executar testes, aplicar migration, listar objetos e rodar advisors.
- O SQL aplicado pelo MCP será espelhado em `supabase/migrations/` usando a versão registrada pelo histórico remoto.
- Testes de banco ficam em `supabase/tests/database/`.
- Migrations são forward-only em produção; falhas geram nova migration corretiva.
- Rollback destrutivo só pode ocorrer antes de dados reais ou após backup/export e aprovação explícita.

## Consequências

Positivas:
- primeira persistência financeira nasce com isolamento no banco
- menor superfície de privilégios
- UI permanece desacoplada do Supabase
- schema e domínio mantêm as mesmas invariantes

Custos e riscos:
- criação repetida após falha de rede pode gerar duplicata; idempotência fica registrada para evolução futura
- exclusão de usuário é destrutiva por cascade
- atualização de saldo inicial exige futuro movimento de ajuste, não edição direta
- proteção contra senhas vazadas ainda precisa ser ativada antes da produção pública

## Fontes verificadas

- https://supabase.com/changelog?tags=breaking-change
- https://supabase.com/docs/guides/api/securing-your-api
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/local-development/testing/overview
- https://supabase.com/docs/guides/auth/auth-anonymous
- https://supabase.com/docs/guides/database/postgres/cascade-deletes
