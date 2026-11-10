import type { Metadata } from "next"
import Script from "next/script"
import Nav from "@/components/Nav"
import WeatherBar from "@/components/WeatherBar"
import Footer from "@/components/Footer"
import MobileBar from "@/components/MobileBar"

export const metadata: Metadata = {
  metadataBase: new URL('https://ayeayeskipper.com'),
  title: { default: "Skipper: Marina and yacht club management software", template: "%s | Skipper" },
  description: "Skipper is marina and yacht club management software. Slips, moorings, yard, contracts, billing, fuel dock and work orders on one live map, with an AI assistant you can switch off. From $99 a month, every module included.",
  alternates: { canonical: '/' },
  twitter: { card: 'summary_large_image', title: 'Skipper: Marina and yacht club management software', description: 'One live system for slips, moorings, yard, contracts and billing. From $99 a month, every module included.' },
  openGraph: {
    siteName: "Skipper",
    title: "Skipper: Marina and yacht club management software",
    description: "One live system for slips, moorings, yard, contracts and billing. From $99 a month, every module included.",
    url: 'https://ayeayeskipper.com',
    type: "website",
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin:0, padding:0, background:'#070f1a', color:'#fff', fontFamily:"system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" }}>
        <Script id="gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W94ZNDZC');" }} />
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W94ZNDZC" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} /></noscript>
        <WeatherBar />
        <Nav />
        {children}
        <Footer />
        <MobileBar />
      </body>
    </html>
  )
}
