package com.snippetmanager.util;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class TagGenerator {

    // A simple heuristic rule to generate tags from code content
    public List<String> generateTagsFromCode(String code, String language) {
        Set<String> tags = new HashSet<>();
        if (language != null) {
            tags.add(language.toLowerCase());
        }
        
        String lowerCode = code.toLowerCase();
        
        // Very basic mock heuristic logic
        if (lowerCode.contains("class") || lowerCode.contains("interface")) tags.add("oop");
        if (lowerCode.contains("function") || lowerCode.contains("=>")) tags.add("function");
        if (lowerCode.contains("fetch") || lowerCode.contains("axios") || lowerCode.contains("http")) tags.add("api");
        if (lowerCode.contains("react") || lowerCode.contains("useState")) tags.add("react");
        if (lowerCode.contains("auth") || lowerCode.contains("jwt") || lowerCode.contains("token")) tags.add("security");
        
        return Arrays.asList(tags.toArray(new String[0]));
    }
}
