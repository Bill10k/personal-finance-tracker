from pydantic import BaseModel

class SavingsGoalBase(BaseModel):
    name: str
    target: float
    saved: float = 0

class SavingsGoalCreate(SavingsGoalBase):
    pass

class SavingsGoalUpdate(BaseModel):
    saved: float

class SavingsGoalResponse(SavingsGoalBase):
    id: int

    class Config:
        orm_mode = True
