---
description: Dia 2 — estratégia de validação e testes RED
capability: core
load_when: [dia-2, validation-strategy, tdd]
---

# Dia 2 — Validation Strategy

## Objetivo

Converter requisitos aprovados em contrato de validação antes da produção relevante.

## Estados

- entrada: `REQUIREMENTS_READY`/`SPEC_READY`;
- saída: `VALIDATION_READY` (`TEST_STRATEGY_READY` em software).

## Agents e Skills

Conductor, Context Router, Quality Gate e TDD First em software. Skills: `derive_test_scenarios_from_requirement`, `generate_tests_first`, `run_quality_gate_checklist`.

## Context Pack

Feature PRD, spec, arquitetura, código/testes afetados, schema/migrations quando aplicável e quality gates.

## Entradas Obrigatórias

Requisitos aprovados, critérios de aceite e small release prioritária.

## Saídas Obrigatórias

Matriz requisito-teste, cenários, fixtures, estratégia de regressão e testes RED essenciais em software.

## Validação e Conclusão

Cada critério crítico possui validação; RED falha pela razão correta e não por infraestrutura quebrada.

## Restrições

Não implementar comportamento funcional relevante nem enfraquecer testes existentes.

## Próximo Passo

Dia 3 após aprovação explícita.
