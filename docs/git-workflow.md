# Git Workflow — FinControl

Convenção de branches, commits e merge do projeto FinControl.

## Branches

```
main ──────────────────────────── produção estável
  │
  └── develop ─────────────────── integração contínua
       │
       ├── codex/<ID>-<desc> ──── feature, correção ou documentação
       └── hotfix/<ID>-<desc> ── correção urgente em produção
```

### Regras

| Branch | Criada de | Merge para | Estratégia |
|--------|-----------|------------|------------|
| `main` | — | — | Protegida |
| `develop` | `main` | `main` | `--no-ff` |
| `codex/*` | `develop` ou `main`, conforme destino | destino de origem | `--squash` |
| `hotfix/*` | `main` | `main` + `develop` | `--no-ff` |

### Nomeação

```
codex/SR-010-categorias
codex/UI-002-shell-nav
codex/BUG-002-sessao-expirada
hotfix/SEC-001-rls-bypass
```

---

## Commits

### Formato

```
<tipo>(<escopo>): <descrição> | Dia <N> <ID>
```

### Tipos

| Tipo | Quando | Dias típicos |
|------|--------|-------------|
| `chore` | Setup, configs, CI, dependências | Dia 0, Dia 1 |
| `test` | Criar/alterar testes (TDD) | Dia 2 |
| `feat` | Nova funcionalidade | Dia 3, Dia 4 |
| `refactor` | Refatoração sem mudar comportamento | Dia 5 |
| `style` | UX, acessibilidade, CSS | Dia 6 |
| `fix` | Correção de bug | Qualquer |
| `docs` | Documentação, ADR | Qualquer |
| `ci` | Pipeline, GitHub Actions | Dia 7 |
| `perf` | Otimização de performance | Dia 5, Dia 7 |
| `security` | Hardening, RLS, headers | Dia 7 |

### Escopos

| Escopo | Domínio |
|--------|---------|
| `project` | Setup geral, bootstrap |
| `auth` | Autenticação e sessão |
| `accounts` | Contas financeiras |
| `transactions` | Transações e resumo |
| `dashboard` | Dashboard financeiro |
| `ui` | Sistema visual e marca |
| `shell` | Navegação e layout |
| `categories` | Categorias |
| `analytics` | Relatórios e análise |
| `goals` | Metas financeiras |
| `gamification` | Pontos e conquistas |

### Exemplos

```bash
# TDD — escrevendo testes
test(accounts): testes de criação de conta local | Dia 2 SR-007

# Implementação
feat(accounts): repository e mapper Supabase | Dia 4 SR-009

# Refatoração
refactor(accounts): hardening e RLS otimizado | Dia 5 SR-009

# UX e acessibilidade
style(accounts): acessibilidade e PWA | Dia 6 SR-009

# Validação final
ci(accounts): validação final e entrega | Dia 7 SR-009

# Correção de bug
fix(auth): proxy quebra com URL inválida do Supabase | Dia 3 BUG-001
```

---

## Merge

### Feature → develop (Squash Merge)

```bash
git checkout develop
git merge --squash codex/SR-010-categorias
git commit -m "feat(categories): persistência e RLS de categorias [SR-010]

Dias 1-7 concluídos.
- Migration reproduzível com grants mínimos
- Repository create/listByUser com mapper
- Use case autenticado via Server Action
- Testes pgTAP + Jest verdes
- RLS forçada com isolamento por proprietário

Quality gates: lint ✓ type-check ✓ testes ✓ build ✓"
```

### develop → main (Release)

```bash
git checkout main
git merge --no-ff develop -m "release: v0.X.0 — categorias e transações

Inclui:
- SR-010: persistência e RLS de categorias
- SR-011: persistência e RLS de transações

Quality gates: pipeline completo verde"
git tag v0.X.0
```

### Hotfix → main (Emergência)

```bash
git checkout -b hotfix/SEC-001-rls-bypass main
# ... correção ...
git checkout main
git merge --no-ff hotfix/SEC-001-rls-bypass
git tag v0.X.1
git checkout develop
git merge hotfix/SEC-001-rls-bypass
git branch -d hotfix/SEC-001-rls-bypass
```

---

## Tags

Formato: **Semantic Versioning** (`vMAJOR.MINOR.PATCH`)

| Bump | Quando |
|------|--------|
| `PATCH` | Hotfix, correção pontual |
| `MINOR` | Nova feature/story concluída |
| `MAJOR` | Breaking change ou release pública |

---

## Fluxo Completo de uma Story

```
1. git checkout develop && git pull
2. git checkout -b codex/SR-010-categorias

   # Dia 1 — Discovery
   git commit -m "docs(categories): discovery e contratos | Dia 1 SR-010"

   # Dia 2 — TDD
   git commit -m "test(categories): testes do use case | Dia 2 SR-010"

   # Dia 3 — Implementação mínima
   git commit -m "feat(categories): implementar domain e use case | Dia 3 SR-010"

   # Dia 4 — Expansão
   git commit -m "feat(categories): repository e Server Action | Dia 4 SR-010"

   # Dia 5 — Refatoração
   git commit -m "refactor(categories): hardening interno | Dia 5 SR-010"

   # Dia 6 — UX/PWA
   git commit -m "style(categories): acessibilidade e estados | Dia 6 SR-010"

   # Dia 7 — Entrega
   git commit -m "ci(categories): validação final e quality gates | Dia 7 SR-010"

3. git checkout develop
4. git merge --squash codex/SR-010-categorias
5. git commit -m "feat(categories): persistência e RLS [SR-010] ..."
6. git branch -d codex/SR-010-categorias
7. git push origin develop
```

---

## Referência Rápida

```bash
# Criar feature branch
git checkout -b codex/SR-010-categorias develop

# Commit com template
git commit  # abre o template .gitmessage

# Squash merge para develop
git checkout develop
git merge --squash codex/SR-010-categorias

# Release para main
git checkout main
git merge --no-ff develop -m "release: vX.Y.Z — descrição"
git tag vX.Y.Z

# Push
git push origin main develop --tags
```
