package com.snippetmanager.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SnippetVersion {
    private int versionNumber;
    private String code;
    private String modificationReason;
    private LocalDateTime timestamp = LocalDateTime.now();

    public SnippetVersion(int versionNumber, String code, String modificationReason) {
        this.versionNumber = versionNumber;
        this.code = code;
        this.modificationReason = modificationReason;
        this.timestamp = LocalDateTime.now();
    }

    public int getVersionNumber() { return versionNumber; }
    public void setVersionNumber(int versionNumber) { this.versionNumber = versionNumber; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getModificationReason() { return modificationReason; }
    public void setModificationReason(String modificationReason) { this.modificationReason = modificationReason; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
