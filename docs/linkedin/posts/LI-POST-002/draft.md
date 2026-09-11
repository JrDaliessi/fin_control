# Draft — LI-POST-002

Estado: draft expandido do Dia 4. Não aprovado como versão final e não autorizado para publicação.

---

Filtrar dados por usuário apenas na interface não é uma fronteira de segurança suficiente — principalmente em um produto financeiro.

Uma tela pode esconder os registros corretamente e, ainda assim, a persistência aceitar um relacionamento incompatível com o proprietário. Por isso, o isolamento precisa continuar depois que a requisição deixa a interface.

Ao desenvolver a persistência do FinControl, tratei a autorização também no banco de dados.

As tabelas de contas, categorias e transações possuem identificação do proprietário e usam RLS — Row Level Security, ou segurança em nível de linha — habilitada e forçada.

No recorte inicial:

- o papel autenticado recebeu somente permissão para consultar e inserir;
- as políticas de consulta e inserção verificam o proprietário e rejeitam identidades anônimas;
- as transações usam chaves estrangeiras compostas para ajudar a impedir vínculos com contas ou categorias de outro proprietário.

Esses controles não trabalham sozinhos. A aplicação continua responsável por validar a identidade e as entradas, enquanto constraints, grants mínimos e RLS adicionam outras camadas de proteção.

Um exemplo ajuda a visualizar: ao registrar uma transação, conta e categoria não são apenas identificadores soltos. As chaves compostas também carregam o proprietário, ajudando a impedir que a transação relacione recursos pertencentes a usuários diferentes. A RLS, por sua vez, limita quais linhas a identidade autenticada pode consultar ou inserir.

O trade-off é tornar o schema, as migrations e os testes mais explícitos. Em troca, uma regra crítica deixa de depender exclusivamente do comportamento da interface.

A validação também não ficou restrita à interface: as migrations foram versionadas e os testes pgTAP verificaram schema, permissões e isolamento entre usuários.

Isso não significa que o aplicativo seja “100% seguro”. Hardening de autenticação e observabilidade ainda fazem parte do trabalho necessário antes de afirmar prontidão pública completa.

O principal aprendizado foi simples: em sistemas com dados sensíveis, segurança não deve depender de uma única camada — e muito menos de um filtro controlado pela interface.

Nos seus projetos multiusuário, qual regra de isolamento você leva até o banco — e como valida esse comportamento?

---

Observação interna: hashtags, links e eventual imagem serão avaliados somente nas fases de refinamento e formato.
