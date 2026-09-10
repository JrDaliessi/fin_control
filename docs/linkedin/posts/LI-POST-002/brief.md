# Brief — LI-POST-002

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
- `EVD-FIN-006`.

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

Revisar o estado atual dos hardenings e remover detalhes sensíveis antes do draft.

## Critérios de aceite

- explicar RLS em linguagem compreensível;
- não revelar credenciais, IDs ou dados financeiros;
- distinguir controle implementado de garantia absoluta;
- vincular testes e migrations às fontes corretas.
