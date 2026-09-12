# Feature PRD — UX-CHART-003C2

## Identificação

- ID: `UX-CHART-003C2`
- Título: Agregação segura para histórico completo
- Tipo: Small Release / Software / Product
- Feature pai: `UX-CHART-003C`
- Estado: `SPEC_READY`
- Aprovação: confirmada em 2026-09-12
- Data de elaboração: 2026-09-12

## Problema

A interface já reconhece `Tudo`, períodos personalizados e granularidades trimestral/anual, mas o fluxo ainda não pode consultar históricos extensos. O caso de uso não resolve o início do histórico do usuário, e o adapter Supabase bloqueia `quarter` e `year` porque a RPC publicada aceita somente `week` e `month` e limita o intervalo a 366 dias.

Sem uma extensão deliberada do contrato, habilitar esses períodos poderia produzir intervalo invertido, transferir dados em excesso, contornar limites de segurança ou degradar o banco.

## Usuário e valor esperado

O usuário autenticado precisa visualizar todo o próprio histórico financeiro em candles agregados, mantendo a mesma leitura de abertura, máxima, mínima, fechamento, volume e quantidade já oferecida nos períodos menores.

O incremento entrega a fundação segura e performática para `Tudo` e para períodos personalizados longos, sem expor lançamentos brutos nem misturar dados entre usuários.

## Escopo

- criar uma RPC sem parâmetros de usuário para localizar a primeira transação visível ao usuário autenticado;
- resolver `Tudo` no domínio/aplicação usando a data inicial retornada pelo servidor e a data civil de referência;
- estender a RPC agregadora existente para `quarter` e `year`, preservando `week` e `month`;
- aplicar limites independentes de 60 anos e 60 buckets;
- preservar o formato agregado já consumido pelo dashboard;
- permitir `quarter` e `year` no adapter somente após a migration correspondente;
- proteger ambas as RPCs com execução pelo invocador, `search_path` vazio, privilégios explícitos e RLS;
- definir no Dia 2 a rede automatizada de Jest, pgTAP e evidência de plano de consulta.

## Fora do escopo

- drill-down progressivo e busca de lançamentos, reservados à `UX-CHART-003C3`;
- redesign do seletor, modal, gráfico ou extrato;
- retorno de descrições, categorias ou qualquer linha bruta de transação;
- novas tabelas ou alteração do modelo financeiro;
- criação ou remoção de índice sem evidência de `EXPLAIN (ANALYZE, BUFFERS)`;
- mudança semântica nos sete períodos já publicados;
- publicação de conteúdo no LinkedIn;
- aplicação de migration ou mutação remota durante o Dia 1.

## Regras de negócio

- `FPRD-UXCHART003C2-BR-001` — o início de `Tudo` é a menor `occurred_on` de uma transação visível ao usuário autenticado; `created_at` da conta não participa dessa decisão.
- `FPRD-UXCHART003C2-BR-002` — a data final histórica é a data civil de referência, inclusiva; no domínio ela é convertida para o dia seguinte exclusivo.
- `FPRD-UXCHART003C2-BR-003` — quando não existir transação visível, `Tudo` usa o mês civil da referência para preservar a leitura do saldo inicial sem inventar histórico.
- `FPRD-UXCHART003C2-BR-004` — se a primeira transação visível ocorrer depois da data de referência, o período também usa o mês civil da referência; uma transação futura não transforma histórico em projeção nem pode gerar intervalo invertido. Esta regra de borda é nova e requer aprovação humana neste Dia 1.
- `FPRD-UXCHART003C2-BR-005` — nenhuma RPC recebe `user_id`; a identidade é obtida exclusivamente de `auth.uid()` e os dados continuam sujeitos às políticas RLS.
- `FPRD-UXCHART003C2-BR-006` — trimestre e ano usam fronteiras civis em UTC e preservam buckets parciais nas extremidades do intervalo solicitado.
- `FPRD-UXCHART003C2-BR-007` — duração máxima de 60 anos e quantidade máxima de 60 buckets são limites independentes; exceder qualquer um falha de forma determinística.
- `FPRD-UXCHART003C2-BR-008` — segmentos sem transações carregam o saldo anterior, com OHLC estável, volume zero e zero movimentos.
- `FPRD-UXCHART003C2-BR-009` — a resposta contém somente bucket, abertura, máxima, mínima, fechamento, volume e quantidade; dados brutos permanecem no servidor.
- `FPRD-UXCHART003C2-BR-010` — os contratos existentes de `week` e `month` permanecem compatíveis em assinatura, projeção, ordem e semântica.

## Requisitos funcionais

- `FPRD-UXCHART003C2-RQ-001` — disponibilizar `load_financial_history_start()` retornando `date | null` para o usuário autenticado.
- `FPRD-UXCHART003C2-RQ-002` — resolver `period=all` com âncora server-side, referência explícita e fallback civil definido nas regras de negócio.
- `FPRD-UXCHART003C2-RQ-003` — estender `load_financial_evolution_buckets` para a allowlist `week | month | quarter | year`.
- `FPRD-UXCHART003C2-RQ-004` — validar ordem, duração e contagem de buckets antes de executar a agregação financeira.
- `FPRD-UXCHART003C2-RQ-005` — mapear a nova âncora e as granularidades adicionais por portas tipadas de application/infrastructure, sem acesso Supabase na apresentação.
- `FPRD-UXCHART003C2-RQ-006` — falhar fechado para sessão ausente, usuário anônimo, granularidade inválida e resposta RPC incompatível, sem expor detalhes internos ao navegador.
- `FPRD-UXCHART003C2-RQ-007` — entregar a alteração de banco em uma única migration forward-only, reproduzível localmente antes de qualquer aplicação remota.

## Requisitos não funcionais

- `FPRD-UXCHART003C2-NFR-001` — funções `SECURITY INVOKER`, `search_path = ''` e referências totalmente qualificadas.
- `FPRD-UXCHART003C2-NFR-002` — `EXECUTE` revogado de `PUBLIC`, `anon` e papéis não necessários; concedido explicitamente a `authenticated`.
- `FPRD-UXCHART003C2-NFR-003` — isolamento tenant e rejeição anônima comprovados por pgTAP, com `(select auth.uid())` compatível com as policies atuais.
- `FPRD-UXCHART003C2-NFR-004` — projeção minimizada e sem telemetria, logs ou erros contendo conteúdo financeiro sensível.
- `FPRD-UXCHART003C2-NFR-005` — plano de consulta medido em volume representativo; novo índice somente com evidência de necessidade e comparação antes/depois.
- `FPRD-UXCHART003C2-NFR-006` — testes, lint, type-check, build, segurança, documentação e migration/rollback devem ficar verdes antes do release.

## Critérios de aceite

- `FPRD-UXCHART003C2-AC-001` — dado um usuário autenticado com transações, a RPC de âncora retorna apenas a menor `occurred_on` visível a ele.
- `FPRD-UXCHART003C2-AC-002` — sem transações, ou com transações somente depois da referência, `Tudo` resolve o mês civil da referência sem intervalo invertido e preserva o saldo inicial aplicável.
- `FPRD-UXCHART003C2-AC-003` — com histórico válido, `Tudo` cobre da primeira transação até a referência inclusiva e escolhe a granularidade aprovada pelo domínio.
- `FPRD-UXCHART003C2-AC-004` — `quarter` e `year` produzem OHLC, volume e quantidade corretos, inclusive em buckets parciais e vazios.
- `FPRD-UXCHART003C2-AC-005` — intervalos acima de 60 anos, mais de 60 buckets ou granularidade fora da allowlist são rejeitados antes do retorno de dados.
- `FPRD-UXCHART003C2-AC-006` — usuário anônimo não executa as RPCs; usuários autenticados não observam dados de outro tenant e não informam `user_id` no payload.
- `FPRD-UXCHART003C2-AC-007` — a resposta agregada não contém descrições, categorias, identificadores ou linhas de transações.
- `FPRD-UXCHART003C2-AC-008` — `week` e `month`, além dos sete períodos publicados, mantêm os resultados e URLs existentes.
- `FPRD-UXCHART003C2-AC-009` — o adapter só aceita `quarter/year` quando a migration correspondente está presente e converte falhas externas em erros estáveis da aplicação.
- `FPRD-UXCHART003C2-AC-010` — pgTAP, Jest, análise estática, build, advisors Supabase e evidência de `EXPLAIN` ficam verdes antes do release.

## Métricas de sucesso

- 100% dos critérios de aceite cobertos por cenários rastreáveis;
- zero parâmetro de identidade controlado pelo navegador nas RPCs;
- zero linha bruta de transação na resposta agregada;
- zero regressão nos sete períodos já publicados;
- plano de consulta documentado e sem novo índice especulativo.

## Dependências

- `UX-CHART-003C1` liberada;
- `UX-CHART-003A`, `UX-CHART-003B` e `UX-CHART-002`;
- ADR `0022`;
- policies RLS atuais de `transactions` e `financial_accounts`;
- migration atual `create_financial_evolution_buckets`;
- índice composto atual de transações por usuário e ocorrência.

## Riscos

- ALTO — plano ineficiente para âncora ou histórico longo; mitigação por fixture volumétrica e `EXPLAIN (ANALYZE, BUFFERS)`.
- ALTO — vazamento cross-tenant por função ou grant incorreto; mitigação por invoker, RLS e pgTAP multiusuário/anônimo.
- MÉDIO — divergência entre intervalo histórico e período civil exibido; mitigação por função pura, referência explícita e testes de borda.
- MÉDIO — quebra de compatibilidade da RPC existente; mitigação por assinatura preservada e regressão `week/month`.

## Decisões aprovadas

1. Uma conta com apenas transações futuras é tratada como “sem histórico até a referência”, usando o mês civil da referência.
2. Quando existir histórico anterior ou igual à referência, `Tudo` termina na data de referência inclusiva, e não no fim futuro do mês.

## Aprovação

O escopo técnico e as regras foram aprovados por comando humano em 2026-09-12. A small release está `SPEC_READY` e pode iniciar o Dia 2 mediante comando próprio.
