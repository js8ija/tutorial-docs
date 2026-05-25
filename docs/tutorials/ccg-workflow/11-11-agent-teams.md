---
title: "11. Agent Teams"
description: "CCG Workflow：11. Agent Teams"
---
<!-- This file is generated from the workspace tutorial source. Edit the source Markdown or generator. -->
## 11. Agent Teams

> 原文：https://ccg.fengshao1227.com/advanced/agent-teams/

大型任务通过 Claude Code 的 Agent Teams 功能（TeamCreate）spawn 多个 Builder 队友并行编码。每个 Builder 获得隔离的文件所有权，互不冲突。

### 前置条件

Agent Teams 是 Claude Code 的实验性功能，需要设置环境变量启用：

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

在 ~/.claude/settings.json 的 "env" 中添加上述配置。

### 工作机制

#### 触发条件

当 /ccg:go 选择 full-collaborate 策略时，实施阶段会自动 spawn Agent Teams：

```text
full-collaborate 策略:
  Phase 1-3: 分析 + 计划 + HARD STOP
  Phase 4: ← 这里触发 Agent Teams
    → TeamCreate Builder-1 (负责 auth/ 模块)
    → TeamCreate Builder-2 (负责 api/ 模块)
    → TeamCreate Builder-3 (负责 tests/)
  Phase 5-6: 质量关卡 + 审查
```

#### 文件所有权隔离

核心规则：每个文件同一时刻只允许一个 Builder 修改。

引擎在 Phase 3（计划）阶段生成文件所有权矩阵：

```text
Builder-1: src/auth/jwt.ts, src/auth/middleware.ts
Builder-2: src/api/routes.ts, src/api/controllers.ts
Builder-3: tests/auth.test.ts, tests/api.test.ts
```

每个 Builder 的 prompt 中会明确注入：“只修改分配给你的文件，禁止扩域”。

#### 上下文注入

subagent-context.js Hook 在 TeamCreate 时自动向每个 Builder 注入：

- 任务计划（plan.md）

- 项目编码规范（.ccg/spec/ 中的相关文件）

- 该 Builder 负责的文件范围

- 接口约定（Builder 之间如何协作）

#### 执行与收敛

```text
主 Claude（Lead）
    │
    ├── spawn Builder-1 → 完成后报告
    ├── spawn Builder-2 → 完成后报告
    └── spawn Builder-3 → 完成后报告
    │
    ← 等待所有 Builder 完成
    │
    └── 收敛：审查 + 集成 + 质量关卡
```

### Builder 提示词规范

每个 Builder 的 prompt 必须包含以下硬约束（由引擎自动注入）：

- 只改分配文件 — 禁止修改文件所有权矩阵之外的文件

- 禁止扩域 — 不得自行”发现”新需求并实现

- 必须回报验证命令 — 完成后输出验证该文件变更的命令

### 与 Legacy Team 命令的关系

v3.0 的 Agent Teams 由 /ccg:go 的 full-collaborate 策略自动管理。

Legacy 模式提供了 4 个独立的 Team 命令，允许手动控制每个阶段：

| Legacy 命令 | 对应 full-collaborate 阶段 |
| --- | --- |
| /ccg:team-research | Phase 1-2（分析） |
| /ccg:team-plan | Phase 3（计划） |
| /ccg:team-exec | Phase 4（并行实施） |
| /ccg:team-review | Phase 5-6（审查） |

> 提示
>
大多数情况下，/ccg:go 的自动管理已经足够。只有当你需要在每个阶段之间精细干预时，才需要使用 Legacy Team 命令。

### 适用场景

Agent Teams 适合以下场景：

- 涉及 3+ 个独立模块的功能开发

- 需要 2+ 个并行工作流的任务

- 总步骤超过 10 步的大型任务

- 文件间耦合度低，可以并行修改

不适合：

- 高度耦合的单文件修改

- 需要严格顺序执行的迁移操作

- 简单的 bug 修复
