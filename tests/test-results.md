# Test Results — Dia 2

## Comandos Executados

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

