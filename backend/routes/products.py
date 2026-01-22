"""
Products API Routes
Handles all product-related endpoints
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from datetime import datetime

from core.security import get_current_user, require_role
from core.database import get_db


router = APIRouter()


# Pydantic Models
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    condition: str  # new, used, refurbished
    brand: Optional[str] = None
    model: Optional[str] = None
    location: Optional[str] = None
    images: List[str] = []


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    condition: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    location: Optional[str] = None
    images: Optional[List[str]] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: str
    seller_id: str
    is_active: bool
    views: int
    created_at: datetime
    updated_at: datetime


# Mock data for development
MOCK_PRODUCTS = [
    {
        "id": "prod_001",
        "name": "iPhone 14 Pro Max",
        "description": "Brand new iPhone 14 Pro Max 256GB",
        "price": 12999,
        "category": "smartphones",
        "condition": "new",
        "brand": "Apple",
        "model": "iPhone 14 Pro Max",
        "location": "Casablanca",
        "images": ["https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&q=80"],
        "seller_id": "user_001",
        "is_active": True,
        "views": 245,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "prod_002",
        "name": "Samsung Galaxy S23 Ultra",
        "description": "Samsung Galaxy S23 Ultra 512GB - Excellent condition",
        "price": 9500,
        "category": "smartphones",
        "condition": "used",
        "brand": "Samsung",
        "model": "Galaxy S23 Ultra",
        "location": "Rabat",
        "images": ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80"],
        "seller_id": "user_002",
        "is_active": True,
        "views": 189,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]


@router.get("/", response_model=List[dict])
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    condition: Optional[str] = Query(None, description="Filter by condition"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    location: Optional[str] = Query(None, description="Filter by location"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    search: Optional[str] = Query(None, description="Search query"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    """Get all products with optional filters"""
    products = MOCK_PRODUCTS.copy()
    
    # Apply filters
    if category:
        products = [p for p in products if p["category"] == category]
    if condition:
        products = [p for p in products if p["condition"] == condition]
    if brand:
        products = [p for p in products if p.get("brand", "").lower() == brand.lower()]
    if location:
        products = [p for p in products if location.lower() in p.get("location", "").lower()]
    if min_price is not None:
        products = [p for p in products if p["price"] >= min_price]
    if max_price is not None:
        products = [p for p in products if p["price"] <= max_price]
    if search:
        search_lower = search.lower()
        products = [p for p in products if 
                   search_lower in p["name"].lower() or 
                   search_lower in p["description"].lower()]
    
    return products[skip:skip + limit]


@router.get("/{product_id}")
async def get_product(product_id: str):
    """Get a specific product by ID"""
    product = next((p for p in MOCK_PRODUCTS if p["id"] == product_id), None)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    current_user: dict = Depends(require_role(["importer", "admin"]))
):
    """Create a new product listing"""
    new_product = {
        "id": f"prod_{len(MOCK_PRODUCTS) + 1:03d}",
        **product.model_dump(),
        "seller_id": current_user.get("sub"),
        "is_active": True,
        "views": 0,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    MOCK_PRODUCTS.append(new_product)
    return new_product


@router.put("/{product_id}")
async def update_product(
    product_id: str,
    updates: ProductUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a product listing"""
    product = next((p for p in MOCK_PRODUCTS if p["id"] == product_id), None)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check ownership
    if product["seller_id"] != current_user.get("sub") and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this product"
        )
    
    # Update fields
    update_data = updates.model_dump(exclude_unset=True)
    product.update(update_data)
    product["updated_at"] = datetime.now()
    
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a product listing"""
    global MOCK_PRODUCTS
    product = next((p for p in MOCK_PRODUCTS if p["id"] == product_id), None)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    if product["seller_id"] != current_user.get("sub") and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this product"
        )
    
    MOCK_PRODUCTS = [p for p in MOCK_PRODUCTS if p["id"] != product_id]


@router.get("/categories/list")
async def get_categories():
    """Get all available product categories"""
    return [
        {"id": "smartphones", "name": "Smartphones", "icon": "smartphone"},
        {"id": "accessories", "name": "Accessories", "icon": "headphones"},
        {"id": "spare-parts", "name": "Spare Parts", "icon": "settings"},
        {"id": "repair-equipment", "name": "Repair Equipment", "icon": "wrench"},
        {"id": "tablets", "name": "Tablets", "icon": "tablet"},
        {"id": "smartwatches", "name": "Smartwatches", "icon": "watch"}
    ]


@router.post("/{product_id}/view")
async def record_product_view(product_id: str):
    """Record a product view"""
    product = next((p for p in MOCK_PRODUCTS if p["id"] == product_id), None)
    if product:
        product["views"] = product.get("views", 0) + 1
    return {"success": True}
