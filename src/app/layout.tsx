import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://despithold.nl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "De Spithold — Biologische Melkveehouderij",
  description:
    "Biologische melkveehouderij De Spithold in Almen. Familie Smallegoor combineert duurzame landbouw met rijke biodiversiteit langs de Berkel.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "De Spithold — Biologische Melkveehouderij",
    description:
      "Biologische melkveehouderij De Spithold in Almen. Familie Smallegoor combineert duurzame landbouw met rijke biodiversiteit langs de Berkel.",
    url: siteUrl,
    siteName: "De Spithold",
    locale: "nl_NL",
    type: "website",
    images: [
      {
        url: "/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "De Spithold — Biologische melkveehouderij in Almen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "De Spithold — Biologische Melkveehouderij",
    description:
      "Biologische melkveehouderij De Spithold in Almen. Familie Smallegoor combineert duurzame landbouw met rijke biodiversiteit langs de Berkel.",
    images: ["/hero.jpeg"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Farm",
              name: "De Spithold",
              description:
                "Biologische melkveehouderij De Spithold in Almen. Familie Smallegoor combineert duurzame landbouw met rijke biodiversiteit langs de Berkel.",
              url: "https://despithold.nl",
              image: "https://despithold.nl/hero.jpeg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Almen",
                addressRegion: "Gelderland",
                addressCountry: "NL",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 52.1397,
                longitude: 6.3148,
              },
              founder: {
                "@type": "Person",
                familyName: "Smallegoor",
              },
              keywords:
                "biologische melkveehouderij, duurzame landbouw, biodiversiteit, Berkel, Almen",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
