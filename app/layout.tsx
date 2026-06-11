import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vu Ba Thang - Fullstack Engineer",
  description:
    "Fullstack Engineer with 2 years building complex management systems and real-time applications. Moving toward Solution Architecture.",
  openGraph: {
    title: "Vu Ba Thang - Fullstack Engineer",
    description:
      "I build systems - from schema design to real-time UI. Moving toward Solution Architecture.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-zinc-950 text-zinc-50 font-sans antialiased"
        suppressHydrationWarning
      >
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
