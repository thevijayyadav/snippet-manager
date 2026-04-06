package com.snippetmanager.repository;

import com.snippetmanager.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findBySnippetId(String snippetId);
}
