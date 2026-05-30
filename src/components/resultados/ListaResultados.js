import CardImovel from './CardImovel';

export default function ListaResultados({ imoveis }) {
  if (!imoveis || imoveis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum imóvel encontrado</h3>
        <p className="text-gray-500">Tente ajustar seus filtros ou voltar ao formulário e flexibilizar algumas respostas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {imoveis.map((imovel, index) => (
        <CardImovel key={imovel.id || index} imovel={imovel} />
      ))}
    </div>
  );
}
