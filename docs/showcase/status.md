# Status — REPO-SHOWCASE-001

- Estado: `READY_FOR_RELEASE`
- Modo: rápido, documental e sem alteração funcional
- Capabilities: `product`, `content`, `linkedin`; `software` somente como fonte de evidência
- Repositório público: confirmado em 2026-09-13
- Aplicação principal: `https://fin-control-two.vercel.app`
- Portfólio: `https://curriculo-web-ten.vercel.app/`
- Publicação no LinkedIn: não executada
- Commit/push/PR deste incremento: não executados

## Objetivo

Oferecer uma entrada curta e intuitiva para recrutadores, conectando produto, arquitetura, dados, segurança, testes e evolução futura sem obrigar a leitura de todo o histórico operacional.

## Entregáveis

- `README.md` orientado ao produto e à avaliação técnica;
- `docs/showcase/README.md` com roteiro de cinco minutos;
- `docs/showcase/backend-evolution-roadmap.md` com etapas e decisões abertas;
- `adr/0023-incremental-nestjs-api-extraction.md` com contexto, alternativas e consequências;
- `SECURITY.md` com limites do ambiente demo e reporte responsável;
- projeto, stack, arquitetura, backlog, roadmap e Context Map sincronizados.
- `CONTRIBUTING.md`, template de PR e convenções Git alinhados ao fluxo público atual.

## Restrições preservadas

- nenhum arquivo em `src/`, `supabase/`, `public/`, dependências ou configuração de runtime foi alterado;
- NestJS é direção futura, não capacidade entregue;
- nenhuma credencial ou dado da conta demo é publicado;
- nenhuma postagem ou ação externa no LinkedIn é realizada;
- `UX-CHART-003C2` permanece pausada após o Dia 2.

## Validação executada

- repositório confirmado como público pelo GitHub;
- link principal validado em navegador, com redirecionamento esperado para `/login`;
- portfólio validado em navegador, com seção FinControl e acesso demonstrativo visíveis;
- links relativos dos seis documentos públicos principais válidos;
- `context-map.yaml`, `capability-registry.yaml` e `.agents/registry.yaml` parseados;
- escopo verificado sem alteração em código, banco, assets, dependências ou runtime;
- varredura dos documentos novos sem e-mail/senha da conta demo ou secret key;
- `git diff --check`, ESLint e type-check verdes;
- regressão completa com 97 suítes e 669 testes verdes, sem snapshots;
- auditoria npm com zero vulnerabilidades;
- build de produção Next.js 16.3.3 verde, com todas as rotas geradas;
- claims confrontados com arquitetura, modelo de dados, ADRs, releases e banco de evidências.
- histórico público revisado: PRs recentes possuem boa evidência; padrão futuro corrige títulos genéricos e divergência de branches sem reescrever commits antigos.

## Pendência humana

- revisar o texto público antes do commit;
- corrigir no portfólio o link de código do FinControl, que ainda aponta para o `fincontrol-showcase` descontinuado em vez de `JrDaliessi/fin_control`;
- escolher uma licença antes de permitir reutilização do código, se desejado.
- publicar a apresentação na branch padrão `main`; o README público atual ainda é a versão anterior.

## Próximo passo

Após aprovação humana, criar uma branch documental a partir de `main`, versionar o incremento e abrir uma PR exclusiva. Não misturar a publicação do showcase com os testes RED da PR #35.
