# ADR 0021 — Restauração privada e agendada da conta de demonstração

- Status: aceito — TDD em RED controlado
- Data: 2026-09-05
- Feature: `DEMO-001`
- Depende de: ADRs 0003, 0004, 0007, 0008 e 0010

## Contexto

O FinControl possui uma conta compartilhada para avaliação do portfólio. Ela usa o mesmo login, casos de uso e RLS de qualquer usuário permanente e contém somente dados fictícios. Como avaliadores podem cadastrar contas, categorias e transações, o estado deixa de ser previsível e pode degradar gráficos e fluxos ao longo do tempo.

A manutenção precisa restaurar uma baseline útil sem expor poder administrativo no frontend, sem guardar credenciais no banco ou no Git e sem permitir que um identificador fornecido pelo cliente determine quais dados serão apagados.

O projeto Supabase usa PostgreSQL em UTC, oferece `pg_cron` 1.6.4 ainda desativado e ainda não possui schema `private`.

## Decisão

### Alvo e autorização

- A conta é identificada somente por `auth.users.raw_app_meta_data`, campo administrável, com `account_type = demo` e `audience = recruiter`.
- A operação exige exatamente um usuário correspondente. Zero ou múltiplos resultados encerram a função antes de qualquer exclusão.
- A função não recebe `user_id`, e-mail ou qualquer identidade do cliente.
- E-mail, senha, sessão e UUID da conta não são gravados na migration nem no job.

### Fronteira de execução

- A função `private.reset_recruiter_demo_data(p_reference_date date)` será criada em schema não exposto.
- Ela será `SECURITY INVOKER`, com `set search_path = ''` e referências totalmente qualificadas.
- `EXECUTE` será revogado de `PUBLIC`, `anon`, `authenticated` e `service_role`; somente `postgres` receberá permissão explícita.
- O Cron executará como `postgres`. Não haverá API Route, Server Action, Edge Function, RPC pública ou chave `service_role` no Next.js.

Essa escolha usa a autoridade administrativa já necessária ao scheduler sem introduzir `SECURITY DEFINER` nem ampliar a superfície da Data API.

### Atomicidade, concorrência e integridade

- Uma advisory lock transacional com chave estável serializa reset manual e agendado.
- A função valida alvo e data antes de alterar dados.
- A exclusão é limitada por `user_id` e respeita dependências: `transactions`, `categories`, `financial_accounts`.
- A baseline é reinserida no mesmo statement/transação do job. Erro em qualquer etapa reverte toda a restauração.
- Foreign keys compostas continuam provando ownership entre transações, contas e categorias.
- A baseline contém 3 contas, 6 categorias e 8 movimentos fictícios suficientes para os fluxos atuais.
- `p_reference_date` torna os testes determinísticos; o job passa a data civil calculada com `America/Sao_Paulo` e nunca cria movimentos futuros.

### Agendamento e observabilidade

- `pg_cron` será habilitado por migration reproduzível.
- O job terá nome estável `reset-recruiter-demo-data-daily`, agenda `0 7 * * *` e execução diária às 07:00 UTC, equivalente a 04:00 em Brasília na configuração atual.
- Reaplicar a agenda pelo mesmo nome deve atualizar o job, não duplicá-lo.
- O job não realiza chamada HTTP e não depende de Vault ou segredo.
- Status e falhas ficam em `cron.job_run_details`. A retenção futura remove somente histórico antigo desse job, nunca de outras tarefas.

### Ativação incremental

1. `DEMO-001A`: testes pgTAP em RED, função privada, grants e comportamento validado integralmente em transação com rollback.
2. `DEMO-001B`: migration de `pg_cron`, job idempotente e primeira restauração persistente controlada.
3. `DEMO-001C`: prova de concorrência, observabilidade, retenção, smoke test autenticado e documentação de rollback.

## Contratos testáveis

1. somente uma conta marcada com os dois atributos administrativos pode ser alvo;
2. zero ou múltiplos candidatos falham antes de qualquer mutação;
3. usuários comuns e seus registros não mudam;
4. dados extras do tenant demo são removidos e a baseline termina em 3 contas, 6 categorias e 8 transações;
5. as datas da baseline não ultrapassam `p_reference_date`;
6. falha intermediária reverte exclusões e inserções;
7. chamadas concorrentes não intercalam estados;
8. função e schema não ficam acessíveis a `anon`, `authenticated` ou `service_role`;
9. existe exatamente um job ativo, pertencente a `postgres`, com nome, schedule e command aprovados;
10. o command do job não contém e-mail, UUID ou segredo;
11. login e consultas RLS da conta continuam funcionando após a restauração;
12. Security Advisor e quality gates não ganham regressão.

## Alternativas consideradas

### Endpoint administrativo no Next.js

Rejeitado porque exigiria proteger uma operação destrutiva pública, transportar chave privilegiada e ampliar a superfície de abuso do aplicativo.

### Edge Function agendada

Rejeitada porque adicionaria rede, secret/Vault e outro runtime sem necessidade. A operação é inteiramente relacional e curta.

### `SECURITY DEFINER` chamável pelo usuário demo

Rejeitado. Um usuário compartilhado não pode possuir autoridade para apagar e recriar dados, mesmo apenas os próprios, e uma função definer aumenta o impacto de erro de autorização.

### Alvo por e-mail ou UUID fixo

Rejeitado por acoplamento operacional e risco de aplicar a migration em ambiente com identidade diferente. Metadados administrativos expressam a intenção sem expor credenciais.

### Reset a cada login

Rejeitado porque surpreenderia usuários simultâneos, descartaria alterações durante uma avaliação e acoplaria manutenção destrutiva ao fluxo de autenticação.

### Vários resets por dia

Rejeitado por benefício marginal e maior chance de interromper uma demonstração. Uma execução diária fora do horário comum é suficiente para o primeiro recorte.

## Consequências

- A demonstração volta diariamente a um estado conhecido e relevante.
- A conta continua exercitando os mesmos caminhos reais do produto.
- O banco ganha uma extensão, um schema privado, uma função e um job que exigem testes e observabilidade próprios.
- Alterações feitas por um recrutador podem ser vistas por outro até o próximo reset; a conta é compartilhada por decisão consciente.
- A solução precisa evoluir quando novas tabelas pertencentes ao usuário entrarem no fluxo demonstrável.

## Rollback

- Desativar imediatamente o job com `cron.alter_job(..., active := false)` preserva dados e histórico.
- Não remover `pg_cron`, pois isso apagaria todos os jobs do projeto.
- Correções de função, grants ou agenda serão feitas por migration forward-only.
- A baseline anterior ao reset não é recuperável; por contrato, a conta contém apenas dados fictícios descartáveis.

## Próximo passo

Executar o Dia 2 da `DEMO-001`: definir matriz TDD, criar fixtures transacionais e produzir o RED pgTAP antes de qualquer função, extension, job ou reset persistente.
