---
title: "个人 Skill 创建教程"
description: "Superpowers：个人 Skill 创建教程"
---
<!-- This file is generated from the workspace tutorial source. Edit the source Markdown or generator. -->
## 个人 Skill 创建教程

Codex 可以从 `~/.agents/skills/` 自动发现个人 skill。

### 创建目录

```bash
mkdir -p ~/.agents/skills/my-skill
```

### 创建 `SKILL.md`

```markdown
---
name: my-skill
description: Use when [具体触发条件] - [适用场景]
---

# My Skill

## Overview

这里写这个 skill 的核心原则。

## When to Use

- 适用情况 1
- 适用情况 2

## Process

1. 第一步
2. 第二步
3. 第三步
```

### 写 skill 的关键规则

- `name` 和 `description` 是必需字段
- `description` 要写“什么时候用”，不要写完整流程
- 技术流程类 skill 应该可测试
- 如果创建复杂 skill，使用 `superpowers:writing-skills`

示例提示词：

```text
请使用 superpowers:writing-skills。
我想创建一个 skill，用来规范我们项目里的 API 错误处理。
```
