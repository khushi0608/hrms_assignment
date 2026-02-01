from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeListResponse

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=EmployeeListResponse)
def list_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).order_by(Employee.id).all()
    return EmployeeListResponse(employees=[EmployeeResponse.model_validate(e) for e in employees])


@router.post("", response_model=EmployeeResponse, status_code=201)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    existing = db.query(Employee).filter(
        (Employee.employee_id == data.employee_id) | (Employee.email == data.email)
    ).first()
    if existing:
        if existing.employee_id == data.employee_id:
            raise HTTPException(status_code=409, detail="Employee ID already exists")
        raise HTTPException(status_code=409, detail="Email already exists")
    employee = Employee(
        employee_id=data.employee_id,
        full_name=data.full_name,
        email=data.email,
        department=data.department,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return EmployeeResponse.model_validate(employee)


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return EmployeeResponse.model_validate(employee)


@router.delete("/{employee_id}", status_code=204)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()
    return None
