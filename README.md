# HRMS Lite

A lightweight Human Resource Management System for managing employee records and daily attendance.

## Overview

HRMS Lite is a full-stack web application that allows an admin to:

- **Employee Management**: Add employees (Employee ID, Full Name, Email, Department), view all employees, and delete employees.
- **Attendance Management**: Mark attendance (date, status: Present/Absent) per employee and view attendance records. Optional date range filter and total present days per employee.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite, React Router, Axios |
| Backend  | FastAPI (Python)                    |
| Database | SQLite (local) / PostgreSQL (prod) |
| Deploy   | Vercel (frontend), Render (backend) |

## Project Structure

```
Assignment/
├── frontend/          # React (Vite) app
│   └── src/
│       ├── components/  # Layout, Button, Modal, EmptyState
│       ├── pages/       # EmployeeList, EmployeeForm, AttendancePage
│       └── services/    # API client
├── backend/            # FastAPI app
│   └── app/
│       ├── db/         # SQLAlchemy engine, session
│       ├── models/     # Employee, Attendance
│       ├── schemas/    # Pydantic request/response
│       └── routes/     # employees, attendance
└── README.md
```

## Running Locally

### Prerequisites

- Node.js 18+
- Python 3.10+

### Backend

1. Go to the backend folder and create a virtual environment (optional but recommended):

   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   # source .venv/bin/activate  # macOS/Linux
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. (Optional) Copy `.env.example` to `.env` and set `DATABASE_URL` (default: SQLite) and `FRONTEND_URL` (e.g. `http://localhost:5173`).

4. Start the server:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   API docs: http://localhost:8000/docs

### Frontend

1. Go to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Copy `env.example` to `.env` in the frontend folder and set `VITE_API_URL=http://localhost:8000` (this is the default if omitted).

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:5173

### Environment Variables

**Backend**

- `DATABASE_URL`: Database URL (default: `sqlite:///./hrms.db`). Use `postgresql://...` for PostgreSQL (e.g. on Render).
- `FRONTEND_URL`: Allowed CORS origin for the frontend (e.g. your Vercel URL in production).

**Frontend**

- `VITE_API_URL`: Backend API base URL (default: `http://localhost:8000`). Set to your Render API URL in production.

## Deployment

### Backend (Render)

1. Create a new Web Service and connect your GitHub repo.
2. Root directory: `backend` (or leave blank if repo root is the repo root and you use subdir).
3. Build command: (leave empty or `pip install -r requirements.txt`).
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL URL (Render provides one).
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g. `https://your-app.vercel.app`).

### Frontend (Vercel)

1. Import the repo and set the root directory to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variable: `VITE_API_URL` = your Render backend URL (e.g. `https://your-api.onrender.com`).

### Submission

After deployment, share:

1. **Live Application URL** (Vercel frontend)
2. **Hosted Backend API URL** (Render)
3. **GitHub Repository Link**

## API Endpoints

| Method | Endpoint                          | Description                |
|--------|-----------------------------------|----------------------------|
| GET    | `/api/employees`                  | List all employees         |
| POST   | `/api/employees`                  | Create employee            |
| GET    | `/api/employees/{id}`            | Get one employee           |
| DELETE | `/api/employees/{id}`            | Delete employee            |
| GET    | `/api/employees/{id}/attendance` | List attendance (optional `from`, `to` query) |
| POST   | `/api/attendance`                 | Mark attendance            |

## Assumptions and Limitations

- Single admin user; no authentication or role-based access.
- Employee ID is a unique string (e.g. E001); format is not strictly validated.
- Deleting an employee cascades to their attendance records (all attendance for that employee is removed).
- Dates are sent as ISO date strings (YYYY-MM-DD). Server stores dates without timezone conversion for simplicity.
- No pagination; suitable for small to medium datasets (6–8 hour scope).

## License

MIT
