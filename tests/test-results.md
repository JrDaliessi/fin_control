# Test Results — Dia 2

## Comandos Executados

## Dia 7

### `npm run test:ci`
Resultado: passou.

Evidência:
- 5 suites passaram.
- 32 testes passaram.

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

### Revisão de segurança local
Resultado: passou com riscos residuais documentados.

Evidência:
- apenas `.env.example` está versionado entre arquivos de ambiente
- `.env` reais estão ignorados pelo Git
- presentation e App Router não acessam Supabase diretamente
- nenhum `any` encontrado em `src` ou `tests`
- nenhum segredo real identificado nos arquivos versionáveis verificados

## Dia 6

### `npm run test:ci`
Resultado: passou.

Evidência:
- 5 suites passaram.
- 32 testes passaram.

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

### Verificação HTTP local
Resultado: passou parcialmente.

Evidência:
- `http://localhost:3000/` respondeu com status 200.
- `http://localhost:3000/manifest.webmanifest` respondeu com status 200.
- Navegação pelo navegador integrado travou em timeout e não foi usada como evidência final.

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

## Dia 7 — SR-006

### `npm run lint`
Resultado: passou, 0 warnings.

### `npm run type-check`
Resultado: passou.

### `npm run test:ci`
Resultado: passou.

Evidência:
- 14 suites passaram.
- 69 testes passaram.

### `npm audit --audit-level=high`
Resultado: passou.

Evidência:
- 0 vulnerabilidades.

### `npm run build`
Resultado: passou.

Evidência:
- Next.js compilou `/`, `/dashboard` e `/transactions`.
- Workflow de CI versionado para reproduzir os mesmos gates.

## Dia 2 — SR-007

### Testes direcionados de accounts
Resultado: falha esperada.

Evidência:
- 2 suítes falharam com `Cannot find module`.
- módulos ausentes: `FinancialAccount`, `AccountRepository` e `CreateAccountUseCase`.
- nenhuma implementação funcional foi criada.

### Suíte anterior isolada
Resultado: passou.

Evidência:
- 14 suítes passaram.
- 69 testes passaram.

### `npm run type-check`
Resultado: falha esperada.

Evidência:
- quatro erros `TS2307` referentes exclusivamente aos módulos ainda ausentes da SR-007.

### `npm run lint`
Resultado: passou, sem warnings.

### `npm audit --omit=dev`
Resultado: passou, 0 vulnerabilidades.

Interpretação:
- etapa vermelha do TDD confirmada.
- implementação mínima autorizável somente no Dia 3.

## Dia 3 — SR-007

### Testes direcionados de accounts
Resultado: passou.

Evidência:
- 2 suítes passaram.
- 21 testes passaram.

### Suíte completa
Resultado: passou.

Evidência:
- 16 suítes passaram.
- 90 testes passaram.

### `npm run type-check`
Resultado: passou.

### `npm run lint`
Resultado: passou, sem warnings.

### `npm audit --omit=dev`
Resultado: passou, 0 vulnerabilidades.

### `npm run build`
Resultado: passou.

Evidência:
- Next.js compilou `/`, `/dashboard` e `/transactions`.

Interpretação:
- implementação mínima satisfez os testes sem expandir apresentação ou infraestrutura.
- próxima expansão controlada depende do comando `dia 4`.

## Dia 4 — SR-007

### Etapa vermelha de apresentação
Resultado: falha esperada.

Evidência:
- quatro suítes falharam por formulário, provider, página e rota ausentes.
- cenário do dashboard falhou pelo link `Contas` ainda inexistente.

### Testes direcionados
Resultado: passou.

Evidência:
- 7 suítes passaram.
- 35 testes passaram.

### Suíte completa
Resultado: passou.

Evidência:
- 20 suítes passaram.
- 99 testes passaram.

### Quality gates
- type-check: passou após correção da tipagem do mock de teste.
- lint: passou, sem warnings.
- audit de produção: passou, 0 vulnerabilidades.
- build: passou com a nova rota `/accounts`.

Interpretação:
- expansão controlada utilizável durante a sessão.
- persistência, autenticação e RLS continuam fora do escopo.

## Dia 5 — SR-007

### Etapa vermelha de hardening
Resultado: falha esperada.

Evidência:
- parser monetário compartilhado ainda não existia.
- mutação da conta inicial alterou o estado da sessão.
- mutação da conta retornada alterou o estado após nova renderização.

### Testes direcionados
Resultado: passou.

Evidência:
- 4 suítes passaram.
- 28 testes passaram.

### Suíte completa
Resultado: passou.

Evidência:
- 21 suítes passaram.
- 109 testes passaram.

### Quality gates
- type-check: passou.
- lint: passou, sem warnings.
- audit de produção: passou, 0 vulnerabilidades.
- build: passou com `/accounts` preservada.

Interpretação:
- duplicação monetária removida sem regressão.
- sessão local protegida contra referências externas mutáveis.

## Dia 2 — SR-011

### Baseline anterior

- Jest: 53 suítes e 255 testes passaram.
- type-check: passou.
- lint: passou, 0 warnings.
- audit de produção: 0 vulnerabilidades.

### RED direcionado

- 3 suítes falharam.
- 9 testes falharam e 11 passaram.
- mapper e repository falharam por módulos deliberadamente ausentes.
- domínio falhou por `Transaction.restore`, normalização de notas e limites ainda ausentes.

### Type-check RED

- 5 erros planejados.
- 2 `TS2307`: mapper e repository ausentes.
- 3 `TS2339`: `Transaction.restore` ausente.

### Rede anterior

- 52 suítes e 244 testes passaram ao excluir somente os três contratos RED.
- lint permaneceu verde.

### Banco

- 87 asserções pgTAP planejadas e contadas mecanicamente.
- RED remoto: 1 falha de 1 porque `public.transactions` não existe.
- rollback confirmado: nenhuma tabela, migration, extensão ou fixture persistida.

Interpretação:
- estado vermelho válido do TDD confirmado.
- implementação autorizável somente após comando explícito `dia 3`.

## Dia 3 — SR-011

### RED reproduzido

- 3 suítes falharam.
- 9 testes falharam e 11 passaram.
- type-check apresentou 5 erros planejados.

### GREEN direcionado

- 5 suítes passaram.
- 34 testes passaram.
- entidade, mapper e repository satisfizeram os contratos aprovados.

### Banco Supabase

- migrations aplicadas e alinhadas: `20260717070131_create_transactions` e `20260717070559_add_transaction_fk_indexes`.
- schema: 46/46 asserções pgTAP.
- constraints: 21/21 asserções pgTAP.
- RLS: 17/17 asserções pgTAP.
- performance: 5/5 asserções pgTAP.
- total: 89/89 asserções.
- rollback confirmado: 0 transações e extensão pgTAP ausente após os testes.
- advisor de segurança manteve apenas `SEC-AUTH-001`.
- avisos de FKs sem índice foram eliminados; índices novos ainda constam como não usados por ausência de dados.

### Pipeline completo

- Jest: 55 suítes e 271 testes passaram.
- type-check: passou.
- lint: passou, 0 warnings.
- audit de produção: passou, 0 vulnerabilidades.
- build: passou com `/transactions` dinâmica e Proxy ativo.

Interpretação:
- implementação mínima e persistência tenant-safe concluídas.
- composição autenticada e apresentação persistente permanecem bloqueadas até `dia 4`.

## Dia 4 — SR-011

### RED direcionado

- baseline da feature: 11 suítes e 66 testes passaram.
- 6 suítes novas falharam pela ausência dos contratos de DTO, listagem mensal, Server Actions, estados de rota e composição persistente.
- a apresentação antiga ainda enviava `userId`, usava `Date` e linguagem de sessão local.

### GREEN direcionado

- 8 suítes passaram.
- 33 testes passaram.
- DTO sem ownership, data civil, identidade server-side, filtro de categorias, loading, erro, vazio e bloqueio por configuração ausente foram validados.

### Regressão completa

- 61 suítes passaram.
- 289 testes passaram.
- type-check passou.
- lint passou, 0 warnings.
- auditoria passou, 0 vulnerabilidades.
- build passou com `/transactions` dinâmica e Proxy ativo.

### Navegador

- sessão autenticada carregou `/transactions`.
- loading transitório e estados persistentes vazios foram observados.
- formulário bloqueado corretamente por ausência de categoria, com CTA para `/categories`.
- console sem erros ou warnings; nenhuma fixture foi persistida.

Interpretação:
- expansão controlada concluída sem regressão e sem expor `userId` na apresentação.
- criação real no navegador permanece não exercitada pela ausência de categoria na sessão inspecionada, mas está coberta pelos testes de action e infraestrutura.
- próximo passo válido: `dia 5` da SR-011.

## Dia 5 — SR-011

### Baseline e auditoria

- 17 suítes e 84 testes da feature passaram antes da refatoração.
- consulta mensal duplicada confirmada na composition root.
- casts de IDs persistidos confirmados no mapeamento para DTO.
- arquivos maiores revisados; nenhuma divisão artificial foi necessária.

### RED direcionado

- 3 suítes falharam.
- 4 testes falharam e 10 passaram.
- a action realizou duas consultas mensais em vez de uma.
- cálculo reutilizável e mapeadores persistidos ainda não existiam.
- type-check falhou somente pelos três exports planejados ausentes.

### GREEN e regressão

- GREEN direcionado: 3 suítes e 14 testes passaram.
- regressão completa: 61 suítes e 292 testes passaram.
- type-check passou.
- lint passou, 0 warnings.
- auditoria passou, 0 vulnerabilidades.
- build passou com `/transactions` dinâmica e Proxy ativo.

Interpretação:
- `TX-PERF-001` concluída sem alterar resultados financeiros.
- lista e resumo agora compartilham uma única leitura mensal.
- DTOs rejeitam conta ou categoria sem ID persistido.
- próximo passo válido: `dia 6` da SR-011.

## Dia 6 — SR-011

### Baseline e inspeção

- 17 suítes e 87 testes da feature passaram antes da mudança.
- desktop padrão, `390 x 844` e `320 x 800` foram inspecionados sem overflow horizontal.
- alvos visíveis mantiveram pelo menos 44 px; `lang`, viewport, `theme-color` e manifest foram confirmados.
- a sessão real não possui categoria, portanto o formulário permaneceu corretamente bloqueado e nenhuma fixture foi criada.

### RED direcionado

- 1 suíte executada, com 2 testes falhando e 11 passando.
- descrição e demais campos permaneciam editáveis durante uma requisição pendente.
- o foco permanecia no botão após erro local de valor.
- o feedback inválido ainda não era limpo ao corrigir o campo.

### GREEN e regressão

- GREEN direcionado: 1 suíte e 13 testes passaram.
- regressão completa: 61 suítes e 292 testes passaram.
- type-check passou.
- lint passou, 0 warnings.
- auditoria passou, 0 vulnerabilidades.
- build passou com `/transactions` dinâmica e Proxy ativo.
- `git diff --check` passou, com avisos esperados de normalização LF/CRLF.

Interpretação:
- o formulário impede mutações concorrentes, direciona o foco ao campo inválido e remove feedback obsoleto durante a correção.
- responsividade e base PWA permaneceram coerentes sem antecipar offline ou cache financeiro.
- próximo passo válido: `dia 7` da SR-011.

## Dia 7 — SR-011

### Correção de segurança em TDD

- auditoria identificou que o Proxy aceitava usuário Auth anônimo porque validava apenas a presença de `sub`.
- RED isolado: 1 teste falhou e 6 passaram; a rota privada não redirecionou `is_anonymous=true`.
- GREEN isolado: 1 suíte e 8 testes passaram após exigir subject válido e usuário permanente.
- Server Actions e RLS já aplicavam o bloqueio e permaneceram inalteradas.

### Pipeline completo

- Jest: 61 suítes e 294 testes passaram.
- type-check: passou.
- lint: passou, 0 warnings.
- audit: passou, 0 vulnerabilidades.
- build: passou com `/transactions` dinâmica e Proxy ativo.
- `git diff --check`: passou, com avisos esperados de normalização LF/CRLF.

### Supabase

- migrations locais e remotas: 5 versões alinhadas.
- schema: 46/46 asserções pgTAP.
- constraints: 21/21 asserções pgTAP.
- RLS: 17/17 asserções pgTAP.
- performance: 5/5 asserções pgTAP.
- total: 89/89 asserções.
- rollback confirmou 1 transação antes/depois e extensão `pgtap` ausente.
- Performance Advisor: sem alertas.
- Security Advisor: somente `SEC-AUTH-001`.

Interpretação:
- Proxy, Server Actions e RLS aplicam contrato consistente para usuário permanente.
- grants mínimos, ownership e vínculos cross-tenant permanecem protegidos.
- SR-011 está `READY_FOR_RELEASE` como entrega incremental de código.
- deploy público permanece bloqueado por `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001`.
