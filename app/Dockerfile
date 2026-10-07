FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# ---- 기본 도구 + Node.js v22.22.0 설치 ----
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl xz-utils \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_VERSION=22.22.0

RUN curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
    -o /tmp/node.tar.xz \
  && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 \
  && rm -f /tmp/node.tar.xz \
  && node -v \
  && npm -v


# ============================================================
# 1) Local modified mediasoup-client build/package
# ============================================================

WORKDIR /work/mediasoup-client

COPY mediasoup-client .

RUN npm ci

# npm pack 실행 시 prepare가 호출되어 TypeScript -> lib 빌드가 수행됨.
# 생성 파일명에 의존하지 않도록 고정 이름으로 변경한다.
RUN npm pack --pack-destination /tmp \
  && mv /tmp/mediasoup-client-*.tgz /tmp/mediasoup-client-local.tgz


# ============================================================
# 2) mediasoup-demo app
# ============================================================

WORKDIR /work/mediasoup-demo/app

COPY mediasoup-demo/app .

# app build 시 config.mjs를 참조하므로 server config도 복사.
WORKDIR /work/mediasoup-demo/server
COPY mediasoup-demo/server/config.mjs ./config.mjs

WORKDIR /work/mediasoup-demo/app

# repository의 package.json은 upstream mediasoup-client를 가리키지만,
# Docker image 내부에서만 local modified mediasoup-client package로 교체한다.
RUN npm pkg set \
      dependencies.mediasoup-client="file:/tmp/mediasoup-client-local.tgz" \
  && npm install --legacy-peer-deps

RUN npm install -g http-server

RUN npm run build


EXPOSE 5555


CMD ["sh", "-lc", "http-server dist -S -C ../server/certs/cert.pem -K ../server/certs/key.pem -p 5555"]
