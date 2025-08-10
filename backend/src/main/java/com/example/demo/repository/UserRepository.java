package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    boolean existsByRole(User.Role role);
    
    // Employee-specific queries
    List<User> findByRole(User.Role role);
    
    List<User> findByDepartment(String department);
    
    List<User> findByRoleAndIsActive(User.Role role, Boolean isActive);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND (" +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.position) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.department) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<User> searchEmployees(@Param("role") User.Role role, @Param("search") String search);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.department = :department")
    Long countEmployeesByDepartment(@Param("role") User.Role role, @Param("department") String department);
    
    @Query("SELECT DISTINCT u.department FROM User u WHERE u.role = :role AND u.department IS NOT NULL ORDER BY u.department")
    List<String> findEmployeeDepartments(@Param("role") User.Role role);
}
