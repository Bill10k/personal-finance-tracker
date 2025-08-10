from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from typing import Optional

class BudgetCreate(BaseModel):
    category_id: int
    amount: Decimal
    period: Optional[str] = None  # "monthly" | "weekly" | "yearly" | "custom"

class BudgetUpdate(BaseModel):
    amount: Optional[Decimal] = None
    period: Optional[str] = None
    category_id: Optional[int] = None

class BudgetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    category_id: int
    amount: Decimal
    period: Optional[str] = None
