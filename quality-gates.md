# Quality Gates

## Gate de Contexto
- `project-context.md` existe e está atualizado.
- Estado da máquina de estados está explícito.
- Fase atual e próximo passo estão documentados.
- Bloqueios e riscos estão registrados.

## Gate de Arquitetura
- Feature respeita `presentation`, `application`, `domain`, `infrastructure`.
- UI não acessa Supabase diretamente.
- Domain não depende de frameworks.
- Infrastructure concentra integrações externas.
- Contratos entre camadas estão claros.

## Gate de TDD
- Testes essenciais existem antes de implementação funcional relevante.
- Domain e application têm prioridade de cobertura.
- Cenários críticos foram cobertos.
- Bugs começam por teste de reprodução.

## Gate de Qualidade Automatizada
A cada entrega relevante:
- lint deve passar
- type-check deve passar
- testes devem passar
- build deve passar

## Gate de Segurança
Obrigatório para áreas críticas:
- autenticação revisada
- autorização revisada
- RLS planejado ou implementado
- segredos fora do código
- dados financeiros protegidos
- ações sensíveis exigem confirmação do usuário

## Gate de PWA e UX
- layout mobile first
- estados principais de UI definidos
- acessibilidade mínima revisada
- manifest e ícones planejados ou implementados
- offline não deve ser prometido sem estratégia real

## Gate de Release
Uma release incremental só pode ser considerada pronta quando:
- critérios de pronto da fase foram satisfeitos
- quality gates aplicáveis estão verdes
- riscos remanescentes foram documentados
- backlog foi atualizado
- próximo passo está claro

