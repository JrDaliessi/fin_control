# Validação do Dia 5 — LI-POST-002

- Artefato: `draft.md`
- Estado do artefato: `IN_PROGRESS`
- Estado da fase: `HARDENING` concluído
- Publicação autorizada: não

## Problemas demonstrados na baseline

- a abertura repetia em parágrafos separados que a interface não bastava;
- lista técnica e exemplo repetiam a função das camadas;
- a validação “não restrita à interface” retomava uma ideia já estabelecida;
- baseline do Dia 4: 341 palavras e 2.297 caracteres.

## Refatoração editorial

| Ajuste | Comportamento preservado | Resultado |
| --- | --- | --- |
| abertura condensada | problema e autorização no banco | `PASS` |
| aplicação e RLS integradas ao exemplo | responsabilidades complementares | `PASS` |
| frase redundante de validação removida | migrations e pgTAP permanecem explícitos | `PASS` |
| CTA mantido | pergunta específica sobre isolamento e validação | `PASS` |

## Gate factual

- [x] exatamente os oito claims aprovados continuam representados;
- [x] ownership, RLS habilitada/forçada, grants, policies e FKs preservados;
- [x] aplicação, banco, migrations e pgTAP mantêm responsabilidades proporcionais;
- [x] hardenings pendentes continuam impedindo promessa de prontidão pública;
- [x] nenhuma métrica, consequência comercial ou feature futura foi acrescentada.

Resultado: `PASS`.

## Gate de privacidade

- [x] nenhum e-mail, UUID, senha, chave, token ou cookie;
- [x] nenhum dado ou valor financeiro real;
- [x] nenhum detalhe da conta demo ou do projeto remoto;
- [x] nenhuma imagem ou link operacional.

Resultado: `PASS`.

## Rubrica editorial

| Critério | Nota | Justificativa |
| --- | ---: | --- |
| Gancho | 2 | específico, proporcional e mais direto |
| Contexto | 2 | risco e produto permanecem claros |
| Decisão | 2 | decisão e trade-off seguem ligados ao problema |
| Evidência | 2 | controles e validação permanecem concretos e limitados |
| Aprendizado | 2 | conclusão transferível sem generalização indevida |
| Voz | 2 | ritmo mais natural e menos repetitivo |
| CTA | 2 | pergunta específica e coerente |

Total: **14/14**, sem nota zero.

## Resultado

O hardening reduziu o corpo de 341 para 291 palavras e de 2.297 para 1.980 caracteres, preservando integralmente o contrato editorial. O Dia 6 poderá validar leitura móvel, escaneabilidade, acessibilidade e decisões de formato, sem criar `final.md` ou publicar.
