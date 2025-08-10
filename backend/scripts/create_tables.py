from app.core.database import Base, engine
from app.models.savings_goal import SavingsGoal

Base.metadata.create_all(bind=engine)
print("Tables created.")
