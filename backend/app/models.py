# backend/app/models.py
from sqlalchemy import Table, Column, Integer, String, Text, DateTime, Boolean, MetaData
from sqlalchemy.sql import func
from .database import metadata, engine

# Users table with roles
users = Table(
    "users", metadata,
    Column("id", String, primary_key=True),
    Column("username", String, unique=True, nullable=False),
    Column("email", String, unique=True, nullable=False),
    Column("password_hash", String, nullable=False),
    Column("role", String, default="user"),  # 'admin' or 'user'
    Column("is_active", Boolean, default=True),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
    Column("last_login", DateTime(timezone=True), nullable=True)
)

ledger = Table(
    "ledger", metadata,
    Column("id", String, primary_key=True),
    Column("user_id", String, nullable=True),  # Link to user
    Column("tx_type", String, nullable=False),
    Column("amount", String, nullable=False),
    Column("currency", String, nullable=False),
    Column("receiver", String, nullable=False),
    Column("risk_score", Integer, default=100),
    Column("status", String, default="PENDING"),
    Column("fingerprint", String, nullable=True),
    Column("meta", Text, nullable=True),
    Column("timestamp", DateTime(timezone=True), server_default=func.now())
)

accounts = Table(
    "accounts", metadata,
    Column("id", String, primary_key=True),
    Column("user_id", String, nullable=False),
    Column("account_type", String, nullable=False),
    Column("currency", String, nullable=False),
    Column("balance", String, nullable=False)
)

def init_db():
    metadata.create_all(engine)

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Any, List

class TransactionRequest(BaseModel):
    amount: float
    currency: str
    type: str
    receiver: str
    
class ExecuteRequest(TransactionRequest):
    key: Optional[str] = None
    risk_score: Optional[int] = 100

class ErrorResponse(BaseModel):
    errorCode: str
    userMessage: str
    details: Optional[Any] = None

# Auth models
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    is_active: bool

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserUpdate(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
