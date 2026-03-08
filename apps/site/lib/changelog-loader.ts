import fs from "node:fs/promises"
import path from "node:path"

interface FrontmatterData {
  title?: string
  description?: string
  date?: string
  tags?: string[]
  version?: string
}

interface ParsedMDX {
  frontmatter: FrontmatterData
  body: string
}

export interface LoadedChangelogPage {
  id: string
  data: {
    title: string
    description: string
    date: string
    version?: string
    tags?: string[]
    body: string
  }
}

const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/
const ARRAY_VALUE_REGEX = /^\[(.*)\]$/
const MDX_EXTENSION_REGEX = /\.mdx$/

function parseFrontmatter(frontmatter: string): FrontmatterData {
  const lines = frontmatter.split("\n")
  const data: FrontmatterData = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    const separatorIndex = trimmed.indexOf(":")
    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()

    if (key === "tags") {
      const match = rawValue.match(ARRAY_VALUE_REGEX)
      if (match) {
        const items = match[1]
          .split(",")
          .map((item) => item.trim().replace(/^"|"$/g, ""))
          .filter(Boolean)
        data.tags = items
      }
      continue
    }

    const value = rawValue.replace(/^"|"$/g, "")

    if (key === "title") {
      data.title = value
    }
    if (key === "description") {
      data.description = value
    }
    if (key === "date") {
      data.date = value
    }
    if (key === "version") {
      data.version = value
    }
  }

  return data
}

function parseMDX(content: string): ParsedMDX {
  const match = content.match(FRONTMATTER_REGEX)
  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const [, frontmatterRaw, body] = match
  return {
    frontmatter: parseFrontmatter(frontmatterRaw),
    body,
  }
}

export async function loadChangelogPages(): Promise<LoadedChangelogPage[]> {
  const contentDir = path.join(process.cwd(), "changelog", "content")
  const files = await fs.readdir(contentDir)
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"))

  const entries = await Promise.all(
    mdxFiles.map(async (file) => {
      const filePath = path.join(contentDir, file)
      const content = await fs.readFile(filePath, "utf8")
      const parsed = parseMDX(content)

      return {
        id: file.replace(MDX_EXTENSION_REGEX, ""),
        data: {
          title: parsed.frontmatter.title ?? "",
          description: parsed.frontmatter.description ?? "",
          date: parsed.frontmatter.date ?? "",
          version: parsed.frontmatter.version,
          tags: parsed.frontmatter.tags,
          body: parsed.body,
        },
      }
    })
  )

  return entries
}
