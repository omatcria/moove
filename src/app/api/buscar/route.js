import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calcularScore } from '@/lib/score';
import Papa from 'papaparse';

export async function POST(req) {
  try {
    const { preferencias } = await req.json();

    if (!preferencias || Object.keys(preferencias).length === 0) {
      return NextResponse.json({ error: 'Preferências não enviadas' }, { status: 400 });
    }

    const cidade = preferencias['q2'];
    const isAluguel = preferencias['q0'] === 'Alugar';
    const tipoNegocio = isAluguel ? 'aluguel' : 'venda';
    
    let imoveisDb = [];

    if (preferencias['q21'] === 'Banco de dados da nossa planilha') {
       const sheetUrl = 'https://docs.google.com/spreadsheets/d/1EHBshiv_Ov_SfBmMw5nupxzsH88PChQ9_QJyjRJV8Vs/export?format=csv';
       const res = await fetch(sheetUrl);
       const csvText = await res.text();
       
       const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
       
       imoveisDb = parsed.data.map(row => {
          const precosStr = row['Preço'] || row['Preo'] || '';
          const preco = parseFloat(precosStr.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
          
          return {
             id: row['ID'] || Math.random().toString(),
             tipo_negocio: isAluguel ? 'aluguel' : 'venda',
             cidade: 'Goiânia',
             bairro: row['Setor'] || row['Localização'] || '',
             preco: preco,
             quartos: parseInt(row['Quartos']) || 0,
             vagas: parseInt(row['Vagas']) || 0,
             area: parseInt(row['Área (m²)'] || row['?rea (m)']) || 0,
             titulo: `${row['Tipo'] || 'Imóvel'} em ${row['Setor'] || 'Goiânia'}`,
             link: row['Link'] || '',
             fotos: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
             origem: 'planilha'
          };
       }).filter(i => i.preco > 0);
    } else {
      let query = supabase.from('imoveis').select('*').eq('tipo_negocio', tipoNegocio);
      if (cidade) {
        query = query.ilike('cidade', `%${cidade}%`);
      }
      const { data, error } = await query.limit(200);
      if (error) {
        console.error('Erro na busca do Supabase:', error);
        return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 });
      }
      imoveisDb = data || [];
    }

    const imoveisRanqueados = [];

    for (const imovel of imoveisDb) {
      const analise = calcularScore(preferencias, imovel);
      if (analise.aprovado || imovel.origem === 'planilha') {
        imoveisRanqueados.push({
          ...imovel,
          score: analise.score
        });
      }
    }

    imoveisRanqueados.sort((a, b) => b.score - a.score);

    return NextResponse.json({ imoveis: imoveisRanqueados });

  } catch (err) {
    console.error('Erro em /api/buscar:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
