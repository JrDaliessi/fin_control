# ADR 0022 — Tudo, personalizado e drill-down progressivo

- Status: Aprovado para Validation First/TDD incremental
- Data: 2026-09-08
- Feature: `UX-CHART-003C`
- Depende de: ADR 0019, ADR 0020 e ADR 0021
- Afeta: períodos financeiros, analytics, painel contextual, App Router e Supabase

## Contexto

Após `UX-CHART-003A` e `003B`, o FinControl possui sete períodos até um ano e agregação server-side semanal/mensal. Faltam o histórico completo, um intervalo escolhido pelo usuário e uma forma segura de explicar buckets maiores que 31 dias sem transferir todo o extrato ao browser ou abrir diálogos aninhados.

A conta financeira não possui uma data de início financeiro. Seu `created_at` é técnico e pode anteceder ou suceder o primeiro lançamento relevante. A primeira transação é a única âncora financeira verificável existente.

## Decisão

### Âncora e URL

- `Tudo` usa `?period=all`; a menor `occurred_on` é derivada por função server-side invoker sob RLS.
- O browser não informa a data inicial efetiva nem `userId` à função.
- Quando não há transação, o período recai no mês civil da referência e mostra o saldo inicial, sem fabricar buckets históricos.
- `Personalizado` usa `?period=custom&from=YYYY-MM-DD&to=YYYY-MM-DD`.
- `from` e `to` são inclusivos para o usuário; o domínio converte o fim para exclusivo.

### Granularidade e limites

| Intervalo | Granularidade |
| --- | --- |
| até 31 dias | dia |
| acima de 31 dias até 6 meses | semana civil |
| acima de 6 meses até 2 anos | mês civil |
| acima de 2 anos até 15 anos | trimestre civil |
| acima de 15 anos | ano civil |

- duração máxima: 60 anos;
- quantidade máxima: 60 buckets;
- ambos os limites são independentes e validados no domínio e no SQL;
- excesso gera erro explícito, nunca truncamento;
- buckets são consecutivos, semiabertos e podem ser parciais nas extremidades.

### Drill-down

O painel contextual existente passa a representar uma pilha de níveis, substituindo o conteúdo no mesmo diálogo:

```text
bucket anual → trimestres → meses → extrato de até 31 dias
```

Um bucket trimestral abre meses. Um bucket mensal abre o extrato existente. Períodos menores continuam usando o fluxo direto compatível. Gráfico e tabela enviam o mesmo intervalo semiaberto e expõem ações equivalentes.

### Dados e segurança

- a RPC agregada passa a aceitar `quarter` e `year`, mantendo allowlist;
- históricos longos retornam somente limites, contagem de contas, OHLC, receitas, despesas, volume e quantidade;
- lançamentos detalhados são carregados apenas no mês final e por ação explícita;
- funções permanecem `SECURITY INVOKER`, com `search_path = ''`, RLS e grants mínimos;
- o índice atual por `user_id, occurred_on, created_at, id` será medido antes de qualquer índice adicional.

## Alternativas consideradas

### Usar `created_at` da conta como início

Rejeitada porque é uma data técnica, não uma ocorrência financeira, e múltiplas contas podem ter datas diferentes.

### Enviar todo o histórico ao navegador

Rejeitada por minimização de dados, custo, privacidade e desempenho.

### Abrir um novo modal a cada nível

Rejeitada por foco, navegação, sobreposição e experiência mobile. Um único painel com retorno é mais previsível.

### Manter trimestre para qualquer histórico

Rejeitada porque excederia 60 pontos acima de 15 anos. A granularidade anual mantém a leitura e o limite defensivo.

### Truncar para os 60 buckets mais recentes

Rejeitada porque alteraria silenciosamente o significado de `Tudo` e do período personalizado.

## Consequências

- será necessária uma migration forward-only e uma leitura server-side da âncora;
- a resolution de período `all` exige uma etapa de application antes da consulta agregada;
- a presentation ganha estado de navegação contextual, mas não regra financeira nem acesso a dados;
- os limites ficam testáveis e consistentes em duas fronteiras;
- intervalos próximos de 60 anos que atravessem mais de 60 anos-calendário podem ser rejeitados pelo teto de buckets mesmo respeitando a duração; a mensagem deve explicar o ajuste necessário;
- paginação de um mês com volume extremo permanece hardening separado.

## Validação exigida

- unit tests de domínio/application antes da implementação;
- pgTAP de assinatura, ACL, RLS, comportamento, limites e isolamento;
- `EXPLAIN (ANALYZE, BUFFERS)` antes de qualquer índice;
- testes de URL, foco, teclado, painel único, estados assíncronos e equivalência da tabela;
- regressão dos sete períodos existentes e do extrato limitado a 31 dias;
- lint, type-check, build e validação responsiva antes da release.
