import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import AppProviders from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sales Shop",
  description: "Sales Shop — fashion, jewellery & electronics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <ChatWidget />
        </AppProviders>
      </body>
    </html>
  );
}
