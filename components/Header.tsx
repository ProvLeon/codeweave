"use client"
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import ThemeToggle  from './ThemeToggle'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className={`z-50 bg-light-background bg-opacity-70 dark:bg-opacity-70 dark:bg-dark-background border-b border-light-border dark:border-dark-border transition-all duration-30 ${isSticky ? 'sticky top-2 backdrop-blur-md w-4/5 mx-auto rounded-xl px-2' : ''}`}>
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
          {session &&
          <Link href="/api/profile">
                {/*<a>*/}
                  {session.user &&
                  <div className='flex gap-2'>
                    <Image src={session.user.imageUrl || '/assets/icons8-user-96.png'} alt="Profile Image" width={40} height={40} className='text-light-background'/>
                    <span>{session.user.userName}</span>
                  </div>
                  }
              </Link>
          }
        </nav>
      </div>
    </header>
  )
}
