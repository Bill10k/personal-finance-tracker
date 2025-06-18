
## 🚀 API Endpoints (FastAPI Backend)

Base URL (during development):  
```
http://localhost:8000/api/v1
```

### 🧑‍💼 Auth Routes
| Method | Route             | Description                  | Body Parameters               |
|--------|-------------------|------------------------------|-------------------------------|
| POST   | `/auth/signup`    | Register new user            | `{ "email", "password" }`     |
| POST   | `/auth/login`     | Authenticate user and get JWT| `{ "email", "password" }`     |

### 💰 Transaction Routes
| Method | Route                   | Description                     | Auth Required |
|--------|-------------------------|----------------------------------|---------------|
| GET    | `/transactions/`        | List all transactions            | ✅            |
| POST   | `/transactions/`        | Create a new transaction         | ✅            |
| GET    | `/transactions/{id}`    | Get single transaction by ID     | ✅            |
| PUT    | `/transactions/{id}`    | Update transaction by ID         | ✅            |
| DELETE | `/transactions/{id}`    | Delete transaction by ID         | ✅            |

### 📂 Category Routes
| Method | Route              | Description                | Auth Required |
|--------|--------------------|-----------------------------|---------------|
| GET    | `/categories/`     | List all categories         | ✅            |
| POST   | `/categories/`     | Create new category         | ✅            |
| PUT    | `/categories/{id}` | Update existing category    | ✅            |
| DELETE | `/categories/{id}` | Delete a category           | ✅            |

### 📊 Dashboard Route
| Method | Route          | Description                           | Auth Required |
|--------|----------------|----------------------------------------|---------------|
| GET    | `/dashboard/`  | Get financial summary & chart data     | ✅            |

### 💼 Account Routes
| Method | Route             | Description                  | Auth Required |
|--------|-------------------|------------------------------|---------------|
| GET    | `/accounts/`      | List user accounts           | ✅            |
| POST   | `/accounts/`      | Create an account            | ✅            |
| PUT    | `/accounts/{id}`  | Update account               | ✅            |
| DELETE | `/accounts/{id}`  | Delete account               | ✅            |

### 💸 Budget Routes
| Method | Route           | Description                  | Auth Required |
|--------|-----------------|------------------------------|---------------|
| GET    | `/budgets/`     | List all budgets             | ✅            |
| POST   | `/budgets/`     | Create a budget              | ✅            |
| PUT    | `/budgets/{id}` | Update budget                | ✅            |
| DELETE | `/budgets/{id}` | Delete budget                | ✅            |

### 🔁 Transfer Routes (Optional)
| Method | Route               | Description                 | Auth Required |
|--------|---------------------|-----------------------------|---------------|
| POST   | `/transfers/`       | Transfer between accounts   | ✅            |

---

### 🛠 Usage Example (with `fetch` or Postman)

```bash
POST /auth/signup
{
  "email": "john@example.com",
  "password": "securePass123"
}
```

```bash
POST /auth/login
{
  "email": "john@example.com",
  "password": "securePass123"
}
# Response:
{
  "access_token": "<JWT_TOKEN>",
  "token_type": "bearer"
}
```

```bash
GET /transactions/
Headers: Authorization: Bearer <JWT_TOKEN>
```
