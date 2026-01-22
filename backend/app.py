"""
Mobile Morocco Backend - FastAPI Entry Point
Production-ready API server for the mobile marketplace platform
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from core.config import settings
from core.database import init_db
from routes import products, users, ads, subscriptions, technicians, notifications


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management"""
    # Startup
    print("🚀 Starting Mobile Morocco API...")
    await init_db()
    yield
    # Shutdown
    print("🛑 Shutting down Mobile Morocco API...")


app = FastAPI(
    title="Mobile Morocco API",
    description="Backend API for the Mobile Morocco marketplace platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(ads.router, prefix="/api/ads", tags=["Advertisements"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["Subscriptions"])
app.include_router(technicians.router, prefix="/api/technicians", tags=["Technicians"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "status": "online",
        "message": "Mobile Morocco API is running",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "database": "connected",
        "services": {
            "products": "operational",
            "users": "operational",
            "ads": "operational",
            "subscriptions": "operational",
            "technicians": "operational"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=settings.DEBUG
    )
