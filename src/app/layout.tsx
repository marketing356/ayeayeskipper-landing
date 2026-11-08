import type { Metadata } from "next"
import Nav from "@/components/Nav"
import WeatherBar from "@/components/WeatherBar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: { default: "Skipper — Marina and yacht club software", template: "%s | Skipper" },
  description: "We run on Skipper. Management software for marinas and yacht clubs: slips, moorings, yard, contracts and billing, on autopilot. No setup fees.",
  openGraph: {
    siteName: "Skipper",
    title: "Skipper — We run on Skipper",
    description: "Management software for marinas and yacht clubs. Your marina or club, on autopilot.",
    type: "website",
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin:0, padding:0, background:'#070f1a', color:'#fff', fontFamily:"system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" }}>
        <WeatherBar />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
