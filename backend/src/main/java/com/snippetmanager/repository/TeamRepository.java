package com.snippetmanager.repository;

import com.snippetmanager.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TeamRepository extends MongoRepository<Team, String> {
    List<Team> findByMemberIdsContaining(String userId);
    List<Team> findByCreatorId(String creatorId);
}
