# app/routes/transfers.py

from datetime import datetime
from typing import List, Tuple

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.account import Account
from app.models.transactions import Transaction  # adjust if your model name/module differs
from app.schemas.transaction_schema import TransferCreate, TransactionResponse

router = APIRouter(prefix="/transfers", tags=["transfers"])


def _validate_accounts_and_ownership(
    db: Session, user_id: int, from_account_id: int, to_account_id: int
) -> Tuple[Account, Account]:
    from_acc = db.query(Account).filter(Account.id == from_account_id).first()
    to_acc = db.query(Account).filter(Account.id == to_account_id).first()

    if not from_acc or not to_acc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or both accounts not found")

    if from_acc.user_id != user_id or to_acc.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized transfer")

    return from_acc, to_acc


@router.post(
    "/",
    response_model=List[TransactionResponse],
    summary="Create Transfer",
    status_code=status.HTTP_201_CREATED,
)
def create_transfer(transfer: TransferCreate, db: Session = Depends(get_db)):
    """
    Creates two transaction rows atomically:
    - Transfer Out (negative amount) from `from_account_id`
    - Transfer In (positive amount) to `to_account_id`
    """
    if transfer.amount is None or transfer.amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid transfer amount")

    _ = _validate_accounts_and_ownership(
        db, user_id=transfer.user_id, from_account_id=transfer.from_account_id, to_account_id=transfer.to_account_id
    )

    now = datetime.utcnow()

    out_tx = Transaction(
        user_id=transfer.user_id,
        account_id=transfer.from_account_id,
        amount=-abs(transfer.amount),
        type="transfer",
        category="Transfer Out",
        timestamp=now,
        note=f"Transfer to account {transfer.to_account_id}: {(transfer.note or '').strip()}".strip(),
    )

    in_tx = Transaction(
        user_id=transfer.user_id,
        account_id=transfer.to_account_id,
        amount=abs(transfer.amount),
        type="transfer",
        category="Transfer In",
        timestamp=now,
        note=f"Transfer from account {transfer.from_account_id}: {(transfer.note or '').strip()}".strip(),
    )

    try:
        db.add_all([out_tx, in_tx])
        db.commit()
        db.refresh(out_tx)
        db.refresh(in_tx)
    except Exception:
        db.rollback()
        raise

    return [out_tx, in_tx]


@router.get("/", response_model=List[TransactionResponse], summary="Get Transfers")
def get_transfers(db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.type == "transfer").order_by(Transaction.timestamp.desc()).all()
