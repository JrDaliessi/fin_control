---
description: Dia 2 — Estratégia de testes e fundação TDD
---

# Dia 2 — Estratégia de Testes e Fundação TDD

## Objetivo da Fase
Transformar requisitos e regras de negócio em cenários testáveis antes de qualquer implementação funcional relevante.

## Estado de Entrada
- `CONTEXT_READY` ou `ARCHITECTURE_READY`

## Estado de Saída
- `TEST_STRATEGY_READY`

## Agents Ativados
- Engineering Conductor Agent
- Context Governance Agent
- Living Documentation Agent
- TDD First Agent
- Quality Gate Agent
- Domain Modeling Agent
- QA Strategy Agent
- Frontend Testing Agent

## Skills Ativadas
- read_project_context
- validate_context_completeness
- derive_test_scenarios_from_requirement
- generate_tests_first
- generate_frontend_test_scenarios
- define_test_strategy_matrix
- generate_test_fixtures
- maintain_living_documentation

## Entradas Obrigatórias
- Dia 1 concluído.
- Domínio inicial descrito.
- Casos de uso iniciais definidos.
- Feature inicial priorizada.

## Saídas Obrigatórias
- Matriz de testes por camada.
- Cenários felizes documentados.
- Cenários alternativos documentados.
- Edge cases principais documentados.
- Testes iniciais do domínio.
- Testes iniciais da aplicação.
- Testes relevantes de frontend quando aplicável.

## Critérios de Conclusão
- Cobertura inicial existe para a feature prioritária.
- Cenários críticos foram explicitados.
- Não há fluxo importante sem teste essencial.

## O que NÃO Pode Acontecer
- Implementação funcional antes dos testes essenciais.
- Construção de UI final como ponto de partida.
- Alteração de escopo sem replanejamento.

## Próximo Passo Recomendado
Executar `dia 3` para implementação mínima orientada por teste.

