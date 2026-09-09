# UX-CHART-003C1 — Dia 7: qualidade e release readiness

- Data: 2026-09-09
- Estado de entrada: `EXPERIENCE_VALIDATION`
- Estado de saída: `READY_FOR_RELEASE`
- Branch validada: `codex/ux-chart-003c-all-custom-drilldown`
- Head-base validado em Preview: `ba12011`
- PR existente: `#30`

## Escopo validado

Este gate cobre exclusivamente a `UX-CHART-003C1`: tipos `all/custom`, resolução civil do personalizado, limites de 60 anos e 60 buckets, URL canônica, composição server-side defensiva, barra com nove opções e diálogo responsivo. Âncora real de `Tudo`, migration trimestral/anual e drill-down progressivo continuam reservados à `003C2/003C3`.

## Rastreabilidade do recorte

| Critério | Cobertura da `003C1` | Estado |
| --- | --- | --- |
| `AC-001` | nove opções, URL custom canônica, restauração e progressive enhancement | completo |
| `AC-002` | data inválida, ordem, 60 anos e 60 buckets com códigos estáveis | completo |
| `AC-004` | matriz e limites do domínio | parcial; SQL pertence à `003C2` |
| `AC-009` | até 60 pontos, targets, foco e 320/390/768/1280 px | completo para a `003C1` |
| `AC-010` | sete presets preservados e parâmetros defensivos | completo para a `003C1`; observabilidade global segue separada |

`AC-003`, `AC-008` e a parcela SQL de `AC-004` pertencem à `003C2`. `AC-005`, `AC-006` e `AC-007` pertencem à `003C3` e não são declarados entregues por este registro.

## Quality gates locais

| Gate | Resultado |
| --- | --- |
| Jest | 97 suítes e 669 testes verdes |
| Snapshots | 0 |
| ESLint | verde, zero warnings |
| TypeScript | verde |
| Build | Next.js 16.3.3/Turbopack verde após repetir com rede para baixar a Geist |
| Dependency audit | zero vulnerabilidades no Dia 5 e no CI remoto `#146`; lockfile funcional inalterado no Dia 6 |
| Diff | `git diff --check` verde |

## Segurança e privacidade

- nenhuma migration, policy, grant, RPC ou dado remoto foi alterado;
- a presentation de `financial-analytics` não importa Supabase nem executa consulta cliente;
- nenhum evento, `console.*`, e-mail, UUID, descrição ou valor financeiro foi adicionado pela `003C1`;
- parâmetros repetidos ou malformados falham antes da consulta financeira;
- o adapter rejeita `quarter/year` antes da RPC enquanto a migration da `003C2` não existir;
- `Tudo` não aceita `userId` ou data inicial efetiva fornecidos pelo browser;
- `.env.local` e credenciais permanecem fora do versionamento.

## Experiência e acessibilidade

- Preview autenticada validada em 320x800, 390x844, 768x900 e 1280x900 sem overflow global;
- mobile apresenta bottom sheet com safe areas e rolagem interna; desktop apresenta modal central de 512 px;
- acionador, inputs e ações possuem 44 px de altura;
- foco inicial, contenção circular, isolamento do fundo, `Escape` e retorno ao acionador estão cobertos;
- validação move o foco ao limite ausente que exige correção;
- contrastes relevantes superam 4,5:1 nos temas claro e escuro;
- reduced motion e leitura sem depender apenas de cor permanecem preservados.

## Next.js e artefatos gerados

O Next.js 16.3.3 materializou `AGENTS.md`/`CLAUDE.md` e acrescentou a referência tipada de root params em `next-env.d.ts`. Esses arquivos são gerados pelo toolchain e serão versionados para impedir sujeira recorrente ao executar `next dev`.

## Riscos residuais

1. **MÉDIO — CI-VERCEL-002:** CI e desenvolvimento usam Node.js 22, enquanto o projeto Vercel reporta Node.js 24. A Preview atual construiu e operou, mas os ambientes devem ser alinhados em hardening próprio.
2. **ALTO — histórico extenso:** âncora, RLS, plano e agregação trimestral/anual ainda exigem a `003C2`; o adapter bloqueia o caminho prematuro.
3. **MÉDIO — drill-down:** concorrência, foco entre níveis e meses volumosos continuam fora deste recorte e serão tratados na `003C3`/hardening separado.
4. **Globais pré-produção:** `SEC-AUTH-001`, `SEC-HARD-001B` e `HARD-OBS-001` permanecem registrados.

## Decisão de release

`UX-CHART-003C1` está **READY_FOR_RELEASE** para versionamento e atualização da PR `#30`. A feature pai `UX-CHART-003C` permanece **IN_PROGRESS** até concluir `003C2` e `003C3`.

Merge e deploy não fazem parte deste gate e exigem autorização própria.
