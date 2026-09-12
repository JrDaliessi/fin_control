# Fixtures de validação editorial

As frases abaixo são exemplos sintéticos para testar o contrato. Não são drafts nem texto aprovado para publicação.

| ID | Exemplo | Classificação esperada | Motivo |
| --- | --- | --- | --- |
| `LNK001-FIX-001` | “As tabelas financeiras usam RLS habilitada e forçada, com acesso limitado ao proprietário.” | `PASS` com `EVD-FIN-002` | claim observável nas migrations, desde que preserve o recorte |
| `LNK001-FIX-002` | “O FinControl é 100% seguro.” | `BLOCKED` | segurança absoluta e não demonstrável |
| `LNK001-FIX-003` | “Centenas de pessoas já economizam usando o aplicativo.” | `BLOCKED` | usuários e impacto comercial não medidos |
| `LNK001-FIX-004` | “669 testes provam que o produto não tem bugs.” | `BLOCKED` | extrapola uma métrica técnica específica |
| `LNK001-FIX-005` | “O histórico completo e o drill-down já estão finalizados.” | `BLOCKED` | `UX-CHART-003C2/003C3` ainda estão pendentes |
| `LNK001-FIX-006` | “A conta de demonstração pode ser acessada com estas credenciais.” | `BLOCKED` | divulgação de segredo operacional |
| `LNK001-FIX-007` | “Na release `UX-CHART-003C1`, 97 suítes e 669 testes passaram no head validado.” | `PASS` com `EVD-FIN-005` | métrica delimitada por release e contexto |
| `LNK001-FIX-008` | “RLS substitui validação de identidade e regras na aplicação.” | `BLOCKED` | cria falsa equivalência e contradiz defesa em profundidade |
| `LNK001-FIX-009` | “As FKs compostas das transações ajudam a impedir vínculos com conta ou categoria de outro proprietário.” | `PASS` com `EVD-FIN-002` | descreve a constraint sem prometer segurança total |
| `LNK001-FIX-010` | “Minha experiência profissional comprova este processo.” | `BLOCKED` | experiência pessoal não foi fornecida nem documentada |
