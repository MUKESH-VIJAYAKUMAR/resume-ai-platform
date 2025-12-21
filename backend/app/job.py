from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class JobDescription(BaseModel):
    text: str

@router.post("/job")
def add_job(job: JobDescription):
    return {
        "message": "Job description received",
        "job_text_preview": job.text[:300]
    }
