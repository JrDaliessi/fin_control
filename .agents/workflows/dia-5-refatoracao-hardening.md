---
description: Dia 5 — Refatoração, consistência e hardening interno
---

# Dia 5 — Refatoração, Consistência e Hardening Interno

## Objetivo da Fase
Melhorar qualidade estrutural, remover duplicação, reduzir acoplamento e fortalecer consistência de domínio, interface e dados.

## Estado de Entrada
- `IMPLEMENTATION_IN_PROGRESS`

## Estado de Saída
- `REFACTORING_IN_PROGRESS` durante execução, retornando ao fluxo estável após validação

## Agents Ativados
- Engineering Conductor Agent
- Context Governance Agent
- Living Documentation Agent
- TDD First Agent
- Quality Gate Agent
- Refactoring Agent
- Design System Agent
- Data Integrity Agent
- Performance Agent sob demanda

## Skills Ativadas
- read_project_context
- detect_monolithic_files
- generate_refactoring_plan
- refactor_preserving_behavior
- identify_performance_bottlenecks
- validate_data_integrity_rules
- enforce_design_system_consistency

## Entradas Obrigatórias
- Implementação mínima funcional concluída.
- Testes existentes como rede de segurança.

## Saídas Obrigatórias
- Arquivos inchados identificados.
- Plano de refatoração incremental.
- Melhorias estruturais aplicadas.
- Consistência visual reforçada.
- Integridade de dados revisada.

## Critérios de Conclusão
- Código mais legível.
- Menor duplicação.
- Fronteiras entre camadas mais claras.
- Sem quebra de comportamento existente.

## O que NÃO Pode Acontecer
- Refatorar sem testes mínimos.
- Reescrever massivamente sem necessidade.
- Misturar refatoração ampla com nova regra de negócio.

## Próximo Passo Recomendado
Executar `dia 6` para UX, acessibilidade e PWA.

