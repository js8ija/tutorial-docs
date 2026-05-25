import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { createNavbar, createSidebar } from '../../tutorials.config.mjs'

export default defineUserConfig({
  lang: 'zh-CN',
  title: '本地教程文档',
  description: 'AI 编码工作流、工具链与实践指南',
  bundler: viteBundler(),
  theme: defaultTheme({
    logo: null,
    navbar: createNavbar(),
    sidebar: createSidebar(),
    sidebarDepth: 2,
    contributors: false,
    lastUpdated: false,
    colorMode: 'auto',
    colorModeSwitch: true,
  }),
  markdown: {
    html: false,
    headers: {
      level: [2, 3],
    },
  },
})
