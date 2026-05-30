FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências do Node (Playwright já vem instalado na imagem, então só precisamos baixar os pacotes NPM)
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta que o Express vai rodar (3000 ou a que o Render definir)
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
