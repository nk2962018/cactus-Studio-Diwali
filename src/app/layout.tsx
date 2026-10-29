import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StoreProvider } from "@/components/store-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Cactus Studios | Thoughtful Handmade Diwali Gifts", template: "%s | Cactus Studios" },
  description: "Gift happiness that grows. Discover handmade plants, candles, tealights, original idols, DIY kits and curated Diwali gifts from Cactus Studios.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><StoreProvider><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer /></StoreProvider></body></html>;
}