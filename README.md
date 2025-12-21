# Resume AI Platform

An AI-powered resume parsing and matching platform built using FastAPI.

## Features
- Upload resumes in PDF/DOCX format
- Extract text from resumes
- Accept job descriptions
- Compute resume–job match score using NLP-based text similarity

## Tech Stack
- Python
- FastAPI
- Scikit-learn
- PyMuPDF
- Swagger UI

## How to Run
1. Install dependencies:
   pip install -r requirements.txt
2. Run server:
   uvicorn app.main:app --reload
3. Open:
   http://127.0.0.1:8000/docs
