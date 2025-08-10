package com.example.demo.service;

import com.example.demo.dto.EmployeeRequest;
import com.example.demo.dto.EmployeeResponse;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentService departmentService;
    
    /**
     * Helper method to parse date string to LocalDateTime
     * Accepts formats: YYYY-MM-DD, YYYY-MM-DDTHH:mm:ss, etc.
     */
    private LocalDateTime parseDate(String dateString) {
        if (dateString == null || dateString.trim().isEmpty()) {
            return null;
        }
        
        try {
            // Try parsing as LocalDate first (YYYY-MM-DD format)
            if (dateString.length() == 10) {
                LocalDate date = LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
                return date.atStartOfDay(); // Convert to LocalDateTime at 00:00:00
            }
            // Try parsing as full LocalDateTime
            return LocalDateTime.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format: " + dateString + ". Expected YYYY-MM-DD or ISO date-time format.");
        }
    }
    
    /**
     * Validate that the department exists in the Department table
     */
    private void validateDepartmentExists(String departmentName) {
        if (departmentName == null || departmentName.trim().isEmpty()) {
            throw new RuntimeException("Department name cannot be empty");
        }
        
        try {
            List<String> validDepartments = getAllDepartments();
            if (!validDepartments.contains(departmentName)) {
                throw new RuntimeException("Department '" + departmentName + "' does not exist. Valid departments are: " + String.join(", ", validDepartments));
            }
        } catch (Exception e) {
            // If we can't validate against departments, log warning but don't fail
            // This ensures backward compatibility if Department service is unavailable
            System.err.println("Warning: Could not validate department '" + departmentName + "': " + e.getMessage());
        }
    }
    
    public List<EmployeeResponse> getAllEmployees() {
        return userRepository.findByRole(User.Role.EMPLOYEE).stream()
                .map(EmployeeResponse::fromUser)
                .collect(Collectors.toList());
    }
    
    public Page<EmployeeResponse> getAllEmployees(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(user -> user.getRole() == User.Role.EMPLOYEE ? EmployeeResponse.fromUser(user) : null)
                .map(response -> response); // Filter nulls would need custom implementation
    }
    
    public EmployeeResponse getEmployeeById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        if (user.getRole() != User.Role.EMPLOYEE) {
            throw new RuntimeException("User with id " + id + " is not an employee");
        }
        return EmployeeResponse.fromUser(user);
    }
    
    public EmployeeResponse getEmployeeByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found with email: " + email));
        if (user.getRole() != User.Role.EMPLOYEE) {
            throw new RuntimeException("User with email " + email + " is not an employee");
        }
        return EmployeeResponse.fromUser(user);
    }
    
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with email " + request.getEmail() + " already exists");
        }
        
        // Validate password is provided for new employees
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required for creating new employees");
        }
        
        // Validate department exists
        validateDepartmentExists(request.getDepartment());
        
        User employee = new User();
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setPosition(request.getPosition());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setRole(User.Role.EMPLOYEE);
        employee.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        employee.setAvatarUrl(request.getAvatarUrl());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setHireDate(parseDate(request.getHireDate()));
        employee.setProfile(request.getProfile());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        
        User savedEmployee = userRepository.save(employee);
        return EmployeeResponse.fromUser(savedEmployee);
    }
    
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        User employee = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        
        if (employee.getRole() != User.Role.EMPLOYEE) {
            throw new RuntimeException("User with id " + id + " is not an employee");
        }

        // Check if email is being changed and if it's already taken by another employee
        if (!employee.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with email " + request.getEmail() + " already exists");
        }
        
        // Validate department exists
        validateDepartmentExists(request.getDepartment());
        
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setPosition(request.getPosition());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setIsActive(request.getIsActive() != null ? request.getIsActive() : employee.getIsActive());
        employee.setAvatarUrl(request.getAvatarUrl());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setProfile(request.getProfile());
        
        if (request.getHireDate() != null) {
            employee.setHireDate(parseDate(request.getHireDate()));
        }
        
        User updatedEmployee = userRepository.save(employee);
        return EmployeeResponse.fromUser(updatedEmployee);
    }
    
    public void deleteEmployee(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        if (user.getRole() != User.Role.EMPLOYEE) {
            throw new RuntimeException("User with id " + id + " is not an employee");
        }
        userRepository.deleteById(id);
    }
    
    public List<EmployeeResponse> searchEmployees(String searchTerm) {
        return userRepository.searchEmployees(User.Role.EMPLOYEE, searchTerm).stream()
                .map(EmployeeResponse::fromUser)
                .collect(Collectors.toList());
    }
    
    public List<EmployeeResponse> getEmployeesByDepartment(String department) {
        return userRepository.findByRole(User.Role.EMPLOYEE).stream()
                .filter(user -> department.equals(user.getDepartment()))
                .map(EmployeeResponse::fromUser)
                .collect(Collectors.toList());
    }
    
    public List<EmployeeResponse> getEmployeesByStatus(Boolean isActive) {
        return userRepository.findByRoleAndIsActive(User.Role.EMPLOYEE, isActive).stream()
                .map(EmployeeResponse::fromUser)
                .collect(Collectors.toList());
    }
    
    public Long getEmployeeCountByDepartment(String department) {
        return userRepository.countEmployeesByDepartment(User.Role.EMPLOYEE, department);
    }
    
    /**
     * Get all active department names for dropdown/selection purposes
     */
    public List<String> getAllDepartments() {
        try {
            // Get active departments from the Department service
            return departmentService.getAllDepartments()
                    .stream()
                    .map(dept -> dept.getName())
                    .sorted()
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // Fallback to existing employee departments if Department service fails
            List<String> departments = userRepository.findEmployeeDepartments(User.Role.EMPLOYEE);
            
            // If no departments exist, return default departments
            if (departments.isEmpty()) {
                return List.of("Engineering & Technology", "Human Resources", "Marketing & Sales", "Finance", "Operations");
            }
            
            return departments;
        }
    }
}
