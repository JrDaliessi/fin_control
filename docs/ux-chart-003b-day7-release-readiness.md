# UX-CHART-003B — Dia 7: qualidade e release readiness

- Data: 2026-09-08
- Estado de entrada: `QUALITY_VALIDATION`
- Estado de saída: `READY_FOR_RELEASE`
- Branch validada: `codex/ux-chart-003b-periodos-historicos`
- Head validado: `5211303`
- PR existente: `#28`

## Escopo validado

O gate cobre exclusivamente `UX-CHART-003B`: presets `3M` e `Ano`, buckets semanais/mensais, consumo server-side dos agregados, linha, candles, tabelas e integração com o extrato contextual. `Tudo`, intervalo personalizado e drill-down trimestral permanecem em `UX-CHART-003C`.

## Quality gates locais

| Gate | Resultado |
| --- | --- |
| Jest | 95 suítes e 621 testes verdes |
| Snapshots | 0 |
| ESLint | verde, zero warnings |
| TypeScript | verde |
| Build | Next.js 16.3.3/Turbopack verde |
| npm audit | zero vulnerabilidades |
| Supply chain | 701 assinaturas e 102 attestations verificadas |
| Diff | `git diff --check` verde |

O build alterou `next-env.d.ts` automaticamente e o arquivo foi restaurado ao conteúdo versionado. O cache temporário da auditoria também foi removido.

## Segurança e privacidade

- Nenhum service role, segredo Supabase, private key, token GitHub/Stripe/AWS ou JWT literal foi encontrado nos arquivos rastreados.
- Somente `.env.example` é versionado; `.env.local` permanece ignorado.
- A presentation de `financial-analytics` não acessa Supabase diretamente.
- O histórico longo que chega ao browser contém apenas buckets agregados; descrições e lançamentos são consultados sob demanda no extrato.
- A migration limita duração a 366 dias, quantidade a 60 buckets e bucket à allowlist `week | month`.
- A autoridade deriva da sessão; não existe parâmetro de proprietário fornecido pelo cliente.
- Nenhum valor financeiro, e-mail, UUID, token ou payload bruto foi adicionado a logs.

## Supabase

- Projeto `nrisvhzlkqwzaphztaxf`: `ACTIVE_HEALTHY`, PostgreSQL 17.6.1, `sa-east-1`.
- Sete migrations locais e remotas alinhadas.
- RLS habilitada em `financial_accounts`, `categories` e `transactions`.
- `load_financial_evolution_snapshot` e `load_financial_evolution_buckets` usam `SECURITY INVOKER`, `search_path = ''` e execução somente para `authenticated`.
- Security Advisor: somente o alerta conhecido `SEC-AUTH-001`.
- Performance Advisor: somente a informação global de índice de contas ainda sem uso; nenhum índice desta feature foi recomendado.

Nenhuma migration, policy, grant, função, extensão ou dado foi alterado neste gate.

## Vercel e observabilidade

- Projeto ativo: `prj_G2U1I0AKTCyMlMm9ydglk2B17y2g`.
- Preview: `dpl_45j3kHfLgUY7CNTGbyhLrVxnxWX4`.
- Commit: `5211303cb9feb6381e19ba44eb9bf3a0dc099fb1`.
- Estado: `READY`; origem Git e PR `#28`.
- Resposta real: HTTP 200.
- Janela de 24 horas: nenhum runtime error e nenhum log `error/fatal`.
- Vercel Toolbar: nenhum comentário aberto na branch.
- Headers confirmados: CSP restritiva, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, Referrer Policy, Permissions Policy e `noindex`.

O Preview é suficiente para este gate; nenhum deploy manual ou promoção foi executado.

## Smoke test autenticado

- `3M` navegou para `?period=three_months`, anunciou semana e exibiu 14 buckets na tabela semanal.
- `Ano` navegou para `?period=year`, anunciou mês e exibiu 12 buckets na tabela mensal.
- Linha e candles preservaram nomes acessíveis em português; o renderer interno não duplicou a imagem na árvore acessível.
- A troca de visualização manteve `aria-pressed` coerente e a tabela equivalente.
- O acesso por `Ver extrato` abriu o diálogo com foco inicial no fechamento.
- Um intervalo com movimentação exibiu 6 movimentos, volume de R$ 3.400,00, resultado líquido de -R$ 200,00 e insight de 53% do volume em despesas.
- `Escape` fechou o diálogo, restaurou o foco ao acionador e liberou a rolagem do documento.
- Em 1280 px, `clientWidth` e `scrollWidth` do documento permaneceram iguais.

## PWA e acessibilidade

- `lang="pt-BR"`, viewport responsiva e theme colors permanecem presentes.
- Manifesto `standalone` mantém ícones 192, 512 e maskable.
- Alvos dos períodos permanecem com 44 px, nomes completos, `aria-pressed`, teclado e gesto horizontal.
- Tabelas continuam sendo a alternativa textual integral dos gráficos.
- A aplicação não promete offline: service worker continua fora deste recorte.

## Riscos residuais

1. **BAIXO — viewport isolado:** o conector atual não oferece emulação autenticada de 320/390/768 px. O risco é mitigado pelos contratos Jest de responsividade, rolagem confinada, alvo mínimo e pela validação real de 320 px da predecessora `003A`.
2. **MÉDIO — CI-VERCEL-002:** package/CI validam Node 22, enquanto o projeto Vercel declara Node 24. O Preview construiu e operou normalmente, mas o ambiente deve ser alinhado antes de uso direto da CLI ou promoção.
3. **Globais pré-produção:** `SEC-AUTH-001`, `HARD-OBS-001` e `SEC-HARD-001B` continuam no backlog. Não bloqueiam o merge incremental da `003B`, mas devem ser respeitados antes de ampliar a exposição pública.

## Decisão de release

`UX-CHART-003B` está **READY_FOR_RELEASE** para versionamento e atualização da PR `#28`. Não há bloqueio crítico específico da feature.

Próxima ação recomendada: criar o commit documental do Dia 7, fazer push da branch e atualizar a PR existente. Merge, deploy e início da `UX-CHART-003C` exigem comandos próprios.
