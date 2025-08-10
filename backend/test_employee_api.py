#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8000/api"

def login_and_get_token():
    """Login and get JWT token"""
    login_data = {
        "email": "admin@example.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            headers={"Content-Type": "application/json"},
            json=login_data
        )
        
        if response.status_code == 200:
            login_response = response.json()
            token = login_response.get('token')
            print(f"Login successful. Token: {token[:20]}...")
            return token
        else:
            print(f"Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Login error: {e}")
        return None

def test_employee_api():
    print("=== Testing Employee CRUD Operations ===\n")
    
    # Login first to get token
    print("0. Logging in...")
    token = login_and_get_token()
    if not token:
        print("Cannot proceed without authentication token")
        return
    
    # Set up headers with token
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    print()
    
    # Test 1: Test endpoint
    print("1. Testing basic endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/employees/test")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}\n")
    except Exception as e:
        print(f"Error: {e}\n")
    
    # Test 2: Get all employees (should be empty initially)
    print("2. Getting all employees...")
    try:
        response = requests.get(f"{BASE_URL}/employees", headers=headers)
        print(f"Status: {response.status_code}")
        employees = response.json()
        print(f"Number of employees: {len(employees)}")
        print(f"Employees: {json.dumps(employees, indent=2)}\n")
    except Exception as e:
        print(f"Error: {e}\n")
    
    # Test 3: Create a new employee
    print("3. Creating a new employee...")
    employee_data = {
        "firstName": "John",
        "lastName": "Doe", 
        "position": "Software Engineer",
        "email": "john.doe@testcompany.com",
        "department": "Engineering",
        "isActive": True,
        "phoneNumber": "+1-555-0123",
        "profile": "Experienced software engineer with expertise in Java and Python.",
        "password": "password123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/employees",
            headers=headers,
            json=employee_data
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            created_employee = response.json()
            print(f"Created employee: {json.dumps(created_employee, indent=2)}")
            employee_id = created_employee.get('id')
        else:
            print(f"Error response: {response.text}")
            employee_id = None
        print()
    except Exception as e:
        print(f"Error: {e}\n")
        employee_id = None
    
    # Test 4: Get employee by ID
    if employee_id:
        print("4. Getting employee by ID...")
        try:
            response = requests.get(f"{BASE_URL}/employees/{employee_id}", headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                employee = response.json()
                print(f"Employee: {json.dumps(employee, indent=2)}")
            else:
                print(f"Error response: {response.text}")
            print()
        except Exception as e:
            print(f"Error: {e}\n")
    
    # Test 5: Update employee
    if employee_id:
        print("5. Updating employee...")
        update_data = {
            "firstName": "John",
            "lastName": "Smith",  # Changed last name
            "position": "Senior Software Engineer",  # Changed position
            "email": "john.smith@testcompany.com",  # Changed email
            "department": "Engineering",
            "isActive": True,
            "phoneNumber": "+1-555-0124",  # Changed phone
            "profile": "Senior software engineer with extensive experience in Java, Python, and cloud technologies."
        }
        
        try:
            response = requests.put(
                f"{BASE_URL}/employees/{employee_id}",
                headers=headers,
                json=update_data
            )
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                updated_employee = response.json()
                print(f"Updated employee: {json.dumps(updated_employee, indent=2)}")
            else:
                print(f"Error response: {response.text}")
            print()
        except Exception as e:
            print(f"Error: {e}\n")
    
    # Test 6: Get all employees again (should now have 1 employee)
    print("6. Getting all employees after creation...")
    try:
        response = requests.get(f"{BASE_URL}/employees", headers=headers)
        print(f"Status: {response.status_code}")
        employees = response.json()
        print(f"Number of employees: {len(employees)}")
        print(f"Employees: {json.dumps(employees, indent=2)}\n")
    except Exception as e:
        print(f"Error: {e}\n")
    
    # Test 7: Search employees
    print("7. Searching employees...")
    try:
        response = requests.get(f"{BASE_URL}/employees?search=John", headers=headers)
        print(f"Status: {response.status_code}")
        employees = response.json()
        print(f"Search results: {json.dumps(employees, indent=2)}\n")
    except Exception as e:
        print(f"Error: {e}\n")
    
    # Test 8: Get employees by department
    print("8. Getting employees by department...")
    try:
        response = requests.get(f"{BASE_URL}/employees?department=Engineering", headers=headers)
        print(f"Status: {response.status_code}")
        employees = response.json()
        print(f"Engineering employees: {json.dumps(employees, indent=2)}\n")
    except Exception as e:
        print(f"Error: {e}\n")
    
    # Test 9: Get all departments
    print("9. Getting all departments...")
    try:
        response = requests.get(f"{BASE_URL}/employees/departments", headers=headers)
        print(f"Status: {response.status_code}")
        departments = response.json()
        print(f"Departments: {json.dumps(departments, indent=2)}\n")
    except Exception as e:
        print(f"Error: {e}\n")
    
    # Test 10: Delete employee
    if employee_id:
        print("10. Deleting employee...")
        try:
            response = requests.delete(f"{BASE_URL}/employees/{employee_id}", headers=headers)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}\n")
        except Exception as e:
            print(f"Error: {e}\n")
    
    # Test 11: Verify deletion
    print("11. Verifying deletion - getting all employees...")
    try:
        response = requests.get(f"{BASE_URL}/employees", headers=headers)
        print(f"Status: {response.status_code}")
        employees = response.json()
        print(f"Number of employees after deletion: {len(employees)}")
        print(f"Employees: {json.dumps(employees, indent=2)}\n")
    except Exception as e:
        print(f"Error: {e}\n")

if __name__ == "__main__":
    test_employee_api()
