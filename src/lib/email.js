import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmailAlerta(email, preferencias) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY não configurada. E-mail não enviado.');
    return;
  }

  const tipo = preferencias['q0'];
  const cidade = preferencias['q2'];

  try {
    await resend.emails.send({
      from: 'MOOVE <avisos@moove.com.br>',
      to: email,
      subject: 'Bem-vindo ao MOOVE! Alerta de busca ativado',
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h1 style="color: #00A699;">Sua busca foi salva com sucesso!</h1>
          <p>Olá,</p>
          <p>A partir de agora, nosso robô vai varrer os principais portais imobiliários todos os dias em busca de novos imóveis que deem match com suas preferências:</p>
          <ul>
            <li><strong>Objetivo:</strong> ${tipo} em ${cidade}</li>
          </ul>
          <p>Sempre que encontrarmos opções com um Score alto, enviaremos direto para o seu e-mail.</p>
          <br />
          <p>Até logo,</p>
          <p><strong>Equipe MOOVE</strong></p>
        </div>
      `
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
}
