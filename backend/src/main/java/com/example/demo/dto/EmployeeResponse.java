package com.example.demo.dto;

import com.example.demo.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    
    private Long id;
    private String name;
    private String firstName;
    private String lastName;
    private String position;
    private String email;
    private String department;
    private Boolean isActive;
    private String avatarUrl;
    private String phoneNumber;
    private LocalDateTime hireDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private User.Role role;
    private String profile;
    
    public static EmployeeResponse fromUser(User user) {
        return new EmployeeResponse(
            user.getId(),
            user.getFullName(),
            user.getFirstName(),
            user.getLastName(),
            user.getPosition(),
            user.getEmail(),
            user.getDepartment(),
            user.getIsActive(),
            user.getDefaultAvatarUrl(),
            user.getPhoneNumber(),
            user.getHireDate(),
            user.getCreatedAt(),
            user.getUpdatedAt(),
            user.getRole(),
            user.getProfile()
        );
    }
}
