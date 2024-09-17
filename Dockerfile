# 使用 Node.js 官方镜像作为基础镜像
FROM node:18

# 定义工作目录
WORKDIR /usr/src/app/app 

# 将package.json 和 package-lock.json复制到工作目录
COPY app/package*.json ./

# 安装应用所需的依赖
RUN npm install

# 复制其余的应用程序代码
COPY app/. . 

# 执行 bot
CMD ["npm", "run", "dev"]