'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Cookies from 'js-cookie'

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function RouteGuard({ children, requireAuth = false }: RouteGuardProps) {
  const { user, isLoading, isMounted } = useAuth()
  const router = useRouter()
  const [isRouteLoading, setIsRouteLoading] = useState(true)
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (!isMounted || isLoading || hasRedirected) return

    const token = Cookies.get('token')
    const isAuthenticated = !!(token && user)

    // Airtight security: Prevent access based on authentication status
    if (requireAuth && !isAuthenticated) {
      // User trying to access protected route without being authenticated
      setHasRedirected(true)
      router.replace('/login')
      return
    }

    if (!requireAuth && isAuthenticated) {
      // Logged in user trying to access public route (like login page)
      setHasRedirected(true)
      router.replace('/dashboard')
      return
    }

    // Route is accessible, stop loading
    setIsRouteLoading(false)
  }, [user, isLoading, isMounted, router, requireAuth, hasRedirected])

  // Show loading screen while checking authentication or redirecting
  if (!isMounted || isLoading || isRouteLoading || hasRedirected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
