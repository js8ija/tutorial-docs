---
title: "Skills 总览"
description: "Superpowers：Skills 总览"
---
<!-- This file is generated from the workspace tutorial source. Edit the source Markdown or generator. -->
## Skills 总览

| Skill | 何时使用 | 功能说明 | 示例提示词 |
|---|---|---|---|
| `using-superpowers` | 每次对话开始或可能有 skill 适用时 | 要求智能体先检查并加载相关 skill，再行动 | `开始前请按 Superpowers 规则检查该用哪些 skill` |
| `brainstorming` | 创建功能、组件、行为变更、产品设计前 | 先理解项目上下文，逐步提问，提出方案，写设计文档 | `请使用 superpowers:brainstorming 设计登录流程改版` |
| `using-git-worktrees` | 开始功能开发或执行计划前 | 创建隔离 worktree，安装依赖，验证干净测试基线 | `请使用 superpowers:using-git-worktrees 为支付功能建独立工作区` |
| `writing-plans` | 已有设计或需求，要拆成实施计划时 | 写详细实施计划，包含文件、代码、测试、命令、提交步骤 | `请使用 superpowers:writing-plans 把这个 spec 拆成可执行任务` |
| `subagent-driven-development` | 有实施计划，且任务相对独立时 | 每个任务派发独立子代理，实现后做规格审查和代码质量审查 | `请使用 superpowers:subagent-driven-development 执行这个计划` |
| `executing-plans` | 有实施计划，但不能或不适合用子代理时 | 当前会话按计划执行，带检查点和阻塞上报 | `请使用 superpowers:executing-plans 执行 docs/superpowers/plans/x.md` |
| `test-driven-development` | 实现功能、修 bug、重构、行为变更前 | 强制 RED-GREEN-REFACTOR：先写失败测试，再写最小实现 | `请使用 superpowers:test-driven-development 添加重试逻辑` |
| `systematic-debugging` | 遇到 bug、测试失败、构建失败、异常行为时 | 四阶段定位根因：调查、模式分析、假设验证、修复 | `请使用 superpowers:systematic-debugging 分析这个 CI 失败` |
| `verification-before-completion` | 要声明完成、修复、测试通过、准备提交/PR 前 | 必须运行新鲜验证命令，以证据支撑完成声明 | `完成前请使用 superpowers:verification-before-completion 验证` |
| `requesting-code-review` | 完成任务、重大功能、合并前 | 派发 code-reviewer 检查实现是否满足需求 | `请使用 superpowers:requesting-code-review 审查本次改动` |
| `receiving-code-review` | 收到代码审查反馈后 | 先理解和验证反馈，再逐项实现，必要时技术性反驳 | `请使用 superpowers:receiving-code-review 处理这些 review comments` |
| `dispatching-parallel-agents` | 多个独立问题可并行调查时 | 一个问题域一个子代理，避免上下文互相污染 | `请使用 superpowers:dispatching-parallel-agents 并行分析这 3 个测试文件失败` |
| `finishing-a-development-branch` | 实现完成且测试通过，需要决定如何收尾时 | 提供本地合并、创建 PR、保留分支、丢弃四种选择 | `请使用 superpowers:finishing-a-development-branch 收尾这个分支` |
| `writing-skills` | 创建、修改、验证 skill 时 | 用 TDD 思路写流程文档，先用压力场景验证旧行为会失败 | `请使用 superpowers:writing-skills 创建一个代码生成规范 skill` |
