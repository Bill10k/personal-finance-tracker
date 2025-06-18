from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.budget_schema import BudgetCreate, BudgetResponse
from app.models.budget import Budget
from app.core.dependencies import get_db

router = APIRouter()

@router.post("/", response_model=BudgetResponse)
def create_budget(data: BudgetCreate, db: Session = Depends(get_db)):
    budget = Budget(**data.dict())
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget

@router.get("/", response_model=list[BudgetResponse])
def list_budgets(db: Session = Depends(get_db)):
    return db.query(Budget).all()
