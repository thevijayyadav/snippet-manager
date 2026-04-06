package com.snippetmanager.repository;

import com.snippetmanager.model.Snippet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SnippetRepository extends MongoRepository<Snippet, String> {
    List<Snippet> findByAuthorId(String authorId);
    
    // Search by title or tags (regex match on title, or exact tag)
    @Query("{$or: [{title: {$regex: ?0, $options: 'i'}}, {tags: {$in: [?0]}}]}")
    List<Snippet> searchSnippets(String query);
}
