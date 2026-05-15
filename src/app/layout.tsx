import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DevAgentation from "./dev-agentation";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "// nodes",
  description: "links · socials · contact",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <DevAgentation />
      </body>
    </html>
  );
}
