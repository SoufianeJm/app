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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
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
        employee.setHireDate(request.getHireDate());
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
            employee.setHireDate(request.getHireDate());
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
    
    public List<String> getAllDepartments() {
        return userRepository.findEmployeeDepartments(User.Role.EMPLOYEE);
    }
}
