import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Career Canvas — Your next chapter starts here',
  description: 'Build a truthful, focused, ATS-friendly resume with a guided editor and direct PDF download. No account required. Your draft stays in your browser, on this device.',
  icons: { icon: '/career-canvas-mark.svg', apple: '/career-canvas-mark.svg' },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F6F3EA',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
