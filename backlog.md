# Backlog

## READY

### HD-001 — Hardening interno da transação manual
- Tipo: Hardening
- Descrição: Revisar consistência, acoplamento, tamanho dos arquivos, estados da UI e fronteiras entre presentation, application e domain.
- Objetivo de negócio: estabilizar o primeiro fluxo funcional antes de novas expansões.
- Valor esperado: reduzir entropia e preparar evolução segura.
- Prioridade: Alta
- Dependências: SR-004
- Risco: Médio
- Fase recomendada: Dia 5
- Critério de pronto: plano de refatoração documentado, ajustes estruturais necessários aplicados e gates verdes.
- Status: READY

## DISCOVERY

### SR-005 — Resumo mensal básico
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

### SR-006 — Dashboard financeiro inicial
- Tipo: Small Release
- Descrição: Exibir resumo mensal básico, saldo líquido e alertas simples a partir dos casos de uso existentes.
- Objetivo de negócio: entregar primeira tela útil do produto.
- Valor esperado: tornar o controle financeiro visível para o usuário.
- Prioridade: Alta
- Dependências: SR-005
- Risco: Médio
- Fase recomendada: Dia 4
- Critério de pronto: estados principais de UI definidos e sem regra de negócio na apresentação.
- Status: DISCOVERY

### SR-007 — Cadastro de conta financeira
- Tipo: Small Release
- Descrição: Criar fluxo mínimo para cadastrar conta financeira manual.
- Objetivo de negócio: permitir que transações referenciem contas reais do usuário em vez de IDs de teste.
- Valor esperado: preparar uso real do registro de transações.
- Prioridade: Alta
- Dependências: SR-004
- Risco: Médio
- Fase recomendada: ciclo futuro
- Critério de pronto: domínio, caso de uso e testes de conta criados antes da implementação.
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

Nenhuma dívida técnica aberta no Dia 3.

## DONE

- Bootstrap operacional do projeto.
- Discovery inicial, módulos do MVP e primeira small release selecionados.
- SR-001 — Setup técnico mínimo executável.
- SR-002 — Testes da criação de transação manual.
- SR-003 — Implementar criação de transação manual.
- SR-004 — Expansão controlada da transação manual.
