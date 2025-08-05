from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Numeric, func
from datetime import datetime
from app.core.database import Base
from sqlalchemy.orm import relationship

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"))
    amount = Column(Numeric(10,2), nullable=False)
    type = Column(String, nullable=False)  # income or expense
    category = Column(String)  # (keep this if your app uses categories)
    description = Column(String, nullable=True)
    # note = Column(String, nullable=True)   # (optional, keep if you use it)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
