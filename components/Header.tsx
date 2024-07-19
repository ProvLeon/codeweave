"use client"
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'
import ThemeToggle from './ThemeToggle'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Session } from 'next-auth' // Import the Session type from next-auth
import ProfileClient from '@/components/ProfileClient'

interface HeaderProps {
  session: Session | null
}

export default function Header({ session }: HeaderProps) {
  const pathname = usePathname()
  const [isSticky, setIsSticky] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileRef])

  return (
    <header className={`relative z-50 bg-light-background bg-opacity-70 dark:bg-opacity-70 dark:bg-dark-background border-b border-light-border dark:border-dark-border transition-all duration-30 ${isSticky && !isProfileOpen ? 'sticky top-2 backdrop-blur-md w-4/5 mx-auto rounded-xl px-2' : ''}`}>
      <div className="container mx-auto px-2 py-2 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/assets/CodeWeave_logo_light_bg.png"
            width={100}
            height={100}
            alt="CodeWeave Logo"
            className="dark:hidden"
            priority={true}
          />
          <Image
            src="/assets/CodeWeave_logo_Bright_dark_bg.png"
            width={100}
            height={100}
            alt="CodeWeave Logo"
            className="hidden dark:block"
          />
        </Link>
        <nav ref={profileRef} className="flex items-center space-x-4">
          {session ? (
            <>
              {pathname === "/dashboard" ? (
                ""
              ) : (
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              <Button onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
          {session && pathname !== "/" && (
            <div  className="">
              <div
                className="cursor-pointer rounded-full flex items-center gap-2 overflow-hidden"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="flex rounded-full overflow-hidden h-[32px] w-[32px]">
                  <Image
                    src={session.user.imageUrl || '/assets/icons8-user-96.png'}
                    alt="Profile Image"
                    width={40}
                    height={40}
                    className={`rounded-full ${!session.user.imageUrl ? 'dark:filter dark:invert dark:grayscale' : ''} object-cover`}
                  />
                </div>
                <span>{session.user.userName || "user" }</span>
              </div>
            </div>
          )}
          {isProfileOpen && session && (
            <div className="absolute top-12 right-2 mt-2 h-[200px] w-auto bg-white dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg shadow-xl z-50">
              <ProfileClient session={session} />
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
