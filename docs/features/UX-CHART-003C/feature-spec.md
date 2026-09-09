# Feature Spec — UX-CHART-003C

## Identificação e cobertura

- Feature: `UX-CHART-003C — Tudo, período personalizado e drill-down`
- Estado: `SPEC_READY`
- Requisitos cobertos: `FPRD-UXCHART003C-RQ-001` a `RQ-010` e `NFR-001` a `NFR-006`
- Decisão estrutural: `adr/0022-all-custom-periods-and-progressive-drilldown.md`

## Impacto arquitetural

A feature amplia contratos existentes sem mover regras para a UI:

- `domain`: novos tipos de período e granularidade, normalização civil, escolha de bucket e limites;
- `application`: resolução de `Tudo`, orquestração da consulta agregada e níveis de drill-down;
- `infrastructure`: leitura da primeira data financeira e extensão segura da RPC agregada;
- `presentation`: URL canônica, seletor personalizado e navegação no painel contextual existente;
- `App Router`: continua como composition root server-side, aguardando `searchParams` e injetando dados serializáveis.

Não será criado um `ChartPort` genérico. A ilha ECharts continua sem Supabase, Auth ou regra de negócio.

## Tipos e contratos de domínio

```ts
type FinancialPeriodKind =
  | ExistingFinancialPeriodKind
  | "all"
  | "custom";

type FinancialBucketGranularity =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

type CustomFinancialPeriodInput = {
  from: CivilDate;
  to: CivilDate; // inclusivo na URL/UI
};

type ResolvedCustomFinancialPeriod = {
  kind: "custom";
  bucketGranularity: FinancialBucketGranularity;
  referenceOn: CivilDate; // igual ao fim inclusivo escolhido
  startOnInclusive: CivilDate;
  endOnExclusive: CivilDate;
};
```

- `FSPEC-UXCHART003C-DOM-001`: `resolveCustomFinancialPeriod` valida formato, ordem e duração antes de converter o fim inclusivo para exclusivo; `referenceOn` é a data final inclusiva escolhida.
- `FSPEC-UXCHART003C-DOM-002`: `resolveFinancialBucketGranularity` aplica a matriz aprovada e calcula a quantidade real de buckets civis, incluindo extremidades parciais.
- `FSPEC-UXCHART003C-DOM-003`: duração maior que 60 anos e `bucketCount > 60` são erros de domínio distintos e serializáveis.
- `FSPEC-UXCHART003C-DOM-004`: períodos futuros sem movimentos carregam saldo; nenhuma função gera projeções.

## Contratos de application

```ts
interface FinancialHistoryStartQueryRepository {
  findFirstTransactionDate(input: { userId: string }): Promise<CivilDate | null>;
}

type FinancialDrilldownLevel =
  | { kind: "quarters"; interval: FinancialInterval }
  | { kind: "months"; interval: FinancialInterval }
  | { kind: "statement"; interval: FinancialInterval };
```

- `FSPEC-UXCHART003C-APP-001`: para `all`, o caso de uso solicita a âncora ao port autenticado; `null` recai no mês civil da referência.
- `FSPEC-UXCHART003C-APP-002`: a escolha de granularidade acontece somente depois da âncora efetiva e antes da consulta de buckets.
- `FSPEC-UXCHART003C-APP-003`: `year` selecionado no painel solicita `quarter`; `quarter` solicita `month`; `month` delega ao contrato existente de extrato se tiver no máximo 31 dias.
- `FSPEC-UXCHART003C-APP-004`: limites retornados pela infraestrutura devem coincidir com os limites solicitados; divergência falha fechada.

## URL e App Router

- Preset `Tudo`: `?period=all`.
- Personalizado: `?period=custom&from=YYYY-MM-DD&to=YYYY-MM-DD`.
- `from` e `to` aparecem apenas para `custom`; parâmetros estranhos ou duplicados não alteram o contrato.
- Valores ausentes ou malformados em `custom` exibem o seletor com erro acionável, sem consulta financeira.
- Períodos antigos mantêm os valores existentes e o fallback seguro `month`.
- O Server Component aguarda `searchParams`, normaliza escalares e entrega somente DTOs serializáveis à apresentação.

## Banco, migration e RLS

A implementação da `UX-CHART-003C2` deverá criar uma única migration forward-only, previamente coberta por pgTAP, para:

1. criar `public.load_financial_history_start()` sem argumentos;
2. retornar `min(public.transactions.occurred_on)` visível ao chamador autenticado;
3. usar `SECURITY INVOKER`, `SET search_path = ''`, `auth.uid()` e RLS forçada;
4. revogar execução de `PUBLIC`, `anon` e `service_role`, concedendo somente a `authenticated`;
5. estender `public.load_financial_evolution_buckets(date,date,text)` com allowlist `week`, `month`, `quarter`, `year`;
6. substituir o teto fixo de 366 dias por duração máxima de 60 anos e preservar o teto independente de 60 buckets;
7. manter a projeção agregada atual, sem dados descritivos ou identificadores de movimentos.

Nenhum `userId` é parâmetro de RPC. A camada de application ainda recebe `userId` como claim confiável e a infraestrutura aplica ownership explícito em consultas diretas. Antes de propor índice, executar `EXPLAIN (ANALYZE, BUFFERS)` com dados representativos; o índice atual iniciado por `user_id, occurred_on` é a hipótese preferida.

## UI e estados

- `FSPEC-UXCHART003C-UI-001`: a barra adiciona `Tudo` e `Personalizado`, preserva rolagem horizontal confinada e `aria-pressed`.
- `FSPEC-UXCHART003C-UI-002`: `Personalizado` abre um popover/dialog compacto conforme viewport, com dois campos `date`, ação Aplicar e Cancelar; o foco retorna ao acionador.
- `FSPEC-UXCHART003C-UI-003`: erros permanecem junto aos campos e são anunciados em região viva; Aplicar não navega enquanto inválido.
- `FSPEC-UXCHART003C-UI-004`: o painel contextual existente troca o conteúdo pelo nível filho, mostra título e botão Voltar; nunca monta diálogo dentro de diálogo.
- `FSPEC-UXCHART003C-UI-005`: seleção nova cancela logicamente a anterior e respostas obsoletas não substituem o nível ativo.
- `FSPEC-UXCHART003C-UI-006`: gráfico e tabela chamam a mesma ação de drill-down com o intervalo semiaberto recebido, sem reconstruí-lo.
- `FSPEC-UXCHART003C-UI-007`: estados `idle`, `loading`, `empty`, `success`, `validation_error` e `load_error` têm texto próprio e ação de recuperação compatível.

## Segurança e minimização

- autenticação por claims validada antes de qualquer chamada;
- RLS e ownership testados com dois usuários e sessão anônima;
- intervalos, granularidade e quantidade de buckets validados no domínio e novamente na função SQL;
- nenhum SQL dinâmico derivado de granularidade livre;
- agregados longos não carregam transações brutas;
- erros enviados ao cliente usam códigos estáveis, sem SQL, stack, UUID ou detalhes de policy;
- telemetria, quando ativada, registra apenas tipo de período, granularidade, faixa de buckets, nível de drill-down e resultado sanitizado.

## Observabilidade

Sinais previstos, sem conteúdo financeiro:

- `financial_period_selected` com `periodKind` e `granularity`;
- `financial_drilldown_opened` com nível de origem/destino;
- `financial_period_rejected` com código `INVALID_DATE`, `INVALID_ORDER`, `RANGE_TOO_LONG` ou `TOO_MANY_BUCKETS`;
- duração server-side por classe de granularidade, sem datas exatas.

A instrumentação é condicionada ao baseline `HARD-OBS-001`; ausência dela não autoriza logs improvisados.

## Estratégia de validação para o Dia 2

- domain unit: datas inclusivas, anos bissextos, fronteiras 31 dias/6 meses/2 anos/15 anos/60 anos, buckets parciais e teto 60;
- application unit: âncora encontrada/nula, roteamento de repository, drill-down e respostas obsoletas;
- infrastructure unit: mapper, erro de RPC e nenhuma propagação de parâmetros inseguros;
- pgTAP schema/grants: assinatura, invoker, search path, ACL e ausência de parâmetro de usuário;
- pgTAP behavior/RLS: dois tenants, anônimo, histórico vazio, buckets trimestrais/anuais, limites e OHLC;
- pgTAP performance: plano inspecionado para âncora e agregação; índice novo somente com evidência;
- presentation: URL canônica, validação dos campos, teclado, foco, painel único, voltar, loading/empty/error/success e tabela equivalente;
- composição: cards, gráficos e tabelas recebem exatamente o mesmo intervalo;
- regressão: períodos antigos, extrato de até 31 dias, lint, type-check e build.

## Migração, release e rollback

- `003C1` não depende da migration para validar domínio/URL isoladamente;
- `003C2` aplica migration em ambiente de desenvolvimento somente após RED pgTAP e revisão humana da fase;
- código consumidor é liberado apenas quando a função nova e a assinatura estendida estiverem disponíveis;
- rollback preferido é de aplicação para o commit anterior; a migration permanece compatível com `week/month` e não remove dados;
- rollback SQL corretivo, se necessário, é nova migration forward-only que restaura a allowlist/limites anteriores e revoga a função de âncora.

## Riscos e decisões adiadas

- paginação de meses com volume extremo fica registrada como hardening separado;
- comparação de períodos e intervalos salvos permanecem fora;
- nenhuma alteração de índice está aprovada sem evidência de plano;
- falha em qualquer gate RLS, limite ou regressão bloqueia release.

## Definition of Done

- todos os dez critérios de aceite do Feature PRD têm testes rastreáveis e verdes;
- migrations local e remota estão alinhadas e pgTAP está verde;
- lint, type-check, testes e build estão verdes;
- segurança, performance, acessibilidade e responsividade foram verificadas;
- documentação, ADR, backlog, roadmap, release record e Hot Context estão atualizados;
- nenhum bloqueio crítico permanece oculto.
