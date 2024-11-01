# 使用 Node.js 官方镜像作为基础镜像
FROM node:18

# 定义工作目录
WORKDIR /usr/src/app/app 

# 将package.json 和 package-lock.json复制到工作目录
COPY app/package*.json ./

# 安装应用所需的依赖
RUN npm install

# 安装 FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get install -y  libcairo2 libpango-1.0-0 libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 复制其余的应用程序代码
COPY app/. . 

# 执行 bot
CMD ["npm", "run", "dev"]