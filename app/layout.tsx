import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { KlaroCookieConsent } from "@/components/KlaroCookieConsent";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { TrackingProvider } from "@/components/analytics/TrackingProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Casa Del Soul – Link in Bio | Tattoo Studio Essen",
  description:
    "Casa Del Soul Tattoo Studio in Essen – Professionelle Tattoos von 5 talentierten Artists. Fineline, Watercolor, Traditional & mehr. Jetzt online Termin buchen!",
  keywords: [
    "Casa Del Soul",
    "Tattoo Studio Essen",
    "Tattoo Essen",
    "Tätowierer Essen",
    "Fineline Tattoo",
    "Watercolor Tattoo",
    "Traditional Tattoo",
    "Holsterhauser Str",
    "Tattoo Beratung",
  ],
  openGraph: {
    title: "Casa Del Soul – Tattoo Studio Essen",
    description:
      "Professionelles Tattoo Studio in Essen mit 5 talentierten Artists. Von Fineline bis Traditional. Jetzt online buchen!",
    type: "website",
    locale: "de_DE",
    siteName: "Casa Del Soul Tattoo Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Del Soul – Tattoo Studio Essen",
    description:
      "Professionelles Tattoo Studio in Essen. Fineline, Watercolor, Traditional & mehr. Online buchen!",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <GoogleAnalytics />
        <NextUIProvider>
          <Suspense fallback={null}>
            <TrackingProvider>
              {/* Klaro Cookie Consent - Open Source & Kostenlos */}
              <KlaroCookieConsent />
              {children}
            </TrackingProvider>
          </Suspense>
        </NextUIProvider>
      </body>
    </html>
  );
}
