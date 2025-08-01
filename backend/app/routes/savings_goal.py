from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.savings_goal_schema import SavingsGoalCreate, SavingsGoalUpdate, SavingsGoalResponse
from app.models.savings_goal import SavingsGoal
from app.core.dependencies import get_db

router = APIRouter(prefix="/savings-goals", tags=["savings-goals"])

@router.get("/", response_model=list[SavingsGoalResponse])
def list_goals(db: Session = Depends(get_db)):
    return db.query(SavingsGoal).all()

@router.post("/", response_model=SavingsGoalResponse)
def create_goal(data: SavingsGoalCreate, db: Session = Depends(get_db)):
    goal = SavingsGoal(**data.dict())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal

@router.put("/{goal_id}", response_model=SavingsGoalResponse)
def update_goal(goal_id: int, update: SavingsGoalUpdate, db: Session = Depends(get_db)):
    goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    goal.saved = update.saved
    db.commit()
    db.refresh(goal)
    return goal

@router.delete("/{goal_id}", status_code=204)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
