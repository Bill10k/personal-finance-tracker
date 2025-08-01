from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"))
    amount = Column(Numeric(10,2), nullable = False)
    type = Column(String)  # income or expense
    category = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    note = Column(String, nullable=True)
