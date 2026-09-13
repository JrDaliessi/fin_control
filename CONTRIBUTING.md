# Contribuindo com o FinControl

O FinControl usa mudanças pequenas, rastreáveis e verificáveis. Este guia torna branches, commits e pull requests fáceis de avaliar sem exigir conhecimento prévio do processo interno do projeto.

## Fluxo de branches

```text
main      → versão pública estável
develop   → integração das small releases
codex/*   → feature, correção ou documentação isolada
```

Crie a branch a partir do destino real da mudança:

- feature em desenvolvimento: `develop`;
- documentação que precisa aparecer imediatamente na página pública: `main`;
- hotfix de produção: `main`, seguido de sincronização com `develop`.

Use nomes curtos e rastreáveis:

```text
codex/ux-chart-003c2-history-aggregation
codex/repo-showcase-001
codex/fix-auth-session-expiry
```

## Commits

Formato preferencial:

```text
<tipo>(<escopo>): <resultado objetivo> | <ID>
```

Quando a entrega segue uma fase explícita:

```text
<tipo>(<escopo>): <resultado objetivo> | Dia <N> <ID>
```

Exemplos:

```text
docs(showcase): orientar avaliação técnica do FinControl | REPO-SHOWCASE-001
test(analytics): definir contratos de histórico completo | Dia 2 UX-CHART-003C2
feat(analytics): resolver período Tudo com âncora segura | Dia 3 UX-CHART-003C2
```

Regras:

- descreva o resultado, não apenas “ajustes” ou “alterações”;
- mantenha uma intenção principal por commit;
- não misture refatoração ampla com mudança funcional;
- associe o ID da feature, bug, dívida ou entrega;
- nunca versione credenciais, `.env`, tokens ou dados reais;
- não reescreva histórico público apenas para uniformizar estilo antigo.

Tipos comuns: `feat`, `fix`, `test`, `refactor`, `docs`, `style`, `perf`, `security`, `ci` e `chore`.

## Pull requests

O título deve explicar o resultado e o recorte:

```text
docs(showcase): preparar apresentação pública | REPO-SHOWCASE-001
feat(analytics): entregar histórico completo | UX-CHART-003C2
```

Evite títulos genéricos como `Develop`, `Update`, `Changes` ou apenas o nome da branch.

O corpo da PR deve responder:

1. qual problema ou objetivo motivou a mudança;
2. o que foi alterado;
3. o que permaneceu fora do escopo;
4. quais decisões ou trade-offs importam;
5. como o resultado foi validado;
6. quais riscos e próximos passos permanecem.

Use o template em [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) e remova somente as seções comprovadamente não aplicáveis.

## Quality gates

Antes de solicitar revisão, execute os gates proporcionais ao risco:

```bash
npm run lint
npm run type-check
npm run test:ci
npm audit --audit-level=high
npm run build
```

Mudanças de banco também exigem migrations reproduzíveis, testes pgTAP, revisão de RLS/ACL e plano de rollback. Mudanças puramente documentais podem usar links, YAML, escopo, credenciais e `git diff --check` como gate proporcional, sem fingir que um teste funcional foi necessário.

## Estratégia de merge

- small release para `develop`: **Squash and merge**;
- promoção de `develop` para `main`: PR de release com título e resumo descritivos;
- hotfix: merge preservando a rastreabilidade entre `main` e `develop`.

Não faça merge com checks obrigatórios vermelhos, exceto checkpoints TDD deliberadamente RED mantidos como draft e claramente identificados como não liberáveis.

## Segurança e dados

Leia [`SECURITY.md`](SECURITY.md). Use somente dados de demonstração e não publique credenciais compartilhadas, informações financeiras ou evidências exploráveis em issues e PRs públicas.
