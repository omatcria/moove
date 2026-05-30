CREATE TABLE imoveis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fonte text NOT NULL,
  url_original text NOT NULL UNIQUE,
  titulo text,
  descricao text,
  tipo_negocio text NOT NULL,
  tipo_imovel text,
  preco numeric,
  condominio numeric,
  cidade text,
  bairro text,
  endereco text,
  latitude float,
  longitude float,
  area_m2 numeric,
  quartos int,
  banheiros int,
  vagas_garagem int,
  condominio_fechado boolean,
  mobiliado text,
  pet_friendly text,
  elevador boolean,
  infraestrutura text[],
  fotos text[],
  data_publicacao timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE buscas_salvas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  preferencias jsonb NOT NULL,
  cidade text NOT NULL,
  ativo boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  ultimo_alerta timestamp
);
