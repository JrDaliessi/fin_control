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
Fases: próximo ciclo Dia 2, Dia 3 e Dia 4

Status: selecionado.

Entregas planejadas:
- testes essenciais do resumo mensal
- caso de uso `list-monthly-summary.use-case.ts`
- cálculo de receitas, despesas e saldo líquido em centavos
- integração visual mínima apenas depois dos testes e da implementação estável

Fora do marco:
- Supabase Database
- migrations
- autenticação real
- dashboard completo
