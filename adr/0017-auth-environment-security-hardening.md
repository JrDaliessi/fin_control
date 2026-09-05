# ADR 0017 — Hardening da borda HTTP e do ambiente de autenticação

- Status: aprovado para TDD incremental
- Data: 2026-08-31
- Security item: `SEC-HARD-001`
- Depende de: ADR 0003 e ADR 0016

## Contexto

O FinControl usa Next.js App Router na Vercel e autenticação por senha no Supabase. O login chama `signInWithPassword` pelo client público do Supabase; portanto, a tentativa de autenticação sai do navegador diretamente para o endpoint Auth e não atravessa uma rota de aplicação da Vercel.

O `next.config.mjs` atual define somente `reactStrictMode`. A resposta pública de `/login` confirma HTTPS e HSTS fornecidos pela Vercel, mas não contém CSP, proteção de framing do app, `X-Content-Type-Options`, `Referrer-Policy` ou `Permissions-Policy`. Headers observados na proteção SSO de previews pertencem à camada da Vercel e não provam a proteção da resposta do aplicativo.

O Supabase Auth já possui rate limits próprios para endpoints documentados e oferece CAPTCHA nativo com hCaptcha ou Cloudflare Turnstile. A configuração atual de rate limits e CAPTCHA não está disponível pelo conector somente leitura usado neste discovery. O Security Advisor continua reportando apenas a proteção contra senhas vazadas, tratada separadamente em `SEC-AUTH-001`.

## Decisão

O hardening será dividido por responsabilidade e entregue em small releases independentes.

### SEC-HARD-001A — Headers determinísticos do aplicativo

- Configurar headers globais por `headers()` em `next.config.mjs`; não duplicá-los no `proxy.ts`.
- Desabilitar `X-Powered-By` com `poweredByHeader: false`.
- Aplicar CSP em modo de enforcement, inicialmente compatível com o runtime atual do Next.js.
- Restringir `default-src`, `base-uri`, `form-action`, `frame-ancestors`, `object-src`, `frame-src`, `manifest-src`, `font-src`, `img-src`, `connect-src`, `script-src`, `style-src` e `worker-src`.
- Permitir em `connect-src` somente a própria origem e a origem HTTPS exata do Supabase obtida da configuração pública no build. Realtime não será liberado sem necessidade real.
- Manter `unsafe-inline` somente onde o Next.js atual ainda exige para scripts/estilos inline; nonce ou hash não será improvisado porque tornaria páginas estáticas dinâmicas ou exigiria troca de bundler. A remoção futura será dívida explícita, não promessa implícita.
- Adicionar `X-Frame-Options: DENY` como compatibilidade legada, além de `frame-ancestors 'none'`.
- Adicionar `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` e uma `Permissions-Policy` mínima que negue recursos não usados.
- Preservar HSTS da Vercel e definir o mesmo contrato no aplicativo somente para produção; não condicionar segurança a domínio manual.
- Não alterar CORS, cookies, sessão, RLS ou autorização neste item.

### SEC-HARD-001B — Proteção contra abuso do login

- Não criar proxy de credenciais nem mover senha para Server Action apenas para obter rate limiting na Vercel.
- Não considerar uma regra WAF em `/login` suficiente: ela limita carregamento da página, não o password grant enviado diretamente ao Supabase.
- Confirmar os controles atuais no painel `Authentication > Rate Limits` antes de qualquer mutação.
- Recomendar Cloudflare Turnstile como primeira opção de CAPTCHA por integração nativa e baixo atrito, mas exigir decisão humana e credenciais próprias antes da implementação.
- Quando aprovado, transportar somente o token efêmero do CAPTCHA pelo contrato de application/infrastructure e manter segredo exclusivamente no provedor/Supabase.
- Atualizar a CSP somente com os hosts estritamente exigidos pelo provedor escolhido.
- Tratar `429`, falha de CAPTCHA e credenciais inválidas com mensagem pública genérica, sem enumeração de conta.

## Contratos entre camadas

- `next.config.mjs`: composição e aplicação dos headers da plataforma.
- módulo de configuração testável: normalização da origem pública do Supabase e construção determinística da CSP, sem acessar usuário, sessão ou dados financeiros.
- `presentation`: renderiza o desafio somente na small release de CAPTCHA aprovada.
- `application`: orquestra credenciais e token efêmero sem conhecer SDK ou segredo do provedor.
- `infrastructure`: adapta o token para `signInWithPassword` e converte falhas do provider para o erro público existente.
- Supabase: valida CAPTCHA, executa rate limits nativos e autentica; nenhuma regra de autorização migra para metadata de usuário.

## Estratégia TDD

O Dia 2 deverá criar contratos antes da implementação:

1. headers globais existem em páginas públicas e privadas;
2. CSP contém as diretivas obrigatórias, bloqueia framing/objetos e permite somente a origem Supabase normalizada em `connect-src`;
3. configuração ausente ou origem inválida falha de forma determinística no build;
4. `X-Powered-By` permanece desabilitado;
5. HSTS é emitido no contrato de produção sem tornar ambiente local dependente de HTTPS;
6. build e teste de navegador detectam violações CSP, quebra de hidratação, fonte, tema, login e gráficos;
7. a futura small release de CAPTCHA cobre token ausente, válido, expirado, reset após tentativa, `429` e erro genérico.

## Validação e rollout

- Validar primeiro em Preview com console sem violações CSP e smoke tests de `/login`, `/`, `/dashboard` e assets PWA.
- Inspecionar headers reais da resposta do app, sem usar a página de SSO da proteção de preview como evidência.
- Promover somente após pipeline verde e confirmação de que login, sessão SSR e gráficos continuam funcionais.
- Rollback de `SEC-HARD-001A`: reverter apenas o commit de headers.
- Rollback de `SEC-HARD-001B`: desativar CAPTCHA no Supabase e reverter o contrato/token do cliente; nenhum dado ou migration precisa ser restaurado.

## Alternativas descartadas

- confiar apenas nos headers automáticos da Vercel: não cobre a baseline completa observada na resposta pública;
- configurar headers no `proxy.ts`: mistura sessão com política estática e amplia a superfície dinâmica;
- WAF de `/login` como proteção de password grant: o tráfego de autenticação não passa por essa rota;
- proxy próprio de senha: aumenta exposição de credenciais e complexidade sem necessidade;
- CAPTCHA sem decisão de provedor/credenciais: integração externa sensível e não auditável;
- nonce dinâmico imediato: degrada a prerenderização e amplia escopo antes de existir teste que justifique a troca.

## Consequências

- `SEC-HARD-001A` fica `READY` para o Dia 2.
- `SEC-HARD-001B` permanece `BLOCKED` até decisão humana de provedor e fornecimento seguro das credenciais fora do repositório.
- Produção pública continua bloqueada por `SEC-AUTH-001`, `HARD-OBS-001` e pela conclusão dos gates aplicáveis desta feature.

## Referências

- https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
- https://supabase.com/docs/guides/auth/rate-limits
- https://supabase.com/docs/guides/auth/auth-captcha
- https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting
