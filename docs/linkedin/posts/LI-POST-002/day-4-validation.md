# Validação do Dia 4 — LI-POST-002

- Artefato: `draft.md`
- Estado: `IN_PROGRESS`
- Tipo de incremento: expansão controlada
- Publicação autorizada: não

## Alterações deliberadas

| Alteração | Contrato preservado | Resultado |
| --- | --- | --- |
| contexto sobre o risco de confiar somente na interface | `LI002-CLM-006` | `PASS` |
| exemplo de transação, conta, categoria e proprietário | `LI002-CLM-004`, `LI002-CLM-005` | `PASS` |
| trade-off de schema, migrations e testes explícitos | `LI002-CLM-006`, `LI002-CLM-007` | `PASS` |
| CTA sobre regra de isolamento e validação | brief aprovado, sem claim factual novo | `PASS` |

## Gate factual

- [x] os oito claims aprovados permanecem suficientes para todo o texto;
- [x] o exemplo explica comportamento já sustentado por `EVD-FIN-002` e `EVD-FIN-008`;
- [x] a formulação das FKs mantém “ajudando a impedir”, sem garantia absoluta;
- [x] RLS continua apresentada como camada complementar;
- [x] migrations e pgTAP não receberam métricas ou resultados novos;
- [x] hardenings pendentes continuam explícitos;
- [x] nenhuma feature futura ou consequência comercial foi adicionada.

Resultado: `PASS`.

## Gate de privacidade

- [x] nenhum e-mail, UUID, senha, chave, token ou cookie;
- [x] nenhum valor, descrição ou histórico financeiro;
- [x] nenhum detalhe da conta demo ou identificador do projeto remoto;
- [x] nenhuma imagem ou metadado visual;
- [x] exemplo conceitual sem registro real.

Resultado: `PASS`.

## Rubrica editorial

| Critério | Nota | Justificativa |
| --- | ---: | --- |
| Gancho | 2 | problema específico e proporcional |
| Contexto | 2 | risco da fronteira apenas visual foi explicitado |
| Decisão | 2 | camadas e trade-off ligados ao problema |
| Evidência | 2 | exemplo limitado aos controles confirmados |
| Aprendizado | 2 | defesa em profundidade permanece transferível |
| Voz | 2 | técnica, direta e sem autopromoção inflada |
| CTA | 2 | pergunta específica conecta isolamento e validação |

Total: **14/14**, sem nota zero.

## Formato intermediário

- [x] primeira ideia compreensível sem links;
- [x] sigla RLS explicada na primeira ocorrência;
- [x] parágrafos curtos e lista escaneável;
- [x] texto independente de imagem, cor ou jargão;
- [x] hashtags, links e imagem continuam adiados para as fases apropriadas.

## Resultado

O draft expandido está GREEN para o Dia 4. O Dia 5 poderá editar concisão, ritmo, redundância e consistência de voz, preservando claims, limites e ausência de publicação.
