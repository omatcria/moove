export default function FiltrosLaterais({ filtros, setFiltros }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div>
        <h3 className="font-bold mb-4">Ordenação</h3>
        <select 
          className="w-full p-2 border border-gray-200 rounded-lg"
          value={filtros.ordenacao}
          onChange={(e) => setFiltros({...filtros, ordenacao: e.target.value})}
        >
          <option value="score_desc">Maior Score (Recomendado)</option>
          <option value="preco_asc">Menor Preço</option>
          <option value="preco_desc">Maior Preço</option>
        </select>
      </div>

      <div>
        <h3 className="font-bold mb-4">Score Mínimo</h3>
        <input 
          type="range" 
          min="0" 
          max="90" 
          step="10"
          value={filtros.scoreMin}
          onChange={(e) => setFiltros({...filtros, scoreMin: Number(e.target.value)})}
          className="w-full accent-brand-primary"
        />
        <div className="text-sm text-gray-500 text-center mt-2">
          {filtros.scoreMin}% ou mais
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4">Preço Máximo</h3>
        <input 
          type="number" 
          className="w-full p-2 border border-gray-200 rounded-lg"
          placeholder="Ex: 5000"
          value={filtros.precoMax}
          onChange={(e) => setFiltros({...filtros, precoMax: Number(e.target.value)})}
        />
      </div>

      <button 
        onClick={() => setFiltros({ ordenacao: 'score_desc', scoreMin: 0, precoMax: '' })}
        className="w-full text-sm text-gray-500 hover:text-brand-primary transition mt-4"
      >
        Limpar filtros
      </button>
    </div>
  );
}
