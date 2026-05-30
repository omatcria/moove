import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { preferencias } = await req.json();

    if (!preferencias || Object.keys(preferencias).length === 0) {
      return NextResponse.json({ error: 'Preferências não enviadas' }, { status: 400 });
    }

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://n8n.amais.io/webhook/moove-busca';
    
    // Repassa a responsabilidade de busca 100% para o N8N
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origem: 'frontend_resultados',
        data: new Date().toISOString(),
        preferencias: preferencias
      })
    });

    if (!response.ok) {
      throw new Error('Erro na comunicação com o N8N');
    }

    const data = await response.json();
    
    // O N8N precisa retornar um objeto com a chave "imoveis" contendo a array de resultados
    return NextResponse.json({ imoveis: data.imoveis || [] });

  } catch (err) {
    console.error('Erro em /api/buscar (Proxy N8N):', err);
    return NextResponse.json({ error: 'Erro interno ao consultar automação' }, { status: 500 });
  }
}
