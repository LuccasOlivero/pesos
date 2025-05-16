import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FinanceTracker - Gestiona tus finanzas",
  description: "Aplicación para gestionar tus ingresos y gastos diarios",
  manifest: "/manifest.json",
  themeColor: "#f8e2e2",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FinanceTracker",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
