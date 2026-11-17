'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, BookOpen, Check, CheckCheck, ChevronRight, CircleCheck, Download, Eye, FileCheck2, FileText, GraduationCap, Lightbulb, LoaderCircle, LockKeyhole, RotateCcw, ShieldCheck, Sparkles, Sprout, Target, Trash2, UserRound, X, BriefcaseBusiness } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { emptyResume, getReadiness, getSections, sampleResume, steps, validateStep, type Resume } from '@/lib/resume'
import { useResume } from './use-resume'
import { ContactStep, EducationStep, ExperienceStep, SkillsStep, TargetStep } from './editor-steps'
import { PreviewPanel, ResumePaper } from './resume-preview'
import { ReviewStep } from './review-step'

const icons = [Target, UserRound, BriefcaseBusiness, GraduationCap, Sparkles, FileCheck2]
const headings = ['First, let’s find your direction.', 'Let’s make an introduction.', 'Your work. Your impact.', 'A foundation worth sharing.', 'The skills that set you apart.', 'A clearer story. A confident next step.']
const descriptions = ['A little focus now makes the rest feel easier. Tell us where you’d like to go.', 'Keep it simple. Give recruiters a name and a reliable way to reach you.', 'Show what you did, how you did it, and why it mattered.', 'Highlight the learning that supports your next chapter.', 'Bring together your strengths, credentials, and a few meaningful extras.', 'Give your resume a final look. Make sure it sounds like you—because it is.']

export default function CareerCanvas() {
  const { data, setData, step, setStep, ready, saveStatus, storageWarning, replace } = useResume()
  const [attempted, setAttempted] = useState(false)
  const [mobilePreview, setMobilePreview] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'reset' | 'sample' | null>(null)
  const [undo, setUndo] = useState<{ data: Resume; step: number; label: string } | null>(null)
  const [notice, setNotice] = useState('')
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [editedSinceExport, setEditedSinceExport] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const errors = attempted ? validateStep(data, step) : {}
  const Icon = icons[step]
  const readiness = getReadiness(data)
  const completed = readiness.filter(r => r.done).length

  useEffect(() => {
    if (expanded && !dialogRef.current?.open) dialogRef.current?.showModal()
    if (!expanded && dialogRef.current?.open) dialogRef.current.close()
  }, [expanded])

  function update(next: Resume) {
    setData(next); setUndo(null); setConfirmed(false); setNotice('')
    if (exported) setEditedSinceExport(true)
  }
  function remove(next: Resume, label: string) {
    setUndo({ data, step, label }); setData(next); setConfirmed(false); setNotice('')
    if (exported) setEditedSinceExport(true)
  }
  function navigate(next: number, showErrors = false) {
    setStep(next); setAttempted(showErrors); setMobilePreview(false); setExpanded(false)
    requestAnimationFrame(() => { headingRef.current?.focus({ preventScroll: true }); headingRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' }) })
  }
  function continueStep() {
    setAttempted(true)
    if (Object.keys(validateStep(data, step)).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    navigate(Math.min(step + 1, 5))
  }
  function applyReplacement(kind: 'reset' | 'sample') {
    setUndo({ data, step, label: kind === 'sample' ? 'Fictional sample loaded' : 'Draft reset' })
    replace(kind === 'sample' ? sampleResume() : emptyResume())
    setConfirmAction(null); setAttempted(false); setConfirmed(false); setExported(''); setNotice(''); setMobilePreview(false)
  }
  function startSample() {
    const hasDraft = JSON.stringify(data) !== JSON.stringify(emptyResume())
    if (hasDraft) setConfirmAction('sample')
    else applyReplacement('sample')
  }
  async function exportPdf() {
    for (let i = 0; i < 5; i++) {
      if (Object.keys(validateStep(data, i)).length) {
        navigate(i, true)
        setNotice('Let’s finish the highlighted details before downloading.')
        return
      }
    }
    if (!getSections(data).length) { navigate(3); setNotice('Add education, experience, skills, or a project so your resume has a story to tell.'); return }
    if (!confirmed) { navigate(5); setNotice('Review your details and confirm they’re accurate before downloading.'); return }
    setExporting(true); setNotice('')
    try {
      const { downloadResume } = await import('./pdf-document')
      const filename = await downloadResume(data)
      setExported(filename); setEditedSinceExport(false)
    } catch {
      setNotice('The PDF couldn’t be created. Your draft is still here. Please try downloading again; if needed, shorten unusually long entries.')
    } finally { setExporting(false) }
  }

  return <div className="career-app" data-ready={ready}>
    <a href="#editor" className="skip-link">Skip to resume editor</a>
    <header className="app-header">
      <a className="brand" href="/" aria-label="Career Canvas home"><img className="brand-logo" src="/career-canvas-mark.svg" alt="" /><span>career<span className="brand-light">canvas</span><small>A LITTLE CLARITY. A LOT OF POSSIBILITY.</small></span></a>
      <div className="header-actions"><span className="save-status" role="status"><CircleCheck />{saveStatus}</span><Button variant="outline" className="sample-button" onClick={startSample} disabled={!ready || exporting}><Sparkles data-icon="inline-start" />Start with sample</Button><Button className="header-download" aria-label="Download PDF" onClick={exportPdf} disabled={!ready || exporting}>{exporting ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <Download data-icon="inline-start" />}<span>Download PDF</span></Button></div>
    </header>
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top"><div className="eyebrow">YOUR NEXT CHAPTER</div><h2>One step at a time.</h2><div className="progress-meta"><span>Your resume journey</span><strong>{step + 1} of 6</strong></div><div className="journey-progress" role="progressbar" aria-label="Current step" aria-valuenow={step + 1} aria-valuemin={0} aria-valuemax={6}><span style={{ width: `${((step + 1) / 6) * 100}%` }} /></div></div>
        <nav className="step-navigation" aria-label="Resume steps">{steps.map((s, i) => <button key={s.title} type="button" className={cn('step-link', step === i && 'active')} onClick={() => navigate(i)} aria-current={step === i ? 'step' : undefined} disabled={!ready || exporting}><span className="step-number">{i < step && !Object.keys(validateStep(data, i)).length ? <Check className="size-4" /> : String(i + 1).padStart(2, '0')}</span><span><strong>{s.title}</strong><small>{s.subtitle}</small></span>{step === i && <ChevronRight className="step-chevron" />}</button>)}</nav>
        <div className="sidebar-bottom"><section className="essentials-card"><div className="essentials-icon"><Lightbulb className="size-4" /></div><h3>Resume essentials</h3><ul><li><Check />Lead with action verbs.</li><li><Check />Quantify when it’s truthful.</li><li><Check />Tailor to your target role.</li><li><Check />Keep it clean and readable.</li></ul><a href="https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/" target="_blank" rel="noopener noreferrer">Inspired by Harvard career guidance<ArrowUpRight /></a></section><div className="device-note"><LockKeyhole /><p>Your story stays yours.<br /><span>Saved only in this browser, on this device. No account needed.</span></p></div><Button variant="ghost" size="sm" onClick={() => setConfirmAction('reset')} disabled={!ready || exporting}><RotateCcw data-icon="inline-start" />Reset draft</Button></div>
      </aside>
      <main className="workspace-main">
        <section className="welcome"><div><div className="welcome-kicker"><span />YOUR EXPERIENCE HAS A STORY TO TELL</div><h1>Your next role starts with<br className="desktop-break" /> a <span>clearer story.</span></h1><p>A thoughtful resume, built around you. Let’s put your best work into words.</p></div><div className="welcome-art" aria-hidden="true"><Asterisk /><span className="art-caption">A fresh start<br />looks good on you.</span></div></section>
        {storageWarning && <Alert variant="destructive" className="mb-5"><AlertTitle>About your local draft</AlertTitle><AlertDescription>{storageWarning}</AlertDescription></Alert>}
        {data.fictional && <div className="sample-banner"><BookOpen className="size-4" /><p><strong>You’re exploring a fictional sample.</strong> All people, organizations, and achievements are examples—not your credentials.</p><Button variant="ghost" size="sm" onClick={() => setConfirmAction('reset')}>Start my own<ArrowRight data-icon="inline-end" /></Button></div>}
        {notice && <Alert className="mb-5" role="alert"><FileText /><AlertDescription>{notice}</AlertDescription></Alert>}
        {exported && <div className="export-success" role="status"><CircleCheck /><div><strong>{editedSinceExport ? 'Your draft has changed since the last download.' : 'Your PDF is ready. Make your next move.'}</strong><p>{exported}{editedSinceExport ? ' · Review and download again for the latest version.' : ' · Download requested. You can edit and export again anytime.'}</p></div><Button variant="ghost" size="icon-sm" aria-label="Dismiss export confirmation" onClick={() => setExported('')}><X /></Button></div>}
        <div className="mobile-view-switch"><span>Step {step + 1} of 6 · {steps[step].short}<small role="status">{saveStatus}</small></span><Button variant="outline" size="sm" onClick={() => setMobilePreview(v => !v)}><Eye data-icon="inline-start" />{mobilePreview ? 'Edit resume' : 'Preview'}</Button></div>
        <div className={cn('editor-layout', mobilePreview && 'show-mobile-preview')}>
          <section className="editor-card" id="editor" aria-label={`${steps[step].short} editor`}>
            <div className="editor-card-top"><span className="step-symbol"><Icon /></span><span className="step-label">STEP {String(step + 1).padStart(2, '0')} <span>/ 06</span></span><Badge variant="secondary">{step === 5 ? 'The final look' : 'Your story, your pace'}</Badge></div>
            <div className="editor-heading"><h2 ref={headingRef} tabIndex={-1}>{headings[step]}</h2><p>{descriptions[step]}</p></div>
            <form ref={formRef} noValidate onSubmit={e => { e.preventDefault(); if (step < 5) continueStep() }} onKeyDown={e => { if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault() }}>
              <fieldset disabled={!ready || exporting} className="editor-fields">
                {step === 0 && <TargetStep data={data} update={update} remove={remove} errors={errors} />}
                {step === 1 && <ContactStep data={data} update={update} remove={remove} errors={errors} />}
                {step === 2 && <ExperienceStep data={data} update={update} remove={remove} errors={errors} />}
                {step === 3 && <EducationStep data={data} update={update} remove={remove} errors={errors} />}
                {step === 4 && <SkillsStep data={data} update={update} remove={remove} errors={errors} />}
                {step === 5 && <ReviewStep data={data} onEdit={i => navigate(i, true)} onExpand={() => setExpanded(true)} onExport={exportPdf} exporting={exporting} confirmed={confirmed} setConfirmed={setConfirmed} />}
              </fieldset>
              <footer className="editor-footer"><Button variant="ghost" type="button" onClick={() => navigate(Math.max(0, step - 1))} disabled={step === 0 || exporting}><ArrowLeft data-icon="inline-start" />Back</Button><span className="footer-helper">{step === 0 ? 'A small first step. A big possibility.' : step < 5 ? 'A little progress is still progress.' : 'Ready when you are.'}</span>{step < 5 ? <Button type="submit" size="lg" disabled={!ready || exporting}>Continue<ArrowRight data-icon="inline-end" /></Button> : <Button type="button" variant="outline" onClick={() => setExpanded(true)}><Eye data-icon="inline-start" />Preview</Button>}</footer>
            </form>
          </section>
          <PreviewPanel data={data} onEdit={navigate} onExpand={() => setExpanded(true)} />
        </div>
        <div className="workspace-footer"><span><ShieldCheck />Private by design. Your draft stays on this device.</span><span>Made for your next chapter<ArrowUpRight /></span></div>
        <div className="mobile-reset"><Button variant="ghost" size="sm" onClick={() => setConfirmAction('reset')} disabled={exporting}><RotateCcw data-icon="inline-start" />Reset draft</Button><a href="https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/" target="_blank" rel="noopener noreferrer">Harvard resume guidance<ArrowUpRight className="size-3" /></a></div>
      </main>
    </div>
    {undo && <div className="undo-notice" role="status"><CheckCheck className="size-4" /><span>{undo.label}</span><Button size="sm" variant="secondary" onClick={() => { replace(undo.data); setStep(undo.step); setConfirmed(false); setUndo(null); setAttempted(false); setExported('') }}>Undo</Button><Button size="icon-sm" variant="ghost" onClick={() => setUndo(null)} aria-label="Dismiss undo"><X /></Button></div>}
    <AlertDialog open={confirmAction !== null} onOpenChange={open => { if (!open) setConfirmAction(null) }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{confirmAction === 'sample' ? 'Explore a fictional sample?' : 'Start with a fresh canvas?'}</AlertDialogTitle><AlertDialogDescription>{confirmAction === 'sample' ? 'This replaces your current draft with a clearly labeled fictional profile. You can undo until your next edit.' : 'Your saved draft will be replaced with an empty resume on this device. You can undo until your next edit.'}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep my draft</AlertDialogCancel><AlertDialogAction variant={confirmAction === 'reset' ? 'destructive' : 'default'} onClick={() => applyReplacement(confirmAction!)}>{confirmAction === 'sample' ? 'Load fictional sample' : 'Reset draft'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    <dialog ref={dialogRef} className="full-preview-dialog" onCancel={() => setExpanded(false)} onClose={() => setExpanded(false)} aria-labelledby="full-preview-title"><div className="full-preview-header"><div><h2 id="full-preview-title">Your story, on paper.</h2><p>A4 · Classic · Content preview; PDF page breaks may differ.</p></div><Button size="icon" variant="outline" onClick={() => setExpanded(false)} aria-label="Close full preview"><X /></Button></div><div className="full-preview-body"><ResumePaper data={data} onEdit={navigate} full /></div><div className="full-preview-footer"><span>{completed} of {readiness.length} readiness checks met</span><Button onClick={() => { setExpanded(false); navigate(5) }}>Review & download<ArrowRight data-icon="inline-end" /></Button></div></dialog>
  </div>
}
