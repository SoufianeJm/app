package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.DepartmentRequest;
import com.example.demo.dto.DepartmentResponse;
import com.example.demo.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000"})
public class DepartmentController {
    
    private final DepartmentService departmentService;
    
    /**
     * Get all departments
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAllDepartments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {
        
        try {
            List<DepartmentResponse> departments;
            
            if (search != null && !search.trim().isEmpty()) {
                departments = departmentService.searchDepartments(search);
            } else {
                // If pagination is needed (page > 0 or size != 50)
                if (page > 0 || size != 50) {
                    Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? 
                        Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
                    Pageable pageable = PageRequest.of(page, size, sort);
                    
                    Page<DepartmentResponse> departmentPage = departmentService.getAllDepartments(pageable);
                    
                    return ResponseEntity.ok(ApiResponse.success(
                        departmentPage.getContent(),
                        "Departments retrieved successfully",
                        createPaginationMeta(departmentPage)
                    ));
                } else {
                    departments = departmentService.getAllDepartments();
                }
            }
            
            return ResponseEntity.ok(ApiResponse.success(
                departments, 
                "Departments retrieved successfully"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Failed to retrieve departments: " + e.getMessage())
            );
        }
    }
    
    /**
     * Get department by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartmentById(@PathVariable Long id) {
        try {
            DepartmentResponse department = departmentService.getDepartmentById(id);
            return ResponseEntity.ok(ApiResponse.success(department, "Department retrieved successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Failed to retrieve department: " + e.getMessage())
            );
        }
    }
    
    /**
     * Create new department
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> createDepartment(
            @Valid @RequestBody DepartmentRequest request) {
        
        try {
            DepartmentResponse createdDepartment = departmentService.createDepartment(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdDepartment, "Department created successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error(e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create department: " + e.getMessage()));
        }
    }
    
    /**
     * Update existing department
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {
        
        try {
            DepartmentResponse updatedDepartment = departmentService.updateDepartment(id, request);
            return ResponseEntity.ok(ApiResponse.success(updatedDepartment, "Department updated successfully"));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error(e.getMessage()));
            }
            return ResponseEntity.badRequest().body(
                ApiResponse.error(e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update department: " + e.getMessage()));
        }
    }
    
    /**
     * Delete department (soft delete)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteDepartment(@PathVariable Long id) {
        try {
            departmentService.deleteDepartment(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Department deleted successfully"));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error(e.getMessage()));
            }
            return ResponseEntity.badRequest().body(
                ApiResponse.error(e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete department: " + e.getMessage()));
        }
    }
    
    /**
     * Get departments managed by a specific employee
     */
    @GetMapping("/manager/{managerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or #managerId == authentication.principal.id")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getDepartmentsByManager(
            @PathVariable Long managerId) {
        
        try {
            List<DepartmentResponse> departments = departmentService.getDepartmentsByManager(managerId);
            return ResponseEntity.ok(ApiResponse.success(
                departments, 
                "Departments managed by employee retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Failed to retrieve departments by manager: " + e.getMessage())
            );
        }
    }
    
    /**
     * Helper method to create pagination metadata
     */
    private Object createPaginationMeta(Page<DepartmentResponse> page) {
        return new Object() {
            public final int currentPage = page.getNumber();
            public final int totalPages = page.getTotalPages();
            public final long totalElements = page.getTotalElements();
            public final int size = page.getSize();
            public final boolean hasNext = page.hasNext();
            public final boolean hasPrevious = page.hasPrevious();
        };
    }
}
