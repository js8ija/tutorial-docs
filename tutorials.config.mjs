import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const tutorialCollections = [
  {
    id: 'ccg-workflow',
    title: 'CCG Workflow',
    description: 'Hook 驱动的多模型协作编码工作流教程。',
    source: '../ccg-workflow-tutorial.md',
    navText: 'CCG',
    order: 10,
  },
  {
    id: 'superpowers',
    title: 'Superpowers',
    description: 'Codex 与多智能体开发流程中的 skills 使用教程。',
    source: '../superpowers-tutorial.md',
    navText: 'Superpowers',
    order: 20,
  },
  {
    id: 'codegraph',
    title: 'CodeGraph',
    description: '本地代码知识图谱、CLI 与 MCP 工具使用教程。',
    source: '../codegraph-tutorial.md',
    navText: 'CodeGraph',
    order: 30,
  },
].sort((left, right) => left.order - right.order)

export function tutorialRoute(collection) {
  return `/tutorials/${collection.id}/`
}

function docsDir() {
  return path.join(__dirname, 'docs')
}

function readPageTitle(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const frontmatterTitle = content.match(/^---\n[\s\S]*?title:\s+"?([^"\n]+)"?[\s\S]*?\n---/)
  if (frontmatterTitle) {
    return frontmatterTitle[1]
  }
  return path.basename(filePath, '.md')
}

function collectionChildren(collection) {
  const dir = path.join(docsDir(), 'tutorials', collection.id)
  if (!fs.existsSync(dir)) {
    return [tutorialRoute(collection)]
  }

  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith('.md') && fileName !== 'README.md')
    .sort()
    .map((fileName) => ({
      text: readPageTitle(path.join(dir, fileName)).replace(/^\d+\.\s*/, ''),
      link: `${tutorialRoute(collection)}${fileName.replace(/\.md$/, '.html')}`,
    }))
}

export function createNavbar() {
  return [
    { text: '首页', link: '/' },
    { text: '教程总览', link: '/tutorials/' },
    {
      text: '教程',
      children: tutorialCollections.map((collection) => ({
        text: collection.navText,
        link: tutorialRoute(collection),
      })),
    },
  ]
}

export function createSidebar() {
  return {
    '/tutorials/': [
      {
        text: '教程总览',
        collapsible: false,
        children: [
          '/tutorials/',
          ...tutorialCollections.map((collection) => tutorialRoute(collection)),
        ],
      },
    ],
    ...Object.fromEntries(
      tutorialCollections.map((collection) => [
        tutorialRoute(collection),
        [
          {
            text: collection.title,
            collapsible: true,
            children: [
              tutorialRoute(collection),
              ...collectionChildren(collection),
            ],
          },
        ],
      ]),
    ),
  }
}
