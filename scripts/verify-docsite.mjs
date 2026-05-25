import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { tutorialCollections } from '../tutorials.config.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const requiredFiles = [
  'package.json',
  'tutorials.config.mjs',
  'docs/README.md',
  'docs/tutorials/README.md',
  'docs/.vuepress/config.ts',
  'docs/.vuepress/styles/index.scss',
]

const failures = []

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(rootDir, relativePath)
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing required file: ${relativePath}`)
  }
}

for (const collection of tutorialCollections) {
  const outputDir = path.join(rootDir, 'docs', 'tutorials', collection.id)
  const indexPath = path.join(outputDir, 'README.md')

  if (!fs.existsSync(indexPath)) {
    failures.push(`Missing tutorial index: docs/tutorials/${collection.id}/README.md`)
    continue
  }

  const pages = fs
    .readdirSync(outputDir)
    .filter((fileName) => fileName.endsWith('.md'))
    .sort()

  if (pages.length < 2) {
    failures.push(`Tutorial ${collection.id} should have an index and at least one generated page`)
  }

  for (const page of pages) {
    const pagePath = path.join(outputDir, page)
    const content = fs.readFileSync(pagePath, 'utf8')
    if (!content.startsWith('---\n')) {
      failures.push(`Missing frontmatter: docs/tutorials/${collection.id}/${page}`)
    }
    if (content.includes('\t')) {
      failures.push(`Tab character found: docs/tutorials/${collection.id}/${page}`)
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Verified ${tutorialCollections.length} tutorial collections.`)
