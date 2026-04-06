package com.snippetmanager.config;

import com.snippetmanager.model.User;
import com.snippetmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setFullName("System Administrator");
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@snippetmanager.com");
            // Set the desired admin password here
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole("ADMIN");
            
            userRepository.save(adminUser);
            System.out.println("Default Admin user created successfully.");
        }
    }
}
