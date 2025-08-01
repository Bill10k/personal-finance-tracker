from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    target = Column(Numeric(12,2), nullable=False)
    saved = Column(Numeric(12,2), default=0)
