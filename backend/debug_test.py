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

def test_create_employee():
    print("=== Debug Employee Creation ===\n")
    
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
    
    # Test with minimal required fields
    print("Creating employee with minimal fields...")
    employee_data = {
        "firstName": "John",
        "lastName": "Doe", 
        "position": "Software Engineer",
        "email": "john.doe@testcompany.com",
        "department": "Engineering",
        "password": "password123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/employees",
            headers=headers,
            json=employee_data
        )
        print(f"Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text}")
        
        if response.status_code == 201:
            created_employee = response.json()
            print(f"Created employee: {json.dumps(created_employee, indent=2)}")
            return created_employee.get('id')
        else:
            print("Employee creation failed")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    test_create_employee()
