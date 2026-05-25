---
title: "9. TypeScript API 示例"
description: "CodeGraph：9. TypeScript API 示例"
---
<!-- This file is generated from the workspace tutorial source. Edit the source Markdown or generator. -->
## 9. TypeScript API 示例

CodeGraph 也可以作为 TypeScript 库使用：

```typescript
import CodeGraph from '@colbymchenry/codegraph';

const cg = await CodeGraph.init('/path/to/project');

await cg.indexAll({
  onProgress: (p) => console.log(`${p.phase}: ${p.current}/${p.total}`),
});

const results = cg.searchNodes('UserService');
const callers = cg.getCallers(results[0].node.id);

const context = await cg.buildContext('fix login bug', {
  maxNodes: 20,
  includeCode: true,
  format: 'markdown',
});

const impact = cg.getImpactRadius(results[0].node.id, 2);

cg.watch();
cg.unwatch();
cg.close();
```

常用方法：

| 方法 | 功能说明 |
|---|---|
| `CodeGraph.init(path)` | 创建或初始化项目索引 |
| `CodeGraph.open(path)` | 打开已有项目索引 |
| `indexAll(opts)` | 完整索引，可传进度回调 |
| `sync()` | 增量同步 |
| `searchNodes(query)` | 符号全文搜索 |
| `getCallers(id)` | 查调用方 |
| `getCallees(id)` | 查被调用方 |
| `getImpactRadius(id, depth)` | 查变更影响范围 |
| `buildContext(task, opts)` | 构建 AI 上下文 |
| `watch()` / `unwatch()` | 启停文件监听 |
| `close()` | 关闭数据库连接 |
