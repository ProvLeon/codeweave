import { NextRequest, NextResponse } from 'next/server';
import { getSessionServer } from '@/lib/Session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getSessionServer();

  // Allow access to public routes
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up') || pathname === '/') {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to the login page
  if (!session?.user) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
