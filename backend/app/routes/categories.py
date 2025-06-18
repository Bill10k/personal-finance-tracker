from fastapi import APIRouter
from pydantic import BaseModel
from app.database import categories_db  # your in-memory categories dictionary


router = APIRouter()

class CategoryCreate(BaseModel):
    name: str

@router.post("/", response_model=dict)
def create_category(category: CategoryCreate):
    category_id = len(categories_db) + 1
    new_category = {
        "id": category_id,
        "name": category.name
    }
    categories_db[category_id] = new_category
    return new_category

@router.get("/", response_model=list)
def get_categories():
    return list(categories_db.values())