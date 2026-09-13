# Roadmap técnico — evolução incremental para NestJS

- Estado: direção aprovada; implementação não iniciada
- Tipo: evolução arquitetural incremental
- Fluxo-alvo: `Next.js → API NestJS → PostgreSQL no Supabase`
- Princípio: documentar a realidade antes de mover responsabilidades

## Objetivo

Extrair gradualmente acesso a dados e regras de aplicação para uma API própria em Node.js, NestJS e TypeScript, preservando o produto utilizável, a integridade do banco e a rastreabilidade das decisões.

O PostgreSQL continuará hospedado no Supabase. A presença de uma API não elimina automaticamente RLS, constraints ou validações de banco; a fronteira final de autorização será decidida somente após threat model e spike autenticado.

## O que não será feito

- conversão automática ou reescrita integral do projeto;
- duplicação indiscriminada das regras entre Next.js e NestJS;
- mudança de banco apenas para justificar a nova API;
- desativação de RLS sem decisão e evidência de segurança equivalentes;
- criação de endpoints antes de contratos, critérios de aceite e testes;
- migração simultânea de todas as features.

## Etapa 0 — baseline verificável

Antes do primeiro endpoint:

1. inventariar entidades, colunas e tipos;
2. mapear PKs, FKs, constraints, índices e policies RLS;
3. localizar regras de domínio, casos de uso e adapters atuais;
4. registrar fluxos de autenticação e autorização;
5. relacionar migrations e testes que protegem cada comportamento;
6. medir consultas representativas e identificar riscos reais;
7. separar fato observado, dívida existente e proposta futura.

**Saída esperada:** modelo atual revisado, mapa de dependências, riscos, decisões abertas e critérios para escolher o primeiro recorte vertical.

## Etapa 1 — contrato da API

- definir recursos e casos de uso, não apenas tabelas;
- especificar DTOs e erros públicos;
- produzir OpenAPI/Swagger como contrato verificável;
- definir versionamento e compatibilidade;
- modelar identidade, autorização e propagação de contexto;
- estabelecer logs, correlação, métricas e tratamento de erros;
- criar matriz de testes antes da implementação.

**Gate:** nenhum endpoint de produção antes de contrato aprovado e testes essenciais em RED.

## Etapa 2 — primeiro recorte vertical

Selecionar uma capacidade pequena e de leitura, com baixo risco e valor demonstrável. O recorte deve atravessar:

```text
rota Next.js → cliente HTTP tipado → controller NestJS
→ application → domain/ports → adapter PostgreSQL → resposta validada
```

Critérios para o primeiro recorte:

- responsabilidade e fronteiras conhecidas;
- equivalência de comportamento mensurável;
- rollback simples para o adapter anterior;
- autenticação e autorização testáveis;
- nenhum acoplamento com telas não relacionadas.

## Etapa 3 — coexistência controlada

- manter adapters antigo e novo atrás do mesmo contrato quando necessário;
- migrar uma feature por vez;
- comparar resultado, latência e erros;
- impedir dupla escrita sem estratégia explícita;
- remover o caminho antigo somente após equivalência e observabilidade.

## Etapa 4 — expansão e consolidação

- transferir casos de uso priorizados por valor e risco;
- consolidar módulos NestJS por domínio;
- reforçar validação, segurança, rate limiting e observabilidade;
- publicar documentação OpenAPI versionada;
- revisar fronteiras que permanecerem no Next.js;
- registrar custos operacionais e trade-offs observados.

## Decisões ainda abertas

| Decisão | Evidência necessária |
| --- | --- |
| Validação de JWT no NestJS | contrato atual do Supabase Auth, rotação de chaves e threat model |
| Conexão direta ou adapter Supabase | privilégios, RLS, pool, latência e operação na Vercel |
| Hospedagem da API | requisitos de runtime, cold start, região, custo e observabilidade |
| Estratégia de monorepo | dependências compartilhadas, pipeline e autonomia de deploy |
| Primeiro recorte vertical | mapa do domínio, risco e capacidade de rollback |
| Versionamento de API | consumidores, compatibilidade e estratégia de evolução |

Esses itens não serão resolvidos por preferência de tecnologia. Cada decisão exigirá opções, trade-offs, evidência e registro arquitetural.

## Evidências que o case pretende produzir

- diagrama do modelo atual e proposto;
- catálogo de constraints, índices e policies relevantes;
- ADRs das decisões de extração;
- especificação OpenAPI;
- testes unitários, integração e contrato;
- migrations e rollback reproduzíveis;
- comparação de consultas e latência quando aplicável;
- estratégia de autenticação/autorização;
- registros de observabilidade e incidentes simulados;
- release notes de cada migração vertical.

## Definição de sucesso

A evolução será bem-sucedida quando uma capacidade puder atravessar a nova API com comportamento equivalente, autorização validada, observabilidade mínima, rollback conhecido e documentação suficiente para explicar as decisões — sem interromper o funcionamento do FinControl.

## Rastreabilidade

- direção humana: anúncio inicial da evolução do FinControl;
- arquitetura vigente: [`../../architecture.md`](../../architecture.md);
- stack vigente: [`../../project-stack.md`](../../project-stack.md);
- decisão proposta: [`../../adr/0023-incremental-nestjs-api-extraction.md`](../../adr/0023-incremental-nestjs-api-extraction.md);
- priorização futura: [`../../roadmap.md`](../../roadmap.md) e [`../../backlog.md`](../../backlog.md).
