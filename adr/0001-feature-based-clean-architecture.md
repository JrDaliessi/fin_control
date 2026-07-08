# ADR 0001 — Feature-Based + Clean Architecture Leve

## Status
Aceita no Dia 1.

## Contexto
O produto será um aplicativo financeiro pessoal com dados sensíveis, regras de negócio progressivamente complexas e integrações futuras com Supabase, IA e Open Finance.

Uma arquitetura por tipo técnico ou uma organização plana tenderia a acoplar UI, regras financeiras e infraestrutura. Uma Clean Architecture rígida demais adicionaria custo antes da necessidade real.

## Decisão
Usar Feature-Based + Clean Architecture leve.

Cada feature deve conter, conforme necessidade:
- `presentation`
- `application`
- `domain`
- `infrastructure`
- `tests`

O Next.js App Router fica como camada de entrada e composição, não como local de regra de negócio.

## Consequências
Positivas:
- regras financeiras ficam testáveis
- UI não acessa Supabase diretamente
- integrações futuras podem ser isoladas
- features crescem com fronteiras claras

Custos:
- exige disciplina de organização desde o começo
- pequenos fluxos podem parecer mais verbosos
- contratos precisam ser mantidos atualizados

## Alternativas Consideradas
- Arquitetura por tipo técnico: rejeitada por aumentar acoplamento entre domínios.
- Clean Architecture rígida: rejeitada por risco de over-engineering no MVP.
- Feature única `finance`: rejeitada para evitar arquivo e módulo inchado.

## Data
2026-07-08

