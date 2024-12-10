import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jesús Sebastián Cruz",
  description: "Full Stack Development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${robotoMono.className} bg-zinc-950`}
    >
      <body>{children}</body>
    </html>
  );
}
