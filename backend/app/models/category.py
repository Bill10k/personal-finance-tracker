# backend/app/models/category.py

from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    cat_name = Column(String, index=True)
    description = Column(String, nullable=True)
    type = Column(string, nullable = False)
    created_at = Column(DateTime(timezone=True), server_default = func.now())
