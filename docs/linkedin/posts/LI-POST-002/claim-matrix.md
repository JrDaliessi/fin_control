# Matriz de claims — LI-POST-002

| ID | Tipo | Formulação permitida | Evidência | Limite | Estado |
| --- | --- | --- | --- | --- | --- |
| `LI002-CLM-001` | fato do projeto | contas, categorias e transações persistentes possuem `user_id` | `EVD-FIN-002`, `EVD-FIN-008` | não generalizar para tabelas futuras | `approved` |
| `LI002-CLM-002` | fato do projeto | as três tabelas habilitam e forçam RLS | `EVD-FIN-002`, `EVD-FIN-008` | não afirmar segurança absoluta | `approved` |
| `LI002-CLM-003` | fato do projeto | o papel `authenticated` recebe somente `SELECT` e `INSERT` nesses recortes | `EVD-FIN-002`, `EVD-FIN-008` | edição e exclusão ficaram fora das releases | `approved` |
| `LI002-CLM-004` | fato do projeto | policies restringem seleção e inserção ao proprietário autenticado e bloqueiam identidade anônima | `EVD-FIN-002`, `EVD-FIN-008` | descrever comportamento, não divulgar credenciais ou IDs | `approved` |
| `LI002-CLM-005` | fato do projeto | transações usam FKs compostas para preservar ownership de conta e categoria | `EVD-FIN-002`, `EVD-FIN-008` | usar “ajudam a impedir”, sem promessa absoluta | `approved` |
| `LI002-CLM-006` | decisão de engenharia | autorização foi tratada também no banco, não apenas na interface | `EVD-FIN-002`, `EVD-FIN-006`, `EVD-FIN-008` | apresentar como decisão do FinControl | `approved` |
| `LI002-CLM-007` | processo | migrations e testes pgTAP fizeram parte da validação das releases de persistência | `EVD-FIN-002`, `EVD-FIN-006`, `EVD-FIN-008` | o snapshot remoto confirma migrations, enquanto pgTAP permanece sustentado pela evidência versionada | `approved` |
| `LI002-CLM-008` | limite | hardenings de autenticação e observabilidade ainda impedem afirmar prontidão pública completa | `project-context.md` | revalidar antes do draft e da publicação | `approved` |

## Claims bloqueados

- “100% seguro”, “impossível acessar dados de outro usuário” ou equivalentes;
- impacto comercial, quantidade de usuários ou incidentes evitados;
- RLS como substituta de autenticação, validação de aplicação ou constraints;
- detalhes de credenciais, usuário demo, tokens ou projeto remoto;
- capacidade de `UPDATE`/`DELETE` dentro das releases citadas.
