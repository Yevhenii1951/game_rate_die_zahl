# ---------- 1) Build stage ----------
FROM node:22-alpine AS build
WORKDIR /app

# копируем только package файлы и ставим зависимости
COPY package*.json ./
RUN npm ci

# копируем весь код приложения и собираем
COPY . .
RUN npm run build

# ---------- 2) Run stage (nginx) ----------
FROM nginx:alpine

# конфиг nginx (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# готовый build от Vite лежит в /app/dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
