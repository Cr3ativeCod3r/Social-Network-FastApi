import io
import os
import pytest
from fastapi import UploadFile
from app.routers import notes
from app.routers.notes import validate_file, save_upload_file, UPLOAD_DIR

def create_test_file(filename: str, content: bytes) -> UploadFile:
    file = io.BytesIO(content)
    upload_file = UploadFile(filename=filename, file=file)
    return upload_file


def test_validate_file_success():
    file = create_test_file("test.pdf", b"x" * 1024)
    validate_file(file)


def test_validate_file_wrong_extension():
    file = create_test_file("test.exe", b"x" * 1024)
    with pytest.raises(Exception) as exc_info:
        validate_file(file)
    assert "File type not allowed" in str(exc_info.value)


def test_validate_file_too_large():
    file = create_test_file("test.pdf", b"x" * (notes.MAX_FILE_SIZE + 1))
    with pytest.raises(Exception) as exc_info:
        validate_file(file)
    assert "File too large" in str(exc_info.value)


def test_save_upload_file(tmp_path):
    original_upload_dir = notes.UPLOAD_DIR
    notes.UPLOAD_DIR = str(tmp_path)

    file = create_test_file("test.pdf", b"Hello World")
    saved_path = save_upload_file(file, note_id=1)

    assert os.path.exists(saved_path)
    with open(saved_path, "rb") as f:
        assert f.read() == b"Hello World"

    notes.UPLOAD_DIR = original_upload_dir