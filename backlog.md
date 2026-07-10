# Backlog

## READY

Nenhum item pronto no momento.

## IN_PROGRESS

### SR-006 — Dashboard financeiro inicial
- Tipo: Small Release
- Descrição: Exibir resumo mensal básico, lista de transações recentes e navegação mínima a partir dos casos de uso existentes.
- Objetivo de negócio: entregar primeira tela útil do produto.
- Valor esperado: tornar o controle financeiro visível para o usuário.
- Prioridade: Alta
- Dependências: SR-005 concluída.
- Risco: Médio
- Fase recomendada: ciclo atual.
- Critério de pronto: caso de uso testado, dashboard funcional com empty state e dados, rotas `/` e `/transactions` funcionais, pipeline verde.
- Status: IN_PROGRESS — Dia 1 (discovery) concluído; aguardando Dia 2 para testes essenciais.

Escopo mínimo:
- painel de resumo mensal reutilizando `ListMonthlySummaryUseCase`
- lista resumida das 5 últimas transações da sessão
- empty state com call-to-action
- navegação mínima entre dashboard e registro de transação
- rota `/` renderiza dashboard
- rota `/transactions` renderiza registro de transações

Fora do escopo:
- gráficos e visualizações avançadas
- saldo por conta
- faturas e cartões
- orçamento mensal visual
- alertas de estouro e risco financeiro
- IA e insights
- persistência real e migrations Supabase
- autenticação real
- importação de extrato
- navegação por mês

## DISCOVERY

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

Nenhuma dívida técnica aberta no Dia 7.

## DONE

- Bootstrap operacional do projeto.
- Discovery inicial, módulos do MVP e primeira small release selecionados.
- SR-001 — Setup técnico mínimo executável.
- SR-002 — Testes da criação de transação manual.
- SR-003 — Implementar criação de transação manual.
- SR-004 — Expansão controlada da transação manual.
- HD-001 — Hardening interno da transação manual.
- UX-001 — Revisão de UX, acessibilidade e PWA da transação manual.
- REL-001 — Validação final e preparação de release incremental da transação manual.
- SR-005 — Resumo mensal básico (Dia 2 ao Dia 7 concluídos, pipeline verde, release incremental pronta).
