# app/routes/transactions.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import date
from app.core.dependencies import get_db, get_current_user
from app.models.users import User
from app.models.transactions import Transaction
from app.schemas.transaction_schema import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = transaction.model_dump()
    # supply required date if missing
    if not data.get("transaction_date"):
        data["transaction_date"] = date.today()

    db_tx = Transaction(**data, user_id=current_user.id)
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx

@router.get("/", response_model=list[TransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Transaction).filter_by(user_id=current_user.id).all()

