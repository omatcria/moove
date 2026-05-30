export default function MultiSelect({ opcoes, valores = [], onChange }) {
  const toggleOpcao = (opcao) => {
    if (valores.includes(opcao)) {
      onChange(valores.filter(v => v !== opcao));
    } else {
      onChange([...valores, opcao]);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      {opcoes.map((opcao) => (
        <button
          key={opcao}
          onClick={() => toggleOpcao(opcao)}
          className={`w-full text-left p-4 rounded-xl border-2 transition ${valores.includes(opcao) ? 'border-brand-primary bg-brand-light text-brand-dark font-medium' : 'border-gray-200 hover:border-brand-primary'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${valores.includes(opcao) ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'}`}>
              {valores.includes(opcao) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            {opcao}
          </div>
        </button>
      ))}
    </div>
  );
}
