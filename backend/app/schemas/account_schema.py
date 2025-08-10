from pydantic import BaseModel, ConfigDict
from typing import Optional

class AccountCreate(BaseModel):
    user_id: int
    name: str
    type: str  # e.g., savings, checking

class AccountResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    name: str
    type: str

