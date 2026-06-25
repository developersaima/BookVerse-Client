import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "BookVerse | Discover & Read Original Ebooks",
    template: "%s | BookVerse",
  },
  description: "Join BookVerse to discover, read, and share original ebooks from talented writers worldwide. Created by Saima Akter.",
  keywords: ["ebooks", "original literature", "reading platform", "writers", "digital library"],
  authors: [{ name: "Saima Akter" }],
  creator: "Saima Akter",
  openGraph: {
    title: "BookVerse | Discover & Read Original Ebooks",
    description: "Connect with writers and readers on the ultimate ebook sharing platform by Saima Akter.",
    url: "https://bookverse.vercel.app",
    siteName: "BookVerse",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer></Footer>
        <Toaster
  position="top-center"
  reverseOrder={false}
/>
      </body>
    </html>
  );
}