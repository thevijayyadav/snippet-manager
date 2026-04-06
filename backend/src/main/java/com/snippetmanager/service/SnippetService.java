package com.snippetmanager.service;

import com.snippetmanager.model.Snippet;
import com.snippetmanager.model.SnippetVersion;
import com.snippetmanager.model.User;
import com.snippetmanager.repository.SnippetRepository;
import com.snippetmanager.repository.UserRepository;
import com.snippetmanager.util.DuplicateChecker;
import com.snippetmanager.util.TagGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SnippetService {

    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private UserRepository userRepository;
    

    @Autowired
    private TagGenerator tagGenerator;

    @Autowired
    private DuplicateChecker duplicateChecker;

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

    public List<Snippet> getAllSnippets(String search) {
        User currentUser = getCurrentUser();
        List<Snippet> snippets;

        if (search != null && !search.trim().isEmpty()) {
            snippets = snippetRepository.searchSnippets(search);
        } else {
            snippets = snippetRepository.findAll();
        }

        // Filter: Public OR Creator OR Team Member
        return snippets.stream()
                .filter(s -> {
                    if (!s.isPrivate()) return true;
                    if (currentUser == null) return false;
                    if (s.getAuthorId().equals(currentUser.getId())) return true;
                    if (s.getTeamId() != null) {
                        return currentUser.getTeamIds() != null && currentUser.getTeamIds().contains(s.getTeamId());
                    }
                    return false;
                })
                .collect(Collectors.toList());
    }

    public Optional<Snippet> getSnippetById(String id) {
        User currentUser = getCurrentUser();
        return snippetRepository.findById(id).filter(s -> 
            !s.isPrivate() || (currentUser != null && s.getAuthorId().equals(currentUser.getId()))
        );
    }

    public Snippet createSnippet(Snippet snippet) {
        User currentUser = getCurrentUser();
        if (currentUser == null) throw new RuntimeException("User not authenticated");

        snippet.setAuthorId(currentUser.getId());
        snippet.setAuthorUsername(currentUser.getUsername());
        snippet.setCreatedAt(LocalDateTime.now());
        snippet.setUpdatedAt(LocalDateTime.now());
        snippet.setViews(0);
        snippet.setCopyCount(0);
        snippet.setAverageRating(0);
        snippet.setVersions(new ArrayList<>());
        snippet.setLikedBy(new ArrayList<>());

        if (snippet.getTags() == null || snippet.getTags().isEmpty()) {
            snippet.setTags(tagGenerator.generateTagsFromCode(snippet.getCode(), snippet.getLanguage()));
        }

        // Basic Duplicate Check
        if (duplicateChecker.checkIsDuplicate(snippet.getCode(), snippet.getLanguage())) {
            // Warn if similar snippet already exists
        }
        
        return snippetRepository.save(snippet);
    }

    public Snippet updateSnippet(String id, Snippet snippetDetails) {
        User currentUser = getCurrentUser();
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Snippet not found"));

        if (!snippet.getAuthorId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to update this snippet");
        }

        // Save current code to version history
        if (snippet.getVersions() == null) snippet.setVersions(new ArrayList<>());
        SnippetVersion version = new SnippetVersion(
            snippet.getVersions().size() + 1, 
            snippet.getCode(), 
            "Manual Update"
        );
        snippet.getVersions().add(version);

        snippet.setTitle(snippetDetails.getTitle());
        snippet.setDescription(snippetDetails.getDescription());
        snippet.setCode(snippetDetails.getCode());
        snippet.setLanguage(snippetDetails.getLanguage());
        snippet.setTags(snippetDetails.getTags());
        snippet.setPrivate(snippetDetails.isPrivate());
        snippet.setTeamId(snippetDetails.getTeamId());
        snippet.setUpdatedAt(LocalDateTime.now());

        return snippetRepository.save(snippet);
    }

    public Snippet incrementViews(String id) {
        Snippet snippet = snippetRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        snippet.setViews(snippet.getViews() + 1);
        return snippetRepository.save(snippet);
    }

    public Snippet incrementCopyCount(String id) {
        Snippet snippet = snippetRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        snippet.setCopyCount(snippet.getCopyCount() + 1);
        return snippetRepository.save(snippet);
    }

    public void toggleFavorite(String snippetId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) throw new RuntimeException("Not authenticated");

        Snippet snippet = snippetRepository.findById(snippetId).orElseThrow(() -> new RuntimeException("Not found"));
        
        if (currentUser.getFavorites() == null) currentUser.setFavorites(new ArrayList<>());
        if (snippet.getLikedBy() == null) snippet.setLikedBy(new ArrayList<>());

        if (currentUser.getFavorites().contains(snippetId)) {
            currentUser.getFavorites().remove(snippetId);
            snippet.getLikedBy().remove(currentUser.getId());
        } else {
            currentUser.getFavorites().add(snippetId);
            snippet.getLikedBy().add(currentUser.getId());
        }
        userRepository.save(currentUser);
        snippetRepository.save(snippet);
    }

    public boolean isSnippetDuplicate(String code, String language) {
        return duplicateChecker.checkIsDuplicate(code, language);
    }

    public Snippet rollback(String snippetId, int versionNumber) {
        User currentUser = getCurrentUser();
        Snippet snippet = snippetRepository.findById(snippetId).orElseThrow(() -> new RuntimeException("Not found"));
        
        if (!snippet.getAuthorId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        SnippetVersion version = snippet.getVersions().stream()
                .filter(v -> v.getVersionNumber() == versionNumber)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Version not found"));

        // Save current state before rollback
        SnippetVersion currentV = new SnippetVersion(snippet.getVersions().size() + 1, snippet.getCode(), "Pre-rollback state");
        snippet.getVersions().add(currentV);
        
        snippet.setCode(version.getCode());
        snippet.setUpdatedAt(LocalDateTime.now());
        return snippetRepository.save(snippet);
    }

    public void deleteSnippet(String id) {
        User currentUser = getCurrentUser();
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Snippet not found"));

        if (!snippet.getAuthorId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to delete this snippet");
        }

        snippetRepository.delete(snippet);
    }
}
