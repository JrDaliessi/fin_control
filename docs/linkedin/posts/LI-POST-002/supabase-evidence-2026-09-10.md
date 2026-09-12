# Evidência Supabase — LI-POST-002

- Data da inspeção: `2026-09-10`
- Projeto inspecionado: `fin_control`
- Estado observado: `ACTIVE_HEALTHY`
- Método: plugin MCP oficial do Supabase, em modo somente leitura
- Escopo: catálogo PostgreSQL, histórico de migrations, Security Advisor e documentação oficial

## Controles confirmados

- as sete migrations esperadas estão aplicadas, de `create_financial_accounts` a `create_financial_evolution_buckets`;
- `public.financial_accounts`, `public.categories` e `public.transactions` estão com RLS habilitada e forçada;
- entre `anon`, `authenticated`, `public` e `service_role`, o catálogo retornou apenas `SELECT` e `INSERT` concedidos a `authenticated` nas três tabelas;
- cada tabela possui policies separadas de `SELECT` e `INSERT` que comparam `auth.uid()` a `user_id` e rejeitam JWT com `is_anonymous = true`;
- `transactions` possui FKs compostas `(user_id, account_id)` e `(user_id, category_id, type)`, além da FK de `user_id` para `auth.users`.

## Limite e pendência

O Security Advisor retornou um único aviso externo: `auth_leaked_password_protection`. A proteção contra senhas vazadas permanece desativada e continua rastreada como `SEC-AUTH-001`; nenhuma configuração foi alterada nesta inspeção.

Esse resultado comprova o estado observado na data acima, mas não sustenta promessa de segurança absoluta nem substitui nova verificação antes de uma publicação futura.

## Referências oficiais consultadas

- [Anonymous Sign-Ins](https://supabase.com/docs/guides/auth/auth-anonymous)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Password security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

## Privacidade e mutação

- nenhuma linha de conta, categoria, transação ou usuário foi consultada;
- nenhum e-mail, UUID, valor financeiro, token ou chave foi coletado;
- nenhum SQL mutável, migration, alteração de Auth, policy, grant ou dado foi executado.

## Revalidação — 2026-09-11

O gate do Dia 7 repetiu a inspeção somente leitura e encontrou o mesmo estado:

- projeto `fin_control` em `ACTIVE_HEALTHY`;
- sete migrations aplicadas;
- RLS habilitada e forçada nas três tabelas financeiras;
- apenas `SELECT` e `INSERT` para `authenticated` no recorte consultado;
- seis policies de ownership com rejeição de identidade anônima;
- FKs compostas tenant-safe preservadas em `transactions`;
- `auth_leaked_password_protection` permanece como único aviso do Security Advisor no recorte.

Nenhuma linha de usuário ou dado financeiro foi lida e nenhuma mutação foi executada.
