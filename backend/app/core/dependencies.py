# app/core/dependencies.py
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import verify_token
from app.models.users import User

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(user_id: int = Depends(verify_token), db: Session = Depends(get_db)) -> User:
    # SQLAlchemy 1.x:
    user = db.query(User).get(user_id)  # If SQLAlchemy 2.x: db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
