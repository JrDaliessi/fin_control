# ADR 0023 — Extração incremental para uma API NestJS

- Status: Aprovado como direção; discovery técnico pendente
- Data: 2026-09-12
- Capability: software / product / content
- Depende de: arquitetura Feature-Based atual, contratos de domínio e modelo PostgreSQL vigente
- Afeta futuramente: aplicação Next.js, autenticação, infraestrutura, deploy e observabilidade

## Contexto

O FinControl já possui uma aplicação Next.js organizada por features, regras de domínio isoladas, adapters Supabase, autenticação, migrations e testes automatizados. A próxima etapa profissional pretende demonstrar também projeto de APIs, NestJS, OpenAPI e evolução arquitetural.

Uma conversão automática do acesso Supabase para NestJS esconderia as decisões mais relevantes e criaria risco de reescrita, duplicação de regras e regressão de autorização. O modelo existente precisa ser compreendido antes da definição da arquitetura de destino.

## Decisão

Adotar como direção arquitetural uma extração incremental no fluxo:

```text
Next.js → API NestJS → PostgreSQL hospedado no Supabase
```

A decisão autoriza o discovery e o planejamento, não a implementação imediata de um backend completo.

Antes do primeiro endpoint, será produzido um baseline do estado real: entidades, relacionamentos, PKs, FKs, constraints, índices, RLS, grants, regras de negócio, casos de uso, queries e testes.

Depois do baseline, a extração ocorrerá por recortes verticais pequenos. Cada recorte deve preservar um contrato interno, possuir testes de equivalência, autorização validada, observabilidade mínima e rollback para o caminho anterior.

O PostgreSQL permanece no Supabase. A estratégia final para Auth, validação de JWT, conexão, pool e relação entre API e RLS será escolhida após discovery e threat model específicos.

## Alternativas consideradas

### Manter toda a camada server-side no Next.js

É a opção de menor complexidade operacional e continua válida para o produto atual. Não atende, isoladamente, ao objetivo de estudar e demonstrar uma API NestJS independente.

### Reescrever o backend integralmente em NestJS

Rejeitada por ampliar risco, tempo de feedback e possibilidade de divergência. Uma reescrita também enfraqueceria a comparação verificável entre o comportamento atual e o novo.

### Colocar NestJS apenas como proxy do Supabase

Rejeitada como objetivo arquitetural. Uma camada sem responsabilidade clara adicionaria latência e operação sem deslocar regras ou melhorar contratos.

### Trocar também o provedor PostgreSQL

Fora do escopo. Não existe necessidade demonstrada de migrar os dados para outro provedor apenas para adotar NestJS.

## Consequências positivas

- o aplicativo pode continuar funcionando durante a evolução;
- cada mudança gera evidência comparável e comunicável;
- contratos atuais facilitam substituir adapters sem mover regras de domínio;
- OpenAPI, testes de contrato e observabilidade passam a ser entregáveis explícitos;
- decisões de dados e segurança permanecem documentadas.

## Custos e riscos

- coexistência temporária de dois caminhos server-side;
- nova superfície de autenticação, autorização e observabilidade;
- possível latência adicional e complexidade de deploy;
- risco de regras duplicadas se as fronteiras não forem respeitadas;
- decisões de conexão/RLS não podem ser antecipadas sem threat model;
- pipeline e operação poderão exigir estrutura de monorepo ou serviços separados.

## Gates antes da implementação

- baseline do modelo e dos fluxos atuais aprovado;
- primeiro recorte vertical selecionado por valor e risco;
- contrato OpenAPI e erros públicos definidos;
- estratégia de Auth/autorização registrada;
- testes essenciais escritos antes da implementação;
- deploy, observabilidade e rollback planejados;
- decisão humana sobre toolchain e hospedagem.

## Validação

A direção é considerada bem aplicada quando a primeira capacidade migrada mantém equivalência funcional, autorização e isolamento, possui testes automatizados, pode retornar ao adapter anterior e não exige interromper o funcionamento do aplicativo.

O plano incremental está detalhado em [`../docs/showcase/backend-evolution-roadmap.md`](../docs/showcase/backend-evolution-roadmap.md).
