export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <section className="mx-auto flex max-w-3xl flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Controle Financeiro IA
        </p>
        <h1 className="text-3xl font-semibold">
          Base técnica pronta para evoluir por TDD.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-700">
          O primeiro recorte funcional será o cadastro manual de transações,
          guiado por testes de domínio e aplicação.
        </p>
      </section>
    </main>
  );
}

