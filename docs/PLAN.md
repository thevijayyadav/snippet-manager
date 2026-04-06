# Implementation Plan - Collaborative Code Snippet Manager

The project aims to build a full-stack code snippet manager with smart features like AI explanations, duplicate detection, and team collaboration.

## 🏗️ Architecture
- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
- **Backend**: Java Spring Boot + MongoDB + Spring Security (JWT)
- **Database**: MongoDB

## 🔧 Backend Tasks
### 1. Enhanced Models & Repositories
- [ ] **Snippet Model Updates**: Add fields for Version Control (`versions` as a list of history objects), `ratings`, `copyCount`, `teamId`.
- [ ] **Review Model**: Create model for user reviews (1-5 stars, comments).
- [ ] **Team Model**: Create model for team collaboration (users, snippets).
- [ ] **Notification Model**: Create model for user notifications.
- [ ] **User Model**: Add `favorites` list (snippet IDs).

### 2. Smart Logic Implementation
- [ ] **AI-Powered Logic**: Mocked AI code explanation service.
- [ ] **Duplicate Checker**: Improve current logic (e.g., using Jaccard Similarity or basic hashing).
- [ ] **Tag Generator**: Refine heuristic logic or integrate with a simple keyword extractor.
- [ ] **Version Control Service**: Logic to save current state to history and rollback.

### 3. API Endpoints
- [ ] **Auth**: Login, Register (JWT).
- [ ] **Snippets**: CRUD, search by tags/language, favorites management, copy count update.
- [ ] **Teams**: CRUD, share snippets with teams.
- [ ] **Analytics**: Popular snippets, views/copies tracking.
- [ ] **Notifications**: Fetch for user, mark as read.

## 🎨 Frontend Tasks
### 1. State Management & Auth
- [ ] **AuthContext**: Integrate JWT-based login/logout.
- [ ] **ThemeContext**: Implement Dark/Light mode toggle.
- [ ] **LanguageContext**: (Optional) For internationalization if needed.

### 2. Core Components
- [ ] **Navbar & Sidebar**: Navigation and theme switcher.
- [ ] **SnippetCard**: Display snippet with metadata, ratings, and actions.
- [ ] **Editor**: Modern code editor with live preview (HTML/JS).
- [ ] **Review Section**: UI for adding and viewing reviews.
- [ ] **Collaboration UI**: Modal to share snippets with teams.

### 3. Pages
- [ ] **Dashboard**: User's snippet feed, analytics charts.
- [ ] **Snippet Detail**: View snippet, explanation button, rating/review section, version history.
- [ ] **Add/Edit Snippet**: Modal/Separate page for snippet creation with auto-tagging.
- [ ] **Smart Search**: Filterable result list.
- [ ] **Favorites**: List of bookmarked snippets.

## 🚀 Execution Strategy
1. **Phase 1: Backend Foundation**: Update models, repositories, and implement basic CRUD + JWT.
2. **Phase 2: Frontend Foundation**: Setup AuthContext, ThemeProvider, and basic routing.
3. **Phase 3: Smart Features**: Integrate TagGenerator, DuplicateChecker, and Mock AI Explanation.
4. **Phase 4: Collaboration & Analytics**: Implement Teams, reviews, and tracking logic.
5. **Phase 5: Polishing**: Framer Motion animations, Dark mode styling, and final bug fixes.

---
**Current Status**: 
- Initial structure found in `backend` and `frontend`.
- Basic models and services exist but need enhancement to fulfill all requirements.
