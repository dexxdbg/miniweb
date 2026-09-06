import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DevAgentation from "./dev-agentation";
import Tracker from "./tracker-component";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "mini/web — @dexxdbg",
  description: "The personal index of @dexxdbg — work, sound and places elsewhere on the web.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <DevAgentation />
        <Tracker />
      </body>
    </html>
  );
}
