from pydantic import BaseModel
from typing import Optional

class BudgetCreate(BaseModel):
    name: str
    budget: float
    spent: Optional[float] = 0

class BudgetUpdate(BaseModel):
    name: Optional[str] = None
    budget: Optional[float] = None
    spent: Optional[float] = None

class BudgetResponse(BaseModel):
    id: int
    name: str
    budget: float
    spent: float

    class Config:
        orm_mode = True
