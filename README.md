# 本地教程文档

这个目录是本地 VuePress 教程站点。源教程 Markdown 放在工作区根目录或其他明确路径，站点通过 `tutorials.config.mjs` 统一登记，再由 `scripts/generate-docs.mjs` 生成 VuePress 页面。

## 常用命令

```bash
npm install
npm run docs:generate
npm run docs:dev
npm run check
```

## 新增教程

1. 把源 Markdown 放到工作区中，例如 `my-tool-tutorial.md`。
2. 在 `tutorials.config.mjs` 的 `tutorialCollections` 中新增条目：

```js
{
  id: 'my-tool',
  title: 'My Tool',
  description: '一句话说明这个教程解决什么问题。',
  source: '../my-tool-tutorial.md',
  navText: 'My Tool',
  order: 40,
}
```

3. 运行：

```bash
npm run docs:generate
npm run check
```

4. 打开开发服务器预览：

```bash
npm run docs:dev
```

## 文档生成规则

- 每份源 Markdown 的一级标题作为集合标题参考。
- 每个二级标题会生成一个独立页面。
- 集合首页会保留源文档开头说明，并自动生成章节导航。
- 导航和侧边栏都从 `tutorials.config.mjs` 生成。
