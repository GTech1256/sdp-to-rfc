import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SDP → RFC | Автоматизация RFC-процессов",
  description: "Превращайте SDP-задачи в готовые RFC-документы автоматически. Экономьте время, избегайте ошибок, ускоряйте разработку.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
