# Content Spec — LINKEDIN-001

## Requisitos cobertos

`LNK001-RQ-001` a `LNK001-RQ-010` e `LNK001-AC-001` a `LNK001-AC-010`.

## Arquitetura editorial

```text
release / ADR / gate
→ evidence-base claim
→ post sources
→ post brief
→ validation checklist
→ draft
→ factual and privacy review
→ final
→ explicit human approval
→ optional publication
```

## Estrutura de arquivos

```text
docs/linkedin/
├── positioning.md
├── audience.md
├── evidence-base.md
├── content-pillars.md
├── content-calendar.md
├── LINKEDIN-001/
│   ├── brief.md
│   ├── feature-prd.md
│   ├── content-spec.md
│   ├── validation-strategy.md
│   ├── context.yaml
│   └── status.md
└── posts/LI-POST-NNN/
    ├── brief.md
    ├── sources.md
    ├── draft.md
    └── final.md
```

`draft.md` começa no Dia 3. `final.md` somente após refinamento e revisão. Nenhum arquivo equivale a publicação autorizada.

## Contrato de claim

Cada afirmação verificável deve possuir:

- `evidence_id` existente em `evidence-base.md`;
- fonte primária versionada;
- recorte temporal ou commit quando aplicável;
- limite que impeça extrapolação;
- estado `approved`, `stale` ou `blocked` na revisão do post.

## Estrutura padrão do brief

1. objetivo;
2. público principal;
3. problema e tensão narrativa;
4. mensagem central;
5. evidências permitidas;
6. claims proibidos;
7. estrutura sugerida;
8. CTA;
9. dependências e riscos;
10. critérios de aceite.

## Estrutura sugerida do post

- gancho específico, sem clickbait;
- contexto do problema;
- decisão e trade-off;
- evidência da implementação e validação;
- aprendizado transferível;
- limite ou próximo passo;
- CTA opcional e genuíno.

## Formato do canal

- português do Brasil;
- parágrafos curtos para leitura móvel;
- listas somente quando facilitarem a compreensão;
- emojis opcionais e moderados;
- hashtags somente se relevantes, definidas na revisão final;
- links e imagens avaliados por post, com texto alternativo quando aplicável.

## Segurança e privacidade

- remover e-mails, senhas, tokens, UUIDs, dados financeiros e URLs privadas;
- não expor detalhes que facilitem abuso da autenticação ou da conta demo;
- não usar screenshots antes de revisar dados visíveis, notificações e metadados;
- não afirmar segurança absoluta; comunicar controles e riscos residuais.

## Estados

```text
IDEA → DISCOVERY → READY → IN_PROGRESS → DONE
                         ↘ BLOCKED
```

`DONE` significa texto final aprovado internamente. Publicação é uma ação externa separada.

## Validação

O Dia 2 materializou `validation-strategy.md`, `rubrics.md` e `validation-fixtures.md`, além da matriz de claims e do gate pré-draft do `LI-POST-002`. Dias 3–7 só podem avançar preservando esse contrato.

## Release e rollback

- artefatos editoriais são versionados em Git;
- uma versão incorreta pode ser revertida no repositório;
- conteúdo já publicado não é revertido por Git e exige correção externa explicitamente autorizada;
- por isso, publicação permanece bloqueada até o gate final e aprovação humana.
