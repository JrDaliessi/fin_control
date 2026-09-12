# Feature Spec — UX-CHART-003C2

## Identificação

- Feature: `UX-CHART-003C2 — Agregação segura para histórico completo`
- Feature pai: `UX-CHART-003C`
- Estado: `SPEC_READY`
- Fase: Dia 1
- Requisitos cobertos: `FPRD-UXCHART003C2-RQ-001` a `RQ-007`
- Critérios cobertos: `FPRD-UXCHART003C2-AC-001` a `AC-010`

## Decisão arquitetural

O incremento preserva a arquitetura existente e o ADR 0022. A apresentação continua enviando somente o período; application resolve `Tudo`; infrastructure consulta duas RPCs agregadas sob a sessão autenticada; o banco aplica RLS, limites e cálculo financeiro. Nenhum novo ADR é necessário enquanto estes limites não mudarem.

## Impacto por camada

### Domain

- adicionar uma resolução pura para `Tudo`, separada dos presets;
- receber `historyStartOn: string | null` e `referenceOn: string`;
- quando `historyStartOn <= referenceOn`, produzir `[historyStartOn, referenceOn + 1 dia)` e selecionar a granularidade existente;
- quando a âncora for nula ou futura, produzir o mês civil completo da referência, mantendo `kind: 'all'` e granularidade diária;
- reutilizar validação de datas civis, máximo de 60 anos e máximo de 60 buckets.

### Application

- consultar a âncora somente para `period=all`;
- obter `userId` exclusivamente da identidade já validada no servidor;
- manter presets e personalizado nos fluxos atuais;
- consultar buckets longos somente depois de resolver e validar o intervalo;
- mapear falhas de autenticação, contrato e limites para erros tipados sem transportar mensagem SQL à apresentação.

Contrato proposto:

```ts
export interface FinancialHistoryStartQueryRepository {
  findFirstTransactionDate(input: {
    userId: string;
  }): Promise<string | null>;
}
```

`userId` permanece no contrato interno para impor contexto autenticado e permitir testes. O adapter concreto não envia esse valor à RPC; a função identifica o tenant por `auth.uid()`.

### Infrastructure

- o repositório Supabase implementa a nova porta chamando `load_financial_history_start` sem argumentos;
- a allowlist concreta de `load_financial_evolution_buckets` passa de `week | month` para `week | month | quarter | year` somente junto da migration;
- validadores de linha continuam exigindo exatamente a projeção agregada esperada;
- resposta nula da âncora é válida; formato inválido ou erro remoto falha fechado.

### Presentation

- nenhuma alteração visual é necessária nesta small release;
- `period=all` deixa de cair no erro de período incompatível e usa o mesmo dashboard já existente;
- nenhum estado novo expõe mensagem, stack ou código interno do Supabase.

## Contrato de banco

### RPC de âncora

Assinatura planejada:

```sql
public.load_financial_history_start() returns date
```

Regras:

- `language plpgsql` para rejeitar sessão ausente/anônima de forma explícita;
- `security invoker`;
- `set search_path = ''`;
- objetos referenciados com schema explícito;
- identidade derivada de `(select auth.uid())` e anonimato de `(select auth.jwt() ->> 'is_anonymous')`;
- `min(public.transactions.occurred_on)` limitado ao usuário autenticado;
- retorna `null` quando o usuário válido não possui transações;
- sem parâmetros e sem retorno de identificadores ou conteúdo financeiro.

Privilégios:

- revogar `EXECUTE` de `PUBLIC`, `anon`, `authenticated` e `service_role` antes do grant determinístico;
- conceder `EXECUTE` somente a `authenticated` no contrato da aplicação;
- preservar a atuação administrativa inerente aos papéis do projeto sem criar um endpoint de aplicação para eles.

### RPC agregadora

A assinatura e as colunas retornadas de `load_financial_evolution_buckets(p_start_on date, p_end_on date, p_bucket text)` permanecem idênticas.

Mudanças permitidas:

- allowlist: `week`, `month`, `quarter`, `year`;
- passo civil correspondente e `date_trunc` estático, sem SQL dinâmico;
- validação `p_end_on > p_start_on`;
- rejeição de intervalo superior a 60 anos;
- geração e contagem de buckets limitada a 60 antes da agregação final;
- buckets parciais recortados ao intervalo semiaberto solicitado;
- buckets vazios carregam o saldo anterior com volume e quantidade zero;
- manutenção das CTEs e da ordem determinística já testadas para `week/month`.

## Tipos e esquemas

- `FinancialBucketGranularity` continua sendo a fonte de verdade para `day | week | month | quarter | year`;
- o input concreto da RPC exclui `day`, porque granularidade diária permanece na RPC de snapshot de curto alcance;
- a âncora usa data civil ISO `YYYY-MM-DD | null`;
- DTOs públicos não recebem novo campo financeiro.

## Segurança e privacidade

- `SECURITY INVOKER` mantém as policies RLS como fronteira de autorização;
- `search_path` vazio e qualificação de schema reduzem risco de resolução de objeto inesperado;
- `auth.uid()` é avaliado dentro da função e nunca aceito do chamador;
- anonymous e sessão ausente são rejeitados antes da consulta;
- a projeção agregada não inclui descrição, categoria, conta ou IDs;
- logs da aplicação registram apenas classe/código operacional, nunca payload financeiro ou mensagem SQL bruta.

## Performance e índices

Hipótese inicial: o índice existente `transactions_user_occurred_created_id_idx (user_id, occurred_on DESC, created_at DESC, id DESC)` pode atender a âncora e o recorte temporal. A hipótese não autoriza índice novo.

No Dia 2/3, a validação deve:

1. criar fixture representativa separando tenants e cobrindo histórico longo;
2. executar `EXPLAIN (ANALYZE, BUFFERS)` para âncora e agregação sob contexto autenticado;
3. registrar plano, linhas, buffers e tempo observados;
4. propor índice somente se houver gargalo demonstrado, com comparação antes/depois;
5. não remover o índice de contas reportado como não utilizado, pois isso está fora do escopo.

## Estratégia de migration

- uma migration forward-only, nome intuitivo sugerido: `extend_financial_history_aggregation`;
- criada somente no Dia 3 depois de testes pgTAP RED válidos;
- contém criação da RPC de âncora, `create or replace` da RPC agregadora e ACL determinística;
- aplicada e validada primeiro no ambiente local/reproduzível;
- aplicação remota exige fase compatível, gates verdes e autorização explícita;
- rollback operacional: reverter o código consumidor e aplicar nova migration restaurando o corpo anterior; migration publicada nunca é editada retroativamente.

## Estratégia de validação para o Dia 2

### Jest — Domain/Application/Infrastructure

- âncora nula, anterior, igual e futura à referência;
- término histórico inclusivo e conversão semiaberta;
- seleção de `day/week/month/quarter/year` nos limites aprovados;
- rejeição independente de 60 anos e 60 buckets;
- âncora consultada somente por `all`;
- adapter chama a RPC sem `user_id` ou outro argumento de tenant;
- `quarter/year` permitido apenas no contrato atualizado;
- resposta nula aceita, resposta malformada e erro remoto sanitizados;
- regressão dos presets, personalizado, `week` e `month`.

### pgTAP — Banco/RLS/Contrato

- existência, assinatura, retorno, invoker, `search_path` e ACL da nova função;
- âncora correta para dois usuários, usuário sem transações e sessão anônima;
- `quarter/year`, extremos, volume, quantidade, buckets vazios e fronteiras parciais;
- limites de ordem, 60 anos, 60 buckets e allowlist;
- isolamento tenant, rejeição anônima e ausência de colunas brutas;
- regressão equivalente de `week/month`;
- evidência de plano para âncora e consulta temporal.

### Quality gates

- testes dirigidos RED antes de produção;
- GREEN dirigido e regressão completa;
- ESLint, type-check, build e `git diff --check`;
- advisors de segurança/performance após aplicar migration no ambiente autorizado;
- revisão de grants, policies e diff SQL.

## Observabilidade

- manter erros operacionais tipados no servidor;
- não adicionar analytics de comportamento financeiro;
- registrar falha de RPC por nome lógico e código sanitizado, sem datas, valores, descrição ou identidade;
- usar advisors e plano de consulta como evidência de release, não como telemetria do usuário.

## Release e compatibilidade

- feature flag adicional não é necessária porque o adapter continua fechado até código e migration viajarem juntos;
- assinatura da RPC agregadora é preservada para rollout atômico;
- presets já publicados continuam usando seus fluxos atuais;
- `UX-CHART-003C3` só inicia após esta small release ser liberada.

## Rastreabilidade resumida

| Requisito | Contrato principal | Validação planejada |
|---|---|---|
| RQ-001 | RPC de âncora | pgTAP de assinatura, tenant, null e anon |
| RQ-002 | resolvedor `all` | Jest de referência, fallback e intervalo |
| RQ-003 | allowlist agregadora | pgTAP + adapter Jest |
| RQ-004 | limites | Jest + pgTAP de bordas |
| RQ-005 | portas tipadas | type-check + testes de repository/use case |
| RQ-006 | falha fechada | Jest de erro e pgTAP de auth |
| RQ-007 | migration única | inspeção do diff + aplicação local + rollback documentado |

## Definition of Done

- PRD e Spec aprovados;
- matriz e testes RED criados antes da implementação;
- migration única reproduzível e contracts TypeScript GREEN;
- `Tudo`, `quarter` e `year` cobertos sem regressão dos períodos atuais;
- RLS, ACL, anonimato e minimização verdes;
- `EXPLAIN` documentado e nenhum índice especulativo;
- lint, type-check, testes, build, advisors e documentação verdes;
- release registrada, contexto compactado e `UX-CHART-003C3` mantida fora do incremento.

## Decisões aprovadas

- histórico composto apenas por transações futuras usa o fallback do mês civil da referência;
- quando houver histórico válido, `Tudo` encerra na data de referência inclusiva.
