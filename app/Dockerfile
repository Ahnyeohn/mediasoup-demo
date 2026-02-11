FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /work/app

# ---- 기본 도구 + Node.js v22.22.0 설치 ----
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl xz-utils \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_VERSION=22.22.0
RUN curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" -o /tmp/node.tar.xz \
  && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 \
  && rm -f /tmp/node.tar.xz \
  && node -v && npm -v

# ---- 소스 복사 ----
# Dockerfile이 있는 디렉토리(= mediasoup-demo/app)의 내용을 컨테이너로 복사
COPY . .

# ---- 의존성 설치 + 빌드 ----
RUN npm install --legacy-peer-deps
RUN npm install -g http-server
RUN npm run build

# ---- HTTPS 정적서버 ----
EXPOSE 5555

# cert/key는 보통 docker-compose에서 볼륨 마운트로 넣습니다.
#   - app 컨테이너 기준 경로: /work/server/certs/cert.pem, /work/server/certs/key.pem
#     (아래 CMD에서 ../server/certs 를 쓰기 때문에 WORKDIR=/work/app 기준으로 ../server/certs 여야 함)

CMD ["sh", "-lc", "http-server dist -S -C ../server/certs/cert.pem -K ../server/certs/key.pem -p 5555"]