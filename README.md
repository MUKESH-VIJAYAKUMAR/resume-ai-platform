# Resume AI Platform

This repository contains two resume tools:

- **Career Canvas**, a guided offline resume builder and PDF exporter in the repository root.
- **The original FastAPI resume-matching API** in `backend/`, which extracts resume text and compares it with job descriptions.

## Career Canvas

Career Canvas turns the details you provide into a clean, professional PDF. It runs on your computer, works without an account, and keeps your draft in the browser on that device.

## What it does

- Guides you through a target role, contact details, work experience, education, skills, training and credentials, and optional projects or other highlights.
- Shows a live resume preview as you edit.
- Checks common details such as email and link formats, dates, and experience bullets, then offers a review checklist.
- Downloads a selectable-text A4 PDF with readable, conservative typography.
- Saves and restores your draft in this browser. A clearly marked fictional sample is available to explore the layout.

The builder organizes and formats what you enter. It does not invent work history, achievements, or skills, and it does not use an AI service or send your information to a server.

## Run the offline app

The static app is included in `out/`. On Windows, double-click [Start Career Canvas.bat](./Start%20Career%20Canvas.bat). It opens the app at [http://127.0.0.1:8765](http://127.0.0.1:8765). Keep the server window open while using it and press `Ctrl+C` there to stop it.

The launcher uses Python 3, which must be available on PATH. The built app does not need Node, pnpm, or an internet connection. Only the optional Harvard resume-guidance link opens an external site.

## Rebuild from source

To change the app and regenerate the offline files in `out/`, install Node.js 20.18.1 or newer and pnpm 11.25.0, then run:

```powershell
pnpm install
pnpm build
```

Keep `out/` in the repository so the launcher works after upload or clone. Installing dependencies needs internet unless they are already cached.

## Project guide

- [How it works](HOW_IT_WORKS.md) — data flow, validation, PDF export, and offline behavior.
- `app/` — Next.js entry point, document metadata, and visual styles.
- `components/career-canvas/` — guided editor, live preview, review checklist, local draft storage, and PDF document.
- `components/ui/` — reusable interface elements.
- `lib/resume.ts` — resume shape, validation, section ordering, and sample data.
- `public/` — local app icons.

## Privacy and draft storage

The resume draft is stored in this browser profile's local storage under `career-canvas-draft-v1`. It is not included in the project files or PDF until you download one. Use **Reset draft** in the app to clear the saved draft. Clearing the browser's site data also removes it.

## License

No license has been added yet. Add the license you want before distributing the repository.

## Original FastAPI API

The earlier resume upload and job-matching API remains in `backend/`.

1. Install its dependencies: `pip install -r backend/requirements.txt`.
2. From the `backend/` directory, run: `uvicorn app.main:app --reload`.
3. Open `http://127.0.0.1:8000/docs` for the API documentation.
