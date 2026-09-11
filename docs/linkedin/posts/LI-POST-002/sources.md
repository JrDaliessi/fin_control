# Fontes — LI-POST-002

| Evidência | Fonte | Uso permitido |
| --- | --- | --- |
| `EVD-FIN-002` | `database-model.md` | ownership, constraints, grants mínimos e estratégia RLS |
| `EVD-FIN-002` | `supabase/migrations/20260714053335_create_financial_accounts.sql` | fundação persistente de contas |
| `EVD-FIN-002` | `supabase/migrations/20260717022313_create_categories.sql` | categorias próprias e políticas relacionadas |
| `EVD-FIN-002` | `supabase/migrations/20260717070131_create_transactions.sql` | ownership e integridade das transações |
| `EVD-FIN-006` | `quality-gates.md` e `engineering-rules.md` | processo de validação, segurança e rastreabilidade |
| `EVD-FIN-008` | `supabase-evidence-2026-09-10.md` | confirmação read-only do estado remoto e registro da pendência `SEC-AUTH-001` |

Antes do draft, confirmar que os riscos globais citados em `project-context.md` continuam atuais.
