# backend/app/models/budget.py

from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database import Base

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    amount = Column(Float)
    period = Column(String)  # e.g., 'monthly', 'weekly'
