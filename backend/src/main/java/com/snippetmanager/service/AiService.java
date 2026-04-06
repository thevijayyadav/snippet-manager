package com.snippetmanager.service;

import org.springframework.stereotype.Service;

@Service
public class AiService {

    public String explainCode(String code, String language) {
        // A mock AI explanation service
        StringBuilder explanation = new StringBuilder();
        explanation.append("This is an analysis of a ").append(language).append(" code snippet.\n\n");
        
        if (code.contains("class")) {
            explanation.append("- The code defines a class structure, which is a blueprint for objects.\n");
        }
        if (code.contains("function") || code.contains("=>")) {
            explanation.append("- It contains operations defined within functions for execution.\n");
        }
        if (code.contains("import") || code.contains("require")) {
            explanation.append("- External dependencies are imported for additional functionality.\n");
        }
        if (code.contains("try") && code.contains("catch")) {
            explanation.append("- The code includes error handling logic using try-catch blocks.\n");
        }
        
        explanation.append("\nOverall, this snippet seems performant and follows standard coding conventions.");
        
        return explanation.toString();
    }
}
