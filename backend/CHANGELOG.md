backend/CHANGELOG.md
[Unreleased]
(Add next backend features, migrations, or bugfixes here.)

[v0.1.0] — 2025-07-21
Added
Initial project scaffolding using FastAPI for REST API.

Set up and configured PostgreSQL as the main database.

Integrated SQLAlchemy as ORM for data models.

Added database connection utility (db.py or similar).

Created essential API entities and models:

User (registration, authentication, JWT/session, password hashing)

Transaction (CRUD: create, read, update, delete)

Account (list, create, link to users/transactions)

Budget (track by category, time period)

Category (expense/income types)

Implemented basic API endpoints:

POST /register, POST /login (with JWT or session cookies)

GET /transactions, POST /transactions, DELETE /transactions/{id}

GET /budgets, POST /budgets

GET /accounts, POST /accounts

API response validation with Pydantic schemas.

Initial unit tests for registration and transaction creation.

Simple API documentation via FastAPI’s automatic Swagger UI.

Changed
Improved security with password hashing (bcrypt or argon2).

Added CORS middleware for frontend integration.

Updated models to support user-level scoping (multi-user, isolated data).

Refined error handling (404, 401, 500).

Fixed
Fixed DB migration script errors for first-time setup.

Fixed authentication bugs with login/refresh tokens.

Fixed bug where new transactions were not saving associated user ID.

Fixed category mapping bug (ensured only valid categories used).

Improved
Added sample data population script for local development.

Improved API response messages (success, errors).

Enabled cross-origin requests for frontend-localhost use.

Discussed
How to structure RESTful endpoints for flexibility and security.

Best practice for API key/token authentication.

Handling user registration edge cases.

Database schema relationships for accounts, budgets, and transactions.

API error message format for frontend compatibility.

[To Do / Next Up]
Add password reset and email verification endpoints.

Support recurring transactions and notifications.

Add reporting endpoints (charts, summaries, analytics).

Rate-limit and throttle endpoints for security.

Improve test coverage.

Set up deployment-ready Dockerfile and environment.

Backend Lead: Bill Etornam Kwame Gbadago
Backend Team: Bill, Enoch
Last updated: 2025-07-25

# CHANGELOG.md

## \[Unreleased]

* Ongoing backend and frontend development, integration, and bugfixes.

---

## \[2025-07-21]

### Added

* **Backend**

  * Implemented FastAPI endpoints: auth (/auth/register, /auth/login), budgets, transactions, dashboard/summary.
  * Added database models and Pydantic schemas for User, Transaction, Budget, and draft for SavingsGoal.
  * Set up SQLAlchemy database connection and dependency injection (get_db).
  * Added basic /dashboard/summary endpoint to calculate and return total income, expenses, and balance.
  * Added backend CORS middleware for React dev server (http://localhost:5173).
  * Added endpoints for creating, listing, updating, and deleting budgets.
  * Built in-memory placeholder for savings goals (to be upgraded to DB integration).

* **Frontend**

  * Implemented Login.jsx and Signup.jsx components, with animated headings (Framer Motion), error and loading states.
  * Integrated frontend login/register forms with backend (/auth/login, /auth/register), storing access tokens in localStorage.
  * Added src/services/api.js for all API methods (login, register, fetch/add transactions, fetch/add budgets, etc.) using Bearer token.
  * Refactored transaction, history, and budget components to **fetch data from the backend** instead of local state.
  * Improved UI for transaction and budget management, including add modal, reset/confirm dialogs, and responsive table displays.
  * Built dashboard layout fetching summary stats (total balance, total income, total expenses, savings rate) from backend.
  * Implemented filter and search for transactions, with dynamic category options.
  * Added token-based authorization headers in all API requests.

### Fixed

* Fixed ModuleNotFoundError for fastapi and SQLAlchemy dependencies by using venv and correct pip install.
* Resolved CORS errors with correct FastAPI middleware.
* Fixed Python import errors with correct project structure (e.g., from app.core.database).
* Updated Pydantic schemas for v2 (orm_mode → from_attributes).
* Fixed error with missing table creation by scripting DB setup (scripts/create_tables.py).

### Changed

* Standardized on src/services/api.js for all frontend API calls.
* Updated form validation and error handling on all auth-related screens.
* Improved and refactored UI and code for better maintainability.

### Known Issues / TODO

* **Savings Goals:** Frontend is static/hardcoded. Backend endpoints and DB model for SavingsGoal drafted, but integration not finished.
* Still to connect dashboard chart and goal components to live API data.
* Review and document any missing endpoints or inconsistent API error handling.
* Ensure all SQLAlchemy models have matching Pydantic schemas and migrations.

---

> *Keep this file up to date with all feature changes, bugfixes, dependency updates, and major project milestones.*

---
