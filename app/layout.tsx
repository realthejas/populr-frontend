import type { Metadata } from "next";
import { Noto_Serif, Inter } from "next/font/google";
import "./globals.css";
import { CustomCursorProvider } from "@/components/providers/CustomCursorProvider";
import { cn } from "@/lib/utils";

const notoSerif = Noto_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL("https://bepopulr.com"),
  title: "Populr — India's Fashion Marketplace",
  description:
    "Curated marketplace you won't find anywhere else. Join the waitlist.",
  openGraph: {
    title: "Populr — Coming Soon",
    description: "India's curated marketplace you won't find anywhere else. Join the waitlist.",
    url: "https://bepopulr.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", notoSerif.variable, "font-sans", inter.variable)}>
      <body className="min-h-full flex flex-col bg-[var(--color-ivory)] text-[var(--color-tertiary)]">
        <CustomCursorProvider>{children}</CustomCursorProvider>
      </body>
    </html>
  );
}
