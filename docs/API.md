# API Documentation

## Auth Endpoints
- `POST /api/auth/register` : Create a new user. Expects $\{username, email, password\}$.
- `POST /api/auth/login` : Authenticate. Expects $\{username, password\}$. Returns JWT `token` and `user` object.

## Snippet Endpoints
*Requirements: Must send `Authorization: Bearer <token>` in headers for all these endpoints.*

- `GET /api/snippets` : Returns list of snippets. Can append `?search=xyz`.
- `GET /api/snippets/{id}` : Retrieves snippet globally or throws 404 if private.
- `POST /api/snippets` : Create snippet mapping body securely to Token.
- `PUT /api/snippets/{id}` : Update snippet. Ensures Auth ID matches Snippet Author.
- `DELETE /api/snippets/{id}` : Delete snippet if user owns it.

## User Endpoints
- `GET /api/users/{id}` : Returns safe user profile config.
