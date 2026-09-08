# UX-CHART-003B — Plano e resultado de refatoração do Dia 5

- Data: 2026-09-07
- Entrada: `IMPLEMENTATION_IN_PROGRESS` em GREEN
- Saída: retorno estável a `IMPLEMENTATION_IN_PROGRESS` em GREEN

## Inventário

- `FinancialIntervalStatementPanel.client.tsx` é o maior arquivo de production da presentation, com 216 linhas, mas permanece coeso e pertence ao fluxo contextual já entregue pela `UX-CHART-002`.
- `FinancialVisualizationSwitcher.client.tsx` reúne a alternância de visualização e a seleção contextual; não é monolítico, porém preservava seleção obsoleta quando o período mudava.
- a mesma conversão de data civil era repetida em cinco arquivos de tabelas, painel e opções ECharts.
- não há evidência de gargalo novo, query adicional, waterfall ou crescimento de dados no browser.

## Plano incremental

1. Reproduzir em RED a permanência do extrato após troca do intervalo.
2. Reiniciar somente o conteúdo interativo quando a chave civil do período mudar, sem efeito de sincronização.
3. Consolidar formatação civil em um formatter puro de presentation.
4. Preservar os contratos visuais e executar a regressão completa.
5. Não fatiar arquivos coesos nem criar abstraction genérica sem segundo caso real.

## Resultado

- o RED falhou em 1 de 8 testes da suíte do switcher pelo diálogo obsoleto ainda aberto;
- o conteúdo interativo passou a usar chave composta por granularidade, início e fim do período, fechando o extrato e reiniciando o modo de forma síncrona;
- `formatFinancialCivilDate` e `formatFinancialCivilDayMonth` substituíram cinco implementações locais sem alterar a apresentação;
- nenhuma lógica de domínio migrou para a UI e nenhum acesso a dados foi adicionado ao client;
- o formatter é importado diretamente, sem barrel ou dependência nova;
- `FinancialIntervalStatementPanel.client.tsx` não foi fatiado porque a mudança seria cosmética e ultrapassaria o recorte ativo.

## Validação

- GREEN dirigido: 5 suítes e 38 testes;
- feature completa: 32 suítes e 287 testes;
- regressão global: 95 suítes e 618 testes;
- ESLint, type-check e build Next.js 16.3.3 verdes;
- zero snapshots e nenhuma expectativa relaxada.

## Riscos remanescentes

- risco MÉDIO já conhecido: validar as sete opções do seletor em 320 px e em PWA real no Dia 6;
- não foi encontrada dívida crítica ou alta específica deste hardening;
- Performance Agent não foi ativado porque não surgiu evidência concreta de gargalo.
