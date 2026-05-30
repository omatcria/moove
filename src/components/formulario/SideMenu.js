import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function SideMenu({ respostas, goToStep }) {
  const [isOpen, setIsOpen] = useState(false);

  const secoes = [
    { nome: 'Tipo de Busca', steps: [0, 1] },
    { nome: 'Localização', steps: [2, 3, 4] },
    { nome: 'Orçamento', steps: [5, 6] },
    { nome: 'Características', steps: [7, 8, 9, 10] },
    { nome: 'Estrutura', steps: [11, 12, 13] },
    { nome: 'Estilo de Vida', steps: [14, 15, 16, 17] },
    { nome: 'Finalização', steps: [18, 19, 20] }
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 p-2 bg-white rounded-full shadow-md z-40 md:hidden"
      >
        <Menu size={24} className="text-brand-primary" />
      </button>

      <div className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:opacity-0 md:pointer-events-none`} onClick={() => setIsOpen(false)} />

      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-64 md:z-0 md:shadow-none md:border-r border-gray-100 overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-brand-primary">MOOVE</h1>
            <button onClick={() => setIsOpen(false)} className="md:hidden">
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {secoes.map((secao, idx) => {
              const temResposta = secao.steps.some(step => respostas[`q${step}`] !== undefined);
              if (!temResposta) return null;

              return (
                <div key={idx} className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{secao.nome}</h3>
                  {secao.steps.map(step => {
                    const resp = respostas[`q${step}`];
                    if (resp === undefined) return null;
                    const valorDisplay = Array.isArray(resp) ? resp.join(', ') : resp;
                    
                    return (
                      <button 
                        key={step}
                        onClick={() => {
                          goToStep(step);
                          setIsOpen(false);
                        }}
                        className="w-full text-left text-sm p-2 hover:bg-brand-light rounded-lg transition group"
                      >
                        <div className="text-gray-800 font-medium truncate group-hover:text-brand-dark">{valorDisplay.toString()}</div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
