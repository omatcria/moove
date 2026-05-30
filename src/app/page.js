import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-brand-light">
      <main className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold text-brand-dark tracking-tight">
          Encontre o imóvel<br />dos seus sonhos.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Descreva o que você procura e nós buscamos nos principais portais imobiliários do Brasil para você.
        </p>
        <div className="pt-8">
          <Link 
            href="/formulario"
            className="btn-primary text-lg px-8 py-4 inline-block hover:scale-105 transition-transform shadow-lg"
          >
            Começar minha busca
          </Link>
        </div>
      </main>
    </div>
  );
}
