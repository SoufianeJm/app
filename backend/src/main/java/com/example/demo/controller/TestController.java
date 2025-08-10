package com.example.demo.controller;

import com.example.demo.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {
    
    @GetMapping("/protected")
    public ResponseEntity<String> protectedEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok("Hello " + user.getEmail() + "! This is a protected endpoint.");
    }
    
    @GetMapping("/user-info")
    public ResponseEntity<User> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).build();
        }
        User user = (User) authentication.getPrincipal();
        // Remove password from response for security
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
