# UX-CHART-003 — Discovery de períodos e granularidade adaptativa

- Fase: Dia 1 — contexto, discovery e arquitetura
- Data: 2026-09-06
- Estado: arquitetura pronta para `UX-CHART-003A`; `003B` e `003C` permanecem refinadas para ciclos próprios
- Predecessora: `UX-CHART-002D` mesclada por squash em `develop` no commit `70fd53c`

## Problema

O dashboard já resolve cinco períodos financeiros e mantém cards, linha, candles, tabela e extrato sobre a mesma resposta. A escolha, porém, ainda ocorre por um `select` seguido do botão `Atualizar período`. No celular isso ocupa altura, esconde as alternativas e torna uma comparação simples mais lenta do que precisa ser.

Históricos maiores que 31 dias não podem reutilizar a RPC diária sem remover um limite de segurança correto. Também não devem transferir movimentos brutos para o Next.js ou para o browser apenas para produzir candles semanais, mensais ou trimestrais.

## Objetivo do produto

Permitir que o usuário alterne períodos com um toque, entenda imediatamente qual intervalo está ativo e mantenha uma densidade legível de pontos em qualquer tela, sem transformar o FinControl em interface de trading.

## Jornada principal

1. O usuário encontra os períodos imediatamente acima dos indicadores financeiros.
2. Um toque em um período atualiza a URL e recarrega toda a composição financeira com uma única fonte de verdade.
3. O período ativo permanece evidente por texto, contraste e semântica acessível.
4. Cards, linha, candles, tabela e extrato passam a refletir o mesmo intervalo resolvido.
5. Em históricos longos, a aplicação escolhe a granularidade; o usuário escolhe o período, não detalhes de SQL ou bucket.

## Semântica dos períodos

### Recorte 003A — períodos já suportados

| Rótulo visível | Nome acessível | Valor de URL existente | Semântica |
| --- | --- | --- | --- |
| `Semana` | Semana atual | `week` | semana civil de segunda a domingo |
| `7D` | Últimos 7 dias | `rolling_7_days` | referência e seis dias anteriores |
| `Quinzena` | Quinzena atual | `fortnight` | dias 1–15 ou 16–fim do mês |
| `15D` | Últimos 15 dias | `rolling_15_days` | referência e quatorze dias anteriores |
| `Mês` | Mês atual | `month` | mês civil da referência |

- Todos permanecem em buckets diários e dentro do limite atual de 31 dias.
- `month` continua sendo o fallback canônico para valor ausente, repetido ou desconhecido.
- URLs antigas permanecem válidas; nenhuma tradução silenciosa altera semana civil para últimos sete dias ou quinzena civil para últimos quinze dias.

### Recorte 003B — períodos longos previsíveis

| Rótulo | Valor canônico planejado | Intervalo civil | Bucket |
| --- | --- | --- | --- |
| `3M` | `three_months` | mês da referência e dois meses civis anteriores | semana civil |
| `Ano` | `year` | ano civil da referência | mês civil |

- `3M` não significa noventa dias; o nome acessível será `Três meses` e a ajuda contextual explicará o alinhamento mensal.
- `Ano` representa o ano civil, não doze meses móveis; um futuro `12M` deverá ser outro preset.
- Primeiro e último buckets podem ser parciais somente quando o intervalo selecionado os recortar.

### Recorte 003C — Tudo e Personalizado

- `Personalizado` recebe início e fim civis inclusivos na UI e converte para intervalo de domínio semiaberto.
- `Tudo` depende de uma âncora histórica server-side por proprietário e não aceita data inicial fornecida pelo browser.
- A política para históricos que excedam 60 buckets trimestrais permanece uma decisão explícita do Dia 1 da `003C`; não será escondida por truncamento silencioso.
- Candles trimestrais não abrirão diretamente um extrato bruto acima de 31 dias. O fluxo recomendado é drill-down para buckets mensais e, então, abertura do extrato do mês selecionado.

## Granularidade adaptativa

| Duração resolvida | Granularidade | Volume esperado |
| --- | --- | --- |
| até 31 dias | diária | até 31 pontos |
| acima de 31 dias até 6 meses | semanal civil | aproximadamente 5–27 pontos |
| acima de 6 meses até 2 anos | mensal civil | aproximadamente 7–24 pontos |
| acima de 2 anos | trimestral civil | máximo preferencial de 60 pontos |

Regras:
- buckets são civis, consecutivos, semiabertos e cobrem cada data uma única vez;
- ausência de movimento preserva continuidade e saldo anterior;
- abertura, máxima, mínima e fechamento usam a ordenação determinística `occurred_on`, `created_at`, `id`;
- seleção de granularidade pertence a domain/application;
- presentation recebe DTO serializável e nunca escolhe SQL, função Postgres ou limite operacional.

## Experiência da barra de períodos

- Substituir o `select` e o botão separado por uma barra de ações imediatas.
- Em `003A`, mostrar os cinco períodos atuais em uma única linha horizontal.
- Usar botões submit de um formulário GET server-rendered, mantendo funcionamento sem JavaScript e URL compartilhável.
- Cada botão terá alvo mínimo de 44 px, foco visível, `aria-pressed`, nome acessível completo e estado ativo que não depende somente de cor.
- Em 320 px, a rolagem fica confinada ao seletor com `overflow-x-auto`, sem overflow global; desktop apresenta toda a barra quando houver espaço.
- A ordem será `Semana`, `7D`, `Quinzena`, `15D`, `Mês`, preservando a diferença entre períodos civis e móveis.
- A rota continuará responsável pela leitura assíncrona de `searchParams`; o seletor permanece Server Component e não ganhará estado cliente apenas para navegação.
- O loading de rota existente comunica a atualização; não haverá resultado financeiro antigo com rótulo novo durante a navegação.

## Arquitetura por camada

### Domain

- `003A`: nenhum tipo ou serviço novo; reutiliza `FinancialPeriodKind` e `resolveFinancialPeriod`.
- `003B`: introduz tipo fechado de granularidade e resolução determinística de buckets, sem React, Next.js ou Supabase.
- `003C`: adiciona intervalo personalizado e política de período total somente após decisões de limite.

### Application

- `003A`: nenhum caso de uso novo; `ListFinancialEvolutionUseCase` continua sendo a fonte única.
- `003B`: orquestra a leitura agregada e recebe apenas DTOs mínimos; não agrega histórico bruto na memória do servidor.
- A mesma resposta alimenta resumo, linha, candles e tabela.

### Infrastructure

- `003A`: reutiliza `load_financial_evolution_snapshot` sem alteração.
- `003B`: nova RPC agregada, `SECURITY INVOKER`, `search_path = ''`, identidade permanente obrigatória, allowlist de granularidades e grants somente para `authenticated`.
- O índice existente iniciado por `(user_id, occurred_on, ...)` deve ser validado com `EXPLAIN (ANALYZE, BUFFERS)` antes de criar outro índice.
- Nenhuma migration será criada antes dos contratos pgTAP do ciclo próprio da `003B`.

### Presentation e App Router

- `FinancialPeriodSelector` permanece em `financial-analytics/presentation`.
- `composeDashboardRoute` continua como composition root e interpreta somente parâmetros permitidos.
- Server Components realizam a leitura inicial; Client Components permanecem restritos às interações do gráfico e do extrato.
- Props que cruzam a fronteira cliente continuam como strings, números, booleanos, arrays e objetos simples.

## Segurança, privacidade e performance

- A UI nunca recebe `userId` como autoridade e não acessa Supabase.
- Funções agregadoras usam RLS e filtro explícito por `(select auth.uid())`; usuário ausente ou anônimo falha fechado.
- `PUBLIC`, `anon` e `service_role` não recebem execução; somente `authenticated` recebe o grant mínimo.
- Nenhuma descrição, UUID, e-mail, token ou valor financeiro será registrado em analytics ou logs.
- Históricos longos retornam buckets agregados, nunca a coleção bruta de transações.
- A RPC diária mantém o limite de 31 dias; remover esse limite está proibido nesta feature.
- Novos índices só serão aceitos após evidência de plano, volume e advisor, evitando duplicação especulativa.

## Small releases

### UX-CHART-003A — Barra rápida dos períodos atuais

- Trocar o controle atual pela barra `Semana`, `7D`, `Quinzena`, `15D`, `Mês`.
- Preservar valores de URL, fallback, Server Component e RPC diária.
- Cobrir semântica, teclado, responsividade e estados de rota.
- Sem migration, novo port, nova dependência ou alteração Supabase.

### UX-CHART-003B — 3M e Ano agregados no servidor

- Adicionar tipos e regras de granularidade semanal/mensal.
- Criar contratos application/infrastructure e RPC agregada.
- Validar RLS, grants, pgTAP, plano de execução e advisors.
- Integrar os novos presets mantendo extrato direto para buckets de até 31 dias.

### UX-CHART-003C — Tudo, Personalizado e drill-down

- Definir âncora histórica, limite superior e comportamento acima de 60 pontos.
- Adicionar datas personalizadas canônicas na URL.
- Implementar drill-down de bucket trimestral antes do extrato detalhado.
- Validar navegação, histórico longo, performance, acessibilidade e privacidade.

## Cenários essenciais para o Dia 2 da 003A

1. os cinco botões renderizam na ordem aprovada com nomes acessíveis completos;
2. o período selecionado possui estado semântico e visual sem depender de cor;
3. cada botão envia exatamente o valor de URL existente;
4. ausência, array repetido e valor desconhecido recaem em `month`;
5. semana civil e sete dias móveis permanecem semanticamente diferentes;
6. quinzena civil e quinze dias móveis permanecem semanticamente diferentes;
7. o seletor funciona sem Client Component, fetch direto ou acesso Supabase;
8. o container confina rolagem horizontal e os controles mantêm alvo mínimo de 44 px;
9. as rotas `/` e `/dashboard` continuam compondo a mesma resposta para o período selecionado;
10. toda a regressão financeira permanece verde e nenhuma migration é criada.

## Dependências e riscos

- `003A`: risco MÉDIO de regressão de navegação/acessibilidade, mitigado por preservar os valores e casos de uso existentes.
- `003B`: risco ALTO por nova agregação financeira, migration, RLS e performance; exige ciclo próprio completo.
- `003C`: risco ALTO por intervalo arbitrário, URL, drill-down e histórico potencialmente extenso; permanece fora do primeiro recorte.
- Hardening global `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001B` continua condicionando produção pública, sem bloquear o TDD local da `003A`.

## Critério de pronto do Dia 1

- predecessora confirmada em `develop`;
- semântica e ordem da barra curta aprovadas;
- responsabilidades por camada definidas;
- small releases isolam UI curta, agregação longa e intervalo arbitrário;
- contratos essenciais da `003A` estão prontos para virar testes antes do código;
- baseline atual permanece verde com 3 suítes e 30 testes, zero snapshots;
- nenhuma implementação, teste, migration ou alteração remota foi antecipada.

## Próximo passo

Executar o Dia 2 da `UX-CHART-003A` e criar os contratos essenciais em RED antes de alterar `FinancialPeriodSelector` ou qualquer código funcional.
