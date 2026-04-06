package com.snippetmanager.controller;

import com.snippetmanager.model.Review;
import com.snippetmanager.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    @GetMapping("/snippet/{snippetId}")
    public ResponseEntity<List<Review>> getReviewsBySnippet(@PathVariable String snippetId) {
        return ResponseEntity.ok(reviewService.getReviewsBySnippet(snippetId));
    }
}
