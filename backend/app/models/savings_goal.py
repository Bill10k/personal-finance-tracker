from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, TIMESTAMP, text
from app.core.database import Base
from sqlalchemy.orm import relationship

class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # owner of the goal
    name = Column(String, nullable=False)
    target_amount = Column(Numeric(12, 2), nullable=False)             # renamed for clarity
    current_amount = Column(Numeric(12, 2), nullable=False, default=0) # renamed for clarity
    deadline = Column(Date, nullable=True)                             # optional target date
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("now()")
    )

    user = relationship("User", back_populates="savings_goals")
