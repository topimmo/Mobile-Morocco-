"""
Users API Routes
Handles user registration, authentication, and profile management
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from datetime import datetime

from core.security import (
    get_password_hash, 
    verify_password, 
    create_access_token,
    create_refresh_token,
    get_current_user,
    verify_token
)


router = APIRouter()


# Pydantic Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str
    user_type: str  # customer, importer, technician
    city: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str
    user_type: str
    city: Optional[str]
    avatar_url: Optional[str]
    is_verified: bool
    subscription_tier: str
    created_at: datetime


# Mock users database
MOCK_USERS = {
    "user_001": {
        "id": "user_001",
        "email": "importer@example.com",
        "password_hash": get_password_hash("password123"),
        "full_name": "Ahmed Benali",
        "phone": "+212612345678",
        "user_type": "importer",
        "city": "Casablanca",
        "avatar_url": None,
        "bio": "Mobile phone importer since 2015",
        "is_verified": True,
        "subscription_tier": "professional",
        "created_at": datetime.now()
    },
    "user_002": {
        "id": "user_002",
        "email": "tech@example.com",
        "password_hash": get_password_hash("password123"),
        "full_name": "Youssef Alami",
        "phone": "+212698765432",
        "user_type": "technician",
        "city": "Rabat",
        "avatar_url": None,
        "bio": "Certified phone repair technician",
        "is_verified": True,
        "subscription_tier": "standard",
        "created_at": datetime.now()
    },
    "user_003": {
        "id": "user_003",
        "email": "customer@example.com",
        "password_hash": get_password_hash("password123"),
        "full_name": "Sara Moussaoui",
        "phone": "+212655443322",
        "user_type": "customer",
        "city": "Marrakech",
        "avatar_url": None,
        "bio": None,
        "is_verified": False,
        "subscription_tier": "free",
        "created_at": datetime.now()
    }
}


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserRegister):
    """Register a new user"""
    # Check if email already exists
    if any(u["email"] == user.email for u in MOCK_USERS.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_id = f"user_{len(MOCK_USERS) + 1:03d}"
    new_user = {
        "id": user_id,
        "email": user.email,
        "password_hash": get_password_hash(user.password),
        "full_name": user.full_name,
        "phone": user.phone,
        "user_type": user.user_type,
        "city": user.city,
        "avatar_url": None,
        "bio": None,
        "is_verified": False,
        "subscription_tier": "free",
        "created_at": datetime.now()
    }
    MOCK_USERS[user_id] = new_user
    
    # Generate tokens
    token_data = {"sub": user_id, "email": user.email, "role": user.user_type}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login and get access token"""
    # Find user by email
    user = next((u for u in MOCK_USERS.values() if u["email"] == credentials.email), None)
    
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Generate tokens
    token_data = {"sub": user["id"], "email": user["email"], "role": user["user_type"]}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str):
    """Refresh access token using refresh token"""
    payload = verify_token(refresh_token, token_type="refresh")
    
    # Generate new tokens
    token_data = {
        "sub": payload.get("sub"),
        "email": payload.get("email"),
        "role": payload.get("role")
    }
    new_access_token = create_access_token(token_data)
    new_refresh_token = create_refresh_token(token_data)
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


@router.get("/me")
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    user_id = current_user.get("sub")
    user = MOCK_USERS.get(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Remove password hash from response
    return {k: v for k, v in user.items() if k != "password_hash"}


@router.put("/me")
async def update_user_profile(
    updates: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update current user profile"""
    user_id = current_user.get("sub")
    user = MOCK_USERS.get(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    update_data = updates.model_dump(exclude_unset=True)
    user.update(update_data)
    
    return {k: v for k, v in user.items() if k != "password_hash"}


@router.get("/{user_id}")
async def get_user_profile(user_id: str):
    """Get a user's public profile"""
    user = MOCK_USERS.get(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Return only public information
    return {
        "id": user["id"],
        "full_name": user["full_name"],
        "user_type": user["user_type"],
        "city": user.get("city"),
        "avatar_url": user.get("avatar_url"),
        "bio": user.get("bio"),
        "is_verified": user["is_verified"],
        "created_at": user["created_at"]
    }


@router.post("/verify-phone")
async def request_phone_verification(current_user: dict = Depends(get_current_user)):
    """Request phone verification SMS"""
    # In production, send actual SMS
    return {
        "message": "Verification code sent",
        "phone": MOCK_USERS.get(current_user.get("sub"), {}).get("phone")
    }


@router.post("/verify-phone/confirm")
async def confirm_phone_verification(
    code: str,
    current_user: dict = Depends(get_current_user)
):
    """Confirm phone verification with code"""
    user_id = current_user.get("sub")
    user = MOCK_USERS.get(user_id)
    
    if user:
        # In production, verify the actual code
        if code == "123456":  # Mock verification
            user["is_verified"] = True
            return {"message": "Phone verified successfully"}
    
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid verification code"
    )
