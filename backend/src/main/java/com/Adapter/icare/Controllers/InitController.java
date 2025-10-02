package com.Adapter.icare.Controllers;

import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/init")
public class InitController {

    @Autowired
    private UserService userService;

    @PostMapping("/create-test-user")
    public ResponseEntity<Map<String, Object>> createTestUser(@RequestBody Map<String, Object> userData) {
        try {
            // Create user directly for testing purposes
            User user = User.fromMap(userData);
            
            // Set default password if not provided
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                user.setPassword("TestPassword123!");
            }
            
            User createdUser = userService.createUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Test user created successfully");
            response.put("user", createdUser.toMap());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to create test user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    @PostMapping("/reset-admin-password")
    public ResponseEntity<Map<String, Object>> resetAdminPassword() {
        try {
            // Find admin user and reset password
            User adminUser = userService.getUserByUsername("admin");
            if (adminUser != null) {
                adminUser.setPassword("password123");
                userService.updateUser(adminUser.getUuid(), adminUser);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Admin password reset to 'password123'");
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "Admin user not found");
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to reset admin password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}