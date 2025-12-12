import type { Metadata } from 'next'
//import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// 👇 CAMBIO 1: Importar la fuente Inter
import { Inter } from 'next/font/google' 


// 👇 CAMBIO 2: Inicializar la fuente Inter
const inter = Inter({ subsets: ['latin'] })

//const _geist = Geist({ subsets: ["latin"] });
//const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Intelligence Video',
  description: 'From Concept to Professional Video in Minutes',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
