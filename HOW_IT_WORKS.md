# How Career Canvas works

## 1. Guided editing

The page presents six steps: target role, contact details, experience, education, skills and credentials, and review. Each step updates a single resume draft. The preview reflects that draft while you work. Experience and education can be left out when they do not apply; projects and other highlights are optional too.

Career Canvas is a guided formatter, not a generative writing service. It can help you check structure and completeness, but it will not make up job titles, employers, dates, skills, or achievements. A sample profile is provided for exploring the layout and is labeled fictional in the editor and exported PDF.

## 2. Draft storage and validation

`components/career-canvas/use-resume.ts` loads the saved draft from the browser's local storage key `career-canvas-draft-v1`. Changes are saved after a short pause and when the page is hidden or closed. Drafts are local to the browser profile on this device; there is no account, database, or sync service.

`lib/resume.ts` defines the resume data shape and validates it with Zod when a saved draft is loaded. Step-level checks give feedback about required fields, professional email and URL formats, month/year dates, date order, and experience bullets. The review page shows readiness checks and links back to items that need attention. It deliberately does not calculate a resume score or promise ATS acceptance.

## 3. Preview and PDF

The preview is rendered from the current draft. Before export, the review step asks you to confirm that the information is accurate (or that you are knowingly using the fictional sample).

`components/career-canvas/pdf-document.tsx` uses `@react-pdf/renderer` in the browser to build an A4 PDF with selectable text, Helvetica typography, automatic page flow, and page numbers on multi-page resumes. The PDF is downloaded directly by the browser; it is not sent to a PDF service.

## 4. Offline and network behavior

Next.js exports the app as static files in `out/`. `Start Career Canvas.bat` serves those files with Python on `127.0.0.1`, so the app is available only on the same computer and does not need Node or pnpm at runtime. Its fonts, styles, icons, editor, and PDF renderer are bundled locally. There are no API calls, analytics package, remote font request, or resume upload.

The editor, local autosave, preview, and PDF export work without internet. The optional Harvard career-guidance link requires internet if opened. User-entered links are only validated and shown in the resume; the app does not visit them.

## 5. Source map

| Path | Responsibility |
| --- | --- |
| `app/page.tsx` | Renders the Career Canvas page |
| `app/layout.tsx` | Local system-font layout, metadata, and app icons |
| `app/globals.css` | UI styles and responsive layout |
| `components/career-canvas/career-canvas.tsx` | Wizard navigation, state updates, preview, reset, and export flow |
| `components/career-canvas/editor-steps.tsx` | Forms for the resume sections |
| `components/career-canvas/resume-preview.tsx` | Live on-screen resume preview |
| `components/career-canvas/review-step.tsx` | Readiness checklist and accuracy confirmation |
| `components/career-canvas/use-resume.ts` | Local storage load/save behavior |
| `components/career-canvas/pdf-document.tsx` | PDF layout and browser download |
| `lib/resume.ts` | Types, sample draft, validation, and resume section formatting |
| `Start Career Canvas.bat` | Double-click launcher for the offline static app |
