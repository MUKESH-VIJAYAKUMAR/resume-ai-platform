from fastapi import APIRouter
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()

class MatchRequest(BaseModel):
    resume_text: str
    job_text: str

@router.post("/match")
def match_resume(req: MatchRequest):
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([req.resume_text, req.job_text])

    score = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

    return {
        "match_percentage": round(score * 100, 2)
    }
