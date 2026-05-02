# TaskBoard Backend

REST API for TaskBoard — a project & task management app with role-based access control.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev
```

## Environment Variables

| Variable    | Description                        |
|-------------|------------------------------------|
| MONGO_URI   | MongoDB connection string          |
| JWT_SECRET  | Secret key for signing JWTs        |
| PORT        | Server port (default: 5000)        |

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint    | Access | Description        |
|--------|-------------|--------|--------------------|
| POST   | /register   | Public | Register new user  |
| POST   | /login      | Public | Login, get token   |
| GET    | /me         | Auth   | Get current user   |

**Register body:**
```json
{ "name": "John", "email": "john@x.com", "password": "pass123", "role": "member" }
```

**Login body:**
```json
{ "email": "john@x.com", "password": "pass123" }
```

---

### Users — `/api/users`

| Method | Endpoint | Access | Description      |
|--------|----------|--------|------------------|
| GET    | /        | Admin  | Get all users    |
| GET    | /:id     | Admin  | Get single user  |

---

### Projects — `/api/projects`

| Method | Endpoint | Access        | Description              |
|--------|----------|---------------|--------------------------|
| POST   | /        | Admin         | Create project           |
| GET    | /        | Auth          | Get projects (role-based)|
| GET    | /:id     | Auth          | Get single project       |
| PUT    | /:id     | Admin         | Update project           |
| DELETE | /:id     | Admin         | Delete project           |

**Create Project body:**
```json
{
  "name": "Website Redesign",
  "description": "Redesign the company website",
  "members": ["userId1", "userId2"]
}
```

---

### Tasks — `/api/tasks`

| Method | Endpoint              | Access | Description                          |
|--------|-----------------------|--------|--------------------------------------|
| POST   | /                     | Admin  | Create & assign task                 |
| GET    | /my                   | Auth   | My tasks (admin=all, member=own)     |
| GET    | /all                  | Admin  | All tasks                            |
| GET    | /stats                | Auth   | Dashboard stats                      |
| GET    | /project/:projectId   | Auth   | Tasks by project                     |
| PUT    | /:id                  | Auth   | Update task (member: status only)    |
| DELETE | /:id                  | Admin  | Delete task                          |

**Create Task body:**
```json
{
  "title": "Build login page",
  "description": "Create responsive login UI",
  "assignedTo": "userId",
  "project": "projectId",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

**Update Task body (member):**
```json
{ "status": "in-progress" }
```

**Dashboard Stats response:**
```json
{ "total": 10, "todo": 4, "inProgress": 3, "done": 2, "overdue": 1 }
```

---

## Role-Based Access

| Feature               | Admin | Member        |
|-----------------------|-------|---------------|
| Create projects       | ✅    | ❌            |
| View all projects     | ✅    | Own only      |
| Create/assign tasks   | ✅    | ❌            |
| View tasks            | ✅ All| Own only      |
| Update task status    | ✅    | Own only      |
| Delete tasks          | ✅    | ❌            |
| View all users        | ✅    | ❌            |

---

## Railway Deployment

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a MongoDB service (or use MongoDB Atlas)
4. Set environment variables in Railway dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
5. Railway auto-detects `package.json` and runs `npm start`
6. Your API will be live at `https://your-app.railway.app`

> Update your frontend API base URL to the Railway URL before deploying.
