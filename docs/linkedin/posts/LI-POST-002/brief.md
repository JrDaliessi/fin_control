# Brief — LI-POST-002

- Estado: `IN_PROGRESS`
- Fase: Dia 7 com quality gates locais verdes e readiness remota pendente

## Tema

Como RLS e grants mínimos protegem dados financeiros por usuário.

## Objetivo

Explicar que isolamento de dados não deve depender apenas de filtros da interface ou da aplicação.

## Público principal

Recrutadores técnicos, lideranças de engenharia e pessoas desenvolvedoras full stack/backend.

## Mensagem central

Em dados financeiros, autorização precisa existir também no banco: ownership, constraints, grants mínimos e RLS formam camadas complementares.

## Evidências permitidas

- `EVD-FIN-002`;
- `EVD-FIN-006`;
- `EVD-FIN-008`.

## Claims proibidos

- segurança absoluta ou ausência total de vulnerabilidades;
- detalhes operacionais da conta demo;
- conteúdo de policies ou infraestrutura que aumente superfície de abuso sem valor educativo;
- produção pública liberada enquanto hardenings estiverem pendentes.

## Estrutura sugerida

1. problema: filtro por usuário na aplicação não basta;
2. decisão: identidade validada, ownership composto, grants explícitos e RLS;
3. validação: migrations, pgTAP e gates de segurança;
4. trade-off: maior rigor de schema e testes em troca de defesa em profundidade;
5. limite: segurança é processo, e hardenings pré-produção continuam registrados.

## CTA sugerido

Convidar a audiência a compartilhar quais controles usa para validar isolamento multiusuário.

## Dependência

Revisar novamente o estado dos hardenings antes do draft e antes da publicação; o contrato pré-draft está verde.

## Critérios de aceite

- explicar RLS em linguagem compreensível;
- não revelar credenciais, IDs ou dados financeiros;
- distinguir controle implementado de garantia absoluta;
- vincular testes e migrations às fontes corretas.

## Expansão do Dia 4

- exemplo concreto restrito ao relacionamento tenant-safe já aprovado;
- trade-off entre schema/testes explícitos e defesa em profundidade;
- CTA específico sobre regra de isolamento e forma de validação;
- nenhum claim, tema, métrica ou compromisso de publicação acrescentado.

## Hardening do Dia 5

- abertura condensada sem perder problema ou contexto;
- exemplo e responsabilidades das camadas reunidos em um único fluxo;
- repetição sobre validação fora da interface removida;
- claims, trade-off, limite e CTA preservados.

## Experiência e formato do Dia 6

- abertura dividida em blocos curtos para leitura móvel;
- exemplo técnico separado da responsabilidade da aplicação e da RLS;
- “migrations” explicada como alterações versionadas do banco e pgTAP contextualizado como teste de banco;
- formato textual autossuficiente, sem emoji, hashtag, link externo ou imagem nesta versão;
- decisões de versão final e publicação continuam reservadas ao Dia 7 e à aprovação humana específica.

## Quality gate do Dia 7

- evidências e limites dos oito claims revalidados;
- Supabase confirmado novamente em modo somente leitura, sem acesso a linhas de negócio;
- gates factual, privacidade, editorial, formato, rastreabilidade e segurança editorial verdes;
- `READY_FOR_RELEASE` condicionado ao versionamento dos Dias 5–7 e aos checks remotos do head exato;
- criação de `final.md` e publicação permanecem decisões humanas distintas e ainda não autorizadas.
