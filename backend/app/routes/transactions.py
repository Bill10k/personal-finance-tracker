from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.transaction_schema import TransactionCreate, TransactionResponse
from app.models.transaction import Transaction
from app.core.dependencies import get_db
from datetime import datetime

router = APIRouter(prefix="/transactions")


@router.post("/", response_model=TransactionResponse)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    transaction = Transaction(**data.dict())
    if not transaction.timestamp:
        transaction.timestamp = datetime.utcnow()
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.get("/", response_model=list[TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()
