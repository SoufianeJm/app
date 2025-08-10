package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

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
        
        // Create sample employees if none exist
        // Temporarily disabled due to database schema issue
        /*
        if (!userRepository.existsByRole(User.Role.EMPLOYEE)) {
            log.info("No employees found. Creating sample employees...");
            createSampleEmployees();
        } else {
            log.info("Employees already exist. Skipping sample creation.");
        }
        */
        log.info("Sample employee creation temporarily disabled.");
        
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
    
    private void createSampleEmployees() {
        log.info("Creating sample employees...");
        
        User[] sampleEmployees = {
            createEmployee("Anna", "Smith", "Software Engineer", "anna.smith@company.com", 
                          "Engineering", true, "https://i.pravatar.cc/40?img=5", 
                          "+1-555-0101", LocalDateTime.now().minusMonths(6), 
                          "Experienced software engineer with expertise in Java and Spring framework."),
            
            createEmployee("John", "Doe", "Product Manager", "john.doe@company.com", 
                          "Product", true, "https://i.pravatar.cc/40?img=6", 
                          "+1-555-0102", LocalDateTime.now().minusMonths(12),
                          "Product manager with 5+ years of experience in agile development."),
            
            createEmployee("Sarah", "Wilson", "UX Designer", "sarah.wilson@company.com", 
                          "Design", true, "https://i.pravatar.cc/40?img=7", 
                          "+1-555-0103", LocalDateTime.now().minusMonths(8),
                          "Creative UX designer passionate about user-centered design principles."),
            
            createEmployee("Michael", "Johnson", "DevOps Engineer", "michael.johnson@company.com", 
                          "Engineering", true, "https://i.pravatar.cc/40?img=8", 
                          "+1-555-0104", LocalDateTime.now().minusMonths(18),
                          "DevOps engineer specializing in cloud infrastructure and CI/CD pipelines."),
            
            createEmployee("Emily", "Davis", "HR Manager", "emily.davis@company.com", 
                          "Human Resources", true, "https://i.pravatar.cc/40?img=9", 
                          "+1-555-0105", LocalDateTime.now().minusMonths(24),
                          "HR manager focused on employee development and organizational culture."),
            
            createEmployee("David", "Brown", "Marketing Specialist", "david.brown@company.com", 
                          "Marketing", true, "https://i.pravatar.cc/40?img=10", 
                          "+1-555-0106", LocalDateTime.now().minusMonths(3),
                          "Marketing specialist with expertise in digital marketing and brand strategy."),
            
            createEmployee("Lisa", "Garcia", "Financial Analyst", "lisa.garcia@company.com", 
                          "Finance", false, "https://i.pravatar.cc/40?img=11", 
                          "+1-555-0107", LocalDateTime.now().minusMonths(15),
                          "Financial analyst currently on leave, specializing in budget analysis and forecasting.")
        };
        
        for (User employee : sampleEmployees) {
            if (!userRepository.existsByEmail(employee.getEmail())) {
                userRepository.save(employee);
                log.info("Created employee: {} - {}", employee.getFullName(), employee.getEmail());
            }
        }
        
        log.info("Sample employees created successfully.");
    }
    
    private User createEmployee(String firstName, String lastName, String position, String email, String department, 
                               Boolean isActive, String avatarUrl, String phone, LocalDateTime hireDate, String profile) {
        User employee = new User();
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setPosition(position);
        employee.setEmail(email);
        employee.setDepartment(department);
        employee.setRole(User.Role.EMPLOYEE);
        employee.setIsActive(isActive);
        employee.setAvatarUrl(avatarUrl);
        employee.setPhoneNumber(phone);
        employee.setHireDate(hireDate);
        employee.setProfile(profile);
        employee.setPassword(passwordEncoder.encode("employee123")); // Default password
        return employee;
    }
}
