export default function OpcaoSimples({ opções, valor, onChange }) {
  return (
    <div className="flex flex-col gap-3 mt-4">
      {opções.map((opcao) => (
        <button
          key={opcao}
          onClick={() => onChange(opcao)}
          className={`w-full text-left p-4 rounded-xl border-2 transition ${valor === opcao ? 'border-brand-primary bg-brand-light text-brand-dark font-medium' : 'border-gray-200 hover:border-brand-primary'}`}
        >
          {opcao}
        </button>
      ))}
    </div>
  );
}
