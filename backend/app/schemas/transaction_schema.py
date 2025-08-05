from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from datetime import datetime, date


class TransactionCreate(BaseModel):
    type: str
    amount: float
    category: str
    description: Optional[str]
    date: date


class TransferCreate(BaseModel):
    user_id: int
    from_account_id: int
    to_account_id: int
    amount: float
    note: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    account_id: int
    amount: float
    type: str
    category: str
    timestamp: datetime
    note: Optional[str]

    class Config:
        from_attributes = True
