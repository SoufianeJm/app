'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { authApi, fetchAllDepartments, Department } from '@/lib/api'
import RouteGuard from '@/components/RouteGuard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Users,
  Search,
  Bell,
  Settings,
  HelpCircle,
  MessageSquare,
  LayoutDashboard,
  Building2,
  Target
} from 'lucide-react'

// Hardcoded data
const kpiData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 75 },
  { name: 'Mar', value: 85 },
  { name: 'Apr', value: 80 },
  { name: 'May', value: 90 },
  { name: 'Jun', value: 95 },
  { name: 'Jul', value: 88 },
  { name: 'Aug', value: 92 },
  { name: 'Sep', value: 87 },
  { name: 'Oct', value: 91 },
  { name: 'Nov', value: 89 },
  { name: 'Dec', value: 94 }
]


function Dashboard() {
  const { user, logout } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [departments, setDepartments] = useState<Department[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadDepartments()
  }, [])

  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true)
      const response = await fetchAllDepartments()
      if (response.success) {
        setDepartments(response.data)
      }
    } catch (error) {
      console.error('Error loading departments:', error)
    } finally {
      setLoadingDepartments(false)
    }
  }

  const getDepartmentIcon = (department: Department) => {
    return <Building2 className="w-5 h-5 text-white" />
  }

  const getDepartmentBgColor = (iconColor: string) => {
    // Convert hex color to Tailwind background color classes
    const colorMap: { [key: string]: string } = {
      '#3B82F6': 'bg-blue-500',
      '#10B981': 'bg-green-500', 
      '#8B5CF6': 'bg-purple-500',
      '#F59E0B': 'bg-yellow-500',
      '#EF4444': 'bg-red-500',
      '#06B6D4': 'bg-cyan-500',
      '#EC4899': 'bg-pink-500',
      '#84CC16': 'bg-lime-500'
    }
    return colorMap[iconColor] || 'bg-blue-500'
  }

  const getBorderColor = (iconColor: string) => {
    const colorMap: { [key: string]: string } = {
      '#3B82F6': 'border-blue-100 bg-blue-50',
      '#10B981': 'border-green-100 bg-green-50',
      '#8B5CF6': 'border-purple-100 bg-purple-50',
      '#F59E0B': 'border-yellow-100 bg-yellow-50',
      '#EF4444': 'border-red-100 bg-red-50',
      '#06B6D4': 'border-cyan-100 bg-cyan-50',
      '#EC4899': 'border-pink-100 bg-pink-50',
      '#84CC16': 'border-lime-100 bg-lime-50'
    }
    return colorMap[iconColor] || 'border-blue-100 bg-blue-50'
  }

  const getBadgeColor = (iconColor: string) => {
    const colorMap: { [key: string]: string } = {
      '#3B82F6': 'bg-blue-100 text-blue-800',
      '#10B981': 'bg-green-100 text-green-800',
      '#8B5CF6': 'bg-purple-100 text-purple-800',
      '#F59E0B': 'bg-yellow-100 text-yellow-800',
      '#EF4444': 'bg-red-100 text-red-800',
      '#06B6D4': 'bg-cyan-100 text-cyan-800',
      '#EC4899': 'bg-pink-100 text-pink-800',
      '#84CC16': 'bg-lime-100 text-lime-800'
    }
    return colorMap[iconColor] || 'bg-blue-100 text-blue-800'
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 p-4">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
            <div className="w-4 h-4 bg-white rounded"></div>
          </div>
          <span className="text-xl font-bold">Ovalent</span>
        </div>
        
        <nav className="space-y-1">
          <a href="/dashboard" className="flex items-center px-3 py-2 bg-gray-100 text-gray-900 rounded-lg">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="/manager" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Target className="w-5 h-5 mr-3" />
            Manager
          </a>
          <a href="/employees" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Users className="w-5 h-5 mr-3" />
            Employees
          </a>
          <a href="/departments" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Building2 className="w-5 h-5 mr-3" />
            Departments
          </a>
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-1">
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <HelpCircle className="w-5 h-5 mr-3" />
            Help Center
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <MessageSquare className="w-5 h-5 mr-3" />
            Feedback
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900 mr-8">Overview</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/40?img=1" alt="Adam Taylor" />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">Adam Taylor</div>
              <div className="text-gray-500">ataylor@mail.com</div>
            </div>
            <Button className="bg-black hover:bg-gray-800 text-white">
              Export
            </Button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
<div className="grid grid-cols-3 gap-4 mb-8">
          {/* Left Section - KPIs and KPI Performance */}
          <div className="col-span-2 space-y-4">
            {/* KPI Cards in 3-column grid */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CardContent className="px-6 py-5">
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-3">Total Employee</p>
                    <p className="text-5xl font-bold text-gray-900 mb-3">218</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+6%</span>
                      <span className="text-sm text-gray-500">vs last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CardContent className="px-6 py-5">
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-3">New Employee</p>
                    <p className="text-5xl font-bold text-gray-900 mb-3">48</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+8%</span>
                      <span className="text-sm text-gray-500">vs last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CardContent className="px-6 py-5">
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-3">Resigned Employee</p>
                    <p className="text-5xl font-bold text-gray-900 mb-3">16</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">+2%</span>
                      <span className="text-sm text-gray-500">vs last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Departments List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Departments</CardTitle>
                  <a href="/departments" className="text-sm text-blue-600 hover:text-blue-700">See All</a>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">{loadingDepartments ? '...' : departments.length}</span>
                  <span className="text-gray-600 text-sm">Total Departments</span>
                </div>
              </CardHeader>
              <CardContent>
                {loadingDepartments ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-gray-500">Loading departments...</div>
                  </div>
                ) : departments.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {departments.slice(0, 4).map((department) => (
                        <div key={department.id} className={`p-4 rounded-xl border ${getBorderColor(department.iconColor)}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 ${getDepartmentBgColor(department.iconColor)} rounded-lg flex items-center justify-center`}>
                              {getDepartmentIcon(department)}
                            </div>
                            <Badge className={`text-xs ${getBadgeColor(department.iconColor)}`}>
                              {department.employeeCount} Members
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{department.name}</h3>
                          <p className="text-sm text-gray-600">{department.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* See More Departments */}
                    {departments.length > 4 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-600 font-medium">+{departments.length - 4} more departments</p>
                        <a href="/departments" className="text-xs text-blue-500 hover:text-blue-700 mt-1 inline-block">View all departments →</a>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No departments found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right Section - Employee List */}
          <div className="col-span-1">
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm h-full">
              <CardContent className="p-6">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Employees</h3>
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <button className="text-sm text-blue-600">See All</button>
                    </div>
                  </div>

                  {/* Employee List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="https://i.pravatar.cc/40?img=5" alt="Anna Smith" />
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Anna Smith</p>
                          <p className="text-xs text-gray-500">Software Engineer</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="https://i.pravatar.cc/40?img=6" alt="John Doe" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">John Doe</p>
                          <p className="text-xs text-gray-500">Product Manager</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="https://i.pravatar.cc/40?img=7" alt="Emily Davis" />
                          <AvatarFallback>ED</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Emily Davis</p>
                          <p className="text-xs text-gray-500">UX Designer</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="https://i.pravatar.cc/40?img=8" alt="Michael Chen" />
                          <AvatarFallback>MC</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Michael Chen</p>
                          <p className="text-xs text-gray-500">DevOps Engineer</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Away</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="https://i.pravatar.cc/40?img=9" alt="Sarah Wilson" />
                          <AvatarFallback>SW</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Sarah Wilson</p>
                          <p className="text-xs text-gray-500">Marketing Manager</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="https://i.pravatar.cc/40?img=10" alt="David Rodriguez" />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">David Rodriguez</p>
                          <p className="text-xs text-gray-500">Data Analyst</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-sm text-blue-600 font-medium">+212 more employees</p>
                      <button className="text-xs text-blue-500 hover:text-blue-700 mt-1">View all employees →</button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
