from typing import List
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.users import User
from app.models.budget import Budget
from app.models.category import Category
from app.schemas.budget_schema import (
    BudgetCreate,
    BudgetUpdate,
    BudgetResponse,
)

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.get("/", response_model=List[BudgetResponse])
def list_budgets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all budgets for the authenticated user."""
    rows = (
        db.query(Budget)
        .filter(Budget.user_id == current_user.id)
        .order_by(Budget.id.desc())
        .all()
    )
    return rows


@router.post("/", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_budget(
    payload: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a budget for a category the user owns."""
    # Validate category exists and belongs to user
    cat = (
        db.query(Category)
        .filter(Category.id == payload.category_id, Category.user_id == current_user.id)
        .first()
    )
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category_id (not found or not yours).",
        )

    # Create budget
    bud = Budget(
        user_id=current_user.id,
        category_id=payload.category_id,
        amount=payload.amount,   # Decimal supported
        period=payload.period,   # e.g., "monthly"
    )
    db.add(bud)
    db.commit()
    db.refresh(bud)
    return bud


@router.patch("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int,
    payload: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update budget fields (amount/period/category_id)."""
    bud = (
        db.query(Budget)
        .filter(Budget.id == budget_id, Budget.user_id == current_user.id)
        .first()
    )
    if not bud:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found.")

    # If category_id provided, validate ownership
    if payload.category_id is not None:
        cat = (
            db.query(Category)
            .filter(Category.id == payload.category_id, Category.user_id == current_user.id)
            .first()
        )
        if not cat:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid category_id (not found or not yours).",
            )
        bud.category_id = payload.category_id

    if payload.amount is not None:
        if Decimal(payload.amount) <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Amount must be > 0.")
        bud.amount = payload.amount

    if payload.period is not None:
        bud.period = payload.period

    db.commit()
    db.refresh(bud)
    return bud


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a budget that belongs to the user."""
    bud = (
        db.query(Budget)
        .filter(Budget.id == budget_id, Budget.user_id == current_user.id)
        .first()
    )
    if not bud:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found.")

    db.delete(bud)
    db.commit()
    return None
