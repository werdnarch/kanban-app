import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const JakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "This is my personal next-starter",
  icons: {
    icon: "/assets/logo-mobile.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased ${InterFont.variable} ${JakartaSans.variable}`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
