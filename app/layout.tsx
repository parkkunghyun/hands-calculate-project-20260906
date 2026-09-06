import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scribble.",
  description: "손으로 쓰면, 바로 이해합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background font-body-md text-on-surface">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Nanum+Pen+Script:400"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <div className="flex flex-col flex-1 lab-grid-bg min-h-full">
          <Header />
          <main className="w-full pt-[72px] flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
