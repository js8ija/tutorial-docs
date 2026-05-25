---
title: "5. Hook 引擎"
description: "CCG Workflow：5. Hook 引擎"
---
<!-- This file is generated from the workspace tutorial source. Edit the source Markdown or generator. -->
## 5. Hook 引擎

> 原文：https://ccg.fengshao1227.com/hooks/

CCG 安装 4 个 Hook 到 ~/.claude/settings.json。Hook 是纯 JavaScript，零依赖，失败时静默退出（不影响正常使用）。

### Hook 一览

| Hook | 事件 | 用途 |
| --- | --- | --- |
| workflow-state.js | UserPromptSubmit | 每轮注入任务状态面包屑 |
| session-start.js | SessionStart | 会话开始/清除/压缩时注入完整项目上下文 |
| subagent-context.js | PreToolUse | 向 codeagent-wrapper 和 Team 成员注入 spec + 任务上下文 |
| skill-router.js | UserPromptSubmit | 检测关键词时自动注入领域知识 |

### workflow-state.js

事件: UserPromptSubmit（每次用户发送消息时触发）

作用: 读取当前活跃任务的 task.json，将任务状态注入到用户消息的前缀中。

注入格式:

```xml
<ccg-state>
Task: add-jwt-auth (in_progress)
Strategy: full-collaborate
Phase: 4-implementation
Next: Layer 1 Builders 执行中
</ccg-state>
```

工作机制:

- 扫描 .ccg/tasks/ 目录，查找状态为 in_progress 的任务

- 读取 task.json 中的 strategy、phase、gate 等字段

- 生成 &lt;ccg-state&gt; XML 块

- 注入到用户消息的头部（对用户不可见，但 Claude 能看到）

> 提示
>
这个 Hook 是 CCG 状态连续性的核心。即使经历了 50 轮对话，Claude 也能通过每轮注入的面包屑知道”当前任务是什么、执行到哪一步了”。

### session-start.js

事件: SessionStart（会话开始、上下文清除、上下文压缩时触发）

作用: 注入完整的项目上下文和当前任务状态，确保 Claude 在新会话或压缩后不丢失关键信息。

注入内容:

- 项目技术栈信息

- 当前活跃任务的完整状态（含计划、进度）

- 相关 spec 文件的引用

- 未完成的 HARD STOP 检查点

为什么需要它:

Claude Code 的上下文窗口有限。当对话过长时，早期的上下文会被压缩或丢弃。session-start.js 确保关键状态信息在压缩后被重新注入，实现状态不丢失。

警告

如果你手动删除了 .ccg/tasks/ 下的任务目录，Hook 将无法恢复该任务的状态。任务目录是状态的唯一持久化来源。

### subagent-context.js

事件: PreToolUse（在 Bash 或 Agent 工具调用前触发）

作用: 当检测到 codeagent-wrapper 调用或 Agent Teams TeamCreate 操作时，自动注入项目规范（spec）和任务上下文。

触发条件:

- 调用 codeagent-wrapper --backend codex/gemini 时

- 通过 TeamCreate spawn Builder 队友时

注入内容:

- 读取任务目录下的 context.jsonl，获取相关 spec 文件列表

- 将 .ccg/spec/ 中的对应规范文件内容注入到子 Agent 的 prompt 中

- 注入当前任务的计划和约束

效果: 子 Agent（无论是 Codex/Gemini 外部模型还是 Team Builder）都会自动遵循项目编码规范，无需人工在每次调用时手动粘贴规范。

```bash
主 Claude 调用 codeagent-wrapper
    ↓
subagent-context.js 拦截
    ↓
读取 .ccg/tasks/current/context.jsonl
    ↓
注入 spec/backend/index.md 内容到 prompt
    ↓
codeagent-wrapper 执行（带规范上下文）
```

### skill-router.js

事件: UserPromptSubmit（每次用户发送消息时触发）

作用: 扫描用户消息中的领域关键词，自动将对应的知识文件注入上下文。

关键词映射示例:

| 检测到的关键词 | 注入的知识文件 |
| --- | --- |
| 渗透、红队、exploit | domains/security/red-team.md |
| 缓存、Redis、CDN | domains/architecture/caching.md |
| RAG、向量数据库 | domains/ai/rag-system.md |
| 性能、profiling | domains/devops/performance.md |

工作机制:

- 对用户消息进行关键词匹配（支持中英文）

- 命中时读取 ~/.claude/skills/ccg/domains/ 下对应知识文件

- 将知识文件内容注入到上下文中

- 每个会话内同一知识文件只注入一次（避免重复）

注意

知识文件注入是增量的。如果一轮对话涉及多个领域（比如”给 Redis 缓存做安全加固”），会同时注入 caching 和 security 两个知识文件。

### Hook 注册方式

所有 Hook 注册在 ~/.claude/settings.json 中：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "command": "node ~/.claude/hooks/ccg/workflow-state.js"
      },
      {
        "type": "command",
        "command": "node ~/.claude/hooks/ccg/skill-router.js"
      }
    ],
    "SessionStart": [
      {
        "type": "command",
        "command": "node ~/.claude/hooks/ccg/session-start.js"
      }
    ],
    "PreToolUse": [
      {
        "type": "command",
        "command": "node ~/.claude/hooks/ccg/subagent-context.js"
      }
    ]
  }
}
```

### 设计原则

- 零依赖 — 纯 Node.js 标准库，无需安装额外包

- 静默失败 — Hook 出错时 exit(0)，不阻塞用户工作流

- 幂等 — 多次执行结果一致，不会重复注入

- 轻量 — 每个 Hook 执行时间 < 50ms
