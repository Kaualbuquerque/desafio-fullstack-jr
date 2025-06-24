# Usa imagem oficial Node.js (evite Alpine com módulos nativos)
FROM node:18

# Instala dependências de build (em distros Debian-based)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências (compila o better-sqlite3 dentro do container)
RUN npm install

# Copia o restante da aplicação
COPY . .

# Compila a aplicação (caso use TypeScript)
RUN npm run build

# Expõe a porta que a aplicação usará (ajuste se necessário)
EXPOSE 3001

# Comando para iniciar o app
CMD ["node", "dist/main"]
