# 使用 Node.js 官方鏡像作為基礎鏡像
FROM node:18

# 定義工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安裝應用所需的依賴
RUN npm install

# 複製其餘的應用程序代碼
COPY . .

# 執行bot
CMD ["npm", "run", "dev"]