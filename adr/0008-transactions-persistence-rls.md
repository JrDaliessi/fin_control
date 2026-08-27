# ADR 0008 — Persistência, integridade tenant-safe e RLS de transações

## Contexto

As SR-008, SR-009 e SR-010 entregaram identidade validada no servidor, contas persistidas e categorias persistidas com isolamento por usuário. A feature `transactions` já possui entidade, casos de uso de criação e resumo mensal e uma experiência local em memória, mas recarregar a aplicação ainda elimina os lançamentos.

A SR-011 deve tornar o registro manual persistente sem antecipar cartões, transferências, recorrências, importação, edição ou exclusão. Como transações são dados financeiros críticos, filtrar apenas no repositório não é suficiente: ownership, vínculos relacionais e compatibilidade entre categoria e tipo precisam ser garantidos pelo banco.

O projeto Supabase `fin_control` foi inspecionado somente para leitura em 2026-07-17. Ele está saudável em Postgres 17 e contém `public.financial_accounts` e `public.categories`, ambas com RLS habilitada. O Performance Advisor não possui alertas; o Security Advisor mantém somente a proteção contra senhas vazadas já registrada em `SEC-AUTH-001`.

## Decisão

Limitar a SR-011 a:

- persistir transações manuais `income | expense`;
- consultar transações próprias por mês;
- usar somente contas e categorias persistidas do usuário autenticado;
- substituir gradualmente a sessão efêmera no fluxo `/transactions` durante o Dia 4;
- preservar os casos de uso de domínio e aplicação sem dependência de Supabase.

O banco planejado terá `public.transactions` com:

- `id uuid` gerado pelo banco;
- `user_id uuid` como proprietário;
- `account_id uuid` e `category_id uuid` obrigatórios;
- `description text` aparada, obrigatória e limitada a 160 caracteres;
- `amount_in_cents bigint` positivo e limitado ao intervalo inteiro seguro do JavaScript;
- `type text` limitado a `income | expense`;
- `payment_method text` limitado a `manual | pix | cash | debit`;
- `occurred_on date` para representar a data civil informada pelo usuário sem deslocamento de fuso;
- `notes text` opcional, aparada e limitada a 1000 caracteres;
- `created_at` e `updated_at` como `timestamptz` gerados pelo banco.

A infraestrutura mapeará `occurred_on` para `Transaction.occurredAt` como meia-noite UTC. Consultas mensais usarão intervalo semiaberto `[primeiro dia do mês, primeiro dia do mês seguinte)`, e a ordenação será `occurred_on desc, created_at desc, id desc`.

Integridade relacional:

- adicionar unicidade `(user_id, id)` a `financial_accounts` para habilitar referência composta;
- referenciar conta por `(user_id, account_id) -> financial_accounts(user_id, id)`;
- adicionar unicidade `(user_id, id, kind)` a `categories`;
- referenciar categoria e tipo por `(user_id, category_id, type) -> categories(user_id, id, kind)`;
- usar `ON DELETE RESTRICT` nos vínculos com conta e categoria para preservar histórico financeiro;
- manter `user_id -> auth.users(id) ON DELETE CASCADE`.

Segurança e acesso:

- revogar privilégios de `public`, `anon`, `authenticated` e `service_role` antes dos grants explícitos;
- conceder somente `SELECT` e `INSERT` a `authenticated`;
- habilitar e forçar RLS;
- criar policies separadas de `SELECT` e `INSERT` com `(select auth.uid()) = user_id`;
- bloquear explicitamente usuários do Supabase Auth com claim `is_anonymous = true`;
- não criar grants ou policies de `UPDATE` e `DELETE`;
- filtrar explicitamente por `user_id` e período no repositório para desempenho, sem tratar isso como substituto da RLS.

O changelog de 2026 informa que tabelas novas podem não ser expostas automaticamente pela Data API. A SR-011 não dependerá de exposição implícita: os grants explícitos e mínimos farão parte da mesma migration que cria a tabela e habilita RLS.

O `TransactionRepository` tornará `findByMonth` obrigatório. `SupabaseTransactionRepository` e o mapper ficarão em `transactions/infrastructure`. A composition root usará Server Component para leituras e Server Action para criação, revalidará claims em cada operação e injetará o ator; a apresentação não fornecerá `userId` como autoridade.

Não haverá coluna `status` nesta release. Uma transação manual criada é efetiva por definição. Estados como pendente, agendada, cancelada ou conciliada dependem de casos de uso futuros e não serão antecipados.

## Alternativas consideradas

### Usar `occurred_at timestamptz`

Rejeitada no recorte manual porque a interface captura somente uma data civil, sem horário ou fuso. `date` evita que formatação local desloque o lançamento para o dia anterior ou seguinte. Importações futuras poderão guardar timestamp de origem separadamente se houver necessidade real.

### Validar ownership apenas por RLS

Rejeitada porque uma linha poderia referenciar uma conta ou categoria de outro usuário em operações privilegiadas, scripts ou falhas futuras de policy. As FKs compostas mantêm a integridade tenant-safe independentemente do caminho de escrita.

### Validar categoria e tipo apenas na aplicação

Rejeitada porque o vínculo `expense` com categoria `income`, ou o inverso, quebraria relatórios. A FK composta inclui `type/kind` e transforma essa regra em invariável do banco.

### Incluir `UPDATE`, `DELETE` e status

Rejeitada por ausência de casos de uso aprovados e pelo risco de ampliar a superfície de mutação de dados financeiros.

### Atualizar saldo da conta por trigger

Rejeitada. `initial_balance_in_cents` permanece imutável e saldos derivados serão calculados por casos de uso e consultas auditáveis, sem duplicar estado mutável nesta release.

## Consequências

- transações passam a sobreviver ao reload e ficam isoladas por usuário;
- conta, categoria e tipo incompatíveis falham no banco, mesmo fora da UI;
- contas e categorias referenciadas não podem ser excluídas sem uma política futura explícita;
- `financial_accounts` e `categories` recebem apenas constraints auxiliares, sem alterar dados ou operações existentes;
- dashboard persistente, períodos avançados e relatórios continuam em releases posteriores;
- a migration, testes pgTAP e implementação continuam bloqueados até os Dias 2 e 3.

## Testes exigidos no Dia 2

- domínio: restauração, limites de descrição/notas, data civil e imutabilidade de metadados;
- aplicação: criação, consulta mensal, entrada inválida e falha do repositório;
- mapper/repository: payload mínimo, conversão `date`, bigint seguro, filtro por owner e intervalo mensal;
- schema: colunas, tipos, defaults, checks, FKs compostas, grants e índices;
- RLS: owner, não owner, `anon`, Auth anônimo, owner forjado e ausência de `UPDATE/DELETE`;
- integridade: conta cross-tenant, categoria cross-tenant e incompatibilidade `type/kind` rejeitadas;
- performance: índices cobrindo ownership, período e helpers Auth em initPlan.

## Referências verificadas

- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Securing your API](https://supabase.com/docs/guides/api/securing-your-api)
- [Database migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Breaking change: tables not exposed automatically](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically)

## Data

2026-07-17
