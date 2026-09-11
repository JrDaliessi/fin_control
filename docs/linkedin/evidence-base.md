# Banco de evidências profissionais

Somente claims presentes nesta lista, ou adicionados após revisão, podem sustentar conteúdo final.

| ID | Claim permitido | Fonte principal | Limite obrigatório |
| --- | --- | --- | --- |
| `EVD-FIN-001` | O FinControl é uma PWA de finanças pessoais construída com Next.js, React e TypeScript. | `project-brief.md`, `project-stack.md` | Não afirmar uso ou adoção em produção pública. |
| `EVD-FIN-002` | Dados persistentes usam Supabase/PostgreSQL com RLS, grants mínimos e isolamento por usuário. | `database-model.md`, migrations em `supabase/migrations/`, `quality-gates.md` | Não afirmar segurança absoluta; hardenings pré-produção permanecem registrados. |
| `EVD-FIN-003` | O dashboard possui linha, candles financeiros, tabelas equivalentes e expansão de gráficos. | `backlog.md` itens `SR-014`, `SR-015` e `UX-CHART-001` | Não apresentar os candles como recomendação de investimento ou recurso de trading. |
| `EVD-FIN-004` | A interação de períodos e candles foi validada com teclado, foco, contraste e viewports móveis e desktop. | `docs/features/UX-CHART-003C/day-7-release-readiness.md` | O claim cobre a `UX-CHART-003C1`; `003C2/003C3` ainda não estão concluídas. |
| `EVD-FIN-005` | O head final da `UX-CHART-003C1` passou em 97 suítes e 669 testes, além de lint, type-check e build. | `docs/features/UX-CHART-003C/day-7-release-readiness.md`, GitHub Actions `Quality Gates #148` | É evidência técnica daquele head, não métrica de qualidade absoluta nem resultado comercial. |
| `EVD-FIN-006` | O projeto usa requisitos, ADRs, TDD, small releases e gates de qualidade rastreáveis. | `engineering-rules.md`, `docs/features/`, `adr/`, `quality-gates.md` | Descrever o processo praticado no projeto, sem generalizar para experiência profissional não documentada. |
| `EVD-FIN-007` | A PR `#30` entregou `Tudo` e período personalizado na small release `UX-CHART-003C1`. | `docs/releases/2026-09-09-ux-chart-003c1.md`, commit de merge `a96b564` | Âncora real, agregações finais e drill-down pertencem à `003C2/003C3`. |
| `EVD-FIN-008` | Uma inspeção read-only do projeto Supabase confirmou migrations, RLS, grants, policies e FKs citados pelo `LI-POST-002`. | `docs/linkedin/posts/LI-POST-002/supabase-evidence-2026-09-10.md` | Snapshot técnico de 2026-09-10; revalidar antes da publicação e não afirmar segurança absoluta. |

## Claims bloqueados

- quantidade de usuários, receita, economia, engajamento ou ganho de produtividade;
- cobertura percentual de testes sem relatório correspondente;
- aplicação “em produção” ou “pronta para o público” enquanto bloqueios de segurança/observabilidade permanecerem;
- integração com Open Finance ou IA já disponível;
- cargo, senioridade, vínculo empregatício ou anos de experiência do autor;
- qualquer dado ou credencial da conta de demonstração.
