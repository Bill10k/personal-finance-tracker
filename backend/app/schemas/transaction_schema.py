from pydantic import BaseModel, ConfigDict
from typing import Optional, Literal
from datetime import datetime
from decimal import Decimal

# ---------- Transactions ----------

class TransactionCreate(BaseModel):
    account_id: int
    amount: Decimal
    type: Literal["income", "expense"]  # keep tight to reduce client errors
    category: str                       # TEXT in DB
    description: Optional[str] = None
    # match DB column; if omitted, backend/model defaults to now()
    timestamp: Optional[datetime] = None

class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    account_id: int
    amount: Decimal
    type: str
    category: str
    description: Optional[str] = None
    timestamp: datetime


# ---------- Transfers ----------

class TransferCreate(BaseModel):
    # user_id comes from JWT on the server; do NOT accept from client
    from_account_id: int
    to_account_id: int
    amount: Decimal
    note: Optional[str] = None

class TransferResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    from_account_id: int
    to_account_id: int
    amount: Decimal
    note: Optional[str] = None
    timestamp: datetime
