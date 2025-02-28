import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRoleFromToken } from '@/lib/jwt';

const protectedRoutes = {
  mentor: ['/mentor'],
  mentee: ['/mentee'],
  admin: ['/admin']
};

const publicRoutes = ['/login', '/signup', '/', '/unauthorized'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  
  console.log('Middleware - Path:', path);
  console.log('Middleware - Token exists:', !!token);

  // Handle root path
  if (path === '/') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const userRole = getRoleFromToken(token);
      return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Public routes
  if (publicRoutes.includes(path)) {
    // If user is authenticated and tries to access login/signup, redirect to their dashboard
    if (token && (path === '/login' || path === '/signup')) {
      try {
        const userRole = getRoleFromToken(token);
        return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
      } catch (error) {
        // If token is invalid, allow access to login/signup
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!token) {
    console.log('Middleware - Redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Role-based access control
    const userRole = getRoleFromToken(token);
    console.log('Extracted user role:', userRole);
    const allowedPaths = protectedRoutes[userRole] || [];
    console.log('Allowed paths for user role:', allowedPaths);
    
    if (!allowedPaths.some(p => path.startsWith(p))) {
      console.log('User does not have access to this path:', path);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 