from pydantic import BaseModel
from typing import Literal

class BudgetCreate(BaseModel):
    user_id: int
    category_id: str
    amount: float
    period: Literal["weekly", "monthly", "yearly"]

class BudgetResponse(BaseModel):
    id: int
    user_id: int
    category_id: str
    amount: float
    period: str

    class Config:
        from_attributes = True
