//import { NextRequest, NextResponse } from 'next/server'
//import { getToken } from 'next-auth/jwt'
//import { auth } from './api/auth/[...nextauth]/route'

//export async function middleware(req: NextRequest) {
//  //const secret = process.env.NEXTAUTH_SECRET || 'default_secret'
//  //const token = await getToken({ req, secret })
//  const { pathname } = req.nextUrl
//  const session = await auth()

//  //console.log('Token:', token)
//  console.log('Pathname:', pathname)

//  // If the user is not authenticated and is not on the sign-up page, redirect to sign-up
//  if (!session?.user && pathname !== '/sign-up') {
//    console.log('Redirecting to /sign-up')
//    return NextResponse.redirect(new URL('/sign-up', req.url))
//  }

//  return NextResponse.next()
//}

//export const config = {
//  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
//}
