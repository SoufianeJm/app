'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { authApi } from '@/lib/api'
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
  Calendar,
  Users,
  UserPlus,
  UserMinus,
  Clock,
  TrendingUp,
  Search,
  Bell,
  Settings,
  HelpCircle,
  MessageSquare,
  MoreHorizontal
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

const timeWorkedData = [
  { name: 'Nov 02, 2024', hours: 8 },
  { name: 'Nov 03, 2024', hours: 7.5 },
  { name: 'Nov 04, 2024', hours: 8.5 },
  { name: 'Nov 05, 2024', hours: 8 },
  { name: 'Nov 06, 2024', hours: 7 },
  { name: 'Nov 07, 2024', hours: 8.5 },
  { name: 'Nov 08, 2024', hours: 9 }
]

const employmentStatusData = [
  { name: 'Permanent', value: 324, color: '#8b5cf6' },
  { name: 'Contract', value: 121, color: '#10b981' },
  { name: 'Probation', value: 72, color: '#f59e0b' }
]

function Dashboard() {
  const { user, logout } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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
          <a href="#" className="flex items-center px-3 py-2 bg-gray-100 text-gray-900 rounded-lg">
            <Users className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Calendar className="w-5 h-5 mr-3" />
            Schedule
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Users className="w-5 h-5 mr-3" />
            Projects
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Clock className="w-5 h-5 mr-3" />
            Reports
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <MessageSquare className="w-5 h-5 mr-3" />
            Notes
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <TrendingUp className="w-5 h-5 mr-3" />
            Benefits
            <Badge className="ml-auto bg-blue-100 text-blue-800 text-xs">NEW</Badge>
          </a>
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200 space-y-1">
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Users className="w-5 h-5 mr-3" />
            Job
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <UserPlus className="w-5 h-5 mr-3" />
            Candidate
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Users className="w-5 h-5 mr-3" />
            Company
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Clock className="w-5 h-5 mr-3" />
            Payment
          </a>
        </div>

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
            
            {/* KPI Performance Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>KPI Performance</CardTitle>
                  <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option>Last Year</option>
                  </select>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">91.72%</span>
                  <span className="text-green-600 text-sm">+24% vs last month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={kpiData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Section - Schedule */}
          <div className="col-span-1">
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm h-full">
              <CardContent className="p-6">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <button className="text-sm text-blue-600">See All</button>
                    </div>
                  </div>
                  
                  {/* Calendar Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button className="p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="font-medium text-gray-900">October 2024</span>
                    <button className="p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="flex justify-between mb-6">
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium mb-1">31</div>
                      <div className="text-xs text-gray-500">Thu</div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium mb-1">01</div>
                      <div className="text-xs text-gray-500">Fri</div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-medium mb-1">02</div>
                      <div className="text-xs text-blue-600 font-medium">Sat</div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium mb-1">03</div>
                      <div className="text-xs text-gray-500">Sun</div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium mb-1">04</div>
                      <div className="text-xs text-gray-500">Mon</div>
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex space-x-6 mb-4 border-b border-gray-200">
                    <button className="text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-3">Meetings</button>
                    <button className="text-sm text-gray-500 pb-3">Events</button>
                    <button className="text-sm text-gray-500 pb-3">Holiday</button>
                  </div>
                  
                  {/* Meetings List */}
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg relative">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium text-purple-700">Product Design</div>
                        <button className="text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Meeting with Arthur Bell</div>
                      <div className="text-xs text-gray-500 mb-1">09:00 - 09:45 AM (UTC)</div>
                      <div className="text-xs text-gray-500 mb-3">On Google Meet</div>
                      <div className="flex -space-x-1">
                        <Avatar className="w-6 h-6 border-2 border-white">
                          <AvatarImage src="https://i.pravatar.cc/24?img=2" />
                          <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-6 h-6 border-2 border-white">
                          <AvatarImage src="https://i.pravatar.cc/24?img=3" />
                          <AvatarFallback>CD</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-6 h-6 border-2 border-white">
                          <AvatarImage src="https://i.pravatar.cc/24?img=4" />
                          <AvatarFallback>EF</AvatarFallback>
                        </Avatar>
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs border-2 border-white">+3</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-orange-50 rounded-lg relative">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium text-orange-700">Brainstorming Session</div>
                        <button className="text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">Meeting with Leslie Perez</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Row */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Total Time Worked */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Total Time Worked</CardTitle>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>Weekly View</option>
                </select>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">12hr 32min</span>
                <span className="text-green-600 text-sm">+12% vs last month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={timeWorkedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis hide />
                  <YAxis hide />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Nov 02, 2024</span>
                <span>19th: 40min Total Time</span>
              </div>
            </CardContent>
          </Card>

          {/* Employment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-right">
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400"></div>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-sm text-gray-500">100%</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-2xl font-bold">324</div>
                  <div className="text-sm text-gray-500">Permanent</div>
                  <div className="text-xs text-gray-400">48%</div>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-2xl font-bold">121</div>
                  <div className="text-sm text-gray-500">Contract</div>
                  <div className="text-xs text-gray-400">32%</div>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-2xl font-bold">72</div>
                  <div className="text-sm text-gray-500">Probation</div>
                  <div className="text-xs text-gray-400">20%</div>
                </div>
              </div>
            </CardContent>
          </Card>
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
