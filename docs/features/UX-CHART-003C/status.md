# Status — UX-CHART-003C

- Estado da feature: `TEST_STRATEGY_READY`
- Fase concluída: `Dia 2`
- Aprovação: confirmada em 2026-09-08
- Código funcional alterado: não; somente testes RED
- Banco remoto alterado: não

## Entregáveis acumulados

- Feature PRD com regras, requisitos e critérios de aceite estáveis;
- Feature Spec com contratos por camada, UI, banco, segurança e rollout;
- ADR 0022 com a decisão arquitetural aprovada;
- três small releases recortadas para execução incremental;
- Context Pack e documentação viva atualizados.
- estratégia de testes com matriz completa dos dez critérios de aceite;
- RED executável da `UX-CHART-003C1` para domínio, URL, seletor e composição server-side;
- contratos futuros de Jest e pgTAP definidos para `003C2` e `003C3`.

## Decisões vigentes

- `Tudo` usa a primeira transação visível ao usuário e nunca o `created_at` da conta;
- sem transações, o mês atual preserva o saldo inicial sem história fictícia;
- personalizado usa datas inclusivas na UI e intervalo semiaberto no domínio;
- granularidade progride de dia a ano, com no máximo 60 anos e 60 buckets;
- drill-down acontece no mesmo painel: ano, trimestre, mês e extrato final;
- históricos longos entregam apenas agregados; lançamentos são buscados somente no mês final.

## Bloqueios e riscos

Nenhum bloqueio duro para o Dia 3 da `003C1`. Migration, Supabase remoto e drill-down permanecem bloqueados até as respectivas fatias.

O merge da PR `#30` permanece bloqueado por vulnerabilidades altas reportadas no `npm audit` para `js-yaml` e `sharp`. A correção exige hardening de dependências separado.

Riscos ativos:

- performance de histórico extenso — ALTO, a validar com pgTAP e `EXPLAIN`;
- complexidade de navegação do painel — MÉDIO, a validar por contratos de estado e acessibilidade;
- mês com volume extremo de lançamentos — MÉDIO, fora do escopo e candidato a hardening próprio.

## Próximo passo

Executar explicitamente o Dia 3 da `UX-CHART-003C1`: implementar o mínimo para tornar verdes os contratos de domínio, URL e seletor, sem criar migration ou antecipar drill-down.

## Validação do Dia 1

- YAML dos dois mapas parseado com sucesso;
- todas as rotas do artefato ativo existem;
- 10 requisitos funcionais, 6 não funcionais e 10 critérios de aceite únicos confirmados;
- `git diff --check`, ESLint e type-check verdes;
- testes e build não aplicáveis ao incremento exclusivamente documental.

## Validação do Dia 2

- baseline dirigido anterior: 7 suítes, 77 testes e 0 snapshots, todos verdes;
- RED dirigido: 4 suítes falharam, com 39 cenários vermelhos e 22 regressões verdes;
- falhas causadas pelos contratos ainda ausentes, sem módulo quebrado ou dependência externa;
- ESLint e type-check verdes com os testes RED presentes;
- nenhuma migration, alteração Supabase, dependência ou código funcional criado.
