import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import SideMenu from './SideMenu';
import ProgressBar from './ProgressBar';
import PerguntaCard from './PerguntaCard';
import OpcaoSimples from './perguntas/OpcaoSimples';
import MultiSelect from './perguntas/MultiSelect';
import SliderPreco from './perguntas/SliderPreco';
import InputTexto from './perguntas/InputTexto';
import InputAutocomplete from './perguntas/InputAutocomplete';

const PERGUNTAS = [
  // Seção 1
  { id: 0, titulo: 'Você quer alugar ou comprar um imóvel?', tipo: 'opcao', opcoes: ['Alugar', 'Comprar'], secao: 1, peso: 7.5 },
  { id: 1, titulo: 'Qual tipo de imóvel você procura?', tipo: 'opcao', opcoes: ['Apartamento', 'Casa', 'Cobertura', 'Studio/Kitnet', 'Qualquer um'], secao: 1, peso: 7.5 },
  // Seção 2
  { id: 2, titulo: 'Em qual cidade você quer buscar?', subtitulo: 'Ex: São Paulo, Rio de Janeiro', tipo: 'autocomplete', autocompleteTipo: 'cidade', placeholder: 'Digite a cidade', secao: 2, peso: 7 },
  { id: 3, titulo: 'Tem bairros ou regiões preferidas?', subtitulo: 'Opcional (separe por vírgula)', tipo: 'autocomplete', autocompleteTipo: 'bairro', placeholder: 'Ex: Pinheiros, Vila Madalena', secao: 2, peso: 6 },
  { id: 4, titulo: 'Qual o raio máximo de distância do centro dos bairros?', tipo: 'opcao', opcoes: ['Até 5km', 'Até 10km', 'Até 15km', 'Até 20km', 'Sem limite'], secao: 2, peso: 7 },
  // Seção 3
  { id: 5, titulo: 'Qual é o seu orçamento máximo?', subtitulo: 'Arraste para ajustar o valor', tipo: 'slider', min: 500, max: 20000, step: 100, secao: 3, peso: 8.5 },
  { id: 6, titulo: 'O condomínio está incluído nesse valor?', tipo: 'opcao', opcoes: ['Sim, está incluído', 'Não, aceito pagar à parte'], condition: (respostas) => respostas['q0'] === 'Alugar', secao: 3, peso: 8.5 },
  // Seção 4
  { id: 7, titulo: 'Quantos quartos você precisa?', tipo: 'opcao', opcoes: ['1', '2', '3', '4 ou mais', 'Não importa'], secao: 4, peso: 4.5 },
  { id: 8, titulo: 'Quantos banheiros?', tipo: 'opcao', opcoes: ['1', '2', '3 ou mais', 'Não importa'], secao: 4, peso: 4.5 },
  { id: 9, titulo: 'Precisa de vaga de garagem?', tipo: 'opcao', opcoes: ['Não preciso', '1 vaga', '2 vagas', '3 ou mais'], secao: 4, peso: 4.5 },
  { id: 10, titulo: 'Qual a área mínima que aceita?', tipo: 'opcao', opcoes: ['Não importa', 'Pelo menos 30m²', 'Pelo menos 50m²', 'Pelo menos 70m²', 'Pelo menos 100m²'], secao: 4, peso: 4.5 },
  // Seção 5
  { id: 11, titulo: 'Prefere condomínio fechado?', tipo: 'opcao', opcoes: ['Sim, prefiro', 'Tanto faz', 'Não preciso'], secao: 5, peso: 4.3 },
  { id: 12, titulo: 'Quais desses itens são importantes para você?', tipo: 'multi', opcoes: ['Piscina', 'Academia', 'Playground', 'Salão de Festas', 'Churrasqueira', 'Espaço Pet', 'Quadra', 'Segurança 24h', 'Portaria'], secao: 5, peso: 4.4 },
  { id: 13, titulo: 'Precisa de elevador?', tipo: 'opcao', opcoes: ['Sim', 'Não importa'], secao: 5, peso: 4.3 },
  // Seção 6
  { id: 14, titulo: 'Você tem pets?', tipo: 'opcao', opcoes: ['Sim', 'Não'], secao: 6, peso: 2.5 },
  { id: 15, titulo: 'O imóvel precisa ser mobiliado?', tipo: 'opcao', opcoes: ['Sim, precisa', 'Semi-mobiliado está ótimo', 'Não precisa'], secao: 6, peso: 2.5 },
  { id: 16, titulo: 'Usa transporte público regularmente?', tipo: 'opcao', opcoes: ['Sim', 'Não'], secao: 6, peso: 2.5 },
  { id: 17, titulo: 'Tem filhos pequenos?', tipo: 'opcao', opcoes: ['Sim', 'Não'], secao: 6, peso: 2.5 },
  // Seção 7
  { id: 18, titulo: 'Para quando você precisa do imóvel?', tipo: 'opcao', opcoes: ['Imediatamente', 'Em até 1 mês', 'Em até 3 meses', 'Em até 6 meses'], secao: 7, peso: 2.3 },
  { id: 19, titulo: 'Quer receber alertas por e-mail de novos imóveis compatíveis?', tipo: 'opcao', opcoes: ['Sim', 'Não'], secao: 7, peso: 2.3 },
  { id: 20, titulo: 'Qual o seu e-mail?', tipo: 'texto', placeholder: 'seu@email.com', condition: (respostas) => respostas['q19'] === 'Sim', secao: 7, peso: 2.4 },
  // Seção 8
  { id: 21, titulo: 'Como deseja realizar a busca?', subtitulo: 'Escolha a fonte dos dados', tipo: 'opcao', opcoes: ['Busca automática da internet', 'Banco de dados da nossa planilha'], secao: 8, peso: 2.0 }
];

export default function FormularioContainer() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [mounted, setMounted] = useState(false);
  const [enviandoWebhook, setEnviandoWebhook] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('moove_respostas');
    const savedStep = sessionStorage.getItem('moove_step');
    if (saved) setRespostas(JSON.parse(saved));
    if (savedStep) setStep(Number(savedStep));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem('moove_respostas', JSON.stringify(respostas));
      sessionStorage.setItem('moove_step', step.toString());
    }
  }, [respostas, step, mounted]);

  if (!mounted) return null;

  const currentQuestion = PERGUNTAS[step];

  const calcularProgresso = () => {
    let prog = 0;
    for (let i = 0; i < step; i++) {
       prog += PERGUNTAS[i].peso;
    }
    return Math.min(prog, 100);
  };

  const handleNext = async () => {
    let nextStep = step + 1;
    while (nextStep < PERGUNTAS.length && PERGUNTAS[nextStep].condition && !PERGUNTAS[nextStep].condition(respostas)) {
      nextStep++;
    }
    if (nextStep < PERGUNTAS.length) {
      setStep(nextStep);
    } else {
      // Finalizar formulário
      if (respostas['q21'] === 'Banco de dados da nossa planilha') {
        setEnviandoWebhook(true);
        try {
          const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://n8n.amais.io/webhook/moove-busca';
          // Dispara async
          fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              origem: 'formulario_moove',
              data: new Date().toISOString(),
              planilha_url: 'https://docs.google.com/spreadsheets/d/1EHBshiv_Ov_SfBmMw5nupxzsH88PChQ9_QJyjRJV8Vs/edit?usp=sharing',
              preferencias: respostas
            })
          }).catch(e => console.error(e));
        } catch (err) {
          console.error('Erro ao enviar webhook pro n8n:', err);
        }
        setEnviandoWebhook(false);
      } else {
        if (respostas['q19'] === 'Sim' && respostas['q20']) {
          fetch('/api/salvar-busca', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: respostas['q20'],
              preferencias: respostas
            })
          }).catch(e => console.error(e));
        }
      }
      // Em ambos os casos, redireciona para ver os resultados com UX do Airbnb
      router.push('/resultados');
    }
  };

  const handleBack = () => {
    let prevStep = step - 1;
    while (prevStep >= 0 && PERGUNTAS[prevStep].condition && !PERGUNTAS[prevStep].condition(respostas)) {
      prevStep--;
    }
    if (prevStep >= 0) {
      setStep(prevStep);
    }
  };

  const setRespostaAtual = (valor) => {
    setRespostas(prev => ({ ...prev, [`q${step}`]: valor }));
    // Auto-advance para opções simples se não for a última pergunta e não for multi select
    if (currentQuestion.tipo === 'opcao' && step !== PERGUNTAS.length -1) {
      setTimeout(handleNext, 300);
    }
  };

  const valorAtual = respostas[`q${step}`];
  const canProceed = valorAtual !== undefined && valorAtual !== '' && (currentQuestion.tipo !== 'multi' || valorAtual.length >= 0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <SideMenu respostas={respostas} goToStep={setStep} />
      
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <ProgressBar progresso={calcularProgresso()} />
        </div>

        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <PerguntaCard 
              key={step}
              titulo={currentQuestion.titulo}
              subtitulo={currentQuestion.subtitulo}
              onNext={handleNext}
              onBack={handleBack}
              showBackBtn={step > 0}
              nextDisabled={!canProceed && currentQuestion.id !== 3} // id 3 (Bairros) é opcional
              showNextBtn={currentQuestion.tipo !== 'opcao' || step === PERGUNTAS.length - 1} // Esconde se for opcao para forçar auto-advance, exceto na ultima
            >
              {currentQuestion.tipo === 'opcao' && (
                <OpcaoSimples opcoes={currentQuestion.opcoes} valor={valorAtual} onChange={setRespostaAtual} />
              )}
              {currentQuestion.tipo === 'multi' && (
                <MultiSelect opcoes={currentQuestion.opcoes} valores={valorAtual || []} onChange={setRespostaAtual} />
              )}
              {currentQuestion.tipo === 'slider' && (
                <SliderPreco min={currentQuestion.min} max={currentQuestion.max} step={currentQuestion.step} valor={valorAtual || currentQuestion.min} onChange={setRespostaAtual} />
              )}
              {currentQuestion.tipo === 'texto' && (
                <InputTexto placeholder={currentQuestion.placeholder} valor={valorAtual} onChange={setRespostaAtual} submitOnEnter={canProceed || currentQuestion.id === 3} onSubmit={handleNext} type={currentQuestion.id === 20 ? 'email' : 'text'} />
              )}
              {currentQuestion.tipo === 'autocomplete' && (
                <InputAutocomplete 
                  placeholder={currentQuestion.placeholder} 
                  valor={valorAtual} 
                  onChange={setRespostaAtual} 
                  submitOnEnter={canProceed || currentQuestion.id === 3} 
                  onSubmit={handleNext} 
                  tipo={currentQuestion.autocompleteTipo}
                  cidadeContext={respostas['q2']}
                />
              )}
            </PerguntaCard>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
