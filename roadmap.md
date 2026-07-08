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

Entregas:
- matriz de testes
- cenários felizes e críticos
- testes iniciais da primeira small release

Ordem planejada:
- preparar setup técnico mínimo para permitir testes
- criar testes de domínio de transação
- criar testes de aplicação do caso de uso de criação de transação
- documentar matriz de testes por camada

## Marco 3 — Primeira Small Release Funcional
Fases: Dia 3 e Dia 4

Candidatas:
- cadastro manual de transação simples
- dashboard financeiro inicial
- cadastro de conta financeira
- simulação básica de compra parcelada

Ordem recomendada:
1. cadastro manual de transação simples
2. resumo mensal básico
3. cadastro de conta financeira
4. dashboard financeiro inicial
5. compra parcelada no cartão

## Marco 4 — Hardening e Experiência
Fases: Dia 5 e Dia 6

Entregas:
- refatoração orientada por testes
- consistência visual
- acessibilidade mínima
- PWA inicial

## Marco 5 — Release Incremental
Fase: Dia 7

Entregas:
- lint verde
- type-check verde
- testes verdes
- build verde
- revisão básica de segurança
- baseline de observabilidade
