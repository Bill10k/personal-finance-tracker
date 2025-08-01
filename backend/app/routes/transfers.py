from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.transaction_schema import TransferCreate, TransactionResponse
from app.core.database import transactions_db
from app.models.account import Account
from app.core.dependencies import get_db
from datetime import datetime
from typing import List

router = APIRouter(prefix="/transfers", tags=["Transfers"])

@router.post("/", summary="Create Transfer")
def create_transfer(transfer: TransferCreate, db: Session = Depends(get_db)):
    from_acc = db.query(Account).filter(Account.id == transfer.from_account_id).first()
    to_acc = db.query(Account).filter(Account.id == transfer.to_account_id).first()

    if not from_acc or not to_acc:
        raise HTTPException(status_code=404, detail="One or both accounts not found")

    if from_acc.user_id != transfer.user_id or to_acc.user_id != transfer.user_id:
        raise HTTPException(status_code=403, detail="Unauthorized transfer")

    if transfer.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid transfer amount")

    transfer_id = len(transactions_db) + 1

    # Record 'Transfer Out'
    transactions_db[transfer_id] = {
        "id": transfer_id,
        "user_id": transfer.user_id,
        "account_id": transfer.from_account_id,
        "amount": -transfer.amount,
        "type": "transfer",
        "category": "Transfer Out",
        "timestamp": datetime.utcnow(),
        "note": f"Transfer to account {transfer.to_account_id}: {transfer.note or ''}".strip()
    }

    # Record 'Transfer In'
    transfer_id += 1
    transactions_db[transfer_id] = {
        "id": transfer_id,
        "user_id": transfer.user_id,
        "account_id": transfer.to_account_id,
        "amount": transfer.amount,
        "type": "transfer",
        "category": "Transfer In",
        "timestamp": datetime.utcnow(),
        "note": f"Transfer from account {transfer.from_account_id}: {transfer.note or ''}".strip()
    }

    return {"message": "Transfer recorded successfully"}

@router.get("/", response_model=List[TransactionResponse], summary="Get Transfers")
def get_transfers():
    transfers = [tx for tx in transactions_db.values() if tx["type"] == "transfer"]
    return transfers
