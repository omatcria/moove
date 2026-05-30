require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');
const olxScraper = require('./scrapers/olx');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Credenciais do Supabase não encontradas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Iniciando rotina de scraping...');
  try {
    // Exemplo de buscas a realizar
    const buscas = [
      { cidade: 'João Pessoa', tipo: 'aluguel' },
      { cidade: 'João Pessoa', tipo: 'venda' }
    ];

    let todosImoveis = [];

    for (const busca of buscas) {
      const resultadosOlx = await olxScraper.scrape(busca.cidade, busca.tipo);
      todosImoveis = todosImoveis.concat(resultadosOlx);
    }

    if (todosImoveis.length > 0) {
      console.log(`Inserindo ${todosImoveis.length} imóveis no Supabase...`);
      const { error } = await supabase.from('imoveis').upsert(todosImoveis, { onConflict: 'url_original' });
      
      if (error) {
        console.error('Erro ao inserir imóveis:', error);
      } else {
        console.log('Imóveis inseridos/atualizados com sucesso!');
      }
    } else {
      console.log('Nenhum imóvel novo encontrado.');
    }

  } catch (error) {
    console.error('Erro geral no scraper:', error);
  }
  console.log('Rotina finalizada.');
}

// Se executado diretamente
if (require.main === module) {
  main();
}

module.exports = { main };
