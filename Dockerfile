# --- Estágio 1: Build ---
# Usa uma imagem Node.js completa para instalar dependências e compilar o projeto
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de manifesto de dependências
COPY package*.json ./

# Instala apenas as dependências de produção primeiro para aproveitar o cache do Docker
RUN npm install --only=production

# Copia o restante dos arquivos do projeto
COPY . .

# Instala as dependências de desenvolvimento para compilar o projeto
RUN npm install

# Compila o projeto TypeScript para JavaScript
RUN npm run build

# --- Estágio 2: Produção ---
# Usa uma imagem Node.js mais leve (slim) para a execução
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia as dependências de produção do estágio de build
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copia o código compilado do estágio de build
COPY --from=builder /usr/src/app/dist ./dist

# Expõe a porta que a aplicação vai usar (deve ser a mesma do .env no Coolify)
EXPOSE 3000

# Comando para iniciar a aplicação em produção
CMD ["node", "dist/main.js"]