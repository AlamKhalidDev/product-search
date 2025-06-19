import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProductSearch - Find Your Perfect Product",
  description:
    "Search through thousands of products from top brands. Use our advanced filters to find exactly what you need.",
  keywords: "products, search, shopping, brands, filters",
  openGraph: {
    title: "ProductSearch - Find Your Perfect Product",
    description: "Search through thousands of products from top brands.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-gray-50 ${inter.className}`}>
        <Toaster position="top-right" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
