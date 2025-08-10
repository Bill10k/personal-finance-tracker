# app/routes/accounts.py

from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt

from app.core.dependencies import get_db
from app.models.account import Account  # SQLAlchemy model
from app.schemas.account_schema import AccountCreate, AccountResponse
from app.core.config import settings  # adjust import path to your settings module

router = APIRouter(prefix="/accounts", tags=["accounts"])
security = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    Extract user_id from the access token.
    Assumes HS256 and payload contains {'user_id': ..., 'type': 'access'}.
    """
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=["HS256"])
        if payload.get("type") != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        return str(payload["user_id"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


@router.post(
    "/",
    response_model=AccountResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an account",
)
def create_account(
    account: AccountCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    # Optional: enforce unique name per user
    existing = (
        db.query(Account)
        .filter(Account.user_id == user_id, Account.name == account.name)
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Account name already exists")

    new_account = Account(**account.dict(), user_id=user_id)

    try:
        db.add(new_account)
        db.commit()
        db.refresh(new_account)
        return new_account
    except Exception:
        db.rollback()
        raise


@router.get(
    "/",
    response_model=List[AccountResponse],
    summary="List my accounts",
)
def get_accounts(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
    limit: int = 100,
    offset: int = 0,
):
    q = (
        db.query(Account)
        .filter(Account.user_id == user_id)
        .order_by(Account.created_at.desc() if hasattr(Account, "created_at") else Account.id.desc())
        .offset(offset)
        .limit(limit)
    )
    return q.all()
