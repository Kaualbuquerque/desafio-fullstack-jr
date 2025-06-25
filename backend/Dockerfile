# Usa imagem oficial Node.js (não-Alpine para evitar problemas com native modules)
FROM node:18

# Instala dependências necessárias para compilar módulos nativos como better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências de produção e compilações nativas
RUN npm install --omit=dev

RUN npm install -g @nestjs/cli

# Copia o restante da aplicação
COPY . .

# Compila o projeto (TypeScript para JavaScript)
RUN npm run build

# Remove dependências de build e cache para reduzir a imagem final
RUN apt-get purge -y python3 make g++ && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* /root/.npm /tmp/*

# Expõe a porta usada pela API
EXPOSE 4000

# Define o ambiente como produção
ENV NODE_ENV=production

# Inicia a aplicação
CMD ["node", "dist/main"]
