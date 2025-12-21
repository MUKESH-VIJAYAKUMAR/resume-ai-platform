from .upload import router as upload_router
from .job import router as job_router
from .matcher import router as match_router

app = FastAPI(title="Resume AI Platform")

app.include_router(upload_router)
app.include_router(job_router)
app.include_router(matcher_router)

@app.get("/")
def home():
    return {"message": "Backend is running"}
