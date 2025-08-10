'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import RouteGuard from '@/components/RouteGuard'
import { useAuth } from '@/context/AuthContext'
import { 
  Users,
  Search,
  Building2,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  SortAsc,
  MapPin,
  DollarSign,
  Calendar,
  LayoutDashboard,
  HelpCircle,
  MessageSquare,
  Settings,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Department, fetchAllDepartments, deleteDepartment, createDepartment, CreateDepartmentRequest } from '@/lib/api'

function Departments() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [departments, setDepartments] = useState<Department[]>([])
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)

  // Load departments on component mount
  useEffect(() => {
    loadDepartments()
  }, [])

  // Filter departments when search term or departments change
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredDepartments(departments)
    } else {
      const filtered = departments.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.manager && (
          dept.manager.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.manager.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.manager.email.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
      setFilteredDepartments(filtered)
    }
  }, [searchTerm, departments])

  const loadDepartments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchAllDepartments()
      if (response.success) {
        setDepartments(response.data)
      } else {
        setError('Failed to load departments')
      }
    } catch (err: any) {
      console.error('Error loading departments:', err)
      setError(err.response?.data?.message || 'Failed to load departments')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this department?')) {
      return
    }

    try {
      setDeleteLoading(id)
      const response = await deleteDepartment(id)
      if (response.success) {
        setDepartments(departments.filter(dept => dept.id !== id))
        alert('Department deleted successfully')
      } else {
        alert('Failed to delete department: ' + response.message)
      }
    } catch (err: any) {
      console.error('Error deleting department:', err)
      alert(err.response?.data?.message || 'Failed to delete department')
    } finally {
      setDeleteLoading(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear().toString()
  }

  const getIconFromColor = (color: string) => {
    // Return a generic building icon based on color
    return (
      <Building2 className="w-5 h-5 text-white" />
    )
  }

  // Handle search input
  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  // Handle create department
  const handleCreateDepartment = async (formData: CreateDepartmentRequest) => {
    try {
      setCreateLoading(true)
      const response = await createDepartment(formData)
      if (response.success) {
        setDepartments([...departments, response.data])
        setShowAddModal(false)
        alert('Department created successfully!')
      } else {
        alert('Failed to create department: ' + response.message)
      }
    } catch (err: any) {
      console.error('Error creating department:', err)
      alert(err.response?.data?.message || 'Failed to create department')
    } finally {
      setCreateLoading(false)
    }
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
          <a href="/employees" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Users className="w-5 h-5 mr-3" />
            Employees
          </a>
          <a href="/departments" className="flex items-center px-3 py-2 bg-gray-100 text-gray-900 rounded-lg">
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
            <h1 className="text-2xl font-semibold text-gray-900 mr-8">Departments</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-900">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-900">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort
            </Button>
            {(user?.role === 'ADMIN') && (
              <Button 
                className="bg-black hover:bg-gray-800 text-white"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading departments...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
            <Button 
              onClick={loadDepartments} 
              className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Department List */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manager
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDepartments.map((department) => (
                    <tr key={department.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: department.iconColor || '#3B82F6' }}>
                            {getIconFromColor(department.iconColor)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{department.name}</div>
                            <div className="text-sm text-gray-500">{department.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {department.manager ? (
                          <div className="flex items-center">
                            <Avatar className="w-10 h-10 mr-3">
                              <AvatarImage src={`https://i.pravatar.cc/40?img=${department.manager.id}`} alt={`${department.manager.firstName} ${department.manager.lastName}`} />
                              <AvatarFallback>{department.manager.firstName[0]}{department.manager.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{department.manager.firstName} {department.manager.lastName}</div>
                              <div className="text-sm text-gray-500">{department.manager.email}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No manager assigned</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{department.employeeCount}</div>
                        <div className="text-sm text-gray-500">Members</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(department.budget)}</div>
                        <div className="text-sm text-gray-500">Annual Budget</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {department.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          {(user?.role === 'ADMIN') && (
                            <>
                              <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50"
                                onClick={() => handleDelete(department.id)}
                                disabled={deleteLoading === department.id}
                              >
                                {deleteLoading === department.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-500">Try adjusting your search terms or create a new department.</p>
            <Button className="mt-4 bg-black hover:bg-gray-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Department
            </Button>
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <CreateDepartmentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateDepartment}
          loading={createLoading}
        />
      )}
    </div>
  )
}

// Create Department Modal Component
interface CreateDepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateDepartmentRequest) => void
  loading: boolean
}

function CreateDepartmentModal({ isOpen, onClose, onSubmit, loading }: CreateDepartmentModalProps) {
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    name: '',
    description: '',
    location: '',
    budget: 0,
    establishedDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    iconColor: '#3B82F6', // Default blue color
    isActive: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Lime', value: '#84CC16' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    if (formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0'
    }
    if (!formData.establishedDate) {
      newErrors.establishedDate = 'Established date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof CreateDepartmentRequest, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Create New Department</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Department Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Engineering, Marketing, Sales"
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Brief description of the department"
              disabled={loading}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Location and Budget - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Building A, Floor 2"
                disabled={loading}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Budget (USD) *
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.budget ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="500000"
                disabled={loading}
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>
          </div>

          {/* Established Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Established Date *
            </label>
            <input
              type="date"
              value={formData.establishedDate}
              onChange={(e) => handleInputChange('establishedDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.establishedDate ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.establishedDate && <p className="text-red-500 text-sm mt-1">{errors.establishedDate}</p>}
          </div>

          {/* Icon Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Color
            </label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('iconColor', color.value)}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${
                    formData.iconColor === color.value
                      ? 'border-gray-800 ring-2 ring-gray-300'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  disabled={loading}
                  title={color.name}
                >
                  {formData.iconColor === color.value && (
                    <Building2 className="w-5 h-5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Department
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function DepartmentsPage() {
  return (
    <RouteGuard requireAuth={true}>
      <Departments />
    </RouteGuard>
  )
}
