from pydantic import BaseModel
from typing import Optional

class AccountCreate(BaseModel):
    user_id: int
    name: str
    type: str  # e.g., savings, checking

class AccountResponse(BaseModel):
    id: int
    user_id: int
    name: str
    type: str

    class Config:
        from_attributes = True
