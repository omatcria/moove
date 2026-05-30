import { NextResponse } from 'next/server';

let cidadesCache = null;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const tipo = searchParams.get('tipo'); // 'cidade' ou 'bairro'
  const cidade = searchParams.get('cidade');
  
  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    if (tipo === 'cidade') {
      if (!cidadesCache) {
         const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
         const data = await res.json();
         cidadesCache = data.map(c => `${c.nome}, ${c.microrregiao.mesorregiao.UF.sigla}`);
      }
      
      const qLower = q.toLowerCase();
      const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const qNorm = normalize(qLower);
      
      const matches = cidadesCache
        .filter(c => normalize(c.toLowerCase()).includes(qNorm))
        .slice(0, 7);
        
      return NextResponse.json(matches);
    }

    if (tipo === 'bairro') {
      const query = `${q}, ${cidade || ''}`.trim();
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=br&limit=10&addressdetails=1`, {
        headers: { 'User-Agent': 'MooveApp/1.0' }
      });
      const data = await res.json();
      
      const bairros = data
        .map(item => item.address?.suburb || item.address?.city_district || item.name)
        .filter(b => !!b);
        
      // Remove duplicatas e exibe
      const unicos = [...new Set(bairros)].slice(0, 5);
      return NextResponse.json(unicos);
    }
  } catch (error) {
    console.error('Erro na busca de locais:', error);
    return NextResponse.json([]);
  }

  return NextResponse.json([]);
}
