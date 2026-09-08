# Status — UX-CHART-003C

- Estado da feature: `SPEC_READY`
- Fase concluída: `Dia 1`
- Aprovação: confirmada em 2026-09-08
- Código funcional alterado: não
- Banco remoto alterado: não

## Entregáveis do Dia 1

- Feature PRD com regras, requisitos e critérios de aceite estáveis;
- Feature Spec com contratos por camada, UI, banco, segurança e rollout;
- ADR 0022 com a decisão arquitetural aprovada;
- três small releases recortadas para execução incremental;
- Context Pack e documentação viva atualizados.

## Decisões vigentes

- `Tudo` usa a primeira transação visível ao usuário e nunca o `created_at` da conta;
- sem transações, o mês atual preserva o saldo inicial sem história fictícia;
- personalizado usa datas inclusivas na UI e intervalo semiaberto no domínio;
- granularidade progride de dia a ano, com no máximo 60 anos e 60 buckets;
- drill-down acontece no mesmo painel: ano, trimestre, mês e extrato final;
- históricos longos entregam apenas agregados; lançamentos são buscados somente no mês final.

## Bloqueios e riscos

Nenhum bloqueio duro para o Dia 2. Migration, Supabase remoto, implementação e dependências permanecem bloqueados até as respectivas fases.

Riscos ativos:

- performance de histórico extenso — ALTO, a validar com pgTAP e `EXPLAIN`;
- complexidade de navegação do painel — MÉDIO, a validar por contratos de estado e acessibilidade;
- mês com volume extremo de lançamentos — MÉDIO, fora do escopo e candidato a hardening próprio.

## Próximo passo

Executar explicitamente o Dia 2: derivar a matriz de validação dos IDs do PRD, materializar testes RED e validar a migration proposta sem implementar comportamento funcional.

## Validação do Dia 1

- YAML dos dois mapas parseado com sucesso;
- todas as rotas do artefato ativo existem;
- 10 requisitos funcionais, 6 não funcionais e 10 critérios de aceite únicos confirmados;
- `git diff --check`, ESLint e type-check verdes;
- testes e build não aplicáveis ao incremento exclusivamente documental.
