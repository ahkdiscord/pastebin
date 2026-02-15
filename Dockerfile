FROM oven/bun:1 AS build

RUN apt-get update && apt-get install -y python3 make g++ nodejs emscripten

WORKDIR /app

COPY . .

WORKDIR /app/tree-sitter-autohotkey-v2

RUN bun --bun install --frozen-lockfile
RUN bun run tree-sitter generate
RUN bun run tree-sitter build --wasm

WORKDIR /app

RUN bun --bun install --frozen-lockfile
RUN bun --bun run build

FROM oven/bun:1

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["bun", "build/index.js"]
