package com.example.demo.controller;

import com.example.demo.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:3000")
public class RoleController {
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> adminEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to the Admin Dashboard!");
        response.put("user", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("permissions", new String[]{"READ", "WRITE", "DELETE", "MANAGE_USERS"});
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> employerEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to the Employer Dashboard!");
        response.put("user", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("permissions", new String[]{"READ", "WRITE", "MANAGE_JOBS"});
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/manager")
    @PreAuthorize("hasRole('MANAGER') or hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> managerEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to the Manager Dashboard!");
        response.put("user", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("permissions", new String[]{"READ", "WRITE", "MANAGE_TEAM"});
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check-permissions")
    public ResponseEntity<Map<String, Object>> checkPermissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        Map<String, Object> response = new HashMap<>();
        response.put("role", user.getRole().name());
        
        // Define role-based permissions
        Map<String, Boolean> permissions = new HashMap<>();
        User.Role role = user.getRole();
        
        switch (role) {
            case ADMIN:
                permissions.put("canAccessAdmin", true);
                permissions.put("canAccessEmployer", true);
                permissions.put("canAccessManager", true);
                permissions.put("canManageUsers", true);
                permissions.put("canManageJobs", true);
                permissions.put("canManageTeam", true);
                break;
            case EMPLOYER:
                permissions.put("canAccessAdmin", false);
                permissions.put("canAccessEmployer", true);
                permissions.put("canAccessManager", true);
                permissions.put("canManageUsers", false);
                permissions.put("canManageJobs", true);
                permissions.put("canManageTeam", false);
                break;
            case MANAGER:
                permissions.put("canAccessAdmin", false);
                permissions.put("canAccessEmployer", false);
                permissions.put("canAccessManager", true);
                permissions.put("canManageUsers", false);
                permissions.put("canManageJobs", false);
                permissions.put("canManageTeam", true);
                break;
        }
        
        response.put("permissions", permissions);
        return ResponseEntity.ok(response);
    }
}
