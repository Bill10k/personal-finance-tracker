from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from pydantic import EmailStr

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str

    class Config:
        orm_mode = True


class AccountBase(BaseModel):
    name: str
    balance: float

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

