import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.api.v1.auth import router as auth_router
from app.api.v1.complaints import router as complaints_router
from app.api.v1.admin import router as admin_router
from app.api.v1.whatsapp import router as whatsapp_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Database tables automatically on startup
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
except Exception as e:
    logger.error(f"Error initializing database tables: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Nagar Seva AI - Citizen Complaint Management Platform API",
    version="1.0.0"
)

# Enable CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router Modules
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(complaints_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(whatsapp_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
