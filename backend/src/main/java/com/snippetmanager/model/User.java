package com.snippetmanager.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    private String fullName;
    private String username;
    private String email;
    private String password;
    private String role; // "USER" or "ADMIN"
    private List<String> favorites; // List of snippet IDs
    private List<String> teamIds; // List of team IDs
    
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public List<String> getFavorites() { return favorites; }
    public void setFavorites(List<String> favorites) { this.favorites = favorites; }
    
    public List<String> getTeamIds() { return teamIds; }
    public void setTeamIds(List<String> teamIds) { this.teamIds = teamIds; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
