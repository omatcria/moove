export default function SliderPreco({ min = 500, max = 20000, step = 100, valor = 5000, onChange }) {
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex items-center justify-between">
        <span className="text-gray-500">Mínimo: R$ {min}</span>
        <span className="text-xl font-bold text-brand-primary">
          R$ {Number(valor).toLocaleString('pt-BR')}
        </span>
        <span className="text-gray-500">Máximo: R$ {max}+</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
      />
      <div className="relative">
         <input
            type="number"
            value={valor}
            onChange={(e) => onChange(Number(e.target.value))}
            className="input-base w-full pl-12"
            min={min}
         />
         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
      </div>
    </div>
  );
}
