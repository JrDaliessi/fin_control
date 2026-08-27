# ADR 0009 — Períodos financeiros, datas civis e fronteiras de timezone

- Status: aceito
- Data: 2026-08-25

## Contexto

A SR-012 inicia analytics financeiros depois da autenticação, contas, categorias e transações persistidas com RLS. O produto precisa distinguir semana civil, últimos 7 dias, quinzena civil, últimos 15 dias e mês sem depender de timezone implícito, horário do servidor ou interpretação variável entre consumidores.

As transações persistem `occurred_on` como `date`, isto é, uma data civil sem horário ou offset. Usar `Date` ou getters locais para calcular períodos pode deslocar o dia financeiro e produzir intervalos diferentes por ambiente.

## Decisão

1. `financial-analytics/domain` será a fonte de verdade para períodos.
2. A SR-012 suporta somente `week`, `rolling_7_days`, `fortnight`, `rolling_15_days` e `month`.
3. Datas de domínio usam `CivilDate` canônica em `YYYY-MM-DD` e devem existir no calendário gregoriano.
4. Intervalos são semiabertos: `[startOnInclusive, endOnExclusive)`.
5. Semana começa na segunda-feira e termina antes da segunda seguinte.
6. Janelas móveis incluem a data de referência: 7 dias usam os seis anteriores; 15 dias usam os quatorze anteriores.
7. Quinzena civil é dia 1–15 ou dia 16–fim do mês.
8. Mês vai do primeiro dia até o primeiro dia do mês seguinte.
9. O domínio recebe uma data civil de referência e não consulta relógio, locale ou timezone do host.
10. `occurred_on date` não sofre conversão de timezone.
11. Converter um instante como “agora” para data civil exigirá timezone IANA e relógio injetados em uma borda futura de aplicação; nenhum fallback fica oculto no domínio.
12. DTOs temporais expõem somente strings serializáveis; `Date` e classes não atravessam fronteiras RSC.
13. O port persistente de consulta por intervalo será criado somente na SR-013, quando houver consumidor real.
14. A SR-012 não cria `presentation`, `infrastructure`, migration, policy, grant, view, RPC, rota ou dependência adicional.

## Alternativas consideradas

### Usar `Date` em UTC no domínio

Rejeitada porque `Date` representa um instante e pode reintroduzir conversões acidentais sobre datas financeiras civis.

### Assumir `America/Sao_Paulo`

Rejeitada como default implícito. O produto é brasileiro, mas localização não determina timezone do usuário. Uma futura borda de “período atual” deverá receber essa decisão explicitamente.

### Estender `TransactionRepository.findByMonth` agora

Rejeitada por antecipar infraestrutura sem consumidor na SR-012. A SR-013 definirá o port de consulta por intervalo sem acoplar analytics ao domínio de transações.

### Incluir `custom`

Adiada para preservar a small release. O contrato amplo continua previsto, mas exige validação de dois limites e experiência própria.

## Consequências

- O cálculo permanece puro, determinístico e testável em viradas de mês, ano e ano bissexto.
- Consultas futuras podem usar diretamente `gte(startOnInclusive)` e `lt(endOnExclusive)` sobre `occurred_on`.
- Nenhum ajuste de schema ou RLS é necessário.
- Consumidores futuros não podem inferir timezone do navegador ou servidor.
- Comparações, agregações, consulta persistente e UI permanecem nas releases posteriores.
