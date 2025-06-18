from fastapi import FastAPI
from app.routes import auth, accounts, budgets, categories, transactions, dashboard, transfers
from app.database import Base, engine
from app.models import user, account, transaction, budget, category  # import all  # also import other model modules

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Personal Finance Tracker API",
    description="API for managing user accounts, budgets, categories, and transactions.",
    version="1.0.0"
)


# Register all routers with appropriate prefixes and tags
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
app.include_router(budgets.router, prefix="/budgets", tags=["budgets"])
app.include_router(categories.router, prefix="/categories", tags=["categories"])
app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(transfers.router)

# Root route
@app.get("/")
async def root():
    return {"message": "Personal Finance Tracker API"}
