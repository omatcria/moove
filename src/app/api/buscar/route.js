import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calcularScore } from '@/lib/score';

export async function POST(req) {
  try {
    const { preferencias } = await req.json();

    if (!preferencias || Object.keys(preferencias).length === 0) {
      return NextResponse.json({ error: 'Preferências não enviadas' }, { status: 400 });
    }

    const cidade = preferencias['q2'];
    const isAluguel = preferencias['q0'] === 'Alugar';
    const tipoNegocio = isAluguel ? 'aluguel' : 'venda';

    // Query base
    let query = supabase.from('imoveis').select('*').eq('tipo_negocio', tipoNegocio);

    if (cidade) {
      query = query.ilike('cidade', `%${cidade}%`);
    }

    const { data: imoveisDb, error } = await query.limit(200); // Busca um bom número para poder ranquear

    if (error) {
      console.error('Erro na busca do Supabase:', error);
      return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 });
    }

    // Calcula o score e filtra eliminados
    const imoveisRanqueados = [];

    for (const imovel of (imoveisDb || [])) {
      const analise = calcularScore(preferencias, imovel);
      if (analise.aprovado) {
        imoveisRanqueados.push({
          ...imovel,
          score: analise.score
        });
      }
    }

    // Ordena por score descendente
    imoveisRanqueados.sort((a, b) => b.score - a.score);

    return NextResponse.json({ imoveis: imoveisRanqueados });

  } catch (err) {
    console.error('Erro em /api/buscar:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
