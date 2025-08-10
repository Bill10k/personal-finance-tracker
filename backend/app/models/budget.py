# backend/app/models/budget.py

from sqlalchemy import Column, Integer, Float, String, ForeignKey, Numeric, DateTime
from app.core.database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    amount = Column(Numeric(12,2), nullable = False)
    period = Column(String, nullable=True)   # e.g., 'monthly', 'weekly'
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="budgets")