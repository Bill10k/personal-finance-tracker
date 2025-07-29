from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    target = Column(Float, nullable=False)
    saved = Column(Float, default=0)
