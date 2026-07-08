# Architecture

## Decisão Base
O projeto usa Feature-Based + Clean Architecture leve sobre Next.js App Router.

## Justificativa
Essa arquitetura permite crescimento por domínio sem criar rigidez excessiva. Ela separa interface, regras de aplicação, domínio e infraestrutura, mantendo o projeto testável e evolutivo.

## Camadas

### presentation
Responsável por componentes React, hooks de UI, formulários, estados visuais e composição da experiência.

Não pode:
- acessar Supabase diretamente
- conter regra de negócio pesada
- orquestrar fluxo complexo de aplicação

### application
Responsável por casos de uso e coordenação entre domínio e infraestrutura.

Deve:
- ser testável sem interface
- depender de contratos claros
- concentrar regras de aplicação

### domain
Responsável por entidades, tipos, schemas, contratos e regras puras.

Não pode depender de:
- React
- Next.js
- Supabase
- APIs externas

### infrastructure
Responsável por Supabase, repositórios, adapters, services externos e persistência.

Deve:
- implementar contratos necessários
- isolar detalhes técnicos
- proteger a UI de acoplamento com banco e APIs

## Next.js App Router
`src/app` será usado como camada de entrada:
- rotas
- layouts
- page.tsx
- route groups

A lógica real deve ficar em `src/features`.

## Supabase
Supabase será usado para autenticação, banco de dados e storage quando necessário.

Regras:
- clients separados para browser e server
- acesso isolado em `src/lib/supabase` e `infrastructure`
- RLS obrigatório antes de manipular dados financeiros reais

## PWA
O projeto deve ter:
- manifest
- ícones
- mobile first
- instalabilidade
- estratégia offline definida de forma realista

## IA
A IA deve atuar como análise e recomendação:
- categorizar transações
- explicar gastos
- detectar anomalias
- sugerir economia
- simular compras

Ela não deve executar ação financeira sensível sem confirmação do usuário.

## ADRs
Decisões arquiteturais relevantes devem ser registradas em `adr/`.

