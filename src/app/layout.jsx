import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BookVerse | Discover & Read Original Ebooks",
  description: "Join BookVerse to discover, read, and share original ebooks.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col ">
        <ThemeProvider attribute="data-theme" defaultTheme="light">
          <main className="flex-grow">{children}</main>

          <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
