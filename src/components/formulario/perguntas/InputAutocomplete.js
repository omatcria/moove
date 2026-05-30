import { useState, useEffect, useRef } from 'react';

export default function InputAutocomplete({ placeholder, valor, onChange, submitOnEnter, onSubmit, tipo, cidadeContext }) {
  const [query, setQuery] = useState(valor || '');
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const timeoutRef = useRef(null);

  useEffect(() => {
    setQuery(valor || '');
  }, [valor]);

  const isMultiple = tipo === 'bairro';

  const fetchSugestoes = async (texto) => {
    let busca = texto;
    if (isMultiple) {
      const parts = texto.split(',');
      busca = parts[parts.length - 1].trim();
    }

    if (busca.length < 2) {
      setSugestoes([]);
      return;
    }

    setLoading(true);
    try {
      const url = `/api/locais?tipo=${tipo}&q=${encodeURIComponent(busca)}${cidadeContext ? `&cidade=${encodeURIComponent(cidadeContext)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setSugestoes(data);
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchSugestoes(val), 400);
  };

  const selecionarSugestao = (sugestao) => {
    let novoValor = sugestao;
    if (isMultiple) {
      const parts = query.split(',');
      parts.pop();
      if (parts.length > 0) {
        novoValor = parts.map(p => p.trim()).join(', ') + ', ' + sugestao;
      }
    }
    
    setQuery(novoValor);
    onChange(novoValor);
    setShowDropdown(false);
    document.getElementById('autocomplete-input')?.focus();
  };

  return (
    <div className="mt-4 relative">
      <input
        id="autocomplete-input"
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => { if (sugestoes.length > 0) setShowDropdown(true); }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onKeyDown={(e) => { 
          if (e.key === 'Enter') {
            if (showDropdown && sugestoes.length > 0) {
              selecionarSugestao(sugestoes[0]);
            } else if (submitOnEnter && onSubmit) {
              onSubmit();
            }
          }
        }}
        placeholder={placeholder}
        className="input-base w-full text-lg"
        autoFocus
      />
      {loading && (
        <div className="absolute right-4 top-4">
          <div className="animate-spin h-5 w-5 border-2 border-brand-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {showDropdown && sugestoes.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto text-left">
          {sugestoes.map((sug, idx) => (
            <li 
              key={idx}
              onClick={() => selecionarSugestao(sug)}
              className="px-4 py-3 hover:bg-brand-light cursor-pointer text-gray-700 transition"
            >
              {sug}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
