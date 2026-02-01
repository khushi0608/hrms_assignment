from datetime import date
from pydantic import BaseModel, Field


class AttendanceCreate(BaseModel):
    employee_id: int = Field(..., description="Internal employee DB id")
    date: date
    status: str = Field(..., pattern="^(present|absent)$")


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    status: str

    class Config:
        from_attributes = True
