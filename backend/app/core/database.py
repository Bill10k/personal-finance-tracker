# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Dict

DATABASE_URL = "sqlite:///./finance.db"  # Later: PostgreSQL URI

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}  # SQLite-specific
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# In-memory databases
users_db: Dict[str, dict] = {}
accounts_db: Dict[str, dict] = {}
categories_db: Dict[str, dict] = {}
transactions_db: Dict[str, dict] = {}
budgets_db: Dict[str, dict] = {}