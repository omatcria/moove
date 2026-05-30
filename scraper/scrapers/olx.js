const { chromium } = require('playwright');

async function scrape(cidade, tipoNegocio) {
  console.log(`Iniciando scraper OLX: ${cidade} - ${tipoNegocio}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  const resultados = [];
  try {
    // Aqui ficaria a lógica real de navegação da OLX usando cidade e tipoNegocio
    // Para fins do MVP e prova de conceito, retornamos mock de dados estruturados:
    
    resultados.push({
      fonte: 'olx',
      url_original: `https://pb.olx.com.br/imoveis/mock-olx-${Date.now()}`,
      titulo: `Apartamento em ${cidade}`,
      descricao: 'Lindo apartamento bem localizado, próximo a tudo.',
      tipo_negocio: tipoNegocio, 
      tipo_imovel: 'apartamento',
      preco: tipoNegocio === 'aluguel' ? 2500 : 450000,
      condominio: 500,
      cidade: cidade,
      bairro: 'Centro',
      endereco: 'Rua Principal, 100',
      area_m2: 65,
      quartos: 2,
      banheiros: 2,
      vagas_garagem: 1,
      condominio_fechado: true,
      mobiliado: 'sim',
      pet_friendly: 'sim',
      elevador: true,
      infraestrutura: ['piscina', 'academia', 'portaria'],
      fotos: ['https://placehold.co/600x400/e2e8f0/64748b?text=Foto+OLX'],
      data_publicacao: new Date().toISOString()
    });
    
    // Delay aleatório para simular comportamento humano
    await page.waitForTimeout(2000 + Math.random() * 3000);

  } catch (error) {
    console.error(`Erro no scraper OLX para ${cidade}:`, error);
  } finally {
    await browser.close();
  }

  return resultados;
}

module.exports = { scrape };
