# Wiki 系统

基于 Vue 3 + Express + MySQL 的 Wiki 知识管理系统，支持 Markdown 写作、分类管理、评论互动、权限控制和暗色模式。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Vue 3 (Composition API) + TypeScript | 响应式数据驱动，组件化开发 |
| 构建工具 | Vite 5 | 极速冷启动，HMR 热更新 |
| UI 组件库 | Element Plus | 暗色模式原生支持，中文文档 |
| 状态管理 | Pinia | Vue 3 官方推荐，模块化 Store |
| 路由 | Vue Router 4 | 导航守卫实现权限控制 |
| HTTP 客户端 | Axios | 拦截器统一管理 Token 和错误 |
| Markdown | marked + highlight.js | 服务端渲染 + 代码高亮 |
| 后端框架 | Express 5 + TypeScript | RESTful API, 中间件权限控制 |
| 数据库 | MySQL 8.0 | InnoDB 引擎, utf8mb4 编码 |
| 认证 | JWT (jsonwebtoken) + bcryptjs | Token 有效期 24h，密码哈希存储 |

## 项目结构

```
作业2/
├── 运行截图/                        # 系统运行截图
├── README.md                       # 项目说明文档
├── backend/                        # 后端服务
│   ├── .env                        # 数据库/JWT/端口配置
│   ├── init.sql                    # 建表 + 种子数据
│   ├── uploads/                    # 上传图片存储
│   └── src/
│       ├── index.ts                # Express 入口，挂载中间件和路由
│       ├── config/db.ts            # MySQL 连接池 (mysql2/promise)
│       ├── middleware/
│       │   ├── auth.ts             # JWT 验证 → req.user
│       │   ├── admin.ts            # 管理员权限守卫
│       │   └── upload.ts           # Multer 图片上传配置
│       ├── routes/                 # 路由层 (Router)
│       │   ├── auth.routes.ts      # 登录/注册/用户信息
│       │   ├── post.routes.ts      # 文章 CRUD + 隐藏切换
│       │   ├── comment.routes.ts   # 评论
│       │   ├── upload.routes.ts    # 图片上传
│       │   └── category.routes.ts  # 分类列表
│       ├── controllers/            # 控制器层 (业务逻辑)
│       │   ├── auth.controller.ts
│       │   ├── post.controller.ts
│       │   └── comment.controller.ts
│       └── utils/jwt.ts            # JWT 签发/验证工具
│
├── frontend/                       # 前端应用
│   ├── vite.config.ts              # Vite 配置 (含 API 代理)
│   ├── index.html
│   └── src/
│       ├── main.ts                 # 应用入口，挂载 Pinia/Router/ElementPlus
│       ├── App.vue                 # 根组件，根据路由切换布局
│       ├── router/index.ts         # 路由定义 + 导航守卫
│       ├── stores/                 # Pinia 状态管理
│       │   └── auth.ts             # 登录态 (token/user/role)
│       ├── api/                    # Axios 封装
│       │   ├── request.ts          # 拦截器 (自动带 Token, 401 跳转)
│       │   ├── auth.ts             # 登录/注册接口
│       │   ├── post.ts             # 文章接口
│       │   ├── comment.ts          # 评论接口
│       │   └── upload.ts           # 图片上传接口
│       ├── views/                  # 页面组件
│       │   ├── public/             # 前台页面
│       │   │   ├── HomePage.vue    # 文章列表 + 分类筛选
│       │   │   ├── PostDetail.vue  # 文章详情 + 评论
│       │   │   └── SearchPage.vue  # 搜索结果
│       │   └── admin/              # 后台页面
│       │       ├── LoginPage.vue   # 登录
│       │       ├── RegisterPage.vue# 注册
│       │       ├── Dashboard.vue   # 文章管理 (编辑/删除/隐藏)
│       │       └── PostEditor.vue  # Markdown 编辑器 (左写右预览)
│       ├── components/             # 可复用组件
│       │   ├── layout/             # PublicHeader, AdminSidebar 等
│       │   ├── post/               # PostCard, PostList, MarkdownPreview
│       │   ├── comment/            # CommentList, CommentForm
│       │   └── common/             # Pagination
│       └── composables/            # 组合式函数
│           └── useMarkdown.ts      # marked + highlight.js 封装
```

## 快速启动

### 1. 环境准备

- Node.js >= 18
- MySQL 8.0 (已安装并启动)

### 2. 初始化数据库

```bash
cd backend
# 修改 .env 中的 DB_PASSWORD 为你的 MySQL root 密码
npx tsx src/config/init-db.ts   # 建库、建表、种子数据
```

### 3. 启动后端

```bash
cd backend
npm run dev    # 开发模式 (端口 3000, 热重载)
npm run prod   # 生产模式 (端口 3000, 同时 serve 前端静态文件)
```

### 4. 启动前端 (开发模式)

```bash
cd frontend
npm run dev    # 端口 5173, 代理 API 到 3000
```

### 5. 访问

- 开发模式: http://localhost:5173
- 生产模式: http://localhost:3000
- 默认管理员: admin / admin123

## 关键功能

- **Markdown 写作**: 左侧 textarea 书写，右侧实时渲染预览，支持代码语法高亮
- **权限体系**: 游客浏览/评论 → 注册用户可发文 → 管理员可编辑删除隐藏置顶
- **响应式布局**: PC 三列网格 → 平板两列 → 手机单列，编辑器上下分栏
- **暗色模式**: 一键切换，Element Plus + CSS 变量全局生效，偏好持久化
- **图片管理**: 封面上传 (Multer)，Markdown 内图片点击查看原图
- **全文搜索**: SQL LIKE 查询标题和内容关键词
- **内网穿透部署**: 支持 Cloudflare Tunnel，无需公网 IP

## API 文档

### 认证

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | /api/register | 无 | 注册，返回 token |
| POST | /api/login | 无 | 登录，返回 token |
| GET | /api/user | JWT | 获取当前用户信息 |

### 文章

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | /api/posts | 无 | 文章列表 (支持 ?page/category/search) |
| GET | /api/posts?all=1 | JWT | 管理后台获取全部文章 |
| GET | /api/posts/:id | 无 | 文章详情 (自动 +view_count) |
| POST | /api/posts | JWT | 创建文章 |
| PUT | /api/posts/:id | Admin | 编辑文章 |
| DELETE | /api/posts/:id | Admin | 删除文章 |
| PUT | /api/posts/:id/hide | Admin | 切换隐藏/显示 |

### 评论

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | /api/posts/:id/comments | 无 | 评论列表 |
| POST | /api/posts/:id/comments | 无 | 发表评论 (游客) |

### 上传 & 分类

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | /api/upload | JWT | 上传图片 |
| GET | /api/categories | 无 | 分类列表 |

## 数据库设计

### users — 用户表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT UNSIGNED PK | 自增主键 |
| username | VARCHAR(50) UNIQUE | 用户名 |
| password | VARCHAR(255) | bcrypt 哈希 |
| role | ENUM('admin','user') | 角色，默认 user |

### articles — 文章表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT UNSIGNED PK | 自增主键 |
| title | VARCHAR(200) | 标题 |
| content | MEDIUMTEXT | Markdown 原文 |
| cover_image | VARCHAR(255) | 封面图路径 |
| category_id | FK → categories | 分类外键 |
| author_id | FK → users | 作者外键 |
| is_pinned | TINYINT(1) | 置顶标志 |
| is_hidden | TINYINT(1) | 隐藏标志 |
| view_count | INT UNSIGNED | 阅读量 |
| status | ENUM('draft','published') | 发布状态 |

### comments — 评论表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT UNSIGNED PK | 自增主键 |
| article_id | FK → articles CASCADE | 所评文章 |
| author_name | VARCHAR(50) | 游客昵称 |
| content | TEXT | 评论内容 |

## 系统截图

| 功能 | 截图 |
|------|------|
| 首页（亮色） | ![亮色主题](运行截图/亮色主题.png) |
| 首页（暗色） | ![暗色主题](运行截图/暗色主题.png) |
| 按分类筛选 | ![技术](运行截图/按类别筛选(技术).png) ![生活](运行截图/按类别筛选(生活).png) |
| 搜索 | ![搜索功能](运行截图/搜索功能.png) |
| 文章详情 | ![文章详细页](运行截图/文章详细页.png) |
| 评论 | ![评论](运行截图/评论.png) |
| 访问量统计 | ![访问量统计](运行截图/访问量统计.png) |
| 用户注册 | ![注册](运行截图/注册.png) |
| 用户登录 | ![登录](运行截图/登录.png) |
| 写文章 | ![写文章](运行截图/写文章.png) |
| 文章管理 | ![文章后台管理](运行截图/文章后台管理.png) |
| 查看封面图 | ![查看上传的封面图](运行截图/查看上传的封面图.png) |

## 额外实现功能

以下功能超出作业原题要求，为自主扩展：

| 序号 | 功能 | 说明 |
|------|------|------|
| 1 | **用户注册** | `POST /api/register` + `/register` 页面，注册后自动登录。注册用户默认 role 为 `user`，可发文和上传图片 |
| 2 | **普通用户发帖** | 原题仅管理员可编辑，扩展为注册用户可通过公共布局的 Markdown 编辑器发布文章，发布后自动跳回首页 |
| 3 | **文章隐藏** | 管理员可切换文章隐藏/显示状态。隐藏文章不在首页展示、搜索不到、前端详情页返回 404。数据库中 `is_hidden` 字段实现软删除逻辑 |
| 4 | **图片点击预览** | 封面图使用 `el-image` 组件自带预览；Markdown 正文中的图片通过事件委托，点击弹出全屏遮罩层查看原图 |
| 5 | **退出登录** | Header 显示当前用户名，旁边提供"退出"按钮，清除 Token 和用户状态 |
| 6 | **自动登录恢复** | 应用启动时从 localStorage 读取 Token，调用 `GET /api/user` 恢复用户信息和登录态，刷新页面不掉线 |
| 7 | **一键建库脚本** | `npm run init-db` 自动建库、建表、插入种子数据，无需手动执行 SQL |
| 8 | **内网穿透部署** | 文档支持 Cloudflare Tunnel 部署方案，无需公网 IP 即可公网访问 |

## 技术难点总结

### 1. JWT 认证与权限分级

使用 jsonwebtoken 签发 Token，Express 中间件链实现三级权限：无认证（游客）→ JWT 认证（注册用户）→ Admin 守卫（管理员）。Axios 请求拦截器自动注入 Token，响应拦截器统一处理 401 过期跳转。难点在于中间件的执行顺序和错误传播，以及 Token 过期后前端状态的同步清理。

### 2. Markdown 实时预览

使用 marked 将 Markdown 转为 HTML，highlight.js 对代码块做语法高亮。预览通过 Vue 的 computed 属性实现，用户每次输入自动触发重新渲染。由于 marked 对每个 ` ``` ` 代码块单独解析，需要后处理替换 `<pre><code>` 为 highlight.js 的高亮版本。大段文本输入时需要考虑 computed 的计算开销。

### 3. 前后端分离的部署架构

开发模式下前端 Vite 代理 API 到后端；生产模式下 Express 直接 serve 编译后的前端静态文件，并通过 `/{*splat}` 通配路由支持 Vue Router history 模式。Express 5 的 path-to-regexp v8 语法变化（`*` → `/{*splat}`）是实际遇到的兼容性问题。

### 4. 图片上传与展示

Multer 处理文件上传，生成时间戳 + 随机字符串文件名防冲突。前端 Markdown 中的图片通过事件委托检测点击，弹出全屏遮罩层预览原图。封面图使用 Element Plus 的 el-image 组件内置预览功能。

### 5. 暗色模式实现

VueUse 的 useDark() 自动处理系统偏好检测、localStorage 持久化和 `<html>` 的 `dark` class 切换。Element Plus 的暗色 CSS 变量在 `html.dark` 下自动生效，配合项目自定义 CSS 变量实现组件和页面的统一风格切换。

### 6. 搜索与分页

后端通过 SQL LIKE 实现标题和内容的模糊搜索，支持中文字符。前端使用 Vue Router 的 query 参数驱动分类筛选和搜索，watch 监听 query 变化自动重新拉取数据。分页组件与 Element Plus Pagination 集成，页码切换时控制滚动位置。
