import ChangelogView, { type ChangelogPage as ChangelogPageData } from "@/components/changelog-view"
import { SiteHeader } from "@/components/site-header"
import { loadChangelogPages } from "@/lib/changelog-loader"

export default async function ChangelogPage() {
  const changelogPages = await loadChangelogPages()

  return (
    <>
      <SiteHeader />
      <div className="relative min-h-screen bg-background pt-24">
        <div className="border-b border-border/50">
          <div className="relative mx-auto max-w-5xl">
            <div className="flex items-center justify-between p-3">
              <h1 className="text-3xl font-semibold tracking-tight">Changelog</h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 pt-10 lg:px-10">
          <ChangelogView changelogPages={changelogPages as ChangelogPageData[]} />
        </div>
      </div>
    </>
  )
}
