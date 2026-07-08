# Test Strategy — Dia 2

## Objetivo
Definir a estratégia de testes antes da implementação funcional da primeira small release: cadastro manual de transação simples.

## Prioridade por Camada
1. `domain`: validações puras de transação e value objects.
2. `application`: caso de uso `create-transaction.use-case`.
3. `infrastructure`: repositório Supabase apenas quando persistência real for implementada.
4. `presentation`: formulário de transação quando a UI entrar no escopo.

## Matriz de Testes

| Camada | Alvo | Cenários | Status no Dia 2 |
| --- | --- | --- | --- |
| domain | `Transaction` | criar receita/despesa válida; rejeitar descrição vazia; rejeitar valor zero/negativo; rejeitar usuário/conta/categoria ausente | testes criados |
| application | `CreateTransactionUseCase` | validar entrada; persistir via contrato; não persistir entrada inválida; propagar erro de repositório | testes criados |
| infrastructure | `SupabaseTransactionRepository` | mapear dados e respeitar `user_id` | futuro |
| presentation | `TransactionForm` | estados de erro, submit, loading e sucesso | testes criados |

## Cenário Feliz
Usuário autenticado registra uma despesa manual com descrição, valor em centavos, data, conta e categoria. O sistema valida os dados, chama o repositório por contrato e retorna a transação criada.

## Cenários Alternativos
- usuário registra receita em vez de despesa
- repositório falha durante persistência
- descrição contém espaços nas extremidades e deve ser normalizada no Dia 3

## Edge Cases Críticos
- valor zero
- valor negativo
- descrição vazia
- usuário ausente
- conta ausente
- categoria ausente
- data inválida
- tipo de transação inválido

## Critério de Saída do Dia 2
- testes essenciais existem
- testes falham antes da implementação
- implementação funcional permanece bloqueada até Dia 3
