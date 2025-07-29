from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, transactions, budgets, savings_goal, dashboard


app = FastAPI()

# Register routers
app.include_router(auth.router)           # Login, Register, etc.
app.include_router(transactions.router)   # Transactions endpoints
app.include_router(budgets.router)        # Budget endpoints
app.include_router(savings_goal.router)   # Savings goals
app.include_router(dashboard.router)    # dashboard summary


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
