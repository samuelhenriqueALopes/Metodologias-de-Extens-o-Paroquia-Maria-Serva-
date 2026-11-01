import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { getSite } from "@/lib/data";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    metadataBase: new URL(site.url),
    title: { default: site.nome, template: `%s | ${site.nome}` },
    description: `${site.nome}: horários de missa, avisos, eventos, pastorais e dízimo.`,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.nome,
      images: ["/images/VirgemMaria.png"],
    },
    icons: { icon: "/favicon.ico" },
  };
}

export const viewport: Viewport = {
  themeColor: "#1e3a55",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
