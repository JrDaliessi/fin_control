# Estratégia de validação — LINKEDIN-001

- Fase: Dia 2
- Estado: `VALIDATION_READY`
- Small release editorial prioritária: `LI-POST-002`
- Publicação externa: bloqueada

## Objetivo

Definir como validar posicionamento, evidências, briefs, drafts e versões finais antes de qualquer produção relevante ou publicação externa.

## Princípio

Validation First para conteúdo significa que a afirmação, sua fonte, seu limite e a forma de rejeição existem antes do draft. Nenhuma qualidade narrativa compensa falha factual ou de privacidade.

## Níveis de validação

1. **Estrutural:** arquivos, IDs, estados e rotas existem e são únicos.
2. **Factual:** cada claim aponta para evidência atual e não extrapola seu recorte.
3. **Privacidade:** nenhum segredo, dado pessoal ou financeiro é publicável.
4. **Editorial:** mensagem, voz e estrutura atendem ao público e ao brief.
5. **Canal:** leitura móvel, links, imagens e texto alternativo são revisados no formato final.
6. **Humano:** texto final e publicação recebem autorizações distintas.

## Matriz de requisitos funcionais

| Requisito | Validação | Evidência esperada | Fase de execução |
| --- | --- | --- | --- |
| `LNK001-RQ-001` | comparar headline, voz e texto com as proibições de identidade | `positioning.md`, rubrica factual | Dias 2, 5 e 7 |
| `LNK001-RQ-002` | verificar que todo claim factual usa `evidence_id` existente | banco e matriz de claims | Dias 2, 3, 5 e 7 |
| `LNK001-RQ-003` | bloquear draft sem `brief.md` e `sources.md` | árvore do post | antes do Dia 3 |
| `LNK001-RQ-004` | validar as dez seções obrigatórias do brief | checklist estrutural | Dias 1 e 2 |
| `LNK001-RQ-005` | rejeitar data ou compromisso não autorizado | calendário e rubrica | Dias 2 e 7 |
| `LNK001-RQ-006` | exigir gates factual, editorial e privacidade verdes | review record futuro | Dias 5 a 7 |
| `LNK001-RQ-007` | exigir autorizações separadas para final e publicação | status e approval record | Dia 7 e publicação |
| `LNK001-RQ-008` | exigir release/head e limite em métricas técnicas | matriz de claims | Dias 2, 5 e 7 |
| `LNK001-RQ-009` | rejeitar draft do post 001 enquanto dependências estiverem abertas | calendário, contexto e status | antes do Dia 3 |
| `LNK001-RQ-010` | distinguir resultado técnico de impacto comercial | rubrica factual e fixtures | todos os drafts |

## Matriz de requisitos não funcionais

| Requisito | Sinal de aprovação | Bloqueio |
| --- | --- | --- |
| `LNK001-NFR-001` | claim, evidência e fonte navegáveis por IDs | fonte ausente, ambígua ou quebrada |
| `LNK001-NFR-002` | varredura e revisão humana sem dado sensível | qualquer segredo, dado financeiro ou identificador privado |
| `LNK001-NFR-003` | commit/estado verificado antes do draft e da publicação | evidência marcada `stale` |
| `LNK001-NFR-004` | parágrafos curtos e leitura compreensível no celular | parede de texto ou jargão sem explicação |
| `LNK001-NFR-005` | fatos centralizados em `evidence-base.md` | duplicação divergente entre posts |
| `LNK001-NFR-006` | publicação somente após comando humano explícito | automação ou ação externa implícita |

## Cobertura dos critérios de aceite

| Critério | Contrato de validação | Estado no Dia 2 |
| --- | --- | --- |
| `LNK001-AC-001` | inspeção de posicionamento, voz e públicos | coberto |
| `LNK001-AC-002` | schema editorial do banco de evidências | coberto |
| `LNK001-AC-003` | fixtures negativas de overclaim e identidade | coberto |
| `LNK001-AC-004` | presença de três pares brief/fontes | coberto |
| `LNK001-AC-005` | busca mecânica por draft, final, data ou automação | coberto |
| `LNK001-AC-006` | estado `BLOCKED` e dependências do post 001 | coberto |
| `LNK001-AC-007` | matriz claim→fonte por post | coberto; post 002 detalhado |
| `LNK001-AC-008` | quatro rubricas e gate humano | coberto |
| `LNK001-AC-009` | validação de contexto, registries, backlog e roadmap | coberto |
| `LNK001-AC-010` | parser YAML, IDs, rotas, segurança e diff | coberto |

## Cenários essenciais

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| `LNK001-VAL-001` | claim usa evidência existente e respeita seu limite | `PASS` |
| `LNK001-VAL-002` | claim não possui fonte verificável | `BLOCKED` |
| `LNK001-VAL-003` | métrica técnica é apresentada como impacto comercial | `BLOCKED` |
| `LNK001-VAL-004` | texto promete segurança absoluta ou ausência de bugs | `BLOCKED` |
| `LNK001-VAL-005` | conteúdo contém credencial, dado financeiro ou identificador privado | `BLOCKED` |
| `LNK001-VAL-006` | feature futura é descrita como concluída | `BLOCKED` |
| `LNK001-VAL-007` | evidência mudou desde o brief | `STALE`; revalidar antes de continuar |
| `LNK001-VAL-008` | post 001 tenta avançar antes de `003C2/003C3` | `BLOCKED` |
| `LNK001-VAL-009` | post 002 explica RLS com limites e fontes atuais | `PASS` para iniciar draft no Dia 3 |
| `LNK001-VAL-010` | texto final está aprovado, mas publicação não foi autorizada | manter não publicado |

## Estratégia mecânica

- parsear os YAMLs do Context Pack;
- validar que rotas e fontes locais obrigatórias existem;
- verificar unicidade dos IDs `RQ`, `NFR`, `AC`, `VAL`, `CLM` e `FIX`;
- garantir ausência de `draft.md` e `final.md` antes do Dia 3;
- procurar padrões de segredo, credencial, e-mail da conta demo e whitespace inválido;
- executar `git diff --check`.

## Estratégia semântica

- aplicar `rubrics.md` a cada versão;
- revisar claims contra `evidence-base.md` e o source map do post;
- classificar afirmações como fato, inferência, opinião ou proposta;
- bloquear fatos sem fonte e inferências apresentadas como fato;
- revalidar estado do produto antes do draft e antes da publicação.

## Gate de avanço

O Dia 3 pode produzir apenas o draft de `LI-POST-002`. `LI-POST-001` permanece bloqueado e `LI-POST-003` permanece fora do incremento prioritário. Publicação, agendamento, perfil, Supabase, Vercel e código do produto ficam fora.
