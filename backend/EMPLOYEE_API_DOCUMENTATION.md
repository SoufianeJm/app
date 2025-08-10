# Employee API Documentation

## Base URL
`http://localhost:8000/api/employees`

## Authentication
All endpoints (except `/test`) require JWT Bearer token authentication.
Use the `/api/auth/login` endpoint to get a token first.

## Endpoints

### 1. Get All Employees
- **URL**: `GET /api/employees`
- **Description**: Retrieve all employees with optional filtering
- **Query Parameters**:
  - `search` (optional): Search employees by name, email, position, or department
  - `department` (optional): Filter employees by department
  - `status` (optional): Filter employees by status (ACTIVE, INACTIVE, ON_LEAVE, TERMINATED)
- **Response**: Array of Employee objects

**Example:**
```bash
GET /api/employees?search=Anna
GET /api/employees?department=Engineering
GET /api/employees?status=ACTIVE
```

### 2. Get Employees with Pagination
- **URL**: `GET /api/employees/paginated`
- **Description**: Retrieve employees with pagination support
- **Query Parameters**:
  - `page` (default: 0): Page number
  - `size` (default: 10): Number of items per page
  - `sortBy` (default: "name"): Field to sort by
  - `sortDir` (default: "asc"): Sort direction (asc/desc)
- **Response**: Paginated response with metadata

### 3. Get Employee by ID
- **URL**: `GET /api/employees/{id}`
- **Description**: Retrieve a specific employee by ID
- **Response**: Employee object or 404 if not found

### 4. Get Employee by Email
- **URL**: `GET /api/employees/email/{email}`
- **Description**: Retrieve a specific employee by email
- **Response**: Employee object or 404 if not found

### 5. Create Employee
- **URL**: `POST /api/employees`
- **Description**: Create a new employee
- **Request Body**: EmployeeRequest object
- **Response**: Created Employee object (201) or validation errors (400)

**Request Body Example:**
```json
{
  "name": "John Doe",
  "position": "Software Engineer",
  "email": "john.doe@company.com",
  "department": "Engineering",
  "status": "ACTIVE",
  "avatarUrl": "https://i.pravatar.cc/40?img=1",
  "phoneNumber": "+1-555-0123",
  "hireDate": "2025-01-15T09:00:00"
}
```

### 6. Update Employee
- **URL**: `PUT /api/employees/{id}`
- **Description**: Update an existing employee
- **Request Body**: EmployeeRequest object
- **Response**: Updated Employee object or 404 if not found

### 7. Delete Employee
- **URL**: `DELETE /api/employees/{id}`
- **Description**: Delete an employee
- **Response**: 204 No Content or 404 if not found

### 8. Get All Departments
- **URL**: `GET /api/employees/departments`
- **Description**: Get list of all unique departments
- **Response**: Array of department names

### 9. Get Department Employee Count
- **URL**: `GET /api/employees/departments/{department}/count`
- **Description**: Get the number of employees in a specific department
- **Response**: Object with department name and employee count

### 10. Test Endpoint (Public)
- **URL**: `GET /api/employees/test`
- **Description**: Test endpoint to verify API is working
- **Authentication**: Not required
- **Response**: "Employee API is working!"

## Employee Object Structure

```json
{
  "id": 1,
  "name": "Anna Smith",
  "position": "Software Engineer",
  "email": "anna.smith@company.com",
  "department": "Engineering",
  "status": "ACTIVE",
  "avatarUrl": "https://i.pravatar.cc/40?img=5",
  "phoneNumber": "+1-555-0101",
  "hireDate": "2024-06-04T16:42:04.157191",
  "createdAt": "2025-08-04T16:42:04.157191",
  "updatedAt": "2025-08-04T16:42:04.157191"
}
```

## Status Values
- `ACTIVE`: Employee is currently active
- `INACTIVE`: Employee is inactive
- `ON_LEAVE`: Employee is on leave
- `TERMINATED`: Employee has been terminated

## Sample Data
The API comes with 7 sample employees across different departments:
- Anna Smith (Software Engineer, Engineering)
- John Doe (Product Manager, Product)
- Sarah Wilson (UX Designer, Design)
- Michael Johnson (DevOps Engineer, Engineering)
- Emily Davis (HR Manager, Human Resources)
- David Brown (Marketing Specialist, Marketing)
- Lisa Garcia (Financial Analyst, Finance) - Status: ON_LEAVE

## Testing
All endpoints have been thoroughly tested with integration tests. Run tests with:
```bash
mvn test -Dtest=EmployeeIntegrationTest
```

## Authentication Example
```bash
# Login to get token
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}

# Use token in subsequent requests
Authorization: Bearer {token}
```
