import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import Header from '@/components/Header'
//import Footer from '@/components/Footer'
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CodeWeave',
  description: 'Real-time collaborative code editing platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              {/*<Footer />*/}
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
