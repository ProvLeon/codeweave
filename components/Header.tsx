"use client"
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import ThemeToggle  from './ThemeToggle'
import Image from 'next/image'

export default function Header() {
  const { data: session } = useSession()
  //const theme = getTheme()

  return (
    <header className="bg-background border-b border-light-border dark:border-dark-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/assets/CodeWeave_logo_light_bg.png"
            width={100}
            height={200}
            alt="CodeWeave Logo"
            className="h-8 dark:hidden"
          />
          <Image
            src="/assets/CodeWeave_logo_Bright_dark_bg.png"
            width={100}
            height={200}
            alt="CodeWeave Logo"
            className="h-8 hidden dark:block"
          />
        </Link>
        <nav className="flex items-center space-x-4">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant={`${session ? 'default' : 'outline'}`}>Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
