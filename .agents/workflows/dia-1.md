---
description: Dia 1 — discovery, requisitos e especificação da entrega
capability: core
load_when: [dia-1, discovery, requirements, specification]
---

# Dia 1 — Discovery, Requirements e Specification

## Objetivo

Definir WHAT, WHY e, quando necessário, HOW da entrega antes da implementação.

## Estados

- entrada: projeto `FOUNDATION_READY`/`OPERATING` e artefato `DISCOVERY`;
- saída: `REQUIREMENTS_READY` ou `SPEC_READY`.

## Agents e Skills

Conductor, Context Router, Product Requirements e especialistas mínimos de arquitetura/domínio. Skills: `create_feature_prd`, `validate_feature_prd`, `derive_feature_spec`, `slice_into_small_releases`.

## Context Pack

Brief, PRD, backlog, arquitetura, ADRs e dependências diretamente relacionadas.

## Entradas Obrigatórias

Problema, usuário, valor, escopo, regras, riscos, dependências e decisão humana sobre requisitos centrais.

## Saídas Obrigatórias

Feature PRD, spec quando aplicável, contexto do artefato, status e recorte de small releases com IDs rastreáveis.

## Validação e Conclusão

Requisitos são testáveis, critérios de aceite completos, conflitos resolvidos e aprovação `REQUIREMENTS_APPROVED` registrada.

## Restrições

Não implementar a feature, integrar serviço, modelar requisito não aprovado ou iniciar item paralelo.

## Próximo Passo

Dia 2 após aprovação explícita.
