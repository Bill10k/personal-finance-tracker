from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.core.dependencies import get_db

router = APIRouter()

@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    income = sum(t.amount for t in transactions if t.type == "income")
    expenses = sum(t.amount for t in transactions if t.type == "expense")
    balance = income - expenses
    return {"income": income, "expenses": expenses, "balance": balance}
