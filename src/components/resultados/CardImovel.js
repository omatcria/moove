import { Heart, MapPin, Bed, Bath, Car, Maximize, ExternalLink } from 'lucide-react';
import ScoreBadge from './ScoreBadge';

export default function CardImovel({ imovel }) {
  const fotoUrl = imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0] : 'https://placehold.co/600x400/e2e8f0/64748b?text=Sem+Foto';

  return (
    <div className="card group">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={fotoUrl} 
          alt={imovel.titulo} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 right-3">
          <ScoreBadge score={imovel.score || 0} />
        </div>
        <div className="absolute top-3 left-3">
          <button className="p-2 bg-white/80 hover:bg-white rounded-full text-gray-500 hover:text-red-500 transition shadow-sm">
            <Heart size={20} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
          {imovel.fonte && (
            <span className="bg-black/60 text-white text-xs px-2 py-1 rounded capitalize">
              {imovel.fonte}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{imovel.titulo || 'Imóvel'}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin size={14} className="mr-1" />
              <span className="line-clamp-1">{imovel.bairro || imovel.cidade || 'Endereço não informado'}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          {imovel.quartos && (
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>{imovel.quartos}</span>
            </div>
          )}
          {imovel.banheiros && (
            <div className="flex items-center gap-1">
              <Bath size={16} />
              <span>{imovel.banheiros}</span>
            </div>
          )}
          {imovel.vagas_garagem > 0 && (
            <div className="flex items-center gap-1">
              <Car size={16} />
              <span>{imovel.vagas_garagem}</span>
            </div>
          )}
          {imovel.area_m2 && (
            <div className="flex items-center gap-1">
              <Maximize size={16} />
              <span>{imovel.area_m2}m²</span>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase font-semibold">{imovel.tipo_negocio === 'venda' ? 'Venda' : 'Aluguel'}</div>
            <div className="text-xl font-bold text-brand-primary">
              R$ {Number(imovel.preco).toLocaleString('pt-BR')}
            </div>
            {imovel.condominio > 0 && (
              <div className="text-xs text-gray-400">+ R$ {Number(imovel.condominio).toLocaleString('pt-BR')} cond.</div>
            )}
          </div>
          
          <a 
            href={imovel.url_original} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-dark transition bg-brand-light px-4 py-2 rounded-xl"
          >
            Ver anúncio
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
