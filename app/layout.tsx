import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/Header'
// import Footer from '@/components/Footer'
import { SessionProvider } from 'next-auth/react'
import { auth } from './api/auth/[...nextauth]/route'
//import Head from 'next/head'
import { NextRequest, NextResponse } from 'next/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CodeWeave',
  description: 'Real-time collaborative code editing platform',
  icons: {
    icon: '/favicon.svg', // Specify the path to your favicon
  },
}

export async function middleware(req: NextRequest) {
  //const secret = process.env.NEXTAUTH_SECRET || 'default_secret'
  //const token = await getToken({ req, secret })
  const { pathname } = req.nextUrl
  const session = await auth()

  //console.log('Token:', token)
  console.log('Pathname:', pathname)

  // If the user is not authenticated and is not on the sign-up page, redirect to sign-up
  if (!session?.user && pathname !== '/sign-up') {
    console.log('Redirecting to /sign-up')
    return NextResponse.redirect(new URL('/sign-up', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
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
            <div className="flex flex-col min-h-screen dark:bg-dark-background bg-light">
              <Header />
              <main className="flex-grow">{children}</main>
              {/* <Footer /> */}
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
