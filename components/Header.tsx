"use client"
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import ThemeToggle  from './ThemeToggle'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Code2Icon } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  //const theme = getTheme()
  const pathname = usePathname()

  return (
    <header className="bg-background border-b border-light-border dark:border-dark-border">
      <div className="container mx-auto px-2 py-2 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/assets/CodeWeave_logo_light_bg.png"
            width={65}
            height={50}
            alt="CodeWeave Logo"
            className=" dark:hidden w-auto h-auto"
            priority={true}
          />
          <Image
            src="/assets/CodeWeave_logo_Bright_dark_bg.png"
            width={100}
            height={100}
            alt="CodeWeave Logo"
            className=" hidden dark:block h-auto w-auto"
          />
        </Link>
        <nav className="flex items-center space-x-4">
          {session ? (
            <>
              {pathname === "/dashboard" ?
              //<Link href={`/dashboard/projects?userId=${session.user.id}`} >
              //  <Button variant="ghost">
              //  <span className='text-sm'>Playground</span>
              //    <Code2Icon/>
              //  </Button>
              //</Link>
              ""
              :
              <Link  href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>}
              <Button onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant={`${session ? 'default' : 'outline'}`}>Sign In</Button>
              </Link>
              <Link href="/sign-up">
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
