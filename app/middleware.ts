"use client"
import { NextRequest, NextResponse } from 'next/server'
import { useClientSession } from '@/lib/Session'

export  async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const {session, status} =  await useClientSession()  // Make sure this is correctly fetching the session

  // If the user is not authenticated and is not on the sign-up or sign-in page, redirect to sign-up
  if (status === 'unauthenticated' && pathname !== '/sign-up' && pathname !== '/sign-in') {
    return NextResponse.redirect(new URL('/sign-up', req.url))
  }

  return NextResponse.next()
}


export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
