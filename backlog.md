# Backlog

## READY

### SR-001 — Setup técnico mínimo executável
- Tipo: Hardening
- Descrição: Criar base Next.js, TypeScript, Tailwind, Jest, Testing Library, Supabase clients e PWA mínimo para permitir testes e implementação incremental.
- Objetivo de negócio: habilitar desenvolvimento validável do MVP.
- Valor esperado: permitir TDD real antes de código funcional.
- Prioridade: Alta
- Dependências: Dia 1 concluído
- Risco: Médio
- Fase recomendada: Dia 2
- Critério de pronto: scripts de test, lint, type-check e build definidos; Jest executável; estrutura base preparada sem feature funcional.
- Status: READY

### SR-002 — Testes da criação de transação manual
- Tipo: Small Release
- Descrição: Criar testes essenciais de domínio e aplicação para registrar receita ou despesa manual.
- Objetivo de negócio: validar o núcleo do controle financeiro antes de UI e integrações.
- Valor esperado: garantir que transações tenham regras claras e testáveis.
- Prioridade: Alta
- Dependências: SR-001
- Risco: Médio
- Fase recomendada: Dia 2
- Critério de pronto: testes de cenário feliz e cenários críticos criados e inicialmente falhando.
- Status: READY

## DISCOVERY

### SR-003 — Implementar criação de transação manual
- Tipo: Small Release
- Descrição: Implementar o mínimo necessário para satisfazer os testes de criação de transação manual.
- Objetivo de negócio: permitir primeiro registro financeiro confiável.
- Valor esperado: criar a base funcional para relatórios, dashboard e IA futura.
- Prioridade: Alta
- Dependências: SR-002
- Risco: Médio
- Fase recomendada: Dia 3
- Critério de pronto: testes principais passando, caso de uso implementado e sem dependência direta de UI com infraestrutura.
- Status: DISCOVERY

### SR-004 — Resumo mensal básico
- Tipo: Small Release
- Descrição: Calcular total de receitas, despesas e saldo líquido por mês a partir das transações.
- Objetivo de negócio: responder "para onde meu dinheiro está indo?" em versão inicial.
- Valor esperado: preparar dashboard e relatórios simples.
- Prioridade: Alta
- Dependências: SR-003
- Risco: Médio
- Fase recomendada: Dia 3 ou Dia 4
- Critério de pronto: caso de uso testado e cálculo mensal validado.
- Status: DISCOVERY

### SR-005 — Dashboard financeiro inicial
- Tipo: Small Release
- Descrição: Exibir resumo mensal básico, saldo líquido e alertas simples a partir dos casos de uso existentes.
- Objetivo de negócio: entregar primeira tela útil do produto.
- Valor esperado: tornar o controle financeiro visível para o usuário.
- Prioridade: Alta
- Dependências: SR-004
- Risco: Médio
- Fase recomendada: Dia 4
- Critério de pronto: estados principais de UI definidos e sem regra de negócio na apresentação.
- Status: DISCOVERY

### Modelar cartão, fatura e parcelas
- Tipo: Feature
- Descrição: Refinar entidades e casos de uso para cartão de crédito, fechamento, vencimento e compras parceladas.
- Objetivo de negócio: cobrir comportamento financeiro crítico para usuários brasileiros.
- Valor esperado: permitir previsão de faturas futuras.
- Prioridade: Alta
- Dependências: transações manuais e resumo mensal
- Risco: Alto
- Fase recomendada: Dia 1 para discovery, Dia 3+ para implementação futura
- Critério de pronto: regras de fatura e parcelas testáveis documentadas.
- Status: DISCOVERY

### Importação de extrato CSV/OFX
- Tipo: Feature
- Descrição: Importar transações por arquivo antes de Open Finance.
- Objetivo de negócio: reduzir trabalho manual sem integração bancária sensível.
- Valor esperado: acelerar adoção do app.
- Prioridade: Média
- Dependências: transações e categorias
- Risco: Médio
- Fase recomendada: ciclo futuro
- Critério de pronto: parser testado, import batch registrado e revisão do usuário antes da persistência.
- Status: DISCOVERY

### Análise financeira com IA
- Tipo: Feature
- Descrição: Gerar explicações sobre gastos, alertas e sugestões baseadas nos dados do usuário.
- Objetivo de negócio: diferenciar o produto como copiloto financeiro.
- Valor esperado: transformar dados financeiros em decisão prática.
- Prioridade: Média
- Dependências: base de transações, resumo mensal, políticas de segurança
- Risco: Alto
- Fase recomendada: ciclo futuro
- Critério de pronto: prompts/contratos testados, sem ação financeira autônoma e com privacidade documentada.
- Status: DISCOVERY

## BLOCKED

### Open Finance via Pluggy ou Belvo
- Tipo: Spike
- Descrição: Avaliar provedor, custo, compliance, fluxo de consentimento e impacto técnico.
- Objetivo de negócio: automatizar coleta de dados financeiros com base formal.
- Valor esperado: reduzir lançamento manual no futuro.
- Prioridade: Média
- Dependências: decisão de provedor e revisão de segurança
- Risco: Alto
- Fase recomendada: ciclo futuro
- Critério de pronto: decisão documentada em ADR, riscos mapeados e contrato de integração definido.
- Status: BLOCKED

Motivo do bloqueio: integração externa sensível fora do escopo do MVP inicial e sem decisão de provedor.

## DÍVIDA TÉCNICA

Nenhuma dívida técnica registrada no Dia 1.

## DONE

- Bootstrap operacional do projeto.
- Discovery inicial, módulos do MVP e primeira small release selecionados.
