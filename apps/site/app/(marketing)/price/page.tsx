import Pricing from "@/components/pricing"
import { SiteHeader } from "@/components/site-header"

export default function PricePage() {
  return (
    <>
      <SiteHeader />
      <div className="pt-24">
        <Pricing />
      </div>
    </>
  )
}
