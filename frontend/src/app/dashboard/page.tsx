'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '@/lib/api'
import RouteGuard from '@/components/RouteGuard'

function Dashboard() {
  const { user, logout } = useAuth()
  const [protectedMessage, setProtectedMessage] = useState<string>('')

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const message = await authApi.getProtectedMessage()
        setProtectedMessage(message)
      } catch (error) {
        console.error('Failed to fetch protected message:', error)
      }
    }

    if (user) {
      fetchProtectedData()
    }
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Hello {user.firstName}! 👋
          </h1>
          <p className="mt-2 text-xl text-gray-600">
            Welcome to your dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Role:</strong> {user.role}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Protected Content</CardTitle>
              <CardDescription>Data from secured backend endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-green-600 font-medium">
                {protectedMessage || 'Loading protected content...'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button onClick={logout} variant="outline" size="lg">
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <RouteGuard requireAuth={true}>
      <Dashboard />
    </RouteGuard>
  )
}
