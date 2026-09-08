---
description: Dia 0 — discovery e fundação adaptativa do projeto
capability: core
load_when: [dia-0, bootstrap, governance-migration]
---

# Dia 0 — Adaptive Engineering Bootstrap

## Objetivo

Classificar o projeto e materializar somente a governança, capabilities e toolchain necessárias.

## Estados

- entrada: `BOOTSTRAP_PENDING` ou migração de governança explicitamente aprovada;
- saída: `FOUNDATION_READY` ou `OPERATING` com fundação atualizada.

## Agents e Skills

Conductor, Context Router, Project Discovery, Living Documentation e Quality Gate. Skills: `classify_project_type`, `identify_deliverables`, `select_capabilities`, `compare_technology_options`, `maintain_living_documentation`.

## Context Pack

Intenção, regras-mestre, repositório existente e decisões previamente aprovadas.

## Entradas Obrigatórias

Objetivo, problema, público, entregáveis, critérios de sucesso, restrições e aprovação da fase.

## Saídas Obrigatórias

`project-brief.md`, `project-type.yaml`, `project-context.md`, `context-map.yaml`, `capability-registry.yaml`, backlog, roadmap, gates, registry e workflows. Stack/toolchain somente quando aplicáveis.

## Validação e Conclusão

Arquivos existem, não estão vazios, YAML é válido, registries estão sincronizados, contexto está dentro do budget ou justificado e próximo passo está definido.

## Restrições

Não implementar entrega final, escolher stack silenciosamente, ativar capabilities irrelevantes ou apagar histórico.

## Próximo Passo

Dia 1 mediante comando ou aprovação humana explícita.
