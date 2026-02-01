from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.models.employee import Employee, Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceResponse

router = APIRouter(tags=["attendance"])


@router.get("/employees/{employee_id}/attendance", response_model=list[AttendanceResponse])
def list_attendance(
    employee_id: int,
    from_date: date | None = Query(None, alias="from"),
    to_date: date | None = Query(None, alias="to"),
    db: Session = Depends(get_db),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    q = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    if from_date is not None:
        q = q.filter(Attendance.date >= from_date)
    if to_date is not None:
        q = q.filter(Attendance.date <= to_date)
    records = q.order_by(Attendance.date.desc()).all()
    return [AttendanceResponse.model_validate(r) for r in records]


@router.post("/attendance", response_model=AttendanceResponse, status_code=201)
def mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == data.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    existing = db.query(Attendance).filter(
        Attendance.employee_id == data.employee_id,
        Attendance.date == data.date,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Attendance already marked for this date")
    record = Attendance(
        employee_id=data.employee_id,
        date=data.date,
        status=data.status,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return AttendanceResponse.model_validate(record)
