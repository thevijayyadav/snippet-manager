# Collaborative Code Snippet Manager - Architecture

## Frontend (`/frontend`)
Built using Vite + React.js to achieve extremely fast HMR (Hot Module Replacement) and optimized build chunks. Uses Framer Motion for premium aesthetics and Lucide icons for scalable lightweight rendering. Auth states mapped inside `AuthContext`.

## Backend (`/backend`)
Java Spring Boot 3 architecture utilizing:
- **Controllers:** Handle HTTP abstractions safely.
- **Security:** Layered stateless Authentication mapped entirely by Java Web Tokens (JWT) ensuring the backend relies purely on signature validations. 
- **Services:** All business logic (tag automation, duplicate checking, authorization matches) is pushed out of the controllers into Spring `@Service` beans ensuring testability.
- **Database Mapping:** Spring Boot sets up MongoDB schema documents gracefully with `@Document` mapping directly into classes minimizing mapping boilerplate.
