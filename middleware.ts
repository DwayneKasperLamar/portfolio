import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, isValidSession } from '@/lib/auth';

// Guards the admin area AND the private reading area with the same owner login.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (!(await isValidSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value))) {
    const loginUrl = new URL('/admin/login', request.url);
    if (!pathname.startsWith('/admin')) loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Private pages must never be cached by a browser or CDN.
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/private/:path*', '/private'],
};
