import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { enviarEmailAlerta } from '@/lib/email';

export async function POST(req) {
  try {
    const { preferencias, email } = await req.json();

    if (!preferencias || !email) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const cidade = preferencias['q2'] || 'Não informada';

    const { error } = await supabase.from('buscas_salvas').insert({
      email,
      preferencias,
      cidade,
      ativo: true,
    });

    if (error) {
      console.error('Erro ao salvar no Supabase:', error);
      return NextResponse.json({ error: 'Erro ao salvar busca' }, { status: 500 });
    }

    // Tenta enviar o email de boas-vindas assincronamente (não bloqueia a response)
    enviarEmailAlerta(email, preferencias);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro em /api/salvar-busca:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
