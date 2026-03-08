import Image from "next/image"
import { MDXRemote } from "next-mdx-remote/rsc"
import type React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface ChangelogPage {
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

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const mdxComponents = {
  img: ({ className, ...props }: React.ComponentProps<"img">) => {
    const src = typeof props.src === "string" ? props.src : ""
    if (src.includes("photo-1680016661694-1cd3faf31c3a")) {
      return (
        <Image
          alt={props.alt ?? ""}
          className={`h-auto w-full rounded-md border ${className ?? ""}`}
          height={1916}
          sizes="(max-width: 768px) 100vw, 800px"
          src={src}
          width={2874}
        />
      )
    }

    if (src.includes("photo-1677442136019-21780ecad995")) {
      return (
        <Image
          alt={props.alt ?? ""}
          className={`h-auto w-full rounded-md border ${className ?? ""}`}
          height={600}
          sizes="(max-width: 768px) 100vw, 800px"
          src={src}
          width={900}
        />
      )
    }

    return (
      <Image
        alt={props.alt ?? ""}
        className={`h-auto w-full rounded-md border ${className ?? ""}`}
        height={675}
        sizes="(max-width: 768px) 100vw, 800px"
        src={src}
        width={1200}
      />
    )
  },
  Video: ({ className, ...props }: React.ComponentProps<"video">) => (
    <video className={`rounded-md border ${className ?? ""}`} controls loop {...props} />
  ),
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}

export default function ChangelogView({ changelogPages }: { changelogPages: ChangelogPage[] }) {
  const sortedChangelogs = [...changelogPages].sort((a, b) => {
    const dateA = new Date(a.data.date).getTime()
    const dateB = new Date(b.data.date).getTime()
    return dateB - dateA
  })

  return (
    <div className="relative">
      {sortedChangelogs.map((changelog) => {
        const date = new Date(changelog.data.date)
        const formattedDate = formatDate(date)

        return (
          <div className="relative" key={changelog.id}>
            <div className="flex flex-col gap-y-6 md:flex-row">
              <div className="md:w-48 md:flex-shrink-0">
                <div className="pb-10 md:sticky md:top-8">
                  <time className="mb-3 block text-sm font-medium text-muted-foreground">
                    {formattedDate}
                  </time>

                  {changelog.data.version && (
                    <div className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-sm font-bold text-foreground">
                      {changelog.data.version}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative flex-1 pb-10 md:pl-8">
                <div className="absolute top-2 left-0 hidden h-full w-px bg-border md:block">
                  <div className="absolute z-10 size-3 -translate-x-1/2 rounded-full bg-primary" />
                </div>

                <div className="space-y-6">
                  <div className="relative z-10 flex flex-col gap-2">
                    <h2 className="text-balance text-2xl font-semibold tracking-tight">
                      {changelog.data.title}
                    </h2>

                    {changelog.data.tags && changelog.data.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {changelog.data.tags.map((tag) => (
                          <span
                            className="flex h-6 w-fit items-center justify-center rounded-full border bg-muted px-2 text-xs font-medium text-muted-foreground"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="max-w-none space-y-4 text-base leading-8 [&_a]:no-underline [&_code]:font-mono [&_li]:leading-8 [&_p]:text-balance [&_pre]:overflow-x-auto [&_pre]:rounded-3xl [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:bg-zinc-950 [&_pre]:p-6 [&_pre]:text-zinc-100 [&_pre_code]:text-[0.95em] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
                    <MDXRemote components={mdxComponents} source={changelog.data.body} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
