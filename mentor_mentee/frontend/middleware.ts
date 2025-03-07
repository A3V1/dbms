import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  unique_user_no: number;
  role: 'admin' | 'mentor' | 'mentee';
  exp: number;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/signup', '/', '/api', '/favicon.ico'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // If no token, redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  
  try {
    // For mock tokens, extract role from the path
    if (token.startsWith('mock_jwt_token_')) {
      // For development/testing - mock token verification
      // Check role in URL
      let allowAccess = true;
      const mockRole = localStorage.getItem('last_login_role') || 'mentee';
      
      // Role-specific paths
      if (pathname.startsWith('/dashboard/admin') && mockRole !== 'admin') {
        allowAccess = false;
      }
      
      if (pathname.startsWith('/dashboard/mentor') && mockRole !== 'mentor') {
        allowAccess = false;
      }
      
      if (pathname.startsWith('/dashboard/mentee') && mockRole !== 'mentee') {
        allowAccess = false;
      }
      
      // If access not allowed, redirect to unauthorized
      if (!allowAccess) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      // Access allowed
      return NextResponse.next();
    }
    
    // Real token handling
    // Decode and verify token
    const decodedToken = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      throw new Error('Token expired');
    }
    
    // Check role-based access
    const userRole = decodedToken.role;
    
    // Role-specific paths
    if (pathname.startsWith('/dashboard/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    if (pathname.startsWith('/dashboard/mentor') && userRole !== 'mentor') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    if (pathname.startsWith('/dashboard/mentee') && userRole !== 'mentee') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // Access allowed
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    
    // Clear the invalid token cookie
    response.cookies.delete('token');
    
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 