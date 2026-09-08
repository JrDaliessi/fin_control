# UX-CHART-003B — Discovery de 3M, Ano e agregação server-side

- Fase: Dia 6 — experiência, acessibilidade e PWA concluídas em GREEN
- Data: 2026-09-08
- Estado: `QUALITY_VALIDATION`
- Predecessora: `UX-CHART-003A` mesclada por squash em `develop` no commit `7434159`
- Próxima fase autorizável: Dia 7 — qualidade final e entrega incremental

## Problema

A barra de períodos já permite alternar imediatamente entre cinco intervalos de até 31 dias. A RPC atual, corretamente limitada a 31 dias, devolve movimentos para que o domínio monte pontos diários e candles. Relaxar esse limite para três meses ou um ano transferiria histórico bruto desnecessário, aumentaria o custo da consulta e permitiria densidade visual imprevisível.

A `UX-CHART-003B` precisa adicionar `3M` e `Ano` sem alterar a proteção da consulta curta, sem agregar no browser e sem duplicar fórmulas financeiras entre linha, candles, tabela e resumo.

## Objetivo do produto

Permitir a leitura de tendências trimestrais e anuais com um toque, mantendo uma quantidade legível de pontos, URL compartilhável e a mesma fonte financeira para todas as visualizações.

## Escopo aprovado

### Incluído

- adicionar os valores canônicos `three_months` e `year`;
- resolver os dois períodos no domínio com calendário gregoriano e intervalo semiaberto;
- associar `three_months` a buckets semanais civis e `year` a buckets mensais civis;
- criar contrato application/infrastructure para carregar buckets já agregados;
- planejar uma RPC nova, independente da RPC diária, com retorno mínimo e limites explícitos;
- incluir `3M` e `Ano` na mesma barra GET server-rendered;
- manter cards, linha, candles, tabela e estado de período sobre a mesma resolução;
- preparar testes Jest e pgTAP antes da implementação e da migration.

### Fora do escopo

- `Tudo`, intervalo personalizado, `12M` móvel ou comparação entre períodos;
- bucket trimestral e política de históricos acima de 60 pontos;
- drill-down trimestral para mês;
- abertura direta de extrato bruto semanal ou anual;
- alteração da RPC `load_financial_evolution_snapshot(date, date)` ou de seu limite de 31 dias;
- índice novo sem evidência de plano de execução;
- cache persistente, materialized view, dependência nova ou agregação no browser.

## Semântica civil e URL

| Rótulo | Nome acessível | URL | Início inclusivo | Fim exclusivo | Bucket |
| --- | --- | --- | --- | --- | --- |
| `3M` | Três meses civis | `three_months` | primeiro dia do mês da referência menos dois meses | primeiro dia do mês seguinte à referência | semana civil, segunda-feira |
| `Ano` | Ano atual | `year` | 1º de janeiro do ano da referência | 1º de janeiro do ano seguinte | mês civil |

Exemplos determinísticos:

- referência `2026-09-06`: `3M` resolve `[2026-07-01, 2026-10-01)`;
- referência `2026-09-06`: `Ano` resolve `[2026-01-01, 2027-01-01)`;
- referência `2024-02-29`: `3M` resolve `[2023-12-01, 2024-03-01)` e `Ano` cobre o ano bissexto inteiro;
- `3M` não significa 90 dias e `Ano` não significa 12 meses móveis;
- ausência, parâmetro repetido ou valor desconhecido continuam usando `month` como fallback canônico.

O período civil inclui todo o mês ou ano da referência, como já ocorre com `month`. Datas futuras dentro do período resolvido permanecem buckets vazios com saldo carregado; a UI não as apresenta como projeção e não inventa movimentos.

## Contrato de buckets

### Tipo de domínio

`FinancialBucketGranularity` será um union fechado:

- `day` para os cinco períodos atuais;
- `week` para `three_months`;
- `month` para `year`.

`FinancialPeriod` continuará sendo a fonte de intervalo e passará a carregar a granularidade resolvida. Nenhum componente escolhe a granularidade por conta própria.

### Regras de calendário

- buckets são consecutivos, não se sobrepõem e cobrem o intervalo selecionado exatamente uma vez;
- semana civil começa na segunda-feira;
- o início e o fim de cada bucket são recortados pelos limites do período;
- por isso o primeiro e o último bucket semanal de `3M` podem ser parciais;
- buckets mensais de `Ano` coincidem com os doze meses civis;
- um bucket sem movimentos carrega o fechamento anterior e retorna volume e contagem iguais a zero.

### Regras financeiras

Para cada bucket, a resposta contém:

- `start_on_inclusive` e `end_on_exclusive`;
- `open_in_cents`, saldo imediatamente antes do primeiro movimento do bucket;
- `high_in_cents` e `low_in_cents`, considerando a abertura e cada saldo intermediário;
- `close_in_cents`, saldo após o último movimento do bucket;
- `income_in_cents` e `expense_in_cents`;
- `volume_in_cents = income_in_cents + expense_in_cents`;
- `transaction_count`;
- `account_count`, estável em toda a resposta.

Movimentos dentro do bucket preservam a ordem determinística `occurred_on`, `created_at`, `id`. Todos os valores monetários permanecem centavos inteiros e são rejeitados na fronteira TypeScript se não forem inteiros seguros.

## Arquitetura por camada

### Domain

- ampliar `FinancialPeriodKind` com `three_months` e `year`;
- criar o tipo fechado `FinancialBucketGranularity`;
- evoluir `resolveFinancialPeriod` para resolver intervalo e granularidade sem framework;
- reutilizar os tipos de ponto e candle já consumidos pela apresentação;
- manter fórmulas de resumo puras e independentes de Supabase.

### Application

- `ListFinancialEvolutionUseCase` decide pelo contrato resolvido:
  - granularidade `day`: usa o snapshot atual e os agregadores puros existentes;
  - granularidade `week` ou `month`: solicita buckets já agregados;
- a resposta pública do caso de uso permanece `FinancialEvolutionDto`;
- summary, points e candles derivam da mesma coleção agregada;
- falhas do adapter continuam convertidas em `financial evolution unavailable`.

### Infrastructure

- estender o port com uma operação dedicada, por exemplo `loadAggregatedEvolution`;
- criar mapper próprio para a projeção agregada, sem reaproveitar o mapper de movimentos brutos;
- chamar a nova função `load_financial_evolution_buckets(date, date, text)` somente no servidor;
- o `userId` da request não é enviado como parâmetro SQL; a autoridade permanece a sessão autenticada e `(select auth.uid())`;
- a RPC diária permanece intacta e continua atendendo somente intervalos de até 31 dias.

### Presentation e App Router

- adicionar `3M` e `Ano` ao fim da barra existente;
- manter `FinancialPeriodSelector` como Server Component e formulário GET progressivo;
- os nomes acessíveis explicitam `Três meses civis` e `Ano atual`;
- o texto de orientação diferencia calendário civil de janelas móveis sem transformar o controle em tutorial;
- rolagem horizontal continua confinada à barra em telas estreitas;
- linha, candles e tabela recebem DTO serializável e não conhecem função SQL ou granularidade de banco.

## Contrato implementado da RPC

Assinatura implementada:

`public.load_financial_evolution_buckets(p_start_on date, p_end_on date, p_bucket text)`

Regras obrigatórias:

- `SECURITY INVOKER` e `SET search_path = ''`;
- `EXECUTE` revogado de `PUBLIC`, `anon` e `service_role`, concedido somente a `authenticated`;
- identidade permanente obrigatória; sessão sem usuário ou usuário anônimo falha fechado;
- nenhum parâmetro `user_id`;
- allowlist exata de `week` e `month`;
- limites não nulos, `start < end`, duração máxima de 366 dias e no máximo 60 buckets;
- tabelas e funções referenciadas com schema explícito;
- resposta somente agregada, sem descrição, notas, categoria, conta, e-mail ou UUID de movimento;
- RLS forçada e filtro explícito de proprietário preservados;
- migration forward-only e `notify pgrst, 'reload schema'` somente após os contratos pgTAP ficarem verdes.

O teto de 366 dias cobre um ano civil bissexto. O teto de 60 pontos contém consultas diretas fora da UI sem antecipar a política de `Tudo`, que pertence à `003C`.

## Estratégia SQL implementada

1. validar argumentos e identidade;
2. obter quantidade de contas e saldo inicial do usuário;
3. calcular o saldo anterior ao início do período;
4. gerar anchors semanais ou mensais e recortá-los ao intervalo solicitado;
5. selecionar apenas movimentos do usuário dentro do intervalo;
6. ordenar movimentos de forma determinística e calcular saldos intermediários;
7. agregar OHLC, receitas, despesas, volume e contagem por bucket;
8. preencher buckets vazios e carregar o fechamento anterior;
9. ordenar a saída por `start_on_inclusive` crescente.

A consulta existente `(user_id, occurred_on desc, created_at desc, id desc)` atende igualdade por proprietário, intervalo de data e desempate. O contrato de performance do Dia 2 foi validado no Dia 3 com `EXPLAIN (ANALYZE, BUFFERS)` e confirmou o índice existente; nenhum índice adicional foi criado.

## Segurança e privacidade

- RLS está habilitada e forçada em `financial_accounts` e `transactions`;
- o estado remoto confirma que a RPC atual é invoker, usa search path vazio e concede execução apenas a `authenticated`;
- uma sessão nunca escolhe outro proprietário por parâmetro;
- nenhum histórico bruto de longo prazo atravessa a fronteira da RPC;
- logs e analytics não recebem valores financeiros, datas individuais, UUIDs, descrições, e-mail, token ou payload SQL;
- o aviso global de proteção contra senhas vazadas permanece em `SEC-AUTH-001` e não é causado por esta feature.

## Estratégia de testes executada nos Dias 2 e 3

### Domain/Jest

- intervalos exatos de `three_months` e `year`, incluindo virada de ano e ano bissexto;
- granularidade correta para os sete presets;
- propriedades de cobertura, consecutividade e recorte dos buckets;
- fallback de URL e regressão dos cinco valores existentes.

### Application/Infrastructure/Jest

- períodos diários continuam usando a RPC de snapshot;
- `3M` e `Ano` usam exclusivamente o contrato agregado;
- mapper valida schema, consistência, ordem, intervalos e inteiros seguros;
- summary, points e candles permanecem equivalentes;
- erros e resposta sem contas preservam os estados atuais.

### Banco/pgTAP

- assinatura, invoker, search path e grants mínimos;
- rejeição de limites nulos/invertidos, bucket inválido, mais de 366 dias e mais de 60 pontos;
- rejeição de `anon`, usuário Auth anônimo e sessão ausente;
- isolamento entre dois usuários;
- OHLC determinístico, volume, contagem, bucket parcial e bucket vazio;
- ano bissexto e virada de mês/ano;
- plano de execução usa filtro por usuário/data e não justifica índice especulativo.

### Presentation/App Router

- ordem final da barra: `Semana`, `7D`, `Quinzena`, `15D`, `Mês`, `3M`, `Ano`;
- nomes acessíveis completos, seleção exclusiva e valores GET canônicos;
- barra permanece Server Component, navegável por teclado e sem overflow global;
- `/` e `/dashboard` entregam os dois novos períodos à mesma composição.

## Dependências e riscos

- risco ALTO: cálculo OHLC agregado incorreto; mitigação por fixtures determinísticas compartilhadas entre Jest e pgTAP;
- risco ALTO: isolamento multiusuário; mitigação por invoker, RLS forçada, claims permanentes e teste cruzado;
- risco MÉDIO: plano degradar em histórico anual; mitigação por retorno limitado, índice existente e `EXPLAIN` antes de índice novo;
- risco BAIXO: inspeção móvel automatizada atual não concluída no harness isolado; mitigação por rolagem confinada, alvo de 44 px, reposicionamento do item ativo, contratos Jest e evidência real anterior da barra em 320 px;
- risco BAIXO: usuário interpretar `3M` como 90 dias; mitigação por nome acessível e orientação civil curta.

Não há bloqueio duro para o Dia 7. A acessibilidade do renderer e a visibilidade do período ativo foram endurecidas no Dia 6; `UX-CHART-003C`, deploy e operações Git remotas continuam fora deste ciclo de fase.

## Critério de pronto do Dia 1

- predecessora confirmada no `develop` atual;
- semântica, URL e granularidade de `3M` e `Ano` definidas;
- contrato agregado e responsabilidades por camada definidos;
- limites de segurança, privacidade e performance explicitados;
- matriz de testes do Dia 2 preparada;
- baseline atual verde com 4 suítes, 45 testes e zero snapshots;
- Supabase remoto inspecionado somente em leitura, sem mutação;
- nenhum código funcional, teste, migration, dado remoto, commit, push, PR ou deploy antecipado.

## Próximo passo

O Dia 6 estabilizou os nomes acessíveis dos gráficos, manteve o seletor server-side e confinou a rolagem touch com reposicionamento do período ativo. O próximo passo é executar o Dia 7 para validação final, Preview e preparação da entrega sem antecipar o escopo da `003C`.
