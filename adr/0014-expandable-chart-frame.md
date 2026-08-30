# ADR 0014 — Frame expansível compartilhado para gráficos

- Status: aprovado
- Data: 2026-08-30
- Item transversal: `UX-CHART-001`
- Primeiro consumidor: `SR-014B`
- Depende de: ADRs 0012 e 0013

## Contexto

O gráfico de evolução da SR-014 é o primeiro gráfico de produção. O roadmap já prevê candles e distribuição de frequência, e o usuário aprovou que todos os gráficos possam ser ampliados para ocupar a tela. A Fullscreen API nativa é assíncrona e pode estar indisponível ou rejeitar a solicitação, portanto não pode ser o único mecanismo.

## Decisão

1. A apresentação terá uma primitive cliente `ExpandableChartFrame` responsável apenas pelo frame visual e pelo estado de expansão.
2. O frame usará overlay CSS no mesmo elemento como comportamento universal e solicitará fullscreen nativo quando disponível.
3. Falha ou indisponibilidade da API nativa manterá o overlay funcional, sem bloquear o gráfico.
4. O mesmo nó e a mesma instância do gráfico serão preservados; mudanças de tamanho serão absorvidas pelo `ResizeObserver` do consumidor.
5. O controle oferecerá expandir/recolher, tecla `Escape`, restauração de foco, bloqueio reversível do scroll e textos acessíveis.
6. O frame não conhecerá ECharts, DTOs, dados financeiros, repositories ou regras de negócio.
7. Cada componente cliente de gráfico será responsável por compor a primitive; o Server Component continuará enviando apenas view models planos.
8. A tabela equivalente continuará fora do frame, visível no fluxo normal e disponível novamente ao fechar a expansão.
9. Orientação de tela não será forçada e nenhuma dependência será adicionada.
10. O gráfico de evolução será o primeiro consumidor e os gráficos futuros deverão adotar o mesmo contrato em suas próprias small releases.
11. Cada solicitação nativa terá identidade de tentativa; recolher ou desmontar o frame torna a tentativa obsoleta, e uma aquisição tardia deve ser encerrada sem reabrir a UI.

## Estados

| Estado | Comportamento |
| --- | --- |
| normal | card no fluxo da página, controle “Expandir gráfico” |
| expandido com API nativa | elemento ocupa a tela e o navegador confirma por `fullscreenchange` |
| expandido sem API nativa | overlay CSS ocupa o viewport disponível |
| solicitação nativa rejeitada | overlay permanece funcional e o erro técnico não expõe dados |
| solicitação nativa resolve após recolhimento | fullscreen adquirido tardiamente é encerrado e a UI permanece recolhida |
| saída por botão ou `Escape` | scroll e foco são restaurados |

## Contratos TDD

- expansão e recolhimento alteram estado, rótulos e semântica;
- API nativa é solicitada somente por interação e sua rejeição não quebra o fallback;
- `fullscreenchange` mantém o estado sincronizado quando o navegador encerra o modo nativo;
- `Escape` fecha o fallback;
- scroll e foco são restaurados;
- listeners e estilos globais são limpos no unmount;
- dois frames preservam estado independente;
- solicitação obsoleta não deixa fullscreen nativo ativo nem atualiza UI recolhida;
- o gráfico de evolução reutiliza o frame sem duplicar dados ou instância.

## Alternativas rejeitadas

### Usar somente `requestFullscreen()`

Rejeitada por disponibilidade e permissões variáveis entre navegadores.

### Duplicar o gráfico em modal/portal

Rejeitada porque criaria nova instância ECharts, lifecycle duplicado e risco de divergência.

### Implementar o controle dentro do adapter ECharts

Rejeitada porque acoplaria experiência React/HTML à biblioteca visual e dificultaria o reuso por outros renderers.

### Forçar orientação paisagem

Rejeitada por suporte desigual, perda de controle do usuário e ausência de necessidade no gráfico atual.

## Consequências

Positivas:
- comportamento uniforme para gráficos atuais e futuros;
- fallback confiável sem dependência adicional;
- instância e dados preservados durante a expansão;
- responsabilidade visual isolada e testável.

Trade-offs:
- a primitive adiciona listeners de documento somente enquanto necessária;
- o fullscreen CSS pode manter a interface do navegador em plataformas sem API nativa;
- validação visual e móvel continua obrigatória no Dia 6.
