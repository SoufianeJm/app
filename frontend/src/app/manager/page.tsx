'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { authApi, employeeApi, departmentApi, Employee, Department } from '@/lib/api'
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
  UserCheck,
  TrendingUp,
  Calendar,
  FileText,
  Clock,
  Target,
  Award,
  AlertTriangle,
  Plus,
  Filter
} from 'lucide-react'

// Mock data for manager dashboard
const teamPerformanceData = [
  { month: 'Jan', performance: 85, productivity: 78 },
  { month: 'Feb', performance: 88, productivity: 82 },
  { month: 'Mar', performance: 82, productivity: 85 },
  { month: 'Apr', performance: 90, productivity: 88 },
  { month: 'May', performance: 87, productivity: 90 },
  { month: 'Jun', performance: 93, productivity: 85 }
]

const taskStatusData = [
  { name: 'Terminées', value: 65, color: '#10B981' },
  { name: 'En cours', value: 25, color: '#F59E0B' },
  { name: 'En attente', value: 10, color: '#EF4444' }
]

const upcomingTasks = [
  { id: 1, task: 'Réunion de révision projet', assignee: 'Sarah Johnson', deadline: '2025-08-18', priority: 'Haute' },
  { id: 2, task: 'Session de planification Q4', assignee: 'Michael Chen', deadline: '2025-08-20', priority: 'Moyenne' },
  { id: 3, task: 'Préparation présentation client', assignee: 'Emma Davis', deadline: '2025-08-19', priority: 'Haute' },
  { id: 4, task: 'Évaluation performance équipe', assignee: 'David Wilson', deadline: '2025-08-22', priority: 'Moyenne' }
]

const teamMembers = [
  { id: 1, name: 'Sarah Johnson', role: 'Développeur Senior', avatar: 'https://i.pravatar.cc/40?img=1', status: 'Actif', tasks: 12, completed: 8 },
  { id: 2, name: 'Michael Chen', role: 'Designer UI/UX', avatar: 'https://i.pravatar.cc/40?img=2', status: 'Actif', tasks: 8, completed: 6 },
  { id: 3, name: 'Emma Davis', role: 'Coordinatrice Projet', avatar: 'https://i.pravatar.cc/40?img=3', status: 'Absent', tasks: 10, completed: 9 },
  { id: 4, name: 'David Wilson', role: 'Ingénieur QA', avatar: 'https://i.pravatar.cc/40?img=4', status: 'Actif', tasks: 6, completed: 4 }
]

function ManagerDashboard() {
  const { user, logout } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [loadingDepartments, setLoadingDepartments] = useState(true)

  useEffect(() => {
    loadEmployees()
    loadDepartments()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true)
      const data = await employeeApi.getAllEmployees()
      setEmployees(data)
    } catch (error) {
      console.error('Error loading employees:', error)
    } finally {
      setLoadingEmployees(false)
    }
  }

  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true)
      const response = await departmentApi.getAllDepartments()
      if (response.success) {
        setDepartments(response.data)
      }
    } catch (error) {
      console.error('Error loading departments:', error)
    } finally {
      setLoadingDepartments(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'haute': return 'bg-red-100 text-red-800'
      case 'moyenne': return 'bg-yellow-100 text-yellow-800'
      case 'basse': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'actif': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-yellow-100 text-yellow-800'
      case 'occupé': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return <div>Chargement...</div>
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
          <a href="/dashboard" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="/manager" className="flex items-center px-3 py-2 bg-gray-100 text-gray-900 rounded-lg">
            <Target className="w-5 h-5 mr-3" />
            Manager
          </a>
          <a href="/employees" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Users className="w-5 h-5 mr-3" />
            Employés
          </a>
          <a href="/departments" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Building2 className="w-5 h-5 mr-3" />
            Départements
          </a>
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-1">
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <HelpCircle className="w-5 h-5 mr-3" />
            Centre d'aide
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <MessageSquare className="w-5 h-5 mr-3" />
            Commentaires
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5 mr-3" />
            Paramètres
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900 mr-8">Dashboard Manager</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher équipe, tâches..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/40?img=1" alt={user.firstName} />
              <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{user.firstName} {user.lastName}</div>
              <div className="text-gray-500">{user.email}</div>
            </div>
            <Button className="bg-black hover:bg-gray-800 text-white">
              Exporter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Membres d'équipe</p>
                  <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                  <p className="text-xs text-green-600 mt-1">+2 ce mois</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tâches actives</p>
                  <p className="text-2xl font-bold text-gray-900">36</p>
                  <p className="text-xs text-yellow-600 mt-1">8 dues aujourd'hui</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Taux de completion</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-xs text-green-600 mt-1">+5% vs mois dernier</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tâches en retard</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-red-600 mt-1">Nécessite attention</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Team Performance Chart */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Performance d'équipe</CardTitle>
                    <CardDescription>Tendances de performance et productivité sur 6 mois</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={teamPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="performance" stroke="#3B82F6" strokeWidth={2} name="Performance" />
                    <Line type="monotone" dataKey="productivity" stroke="#10B981" strokeWidth={2} name="Productivité" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Task Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Statut des tâches</CardTitle>
              <CardDescription>Répartition actuelle des tâches d'équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Membres de l'équipe</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                  <Button variant="outline" size="sm">Tout voir</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">{member.completed}/{member.tasks}</p>
                        <p className="text-xs text-gray-500">tâches</p>
                      </div>
                      <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Échéances à venir</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle tâche
                  </Button>
                  <Button variant="outline" size="sm">Tout voir</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.task}</p>
                      <p className="text-sm text-gray-600">Assigné à: {task.assignee}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500">{task.deadline}</p>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Raccourcis vers les tâches de gestion courantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Gérer équipe</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Planifier réunion</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Rapport équipe</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Award className="w-6 h-6" />
                  <span className="text-sm">Évaluation</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ManagerPage() {
  return (
    <RouteGuard requireAuth={true}>
      <ManagerDashboard />
    </RouteGuard>
  )
}
