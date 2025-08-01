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
  const { user, isMounted } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isMounted) return;   // Wait for client-side mounting

    const token = Cookies.get('token')

    if (requireAuth && !token) {
      router.push('/login')
      return
    }

    if (!requireAuth && token && user) {
      router.push('/dashboard')
      return
    }

    setIsLoading(false)
  }, [user, router, requireAuth, isMounted])

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
