from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class AccountType(str, Enum):
    CHECKING = "checking"
    SAVINGS = "savings"
    CREDIT_CARD = "credit_card"
    INVESTMENT = "investment"
    CASH = "cash"

class AccountCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    account_type: AccountType
    balance: float = Field(..., ge=0)
    description: Optional[str] = None

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    type = Column(String)  # e.g., savings, checking