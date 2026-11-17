'use client'

import { ArrowRight, Check, Circle, Download, LoaderCircle, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getReadiness, getSections, steps, validateStep, type Resume } from '@/lib/resume'
import { Tip } from './form-parts'

export function ReviewStep({ data, onEdit, onExpand, onExport, exporting, confirmed, setConfirmed }: { data: Resume; onEdit: (step: number) => void; onExpand: () => void; onExport: () => void; exporting: boolean; confirmed: boolean; setConfirmed: (value: boolean) => void }) {
  const issues = steps.slice(0, 5).flatMap((s, i) => Object.values(validateStep(data, i)).map(message => ({ step: i, title: s.short, message })))
  const words = JSON.stringify(getSections(data)).split(/\s+/).length
  return <div className="review-content">
    <div className="section-intro"><h3>Resume readiness</h3><p>A practical check, not a score. You’re in control of the final details.</p></div>
    <div className="readiness-list">{getReadiness(data).map(item => <button type="button" key={item.label} onClick={() => onEdit(item.step)} className="readiness-item"><span className={item.done ? 'readiness-icon complete' : 'readiness-icon'}>{item.done ? <Check /> : <Circle />}</span><span><strong>{item.label}</strong><small>{item.detail}</small></span><ArrowRight className="size-4" /></button>)}</div>
    {!!issues.length && <section className="review-issues" aria-label="Details to finish"><h3>A few details to finish</h3>{issues.map((issue, i) => <button type="button" key={i} onClick={() => onEdit(issue.step)}><span>{issue.title}: {issue.message}</span><ArrowRight className="size-4 shrink-0" /></button>)}</section>}
    <Button variant="outline" type="button" className="w-full" onClick={onExpand}><Maximize2 data-icon="inline-start" />Open full-page preview</Button>
    <div className="section-intro section-divider"><h3>One last look, then your next move.</h3><p>Check spelling, dates, and links. Aim for 1–2 focused pages; long content may need more. The PDF paginates automatically without clipping.</p>{words > 800 && <p className="length-warning">This draft is getting long. Consider trimming older or less relevant details before downloading.</p>}</div>
    <label className="checkbox-label truth-check"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} /><span>{data.fictional ? 'I understand this is a fictional sample, not my own resume.' : 'I’ve checked that every employer, date, skill, and achievement reflects my real experience.'}</span></label>
    <Button type="button" size="lg" className="download-full" disabled={exporting || !confirmed} onClick={onExport}>{exporting ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <Download data-icon="inline-start" />}{exporting ? 'Preparing your PDF…' : 'Download my resume'}</Button>
    <p className="export-details">Real PDF · Selectable text · No print dialog · Always free</p>
    <Tip title="Designed for clarity, not guarantees">Simple formatting helps people and applicant tracking systems read your resume. No template can guarantee ATS passage or an interview.</Tip>
  </div>
}
