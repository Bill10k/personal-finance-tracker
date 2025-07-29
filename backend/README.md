# Backend folder
# Personal Finance Tracker Backend

This is the **backend API** for the Personal Finance Tracker web application, built using **FastAPI** and **PostgreSQL**. The API supports secure user authentication, transaction management, budgeting, and more, designed to serve a modern React frontend.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints Overview](#api-endpoints-overview)
- [Database Schema](#database-schema)
- [Development Notes](#development-notes)
- [Changelog](#changelog)
- [License](#license)

---

## Features

- User registration and login (JWT-based authentication)
- CRUD operations for transactions (income, expenses, categories)
- Budgets: set and track monthly budgets
- Support for multiple accounts per user
- Dashboard endpoints for summaries, charts, and analytics
- Secure password storage (bcrypt)
- CORS enabled for frontend integration
- Clean API structure, scalable for future features

---

## Architecture

- **Framework:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT tokens
- **API Docs:** [Swagger UI](http://localhost:8000/docs) (auto-generated)

---

## Requirements

- Python 3.11 or newer
- PostgreSQL (local or cloud)
- `pip` and `virtualenv` (recommended)
- Node.js and the separate [frontend repo](../frontend) for UI

---

## Installation

```bash
git clone https://github.com/yourusername/personal-finance-tracker-backend.git
cd personal-finance-tracker-backend

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt


API Endpoints Overview

| Method | Endpoint               | Description                 | Auth |
| ------ | ---------------------- | --------------------------- | ---- |
| POST   | /api/auth/register     | Register a new user         | No   |
| POST   | /api/auth/login        | Login (returns JWT)         | No   |
| GET    | /api/users/me          | Get current user info       | Yes  |
| POST   | /api/transactions/     | Create a new transaction    | Yes  |
| GET    | /api/transactions/     | List all user transactions  | Yes  |
| GET    | /api/transactions/{id} | Get transaction by ID       | Yes  |
| PUT    | /api/transactions/{id} | Update a transaction        | Yes  |
| DELETE | /api/transactions/{id} | Delete a transaction        | Yes  |
| GET    | /api/budgets/          | Get budgets overview        | Yes  |
| POST   | /api/budgets/          | Create or update budgets    | Yes  |
| GET    | /api/dashboard/summary | Get dashboard summary stats | Yes  |


Replace:

postgres and mysecretpassword with your actual database user and password

finance_db with your database name

SECRET_KEY with a randomly generated string (don’t share it publicly)

