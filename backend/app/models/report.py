from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..db.base import Base
from ..helpers.status_enum import StatusEnum
class Report(Base):
    __tablename__ = "reports"

    report_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False, index=True)
    status = Column(SQLEnum(StatusEnum), default=StatusEnum.pending, nullable=False, server_default='pending',index=True)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    reported_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reports")
