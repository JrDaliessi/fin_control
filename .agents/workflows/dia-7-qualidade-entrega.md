---
description: Dia 7 — Qualidade final, segurança, observabilidade e entrega
---

# Dia 7 — Qualidade Final, Segurança, Observabilidade e Entrega

## Objetivo da Fase
Validar que o projeto está pronto para entrega incremental com qualidade, segurança, monitorabilidade e disciplina de release.

## Estado de Entrada
- Projeto apto a entrar em `QUALITY_VALIDATION`

## Estado de Saída
- `READY_FOR_RELEASE` ou `BLOCKED`

## Agents Ativados
- Engineering Conductor Agent
- Context Governance Agent
- Living Documentation Agent
- TDD First Agent
- Quality Gate Agent
- Application Security Agent
- Observability Agent
- Infrastructure DevOps Agent
- Deployment Agent
- Product Analytics Agent sob demanda

## Skills Ativadas
- read_project_context
- run_quality_gate_checklist
- prepare_production_release
- review_application_security
- perform_threat_modeling
- define_observability_baseline
- design_environment_strategy
- define_product_analytics_events

## Entradas Obrigatórias
- Feature implementada e refinada.
- Testes relevantes existentes.
- Estrutura arquitetural preservada.
- Projeto apto a quality validation.

## Saídas Obrigatórias
- Lint validado e documentado.
- Type-check validado e documentado.
- Testes validados e documentados.
- Build validado e documentado.
- Revisão básica de segurança.
- Baseline de observabilidade.
- Preparação de release incremental.

## Critérios de Conclusão
- Pipeline verde.
- Riscos críticos tratados ou documentados.
- Base pronta para entrega incremental.
- Governança preservada.

## O que NÃO Pode Acontecer
- Liberar entrega sem pipeline verde.
- Ignorar falhas críticas de segurança.
- Mascarar dívida técnica crítica.
- Fazer deploy com pendência estrutural crítica não documentada.

## Próximo Passo Recomendado
Publicar ou preparar a próxima small release conforme backlog.

