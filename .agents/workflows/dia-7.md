---
description: Dia 7 — qualidade, segurança, entrega e compactação
capability: core
load_when: [dia-7, quality, release]
---

# Dia 7 — Quality, Safety, Delivery e Context Finalization

## Objetivo

Executar gates finais, registrar a entrega e compactar o contexto.

## Estados

- entrada: `QUALITY_VALIDATION`;
- saída: `READY_FOR_RELEASE`, `RELEASED` ou `BLOCKED`.

## Agents e Skills

Conductor, Context Router, Quality Gate, Living Documentation e especialistas de segurança/observabilidade conforme risco. Skills: `run_quality_gate_checklist`, `prepare_production_release`, `archive_completed_cycle`, `compact_project_context`.

## Context Pack

PRD, spec, validações, código/artefato final, riscos, dívida, release anterior e contratos de deploy/rollback.

## Entradas Obrigatórias

Artefato refinado, validações relevantes e riscos críticos resolvidos ou bloqueando formalmente.

## Saídas Obrigatórias

Core Gate e gates especializados, release record, rastreabilidade, backlog/estado atualizados, histórico arquivado e próximo passo.

## Validação e Conclusão

Objetivo e critérios são satisfeitos, pipeline obrigatório está verde e nenhuma falha crítica é mascarada.

## Restrições

Não liberar na confiança, ignorar risco crítico, fazer deploy/merge sem autorização ou manter regra vigente somente no histórico.

## Próximo Passo

Versionar e submeter a entrega; iniciar novo ciclo somente mediante comando explícito.
