# app/services/auth_service.py
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime

from app.schemas.user_schema import UserCreate, UserLogin
from app.models.users import User
from app.core.security import hash_password, verify_password, create_access_token

class AuthService:
    @staticmethod
    def register(user: UserCreate, db: Session):
        if db.query(User).filter(User.username == user.username).first():
            raise HTTPException(status_code=400, detail="Username already exists")
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(status_code=400, detail="Email already registered")

        new_user = User(
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            hashed_password=hash_password(user.password),
            created_at=datetime.utcnow(),
        )
        db.add(new_user); db.commit(); db.refresh(new_user)
        return {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "full_name": new_user.full_name,
        }

    @staticmethod
    def login(payload: UserLogin, db: Session):
        identifier = payload.identifier.strip()
        password = payload.password

        user = db.query(User).filter(
            or_(User.username == identifier, User.email == identifier)
        ).first()

        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Invalid username/email or password")

        token = create_access_token(user.id)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
            },
        }
