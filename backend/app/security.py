# backend/app/security.py
from fastapi import HTTPException, Security, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
import hashlib
import jwt
import os
import uuid

# Security configurations
security = HTTPBearer(auto_error=False)

# JWT Settings
SECRET_KEY = os.environ.get("QFF_SECRET_KEY", "quantum-financial-firewall-secret-key-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("QFF_TOKEN_EXPIRE", "60"))

ADMIN_TOKEN = os.environ.get("QFF_ADMIN_TOKEN", "admin-demo-token")

# Simple password hashing using SHA256 + salt (for demo purposes)
SALT = "qff-secure-salt-2024"

def hash_password(password: str) -> str:
    """Hash a password using SHA256 with salt"""
    salted = f"{SALT}{password}{SALT}"
    return hashlib.sha256(salted.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Get current user from JWT token"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = credentials.credentials
    payload = decode_token(token)
    
    return {
        "user_id": payload.get("sub"),
        "username": payload.get("username"),
        "role": payload.get("role", "user")
    }

def require_admin(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Require admin role"""
    user = get_current_user(credentials)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

def verify_admin(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Legacy admin verification - checks token or role"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = credentials.credentials
    
    # Check if it's the admin token
    if token == ADMIN_TOKEN:
        return {"role": "admin", "username": "admin"}
    
    # Otherwise, decode JWT and check role
    try:
        payload = decode_token(token)
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid authentication")

def generate_user_id() -> str:
    """Generate a unique user ID"""
    return f"user-{uuid.uuid4().hex[:12]}"

security_manager = verify_admin
