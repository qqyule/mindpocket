import FooterSection from "@/components/footer"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FooterSection />
    </>
  )
}
