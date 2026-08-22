import { Inter, Caveat, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900']
})

const cursive = Caveat({
  subsets: ['latin'],
  variable: '--font-cursive',
  display: 'swap',
  weight: ['400', '600', '700']
})

const serif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '600', '700', '800']
})

export const metadata: Metadata = {
  title: 'FlowForge — Autonomous Supply Chain Intelligence',
  description: 'The intelligence layer for global trade. FlowForge turns complex supply chains into one calm, connected view.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F8FAFC',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light bg-background ${inter.variable} ${cursive.variable} ${serif.variable}`}>
      <body className={`${inter.className} font-sans antialiased selection:bg-[#D94E28] selection:text-white`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
