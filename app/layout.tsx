import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import localFont from "next/font/local"

const inter = Inter({ subsets: ["latin"] })

// فونت فارسی BNazanin
const bnazanin = localFont({
  src: [
    {
      path: "../public/fonts/BNazanin.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/BNazaninBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bnazanin",
})

export const metadata: Metadata = {
  title: "سیستم شناسایی سیگنال‌های رادیویی ماینرهای رمزارز",
  description: "سیستم شناسایی و تحلیل سیگنال‌های رادیویی ماینرهای رمزارز",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${inter.className} ${bnazanin.variable}`}>{children}</body>
    </html>
  )
}



import './globals.css'