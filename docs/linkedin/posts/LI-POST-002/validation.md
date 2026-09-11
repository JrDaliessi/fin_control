# Validação pré-draft — LI-POST-002

- Estado: `READY`
- Draft existente: não
- Publicação autorizada: não

## Estrutura

- [x] problema, objetivo e público definidos;
- [x] mensagem central e estrutura sugerida definidas;
- [x] CTA, dependências e critérios de aceite definidos;
- [x] `brief.md` e `sources.md` existem antes do draft.

## Factual

- [x] oito claims delimitados em `claim-matrix.md`;
- [x] claims usam `EVD-FIN-002`/`006` ou risco atual explicitamente referenciado;
- [x] migrations locais confirmam RLS enabled/forced, grants `SELECT/INSERT` e policies por proprietário;
- [x] migration de transações confirma FKs compostas tenant-safe;
- [x] linguagem de segurança absoluta permanece bloqueada;
- [x] métricas e impacto comercial permanecem fora.

## Privacidade

- [x] nenhum e-mail, senha, token, UUID ou dado financeiro necessário;
- [x] conta demo não será identificada;
- [x] eventual screenshot exigirá revisão própria e texto alternativo;
- [x] nenhum acesso ao Supabase remoto era necessário para liberar o contrato pré-draft.

## Verificação complementar após o draft

- [x] inspeção read-only pelo plugin MCP confirmou os controles citados;
- [x] o resultado foi registrado como `EVD-FIN-008` sem consultar linhas de negócio;
- [x] nenhuma migration, configuração, policy, grant ou dado foi alterado;
- [x] `SEC-AUTH-001` permaneceu explícita como pendência, sem ampliar o escopo editorial.

## Resultado

O brief está pronto para gerar o primeiro draft mínimo no Dia 3. O draft deverá explicar RLS na primeira ocorrência, usar no máximo os oito claims aprovados e explicitar que os controles não equivalem a segurança absoluta.
