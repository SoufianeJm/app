package com.example.demo.repository;

import com.example.demo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<Employee> findByDepartment(String department);
    
    List<Employee> findByStatus(Employee.Status status);
    
    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.position) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.department) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Employee> searchEmployees(@Param("search") String search);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department = :department")
    Long countByDepartment(@Param("department") String department);
    
    @Query("SELECT DISTINCT e.department FROM Employee e ORDER BY e.department")
    List<String> findAllDepartments();
}
