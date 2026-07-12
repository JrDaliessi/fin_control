# ADR 0003 — Fronteira de autenticação e sessão da SR-008

- Status: Aceito
- Data: 2026-07-12
- Small release: SR-008 — Autenticação e sessão protegida

## Contexto

O produto manipulará dados financeiros e precisa estabelecer uma identidade verificável antes de criar persistência, migrations e políticas RLS. O projeto usa Next.js 16 App Router, `@supabase/ssr` e Supabase Auth. A base atual possui clients browser/server e um `middleware.ts`, mas ainda não possui feature `auth`, login, logout ou proteção efetiva das rotas.

## Decisão

- O primeiro método será e-mail e senha com usuários já existentes.
- Cadastro, confirmação de e-mail, recuperação de senha, OAuth, login por telefone e MFA ficam fora da SR-008.
- A sessão SSR usará cookies gerenciados por `@supabase/ssr` e fluxo PKCE.
- Páginas e dados privados serão protegidos com identidade validada no servidor por `supabase.auth.getClaims()`.
- `getUser()` será reservado para fluxos que precisem do registro atual do usuário no Auth server.
- `getSession()` não será fonte de autorização no servidor.
- O arquivo legado `middleware.ts` deverá migrar para a convenção `proxy.ts` do Next.js 16.
- Proxy fará refresh e redirecionamento otimista; cada operação sensível continuará validando identidade em sua própria fronteira.
- Rotas públicas: `/login` e recursos estáticos.
- Rotas privadas: `/`, `/dashboard`, `/accounts` e `/transactions`.
- Usuário não autenticado em rota privada será redirecionado para `/login`.
- Usuário autenticado em `/login` será redirecionado para `/dashboard`.
- Login bem-sucedido redirecionará para `/dashboard`; logout redirecionará para `/login`.
- A apresentação dependerá de casos de uso/contratos da feature `auth`, nunca do client Supabase.
- `service_role`, secret keys e dados de `user_metadata` são proibidos para autorização no cliente.
- A configuração pública terá `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` como alvo; suporte temporário à legacy anon key, se necessário, deverá ficar isolado em um único adapter e ser explicitamente testado.

## Contratos planejados

- `AuthUser`: identidade mínima normalizada (`id` e `email`).
- `AuthGateway`: `signInWithPassword`, `signOut` e leitura de identidade verificada.
- `SignInUseCase`: valida entrada e orquestra autenticação.
- `SignOutUseCase`: encerra a sessão corrente e propaga falhas controladas.
- `GetCurrentUserUseCase`: retorna identidade verificada ou ausência explícita.
- `SupabaseAuthGateway`: implementação concreta em `infrastructure`.
- Proxy/session adapter: refresh de cookies e guarda de rotas na fronteira Next.js.

## Organização planejada

```text
src/features/auth/
  presentation/
    components/
    pages/
  application/
    use-cases/
  domain/
    entities/
    interfaces/
    types/
  infrastructure/
    supabase/
  tests/

src/app/
  (public)/login/page.tsx
  (private)/layout.tsx
  (private)/dashboard/page.tsx
  (private)/accounts/page.tsx
  (private)/transactions/page.tsx

src/lib/supabase/
  client.ts
  server.ts
  proxy.ts

proxy.ts
```

Grupos de rota não alteram as URLs públicas.

## Threat model

- Cookie ou JWT adulterado: nunca confiar em `getSession()` para autorização; validar claims no servidor.
- Token expirado: Proxy tenta refresh; falha resulta em sessão ausente e redirecionamento para login.
- Roubo de credenciais: mensagem de erro genérica, política forte de senha no Supabase e rate limits revisados antes de produção.
- Fixação ou reutilização de sessão: logout encerra a sessão corrente; escopos adicionais serão avaliados quando houver gestão de dispositivos.
- Open redirect: a SR-008 usa destinos fixos e não aceita `next` arbitrário.
- Cache entre usuários: rotas autenticadas não usarão ISR/cache compartilhado quando houver refresh ou conteúdo de sessão.
- Vazamento de chave: somente URL e publishable key podem existir no cliente; secret/service role permanecem proibidas.
- ID demonstrativo: rotas privadas deverão consumir o ID da identidade verificada, não `user-1`, antes de dados reais.

## Consequências

- A SR-008 permanece pequena e não cria persistência financeira.
- A migração de `middleware.ts` para `proxy.ts` e de `getUser()` para `getClaims()` deve nascer com testes no Dia 2 antes de implementação.
- A configuração de publishable key deve ser validada na implementação sem remover compatibilidade de ambiente de forma silenciosa.
- SR-009 continua bloqueada até a conclusão desta autenticação e dos testes de isolamento futuros.

## Fontes verificadas

- Supabase SSR para Next.js: https://supabase.com/docs/guides/auth/server-side/creating-a-client
- Supabase password auth: https://supabase.com/docs/guides/auth/passwords
- Supabase sign out: https://supabase.com/docs/guides/auth/signout
- Next.js 16 Proxy: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
