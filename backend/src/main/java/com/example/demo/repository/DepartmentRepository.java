package com.example.demo.repository;

import com.example.demo.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
    // Find department by name (case insensitive)
    Optional<Department> findByNameIgnoreCase(String name);
    
    // Check if department with name exists (case insensitive)
    boolean existsByNameIgnoreCase(String name);
    
    // Find active departments
    List<Department> findByIsActiveTrue();
    
    // Find departments by manager ID
    List<Department> findByManagerId(Long managerId);
    
    // Search departments by name or description
    @Query("SELECT d FROM Department d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Department> searchDepartments(@Param("searchTerm") String searchTerm);
    
    // Find departments with employee counts
    @Query("SELECT d.id, COUNT(u.id) FROM Department d LEFT JOIN User u ON u.department = d.name " +
           "WHERE d.isActive = true GROUP BY d.id")
    List<Object[]> findDepartmentEmployeeCounts();
}
