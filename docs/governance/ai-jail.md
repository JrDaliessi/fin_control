# AI Jail — FinControl

## Objetivo

Limitar execução automatizada ao menor conjunto de permissões necessário, protegendo dados financeiros, identidade, segredos e ambientes.

## Regras permanentes

- executar localmente e em sandbox sempre que possível;
- validar workspace, branch, ambiente e alvo antes de qualquer mutação;
- nunca versionar `.env.local`, tokens, chaves privadas ou credenciais de serviço;
- separar desenvolvimento, preview e produção;
- não executar migration, alteração Auth, RLS ou limpeza de dados sem escopo e validação explícitos;
- preferir migrations forward-only e registrar rollback operacional;
- preservar arquivos e mudanças não relacionados;
- exigir autorização humana para merge, deploy produtivo, serviço pago ou mudança estrutural;
- usar privilégios mínimos e identidade derivada da sessão autenticada;
- registrar evidência de testes e quality gates antes de declarar entrega.

## Áreas críticas

- autenticação e autorização;
- RLS e isolamento por usuário;
- dados financeiros e conta de demonstração;
- migrations, RPCs e grants;
- secrets e variáveis de ambiente;
- Vercel e Supabase produtivos;
- tarefas agendadas e restauração de dados.

## Protocolo de ação destrutiva

1. resolver o alvo exato por inspeção somente leitura;
2. confirmar que o pedido autoriza a ação;
3. preferir alternativa recuperável;
4. executar no ambiente correto;
5. verificar o resultado e documentar recuperação/rollback.

## Bloqueio

Interromper quando houver alvo ambíguo, segredo exposto, risco cross-tenant, migration sem teste, ausência de rollback aplicável ou necessidade de autoridade não concedida.
