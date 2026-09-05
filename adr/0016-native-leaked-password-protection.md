# ADR 0016 — Proteção nativa contra senhas vazadas

- Status: aprovado com bloqueio externo
- Data: 2026-08-31
- Security item: `SEC-AUTH-001`
- Depende de: ADR 0003 e plano Supabase Pro ou superior

## Contexto

O Security Advisor do projeto `fin_control` mantém somente o alerta `auth_leaked_password_protection`: a verificação contra senhas conhecidamente comprometidas está desativada. O projeto usa Supabase Auth com e-mail/senha, sessão SSR e validação server-side por claims. Cadastro, recuperação e troca de senha ainda não existem na aplicação.

A documentação atual do Supabase informa que a proteção nativa consulta a Pwned Passwords API do Have I Been Pwned e está disponível somente no plano Pro ou superior. A organização atual foi confirmada pelo MCP como `free`, portanto a configuração não pode ser ativada ainda.

## Decisão

1. O FinControl adotará a proteção nativa do Supabase Auth, sem enviar senhas a código próprio, Edge Function, banco, log ou observabilidade.
2. A ativação será feita somente após upgrade explícito da organização para Pro ou superior.
3. A mudança não exige migration, RLS, tabela, dependência ou alteração no domínio financeiro.
4. O Dia 2 deverá criar contratos que preservem o login quando o Supabase retornar uma sessão válida acompanhada de `weakPassword`.
5. A mensagem pública de credenciais inválidas continuará genérica. Detalhes do provider, motivos do Have I Been Pwned e existência do usuário não serão expostos antes de autenticação válida.
6. O item será considerado concluído somente quando a configuração estiver ativa e o Security Advisor não retornar `auth_leaked_password_protection`.
7. O rollback consistirá em desativar exclusivamente a proteção nativa e confirmar login, logs de Auth e retorno do advisor; nenhuma reversão de banco será necessária.
8. Senhas existentes não serão lidas, testadas, registradas ou transmitidas pelo agente. A resposta do SDK indica fraqueza sem revelar a senha.

## Fluxo esperado

```text
Supabase Auth / password grant
  -> credenciais inválidas: erro genérico, sem enumeração
  -> sessão válida sem aviso: login normal
  -> sessão válida + weakPassword: login preservado no recorte atual
       -> remediação de senha será item separado antes de onboarding público amplo
```

## Estratégia de ativação

1. confirmar plano Pro ou superior;
2. executar testes do contrato de login e baseline de Auth;
3. ativar “Prevent use of leaked passwords” em Auth > Providers > Email;
4. executar login sintético sem registrar credenciais;
5. consultar logs de Auth e Security Advisor;
6. desativar imediatamente se houver regressão de sessão ou indisponibilidade.

## Alternativas consideradas

### Consultar Have I Been Pwned no frontend

Rejeitada porque criaria uma fronteira adicional para credenciais, aumentaria risco de vazamento e duplicaria uma capacidade nativa.

### Edge Function ou API própria

Rejeitada porque exigiria protocolo k-anonymous, tratamento de falhas externas, rate limits e observabilidade sensível sem necessidade comprovada.

### Permanecer no plano Free e ignorar o advisor

Rejeitada para produção pública. O risco de credential stuffing é incompatível com um aplicativo financeiro.

## Consequências

Positivas:
- reduz reutilização de senhas já comprometidas sem armazenar material sensível adicional;
- mantém a responsabilidade no provider de identidade;
- rollback simples e sem alteração de dados.

Trade-offs:
- exige custo recorrente do plano Supabase Pro;
- usuários existentes podem receber aviso de senha fraca durante login, embora a sessão válida seja preservada pelo SDK;
- remediação guiada de senha exigirá fluxo próprio e não deve ser improvisada neste item.

## Bloqueio

O Dia 2 e a ativação remota permanecem bloqueados até o usuário autorizar e concluir o upgrade da organização Supabase para Pro ou superior.
