# Test Results — Dia 2

## Comandos Executados

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
