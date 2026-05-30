export function calcularScore(preferencias, imovel) {
  let score = 0;
  const detalhes = {};

  // Eliminações (Hard Filters)
  // Tipo de negócio: preferencias['q0'] (Alugar / Comprar)
  const isAluguel = preferencias['q0'] === 'Alugar';
  if (imovel.tipo_negocio !== (isAluguel ? 'aluguel' : 'venda')) {
    return { score: 0, detalhes: { eliminatorio: 'tipo_negocio' }, aprovado: false };
  }

  // Orçamento máximo: q5. (Se preco for 20% maior que o budget, elimina)
  const budget = Number(preferencias['q5'] || 0);
  const precoTotal = isAluguel ? (Number(imovel.preco) + (preferencias['q6'] === 'Sim, está incluído' ? 0 : Number(imovel.condominio || 0))) : Number(imovel.preco);
  
  if (precoTotal > budget * 1.20) {
    return { score: 0, detalhes: { eliminatorio: 'orcamento_estourado' }, aprovado: false };
  }

  // Fatores de Score (0 - 100 pontos)

  // 1. Quartos (25%)
  const qQuartos = preferencias['q7'];
  let sQuartos = 0;
  if (qQuartos === 'Não importa') sQuartos = 100;
  else {
    const qNum = parseInt(qQuartos) || 4; // '4 ou mais'
    const iNum = imovel.quartos || 0;
    const diff = Math.abs(qNum - iNum);
    if (diff === 0) sQuartos = 100;
    else if (diff === 1) sQuartos = 70;
    else if (diff === 2) sQuartos = 40;
    else sQuartos = 10;
  }
  score += sQuartos * 0.25;

  // 2. Tipo de imóvel (12%)
  const qTipo = preferencias['q1'];
  let sTipo = 0;
  if (qTipo === 'Qualquer um') sTipo = 80;
  else if (imovel.tipo_imovel?.toLowerCase() === qTipo?.toLowerCase()) sTipo = 100;
  else sTipo = 0;
  score += sTipo * 0.12;

  // 3. Garagem (12%)
  const qGaragem = preferencias['q9'];
  let sGaragem = 0;
  const iGaragem = imovel.vagas_garagem || 0;
  if (qGaragem === 'Não preciso') sGaragem = 100;
  else {
    const qGNum = parseInt(qGaragem) || 3;
    if (iGaragem >= qGNum) sGaragem = 100;
    else if (iGaragem > 0) sGaragem = 60;
    else sGaragem = 0;
  }
  score += sGaragem * 0.12;

  // 4. Banheiros (10%)
  const qBanheiros = preferencias['q8'];
  let sBanheiros = 0;
  if (qBanheiros === 'Não importa') sBanheiros = 100;
  else {
    const qBNum = parseInt(qBanheiros) || 3;
    const iBNum = imovel.banheiros || 0;
    const diff = Math.abs(qBNum - iBNum);
    if (diff === 0) sBanheiros = 100;
    else if (diff === 1) sBanheiros = 70;
    else if (diff === 2) sBanheiros = 40;
    else sBanheiros = 10;
  }
  score += sBanheiros * 0.10;

  // 5. Preço dentro do budget (10%)
  let sPreco = 0;
  if (precoTotal <= budget) {
    if (precoTotal >= budget * 0.9) sPreco = 100; // 0-10% abaixo
    else sPreco = 90; // Muito abaixo
  } else {
    if (precoTotal <= budget * 1.10) sPreco = 70;
    else if (precoTotal <= budget * 1.20) sPreco = 40;
  }
  score += sPreco * 0.10;

  // 6. Área (8%)
  const qArea = preferencias['q10'];
  let sArea = 0;
  const iArea = Number(imovel.area_m2) || 0;
  if (qArea === 'Não importa') sArea = 100;
  else {
    const minArea = parseInt(qArea.replace(/\D/g, '')) || 0;
    if (iArea >= minArea * 0.9) sArea = 100;
    else if (iArea >= minArea * 0.8) sArea = 70;
    else if (iArea >= minArea * 0.7) sArea = 40;
    else sArea = 10;
  }
  score += sArea * 0.08;

  // 7. Condomínio Fechado (7%)
  const qCond = preferencias['q11'];
  let sCond = 0;
  if (qCond === 'Tanto faz' || qCond === 'Não preciso') sCond = 80;
  else if (qCond === 'Sim, prefiro') {
    sCond = imovel.condominio_fechado ? 100 : 30;
  }
  score += sCond * 0.07;

  // 8. Mobiliado (6%)
  const qMob = preferencias['q15'];
  let sMob = 0;
  const iMob = imovel.mobiliado?.toLowerCase(); // 'sim', 'nao', 'semi'
  if (qMob === 'Não precisa') sMob = 100;
  else if (qMob === 'Sim, precisa') {
    if (iMob === 'sim') sMob = 100;
    else if (iMob === 'semi') sMob = 60;
    else sMob = 0;
  } else {
    if (iMob === 'semi' || iMob === 'sim') sMob = 100;
    else sMob = 30;
  }
  score += sMob * 0.06;

  // 9. Infraestrutura (6%)
  const qInfra = preferencias['q12'] || [];
  let sInfra = 100;
  if (qInfra.length > 0) {
    const iInfra = imovel.infraestrutura || [];
    let matchCount = 0;
    qInfra.forEach(item => {
      if (iInfra.some(i => i.toLowerCase().includes(item.toLowerCase()))) {
        matchCount++;
      }
    });
    sInfra = (matchCount / qInfra.length) * 100;
  }
  score += sInfra * 0.06;

  // 10. Pet friendly (3%)
  const qPet = preferencias['q14'];
  let sPet = 100;
  const iPet = imovel.pet_friendly?.toLowerCase(); // 'sim', 'nao', 'nao_informado'
  if (qPet === 'Sim') {
    if (iPet === 'sim') sPet = 100;
    else if (iPet === 'nao_informado') sPet = 50;
    else if (iPet === 'nao') sPet = 0;
  }
  score += sPet * 0.03;

  // 11. Elevador (1%)
  const qElev = preferencias['q13'];
  let sElev = 100;
  if (qElev === 'Sim') {
    if (imovel.elevador) sElev = 100;
    else sElev = 0;
  } else {
    sElev = 80;
  }
  score += sElev * 0.01;

  return {
    score: Math.round(score),
    detalhes,
    aprovado: true
  };
}
