---
title: "14. 如何在 Claude Code 中同时使用多个 AI 模型协作编码"
description: "CCG Workflow：14. 如何在 Claude Code 中同时使用多个 AI 模型协作编码"
---
<!-- This file is generated from the workspace tutorial source. Edit the source Markdown or generator. -->
## 14. 如何在 Claude Code 中同时使用多个 AI 模型协作编码

> 原文：https://ccg.fengshao1227.com/blog/multi-model-ai-coding/

单个 AI 模型写代码的天花板很明显：Claude 擅长理解和编排，但前端不如 Gemini；Codex 后端分析强，但不擅长 UI。如果让它们各做各擅长的事呢？

CCG Workflow 就是干这个的——一个运行在 Claude Code 里的多模型协作引擎。

### 为什么需要多模型协作

一个典型的全栈功能（比如「给 API 加 JWT 认证」）涉及：

- 后端：路由中间件、token 签发/验证、刷新机制

- 前端：登录页面、token 存储、请求拦截器

- 全局：代码组织、错误处理、测试

让一个模型做所有事，结果往往是前端代码将就、后端逻辑粗糙。

### CCG 的三模型分工

| 模型 | 角色 | 擅长 |
| --- | --- | --- |
| Claude | 编排者 | 理解意图、选择策略、审查代码、最终写入 |
| Codex | 后端分析师 | API 设计、数据库逻辑、业务流程分析 |
| Gemini | 前端分析师 | UI 组件、样式、交互逻辑分析 |

关键设计：外部模型（Codex / Gemini）没有文件写入权限。它们只返回分析结果和 patch 建议，Claude 审查通过后才写入代码库。

### 实际使用流程

安装 CCG：

```bash
npx ccg-workflow
```

然后在 Claude Code 里：

```text
> /ccg:go 给这个 API 加上 JWT 认证
```

引擎自动：

- 分析项目上下文（tech stack、文件结构）

- 判断这是 L 复杂度的后端功能

- 选择 full-collaborate 策略

- 并行调用 Codex（分析 API 层）+ Gemini（分析可能涉及的前端改动）

- 合成方案 → 等你审批

- 审批后 Agent Teams 并行实现

- 质量关卡 + 交叉审查

你只输入了一句话，引擎处理了剩下的一切。

### 10 种策略自动匹配

不是所有任务都需要三个模型。简单的 bug 修复用 direct-fix，Claude 直接搞定，零开销。只有复杂任务才会调用完整引擎：

- 简单 bug → direct-fix（Claude only）

- 小功能 → quick-implement（Claude only）

- 中等功能 → guided-develop（Claude + 1 个外部模型）

- 复杂功能 → full-collaborate（Claude + Codex + Gemini + Agent Teams）

引擎根据任务复杂度自动选择，不需要你手动指定。

### Hook 引擎保持状态

多模型协作最大的挑战是状态丢失。Claude Code 的上下文窗口有限，长对话会压缩历史。

CCG 通过 4 个 JavaScript Hook 解决这个问题：

- workflow-state.js — 每轮对话自动注入当前任务状态

- session-start.js — 新会话或上下文压缩后，自动恢复完整任务上下文

- subagent-context.js — 子 Agent 自动获得规格文件

- skill-router.js — 提到安全/缓存/RAG 等关键词时，自动加载领域知识

结果：任务状态永不丢失，即使对话进行了几百轮。

### 开始使用

```bash
npx ccg-workflow
```

需要 Node.js 20+ 和 Claude Code CLI。Codex CLI 和 Gemini CLI 可选安装。

详细安装指南：快速开始

CCG Workflow 是开源项目（MIT），GitHub 仓库 欢迎 Star 和贡献。
