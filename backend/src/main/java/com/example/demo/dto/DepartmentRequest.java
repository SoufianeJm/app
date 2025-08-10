package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentRequest {
    
    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Department name must not exceed 100 characters")
    private String name;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    private Long managerId; // ID of the employee who manages this department
    
    private BigDecimal budget;
    
    @Size(max = 200, message = "Location must not exceed 200 characters")
    private String location;
    
    private String establishedDate; // Accept as string (YYYY-MM-DD format)
    
    @Size(max = 50, message = "Icon color must not exceed 50 characters")
    private String iconColor;
    
    private Boolean isActive;
}
