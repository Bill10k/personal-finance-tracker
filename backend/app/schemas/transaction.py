from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field
from datetime import date

class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"

class TransactionCreate(BaseModel):
    account_id: str
    category_id: str
    amount: float = Field(..., gt=0)
    transaction_type: TransactionType
    description: str = Field(..., min_length=1, max_length=200)
    transaction_date: Optional[date] = None