'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import RouteGuard from '@/components/RouteGuard'
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
  Settings
} from 'lucide-react'

// Mock departments data
const departmentsData = [
  {
    id: 1,
    name: 'Engineering',
    description: 'Software Development & DevOps',
    manager: {
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/40?img=11',
      email: 'alex.johnson@company.com'
    },
    employees: 45,
    budget: '$2,800,000',
    location: 'San Francisco, CA',
    established: '2018',
    iconBg: 'bg-blue-500',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 2,
    name: 'Marketing',
    description: 'Digital Marketing & Brand Management',
    manager: {
      name: 'Sarah Miller',
      avatar: 'https://i.pravatar.cc/40?img=12',
      email: 'sarah.miller@company.com'
    },
    employees: 28,
    budget: '$1,200,000',
    location: 'New York, NY',
    established: '2019',
    iconBg: 'bg-green-500',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    )
  }
]

function Departments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDepartments, setFilteredDepartments] = useState(departmentsData)

  // Filter departments based on search term
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term === '') {
      setFilteredDepartments(departmentsData)
    } else {
      const filtered = departmentsData.filter(dept => 
        dept.name.toLowerCase().includes(term.toLowerCase()) ||
        dept.description.toLowerCase().includes(term.toLowerCase()) ||
        dept.manager.name.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredDepartments(filtered)
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
            <Button className="bg-black hover:bg-gray-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </div>
        </div>

        {/* Department List */}
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
                        <div className={`w-12 h-12 ${department.iconBg} rounded-lg flex items-center justify-center mr-4`}>
                          {department.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{department.name}</div>
                          <div className="text-sm text-gray-500">{department.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="w-10 h-10 mr-3">
                          <AvatarImage src={department.manager.avatar} alt={department.manager.name} />
                          <AvatarFallback>{department.manager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{department.manager.name}</div>
                          <div className="text-sm text-gray-500">{department.manager.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{department.employees}</div>
                      <div className="text-sm text-gray-500">Members</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{department.budget}</div>
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
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
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
