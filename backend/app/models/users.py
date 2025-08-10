from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
from app.core.database import Base
from sqlalchemy.orm import relationship

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1, max_length=100)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default = 'user')
    created_at = Column(DateTime(timezone=True), server_default = func.now())
    transactions = relationship("Transaction", back_populates="user", cascade="all,delete-orphan")
    budgets = relationship("Budget", back_populates="user", cascade="all,delete-orphan")
    categories = relationship("Category", back_populates="user", cascade="all,delete-orphan")
    savings_goals = relationship("SavingsGoal", back_populates="user", cascade="all,delete-orphan")



