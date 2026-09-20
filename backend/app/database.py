from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import logging
from app.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

try:
    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
    # Test connection
    with engine.connect() as conn:
        pass
    logger.info("Successfully connected to PostgreSQL database.")
except Exception as e:
    logger.warning(f"Failed to connect to PostgreSQL ({e}). Falling back to local SQLite database.")
    SQLITE_URL = "sqlite:///./nagar_seva.db"
    engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
