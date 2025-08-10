package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {
    
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;
    
    @NotBlank(message = "Position is required")
    @Size(max = 100, message = "Position must not exceed 100 characters")
    private String position;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Department is required")
    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;
    
    private Boolean isActive;
    
    private String avatarUrl;
    
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;
    
    // Accept date as string to handle frontend date picker format (YYYY-MM-DD)
    private String hireDate;
    
    @Size(max = 1000, message = "Profile must not exceed 1000 characters")
    private String profile;
    
    // Password for creating new employees (optional for updates)
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
