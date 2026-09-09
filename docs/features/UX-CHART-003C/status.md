# Status — UX-CHART-003C

- Estado da feature pai: `IN_PROGRESS`
- Estado da small release `UX-CHART-003C1`: `READY_FOR_RELEASE`
- Fase concluída: `Dia 7`
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
- validação conduz o foco ao campo ausente que exige correção;
- contratos automatizados preservam contenção de foco, isolamento do fundo, safe areas, rolagem interna e targets de 44 px;
- Preview autenticada confirmou bottom sheet em 320/390 px e modal compacto em 768/1280 px sem overflow global.

## Decisões vigentes

- `Tudo` usa a primeira transação visível ao usuário e nunca o `created_at` da conta;
- sem transações, o mês atual preserva o saldo inicial sem história fictícia;
- personalizado usa datas inclusivas na UI e intervalo semiaberto no domínio;
- granularidade progride de dia a ano, com no máximo 60 anos e 60 buckets;
- drill-down acontece no mesmo painel: ano, trimestre, mês e extrato final;
- históricos longos entregam apenas agregados; lançamentos são buscados somente no mês final.

## Bloqueios e riscos

Nenhum bloqueio duro para o Dia 7 da `003C1`. Migration, Supabase remoto e drill-down permanecem bloqueados até as respectivas fatias.

O `SUPPLY-CHAIN-003` foi resolvido e confirmado pelo workflow remoto `Quality Gates #146` da PR `#30`.

Riscos ativos:

- performance de histórico extenso — ALTO, a validar com pgTAP e `EXPLAIN`;
- complexidade de navegação do painel — MÉDIO, a validar por contratos de estado e acessibilidade;
- mês com volume extremo de lançamentos — MÉDIO, fora do escopo e candidato a hardening próprio.

## Próximo passo

Versionar o Dia 7, atualizar a PR `#30` e validar os checks do novo head. Merge e início da `003C2` exigem comandos próprios.

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

## Validação do Dia 6

- RED dirigido isolou a ausência de foco no campo final vazio, mantendo 28 cenários verdes; GREEN dirigido passou com 2 suítes e 34 testes;
- regressão completa passou com 97 suítes e 669 testes, sem snapshots;
- Preview autenticada do commit `ba12011` foi validada em 320x800, 390x844, 768x900 e 1280x900;
- nenhum viewport apresentou overflow global; inputs, acionador e ações mediram 44 px de altura;
- mobile apresentou bottom sheet com rolagem interna e safe areas; desktop apresentou modal central de 512 px;
- foco inicial, contenção, isolamento do fundo, `Escape` e retorno ao acionador foram confirmados;
- contrastes mínimos dos tokens relevantes ficaram entre 5,12:1 e 17,74:1 no tema claro e entre 6,92:1 e 16,96:1 no escuro;
- ESLint, type-check e build Next.js 16.3.3/Turbopack passaram;
- nenhuma migration, dependência, mutação Supabase, commit, push, merge ou deploy foi executado.

## Validação do Dia 7

- rastreabilidade separa os critérios entregues pela `003C1` das parcelas SQL e de drill-down ainda pendentes;
- revisão local confirmou presentation sem Supabase, telemetria financeira ou segredo e adapter fechado para `quarter/year`;
- registro `day-7-release-readiness.md` documenta gates, segurança, experiência, riscos e decisão;
- pipeline final manteve 97 suítes/669 testes, zero snapshots, ESLint, type-check, build e diff verdes; a primeira tentativa do build falhou somente pelo bloqueio da Geist e passou com rede autorizada;
- `UX-CHART-003C1` está `READY_FOR_RELEASE`; a feature pai permanece `IN_PROGRESS`;
- nenhuma migration, mutação Supabase, merge ou deploy foi executado.
