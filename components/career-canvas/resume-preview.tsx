'use client'

import { ArrowUpRight, Check, FileText, Maximize2, Pencil, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { contactLine, getSections, type Resume } from '@/lib/resume'
import { cn } from '@/lib/utils'

export function ResumePaper({ data, onEdit, full = false }: { data: Resume; onEdit?: (step: number) => void; full?: boolean }) {
  const sections = getSections(data)
  const empty = !data.contact.name.trim() && !contactLine(data) && !sections.length
  return <article className={cn('resume-paper', full && 'full-paper')} aria-label="Resume content preview">
    {empty ? <div className="blank-canvas">
      <div className="paper-skeleton" aria-hidden="true"><div className="skeleton-title" /><div className="skeleton-contact" /><div className="skeleton-rule" /><div className="skeleton-heading" />{[90, 100, 78].map((w, i) => <div key={i} style={{ width: `${w}%` }} />)}<div className="skeleton-heading" />{[100, 85, 65].map((w, i) => <div key={i} style={{ width: `${w}%` }} />)}<div className="skeleton-heading" />{[90, 72].map((w, i) => <div key={i} style={{ width: `${w}%` }} />)}</div>
      <div className="blank-canvas-message"><span><FileText /></span><h3>A blank canvas.<br />A world of possibilities.</h3><p>Your resume takes shape here<br />as you tell your story.</p></div>
    </div> : <>
      {data.fictional && <p className="fictional-document">Fictional sample — replace with your own facts</p>}
      <header className="resume-header">
        {data.contact.name.trim() && <h2>{data.contact.name.trim()}</h2>}
        {contactLine(data) && <p>{contactLine(data)}</p>}
        {onEdit && <Button variant="ghost" size="icon-xs" className="paper-edit" onClick={() => onEdit(1)} aria-label="Edit contact details"><Pencil /></Button>}
      </header>
      {sections.map(section => <section className="resume-section" key={section.heading}>
        <div className="resume-section-heading"><h3>{section.heading}</h3>{onEdit && <Button variant="ghost" size="icon-xs" className="paper-edit" onClick={() => onEdit(section.step)} aria-label={`Edit ${section.heading}`}><Pencil /></Button>}</div>
        {section.entries.map((entry, i) => <div key={i} className="resume-entry">
          {entry.title && <h4>{entry.title}</h4>}
          {entry.detail && <p className="resume-entry-detail">{entry.detail}</p>}
          {entry.date && <p className="resume-date">{entry.date}</p>}
          {entry.lines?.map((line, j) => <p key={j}>{line}</p>)}
          {!!entry.bullets?.length && <ul>{entry.bullets.map((bullet, j) => <li key={j}>{bullet}</li>)}</ul>}
        </div>)}
      </section>)}
    </>}
  </article>
}

export function PreviewPanel({ data, onEdit, onExpand }: { data: Resume; onEdit: (step: number) => void; onExpand: () => void }) {
  return <aside className="preview-panel" aria-label="Live resume preview">
    <div className="preview-top"><div><span className="live-dot" /><h2>Live preview</h2></div><Badge variant="outline">A4 · Classic</Badge></div>
    <div className="preview-stage"><div className="preview-toolbar"><span>YOUR STORY, ON PAPER</span><Button variant="ghost" size="icon-sm" aria-label="Open full resume preview" onClick={onExpand}><Maximize2 /></Button></div><div className="paper-scroll"><ResumePaper data={data} onEdit={onEdit} /></div><div className="preview-caption"><Check className="size-3" />Updates as you go<span>Content preview</span></div></div>
    <div className="preview-promise"><ShieldCheck /><div><strong>Made for people. Readable by systems.</strong><p>Simple headings. Selectable text. No distractions.</p></div></div>
    <div className="preview-note"><Sparkles className="size-4" /><p>You bring the experience.<br /><strong>We’ll help you make it shine.</strong></p><ArrowUpRight className="size-5" /></div>
  </aside>
}
