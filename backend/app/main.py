import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import init_db
from app.routes import employees, attendance

app = FastAPI(title="HRMS Lite API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://hrmsassignment.vercel.app",
]
if os.getenv("FRONTEND_URL"):
    origins.append(os.getenv("FRONTEND_URL").rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


app.include_router(employees.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")
