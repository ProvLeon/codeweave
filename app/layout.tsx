import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import HeaderWrapper from '@/components/HeaderWrapper'
import { SessionProvider } from 'next-auth/react'
import { redirect } from 'next/navigation'
import getPathName from '@/lib/getPathname'
//import { getSessionServer } from '@/lib/Session'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CodeWeave',
  description: 'Real-time collaborative code editing platform',
  icons: {
    icon: '/favicon.svg', // Specify the path to your favicon
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  //const {session, status} = getSession()
  //const pathname = getPathName()

  // Avoid redirecting if the user is on the sign-up or sign-in page
  //if (!session && pathname !== '/sign-up' && pathname !== '/sign-in' && pathname !== '/') {
  //  return redirect('/sign-up')
  //}

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen dark:bg-dark-background bg-light">
              <HeaderWrapper />
              <main className="flex-grow">{children}</main>
              {/* <Footer /> */}
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
