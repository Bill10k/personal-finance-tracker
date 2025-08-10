from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from typing import Optional
from datetime import date, datetime

class SavingsGoalCreate(BaseModel):
    name: str
    target_amount: Decimal
    deadline: Optional[date] = None

class SavingsGoalUpdate(BaseModel):
    # update only what the UI changes frequently
    current_amount: Decimal

class SavingsGoalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: str
    target_amount: Decimal
    current_amount: Decimal
    deadline: Optional[date] = None
    created_at: datetime
