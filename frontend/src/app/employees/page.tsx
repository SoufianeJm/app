'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import RouteGuard from '@/components/RouteGuard'
import EmployeeForm from '@/components/EmployeeForm'
import { 
  Employee, 
  CreateEmployeeRequest, 
  UpdateEmployeeRequest,
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  fetchDepartments
} from '@/lib/api'
import {
  Users,
  Search,
  Bell,
  Settings,
  HelpCircle,
  MessageSquare,
  LayoutDashboard,
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MoreVertical,
  Loader2
} from 'lucide-react'

function EmployeePage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<string[]>(['All'])
  const [loading, setLoading] = useState(true)
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('All')

  useEffect(() => {
    const loadData = async () => {
      try {
        const employeesData = await fetchEmployees()
        const departmentsData = await fetchDepartments()
        setEmployees(employeesData)
        setDepartments(['All', ...departmentsData])
      } catch (error) {
        console.error('Failed to fetch employees:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'All' || employee.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

const handleEdit = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId)
    if (employee) {
      setSelectedEmployee(employee)
      setFormMode('edit')
      setEmployeeFormOpen(true)
    }
  }

  const handleDelete = async (employeeId: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(employeeId)
        const employeesData = await fetchEmployees()
        setEmployees(employeesData)
      } catch (error) {
        console.error('Failed to delete employee:', error)
      }
    }
  }

const handleView = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId)
    if (employee) {
      setSelectedEmployee(employee)
      setFormMode('view')
      setEmployeeFormOpen(true)
    }
  }

const handleAddNew = () => {
    setFormMode('create')
    setSelectedEmployee(null)
    setEmployeeFormOpen(true)
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
          <a href="/dashboard" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="/employees" className="flex items-center px-3 py-2 bg-gray-100 text-gray-900 rounded-lg">
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
            <h1 className="text-2xl font-semibold text-gray-900 mr-8">Employees</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        </div>

        {/* Employee Form Dialog */}
        <EmployeeForm
          open={employeeFormOpen}
          onClose={() => setEmployeeFormOpen(false)}
          onSubmit={async (data) => {
            try {
              // Transform form data to API format
              const apiData = {
                ...data,
                phoneNumber: data.phone,
                hireDate: data.startDate,
                profile: data.notes,
                isActive: true
              }
              
              if (formMode === 'create') {
                await createEmployee(apiData as CreateEmployeeRequest)
              } else if (formMode === 'edit') {
                await updateEmployee(selectedEmployee!.id, apiData as UpdateEmployeeRequest)
              }
              const employees = await fetchEmployees()
              setEmployees(employees)
            } catch (error) {
              console.error('Error saving employee:', error)
            }
          }}
          employee={selectedEmployee}
          departments={departments}
          mode={formMode}
        />

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
          </div>
        ) : (
        <>
          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{employee.firstName} {employee.lastName}</h3>
                      <p className="text-xs text-gray-500">{employee.position}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="text-xs bg-green-100 text-green-800">
                    Active
                  </Badge>
                  <span className="text-xs text-gray-500">{employee.department}</span>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3" />
                    <span>{employee.phoneNumber || employee.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3" />
                    <span>{employee.address || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}</span>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleView(employee.id)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(employee.id)}
                        className="h-8 w-8 p-0 hover:bg-green-50"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(employee.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

          {/* Empty State */}
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  )
}

export default function EmployeesPage() {
  return (
    <RouteGuard requireAuth={true}>
      <EmployeePage />
    </RouteGuard>
  )
}
