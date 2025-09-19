# 开发环境搭建

## 🚀 快速开始

### 系统要求
- **Node.js**: 18.0.0 或更高版本
- **npm**: 8.0.0 或更高版本
- **PostgreSQL**: 13.0 或更高版本
- **Git**: 2.0.0 或更高版本

### 推荐开发工具
- **IDE**: VS Code 或 WebStorm
- **数据库管理**: pgAdmin 或 DBeaver
- **API 测试**: Postman 或 Insomnia
- **版本控制**: Git

## 📦 项目安装

### 1. 克隆项目
```bash
git clone https://github.com/your-org/healthai-platform.git
cd healthai-platform
```

### 2. 安装依赖
```bash
# 安装项目依赖
npm install

# 安装开发依赖
npm install --save-dev
```

### 3. 环境配置
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

### 环境变量配置
```env
# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/healthai

# OpenAI API 配置
OPENAI_API_KEY=your_openai_api_key_here

# 服务器配置
NODE_ENV=development
PORT=3000
SESSION_SECRET=your_session_secret_here

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# 日志配置
LOG_LEVEL=debug
LOG_FILE=./logs/app.log
```

## 🗄️ 数据库设置

### 1. PostgreSQL 安装

#### macOS (使用 Homebrew)
```bash
# 安装 PostgreSQL
brew install postgresql

# 启动服务
brew services start postgresql

# 创建数据库
createdb healthai
```

#### Ubuntu/Debian
```bash
# 安装 PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库
sudo -u postgres createdb healthai
```

#### Windows
1. 下载 PostgreSQL 安装包
2. 运行安装程序
3. 设置管理员密码
4. 使用 pgAdmin 创建数据库

### 2. 数据库模式推送
```bash
# 推送数据库模式
npm run db:push

# 验证数据库连接
npm run db:check
```

### 3. 种子数据 (可选)
```bash
# 创建测试数据
npm run db:seed
```

## 🏃‍♂️ 启动开发服务器

### 1. 启动后端服务
```bash
# 开发模式启动
npm run dev

# 或者分别启动
npm run dev:server
```

### 2. 启动前端服务
```bash
# 前端开发服务器
npm run dev:client
```

### 3. 同时启动前后端
```bash
# 使用 concurrently 同时启动
npm run dev:all
```

### 4. 验证安装
访问以下地址验证服务是否正常：
- **前端**: http://localhost:3000
- **后端 API**: http://localhost:3000/api
- **健康检查**: http://localhost:3000/api/health

## 🛠️ 开发工具配置

### VS Code 配置

#### 推荐扩展
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-css-peek",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

#### 工作区设置
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

### ESLint 配置
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
```

### Prettier 配置
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 🧪 测试环境

### 1. 单元测试
```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- --testNamePattern="MultiAgentChat"

# 运行测试并生成覆盖率报告
npm run test:coverage
```

### 2. 集成测试
```bash
# 运行集成测试
npm run test:integration

# 运行 E2E 测试
npm run test:e2e
```

### 3. 测试数据库
```bash
# 创建测试数据库
createdb healthai_test

# 运行测试前准备
npm run test:setup
```

## 🔧 开发脚本

### 常用脚本
```bash
# 开发相关
npm run dev              # 启动开发服务器
npm run dev:server       # 仅启动后端
npm run dev:client       # 仅启动前端
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 数据库相关
npm run db:push          # 推送数据库模式
npm run db:generate      # 生成数据库迁移
npm run db:migrate       # 运行数据库迁移
npm run db:seed          # 填充种子数据
npm run db:reset         # 重置数据库

# 代码质量
npm run check            # TypeScript 类型检查
npm run lint             # ESLint 检查
npm run lint:fix         # 自动修复 ESLint 错误
npm run format           # Prettier 格式化
npm run format:check     # 检查格式化

# 测试相关
npm test                 # 运行测试
npm run test:watch       # 监听模式运行测试
npm run test:coverage    # 生成覆盖率报告
npm run test:integration # 集成测试
npm run test:e2e         # E2E 测试
```

## 🐛 调试配置

### VS Code 调试配置
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "runtimeArgs": ["-r", "tsx/cjs"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug Client",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/client/src"
    }
  ]
}
```

### 调试技巧
```typescript
// 使用 console.log 调试
console.log('Debug info:', { data, timestamp: new Date() });

// 使用 debugger 断点
debugger;

// 使用 Node.js 调试器
node --inspect server/index.ts
```

## 📊 性能监控

### 开发环境监控
```bash
# 安装监控工具
npm install --save-dev clinic

# 性能分析
npx clinic doctor -- node server/index.ts

# 内存分析
npx clinic heapprofiler -- node server/index.ts
```

### 日志配置
```typescript
// 开发环境日志配置
const logger = {
  level: 'debug',
  format: 'dev',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
};
```

## 🔄 热重载配置

### 前端热重载
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true
    }
  }
});
```

### 后端热重载
```bash
# 使用 tsx 实现热重载
npm install -g tsx
tsx watch server/index.ts
```

## 🚀 部署准备

### 1. 生产构建
```bash
# 构建前端
npm run build:client

# 构建后端
npm run build:server

# 构建全部
npm run build
```

### 2. 环境检查
```bash
# 检查生产环境配置
npm run check:prod

# 运行生产测试
npm run test:prod
```

### 3. Docker 构建
```bash
# 构建 Docker 镜像
docker build -t healthai-platform .

# 运行 Docker 容器
docker run -p 3000:3000 healthai-platform
```

## ❓ 常见问题

### Q: 数据库连接失败
**A**: 检查以下项目：
1. PostgreSQL 服务是否启动
2. 数据库连接字符串是否正确
3. 防火墙设置是否允许连接
4. 数据库用户权限是否正确

### Q: OpenAI API 调用失败
**A**: 检查以下项目：
1. API 密钥是否正确设置
2. 网络连接是否正常
3. API 配额是否充足
4. 请求格式是否正确

### Q: 前端页面无法访问
**A**: 检查以下项目：
1. 前端服务是否启动
2. 端口是否被占用
3. 代理配置是否正确
4. 浏览器缓存是否清理

### Q: 热重载不工作
**A**: 检查以下项目：
1. 文件监听是否启用
2. 文件系统权限是否正确
3. 防病毒软件是否干扰
4. 磁盘空间是否充足

## 📞 获取帮助

### 开发支持
- **GitHub Issues**: 提交 bug 报告和功能请求
- **Discord**: 实时开发讨论
- **文档**: 查看完整文档
- **邮件**: dev-support@healthai.com

### 学习资源
- **React 官方文档**: https://react.dev/
- **TypeScript 手册**: https://www.typescriptlang.org/docs/
- **Tailwind CSS 文档**: https://tailwindcss.com/docs
- **Express.js 指南**: https://expressjs.com/

---

**Happy Coding!** 🚀 开始构建下一代医疗 AI 平台吧！
