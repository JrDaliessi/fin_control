# Quality Gates

## Gate de Contexto
- `project-context.md` existe e está atualizado.
- Estado da máquina de estados está explícito.
- Fase atual e próximo passo estão documentados.
- Bloqueios e riscos estão registrados.

## Gate do Dia 1
- Visão do produto refinada.
- Escopo inicial validado.
- Módulos do MVP definidos.
- Domínio inicial documentado.
- Contratos principais entre camadas mapeados.
- Primeira small release selecionada.
- Backlog fatiado em small releases.
- Dependências críticas e bloqueios documentados.

## Gate do Dia 2
- Setup técnico mínimo criado.
- Jest configurado.
- Testing Library configurada.
- Matriz de testes documentada.
- Testes essenciais de domínio criados.
- Testes essenciais de aplicação criados.
- Testes falham antes da implementação.
- Lint passa.
- Audit sem vulnerabilidades conhecidas.
- Implementação funcional segue bloqueada até Dia 3.

## Gate do Dia 3
- Código mínimo funcional implementado.
- Entidade de domínio criada sem dependência de framework.
- Caso de uso criado sem dependência de UI.
- Persistência acessada apenas por contrato.
- Testes principais passando.
- Type-check passando.
- Lint passando.
- Build passando.
- Audit sem vulnerabilidades conhecidas.
- Escopo não expandido para módulos fora da small release.

## Gate do Dia 4
- Presentation inicial criada.
- Estados de idle, loading, success e error implementados quando aplicável.
- UI não acessa Supabase diretamente.
- UI não contém regra de negócio pesada.
- Testes relevantes de frontend criados.
- Testes passando.
- Type-check passando.
- Lint passando.
- Build passando.
- Audit sem vulnerabilidades conhecidas.
- Escopo não expandido para cartão, parcelas, dashboard completo, IA, importação ou Open Finance.

## Gate do Dia 5
- Arquivos inchados identificados.
- Plano de refatoração incremental documentado.
- Refatorações aplicadas preservando comportamento.
- Integridade de dados revisada.
- Consistência visual e estrutural preservada.
- Testes passando.
- Type-check passando.
- Lint passando.
- Build passando.
- Audit sem vulnerabilidades conhecidas.
- Escopo não expandido para nova feature de negócio.

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
