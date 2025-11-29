# backend/app/database.py
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
import os

DB_URL = os.environ.get("QFF_DB_URL", "sqlite:///./qff.db")
engine = create_engine(DB_URL, connect_args={"check_same_thread": False} if DB_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metadata = MetaData()
