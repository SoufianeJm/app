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

def test_create_employee_variations():
    print("=== Testing Employee Creation Variations ===\n")
    
    # Login first to get token
    print("Logging in...")
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
    
    # Test 1: Try with all fields
    print("Test 1: Creating employee with all fields...")
    employee_data_full = {
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
    
    test_employee_creation(headers, employee_data_full, "Full data")
    
    # Test 2: Try with minimal fields
    print("\nTest 2: Creating employee with minimal required fields...")
    employee_data_minimal = {
        "firstName": "Jane",
        "lastName": "Smith", 
        "position": "Developer",
        "email": "jane.smith@testcompany.com",
        "department": "Tech",
        "password": "password123"
    }
    
    test_employee_creation(headers, employee_data_minimal, "Minimal data")
    
    # Test 3: Try with longer password
    print("\nTest 3: Creating employee with longer password...")
    employee_data_long_pwd = {
        "firstName": "Bob",
        "lastName": "Johnson", 
        "position": "Manager",
        "email": "bob.johnson@testcompany.com",
        "department": "Management",
        "password": "password123456"
    }
    
    test_employee_creation(headers, employee_data_long_pwd, "Long password")

def test_employee_creation(headers, employee_data, test_name):
    try:
        response = requests.post(
            f"{BASE_URL}/employees",
            headers=headers,
            json=employee_data
        )
        print(f"{test_name} - Status: {response.status_code}")
        print(f"{test_name} - Response Headers: {dict(response.headers)}")
        print(f"{test_name} - Response Text: '{response.text}'")
        
        if response.status_code == 201:
            created_employee = response.json()
            print(f"{test_name} - SUCCESS: {json.dumps(created_employee, indent=2)}")
            return created_employee.get('id')
        else:
            print(f"{test_name} - FAILED")
            return None
    except Exception as e:
        print(f"{test_name} - Error: {e}")
        return None

if __name__ == "__main__":
    test_create_employee_variations()
