from fastapi import HTTPException, status
from datetime import datetime
from app.schemas.auth import UserCreate  # Use consistent import
from app.database import users_db  # In-memory mock DB
from app.schemas.auth import UserLogin  # Adjust import if needed

class AuthService:
    @staticmethod
    def register(user: UserCreate, db=None):
        if user.username in users_db:
            raise HTTPException(status_code=400, detail="Username already exists")

        user_id = len(users_db) + 1
        new_user = {
            "id": user_id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "hashed_password": f"hashed-{user.password}",  # Simulate hashing
            "created_at": datetime.utcnow()
        }

        users_db[user.username] = new_user

        return {
            "id": user_id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name
        }

    @staticmethod
    def login(user_data: UserLogin, db=None):  # Accepts optional db for future use
        user = users_db.get(user_data.username)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username")
        if user["hashed_password"] != f"hashed-{user_data.password}":  # Be sure to check hashed password!
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

        return {
            "message": "Login successful",
            "user": {
                "username": user["username"],
                "email": user["email"],
                "full_name": user["full_name"]
            }
        }
