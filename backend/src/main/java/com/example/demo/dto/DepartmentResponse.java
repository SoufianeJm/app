package com.example.demo.dto;

import com.example.demo.entity.Department;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {
    
    private Long id;
    private String name;
    private String description;
    private Long managerId;
    private ManagerInfo manager;
    private BigDecimal budget;
    private String location;
    private LocalDateTime establishedDate;
    private String iconColor;
    private Boolean isActive;
    private Long employeeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ManagerInfo {
        private Long id;
        private String name;
        private String email;
        private String avatarUrl;
    }
    
    public static DepartmentResponse fromDepartment(Department department) {
        DepartmentResponse response = new DepartmentResponse();
        response.setId(department.getId());
        response.setName(department.getName());
        response.setDescription(department.getDescription());
        response.setManagerId(department.getManagerId());
        response.setBudget(department.getBudget());
        response.setLocation(department.getLocation());
        response.setEstablishedDate(department.getEstablishedDate());
        response.setIconColor(department.getIconColor());
        response.setIsActive(department.getIsActive());
        response.setEmployeeCount(department.getEmployeeCount());
        response.setCreatedAt(department.getCreatedAt());
        response.setUpdatedAt(department.getUpdatedAt());
        
        // Map manager info if available
        if (department.getManager() != null) {
            ManagerInfo managerInfo = new ManagerInfo();
            managerInfo.setId(department.getManager().getId());
            managerInfo.setName(department.getManager().getFullName());
            managerInfo.setEmail(department.getManager().getEmail());
            managerInfo.setAvatarUrl(department.getManager().getDefaultAvatarUrl());
            response.setManager(managerInfo);
        }
        
        return response;
    }
}
