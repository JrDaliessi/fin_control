# Test Results — Dia 2

## Comandos Executados

## Dia 7

### `npm run test:ci`
Resultado: passou.

Evidência:
- 5 suites passaram.
- 32 testes passaram.

### `npm run type-check`
Resultado: passou.

### `npm run lint`
Resultado: passou.

### `npm audit`
Resultado: passou.

Evidência:
- 0 vulnerabilidades.

### `npm run build`
Resultado: passou.

Evidência:
- Next.js compilou a rota `/` com a página de transações.

### Revisão de segurança local
Resultado: passou com riscos residuais documentados.

Evidência:
- apenas `.env.example` está versionado entre arquivos de ambiente
- `.env` reais estão ignorados pelo Git
- presentation e App Router não acessam Supabase diretamente
- nenhum `any` encontrado em `src` ou `tests`
- nenhum segredo real identificado nos arquivos versionáveis verificados

## Dia 6

### `npm run test:ci`
Resultado: passou.

Evidência:
- 5 suites passaram.
- 32 testes passaram.

### `npm run type-check`
Resultado: passou.

### `npm run lint`
Resultado: passou.

### `npm audit`
Resultado: passou.

Evidência:
- 0 vulnerabilidades.

### `npm run build`
Resultado: passou.

Evidência:
- Next.js compilou a rota `/` com a página de transações.

### Verificação HTTP local
Resultado: passou parcialmente.

Evidência:
- `http://localhost:3000/` respondeu com status 200.
- `http://localhost:3000/manifest.webmanifest` respondeu com status 200.
- Navegação pelo navegador integrado travou em timeout e não foi usada como evidência final.

## Dia 5

### `npm run test:ci`
Resultado: passou.

Evidência:
- 4 suites passaram.
- 30 testes passaram.

### `npm run type-check`
Resultado: passou.

### `npm run lint`
Resultado: passou.

### `npm audit`
Resultado: passou.

Evidência:
- 0 vulnerabilidades.

### `npm run build`
Resultado: passou.

Evidência:
- Next.js compilou a rota `/` com a página de transações.

## Dia 4

### `npm run test:ci`
Resultado: passou.

Evidência:
- 3 suites passaram.
- 15 testes passaram.

### `npm run type-check`
Resultado: passou.

### `npm run lint`
Resultado: passou.

### `npm audit`
Resultado: passou.

Evidência:
- 0 vulnerabilidades.

### `npm run build`
Resultado: passou.

Evidência:
- Next.js compilou a rota `/` com a página de transações.

## Dia 3

### `npm run test:ci`
Resultado: passou.

Evidência:
- 2 suites passaram.
- 11 testes passaram.

### `npm run type-check`
Resultado: passou.

### `npm run lint`
Resultado: passou.

### `npm audit --omit=dev`
Resultado: passou.

Evidência:
- 0 vulnerabilidades.

### `npm audit`
Resultado: passou.

Evidência:
- 0 vulnerabilidades.

### `npm run build`
Resultado: passou.

Evidência:
- Next.js compilou e gerou rota `/` e `_not-found`.

## Dia 2

### `npm audit --omit=dev`
Resultado: passou.

Evidência:
- 0 vulnerabilidades.

### `npm audit`
Resultado: passou.

Evidência:
- 0 vulnerabilidades.

### `npm run lint`
Resultado: passou.

Evidência:
- ESLint executado sem erros e sem warnings permitidos.

### `npm run type-check`
Resultado: falha esperada.

Motivo:
- `src/features/transactions/domain/entities/transaction.entity.ts` ainda não existe.
- `src/features/transactions/domain/interfaces/transaction.repository.ts` ainda não existe.
- `src/features/transactions/application/use-cases/create-transaction.use-case.ts` ainda não existe.

Interpretação:
- Falha coerente com TDD no Dia 2.
- Implementação deve ocorrer apenas no Dia 3.

### `npm run test:ci`
Resultado: falha esperada.

Motivo:
- suite `transaction.entity.test.ts` falha por ausência de `Transaction`.
- suite `create-transaction.use-case.test.ts` falha por ausência de `CreateTransactionUseCase`.

Interpretação:
- Estado vermelho confirmado.
- O próximo passo é implementar o mínimo necessário no Dia 3.

## Dia 7 — SR-006

### `npm run lint`
Resultado: passou, 0 warnings.

### `npm run type-check`
Resultado: passou.

### `npm run test:ci`
Resultado: passou.

Evidência:
- 14 suites passaram.
- 69 testes passaram.

### `npm audit --audit-level=high`
Resultado: passou.

Evidência:
- 0 vulnerabilidades.

### `npm run build`
Resultado: passou.

Evidência:
- Next.js compilou `/`, `/dashboard` e `/transactions`.
- Workflow de CI versionado para reproduzir os mesmos gates.

## Dia 2 — SR-007

### Testes direcionados de accounts
Resultado: falha esperada.

Evidência:
- 2 suítes falharam com `Cannot find module`.
- módulos ausentes: `FinancialAccount`, `AccountRepository` e `CreateAccountUseCase`.
- nenhuma implementação funcional foi criada.

### Suíte anterior isolada
Resultado: passou.

Evidência:
- 14 suítes passaram.
- 69 testes passaram.

### `npm run type-check`
Resultado: falha esperada.

Evidência:
- quatro erros `TS2307` referentes exclusivamente aos módulos ainda ausentes da SR-007.

### `npm run lint`
Resultado: passou, sem warnings.

### `npm audit --omit=dev`
Resultado: passou, 0 vulnerabilidades.

Interpretação:
- etapa vermelha do TDD confirmada.
- implementação mínima autorizável somente no Dia 3.

## Dia 3 — SR-007

### Testes direcionados de accounts
Resultado: passou.

Evidência:
- 2 suítes passaram.
- 21 testes passaram.

### Suíte completa
Resultado: passou.

Evidência:
- 16 suítes passaram.
- 90 testes passaram.

### `npm run type-check`
Resultado: passou.

### `npm run lint`
Resultado: passou, sem warnings.

### `npm audit --omit=dev`
Resultado: passou, 0 vulnerabilidades.

### `npm run build`
Resultado: passou.

Evidência:
- Next.js compilou `/`, `/dashboard` e `/transactions`.

Interpretação:
- implementação mínima satisfez os testes sem expandir apresentação ou infraestrutura.
- próxima expansão controlada depende do comando `dia 4`.

## Dia 4 — SR-007

### Etapa vermelha de apresentação
Resultado: falha esperada.

Evidência:
- quatro suítes falharam por formulário, provider, página e rota ausentes.
- cenário do dashboard falhou pelo link `Contas` ainda inexistente.

### Testes direcionados
Resultado: passou.

Evidência:
- 7 suítes passaram.
- 35 testes passaram.

### Suíte completa
Resultado: passou.

Evidência:
- 20 suítes passaram.
- 99 testes passaram.

### Quality gates
- type-check: passou após correção da tipagem do mock de teste.
- lint: passou, sem warnings.
- audit de produção: passou, 0 vulnerabilidades.
- build: passou com a nova rota `/accounts`.

Interpretação:
- expansão controlada utilizável durante a sessão.
- persistência, autenticação e RLS continuam fora do escopo.
