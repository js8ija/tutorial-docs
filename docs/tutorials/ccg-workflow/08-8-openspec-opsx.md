---
title: "8. OpenSpec (OPSX)"
description: "CCG Workflow：8. OpenSpec (OPSX)"
---
<!-- This file is generated from the workspace tutorial source. Edit the source Markdown or generator. -->
## 8. OpenSpec (OPSX)

> 原文：https://ccg.fengshao1227.com/commands/openspec/

OPSX（OpenSpec）将模糊需求转化为可验证约束，消除 AI 即兴发挥。它是一套结构化的需求-规划-实施流程，确保代码变更有章可循。

### 核心理念

传统 AI 编码的问题：你描述一个需求，AI 可能理解偏差、自由发挥、遗漏边界条件。

OPSX 的解决方案：

- 先把需求转化为明确的约束集（不是模糊的描述）

- 再从约束生成零决策计划（每一步都无需人类判断即可执行）

- 最后严格按计划实施

### 命令流程

```text
/ccg:spec-init       → 初始化 OPSX 环境 + Profile 系统
        ↓
/ccg:spec-research   → 并行探索 → 约束集（OPSX 提案）
        ↓
/ccg:spec-plan       → 多模型分析 → 消除歧义 → 零决策计划
        ↓
/ccg:spec-impl       → 按计划执行 + 归档
        ↓
/ccg:spec-review     → 双模型独立审查（随时可用）
```

### 命令详解

#### /ccg:spec-init

作用: 初始化 OPSX 环境

执行内容:

- 设置 Profile 系统（项目级约束模板）

- 自动检测项目技术栈

- 验证多模型 MCP 工具可用性

- 创建 .ccg/spec/ 目录结构（如不存在）

> 提示
>
spec-init 每个项目只需执行一次。后续使用其他 spec 命令时不需要重复初始化。

#### /ccg:spec-research

作用: 将模糊需求转化为可验证约束集

执行流程:

- 解析用户需求描述

- 并行调用 Codex + Gemini 探索代码库

- 识别相关模块、依赖、约束

- 输出结构化 OPSX 提案（含约束、前置条件、验收标准）

输出格式:

```text
## 约束集

1. [MUST] JWT token 过期时间可配置
2. [MUST] 刷新 token 机制
3. [SHOULD] 支持 token 撤销
4. [MUST NOT] 在 URL 参数中传递 token
```

#### /ccg:spec-plan

作用: 从约束集生成零决策可执行计划

执行流程:

- 读取 spec-research 的约束输出

- 多模型分析约束间的依赖关系

- 消除歧义（任何含糊的点都明确化）

- 生成步骤化实施计划

“零决策”含义: 计划中的每一步都足够具体，执行者（无论是人还是 AI）不需要做任何判断或选择，直接执行即可。

#### /ccg:spec-impl

作用: 严格按照 plan 执行代码变更

执行流程:

- 读取 plan.md

- 按步骤逐一实施

- 每步完成后验证约束是否满足

- 全部完成后自动归档到任务目录

警告

spec-impl 严格按照 plan 执行，不会”即兴”添加未规划的功能。如果发现 plan 有遗漏，应回到 spec-plan 补充，而不是在 impl 阶段临时发挥。

#### /ccg:spec-review

作用: 双模型交叉审查

执行流程:

- Codex 和 Gemini 独立审查代码变更

- 各自输出 findings（Critical / Warning / Info）

- 合并去重，生成统一审查报告

独立使用: spec-review 可以在任何时候使用，不一定需要先跑完整个 spec 流程。它本质上是一个双模型代码审查工具。

### 与 /ccg:go 的关系

/ccg:go 的 full-collaborate 策略内部使用了类似 OPSX 的流程（分析 → 计划 → 实施 → 审查）。区别在于：

| /ccg:go | OPSX 命令 |  |
| --- | --- | --- |
| 适合 | 一站式快速执行 | 需要精细控制每个阶段 |
| 流程 | 自动串联 | 手动逐步执行 |
| 干预 | HARD STOP 点 | 每个命令间都可以干预 |
| 场景 | 大多数开发任务 | 高风险 / 高精度需求 |

> 提示
>
如果你需要在每个阶段之间审查和调整（比如高风险的数据库迁移），使用 OPSX 命令逐步执行。如果你信任引擎的判断，直接用 /ccg:go。
