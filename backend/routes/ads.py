"""
Advertisements API Routes
Handles ad creation, management, and analytics
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from datetime import datetime, timedelta

from core.security import get_current_user, require_role


router = APIRouter()


# Pydantic Models
class AdCreate(BaseModel):
    title: str
    image_url: str
    link_url: str
    position: str  # header, sidebar, footer, inline
    start_date: datetime
    end_date: datetime


class AdUpdate(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None


class AdResponse(BaseModel):
    id: str
    advertiser_id: str
    title: str
    image_url: str
    link_url: str
    position: str
    start_date: datetime
    end_date: datetime
    is_active: bool
    impressions: int
    clicks: int
    created_at: datetime


# Mock ads database
MOCK_ADS = [
    {
        "id": "ad_001",
        "advertiser_id": "user_001",
        "title": "New iPhone 15 - Best Prices",
        "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
        "link_url": "https://example.com/iphone15",
        "position": "header",
        "start_date": datetime.now() - timedelta(days=7),
        "end_date": datetime.now() + timedelta(days=30),
        "is_active": True,
        "impressions": 15420,
        "clicks": 487,
        "created_at": datetime.now() - timedelta(days=7)
    },
    {
        "id": "ad_002",
        "advertiser_id": "user_001",
        "title": "Phone Repair Services",
        "image_url": "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=800&q=80",
        "link_url": "https://example.com/repair",
        "position": "sidebar",
        "start_date": datetime.now() - timedelta(days=14),
        "end_date": datetime.now() + timedelta(days=15),
        "is_active": True,
        "impressions": 8930,
        "clicks": 312,
        "created_at": datetime.now() - timedelta(days=14)
    }
]


@router.get("/", response_model=List[dict])
async def get_ads(
    position: Optional[str] = Query(None, description="Filter by position"),
    active_only: bool = Query(True, description="Only return active ads"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    """Get all advertisements"""
    ads = MOCK_ADS.copy()
    
    if position:
        ads = [a for a in ads if a["position"] == position]
    
    if active_only:
        now = datetime.now()
        ads = [a for a in ads if a["is_active"] and a["start_date"] <= now <= a["end_date"]]
    
    return ads[skip:skip + limit]


@router.get("/active/{position}")
async def get_active_ads_by_position(position: str):
    """Get active ads for a specific position"""
    now = datetime.now()
    ads = [
        a for a in MOCK_ADS 
        if a["position"] == position 
        and a["is_active"] 
        and a["start_date"] <= now <= a["end_date"]
    ]
    return ads


@router.get("/{ad_id}")
async def get_ad(ad_id: str):
    """Get a specific advertisement"""
    ad = next((a for a in MOCK_ADS if a["id"] == ad_id), None)
    if not ad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertisement not found"
        )
    return ad


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_ad(
    ad: AdCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new advertisement"""
    new_ad = {
        "id": f"ad_{len(MOCK_ADS) + 1:03d}",
        "advertiser_id": current_user.get("sub"),
        **ad.model_dump(),
        "is_active": True,
        "impressions": 0,
        "clicks": 0,
        "created_at": datetime.now()
    }
    MOCK_ADS.append(new_ad)
    return new_ad


@router.put("/{ad_id}")
async def update_ad(
    ad_id: str,
    updates: AdUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an advertisement"""
    ad = next((a for a in MOCK_ADS if a["id"] == ad_id), None)
    if not ad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertisement not found"
        )
    
    # Check ownership
    if ad["advertiser_id"] != current_user.get("sub") and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this ad"
        )
    
    update_data = updates.model_dump(exclude_unset=True)
    ad.update(update_data)
    return ad


@router.delete("/{ad_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ad(
    ad_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete an advertisement"""
    global MOCK_ADS
    ad = next((a for a in MOCK_ADS if a["id"] == ad_id), None)
    if not ad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertisement not found"
        )
    
    if ad["advertiser_id"] != current_user.get("sub") and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this ad"
        )
    
    MOCK_ADS = [a for a in MOCK_ADS if a["id"] != ad_id]


@router.post("/{ad_id}/impression")
async def record_impression(ad_id: str):
    """Record an ad impression"""
    ad = next((a for a in MOCK_ADS if a["id"] == ad_id), None)
    if ad:
        ad["impressions"] += 1
    return {"success": True}


@router.post("/{ad_id}/click")
async def record_click(ad_id: str):
    """Record an ad click"""
    ad = next((a for a in MOCK_ADS if a["id"] == ad_id), None)
    if ad:
        ad["clicks"] += 1
    return {"success": True, "redirect_url": ad["link_url"] if ad else None}


@router.get("/{ad_id}/analytics")
async def get_ad_analytics(
    ad_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get analytics for an advertisement"""
    ad = next((a for a in MOCK_ADS if a["id"] == ad_id), None)
    if not ad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertisement not found"
        )
    
    # Check ownership
    if ad["advertiser_id"] != current_user.get("sub") and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view analytics"
        )
    
    ctr = (ad["clicks"] / ad["impressions"] * 100) if ad["impressions"] > 0 else 0
    
    return {
        "ad_id": ad_id,
        "impressions": ad["impressions"],
        "clicks": ad["clicks"],
        "ctr": round(ctr, 2),
        "start_date": ad["start_date"],
        "end_date": ad["end_date"],
        "days_remaining": max(0, (ad["end_date"] - datetime.now()).days)
    }
