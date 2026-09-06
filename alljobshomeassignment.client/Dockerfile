FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
# Build Next.js app (server-rendered) — do not export static site
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Copy production artifacts from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
