# TeamPM — Frontend

Next.js frontend for the Team Project Management System.

## Setup

1. **Copy this `frontend/` folder** into your project root (alongside `backend/`).

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure the API URL** in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
   (Already set to match your Express backend on port 5000.)

4. **Make sure your backend is running:**
   ```bash
   cd ../backend
   node Server.js
   ```

5. **Start the frontend:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — stats, recent projects & tasks |
| `/projects` | List all projects, create/delete |
| `/projects/[id]` | Kanban board for a project's tasks |
| `/tasks` | All tasks with status & project filters |
| `/users` | Team members — add/edit/remove |

## API Assumptions

The frontend calls these endpoints on your backend:

- `GET/POST /api/projects`
- `GET/PUT/DELETE /api/projects/:id`
- `GET/POST /api/tasks`
- `GET/PUT/DELETE /api/tasks/:id`
- `GET/POST /api/users`
- `GET/PUT/DELETE /api/users/:id`

If your routes use different paths (e.g. `/projects` without `/api` prefix),
update `src/lib/api.js` — change the `BASE_URL` variable at the top.

## CORS

Make sure your Express backend has CORS enabled (you already have the `cors`
package). In `Server.js` confirm:

```js
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));
```
