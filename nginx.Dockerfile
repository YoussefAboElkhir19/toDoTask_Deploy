FROM node:18 AS build
WORKDIR /app
COPY client/package.json client/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY client/ .
ENV NODE_OPTIONS=--max_old_space_size=512
ENV GENERATE_SOURCEMAP=false
RUN npm run build

FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
