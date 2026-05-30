"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import FiltrosLaterais from '@/components/resultados/FiltrosLaterais';
import ListaResultados from '@/components/resultados/ListaResultados';

export default function ResultadosPage() {
  const router = useRouter();
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    ordenacao: 'score_desc',
    scoreMin: 0,
    precoMax: ''
  });

  useEffect(() => {
    async function fetchResultados() {
      const saved = sessionStorage.getItem('moove_respostas');
      if (!saved) {
        router.push('/');
        return;
      }

      try {
        const preferencias = JSON.parse(saved);
        const res = await fetch('/api/buscar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferencias }),
        });

        if (res.ok) {
          const data = await res.json();
          setImoveis(data.imoveis || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResultados();
  }, [router]);

  const imoveisFiltrados = useMemo(() => {
    let result = [...imoveis];

    if (filtros.scoreMin > 0) {
      result = result.filter(i => i.score >= filtros.scoreMin);
    }
    if (filtros.precoMax) {
      result = result.filter(i => Number(i.preco) <= filtros.precoMax);
    }

    if (filtros.ordenacao === 'preco_asc') {
      result.sort((a, b) => Number(a.preco) - Number(b.preco));
    } else if (filtros.ordenacao === 'preco_desc') {
      result.sort((a, b) => Number(b.preco) - Number(a.preco));
    } else {
      result.sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    return result;
  }, [imoveis, filtros]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resultados da Busca</h1>
            <p className="text-gray-500 mt-2">Encontramos {imoveisFiltrados.length} imóveis compatíveis com o seu perfil.</p>
          </div>
          <button 
            onClick={() => router.push('/formulario')}
            className="text-brand-primary font-medium hover:underline"
          >
            Editar preferências
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-80 flex-shrink-0">
            <FiltrosLaterais filtros={filtros} setFiltros={setFiltros} />
          </aside>
          <main className="flex-1">
            <ListaResultados imoveis={imoveisFiltrados} />
          </main>
        </div>
      </div>
    </div>
  );
}
