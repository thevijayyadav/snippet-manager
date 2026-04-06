package com.snippetmanager.service;

import com.snippetmanager.model.Review;
import com.snippetmanager.model.Snippet;
import com.snippetmanager.model.User;
import com.snippetmanager.repository.ReviewRepository;
import com.snippetmanager.repository.SnippetRepository;
import com.snippetmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private SnippetRepository snippetRepository;

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

    public Review addReview(Review review) {
        User currentUser = getCurrentUser();
        if (currentUser == null) throw new RuntimeException("Not authenticated");

        review.setReviewerId(currentUser.getId());
        review.setReviewerUsername(currentUser.getUsername());
        Review savedReview = reviewRepository.save(review);

        // Update Snippet Average Rating
        Snippet snippet = snippetRepository.findById(review.getSnippetId())
                .orElseThrow(() -> new RuntimeException("Snippet not found"));
        
        List<Review> reviews = reviewRepository.findBySnippetId(snippet.getId());
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        snippet.setAverageRating(avg);
        snippetRepository.save(snippet);

        return savedReview;
    }

    public List<Review> getReviewsBySnippet(String snippetId) {
        return reviewRepository.findBySnippetId(snippetId);
    }
}
