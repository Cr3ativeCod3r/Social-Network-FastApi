from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
import math

from ..core.dependencies import get_current_user, get_current_active_user, get_current_admin_user
from ..db.base import get_db
from ..models.user import User
from ..models.report import Report
from ..helpers.status_enum import StatusEnum
from ..schemas import (
    ReportCreate,
    ReportListResponse,
    ReportResponse,
    ReportUpdateStatus,
    PaginatedResponse
)


router = APIRouter()

@router.post("/",response_model=None, status_code=status.HTTP_201_CREATED)
async def create_report(
        report_data: ReportCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Utwórz nowe zgłoszenie"""
    db_report = Report(
        user_id=current_user.user_id,
        status=StatusEnum.pending,
        title=report_data.title,
        description=report_data.description,
    )
    db.add(db_report)
    db.commit()

    return None

@router.get("/", response_model=PaginatedResponse[ReportListResponse])
async def get_all_reports(
        status_filter: Optional[StatusEnum] = Query(None),
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
        db: Session = Depends(get_db),
        current_admin: User = Depends(get_current_admin_user)
):
    query = db.query(Report).options(joinedload(Report.user))
    if status_filter:
        query = query.filter(Report.status == status_filter)
    total = query.count()
    total_pages = math.ceil(total / page_size)
    reports = query.offset((page-1)*page_size).limit(page_size).all()

    return PaginatedResponse(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        items=reports
    )


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
        report_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Pobierz szczegóły zgłoszenia"""
    report = db.query(Report).options(joinedload(Report.user)).filter(
        Report.report_id == report_id
    ).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if report.user_id != current_user.user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    return {
        "report_id": report.report_id,
        "user_id": report.user_id,
        "email": report.user.email,
        "status": report.status,
        "title": report.title,
        "description": report.description,
        "reported_at": report.reported_at
    }


@router.patch("/{report_id}", response_model=None)
async def update_report_status(
        report_id: int,
        status_update: ReportUpdateStatus,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Zmień status zgłoszenia (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    report = db.query(Report).filter(Report.report_id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = status_update.status
    db.commit()
    db.refresh(report)

    return report