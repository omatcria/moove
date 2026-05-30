import { motion } from 'framer-motion';

export default function PerguntaCard({ titulo, subtitulo, children, onNext, showNextBtn = true, nextDisabled = false, onBack, showBackBtn = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl w-full mx-auto p-4 md:p-8"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{titulo}</h2>
      {subtitulo && <p className="text-gray-500 mb-6">{subtitulo}</p>}
      
      <div className="my-6 md:my-8">
        {children}
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 mt-8">
        {showBackBtn && (
          <button
            onClick={onBack}
            className="w-full md:w-auto px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 rounded-xl transition"
          >
            Voltar
          </button>
        )}
        <div className="flex-1"></div>
        {showNextBtn && (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className={`btn-primary w-full md:w-auto md:px-12 ${nextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Continuar
          </button>
        )}
      </div>
    </motion.div>
  );
}
