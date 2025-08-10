from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Numeric, func, Date
from datetime import datetime
from app.core.database import Base
from sqlalchemy.orm import relationship

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    type = Column(String, nullable=False)  # income or expense
    category = Column(String, nullable=False, default="")  # (keep this if your app uses categories)
    description = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    user = relationship("User", back_populates="transactions", lazy="joined")
