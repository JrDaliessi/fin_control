# Status — UX-CHART-003C

- Estado da feature: `HARDENING`
- Fase concluída: `Dia 5`
- Aprovação: confirmada em 2026-09-08
- Código funcional alterado: sim; núcleo da `UX-CHART-003C1` em GREEN
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
- tipos `all`/`custom` e granularidades `quarter`/`year` incorporados ao domínio;
- período personalizado resolve datas inclusivas, intervalo semiaberto, granularidade e limites de 60 anos/60 buckets;
- URL distingue presets, personalizado canônico e personalizado inválido sem iniciar consulta;
- seletor expõe nove opções, com `Tudo` progressivo e `Personalizado` como acionador de diálogo;
- diálogo personalizado usa bottom sheet no mobile e modal compacto no desktop, com datas inclusivas, formulário GET e valores restaurados da URL;
- validações locais distinguem datas ausentes, ordem invertida, limite de 60 anos e limite de 60 candles;
- foco inicial, contenção, retorno ao acionador, `Escape`, cancelar, botão de fechar, backdrop, scroll lock e áreas seguras estão cobertos;
- erros do período personalizado possuem códigos estáveis `INVALID_DATE`, `INVALID_ORDER`, `RANGE_TOO_LONG` e `TOO_MANY_BUCKETS`;
- a apresentação traduz códigos tipados sem comparar textos internos do domínio e descarta rascunhos cancelados;
- lockfile atualiza `js-yaml` para 3.15.2/4.3.2 e `sharp` para 0.35.4 sem alterar dependências diretas;
- adapter Supabase rejeita trimestre/ano localmente até a migration aprovada da `003C2`.

## Decisões vigentes

- `Tudo` usa a primeira transação visível ao usuário e nunca o `created_at` da conta;
- sem transações, o mês atual preserva o saldo inicial sem história fictícia;
- personalizado usa datas inclusivas na UI e intervalo semiaberto no domínio;
- granularidade progride de dia a ano, com no máximo 60 anos e 60 buckets;
- drill-down acontece no mesmo painel: ano, trimestre, mês e extrato final;
- históricos longos entregam apenas agregados; lançamentos são buscados somente no mês final.

## Bloqueios e riscos

Nenhum bloqueio duro para o Dia 6 da `003C1`. Migration, Supabase remoto e drill-down permanecem bloqueados até as respectivas fatias.

O `SUPPLY-CHAIN-003` foi resolvido localmente com audit zerado; a confirmação do CI remoto ocorrerá após o próximo push da PR `#30`.

Riscos ativos:

- performance de histórico extenso — ALTO, a validar com pgTAP e `EXPLAIN`;
- complexidade de navegação do painel — MÉDIO, a validar por contratos de estado e acessibilidade;
- mês com volume extremo de lançamentos — MÉDIO, fora do escopo e candidato a hardening próprio.

## Próximo passo

Executar explicitamente o Dia 6 da `UX-CHART-003C1`: validar acessibilidade, responsividade e formato final do diálogo sem antecipar a `003C2`.

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

## Validação do Dia 3

- 4 suítes anteriormente RED passaram com 61 testes verdes;
- regressão completa final passou com 97 suítes e 657 testes;
- o adapter recebeu um teste RED→GREEN para bloquear `quarter/year` antes da RPC antiga;
- ESLint global, type-check e build Next.js 16.3.3/Turbopack passaram;
- revisão React/Next.js confirmou Server Components, imports diretos, serialização mínima e ausência de waterfall;
- nenhuma migration, dependência, alteração remota, merge ou deploy foi executado.

## Validação do Dia 4

- RED dirigido registrou 9 falhas novas ligadas ao diálogo ainda ausente, mantendo 16 regressões verdes na suíte;
- suíte dirigida passou com 25 testes e regressão completa com 97 suítes/665 testes;
- aplicação válida preserva `period=custom`, `from` e `to` em formulário GET e não bloqueia a navegação nativa;
- estados inválidos permanecem no diálogo com mensagem acionável e atributos acessíveis;
- ESLint, type-check e build Next.js passaram; revisão React confirmou ilha cliente mínima e props serializáveis;
- nenhuma migration, dependência, alteração remota, commit, push, merge ou deploy foi executado.

## Validação do Dia 5

- RED dirigido: 5 cenários falharam exclusivamente pela ausência dos códigos estáveis; 36 regressões permaneceram verdes;
- GREEN dirigido: 2 suítes e 41 testes passaram, incluindo descarte do rascunho cancelado;
- regressão completa: 97 suítes e 666 testes verdes, sem snapshots;
- instalação limpa por `npm ci` reproduziu o lockfile; `npm audit --audit-level=high` retornou zero vulnerabilidades;
- ESLint, type-check, build Next.js e `git diff --check` passaram;
- revisão React confirmou ilha cliente mínima e não encontrou justificativa para novas abstrações;
- nenhuma migration, dependência direta, mutação Supabase, commit, push, merge ou deploy foi executado.
