package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Department name must not exceed 100 characters")
    private String name;
    
    @Column(columnDefinition = "TEXT")
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @Column(name = "manager_id")
    private Long managerId; // Reference to User (Employee) who manages this department
    
    @Column(name = "budget")
    private BigDecimal budget;
    
    @Column(name = "location")
    @Size(max = 200, message = "Location must not exceed 200 characters")
    private String location;
    
    @Column(name = "established_date")
    private LocalDateTime establishedDate;
    
    @Column(name = "icon_color")
    @Size(max = 50, message = "Icon color must not exceed 50 characters")
    private String iconColor; // For frontend styling (e.g., "bg-blue-500")
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Transient field to hold employee count (calculated)
    @Transient
    private Long employeeCount = 0L;
    
    // Transient field to hold manager info (populated from User entity)
    @Transient
    private User manager;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (establishedDate == null) {
            establishedDate = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
