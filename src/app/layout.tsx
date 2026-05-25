import type { Metadata } from "next"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: { default: "AyeAyeSkipper — We Run on Skipper", template: "%s | AyeAyeSkipper" },
  description: "The marina OS powered by the Skipper Engine™. Powered by Slip Logic™. Zero transaction fees, zero platform rake. Your marina. Your customers. Your money.",
  openGraph: {
    siteName: "AyeAyeSkipper",
    title: "AyeAyeSkipper — We Run on Skipper",
    description: "The marina OS powered by the Skipper Engine™. Slip Logic™, Hot Slip™, Skipper Gangway™. No Dockwa fees. No platform rake. You keep 100%.",
    type: "website",
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin:0, padding:0, background:'#070f1a', color:'#fff', fontFamily:"system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" }}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
