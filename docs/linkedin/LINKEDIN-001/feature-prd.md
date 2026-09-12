# Feature PRD — LINKEDIN-001

## Identificação

- Feature: Posicionamento e portfólio técnico do FinControl
- Capabilities: `linkedin`, `content`
- Estado: `REQUIREMENTS_READY`
- Aprovação dos requisitos: confirmada em 2026-09-10

## Problema

As decisões, entregas e validações do FinControl estão distribuídas entre código, ADRs, releases e Quality Gates. Sem uma narrativa editorial rastreável, recrutadores podem não perceber o valor técnico e de produto demonstrado pelo projeto.

## Público

- primário: recrutadores técnicos;
- secundário: lideranças de engenharia e pessoas desenvolvedoras;
- terciário: profissionais de produto e design.

## Resultado esperado

Disponibilizar uma base editorial capaz de gerar posts claros e profissionais, sempre derivados de evidências verificáveis e transparentes quanto a limites e trabalho futuro.

## Escopo

- posicionamento e headline profissional;
- voz editorial e estrutura recorrente;
- banco de evidências com claims permitidos e limites;
- quatro pilares editoriais;
- calendário inicial de três posts;
- brief e mapa de fontes para cada post;
- processo de revisão factual, editorial, privacidade e aprovação humana.

## Fora do escopo

- publicar ou agendar conteúdo;
- editar o perfil real do LinkedIn;
- escrever `draft.md` ou `final.md` no Dia 1;
- divulgar credenciais, dados financeiros, e-mails ou identificadores privados;
- inventar cargo, senioridade, tempo de experiência, audiência ou impacto de negócio;
- apresentar `UX-CHART-003C2/003C3`, IA, Open Finance ou produção pública como concluídos.

## Posicionamento aprovado

### Headline

> Desenvolvimento Full Stack com Next.js, TypeScript e Supabase | Produtos seguros, acessíveis e orientados por testes

### Voz

Técnica, humana, didática, direta e sem exageros. Cada post começa pelo problema, explica uma decisão, apresenta evidência e termina com aprendizado ou pergunta genuína.

## Requisitos funcionais

- `LNK001-RQ-001`: o posicionamento deve conectar engenharia de produto, segurança, testes e UX sem declarar senioridade ou experiência não confirmada.
- `LNK001-RQ-002`: todo claim publicável deve referenciar um ID único do banco de evidências.
- `LNK001-RQ-003`: cada post deve possuir `brief.md` e `sources.md` antes de qualquer draft.
- `LNK001-RQ-004`: cada brief deve definir problema, público, mensagem, evidências, estrutura, CTA, riscos e dependências.
- `LNK001-RQ-005`: o calendário deve registrar ordem e estado sem inventar data ou compromisso de publicação.
- `LNK001-RQ-006`: cada texto final deve passar por revisão factual, editorial e de privacidade.
- `LNK001-RQ-007`: publicação, agendamento e alteração de perfil exigem autorização humana específica após aprovação do texto final.
- `LNK001-RQ-008`: claims sobre uma release devem declarar o recorte, o head ou commit e suas limitações relevantes.
- `LNK001-RQ-009`: o post de candles deve permanecer bloqueado até a conclusão da `UX-CHART-003C2/003C3`.
- `LNK001-RQ-010`: o conteúdo deve distinguir resultado técnico validado de impacto comercial não medido.

## Requisitos não funcionais

- `LNK001-NFR-001 — Rastreabilidade`: claims e fontes devem ser navegáveis por IDs estáveis.
- `LNK001-NFR-002 — Privacidade`: nenhum dado pessoal, financeiro ou segredo pode entrar nos artefatos publicáveis.
- `LNK001-NFR-003 — Atualidade`: o estado de cada evidência deve ser revisto antes do draft e antes da publicação.
- `LNK001-NFR-004 — Legibilidade`: textos devem ser escaneáveis no celular, com parágrafos curtos e sem jargão desnecessário.
- `LNK001-NFR-005 — Manutenção`: evidências ficam centralizadas; posts referenciam a base sem duplicar a verdade.
- `LNK001-NFR-006 — Controle humano`: nenhuma integração externa pode publicar automaticamente.

## Critérios de aceite

- `LNK001-AC-001`: headline, voz, públicos e diferenciação estão documentados e aprovados.
- `LNK001-AC-002`: o banco contém claims permitidos, fonte principal e limite obrigatório.
- `LNK001-AC-003`: claims bloqueados incluem métricas comerciais, experiência pessoal não confirmada e capacidades futuras.
- `LNK001-AC-004`: existem três briefs com IDs únicos e mapas de fontes correspondentes.
- `LNK001-AC-005`: nenhum `draft.md`, `final.md`, data de publicação ou automação é criado no Dia 1.
- `LNK001-AC-006`: `LI-POST-001` registra `UX-CHART-003C2/003C3` como bloqueio duro de produção do draft.
- `LNK001-AC-007`: cada brief usa apenas evidências compatíveis com seu tema.
- `LNK001-AC-008`: gates factual, editorial, privacidade e aprovação estão definidos.
- `LNK001-AC-009`: contextos, registries, backlog e roadmap refletem o estado `REQUIREMENTS_READY`.
- `LNK001-AC-010`: YAML, rotas, IDs e `git diff --check` passam sem erro.

## Métricas de processo

- 100% dos claims de um texto final ligados a evidências aprovadas;
- zero dado pessoal, financeiro ou segredo nos artefatos publicáveis;
- zero publicação ou alteração de perfil sem autorização explícita.

Essas métricas governam o processo editorial; não representam alcance ou impacto de negócio.

## Riscos e dependências

- evidência desatualizada: revisar estado e commit antes de cada draft;
- narrativa exagerada: bloquear claim sem fonte ou com extrapolação comercial;
- exposição acidental: executar revisão de privacidade antes da versão final;
- post incompleto de candles: manter `LI-POST-001` bloqueado até `UX-CHART-003C2/003C3`;
- informação pessoal insuficiente: não preencher cargo, senioridade ou histórico por inferência.

## Aprovação

Requisitos, headline e voz aprovados pelo usuário em 2026-09-10. Essa aprovação não autoriza drafts finais, publicação, agendamento ou alteração do perfil real.
