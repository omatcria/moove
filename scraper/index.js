require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const olxScraper = require('./scrapers/olx');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Credenciais do Supabase não encontradas. O salvamento no banco não vai funcionar.');
}

const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Health check endpoint para o Render
app.get('/', (req, res) => {
  res.send('MOOVE Scraper Bot is running');
});

// Endpoint para ser chamado pelo N8N
app.post('/scrape', async (req, res) => {
  try {
    const { preferencias } = req.body;
    
    if (!preferencias) {
      return res.status(400).json({ error: 'Preferências não enviadas.' });
    }

    const cidade = preferencias.q2 || 'Goiânia';
    const isAluguel = preferencias.q0 === 'Alugar';
    const tipo = isAluguel ? 'aluguel' : 'venda';

    console.log(`[Webhook] Iniciando scraping para: ${cidade} - ${tipo}`);
    
    // Chama o Scraper do Playwright
    const resultados = await olxScraper.scrape(cidade, tipo);

    if (resultados.length > 0) {
      if (supabase) {
        console.log(`[Webhook] Salvando ${resultados.length} imóveis no Supabase...`);
        const { error } = await supabase.from('imoveis').upsert(resultados, { onConflict: 'url_original' });
        
        if (error) {
          console.error('Erro ao salvar no Supabase:', error);
          return res.status(500).json({ error: 'Erro ao salvar resultados no Supabase.' });
        }
      } else {
        console.log('[Webhook] Supabase não configurado. Imóveis raspados mas não salvos no banco.');
      }
    }
    
    // Retorna os dados raspados diretamente para o N8N
    res.status(200).json({ 
      message: 'Scraping finalizado com sucesso.', 
      imoveis: resultados 
    });

  } catch (error) {
    console.error('Erro na rota /scrape:', error);
    res.status(500).json({ error: 'Erro interno no robô de scraping' });
  }
});

const PORT = process.env.PORT || 3000;

// Inicia o servidor apenas se chamado diretamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Robô de Scraping rodando na porta ${PORT}`);
  });
}

module.exports = app;
