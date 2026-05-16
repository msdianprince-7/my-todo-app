import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

const { auth } = NextAuth(authConfig)

// Next.js 16 renamed 'middleware' to 'proxy'.
// NextAuth's `auth` used as middleware checks the `authorized` callback.
// We wrap it as a named `proxy` export.
const authMiddleware = auth(() => {
  // Return nothing — just let the request through after NextAuth's 
  // authorized callback has run (which handles redirects).
})

export function proxy(request: any) {
  return authMiddleware(request, {} as any)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
