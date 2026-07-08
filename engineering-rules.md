# Engineering Rules

## Regra Mestre
Este projeto segue o sistema de engenharia assistida por IA definido pelo usuário: Feature-Based + Clean Architecture leve, Método Akita, TDD, small releases, governança por fases e documentação viva.

## Stack Obrigatória
- PWA
- Node.js
- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Jest
- TDD

## Arquitetura Obrigatória
Toda feature deve respeitar as camadas:
- `presentation`
- `application`
- `domain`
- `infrastructure`

Regras:
- UI não acessa banco diretamente.
- Domain não depende de framework.
- Infrastructure concentra integrações técnicas.
- Application orquestra casos de uso.
- App Router compõe rotas e layouts, sem regra de negócio pesada.

## Processo Obrigatório
- Contexto antes de código.
- Testes antes de implementação funcional relevante.
- Backlog antes de execução de feature.
- Pequenas entregas estáveis.
- Quality gates antes de considerar entrega pronta.
- Registro explícito de riscos, bloqueios e dívidas técnicas.

## Comandos Operacionais
- `dia 0`: bootstrap operacional
- `dia 1`: contexto, discovery e arquitetura
- `dia 2`: estratégia de testes e TDD
- `dia 3`: implementação mínima orientada por teste
- `dia 4`: expansão controlada
- `dia 5`: refatoração e hardening
- `dia 6`: UX, acessibilidade e PWA
- `dia 7`: qualidade final e entrega
- `status`, `bloqueios`, `próximo passo`, `reanalisar`
- `validar contexto`, `validar arquitetura`, `validar qualidade`
- `mostrar backlog`, `refinar backlog`, `priorizar backlog`

## Bloqueios Duros
A execução deve bloquear quando houver:
- contexto crítico ausente
- arquitetura conflitante
- regra de negócio central ambígua
- testes essenciais inexistentes para fase de implementação
- risco relevante de segurança em área crítica
- tentativa de pular fase

## Áreas Críticas
Exigem validação adicional:
- autenticação
- autorização
- RLS
- dados financeiros
- migrações de banco
- integrações externas sensíveis
- segredos
- Open Finance

## Antipadrões Proibidos
- Vibe coding
- One-shot implementation
- regra de negócio na UI
- banco acessado por componente React
- `any` sem justificativa técnica
- helpers genéricos sem necessidade real
- feature fora do backlog
- dívida técnica invisível

