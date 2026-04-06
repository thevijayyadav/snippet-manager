package com.snippetmanager.controller;

import com.snippetmanager.model.Snippet;
import com.snippetmanager.service.AiService;
import com.snippetmanager.service.SnippetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {

    @Autowired
    private SnippetService snippetService;
    
    @Autowired
    private AiService aiService;

    @GetMapping
    public ResponseEntity<List<Snippet>> getAllSnippets(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(snippetService.getAllSnippets(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Snippet> getSnippetById(@PathVariable String id) {
        Snippet snippet = snippetService.getSnippetById(id).orElse(null);
        if (snippet != null) {
            snippet = snippetService.incrementViews(id);
            return ResponseEntity.ok(snippet);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/copy")
    public ResponseEntity<Snippet> copySnippet(@PathVariable String id) {
        return ResponseEntity.ok(snippetService.incrementCopyCount(id));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Void> toggleFavorite(@PathVariable String id) {
        snippetService.toggleFavorite(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/rollback/{versionNum}")
    public ResponseEntity<Snippet> rollbackSnippet(@PathVariable String id, @PathVariable int versionNum) {
        return ResponseEntity.ok(snippetService.rollback(id, versionNum));
    }

    @PostMapping("/explain")
    public ResponseEntity<Map<String, String>> explainSnippet(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String lang = payload.get("language");
        String outcome = aiService.explainCode(code, lang);
        return ResponseEntity.ok(Map.of("explanation", outcome));
    }

    @PostMapping("/check-duplicate")
    public ResponseEntity<Map<String, Boolean>> checkDuplicate(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String lang = payload.get("language");
        boolean isDup = snippetService.isSnippetDuplicate(code, lang);
        return ResponseEntity.ok(Map.of("duplicate", isDup));
    }

    @PostMapping
    public ResponseEntity<?> createSnippet(@RequestBody Snippet snippet) {
        try {
            return ResponseEntity.ok(snippetService.createSnippet(snippet));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSnippet(@PathVariable String id, @RequestBody Snippet snippet) {
        try {
            return ResponseEntity.ok(snippetService.updateSnippet(id, snippet));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSnippet(@PathVariable String id) {
        try {
            snippetService.deleteSnippet(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
