import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Use DATABASE_URL for PostgreSQL (Render), else SQLite for local
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./hrms.db",
)
# Render uses postgres:// which SQLAlchemy 1.4+ expects as postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {} if "sqlite" in DATABASE_URL else {}
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from app.models import employee  # noqa: F401
    Base.metadata.create_all(bind=engine)
