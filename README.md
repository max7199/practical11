# Task Manager — Full Stack MERN Application

A full-stack Task Management application featuring user authentication, MongoDB persistence, in-memory caching, event-driven background processing, and a responsive React frontend with lazy-loaded routes and visual analytics.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Event-Driven Architecture & Caching](#event-driven-architecture--caching)

---

## Tech Stack

### Backend
- **Node.js** & **Express 5** — RESTful API framework
- **MongoDB** & **Mongoose** — Database and ODM with schema validation & hooks
- **JSON Web Tokens (JWT)** & **bcryptjs** — Secure stateless authentication and password hashing
- **NodeCache** — In-memory caching layer with TTL and automatic cache invalidation
- **EventEmitter** — Decoupled event-driven background notification pipeline
- **CORS** & **dotenv** — Cross-origin resource sharing and environment management

### Frontend
- **React 19** & **Vite** — High-performance frontend UI library and build tool
- **React Router DOM 7** — Client-side multi-page routing
- **Recharts** — Responsive charting for task status visualization
- **Vanilla CSS** — Custom styling with responsive cards, forms, and badges

---

## Architecture

```text
┌────────────────────────────────────────────────────────┐
│             React Frontend (localhost:5173)            │
│  - Routes: Dashboard (/), Projects (/projects), etc.   │
│  - Lazy loading (React.lazy + Suspense) & Recharts     │
│  - JWT stored in localStorage                          │
└──────────────────────────┬─────────────────────────────┘
                           │ fetch / JSON
                           │ Authorization: Bearer <token>
                           v
┌────────────────────────────────────────────────────────┐
│             Express Backend (localhost:3000)           │
│  Middleware Pipeline:                                  │
│   ├── CORS & Content-Type Validator                    │
│   ├── Request Logger & express.json()                  │
│   ├── Auth Middleware (JWT Verification)               │
│   └── Route & ObjectId Validators                      │
├──────────────────────────┬─────────────────────────────┤
│                          │                             │
│   In-Memory Cache        │ Database Access             │ Background Events
│  (node-cache, TTL 60s)   │ (Mongoose ODM)              │ (Node.js EventEmitter)
│   ├── Hits/Misses Stats  │   └── MongoDB Atlas         │   ├── 'task-created'
│   └── Invalidation on    │       (Users & Tasks)       │   ├── 'task-deleted'
│       mutations          │                             │   └── 'error'
└──────────────────────────┴─────────────────────────────┴────────────────────────┘
```

---

## Features

- **User Authentication & Authorization**:
  - User registration and login with bcrypt password hashing (salt rounds: 10).
  - JWT stateless session token generation (1-hour expiration).
  - Protected endpoints requiring `Bearer <token>` in the `Authorization` header.
  - Automatic frontend session handling and logout on `401 Unauthorized` responses.
  - User-isolated data: each user only accesses and manages their own tasks.

- **Task Management (CRUD)**:
  - Create tasks with title, optional description, and priority level (`low`, `medium`, `high`).
  - Read all tasks or inspect specific tasks by ID.
  - Toggle task completion status (`completed: true / false`).
  - Delete tasks with client-side confirmation prompt.
  - Schema pre-save hooks to automatically sanitize and trim inputs.

- **Performance & In-Memory Caching**:
  - `node-cache` integration with 60-second default TTL for `GET /tasks` and `GET /tasks/:id`.
  - Automatic cache invalidation when tasks are created, updated, or deleted.
  - Cache telemetry endpoint (`GET /debug/cache-stats`) tracking cache hits and misses.

- **Event-Driven Asynchronous Processing**:
  - Node.js `EventEmitter` pattern (`events.js` and `listeners.js`) decoupling background tasks from the request/response lifecycle.
  - Listeners for `task-created` and `task-deleted` events for asynchronous notifications.
  - Graceful event error handling and error event listeners.

- **Frontend Navigation & Code Splitting**:
  - Multi-page routing via React Router:
    - `/` — **Dashboard**: Task creation form, task cards, filter stats, and actions.
    - `/projects` — **Projects**: Analytics dashboard with dynamically loaded status chart.
    - `/contact` — **Contact**: Support contact form.
  - Route-level and component-level code splitting using `React.lazy` and `Suspense` (`HeavyChart.jsx`).

---

## Project Structure

```text
task-manager-api-24IT091/
├── .env                  # Environment configuration (ignored in git)
├── .gitignore            # Git ignore file
├── events.js             # EventEmitter instance for task lifecycle
├── listeners.js          # Event listeners (task-created, task-deleted, error)
├── models/
│   ├── Task.js           # Task schema (title, description, priority, completed, user ref)
│   └── User.js           # User schema (email, hashed password, timestamps)
├── package.json          # Backend dependencies and scripts
├── server.js             # Express application entry point & API route handlers
└── client/               # Frontend React application (Vite)
    ├── index.html        # HTML entry point
    ├── package.json      # Frontend dependencies and scripts
    ├── vite.config.js    # Vite configuration
    └── src/
        ├── App.css       # Application stylesheet
        ├── App.jsx       # Root component, routing, and auth state management
        ├── api.js        # API client for backend communication
        ├── main.jsx      # React entry point with BrowserRouter
        ├── components/
        │   ├── Auth.jsx        # Login & Registration component
        │   ├── HeavyChart.jsx  # Recharts status bar chart (lazy loaded)
        │   ├── TaskForm.jsx    # New task creation form
        │   └── TaskItem.jsx    # Task list item with inline status toggle & delete
        └── pages/
            ├── Contact.jsx     # Contact support page
            ├── Dashboard.jsx   # Main task management dashboard
            └── Projects.jsx    # Project analytics page
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskdb
JWT_SECRET=your_jwt_secret_key_here
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port for the Express backend server | `3000` |
| `MONGO_URI` | MongoDB connection URI (Atlas or local instance) | `mongodb://localhost:27017/taskdb` |
| `JWT_SECRET` | Secret key used for signing and verifying JSON Web Tokens | *Required* |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- Active MongoDB Atlas cluster or local MongoDB instance

### Installation

1. **Clone the repository and install backend dependencies:**

   ```bash
   cd task-manager-api-24IT091
   npm install
   ```

2. **Install frontend dependencies:**

   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Configure Environment Variables:**
   Ensure the `.env` file exists in the root directory with valid `MONGO_URI` and `JWT_SECRET` values.

### Running the App

#### 1. Backend (Express API) — Terminal 1

```bash
cd task-manager-api-24IT091
npm start
```
Runs on **http://localhost:3000**

#### 2. Frontend (React + Vite) — Terminal 2

```bash
cd task-manager-api-24IT091/client
npm run dev
```
Runs on **http://localhost:5173**

---

## API Endpoints

All task routes require the `Authorization: Bearer <token>` header obtained from logging in.

### Authentication Routes

| Method | Endpoint | Access | Body / Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | `{ "email": "user@example.com", "password": "password123" }` — Registers a new user |
| `POST` | `/login` | Public | `{ "email": "user@example.com", "password": "password123" }` — Authenticates user and returns JWT |
| `GET` | `/me` | Protected | Returns the authenticated user's profile (excluding password) |

### Task Routes

| Method | Endpoint | Access | Body / Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Protected | Returns all tasks belonging to the authenticated user (cached) |
| `GET` | `/tasks/:id` | Protected | Returns a specific task by its ObjectId (cached) |
| `POST` | `/tasks` | Protected | `{ "title": "Task Title", "description": "...", "priority": "medium" }` — Creates a new task |
| `PUT` | `/tasks/:id` | Protected | `{ "title": "...", "completed": true, "priority": "high" }` — Updates a task |
| `DELETE` | `/tasks/:id` | Protected | Deletes a task by ID and invalidates cache |

### Debug & Monitoring Routes

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/debug/cache-stats` | Public | Returns in-memory cache statistics: `{ "hits": number, "misses": number }` |

---

## Event-Driven Architecture & Caching

- **NodeCache**:
  - Queries (`GET /tasks`, `GET /tasks/:id`) are cached with a 60-second TTL keyed by user ID and task ID.
  - Write operations (`POST`, `PUT`, `DELETE`) automatically evict corresponding cache keys to ensure data consistency.
  - Cache performance can be inspected live via `GET /debug/cache-stats`.

- **Event Emitter Pipeline**:
  - Whenever a task is created or deleted, an event (`task-created` or `task-deleted`) is emitted asynchronously without blocking the client HTTP response.
  - Listeners registered in `listeners.js` simulate asynchronous notification logging and error handling.

