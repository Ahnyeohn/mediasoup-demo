FROM ubuntu:22.04

# 설치 중 tzdata 같은게 물어보지 않게
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /work

# ---- 0) 필수 패키지 설치 (Python 3.10, gcc/g++ 11, build tools, curl 등) ----
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl xz-utils \
    python3 python3-dev python3-pip \
    build-essential g++ gcc make \
  && rm -rf /var/lib/apt/lists/*

# ---- 1) Node.js v22.22.0 설치 (공식 배포 tarball 사용) ----
# (npm 포함)
ENV NODE_VERSION=22.22.0
RUN curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" -o /tmp/node.tar.xz \
  && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 \
  && rm -f /tmp/node.tar.xz \
  && node -v && npm -v

# ---- (선택) 버전 확인 로그: Python/gcc ----
RUN python3 --version && gcc --version && g++ --version

# 2) mediasoup build (native deps 포함)
COPY ../../mediasoup ./mediasoup
WORKDIR /work/mediasoup
RUN npm ci && npm run typescript:build && npm run worker:build

# 3) mediasoup-demo server install + build
WORKDIR /work/mediasoup-demo-server
COPY . .
RUN npm ci
RUN npm run typescript:build

ENV NODE_ENV=production

#그 외 쓰는 포트 번호 명시
EXPOSE 4443

CMD ["npm", "start"]