# Segurança — FinControl

## Ambiente demonstrativo

O FinControl publicado é um ambiente de demonstração e estudo técnico. Não cadastre dados financeiros reais, informações pessoais sensíveis ou credenciais reutilizadas em outros serviços.

Credenciais da conta compartilhada, chaves, tokens, identificadores internos e dados demonstrativos não devem ser adicionados a issues, pull requests ou arquivos do repositório.

## Reportar uma vulnerabilidade

Não abra uma issue pública contendo detalhes exploráveis, dados pessoais, tokens ou provas que alterem registros de terceiros.

Use o recurso **Report a vulnerability** na aba Security do GitHub quando ele estiver habilitado. Se o canal privado ainda não estiver disponível, entre em contato com o mantenedor pelo perfil [JrDaliessi](https://github.com/JrDaliessi) sem incluir segredo ou dado de usuário na primeira mensagem.

Inclua, quando possível:

- descrição do comportamento observado;
- impacto provável;
- passos mínimos para reprodução sem dados reais;
- rota, versão ou commit afetado;
- sugestão de mitigação, se houver.

## Princípios aplicados

- isolamento por proprietário com RLS no PostgreSQL;
- menor privilégio e grants explícitos;
- autenticação e identidade verificadas nas fronteiras server-side;
- constraints e relacionamentos tenant-safe;
- migrations forward-only e testes pgTAP;
- mensagens públicas sem enumeração desnecessária de contas;
- segredos fora do cliente e do controle de versão;
- validação, auditoria de dependências e build no CI.

Esses controles reduzem risco, mas não significam segurança absoluta. Pendências e limites conhecidos são registrados em `project-context.md`, `backlog.md` e `quality-gates.md`.

## Testes responsáveis

- use somente contas e dados criados por você ou destinados explicitamente à demonstração;
- não tente acessar, alterar ou excluir dados de outras pessoas;
- não execute carga, automação agressiva ou negação de serviço;
- não publique credenciais ou detalhes exploráveis antes da correção;
- interrompa o teste se houver risco de impacto sobre terceiros.

## Escopo técnico

As áreas relevantes incluem autenticação, autorização, RLS, APIs/RPCs, rotas privadas, configuração HTTP, dependências e exposição acidental de dados. Problemas exclusivamente visuais ou dúvidas de uso podem ser tratados como issue comum, desde que não revelem dados sensíveis.
