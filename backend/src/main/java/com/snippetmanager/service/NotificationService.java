package com.snippetmanager.service;

import com.snippetmanager.model.Notification;
import com.snippetmanager.model.User;
import com.snippetmanager.repository.NotificationRepository;
import com.snippetmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username).orElse(null);
    }

    public List<Notification> getMyNotifications() {
        User currentUser = getCurrentUser();
        if (currentUser == null) return new ArrayList<>();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    public void markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void createNotification(String userId, String title, String message, String type, String relatedId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedId(relatedId);
        notificationRepository.save(notification);
    }
}
