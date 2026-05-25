---
title: "1. CodeGraph 是什么"
description: "CodeGraph：1. CodeGraph 是什么"
---
<!-- This file is generated from the workspace tutorial source. Edit the source Markdown or generator. -->
## 1. CodeGraph 是什么

CodeGraph 是一个本地优先的代码智能工具。它会用 tree-sitter 解析代码，把文件、符号、调用关系、导入关系、继承关系和框架路由等结构写入项目根目录下的 `.codegraph/codegraph.db` SQLite 数据库，然后通过 CLI、MCP Server 和 TypeScript API 提供查询能力。

它的核心价值是：让 Claude Code、Cursor、Codex CLI、opencode、Hermes Agent 等 AI Coding Agent 不必反复用 `grep`、`find`、`Read` 扫描项目，而是直接查询已经建好的代码知识图谱。
