# backend/app/models/budget.py

from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.core.database import Base

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    t_amount = Column(Float)
    period = Column(Date)  # e.g., 'monthly', 'weekly'
