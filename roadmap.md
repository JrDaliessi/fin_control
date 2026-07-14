# Roadmap

## Direção do Produto
Construir um copiloto financeiro brasileiro com IA, começando por controle financeiro manual/importado e evoluindo para automação via Open Finance.

## Marco 0 — Fundação Operacional
Status: concluído no Dia 0.

Entregas:
- contexto central
- arquitetura base
- backlog inicial
- quality gates
- workflows e catálogos de agents/skills

## Marco 1 — Discovery e Domínio
Fase: Dia 1
Status: concluído.

Entregas:
- visão de produto refinada
- módulos iniciais
- contratos entre camadas
- estrutura de pastas aprovada
- backlog refinado em small releases

Resultado:
- primeira small release funcional selecionada: cadastro manual de transação simples
- módulos do MVP definidos
- contratos iniciais entre camadas mapeados
- dependências críticas identificadas

## Marco 2 — Estratégia de Testes
Fase: Dia 2
Status: concluído.

Entregas:
- matriz de testes
- cenários felizes e críticos
- testes iniciais da primeira small release

Ordem planejada:
- preparar setup técnico mínimo para permitir testes
- criar testes de domínio de transação
- criar testes de aplicação do caso de uso de criação de transação
- documentar matriz de testes por camada

Resultado:
- setup técnico mínimo criado
- matriz de testes documentada em `test-strategy.md`
- testes essenciais de transação criados
- testes falhando por implementação ausente, conforme TDD

## Marco 3 — Primeira Small Release Funcional
Fases: Dia 3 e Dia 4
Status: concluído para o recorte inicial.

Candidatas:
- cadastro manual de transação simples
- dashboard financeiro inicial
- cadastro de conta financeira
- simulação básica de compra parcelada

Ordem recomendada:
1. cadastro manual de transação simples
2. expansão controlada da transação manual
3. resumo mensal básico
4. cadastro de conta financeira
5. dashboard financeiro inicial
6. compra parcelada no cartão

Resultado parcial:
- Dia 3 implementou `Transaction`, `TransactionRepository` e `CreateTransactionUseCase`.
- Testes, type-check, lint, audit e build passaram.
- Dia 4 implementou apresentação inicial da transação manual, estados de interação e rota inicial.
- Testes, type-check, lint, audit e build passaram.

Resultado final do ciclo:
- Dia 5 revisou estrutura, consistência interna e riscos.
- Dia 6 refinou experiência, acessibilidade e PWA.
- Dia 7 validou testes, lint, type-check, audit, build, segurança básica e release incremental.

Próxima small release selecionada:
- `SR-005 — Resumo mensal básico`
- Entrada recomendada: Dia 2 para criar testes essenciais antes da implementação.
- Banco de dados real e migrations permanecem fora deste recorte.

## Marco 4 — Hardening e Experiência
Fases: Dia 5 e Dia 6

Status: concluído para a primeira small release.

Entregas:
- refatoração orientada por testes
- consistência visual
- acessibilidade mínima
- PWA inicial

## Marco 5 — Release Incremental
Fase: Dia 7

Status: concluído para a primeira small release.

Entregas:
- lint verde
- type-check verde
- testes verdes
- build verde
- revisão básica de segurança
- baseline de observabilidade

## Marco 6 — Resumo Mensal Básico
Fases: Dia 2 a Dia 7

Status: concluído. SR-005 entregue com pipeline verde.

Entregas:
- testes essenciais do resumo mensal concluídos
- caso de uso `list-monthly-summary.use-case.ts` implementado
- cálculo de receitas, despesas e saldo líquido em centavos implementado
- exposição visual do resumo mensal criada
- responsabilidades internas refinadas no Dia 5
- UX, acessibilidade e PWA revisados no Dia 6
- quality gates finais validados no Dia 7

Fora do marco:
- Supabase Database
- migrations
- autenticação real
- dashboard completo

## Marco 7 — Dashboard Financeiro Inicial
Fases: Dia 1 a Dia 7 (ciclo atual)

Status: concluído. SR-006 validada com pipeline verde, revisão de segurança, baseline de observabilidade e CI versionado.

Small release: SR-006

Entregas planejadas:
- caso de uso `GetDashboardSummaryUseCase` testado
- painel de resumo mensal reutilizando caso de uso existente
- lista resumida de transações recentes
- empty state com call-to-action
- rotas `/` (dashboard) e `/transactions` (registro)
- navegação mínima entre telas
- `formatCents` compartilhado em `src/shared/utils/`

Próximo passo:
- Dia 1 da SR-007 concluído com domínio, regras e contratos definidos
- executar `dia 2` para criar os testes essenciais antes da implementação
- manter analytics avancados bloqueados ate a fundacao de dados reais

## Marco 8 - Fundacao de Dados Reais

Ordem: SR-007 conta local, SR-008 autenticacao, SR-009 contas com RLS, SR-010 categorias com RLS e SR-011 transacoes com RLS.

Estado atual: Dia 7 da SR-008 concluído em `READY_FOR_RELEASE`, com 33 suítes e 153 testes verdes; segurança, observabilidade, reprodutibilidade do runtime e build de produção validados.

Evidência da SR-007: pipeline final verde com 21 suítes e 110 testes, cadastro local acessível e nenhuma persistência real antecipada.

Recorte da SR-007: domínio, contrato e cadastro local de conta financeira, sem Supabase Database, migrations, autenticação ou RLS.

Recorte da SR-008: login por e-mail/senha, logout, identidade validada no servidor, Proxy do Next.js 16 e proteção de rotas privadas; cadastro, recuperação, OAuth, MFA, banco financeiro e RLS permanecem fora.

Próximo passo: iniciar um novo ciclo pelo Dia 1 da SR-009 para discovery de persistência e RLS de contas; migrations e políticas permanecem proibidas até aprovação explícita dessa fase.

Saida: dados isolados por usuario e prontos para consultas por periodo.

## Marco 9 - Periodos e Evolucao

Ordem: SR-012 periodos, SR-013 agregacao/tabela acessivel, SP-001 biblioteca de graficos e SR-014 grafico de linha.

## Marco 10 - Candles Financeiros

SR-015 entrega OHLC de saldo, intervalos vazios, tooltip acessivel, volume e seletor Linha/Candles, sem recursos de trading.

## Marco 11 - Distribuicao de Frequencia

SR-016 entrega algoritmo continuo, tabela, FI, FR, percentuais, acumuladas e medidas agrupadas. SR-017 adiciona histograma, toggle, filtros e comparacao. O metodo inicial usa `k = ceil(sqrt(n))`.

## Marco 12 - Metas e Gamificacao

Ordem: SR-018 metas/contribuicoes, SR-019 progresso/projecao, SR-020 eventos/pontos/conquistas, SR-021 desafios/sequencias e SR-022 desafios opcionais baseados em frequencia.

## Marco 13 - Insights de IA

SR-023 entra somente com calculos deterministas, consentimento, minimizacao e politica de privacidade.

## Cadencia

Cada SR executa, sem salto, Dias 1 a 7. Nenhum marco autoriza implementacao one-shot ou varias SRs simultaneas.
