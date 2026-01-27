# 利群 (Liquun) - 个人科研综合管理系统

**利群 (Liquun)** 是一个专为科研人员打造的本地优先（Local-First）个人知识管理系统。它旨在帮助研究者高效管理课题脉络、实验记录、文献阅读以及学术日程，让科研工作井井有条。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-stable-green.svg)

## 🌟 核心理念

> "利群" —— 既寓意利于群体、造福社会，也代表在科研道路上追求卓越、宁静致远的治学态度。

本系统采用 **本地优先** 策略，所有数据存储在本地 SQLite 数据库中，确保数据的绝对安全与隐私，且无厂商锁定风险。

## ✨ 主要功能

### 1. 📊 仪表盘 (Dashboard)
- 全局概览：实时显示活跃课题数、实验记录总数及待读文献。
- 快捷入口：一键创建新课题或记录实验。

### 2. 📁 课题管理 (Projects)
- **课题脉络**：清晰记录每个课题的背景、目标和当前状态（进行中/已归档）。
- **关联管理**：自动聚合该课题下的所有实验记录和参考文献，形成完整的证据链。

### 3. 🧪 实验笔记本 (Lab Notebook)
- **Markdown 支持**：支持富文本记录，包括公式、代码块等。
- **实时预览**：所见即所得的编辑体验。
- **完整记录**：包含实验日期、状态（计划中/失败/成功）、标签（Tags）及详细过程。

### 4. 📚 文献库 (Literature)
- **沉浸式阅读**：集成的文献详情页，支持一边查看元数据一边撰写 Markdown 笔记。
- **状态追踪**：标记文献为 `Unread`、`Reading` 或 `Read`。
- **智能检索**：支持按标题、作者搜索，并按阅读状态筛选。

### 5. 🗓 日程与汇报 (Schedule)
- **会议记录**：专门记录组会汇报内容及导师/同行反馈。
- **任务清单**：轻量级待办事项（To-Do），支持优先级管理。

## 🛠 技术栈

本项目基于现代化的 Web 技术构建，兼顾高性能与开发体验：

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://www.sqlite.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 快速开始

### 环境要求
- Node.js 18+

### 安装与运行

1.  **克隆项目**
    ```bash
    git clone https://github.com/VINNTWANG/liquun.git
    cd liquun
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **初始化数据库**
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **启动开发服务器**
    ```bash
    npm run dev
    ```

5.  访问 `http://localhost:3000` 开始使用。

## 📦 数据备份

你的所有核心数据存储在 `prisma/dev.db` 文件中。
建议定期备份该文件，或将其包含在你的私有备份策略中。

## 📄 许可证

MIT License.