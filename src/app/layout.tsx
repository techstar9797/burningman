import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Burning Man Global Marketplace - AI-Powered Voice Commerce',
  description: 'AI-powered voice marketplace that overcomes language barriers and enables informed decisions in rapidly changing geopolitics and tariffs. Built for radical inclusion and global connection.',
  keywords: 'global marketplace, voice AI, trade intelligence, multilingual, geopolitics, tariffs, VAPI, international commerce, language barriers, burning man',
  authors: [{ name: 'Burning Man Global Marketplace Team' }],
  openGraph: {
    title: 'Burning Man Global Marketplace - AI-Powered Voice Commerce',
    description: 'AI-powered voice marketplace breaking language barriers in international trade with geopolitical intelligence.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}