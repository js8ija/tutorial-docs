---
title: "Worktree 详细说明"
description: "Superpowers：Worktree 详细说明"
---
<!-- This file is generated from the workspace tutorial source. Edit the source Markdown or generator. -->
## Worktree 详细说明

Superpowers 推荐在独立 worktree 中执行实现计划，避免污染当前工作区。

### 目录选择优先级

| 优先级 | 目录 | 说明 |
|---|---|---|
| 1 | `.worktrees/` | 首选，项目内隐藏目录 |
| 2 | `worktrees/` | 项目内普通目录 |
| 3 | `CLAUDE.md` 指定位置 | 如果项目文档写了偏好，按文档走 |
| 4 | 询问用户 | 在本地目录和全局目录之间选择 |

### 必须验证忽略规则

如果使用项目内目录，必须先验证它不会被 Git 跟踪：

```bash
git check-ignore -q .worktrees
```

如果没有被忽略，应添加到 `.gitignore` 并提交：

```bash
printf "\n.worktrees/\n" >> .gitignore
git add .gitignore
git commit -m "chore: ignore worktrees"
```

### 创建 worktree 示例

```bash
project=$(basename "$(git rev-parse --show-toplevel)")
git worktree add ".worktrees/user-invitation" -b "feature/user-invitation"
cd ".worktrees/user-invitation"
npm install
npm test
```

如果测试失败，应该先报告失败并询问是否继续，而不是假装基线干净。
