---
description: Dia 1 — Contexto, discovery e arquitetura
---

# Dia 1 — Contexto, Discovery e Arquitetura

## Objetivo da Fase
Definir produto, escopo inicial, domínio principal, arquitetura detalhada, módulos e contratos antes da implementação funcional.

## Estado de Entrada
- `FOUNDATION_DEFINED`

## Estado de Saída
- `CONTEXT_READY` ou `ARCHITECTURE_READY`

## Agents Ativados
- Engineering Conductor Agent
- Context Governance Agent
- Living Documentation Agent
- TDD First Agent
- Quality Gate Agent
- Product Discovery Agent
- Domain Modeling Agent
- Architecture Agent
- Frontend Architecture Agent
- Database Architecture Agent

## Skills Ativadas
- read_project_context
- validate_context_completeness
- refine_product_requirement
- prioritize_feature_scope
- model_business_domain
- define_use_cases
- design_frontend_structure
- design_database_schema
- define_module_contracts
- maintain_living_documentation

## Entradas Obrigatórias
- Dia 0 concluído.
- `project-context.md` existente.
- Stack e arquitetura base registradas.

## Saídas Obrigatórias
- Visão do produto refinada.
- Objetivo do sistema documentado.
- Escopo inicial validado.
- Backlog inicial estruturado.
- Módulos/features iniciais definidos.
- Regras de negócio principais.
- Contratos entre camadas.
- Estrutura de pastas aprovada.
- Contexto central atualizado.

## Critérios de Conclusão
- Domínio minimamente descrito.
- Backlog fatiado em small releases.
- Arquitetura inicial validada.
- Dependências críticas mapeadas.

## O que NÃO Pode Acontecer
- Criar feature completa sem testes.
- Implementar interface impulsiva.
- Integrar serviços externos prematuramente.
- Modelar domínio fora do contexto aprovado.

## Próximo Passo Recomendado
Executar `dia 2` para estratégia de testes e TDD.

