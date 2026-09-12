# Engineering Rules — FinControl

## Governança

O FinControl segue Regras IDE v4: Método Akita, XP, Validation First, small releases, Context Engineering, documentação viva, controle humano e capabilities sob demanda.

Fontes de processo:

- estado e rotas atuais: `project-context.md` e `context-map.yaml`;
- intenção: `project-brief.md` e `docs/product/prd.md`;
- arquitetura: `architecture.md` e ADR ativo mais recente;
- prioridade: `backlog.md` e `roadmap.md`;
- validação: `quality-gates.md`, specs e testes;
- histórico: `docs/history/` e `docs/releases/`, sem autoload.

## Stack Aprovada do Projeto

A v4 não presume stack universal. A stack deste projeto foi aprovada nos ciclos anteriores e está consolidada em `project-stack.md`; versões e comandos vigentes permanecem em `package.json` e `project-toolchain.md`.

Qualquer mudança estrutural de tecnologia exige opções, trade-offs e decisão humana registrada.

## Capabilities Ativas

- `software`;
- `product`;
- núcleo de governança, contexto, qualidade e rastreabilidade.

Outras capabilities permanecem desativadas até necessidade e aprovação registradas em `capability-registry.yaml`.

## Arquitetura Obrigatória

Feature-Based + Clean Architecture leve:

- `presentation`: UI e estados visuais, sem regra de negócio pesada ou banco;
- `application`: casos de uso e orquestração;
- `domain`: entidades, contratos e regras puras;
- `infrastructure`: persistência, APIs e adapters concretos.

`src/app` compõe rotas e dependências. Supabase permanece isolado em infraestrutura e sujeito a RLS, identidade da sessão e privilégio mínimo.

## Processo Obrigatório

1. classificar o pedido;
2. ler Hot Context e mapa;
3. carregar o workflow e Warm Context relevantes;
4. descobrir dependências e expandir contexto se necessário;
5. definir validação antes de produzir;
6. declarar escopo, agents, skills, bloqueios e estados;
7. obter aprovação humana da fase;
8. executar somente a small release aprovada;
9. validar, atualizar documentação e registrar próximo passo;
10. não avançar automaticamente.

## TDD e Quality Gates

Comportamento implementável ou correção de bug segue RED → GREEN → REFACTOR. Testes existentes são memória executável e não podem ser enfraquecidos apenas para passar.

Gates de software aplicáveis: lint, type-check, testes, build, arquitetura, segurança/RLS, migration/rollback, dependências, observabilidade e release readiness.

## Comandos Operacionais

- fases: `dia 0` a `dia 7`, `corrigir dia X`, `reexecutar dia X`, `resumo do dia X`;
- inspeção: `status`, `bloqueios`, `próximo passo`, `reanalisar`, `mostrar backlog`;
- feature: `iniciar`, `quebrar`, `gerar validação`, `gerar testes`, `implementar`, `refatorar`;
- validação: `validar contexto`, `validar arquitetura`, `validar qualidade`, `validar rastreabilidade`;
- modo condensado: `modo rápido`, somente sob os critérios da v4.

## Bloqueios e Segurança

Contexto crítico ausente, requisito central ambíguo, conflito arquitetural, validação essencial inexistente ou risco crítico de segurança bloqueiam o escopo afetado.

Auth, autorização, RLS, dados financeiros, migrations, agendamentos, integrações sensíveis, segredos e produção exigem validação adicional. A política operacional detalhada está em `docs/governance/ai-jail.md`.

## Antipadrões Proibidos

- vibe coding ou one-shot;
- expansão silenciosa de escopo;
- regra de negócio em UI ou banco acessado por componente;
- duplicação, abstração prematura ou `any` injustificado;
- teste alterado apenas para ficar verde;
- dívida, risco ou fonte inventada;
- contexto append-only ou regra vigente somente no histórico;
- liberar sem evidência ou autoridade necessária.
