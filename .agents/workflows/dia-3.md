---
description: Dia 3 — execução mínima validada
capability: core
load_when: [dia-3, implementation, minimum-validated-execution]
---

# Dia 3 — Minimum Validated Execution

## Objetivo

Produzir o mínimo necessário para satisfazer o contrato da small release.

## Estados

- entrada: `VALIDATION_READY`;
- saída: `IN_PROGRESS` com núcleo GREEN.

## Agents e Skills

Conductor, Context Router, TDD First, XP Pair Programmer e especialistas de domínio/segurança conforme risco. Skills: `implement_to_satisfy_tests`, `validate_architecture_compliance`.

## Context Pack

PRD, spec, testes RED, módulos e dependências afetados, ADRs e schema relacionados.

## Entradas Obrigatórias

Escopo recortado, testes essenciais e Context Pack suficiente.

## Saídas Obrigatórias

Implementação mínima GREEN, regressão dirigida, documentação de estado e riscos.

## Validação e Conclusão

Testes dirigidos ficam verdes, fronteiras são preservadas e nenhuma regressão crítica é introduzida.

## Restrições

Não expandir escopo, iniciar item paralelo ou criar abstração prematura.

## Próximo Passo

Dia 4 após aprovação explícita.
