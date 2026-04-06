# Workflow

1. User registers/logs in via Frontend UI.
2. Form submits to `/api/auth` which generates a securely signed JWT securely. 
3. Frontend preserves token in `localStorage`.
4. Subsequent calls inside the React App attach `Authorization: Bearer <token>`.
5. Spring `JwtFilter` rips the token out of headers, extracts subject (user), and flags SecurityContext ensuring `SnippetController` functions fire cleanly.
