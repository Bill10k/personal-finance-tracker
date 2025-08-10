from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your routers EXACTLY as they exist in the repo
from .routes import (
    auth,
    accounts,
    transactions,
    categories,
    budgets,
    savings_goal,   # <-- singular
    dashboard,
    transfers,
)

# IMPORTANT: uvicorn is launched with app.main:api
api = FastAPI(
    title="Personal Finance Tracker API",
    description="A personal finance tracking application",
    version="1.0.0",
)

# Configure CORS BEFORE including routers
ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

api.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,       # do NOT use "*" when allow_credentials=True
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers AFTER middleware
api.include_router(auth.router)
api.include_router(accounts.router)
api.include_router(transactions.router)
api.include_router(categories.router)
api.include_router(budgets.router)
api.include_router(savings_goal.router)
api.include_router(dashboard.router)
api.include_router(transfers.router)

# Simple root/health
@api.get("/")
def root():
    return {"message": "Personal Finance Tracker API", "status": "running"}

@api.get("/health")
def health_check():
    return {"status": "healthy"}
