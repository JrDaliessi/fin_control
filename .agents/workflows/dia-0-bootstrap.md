---
description: Dia 0 — Bootstrap operacional do sistema de engenharia assistida por IA
---

# Dia 0 — Bootstrap Operacional

## Objetivo da Fase
Criar a fundação operacional do projeto, definindo regras, contexto central, arquitetura base, catálogos, workflows e critérios de governança.

## Estado de Entrada
- `BOOTSTRAP_PENDING`

## Estado de Saída
- `FOUNDATION_DEFINED`

## Agents Ativados
- Engineering Conductor Agent
- Context Governance Agent
- Living Documentation Agent
- TDD First Agent
- Quality Gate Agent
- Architecture Agent
- AI Jail Agent
- Infrastructure DevOps Agent

## Skills Ativadas
- read_project_context
- validate_context_completeness
- design_ai_jail_execution_rules
- rewrite_prompt_with_project_rules
- maintain_living_documentation
- generate_project_skeleton
- validate_architecture_compliance

## Entradas Obrigatórias
- Regras gerais do projeto.
- Stack definida ou parcialmente delimitada.
- Visão arquitetural inicial.
- Escopo inicial ou problema descrito.

## Saídas Obrigatórias
- `project-context.md`
- `architecture.md`
- `roadmap.md`
- `backlog.md`
- `quality-gates.md`
- `.agents/workflows/` com arquivos mínimos.
- Estado atualizado para `FOUNDATION_DEFINED`.

## Critérios de Conclusão
- Arquivos obrigatórios existem.
- Workflows mínimos existem e não estão vazios.
- Catálogos de agents e skills existem.
- Política de bloqueio operacional está documentada.
- Próximo passo está definido.

## O que NÃO Pode Acontecer
- Implementar feature final de negócio.
- Criar telas finais de produção.
- Integrar Supabase, Open Finance ou IA funcional.
- Improvisar domínio sem discovery.

## Próximo Passo Recomendado
Executar `dia 1` para contexto, discovery, domínio e arquitetura detalhada.

