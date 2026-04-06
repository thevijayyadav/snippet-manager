c# 🚀 Collaborative Code Snippet Manager (CCSM)

An industrial-grade, full-stack ecosystem designed for developers to **store, search, manage, analyze, and share** code snippets with AI-powered intelligence and seamless team collaboration.

---

## ✨ Premium Features

### 🔐 Security & Identity
- **JWT-Based Authentication**: Secure stateless authentication using JSON Web Tokens.
- **Strong Encryption**: Argon2/BCrypt hashing for user passwords.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `USER` and `ADMIN` roles.

### 🧠 Intelligence Hub
- **AI Logic Synthesis**: Explains complex code structures instantly.
- **Duplicate Detection**: Real-time analysis to prevent redundant code.
- **Multi-Language Support**: Syntax highlighting for dozens of programming languages.

### 🤝 Team Collaboration
- **Team Vaults**: Create organizations and share proprietary snippets.
- **Live Preview**: Instant visual rendering for HTML/CSS/JS.
- **Developer Feedback**: Rating and review system for peer code valuation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---:|:---|
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Java 17, Spring Boot 3, Spring Security |
| **Database** | MongoDB (NoSQL) |
| **Auth** | JWT (JSON Web Tokens) |

---

## ⚙️ Full Project Setup Guide

Follow these steps to get the project running locally with a live MongoDB database.

### 1️⃣ Database Setup (MongoDB)
You need a running MongoDB instance. You can use **MongoDB Community Edition** (local) or **MongoDB Atlas** (cloud).

#### Option A: Local MongoDB
1.  **Download & Install**: [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2.  **Start Service**: Ensure the MongoDB service is running (default port `27017`).
3.  **Default URI**: The project is pre-configured to use `mongodb://localhost:27017/snippet-manager`.

#### Option B: MongoDB Atlas (Cloud)
1.  Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Get your Connection String.
3.  Update `backend/src/main/resources/application.properties`:
    ```properties
    spring.data.mongodb.uri=your_mongodb_atlas_connection_string
    ```

### 2️⃣ Backend Execution (Spring Boot)
Ensure you have **Java 17** and **Maven** installed.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies and build:
    ```bash
    mvn clean install
    ```
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    *The API will be available at `http://localhost:8080`.*

### 3️⃣ Frontend Execution (React + Vite)
Ensure you have **Node.js (v18+)** installed.

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The dashboard will be available at `http://localhost:5173`.*

---

## 🔐 Authentication Workflow

To use the application, you must follow these steps:

1.  **Registration**: 
    - Go to `/register` in your browser.
    - Fill in your Full Name, Username, Email, and Password.
    - *Note: Creating a user with the username `admin` will automatically grant Administrator privileges.*
2.  **Login**:
    - After registration, you will be redirected to the Dashboard (or go to `/login`).
    - Use your credentials to log in.
    - Upon success, a JWT token is stored in your `localStorage`, and all subsequent API calls will be authenticated.

---

## 📂 Project Structure

```bash
snippet-manager/
├── frontend/                     # React Application
│   ├── src/services/api.js       # Axios Configuration (CORS & BaseURL)
│   ├── src/pages/                # Login, Register, Dashboard, etc.
│   └── src/context/              # Auth & Theme State
├── backend/                      # Spring Boot API
│   ├── src/main/java/com/        # Java Source Code
│   │   ├── config/               # Security & JWT Logic
│   │   ├── controller/           # REST Controllers
│   │   └── model/                # MongoDB Documents (User, Snippet)
└── database/                     # Schema design and sample data
```

---

## 🛠️ Troubleshooting

-   **CORS Issues**: Ensure the frontend is running on `localhost:5173`. The backend `SecurityConfig.java` is pre-configured to trust this origin.
-   **MongoDB Connection Failed**: Double-check that your MongoDB service is running or your Atlas URI is correct.
-   **JWT Secret**: For production, change the `jwt.secret` in `application.properties` to a unique 64-character hex string.

---

## 📜 License
Distributed under the **MIT License**.

Built with ❤️ by **Antigravity AI**.

