# Draft — LI-POST-002

Estado: candidato editorial aprovado e materializado em `final.md` em 2026-09-12. Não autorizado para publicação.

---

Filtrar dados por usuário apenas na interface não é uma fronteira de segurança suficiente — principalmente em um produto financeiro.

A tela pode esconder os registros corretamente enquanto a persistência aceita um relacionamento incompatível com o proprietário.

Por isso, no FinControl, a autorização continua depois que a requisição deixa a interface.

As tabelas de contas, categorias e transações possuem identificação do proprietário e usam RLS — Row Level Security, ou segurança em nível de linha — habilitada e forçada.

No recorte inicial:

- o papel autenticado recebeu somente permissão para consultar e inserir;
- as políticas de consulta e inserção verificam o proprietário e rejeitam identidades anônimas;
- as transações usam chaves estrangeiras compostas para ajudar a impedir vínculos com contas ou categorias de outro proprietário.

Um exemplo ajuda a visualizar: ao registrar uma transação, conta e categoria não são identificadores soltos. As chaves compostas também carregam o proprietário, ajudando a impedir relações entre recursos de usuários diferentes.

Enquanto a aplicação valida identidade e entradas, a RLS limita quais linhas a identidade autenticada pode consultar ou inserir.

O trade-off é tornar a estrutura do banco, suas alterações versionadas e os testes mais explícitos. Em troca, uma regra crítica deixa de depender exclusivamente do comportamento da interface.

As migrations — alterações versionadas do banco — foram registradas, e os testes de banco com pgTAP verificaram estrutura, permissões e isolamento entre usuários.

Isso não significa que o aplicativo seja “100% seguro”. Hardening de autenticação e observabilidade ainda fazem parte do trabalho necessário antes de afirmar prontidão pública completa.

O principal aprendizado foi simples: em sistemas com dados sensíveis, segurança não deve depender de uma única camada — e muito menos de um filtro controlado pela interface.

Nos seus projetos multiusuário, qual regra de isolamento você leva até o banco — e como valida esse comportamento?

---

Observação interna: hashtags, links e eventual imagem serão avaliados somente nas fases de refinamento e formato.
