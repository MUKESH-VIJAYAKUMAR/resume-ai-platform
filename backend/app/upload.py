from fastapi import APIRouter, UploadFile, File
import os
import fitz  # PyMuPDF
import docx

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_text(file_path: str):
    text = ""

    if file_path.endswith(".pdf"):
        pdf = fitz.open(file_path)
        for page in pdf:
            text += page.get_text()

    elif file_path.endswith(".docx"):
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"

    return text.strip()

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_text(file_path)

    return {
        "message": "Resume uploaded & text extracted",
        "filename": file.filename,
        "text_preview": resume_text[:500]
    }
