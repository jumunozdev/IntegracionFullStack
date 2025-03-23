# Etapa 1: Construcción
FROM node:20 AS build
WORKDIR /app

# Copiar dependencias e instalar
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código y construir la app
COPY . .
RUN npm run build

# Etapa 2: Producción con Node.js
FROM node:20
WORKDIR /app

# Copiar solo lo necesario
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm install --omit=dev

COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public
COPY --from=build /app/next.config.mjs /app/next.config.mjs

# Exponer el puerto de Next.js
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]

