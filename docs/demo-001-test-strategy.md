# DEMO-001 — Estratégia de testes da restauração da conta de recrutadores

- Fase: Dia 2 — Estratégia de testes e fundação TDD
- Estado de entrada: `ARCHITECTURE_READY`
- Estado de saída esperado: `TEST_STRATEGY_READY`
- Data: 2026-09-05
- Decisão arquitetural: `adr/0021-recruiter-demo-account-reset.md`

## Objetivo

Provar antes da implementação que a restauração encontra exatamente uma conta marcada por metadados administrativos, substitui somente os dados financeiros desse tenant por uma baseline determinística e permanece inacessível aos papéis da aplicação.

## Matriz por small release

| Small release | Camada | Contrato principal | Cenário feliz | Cenários críticos | Evidência planejada |
| --- | --- | --- | --- | --- | --- |
| `DEMO-001A` | Estrutura Postgres | função privada com assinatura única | `private.reset_recruiter_demo_data(date)` pertence a `postgres` | função exposta, overload ou privilégios herdados | pgTAP de catálogo e ACL |
| `DEMO-001A` | Segurança | executor exclusivamente administrativo | `postgres` pode executar | `PUBLIC`, `anon`, `authenticated` e `service_role` não usam schema nem função | pgTAP de ACL |
| `DEMO-001A` | Alvo | cardinalidade exata por `raw_app_meta_data` | um tenant `demo` + `recruiter` é restaurado | zero ou múltiplos candidatos falham antes de mutar dados | pgTAP comportamental |
| `DEMO-001A` | Integridade | baseline determinística | termina com 3 contas, 6 categorias e 8 transações | dados extras, IDs efêmeros e ordem referencial | pgTAP comportamental |
| `DEMO-001A` | Isolamento | mutação restrita ao tenant demo | dados comuns permanecem byte a byte iguais | tentativa de atingir segundo tenant | snapshot pgTAP |
| `DEMO-001A` | Atomicidade | reset em um único statement/transação | operação completa é confirmada | falha forçada durante reinserção restaura o estado anterior | constraint temporária + pgTAP |
| `DEMO-001A` | Datas | referência civil explícita | offsets `-4` a `0` relativos à data recebida | data nula e movimento futuro | pgTAP comportamental |
| `DEMO-001A` | Idempotência | conteúdo lógico estável | duas chamadas geram a mesma baseline | duplicação ou resíduos da chamada anterior | snapshot lógico pgTAP |
| `DEMO-001B` | Cron | job diário único | nome, agenda e comando aprovados | duplicidade, executor incorreto, segredo ou identidade fixa | pgTAP de `cron.job` após migration |
| `DEMO-001C` | Concorrência | advisory lock transacional | chamadas são serializadas | duas sessões intercalam exclusão e reinserção | teste de integração com duas conexões |
| `DEMO-001C` | Observabilidade | histórico restrito ao próprio job | sucesso e falha são consultáveis | retenção remove histórico de outros jobs | pgTAP de `cron.job_run_details` |
| `DEMO-001C` | Aplicação/RLS | login permanece válido | conta demo lê somente a baseline pelo fluxo público | bypass de RLS ou sessão invalidada | smoke test autenticado |

## Fixtures da DEMO-001A

- um usuário permanente sem metadados de demonstração;
- um usuário com `app_metadata.account_type = demo` e `app_metadata.audience = recruiter`;
- um segundo candidato usado apenas para provar a rejeição de cardinalidade múltipla;
- dados financeiros preexistentes e deliberadamente diferentes da baseline;
- constraint temporária que rejeita uma categoria da baseline para provar rollback atômico;
- data de referência fixa `2026-09-05`.

## Baseline lógica aprovada

Contas:

- `Carteira Demo`, `cash`, R$ 150,00;
- `Conta Corrente Demo`, `checking`, R$ 3.500,00;
- `Reserva Demo`, `savings`, R$ 12.500,00.

Categorias:

- despesas: `Alimentação`, `Moradia`, `Serviços`, `Transporte`;
- receitas: `Renda extra`, `Salário`.

Transações relativas à data de referência:

- `-4`: salário mensal;
- `-3`: aluguel residencial;
- `-2`: supermercado e internet/celular;
- `-1`: projeto freelancer e transporte por aplicativo;
- `0`: café/almoço e cashback.

Nenhuma migration deve conter e-mail, senha ou UUID da conta real. IDs e timestamps da baseline são efêmeros e não fazem parte da comparação de idempotência.

## RED esperado

- o schema `private` ainda não existe;
- a função `private.reset_recruiter_demo_data(date)` ainda não existe;
- os testes estruturais e comportamentais falham exclusivamente por essa implementação ausente;
- os arquivos existentes e os dados remotos permanecem inalterados, pois toda fixture roda entre `begin` e `rollback`.

## Limites do Dia 2

- nenhuma função, migration, extensão persistente ou job;
- nenhuma execução persistente da restauração;
- nenhuma API Route, Server Action, Edge Function ou UI;
- nenhuma credencial ou identidade fixa no repositório;
- contratos executáveis de Cron, concorrência e smoke test serão adicionados nos recortes `DEMO-001B/C`, próximos de suas respectivas implementações.

## Critério de conclusão

- matriz de testes e fixtures documentadas;
- contratos pgTAP da `DEMO-001A` criados primeiro;
- RED direcionado executado e classificado;
- baseline anterior continua verde isoladamente;
- `git diff --check` permanece verde;
- implementação bloqueada até comando explícito `dia 3`.
