---
description: Dia 5 — refinamento, refatoração e hardening
capability: core
load_when: [dia-5, refactoring, hardening]
---

# Dia 5 — Refinement, Refactoring e Hardening

## Objetivo

Melhorar estrutura, integridade e manutenção preservando comportamento aprovado.

## Estados

- entrada: entrega funcional com rede de validação;
- saída: `HARDENING` concluído e comportamento preservado.

## Agents e Skills

Conductor, Context Router, Refactoring, Quality Gate e Security quando aplicável. Skills: `refactor_preserving_behavior`, `detect_overengineering`, `validate_architecture_compliance`.

## Context Pack

Código/artefato atual, testes, dependências, dívida relevante, arquitetura e performance observada.

## Entradas Obrigatórias

Baseline verde e problema estrutural demonstrável.

## Saídas Obrigatórias

Refatoração mínima justificada, regressão verde, dívida e risco atualizados.

## Validação e Conclusão

Comportamento permanece equivalente; complexidade e acoplamento não aumentam sem justificativa.

## Restrições

Não refatorar sem validação, reescrever por preferência ou introduzir requisito novo.

## Próximo Passo

Dia 6 após aprovação explícita.
