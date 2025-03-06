import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

const protectedRoutes = {
  mentor: ['/mentor'],
  mentee: ['/mentee'],
  admin: ['/admin']
};

const publicRoutes = ['/login', '/signup', '/', '/unauthorized'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware - Path:', pathname);

  // Allow public paths
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    console.log('Middleware - Token exists:', !!token);

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Decode token
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (decoded.exp && decoded.exp < currentTime) {
        console.log('Token expired');
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
      }

      // Token is valid, allow request
      return NextResponse.next();
    } catch (error) {
      console.error('Error decoding token:', error);
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 