import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { tutorialCollections } from '../tutorials.config.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, '..')
const workspaceRoot = path.resolve(siteRoot, '..')
const docsRoot = path.join(siteRoot, 'docs')

const generatedNotice = '<!-- This file is generated from the workspace tutorial source. Edit the source Markdown or generator. -->'

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[`'"“”‘’()（）[\]{}:：,，.。/\\]/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'section'
}

function parseSections(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const title = lines.find((line) => line.startsWith('# '))?.replace(/^#\s+/, '').trim() || '教程'
  const sections = []
  const intro = []
  let current = null
  let inFence = false

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence
    }

    if (!inFence && line.startsWith('## ')) {
      if (current) {
        sections.push(current)
      }
      current = {
        title: line.replace(/^##\s+/, '').trim(),
        lines: [line],
      }
      continue
    }

    if (current) {
      current.lines.push(line)
    } else {
      intro.push(line)
    }
  }

  if (current) {
    sections.push(current)
  }

  return {
    title,
    intro,
    sections: sections.filter((section) => section.title !== '目录'),
  }
}

function normalizeMarkdown(markdown) {
  return escapeVueTemplateTokens(markdown)
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^提示\n\n/gm, '> 提示\n>\n')
    .trim() + '\n'
}

function escapeVueTemplateTokens(markdown) {
  let inFence = false

  return markdown
    .split('\n')
    .map((line) => {
      if (/^```/.test(line.trim())) {
        inFence = !inFence
        return line
      }

      if (inFence) {
        return line
      }

      return line
        .replace(/<\/([A-Za-z][^>\n]*?)>/g, '&lt;/$1&gt;')
        .replace(/<([A-Za-z][^>\n]*?)>/g, '&lt;$1&gt;')
    })
    .join('\n')
}

function frontmatter({ title, description }) {
  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    description ? `description: ${JSON.stringify(description)}` : '',
    '---',
    '',
  ].filter(Boolean).join('\n')
}

function pageFileName(index, title) {
  return `${String(index + 1).padStart(2, '0')}-${slugify(title)}.md`
}

function relativeSourceLabel(source) {
  return source.replace(/^\.\.\//, '')
}

function writeCollection(collection) {
  const sourcePath = path.resolve(siteRoot, collection.source)
  const outputDir = path.join(docsRoot, 'tutorials', collection.id)
  const source = fs.readFileSync(sourcePath, 'utf8')
  const { title, intro, sections } = parseSections(source)

  fs.rmSync(outputDir, { recursive: true, force: true })
  ensureDir(outputDir)

  const generatedPages = sections.map((section, index) => {
    const fileName = pageFileName(index, section.title)
    const pagePath = path.join(outputDir, fileName)
    const body = normalizeMarkdown(section.lines.join('\n'))
    fs.writeFileSync(
      pagePath,
      [
        frontmatter({ title: section.title, description: `${collection.title}：${section.title}` }),
        generatedNotice,
        body,
      ].join('\n'),
    )
    return { text: section.title.replace(/^\d+\.\s*/, ''), link: fileName.replace(/\.md$/, '.html') }
  })

  const introBody = normalizeMarkdown(
    intro
      .filter((line) => !line.startsWith('# '))
      .join('\n'),
  )

  const indexBody = [
    frontmatter({ title: collection.title, description: collection.description }),
    generatedNotice,
    `# ${collection.title}`,
    '',
    collection.description,
    '',
    `> 来源文件：\`${relativeSourceLabel(collection.source)}\``,
    '',
    introBody,
    '',
    '## 章节导航',
    '',
    ...generatedPages.map((page) => `- [${page.text}](${page.link})`),
    '',
  ].join('\n')

  fs.writeFileSync(path.join(outputDir, 'README.md'), normalizeMarkdown(indexBody))

  return {
    ...collection,
    title,
    pages: generatedPages,
  }
}

function writeTutorialIndex(collections) {
  const outputDir = path.join(docsRoot, 'tutorials')
  ensureDir(outputDir)

  const body = [
    frontmatter({ title: '教程总览', description: '本地教程文档集合。' }),
    '# 教程总览',
    '',
    '这里集中维护本地 AI 编码工作流与工具教程。新增教程时，先把源 Markdown 放在工作区，再把条目加入 `tutorials.config.mjs`。',
    '',
    ...collections.flatMap((collection) => [
      `## ${collection.title}`,
      '',
      collection.description,
      '',
      `- [进入教程](./${collection.id}/)`,
      '',
    ]),
  ].join('\n')

  fs.writeFileSync(path.join(outputDir, 'README.md'), normalizeMarkdown(body))
}

function writeHomePage(collections) {
  const body = [
    '---',
    'home: true',
    'title: 本地教程文档',
    'heroText: 本地教程文档',
    'tagline: AI 编码工作流、工具链与实践指南',
    'actions:',
    '  - text: 浏览教程',
    '    link: /tutorials/',
    '    type: primary',
    'features:',
    ...collections.flatMap((collection) => [
      `  - title: ${collection.title}`,
      `    details: ${collection.description}`,
    ]),
    '---',
    '',
  ].join('\n')

  fs.writeFileSync(path.join(docsRoot, 'README.md'), body)
}

ensureDir(docsRoot)
const generatedCollections = tutorialCollections.map(writeCollection)
writeTutorialIndex(generatedCollections)
writeHomePage(generatedCollections)

console.log(`Generated ${generatedCollections.length} tutorial collections from ${workspaceRoot}.`)
