import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsWrapper from "@/components/AnalyticsWrapper";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import AdSenseWrapper from "@/components/AdSenseWrapper";
import GoogleConsentWrapper from "@/components/GoogleConsentWrapper";
import { DesktopSidebar } from "@/components/AdPlacement";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planneo - Générateur de Planning pour Boutiques | Gestion Horaire Équipe",
  description: "Créez et gérez facilement les plannings horaires de votre équipe en boutique. Logiciel gratuit de gestion du personnel pour commerces. Planning hebdomadaire, calcul automatique des heures, export PDF professionnel.",
  keywords: [
    "générateur de planning",
    "planning horaire boutique",
    "gestion planning magasin",
    "logiciel planning employé",
    "planning commercial",
    "gestion horaire équipe",
    "planning hebdomadaire commerce",
    "outil gestion personnel boutique",
    "logiciel gestion personnel magasin",
    "planning horaire équipe",
    "gestion planning personnel",
    "logiciel planning commercial",
    "planning horaire magasin",
    "gestion équipe commerce",
    "logiciel gestion horaire"
  ],
  authors: [{ name: "Antoine Terrade", url: "https://antoineterrade.com" }],
  creator: "Antoine Terrade",
  publisher: "Antoine Terrade",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://planneo.ch'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Planneo - Générateur de Planning pour Boutiques | Gestion Horaire Équipe",
    description: "Logiciel gratuit de gestion de planning pour boutiques et commerces. Créez vos plannings horaires en quelques clics, calculez automatiquement les heures travaillées, exportez en PDF professionnel.",
    url: "https://planneo.ch",
    siteName: "Planneo",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Planneo - Logiciel de gestion de planning pour boutiques",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planneo - Générateur de Planning pour Boutiques",
    description: "Logiciel gratuit de gestion de planning pour boutiques et commerces. Créez vos plannings horaires facilement.",
    images: ["/og-image.png"],
    creator: "@antoineterrade",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "votre-code-google-search-console",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Planneo" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />

        {/* SEO supplémentaires */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="application-name" content="Planneo" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="RKvGizoqUsd9r30m2lIF-DJu6FMJWTOaZKjjQuef6i0" />
        
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-5521069542439268" />
        
        {/* Google Funding Choices CMP - Système de consentement officiel */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5521069542439268"
          crossOrigin="anonymous"
        />


      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <DesktopSidebar />
        <GoogleConsentWrapper />
        {/* <CookieBanner /> */}
        <AnalyticsWrapper />
        <AdSenseWrapper />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
