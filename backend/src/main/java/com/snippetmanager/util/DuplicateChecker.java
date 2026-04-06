package com.snippetmanager.util;

import com.snippetmanager.model.Snippet;
import com.snippetmanager.repository.SnippetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DuplicateChecker {

    @Autowired
    private SnippetRepository snippetRepository;

    // Checks if a functionally identical snippet exists
    // Advanced implementations could use AST, Levenshtein distance, or hashing. 
    // This is a simplified structural match.
    public boolean checkIsDuplicate(String code, String language) {
        String strippedCode = code.replaceAll("\\s+", "");
        
        List<Snippet> allSnippets = snippetRepository.findAll();
        for (Snippet s : allSnippets) {
            if (s.getLanguage() != null && s.getLanguage().equalsIgnoreCase(language)) {
                String existingStripped = s.getCode().replaceAll("\\s+", "");
                if (strippedCode.equals(existingStripped)) {
                    return true;
                }
            }
        }
        return false;
    }
}
