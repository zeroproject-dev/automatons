FROM node:19-alpine3.16 as build
WORKDIR /app
COPY package.json .
RUN npm install --prefer-offline --no-audit --progress=false
COPY . .
RUN npm run build

# Stage 2

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]