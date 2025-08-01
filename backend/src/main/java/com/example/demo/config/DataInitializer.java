package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeDatabase();
    }

    private void initializeDatabase() {
        log.info("Starting database initialization...");
        
        // Only create admin user if no admin exists
        if (!userRepository.existsByRole(User.Role.ADMIN)) {
            log.info("No admin user found. Creating admin user...");
            createAdminUser();
        } else {
            log.info("Admin user already exists. Skipping creation.");
        }
        
        log.info("Database initialization completed.");
    }

    private void createAdminUser() {
        log.info("Creating admin user...");
        
        User adminUser = new User();
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setFirstName("System");
        adminUser.setLastName("Administrator");
        adminUser.setRole(User.Role.ADMIN);
        adminUser.setIsActive(true);
        
        userRepository.save(adminUser);
        
        log.info("Admin user created successfully:");
        log.info("Email: admin@example.com");
        log.info("Password: admin123");
        log.info("Role: ADMIN");
    }
}
