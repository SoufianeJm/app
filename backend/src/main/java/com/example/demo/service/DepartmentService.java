package com.example.demo.service;

import com.example.demo.dto.DepartmentRequest;
import com.example.demo.dto.DepartmentResponse;
import com.example.demo.entity.Department;
import com.example.demo.entity.User;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentService {
    
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    
    /**
     * Helper method to parse date string to LocalDateTime
     */
    private LocalDateTime parseDate(String dateString) {
        if (dateString == null || dateString.trim().isEmpty()) {
            return null;
        }
        
        try {
            // Try parsing as LocalDate first (YYYY-MM-DD format)
            if (dateString.length() == 10) {
                LocalDate date = LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
                return date.atStartOfDay();
            }
            // Try parsing as full LocalDateTime
            return LocalDateTime.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format: " + dateString + ". Expected YYYY-MM-DD or ISO date-time format.");
        }
    }
    
    /**
     * Get all departments with employee counts and manager info
     */
    public List<DepartmentResponse> getAllDepartments() {
        List<Department> departments = departmentRepository.findByIsActiveTrue();
        return enrichDepartmentsWithDetails(departments);
    }
    
    /**
     * Get paginated departments
     */
    public Page<DepartmentResponse> getAllDepartments(Pageable pageable) {
        return departmentRepository.findAll(pageable)
                .map(this::enrichDepartmentWithDetails);
    }
    
    /**
     * Get department by ID
     */
    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
        return enrichDepartmentWithDetails(department);
    }
    
    /**
     * Create new department
     */
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        // Check if department name already exists
        if (departmentRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RuntimeException("Department with name '" + request.getName() + "' already exists");
        }
        
        Department department = new Department();
        mapRequestToDepartment(request, department);
        
        Department savedDepartment = departmentRepository.save(department);
        return enrichDepartmentWithDetails(savedDepartment);
    }
    
    /**
     * Update existing department
     */
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
        
        // Check if name is being changed and if it already exists
        if (!department.getName().equalsIgnoreCase(request.getName()) && 
            departmentRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RuntimeException("Department with name '" + request.getName() + "' already exists");
        }
        
        mapRequestToDepartment(request, department);
        Department updatedDepartment = departmentRepository.save(department);
        return enrichDepartmentWithDetails(updatedDepartment);
    }
    
    /**
     * Delete department (soft delete by setting isActive to false)
     */
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
        
        // Check if there are employees in this department
            long employeeCount = userRepository.countEmployeesByDepartment(User.Role.EMPLOYEE, department.getName());
        if (employeeCount > 0) {
            throw new RuntimeException("Cannot delete department with " + employeeCount + " employees. Please move employees to other departments first.");
        }
        
        department.setIsActive(false);
        departmentRepository.save(department);
    }
    
    /**
     * Search departments by term
     */
    public List<DepartmentResponse> searchDepartments(String searchTerm) {
        List<Department> departments = departmentRepository.searchDepartments(searchTerm);
        return enrichDepartmentsWithDetails(departments);
    }
    
    /**
     * Get departments managed by a specific employee
     */
    public List<DepartmentResponse> getDepartmentsByManager(Long managerId) {
        List<Department> departments = departmentRepository.findByManagerId(managerId);
        return enrichDepartmentsWithDetails(departments);
    }
    
    /**
     * Map request to department entity
     */
    private void mapRequestToDepartment(DepartmentRequest request, Department department) {
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        department.setManagerId(request.getManagerId());
        department.setBudget(request.getBudget());
        department.setLocation(request.getLocation());
        department.setIconColor(request.getIconColor());
        department.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        
        if (request.getEstablishedDate() != null) {
            department.setEstablishedDate(parseDate(request.getEstablishedDate()));
        }
    }
    
    /**
     * Enrich multiple departments with employee counts and manager details
     */
    private List<DepartmentResponse> enrichDepartmentsWithDetails(List<Department> departments) {
        // Get employee counts for all departments
        Map<Long, Long> employeeCounts = getEmployeeCountsForDepartments();
        
        // Get all managers at once to minimize database queries
        List<Long> managerIds = departments.stream()
                .map(Department::getManagerId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());
        
        final Map<Long, User> managers;
        if (!managerIds.isEmpty()) {
            managers = userRepository.findAllById(managerIds).stream()
                    .collect(Collectors.toMap(User::getId, user -> user));
        } else {
            managers = new HashMap<>();
        }
        
        return departments.stream()
                .map(dept -> {
                    dept.setEmployeeCount(employeeCounts.getOrDefault(dept.getId(), 0L));
                    if (dept.getManagerId() != null) {
                        dept.setManager(managers.get(dept.getManagerId()));
                    }
                    return DepartmentResponse.fromDepartment(dept);
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Enrich single department with employee count and manager details
     */
    private DepartmentResponse enrichDepartmentWithDetails(Department department) {
        // Get employee count for this department
        long employeeCount = userRepository.countEmployeesByDepartment(User.Role.EMPLOYEE, department.getName());
        department.setEmployeeCount(employeeCount);
        
        // Get manager details if available
        if (department.getManagerId() != null) {
            userRepository.findById(department.getManagerId())
                    .ifPresent(department::setManager);
        }
        
        return DepartmentResponse.fromDepartment(department);
    }
    
    /**
     * Get employee counts for all departments
     */
    private Map<Long, Long> getEmployeeCountsForDepartments() {
        Map<Long, Long> counts = new HashMap<>();
        
        // Get all departments and their names
        List<Department> departments = departmentRepository.findAll();
        for (Department dept : departments) {
            long count = userRepository.countEmployeesByDepartment(User.Role.EMPLOYEE, dept.getName());
            counts.put(dept.getId(), count);
        }
        
        return counts;
    }
}
